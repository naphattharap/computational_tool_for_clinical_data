from django.shortcuts import render
from django.views import View
from sklearn.decomposition import PCA
from django.http import JsonResponse
from diabetes_logic.diabetes_logic import DiabetesLogic
import codecs, json 
from django.core import serializers
from services.naphyutils.file import FileStorage
from naphyutils.dataframe import DataFrameUtil
from naphyutils.pca import PcaHelper
from naphyutils.file import FileStorage
from naphyutils.standardization import Standardization
import numpy as np

from bokeh.plotting import figure
from bokeh.models.widgets import Panel, Tabs
from bokeh.embed import components
from bokeh.models import ColumnDataSource


# Create your views here.
def init_view(request):
    """
    Display home page of PCA
    """
    return render(request, template_name='pca.html')


def elbow_plot_handler(request):
    resp_data = dict()
    file_name = request.GET.get("file_name")
    column_header = request.GET.get("column_header")
    exclude_columns = request.GET.get("exclude_columns")
    
    if file_name:
        fs = FileStorage()
        file_full_path = fs.get_base_location() + file_name
        
        # If the file does exist, read data by panda and drop columns (if any)
        if fs.is_file(file_full_path):
            # Get data from file
            column_header_idx = None
            if column_header:
                column_header_idx = int(column_header) - 1;
               
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
            X_scaled = Standardization.standardize(df)
            # Get explain variance ratio
            pca_helper = PcaHelper()
            arr_variance_ratio = pca_helper.get_explain_variance_ratio(X_scaled)
            # Add ratio to bokeh line graph
            elbow_plot = draw_elbow_plot(arr_variance_ratio)
            
            # Describe data 
            df_describe = df.describe().to_json()
            
            resp_data["msg"] = "[SUCCESS]"
            resp_data["elbow_plot"] = elbow_plot
            resp_data["describe"] = df_describe
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
    p1 = figure(title="Cumulative Sum of Eigenvalues",
                tools="hover,pan,wheel_zoom,box_zoom,reset", \
                plot_width=700, plot_height=500, tooltips=TOOLTIPS, \
                x_axis_label='Principle Component', y_axis_label='Eigenvalue')
    # Axes label
#     p1.xaxis.axis_label = 'Principle Component'
#     p1.yaxis.axis_label = 'Eigenvalue'
    
    # Refer to attribute in source.
    p1.line('x', 'y', source=data_source)
    
    # Add line to a panel
    tab1 = Panel(child=p1, title="Elbow Curve Plot")
    
    # Add a panel to tab
    tabs = Tabs(tabs=[ tab1 ])
    script, div = components(tabs)
    bokeh_plot = {'script' : script , 'div' : div}
    return bokeh_plot


def pca_process(request):
    """
    - Process data based on settings value from user.
    e.g. number of components.
    - Show elbow after process data so that user can determine how many components should remain.
    - Visualize data in 2D for each selected pair of Principle component
    
    """
    """
    Take n_component and return eigenvalues for contributions
    """
    pca_n_component = request.POST["pca_n_component"]
    dataset_file_path = request.POST["dataset_file_path"]
    pca = PCA(n_components=int(pca_n_component));
    logic = DiabetesLogic()
    df = logic.read_dataset(dataset_file_path)
    X = df.iloc[:, 1:9]
    y = df.iloc[:, 0]
    print(X)
    print(y)
    pca.fit(X, y)
    eigenvalue = pca.singular_values_
    dic = {}
    dic['eigenvalue'] = eigenvalue.tolist()
    dic['msg'] = ""
    j = json.dumps(dic)
#         response = serializers.serialize('json', j)
    return JsonResponse(j, safe=False)
    
#     def get(self, request):
#         """
#         Take n_component and return eigenvalues for contributions
#         """
#         pca_n_component = request["pca_n_component"]
#         dataset_file_path = request["dataset_file_path"]
#         pca = PCA(n_components = pca_n_component);
#         
#         return JsonResponse({'msg':'The file has been uploaded successfully.'})
