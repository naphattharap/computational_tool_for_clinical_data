from django.shortcuts import render
from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

from .forms import DataForm, KMeanForm, ElbowMethodForm, SilhouetteAnalysisForm
from services.naphyutils.file import FileStorage
from services.naphyutils.dataframe import DataFrameUtil
from services.naphyutils.pca import PcaUtil
from services.naphyutils.clustering import MeanShiftUtil, HierarchycalAnalysisUtil, KMeanUtil
from services.naphyutils.standardization import PreProcessingUtil
import services.constants.const_msg as msg
import plotly
import plotly.figure_factory as ff
import plotly.graph_objs as go
import pandas as pd
import numpy as np
"""
This module handle the event for displaying graph of below clustering visualization technique
- MeanShift
- Sillhouette
- Elblow
- Dendogram

Cycle of class design:
- init_view: To load main page of the module
- xxx_hander: To handle event driven by user through .ajax
"""
fs = FileStorage()


def home_hander(request):
    """
    Forward page to clustering analysis
    """
    return render(request, template_name='cluster.html')


def view_hierarchical_handler(request):
    resp_data = dict();
    form = DataForm(request.GET)
    if form.is_valid():
        # Read file and draw plot
        df = get_scaled_dataframe(form)
        p = draw_dendrogram(df)
        resp_data['plot'] = escape(p)
    else:
        # Return error message in form of HTML after validate input data in Form.
        resp_data[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp_data)


def view_mean_shift_analysis_handler(request):
    """
    Process data from selected file and generate plot for cluster 
    """
    resp_data = dict();
    form = DataForm(request.GET)
    
    # Check if input data matches with setting in Form.
    if form.is_valid():
        # Get data from request in form.cleaned_data (return as specified data type in Form)
        data_file_name = form.cleaned_data['data_file_name']
        column_header = form.cleaned_data['column_header']
        # Check if the file does exist in storage
        if fs.is_file_in_base_location(data_file_name):
            df = get_scaled_dataframe(form)
            # Do mean shift on data X
            X_redueced = PcaUtil.reduce_dimension(df, n_components=2)
            kmeans = MeanShiftUtil.mean_shift(X_redueced)
            
            p = draw_mean_shift(kmeans, X_redueced)
            resp_data['plot'] = escape(p)
        else:
            # File does not exist in storage
            resp_data[msg.ERROR] = "The file does not exist in storage."
        
        return JsonResponse(resp_data)

    else:
        # Return error message in form of HTML after validate input data in Form.
        resp_data[msg.ERROR] = escape(form._errors)
        return JsonResponse(resp_data)


def view_silhouette_analysis_handler(request):
    resp_data = dict();
    form = SilhouetteAnalysisForm(request.GET)
    if form.is_valid():
        # Read file and draw plot
        n_cluster_from = form.cleaned_data['n_cluster_from']
        n_cluster_to = form.cleaned_data['n_cluster_to']
        n_cluster_to += 1
        
        df = get_scaled_dataframe(form)
        X_redueced = PcaUtil.reduce_dimension(df, n_components=2)
        arr_sse = KMeanUtil.get_silhouette_score(X_redueced, n_cluster_from, n_cluster_to, random_state=42)
        x = [item[0] for item in arr_sse]
        y = [item[1] for item in arr_sse]
        p = draw_line_chart(x, y, "Silhouette Score", "Number of Clusters", "SSE")

        resp_data['plot'] = escape(p)
    else:
        # Return error message in form of HTML after validate input data in Form.
        resp_data[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp_data)


def view_kmean_analysis_handler(request):
    resp_data = dict();
    form = KMeanForm(request.GET)
    if form.is_valid():
        # Read file and draw plot
        df = get_scaled_dataframe(form)
        
        n_clusters = form.cleaned_data['n_clusters']
        X_redueced = PcaUtil.reduce_dimension(df, n_components=2)
        kmeans = KMeanUtil.get_kmean_model(X_redueced, n_clusters)
        label = kmeans.predict(X_redueced)
        df = pd.DataFrame(data=X_redueced, columns=["x", "y"])
        df_label = pd.DataFrame(data=kmeans.labels_, columns=['label'])
        df = df.join(df_label)
        p = draw_kmean(kmeans, df)
        resp_data['plot'] = escape(p)
    else:
        # Return error message in form of HTML after validate input data in Form.
        resp_data[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp_data)


