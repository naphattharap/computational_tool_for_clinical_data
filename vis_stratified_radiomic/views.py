from django.shortcuts import render
from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

import pandas as pd

from services.naphyutils.dataframe import DataFrameUtil
from services.naphyutils.model import ModelUtils
from services.naphyutils.pca import PcaUtil
from services.naphyutils.standardization import PreProcessingUtil
import naphyutils.algorithm_pipeline
from . import views
from .forms import VisInputForm
import constants.const_msg as msg

MAIN_PAGE = "vis_stratified_radiomic.html"


# Create your views here.
def home_hander(request):
    """
    Forward to main page.
    """
   
    return render(request, template_name=MAIN_PAGE)


@csrf_exempt   
def process_data_handler(request):
    """
    Get data for analysis and general information
    Result format
        plot: {original_data: {x: .., y:.., label: ...},
              new_data: {x:..., y:..., label:...}
              data_table: {table_columns: ..., table_data: ...}}
        msg_info|msg_error|msg_success|msg_warning| : ....
        
        data_tables: {table1: { table_columns: [..,..] , table_data: [[..]], point_id: [...]}, table2: {...}}
    """
    form = VisInputForm(request.POST, request.FILES)
    resp_data = dict();
    plot = dict()
    data_tables = dict();
    if form.is_valid():
        data_file = form.cleaned_data["data_file"]
        label_file = form.cleaned_data["label_file"]
        add_data_file = form.cleaned_data["add_data_file"]
        predict_data_file = form.cleaned_data["new_data_file"]
        general_data_file = form.cleaned_data["general_data_file"]
        
        data_column_header = form.cleaned_data['data_column_header']
        add_data_column_header = form.cleaned_data['add_data_column_header']
        label_column_header = form.cleaned_data['label_column_header']
        new_data_column_header = form.cleaned_data['new_data_column_header']
        general_data_column_header = form.cleaned_data['general_data_column_header']
        
        df_data = pd.DataFrame()  # Original data space
        df_label = pd.DataFrame()  # Label of original data
        df_add_data = pd.DataFrame()  # Additional data for base space
        df_new_data = pd.DataFrame()  # New data to predict
        df_general_info = pd.DataFrame()  # General info
        
        # Check if data contain table header or not.
        # Then select data with/without table header to generate dataframe.
        df_X_ori2d = None
        data_column_header_idx = None
        if data_file:
            
            if data_column_header == "on":
                data_column_header_idx = 0
            df_data = DataFrameUtil.file_to_dataframe(data_file, header=data_column_header_idx)
            # Reduce dimension for visualization
            X_scaled = PreProcessingUtil.fit_transform(df_data)
            X_ori2d = PcaUtil.reduce_dimension(X_scaled, n_components=2)
            # Convert result to resulting dataframe
            df_plot_original = pd.DataFrame(data=X_ori2d, columns=['x', 'y'])
        
        df_y_ori = None  
        if label_file:
            label_column_header_idx = None
            if label_column_header == "on":
                label_column_header_idx = 0
            df_label = DataFrameUtil.file_to_dataframe(label_file, header=label_column_header_idx)   
            # df_y_ori = pd.DataFrame(data=df_label.values, columns=['label'])
        
        # Process additional data for data table
        
        df_add_data_id = pd.DataFrame()  # For unique ID to add to data point
        if add_data_file:
            add_data_column_header_idx = None
            if add_data_column_header == "on":
                add_data_column_header_idx = 0
            df_add_data = DataFrameUtil.file_to_dataframe(add_data_file, header=add_data_column_header_idx)
            df_add_data_id = df_add_data.iloc[:, 0]
       
        # Join base space X, y ==> label, x coordinate, y coordinate
        df_plot_original['label'] = df_label;
        
        # Optional: Add unique key to data point
        if not df_add_data_id.empty:
            # Join id at the first column to format of: point_id, label, x, y
            # df_add_data_id = pd.DataFrame(data=df_add_data_id.values, columns=['point_id'])
            df_plot_original['point_id'] = df_add_data_id.values
            # df_plot_original = df_add_data_id.join(df_plot_original)
        
        # point_id, label, x, y
        plot["original_data"] = df_plot_original.to_json()
        # For SlickGrid format
        plot["original_data_split"] = df_plot_original.to_json(orient='columns')
        
        # ========== End of processing original data for data point ======
           
        # Convert additional data to dataframe --> json response 
        df_plot_predict = pd.DataFrame()
        # If new data file is uploaded, predict the data and add to plot
        if predict_data_file:
            new_column_header_idx = None
            if label_column_header == "on":
                label_column_header_idx = 0
            df_new_data = DataFrameUtil.file_to_dataframe(predict_data_file, header=new_column_header_idx)   
            # Process data with pipeline of selected algorithm
            X_new_scaled, y_predict = predict_new_data(df_new_data)
            X_new2d = PcaUtil.reduce_dimension(X_new_scaled, n_components=2)
            df_plot_predict = pd.DataFrame(data=X_new2d, columns=['x', 'y'])
            df_plot_predict['label'] = y_predict
            # If additional info for predict data is uploaded, get ID from the file
            plot['new_data'] = df_plot_predict.to_json()
        
        # If additional info for predicting data is uploaded
        # Update new_data with point_id to get data in format of
        # point_id, label, x, y
        df_predict_data_info = pd.DataFrame()
        df_predict_data_id = pd.DataFrame()
        if general_data_file:
            general_data_column_header_idx = None
            if general_data_column_header == "on":
                general_data_column_header_idx = 0
            
            df_predict_data_info = DataFrameUtil.file_to_dataframe(general_data_file, header=general_data_column_header_idx)
            # Optional: Add unique key to data point
            # Join id at the first column to point_id, label, x, y
            # df_predict_data_id = pd.DataFrame(data=df_predict_data_info.iloc[:, 0].values, columns=['point_id'])
            # df_plot_predict = df_predict_data_id.join(df_plot_predict)
            df_plot_predict['point_id'] = data = df_predict_data_info.iloc[:, 0].values
            
            plot['new_data'] = df_plot_predict.to_json()
        
        # =========== End of Processing Predict Data =========
        
        # df_data_table.append(df_add_data, ignore_index=True)
        
        # data_table['rediomic_columns'] = df_data.columns.tolist()
        # data_table['rediomic_data'] = df_data.values
        
        if not df_predict_data_info.empty:
            # append general info of new data to based space
            df_add_data = df_add_data.append(df_predict_data_info)
        
        # Prepare data for visualize
        resp_data['plot'] = plot
        
        if not df_add_data_id.empty:
            data_tables['table1'] = {  # 'table_columns': df_data.columns.tolist(), \
                                  'table_data': df_data.to_json(orient='records'), \
                                  'point_id':  df_add_data.iloc[:, 0].to_json(orient='values')}
        else:
            data_tables['table1'] = {  # 'table_columns': df_data.columns.tolist(), \
                                      'table_data': df_data.to_json()}
        
        if not df_add_data.empty:
            # For SlickGrid use orient='records'
            # Format point_id: [{..}, {..}]
            df_add_data['id'] = df_add_data.iloc[:, 0].values
            # Slickgrid does not support column with dot like "f.eid"
            df_add_data.rename(columns={'f.eid': 'f:eid'}, inplace=True)
            data_tables['table2'] = { 'table_data': df_add_data.to_json(orient='records'), \
                                     'point_id': df_add_data.iloc[:, 0].to_json(orient='values')}
            
        resp_data['data_tables'] = data_tables
    else:
        
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)


def predict_new_data(df_new_data):
    """
    Test algorithm
    """
    # TODO change this algorithm to final algo
#     array_pipeline = [PIPELINE_SCALE, PIPELINE_SVM_OVO, PIPELINE_K_FOLD, PIPELINE_PCA]
#     parameters = dict()
#     parameters['n_folds'] = 5 
#     parameters['pca_n_components'] = 2
    model = ModelUtils.load_model(model_file_name="uci_breast_cancer_svmovo3.joblib")
    # Process data with selected algorithm pipeline
    X_new_scaled = PreProcessingUtil.fit_transform(df_new_data)  
    y_predict = model.predict(X_new_scaled)
    
    return X_new_scaled, y_predict
    

def vis_dashboard_handler(request):
    
    return render(request, template_name=MAIN_PAGE)
