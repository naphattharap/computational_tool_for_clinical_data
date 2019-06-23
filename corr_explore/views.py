from django.shortcuts import render
from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal, ROUND_HALF_UP
import numpy as np
import pandas as pd

from services.naphyutils.dataframe import DataFrameUtil
from services.naphyutils.model import ModelUtils
from services.naphyutils.feature_selection import FeatureSelectionUtil
from services.naphyutils.biz_exception import BizValidationExption
from . import views
from .forms import FormUploadFile, FormStratifyData, DimensionReductionForm, FeatureSelectionForm
from naphyutils.framingham import FraminghamRiskScore
from .helpers import Helper
import constants.const_msg as msg
# from framingham import framingham_cvd_score_gender

from sklearn.preprocessing import MinMaxScaler

import sys, traceback

# Path under template folder

MAIN_PAGE = "corr_explore.html"


def home_hander(request):
    """
    Forward to main page.
    """
   
    return render(request, template_name=MAIN_PAGE)


def stratify_data(request):
    
    # Init response data
    resp = dict();

    form = FormStratifyData(request.POST, request.FILES)
    # If form is valid, continue processing
    if form.is_valid():
         # Get parameter from form through cleaned_data to get correct data type
      
        target_strat = form.cleaned_data['target_strat']
        feature_indexes = form.cleaned_data['feature_indexes']
        numtypes = form.cleaned_data['numtypes']  # format: 'INTERVAL', 'NOMINAL', ...
        bins = form.cleaned_data['bin']  # format: 'INTERVAL', 'NOMINAL', ...
        criterion = form.cleaned_data['criterion']  # Format Male,Female&1938,1969&45,104&50,112 
        groupby = form.cleaned_data['groupby']  
        # str_calc_framingham = form.cleaned_data['is_calc_framingham']
        target_action = form.cleaned_data['target_action']
        # For XG Boost Regressor
        target_labels = form.cleaned_data['target_labels']
        n_feature_selection = form.cleaned_data['n_feature_selection']
        
        is_calc_framingham = False
        if target_action == "framingham":
            is_calc_framingham = True
       
        arr_sel_source_col = feature_indexes.split(",")
        arr_sel_target_col = target_strat.split(",")
        arr_groupby = groupby.split(",")
        arr_numtype = numtypes.split(",")
        arr_bin = bins.split(",")
        arr_target_labels = target_labels.split(",")
        
        if all('' == s or s.isspace() for s in arr_sel_target_col):
            form._errors["Include"] = form.error_class(["Target columns to group data must be selected."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # Validate group by, if all group by values are space, show error
        source_col_indexes = None
        if (target_action == 'stratify' or target_action == 'framingham'):
            if all('' == s or s.isspace() for s in arr_sel_source_col):
                form._errors["Features"] = form.error_class(["Please select features"])
                resp[msg.ERROR] = escape(form._errors)
                return JsonResponse(resp)
            
            elif all('' == s or s.isspace() for s in arr_groupby):
                form._errors["Group By"] = form.error_class(["Group By must be entered."])
                resp[msg.ERROR] = escape(form._errors)
                return JsonResponse(resp)
                        # If group by is not empty and number is interval number, but Bin is empty.
            # Validate bin
            for row_idx in range(0, len(arr_groupby)):
                if arr_groupby[row_idx] != ""  \
                    and (arr_numtype[row_idx] == "INTERVAL" or arr_numtype[row_idx] == "ORDINAL") \
                    and arr_bin[row_idx] == "":
                    form._errors["Bin"] = form.error_class(["Number of Bin must be entered when group by an interval number."])
                    resp[msg.ERROR] = escape(form._errors)
                    return JsonResponse(resp)
            # Convert source column to int
            source_col_indexes = list(map(int, arr_sel_source_col)) 
        
        # print(feature_indexes, "/", criterion)
        df_source, df_target = get_source_target_dataframe(form)

        # Validate both source and target row
        if df_source.shape[0] != df_target.shape[0] or not (df_target.shape[0] > 0): 
            form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # Process data with the criterions
        arr_criterion = criterion.split("&")
        arr_groupby = groupby.split(",")
        
        target_col_indexes = list(map(int, arr_sel_target_col))
       
        try:
            arr_traces = None
            if target_action == "stratify":  # target_action == "feature_variance"
                arr_traces = Helper.startify_mean(df_source, df_target, source_col_indexes, target_col_indexes, arr_numtype, \
                                               arr_criterion, arr_bin, arr_groupby, target_calculation="mean")
                # If the target result is for plotting variance of stratified result
                # continue to calculate variance bar
                # if target_action == "feature_variance":
                arr_name, arr_value = get_strat_variance(arr_traces)
                resp['feature_variances'] = {'features': arr_name, 'values': arr_value}
                
                resp['traces'] = arr_traces
            elif target_action == "framingham":
                
                arr_traces = Helper.startify_mean(df_source, df_target, source_col_indexes, target_col_indexes, arr_numtype, \
                                               arr_criterion, arr_bin, arr_groupby, target_calculation="framingham")
                resp['traces'] = arr_traces
            elif target_action == "xgboost":
                # Select all features for df_source to find feature by xgboost
                # Source
                # arr_selected_source_col = list(df_source.columns)
                # Target
                int_target_filter_col_idx = list(map(int, arr_sel_target_col))
                df_selected_target = df_target.iloc[:, int_target_filter_col_idx]
                arr_selected_target_col = list(df_selected_target.columns)
                # Join
                df_data = df_source.join(df_selected_target)
               
                # Filter by column name in  arr_selected_target_col
                df_strat_res = Helper.get_filtered_data(df_data, arr_numtype, arr_selected_target_col, arr_criterion)
                
                # split radiomic and target label after filter
                df_res_source = df_strat_res.loc[:, df_source.columns]
                # get target
                
                int_target_fs_col_idx = list(map(int, arr_target_labels))
                arr_fs_target_col = df_target.iloc[:, int_target_fs_col_idx].columns
                df_fs_target = df_strat_res.loc[:, arr_fs_target_col]
                
                # Select only type of number of selected target label to use for xgboost model 
                # NORMILAL uses XGBoostClassifer, otherwise XGBoostRegressor
                arr_numtype_flag = []
                for t_label_idx in arr_target_labels:
                    numpty_idx = arr_sel_target_col.index(t_label_idx)
                    arr_numtype_flag.append(arr_numtype[numpty_idx])
                
                arr_fs_col_name, arr_fs_col_idx, train_score, test_score, dup_feature_names = FeatureSelectionUtil.select_by_xgboost(df_res_source, df_fs_target, arr_numtype_flag, n_feature_selection)
                # round_train_score = Decimal(str(train_score)).quantize(Decimal('1.11'), rounding=ROUND_HALF_UP) * 100
                # round_test_score = Decimal(str(test_score)).quantize(Decimal('1.11'), rounding=ROUND_HALF_UP) * 100
                # Convert type of arr_fs_col_idx to int to solve JSON error
                resp['feature_selection'] = {'col_name': list(arr_fs_col_name), 'col_idx': list(map(int, arr_fs_col_idx)),
                                             'train_score': train_score, 'test_score': test_score, "duplicated_features": dup_feature_names}
                # resp['sorted_important_indexes'] = list(sorted_indexes)
                # resp['sorted_important_col_names'] = list(arr_sorted_columns)
    
        except BizValidationExption as be:
            label, err_msg = be.args
            resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
        except Exception as e:
            
           # Print error to console
            exc_type, exc_value, exc_traceback = sys.exc_info()
#             print(repr(traceback.format_tb(exc_traceback)))
#             print(traceback.format_exception(exc_type, exc_value,
#                                           exc_traceback))
            traceback.print_exc(limit=10, file=sys.stdout)
            # Return error
            len_args = len(e.args)
            if len_args == 2:
                label, err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
            else:
                err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg("", err_msg[0]))
                
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def select_features(request):
    """
    Perform feature selection on uploaded source data file and selected target column for label.
    """
    
    # Init response data
    resp = dict();

    form = FeatureSelectionForm(request.POST, request.FILES)
    # If form is valid, continue processing
    if form.is_valid():
        str_label_column_index = form.cleaned_data['label_column_index']
        str_n_features = form.cleaned_data['n_features']
        numtypes = form.cleaned_data['numtypes']
        algorithm = form.cleaned_data['algorithm']
        
        label_column_index = int(str_label_column_index)
        n_features = int(str_n_features)
        arr_numtypes = numtypes.split(",");
        numtype = arr_numtypes[label_column_index]
        df_source, df_target = get_source_target_dataframe(form)
         # get single label
        df_y = df_target[[df_target.columns.values[label_column_index]]].copy()
        if algorithm == "RANDOMFOREST":
            X_new, arr_sorted_columns, arr_sorted_val, sorted_indexes = FeatureSelectionUtil.select_by_random_forest_regressor(df_source, df_y, n_features, numtype)
            resp['sorted_important_indexes'] = list(sorted_indexes)
            resp['sorted_important_col_names'] = list(arr_sorted_columns)
        elif algorithm == "XGBOOST":
            selected_features = FeatureSelectionUtil.select_by_xgboost_regressor(df_source, df_y, n_features)
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def reduce_dimension(request):
    """
        Filter data by all selected criterion.
        In case of PCA is the target algorithm, the selected label will be used as for labelling only.
        In case of PCA - LDA is selected, the label will be used as label for clustering predictors.
        Result is return for 3D plot.
        
    """
    # Init response data
    resp = dict();
    
    form = DimensionReductionForm(request.POST, request.FILES)
    # If form is valid, continue processing
    if form.is_valid():
        # Target columns used for filtering data
        target_strat = form.cleaned_data['target_strat']
        feature_indexes = form.cleaned_data['feature_indexes']
        target_label_index = form.cleaned_data['column_index']  # single value
        dimalgo = form.cleaned_data['dim_algo'] 
        
         # Array value for stratification
        numtypes = form.cleaned_data['numtypes'] 
        
        # String Format ==> Male,Female&1938,1969&45,104&50,112
        criterion = form.cleaned_data['criterion']  
       
        df_source, df_target = get_source_target_dataframe(form);

        # ======= Validation ===========
        arr_feature_indexes = feature_indexes.split(",");
        n_selected_features = len(arr_feature_indexes)
        if n_selected_features < 3:
            form._errors["Number of selected features"] = form.error_class(["Number of selected features must be equal or greater than 3 for 3D space."])
        
        # Validate both source and target row
        if df_source.shape[0] != df_target.shape[0] or not (df_target.shape[0] > 0): 
            form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])

        if not form.is_valid():
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # Info message
        if n_selected_features == 3: 
            resp[msg.WARNING] = escape(format_html_err_msg("Reduce dimension", "System cannot reduce dimension when number of features are 3."))
        
        # Process request data
        arr_target_filter_col = target_strat.split(",")
        arr_criterion = criterion.split("&")
        arr_numtypes = numtypes.split(",")

        # target_label_index is not used for now because it's PCA
        n_components = 3
        try:
            dim_3d, label = Helper.get_reduced_dim_data(df_source, df_target, feature_indexes,
                                            target_label_index, arr_target_filter_col,
                                            arr_numtypes, arr_criterion,
                                            dimalgo, n_components)
            
            # Find index of select target label
            int_target_label_index = arr_target_filter_col.index(target_label_index)
            numtype = arr_numtypes[int_target_label_index]
