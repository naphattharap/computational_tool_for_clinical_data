from django.shortcuts import render
from django.views import View
from sklearn.decomposition import PCA
from sklearn import preprocessing
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from diabetes_logic.diabetes_logic import DiabetesLogic
import codecs, json 
from django.core import serializers
from naphyutils.file import FileStorage
from naphyutils.dataframe import DataFrameUtil
from naphyutils.pca import PcaUtil
from naphyutils.file import FileStorage
from naphyutils.standardization import PreProcessingUtil
import numpy as np

from bokeh.plotting import figure
from bokeh.models.widgets import Panel, Tabs, DataTable, DateFormatter, TableColumn
from bokeh.embed import components
from bokeh.models import ColumnDataSource
from bokeh.layouts import widgetbox, layout

import constants.const_msg as msg
from .forms import PcaPlotForm

import pandas as pd


def init_view(request):
    """
    Display home page of PCA
    """
    return render(request, template_name='pca.html')


@csrf_exempt  
def pca_plot(request):
    """
    Display home page of PCA
    """
    form = PcaPlotForm(request.POST, request.FILES)
    resp_data = dict();
    # PCA 3D
    plot = dict()
    
    if form.is_valid():
        # Get input files
        data_file = form.cleaned_data["data_file"]
        df_input = DataFrameUtil.file_to_dataframe(data_file, header=None)
        X, pca = PcaUtil.reduce_dimension(df_input, n_components=3)
        plot['x'] = list(X[:, 0])
        plot['y'] = list(X[:, 1])
        plot['z'] = list(X[:, 2])
        resp_data['plot'] = plot
        # print(resp_data)
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)


@csrf_exempt
def elbow_plot_handler(request):
    form = PcaPlotForm(request.POST, request.FILES)
    resp_data = dict();
    if form.is_valid():
         # Get input files
        data_file = form.cleaned_data["data_file"]
        df_input = DataFrameUtil.file_to_dataframe(data_file, header=None)
        
        X_scaled = PreProcessingUtil.standardize(df_input)
            
        # Get explain variance ratio
        pca_helper = PcaUtil()
        pca = pca_helper.get_fit_transfrom_pca(X_scaled)
        arr_variance_ratio = pca.explained_variance_ratio_
        
        # Prepare all tabs to display Plot, Table by Bokeh
        # Add ratio to bokeh line graph
        elbow_plot = draw_elbow_plot(arr_variance_ratio)

        # Add line to a panel
        tab1 = Panel(child=elbow_plot, title="Elbow Curve Plot")
        # tab2 = Panel(child=df_describe_table, title="Data Description")
        # Add a panel to tab
        tabs = Tabs(tabs=[ tab1 ])

        script, div = components(tabs)
        plots = { 'script': script, 'div': div}
        resp_data["bokeh_plot"] = plots
        
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)


def elbow_plot_handler_old(request):
    resp_data = dict()
    file_name = request.GET.get("file_name")
    column_header = request.GET.get("column_header")
    exclude_columns = request.GET.get("exclude_columns")
    print(column_header)
    if file_name:
        fs = FileStorage()
        file_full_path = fs.get_base_location() + file_name
        
        # If the file does exist, read data by panda and drop columns (if any)
        if fs.is_file(file_full_path):
            # Get data from file
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0;
               
            df = DataFrameUtil.convert_file_to_dataframe(file_full_path, header=column_header_idx) 
            # Drop column specified by user
            if exclude_columns:
                str_column_indexs = exclude_columns.split(",")
                # column_indexs = list(map(int, str_column_indexs))
                column_indexs = [int(i) - 1 for i in str_column_indexs]
                df = DataFrameUtil.drop_column_by_index(df, column_indexs)
                is_nan = np.any(np.isnan(df))
                is_finite = np.all(np.isfinite(df))
            
            # Standardize data
            X_scaled = PreProcessingUtil.standardize(df)
            
            # Get explain variance ratio
            pca_helper = PcaUtil()
            pca = pca_helper.get_fit_transfrom_pca(X_scaled)
            arr_variance_ratio = pca.explained_variance_ratio_
            
            # Prepare all tabs to display Plot, Table by Bokeh
            # Add ratio to bokeh line graph
            elbow_plot = draw_elbow_plot(arr_variance_ratio)
            
            # Describe data 
