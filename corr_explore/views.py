from django.shortcuts import render
from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

import numpy as np
import pandas as pd

from services.naphyutils.dataframe import DataFrameUtil
from services.naphyutils.model import ModelUtils
from services.naphyutils.feature_selection import FeatureSelectionUtil
from services.naphyutils.biz_exception import BizValidationExption
from . import views
from .forms import FormUploadFile, FormStratifyData, DimensionReductionForm, FeatureSelectionForm
from .helpers import Helper
import constants.const_msg as msg

from sklearn.preprocessing import MinMaxScaler

import sys, traceback

# Path under template folder

MAIN_PAGE = "corr_explore.html"


def home_hander(request):
    """
    Forward to main page.
    """
   
    return render(request, template_name=MAIN_PAGE)


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
        
        is_calc_framingham = False
        if target_action == "framingham":
            is_calc_framingham = True
        
        arr_sel_target_col = target_strat.split(",")
        arr_sel_source_col = feature_indexes.split(",")
        arr_groupby = groupby.split(",")
        arr_numtype = numtypes.split(",")
        arr_bin = bins.split(",")
        
        if all('' == s or s.isspace() for s in arr_sel_target_col):
            form._errors["Include"] = form.error_class(["Target columns to group data must be selected."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # Validate group by, if all group by values are space, show error
        if all('' == s or s.isspace() for s in arr_groupby):
            form._errors["Group By"] = form.error_class(["Group By must be entered."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        else:
            # If group by is not empty and number is interval number, but Bin is empty.
            # Show error
            for row_idx in range(0, len(arr_groupby)):
                if arr_groupby[row_idx] != ""  \
                    and (arr_numtype[row_idx] == "INTERVAL" or arr_numtype[row_idx] == "ORDINAL") \
                    and arr_bin[row_idx] == "":
                    form._errors["Bin"] = form.error_class(["Number of Bin must be entered when group by an interval number."])
                    resp[msg.ERROR] = escape(form._errors)
                    return JsonResponse(resp)
        
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
        try:
            
            arr_traces = Helper.startify_mean(df_source, df_target, arr_sel_source_col, arr_sel_target_col, arr_numtype, \
                                               arr_criterion, arr_bin, arr_groupby, is_calc_framingham)
            
            # If the target result is for plotting variance of stratified result
            # continue to calculate variance bar
            if target_action == "feature_variance":
                arr_name, arr_value = get_strat_variance(arr_traces)
                resp['feature_variances'] = {'features': arr_name, 'values': arr_value}
                
            resp['traces'] = arr_traces
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
            err_msg = e.args
            resp[msg.ERROR] = escape(format_html_err_msg("", err_msg[0]))
                
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
        df_y = df_target[[df_target.columns.values[label_column_index]]].copy()
        if algorithm == "RANDOMFOREST":
            X_new, arr_sorted_columns, arr_sorted_val, sorted_indexes = FeatureSelectionUtil.select_by_random_forest_regressor(df_source, df_y, n_features, numtype)
            resp['sorted_important_indexes'] = list(sorted_indexes)
            resp['sorted_important_col_names'] = list(arr_sorted_columns)
        elif algorithm == "XGBOOST":
            pass
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
        pca_feature_indexes = form.cleaned_data['pca_feature_indexes']
        target_label_index = form.cleaned_data['column_index']  # single value
        dimalgo = form.cleaned_data['dim_algo']  # Hardcode for PCA for now
        
         # Array value for stratification
        numtypes = form.cleaned_data['numtypes'] 
        
        # String Format ==> Male,Female&1938,1969&45,104&50,112
        criterion = form.cleaned_data['criterion']  
       
        df_source, df_target = get_source_target_dataframe(form);

        # ======= Validation ===========
        arr_feature_indexes = pca_feature_indexes.split(",");
        n_selected_features = len(arr_feature_indexes)
        if n_selected_features < 3:
            form._errors["Number of selected features"] = form.error_class(["Number of selected features must be equal or greater than 3 for 3D space."])
        
        # Validate both source and target row
        if df_source.shape[0] != df_target.shape[0] or not (df_target.shape[0] > 0): 
            form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])

        # Validate number of selected column if it's less than 3, error
#         if len(pca_feature_indexes.split(",")) < 3: 
#             form._errors["Number of features"] = form.error_class(["Number of selected features must be greater than 3."])
        
        if not form.is_valid():
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
    
#         # ======= Validation ===========
#         if len(FormUploadFile.cleaned_data['pca_feature_indexes'].split(",")) < 3:
#             form._errors["Number of selected features"] = form.error_class(["Number of selected features must be equal or greater than 3 for 3D space."])
#         
#         # Validate both source and target row
#         if df_source.shape[0] != df_target.shape[0] or not (df_target.shape[0] > 0): 
#             form._errors["Number of row data"] = form.error_class(["Row data in files must be equal."])
#             resp[msg.ERROR] = escape(form._errors)
#             return JsonResponse(resp)
#         
#         # Validate number of selected column if it's less than 3, error
#         if len(pca_feature_indexes.split(",")) < 3: 
#             form._errors["Number of features"] = form.error_class(["Number of selected features must be greater than 3."])
#             resp[msg.ERROR] = escape(form._errors)
#             return JsonResponse(resp)
        
        # Process request data
        arr_criterion = criterion.split("&")
        arr_numtypes = numtypes.split(",")
        int_target_label_index = int(target_label_index)
        # label = df_target.iloc[:, int_target_label_index]
        numtype = arr_numtypes[int_target_label_index]  # single value for labeling
        # target_label_index is not used for now because it's PCA
        dim_3d, label = Helper.get_stratify_3d_data(df_source, df_target, pca_feature_indexes, \
                                              target_label_index, arr_numtypes, arr_criterion, dimalgo)
        resp['plot_data'] = {'x': list(dim_3d[:, 0]), 'y': list(dim_3d[:, 1]), 'z': list(dim_3d[:, 2]), 'label': label.ix[:, 0].to_json(), 'number_type': numtype}
        return JsonResponse(resp)
    
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def get_source_target_dataframe(form):
    
    source_file = form.cleaned_data["source_file"]
    target_file = form.cleaned_data["target_file"]
    source_column_header = form.cleaned_data['source_column_header']
    target_column_header = form.cleaned_data['target_column_header']
           
    df_source = pd.DataFrame()  # Source file
    df_target = pd.DataFrame()  # Target file
    
    if source_file:
        # Check if data contains header
        source_column_header_idx = None
        if source_column_header == "on":
            source_column_header_idx = 0
            
        df_source = DataFrameUtil.file_to_dataframe(source_file, header=source_column_header_idx)
        
    if target_file:
        # Check if data contains header
        target_column_header_idx = None
        if target_column_header == "on":
            target_column_header_idx = 0
            
        df_target = DataFrameUtil.file_to_dataframe(target_file, header=target_column_header_idx)
         
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
    val_scaled = scaler.fit_transform(arr_y_values)
    
    # Find variance => var = mean(abs(x - x.mean())**2)
    arr_variance = np.var(val_scaled, axis=1)
    # min_max_index = np.argsort()
    min_max_idx = np.argsort(arr_variance)
    max_min_idx = min_max_idx[::-1]
    # argsort(axis=0).argsort(axis=0)
    # max_min_index = np.fliplr(min_max_index)
    
    # prepare result for x, y
    arr_name = []
    arr_value = []
    for idx in max_min_idx:
        arr_name.append(arr_temp_trace_name[idx])
        arr_value.append(arr_variance[idx])
    
    return arr_name, arr_value