#             if df_target.iloc[:, int_target_label_index].dtype == 'object':
#                 numtype = "ORDINAL"
#             else:
#                 numtype = "INTERVAL"
                    
            resp['plot_data'] = {'x': list(dim_3d[:, 0]), 'y': list(dim_3d[:, 1]), 'z': list(dim_3d[:, 2]), 'label': label.ix[:, 0].to_json(), 'number_type': numtype}
            
            return JsonResponse(resp)
        
        except BizValidationExption as be:
            label, err_msg = be.args
            resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
        except Exception as e:
           # Print error to console
            exc_type, exc_value, exc_traceback = sys.exc_info()
            traceback.print_exc(limit=10, file=sys.stdout)
            # Return error
            len_args = len(e.args)
            if len_args == 2:
                label, err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
            else:
                err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg("", err_msg[0]))
    
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def framingham_radiomics(request):
    """
    Plot correlation between Framingham Score and Radiomics
    - Filter data by criterion
    - Group data
    - Calculate framing risk score for individial
    - Find correlation 
    """
    # Init response data
    resp = dict();
    form = FormStratifyData(request.POST, request.FILES)
    
    # If form is valid, continue processing
    if form.is_valid():
         # Get parameter from form through cleaned_data to get correct data type
         
         # String contains column index of row in criterion table
        target_strat = form.cleaned_data['target_strat']
        # String contains Radiomics feature index
        feature_indexes = form.cleaned_data['feature_indexes']
        numtypes = form.cleaned_data['numtypes']  # format: 'INTERVAL', 'NOMINAL', ...
        criterion = form.cleaned_data['criterion']  # Format Male,Female&1938,1969&45,104&50,112
        # bins = form.cleaned_data['bin']  # format: 'INTERVAL', 'NOMINAL', ...
        
        # groupby = form.cleaned_data['groupby']  

        # Split string input to array
        # Radiomics feature
        arr_sel_source_col = feature_indexes.split(",")
        # Criterion
        arr_criterion_value = criterion.split("&")
        arr_sel_target_col = target_strat.split(",")
        arr_numtypes = numtypes.split(",")
        # arr_groupby = groupby.split(",")
        # arr_bin = bins.split(",")

        # ========== Validation ========== 
        # Features must be selected
        source_col_indexes = None
        if all('' == s or s.isspace() for s in arr_sel_source_col):
            form._errors["Features"] = form.error_class(["Please select features"])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # Criterion Row: Selected row in criterion can't be empty.
        if all('' == s or s.isspace() for s in arr_sel_target_col):
            form._errors["Include"] = form.error_class(["Target columns to group data must be selected."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
    
        # Group By: Validate group by, if all group by values are space, show error
#         if all('' == s or s.isspace() for s in arr_groupby):
#             form._errors["Group By"] = form.error_class(["Group By must be entered."])
#             resp[msg.ERROR] = escape(form._errors)
#             return JsonResponse(resp)
        # If group by is not empty and number is interval number, but Bin is empty.
        
        # Validate bin: Valid when group by interval 
#         for row_idx in range(0, len(arr_groupby)):
#             if arr_groupby[row_idx] != ""  \
#                 and (arr_numtype[row_idx] == "INTERVAL" or arr_numtype[row_idx] == "ORDINAL") \
#                 and arr_bin[row_idx] == "":
#                 form._errors["Bin"] = form.error_class(["Number of Bin must be entered when group by an interval number."])
#                 resp[msg.ERROR] = escape(form._errors)
#                 return JsonResponse(resp)
        
        # Convert feature index column from string to int
        source_col_indexes = list(map(int, arr_sel_source_col)) 
        
        # Get dataframe from source and target files
        df_source, df_target = get_source_target_dataframe(form)

        # Validate both source and target row
        if df_source.shape[0] != df_target.shape[0] or not (df_target.shape[0] > 0): 
            form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        target_col_indexes = list(map(int, arr_sel_target_col))
       
        try:
            # Filter data 
            # Select only the selected source columns in radiomics
            df_selected_source = Helper.get_selected_columns_data(df_source, feature_indexes)
            df_selected_target = Helper.get_selected_columns_data(df_target, target_strat)
           
            df_data = df_selected_source.join(df_selected_target)
            arr_criterion_column_names = list(df_selected_target.columns)
            
            FraminghamRiskScore.validate_csv_column_for_framingham(df_selected_target,
                                                                   FraminghamRiskScore.FMH_CVD_COLUMNS)
            
            df_filtered_data = Helper.get_filtered_data(df_data, arr_numtypes, arr_criterion_column_names, arr_criterion_value)
            
            # Calculate individual FHM
            n_rows = df_filtered_data.shape[0]
            # Create new column to store risk score
            df_filtered_data['FMH'] = np.nan
            
            for row in range(0, n_rows):
                sex, age, systolic_blood_pressure, smoking_status, treat_bp, bmi, diabetes = FraminghamRiskScore.get_cvd_factors(df_filtered_data, row)
                risk_score = FraminghamRiskScore.framingham_cvd_risk_score(sex, age, systolic_blood_pressure, smoking_status, treat_bp, bmi, diabetes) 
                df_filtered_data.loc[row, ['FMH']] = risk_score
            
            # Find correlation for radiomics and FMH
            corr_col_name = list(df_selected_source.columns.values)
            corr_col_name.append('FMH')
            df_corr = df_filtered_data[corr_col_name]
            corr = df_corr.corr()
            len_exc_fmh = corr.shape[0] - 1 
            corr_fmh_val = corr[['FMH']].values[0:len_exc_fmh].ravel()
            arr_index_names = corr[['FMH']].index.values[0:len_exc_fmh]
            
            arr_name, arr_value = Helper.sort_max_min(arr_index_names, corr_fmh_val)
            corr_res = dict()
            corr_res['values'] = arr_value
            corr_res['index_names'] = arr_name
            resp['framingham_radiomics_corr'] = corr_res
        except BizValidationExption as be:
            label, err_msg = be.args
            resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
        except Exception as e:
           # Print error to console
            exc_type, exc_value, exc_traceback = sys.exc_info()
            traceback.print_exc(limit=10, file=sys.stdout)
            # Return error
            len_args = len(e.args)
            if len_args == 2:
                label, err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg(label, err_msg))
            else:
                err_msg = e.args
                resp[msg.ERROR] = escape(format_html_err_msg("", err_msg[0]))
                
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def get_source_target_dataframe(form):
    
    source_file = form.cleaned_data["source_file"]
    target_file = form.cleaned_data["target_file"]
    df_source = DataFrameUtil.file_to_dataframe(source_file, header=0)
    df_target = DataFrameUtil.file_to_dataframe(target_file, header=0)
#     source_column_header = form.cleaned_data['source_column_header']
#     target_column_header = form.cleaned_data['target_column_header']
#            
#     df_source = pd.DataFrame()  # Source file
#     df_target = pd.DataFrame()  # Target file
#     
#     if source_file:
#         # Check if data contains header
#         source_column_header_idx = None
#         if source_column_header == "on":
#             source_column_header_idx = 0
#             
#         df_source = DataFrameUtil.file_to_dataframe(source_file, header=source_column_header_idx)
#         
#     if target_file:
#         # Check if data contains header
#         target_column_header_idx = None
#         if target_column_header == "on":
#             target_column_header_idx = 0
#             
#         df_target = DataFrameUtil.file_to_dataframe(target_file, header=target_column_header_idx)
#          
    return  df_source, df_target


def get_strat_variance(arr_traces):
    """
    arr_traces: Array of traces which is dict object with following key structure 
            trace['trace_name'] => used
            trace['x_labels']
            trace['y_values']  => used
            trace['n_group_member']
            trace['framingham_risk_score']
    Logic:
        Data of each group (trace) is from stratified data for one radiomics feature.  
            Scale all values from each data group to [0,1] scale 
            Find variance of each group
        When finish variance calculation for all groups,
            Find percentile then sorted from max to min. 
    """
    
    arr_temp_trace_name = []
    arr_y_values = []
    for trace in arr_traces:
        arr_temp_trace_name.append(trace.get('trace_name'))
        arr_y_values.append(trace.get('y_values'))
        
    # Default range is 0, 1
    scaler = MinMaxScaler()
    # To do min max scaler need to do (1,n) for each group data
    is_first_obj = True
    arr_val_scaled = None
    arr_variance = []
    for group_var in arr_y_values:
        arr_group_scaler = np.array(group_var)
        min_max_scaled = scaler.fit_transform(arr_group_scaler[:, np.newaxis])
        # Find variance => var = mean(abs(x - x.mean())**2)
        arr_variance.append(np.var(min_max_scaled, axis=0)[0])
#         if is_first_obj:
#             arr_val_scaled = min_max_scaled
#         else:
#             arr_val_scaled = np.append(arr_val_scaled, min_max_scaled, axis=0)

    # min_max_index = np.argsort()
#     min_max_idx = np.argsort(arr_variance)
#     max_min_idx = min_max_idx[::-1]
#     # argsort(axis=0).argsort(axis=0)
#     # max_min_index = np.fliplr(min_max_index)
#     
#     # prepare result for x, y
#     arr_name = []
#     arr_value = []
#     for idx in max_min_idx:
#         arr_name.append(arr_temp_trace_name[idx])
#         arr_value.append(arr_variance[idx])
    arr_name, arr_value = Helper.sort_max_min(arr_temp_trace_name, arr_variance)
    return arr_name, arr_value


def framingham_cvd1(df_source, df_target, feature_indexes, label_indexes, arr_numtypes, arr_criterions):
    # Filter data by condition
    # Get target source column name for calc radiomics mean
    df_selected_source = df_source.iloc[:, feature_indexes]
    arr_selected_source_col_name = list(df_selected_source.columns)
    
    # Get target column name for filtering data by condition
    df_selected_target = df_target.iloc[:, label_indexes]
    arr_criterion_col_name = list(df_selected_target.columns)
    
    # Join data together as input of filter
    df_data = df_selected_source.join(df_selected_target)
#     arr_int_target_col_idx = list(map(int, arr_sel_target_col))
    
    # Filter by column name in  arr_selected_target_col
    df_strat_res = Helper.get_filtered_data(df_data, label_indexes, \
                                            arr_criterion_col_name, \
                                            arr_numtypes, arr_criterions)
    
    result = framingham_cvd_score_gender(df_source, arr_selected_source_col_name)
    return result


def get_source_target(request):
    """
    The function is called via AJAX and return JSON as result.
    Return result structure:
        resp.data.feature_columns : Array of string for feature columns from source file
        resp.data.criterions : Array of objects (dict) for rendering criterion table
            |- object: { column_label: 'string', 
                        number_type: 'INTERVAL' | 'NOMINAL' | 'ORDINAL',
                        nominal_values: 'FEMALE' | 'MALE', # for example
                        min: 1,        # only valid when number type is 'ORDINAL' or 'INTERVAL'
                        max: 9999      # only valid when number type is 'ORDINAL' or 'INTERVAL'
                        }
    
    """
    # Validate data
    form = FormUploadFile(request.POST, request.FILES)
    
    # Init response data
    resp = dict();
    data = dict();
    resp['data'] = data
    
    # If form is valid, continue processing
    if form.is_valid():
        # Get parameter from form through cleaned_data to get correct data type
        df_source, df_target = get_source_target_dataframe(form)
        
        # Validate both source and target row
        if df_source.shape[0] != df_target.shape[0]: 
            form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)  
          
        data['feature_columns'] = list(df_source.columns)
            
        arr_criterion = Helper.get_criterion_data(df_target)
        data['criterions'] = arr_criterion  
        
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def format_html_err_msg(label, msg):
    if label != "" and msg != "":
        return '<ul class="errorlist"><li>' + label \
                +'<ul class="errorlist"><li>' \
                +msg + "</li></ul></li></ul>"
    else:
        return '<ul class="errorlist"><li>' + msg + '</li></ul>'
                # +'<ul class="errorlist"><li>' \
               
                # '</li></ul>'
    # return '<strong>hey</strong>'