#             df_describe = df.describe().to_json()
           #  df_describe_table = draw_df_describe_table(df)
            
            # Add line to a panel
            tab1 = Panel(child=elbow_plot, title="Elbow Curve Plot")
            # tab2 = Panel(child=df_describe_table, title="Data Description")
            # Add a panel to tab
            tabs = Tabs(tabs=[ tab1 ])

            script, div = components(tabs)
            plots = { 'script': script, 'div': div}
            resp_data["bokeh_plot"] = plots
            # resp_data["data_describe"] = bokeh_df_describe_table
        else:
            resp_data["msg"] = "[ERROR] File is not found."
        
    else:
        resp_data['msg'] = "[ERROR] File name is invalid."
    
    return JsonResponse(resp_data) 


def draw_elbow_plot(arr_variance_ratio):
    """
     X axis - Index of data in y + 1 
     Y - Ratio of each Principle Component
    """

    # Prepare data in source    
    # Define X, Y data to line
    # - Generate X
    n_compoments = len(arr_variance_ratio)
    X = np.arange(1, n_compoments + 1, 1)
    
    # Add data to source to show on hover, other data can be added here.
    data_source = ColumnDataSource(data=dict(
        x=X,
        y=np.cumsum(arr_variance_ratio)
    ))
    
    # For hover event
    TOOLTIPS = [
        ("(x,y)", "(@x, @y)")
    ]
        
    # Prepare figure
    # Define size of graph
    # More Tools: https://bokeh.pydata.org/en/latest/docs/user_guide/tools.html
    p1 = figure(title="Principal Component",
                tools="hover,pan,wheel_zoom,box_zoom,reset", \
                plot_width=700, plot_height=500, tooltips=TOOLTIPS, \
                x_axis_label='Dimension', y_axis_label='Explained Variance')

    # Refer to attribute in source.
    p1.line('x', 'y', source=data_source)
    
#     tab1 = Panel(child=p1, title="Elbow Curve Plot")
#     # Add a panel to tab
#     tabs = Tabs(tabs=[ tab1 ])
#     script, div = components(tabs)
#     bokeh_plot = {'script' : script , 'div' : div}
    return p1


def draw_df_describe_table(df):
#     columns = [
#             TableColumn(field="patient_id", title="Patient ID"),
#             TableColumn(field="x", title="X"),
#             TableColumn(field="y", title="Y"),
#         ]
#     source = ColumnDataSource(data_frame)
#     data_table = DataTable(source=source, columns=columns, width=400, height=280)
    names = df.columns
    # Create the Scaler object
    scaler = preprocessing.StandardScaler()
    # Fit your data on the scaler object
    scaled_df = scaler.fit_transform(df)
    scaled_df = pd.DataFrame(scaled_df, columns=names)
    data = scaled_df.describe()
    print(data)
    Columns = [TableColumn(field=str(Ci), title=str(Ci)) for Ci in df.columns.tolist()]  # bokeh columns
    data_table = DataTable(columns=Columns, source=ColumnDataSource(data), fit_columns=True)  # bokeh table
#     data_table = DataTable(source=source, columns=columns, width=1000,
#                                     editable=True, fit_columns=True)
    # script, div = components(widgetbox(data_table))
    return data_table

# def pca_process(request):
#     """
#     - Process data based on settings value from user.
#     e.g. number of components.
#     - Show elbow after process data so that user can determine how many components should remain.
#     - Visualize data in 2D for each selected pair of Principle component
#     
#     """
#     """
#     Take n_component and return eigenvalues for contributions
#     """
#     pca_n_component = request.POST["pca_n_component"]
#     dataset_file_path = request.POST["dataset_file_path"]
#     pca = PCA(n_components=int(pca_n_component));
#     logic = DiabetesLogic()
#     df = logic.read_dataset(dataset_file_path)
#     X = df.iloc[:, 1:9]
#     y = df.iloc[:, 0]
#     pca.fit(X, y)
#     eigenvalue = pca.singular_values_
#     dic = {}
#     dic['eigenvalue'] = eigenvalue.tolist()
#     dic['msg'] = ""
#     j = json.dumps(dic)
# #         response = serializers.serialize('json', j)
#     return JsonResponse(j, safe=False)

