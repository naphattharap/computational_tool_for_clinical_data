from django.shortcuts import render
from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

import pandas as pd

from naphyutils.dataframe import DataFrameUtil
from naphyutils.model import ModelUtils
from naphyutils.pca import PcaUtil
from naphyutils.standardization import PreProcessingUtil
import naphyutils.algorithm_pipeline
from . import views
from .forms import DataFileInputForm
from .algorithms import feature_selection_random_forest_regressor
import constants.const_msg as msg
import numpy as np

MAIN_PAGE = "feature_analysis.html"


def home_hander(request):
    """
    Forward to main page.
    """
   
    return render(request, template_name=MAIN_PAGE)


@csrf_exempt   
def process_data_handler(request):
    """
    Process uploaded data to find 3 features that most relevance to clinical outcomes  
    Result returned in JSON format as following:
        - plot: {data: {x: .., y:.., z: ..., label: ..., column_names: []}}
        - msg_info|msg_error|msg_success|msg_warning| : ....
        
        data_tables: {table1: { table_columns: [..,..] , table_data: [[..]], point_id: [...]}, table2: {...}}
    """
    form = DataFileInputForm(request.POST, request.FILES)
    resp_data = dict();
    # 3D most importance features
    plot = dict()
    # Plot Feature ranking 
    plot_feature_ranking = dict()
    data_tables = dict();
    
    if form.is_valid():
        
        # Get input files
        data_file = form.cleaned_data["data_file"]
        outcomes_file = form.cleaned_data["outcomes_file"]
        
        data_column_header = form.cleaned_data['data_column_header']
        outcomes_column_header = form.cleaned_data['outcomes_column_header']
        
        # Declare empty dataframe to store uploaded data.
        df_data = pd.DataFrame()  # Radiomic Data
        df_outcomes = pd.DataFrame()  # Clinical outcomes
        
        # Convert files to dataframe
        # Check if data contain table header or not.
        # Then select data with/without table header to generate dataframe.

        # Check if both required input files are valid.
        if data_file and outcomes_file:
            # Convert radiomic data to dataframe
            data_column_header_idx = None
            if data_column_header == "on":
                data_column_header_idx = 0
            
            df_data = DataFrameUtil.file_to_dataframe(data_file, header=data_column_header_idx)
            
            # Convert clinical outcomes data to dataframe
            outcomes_column_header_idx = None
            if outcomes_column_header == "on":
                outcomes_column_header_idx = 0
            
            df_outcomes = DataFrameUtil.file_to_dataframe(outcomes_file, header=outcomes_column_header_idx)
            
            # Apply feature selection model to select most 3 relevant features with clinical outcomes
            X_selected, arr_sorted_columns, arr_sorted_importance, arr_cate_columns = feature_selection_random_forest_regressor(df_data, df_outcomes)   
            
            # Prepare result for plotting 3D and grid tables for uploaded data
            # e.g. plot -  selected feature, grids - radiomic, outcomes
            
            # Generate unique id for each row since it is required for slickgrid
            # TODO change unique_ids to patient ID or etc (confirm with Carlos)
            unique_ids = np.arange(0, df_data.shape[0])
            
            plot_data = pd.DataFrame(data=X_selected.values, columns=['x', 'y', 'z'])
            plot_data['label'] = unique_ids
            plot['column_names'] = list(X_selected.columns.values)
            
            # Feature ranking
            plot_feature_ranking['column_names'] = arr_sorted_columns
            plot_feature_ranking['importances'] = arr_sorted_importance
            
            # Data table
            plot["data"] = plot_data.to_json()
            
            # Add column 'id' for slickgrid
            df_data.insert(loc=0, column='id', value=unique_ids)
            data_tables['table1'] = {   'table_data': df_data.to_json(orient='records'), \
                                        'column_names': list(df_data.columns.values), \
                                        'point_id':  str(unique_ids)}
            
            # Original outcomes column names are used for generating group of colorscale button in UI part.
            # original_outcomes_columns = df_outcomes.columns.value
            
            df_outcomes.insert(loc=0, column='id', value=unique_ids)
            data_tables['table2'] = {  'table_data': df_outcomes.to_json(orient='records'), \
                                       'column_names': list(df_outcomes.columns.values), \
                                       'point_id':  str(unique_ids),  # not used in frontend
                                       'cate_columns': arr_cate_columns}
                
        # Prepare response data
        resp_data['plot'] = plot
        resp_data['plot_feature_ranking'] = plot_feature_ranking
        resp_data['data_tables'] = data_tables    
    else:
        
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)