def view_elbow_method_handler(request):
    """
    Sum square error from different number of cluster
    """
    resp_data = dict();
    form = ElbowMethodForm(request.GET)
    if form.is_valid():
        # Read file and draw plot
        df = get_scaled_dataframe(form)
        n_cluster_from = form.cleaned_data['n_cluster_from']
        n_cluster_to = form.cleaned_data['n_cluster_to']
        n_cluster_to += 1
        
        X_redueced = PcaUtil.reduce_dimension(df, n_components=2)
        arr_sse = KMeanUtil.get_kmean_sse(X_redueced, n_cluster_from, n_cluster_to, random_state=42)
        # arr_n_clusters = np.arange(n_cluster_from, n_cluster_to)
        x = [item[0] for item in arr_sse]
        y = [item[1] for item in arr_sse]
        p = draw_line_chart(x, y, "Elbow Method", "Number of Clusters", "SSE")
        resp_data['plot'] = escape(p)
    else:
        # Return error message in form of HTML after validate input data in Form.
        resp_data[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp_data)


def get_scaled_dataframe(form):
    data_file_name = form.cleaned_data['data_file_name']
    column_header = form.cleaned_data['column_header']
    df = None
    # X = None
    # Get file from storage
    data_file_full_path = fs.get_full_path(data_file_name)
    if column_header == "on":
        column_header_idx = 0
    
    df = DataFrameUtil.convert_file_to_dataframe(data_file_full_path, header=column_header_idx)
    df_scaled = PreProcessingUtil.standardize(df)
    return df_scaled


def get_reduced_dimension_X(form):
    df = get_scaled_dataframe(form)
    # Reduce dimension if specify
    X = PcaUtil.reduce_dimension(df, n_components=2)
    return X


def draw_dendrogram(X):
    dendro = ff.create_dendrogram(X)
    dendro['layout'].update({'width':800, 'height':500})
    
#     aPlot = plotly.offline.plot(fig, 
#                             config={"displayModeBar": False}, 
#                             show_link=False, 
#                             include_plotlyjs=False, 
#                             output_type='div')
 #   py.iplot(dendro, filename='simple_dendrogram')
    p = plotly.offline.plot(dendro, filename='dendrogram', output_type='div', include_plotlyjs=False, show_link=False)
    return p


def draw_mean_shift(kmeans, X):
    centroids = kmeans.cluster_centers_
    n_labels = len(np.unique(kmeans.labels_))
    
    df = pd.DataFrame(data=X, columns=["x", "y"])
    df_label = pd.DataFrame(data=kmeans.labels_, columns=['label'])
    df = df.join(df_label)
    traces = [
        {
            'x': df[df['label'] == label]['x'],
            'y': df[df['label'] == label]['y'],
            # 'name': label, 
            'mode': 'markers',
        } for label in np.unique(kmeans.labels_)]
   
    layout = {"title": "Mean Shift",
          "xaxis": {"title": "", },
          "yaxis": {"title": ""}}
    fig = {
        'data': traces,
        'layout': layout
    }
    p = plotly.offline.plot(fig, filename='MeanShift', output_type='div', include_plotlyjs=False, show_link=False)
    return p


def draw_kmean(kmeans, df):
    centroids = kmeans.cluster_centers_
    n_labels = len(np.unique(kmeans.labels_))

    traces = [
        {
            'x': df[df['label'] == label]['x'],
            'y': df[df['label'] == label]['y'],
            # 'name': label, 
            'mode': 'markers',
        } for label in np.unique(kmeans.labels_)]
   
    layout = {"title": "K-Mean",
          "xaxis": {"title": "", },
          "yaxis": {"title": ""}}
    fig = {
        'data': traces,
        'layout': layout
    }
    p = plotly.offline.plot(fig, filename='MeanShift', output_type='div', include_plotlyjs=False, show_link=False)
    return p


def draw_line_chart(x, y, title="", x_axis="", y_axis=""):
    traces = [
        {
            'x': x,
            'y': y
        }]
   
    layout = {"title": title,
          "xaxis": {"title": x_axis},
          "yaxis": {"title": y_axis}}
    fig = {
        'data': traces,
        'layout': layout
    }
    p = plotly.offline.plot(fig, filename=title, output_type='div', include_plotlyjs=False, show_link=False)
    return p
    
