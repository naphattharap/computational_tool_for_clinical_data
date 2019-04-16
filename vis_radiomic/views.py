from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from sklearn.decomposition import PCA
from sklearn import preprocessing

from django.http import JsonResponse
from diabetes_logic.diabetes_logic import DiabetesLogic
import codecs, json 
from django.core import serializers
from services.naphyutils.file import FileStorage
from naphyutils.dataframe import DataFrameUtil
from naphyutils.pca import PcaUtil
from naphyutils.clustering import KMeanUtil
from naphyutils.file import FileStorage
from naphyutils.standardization import PreProcessingUtil
from naphyutils.model import ModelUtils

import plotly.graph_objs as go
import plotly.offline as py
import datetime

from textwrap import dedent as d

from ipywidgets import widgets, interactive, HBox, VBox

import numpy as np
import pandas as pd

# from . import dashboard

fs = FileStorage()


def home_hander(request):
    """
    Load trained model to predict new data and display as cluster plot.
    Find important features that discriminate the cluster and plot to spider plot.
    Load  corresponding data for medical history.
    Combine all data into a dataframe for visualization.
    Create widgets for filtering data from medical history or from radiomic result.
    

    """
   
    return render(request, template_name='vis_radiomic.html')


def load_dashboard_handler(request):
    resp_data = dict()
    df_result = process()
    # p = draw_dash(df_result)
    resp_data['data'] = df_result.to_json()
    # resp_data['plot'] = escape(p)
    # dashboard()
    return JsonResponse(resp_data) 


def process():
    # TODO need to pass model name from DB
    model = load_model(model_name="xx")
    df_base_space = read_based_space_to_dataframe()
    
    X_scaled = PreProcessingUtil.standardize(df_base_space)
    X_reduced = PcaUtil.reduce_dimension(X_scaled, n_components=50)
    label = model.predict(X_reduced)
    
    X_2d = PcaUtil.reduce_dimension(X_scaled, n_components=2)
    # TODO add file name from DB
    df_data_detail = read_data_detail_to_dataframe(data_file_name="")
    
    # Join all data to one dataframe: x, y, label, data_detail
    df_result = pd.DataFrame(data=X_2d, columns=['x', 'y'])
    df_label = pd.DataFrame(data=label, columns=['label'])
    df_result = df_result.join(df_label)
    # Add Medical History Resuolt
    df_result = df_result.join(df_data_detail)
    # Add Radiomic Result
    df_result = df_result.join(df_base_space)
    return df_result


def load_model(model_name):
    # TODO change to load setting from DB DB
    # model_file_name = "radiomic482_svm_ovo_model.joblib"
    # model = ModelUtils.load_model(model_file_name)
    
    # TODO below data must be trained data
    df_train = DataFrameUtil.convert_file_to_dataframe(fs.get_full_path("radiomic482_no_key.csv"), header=0)
    X_scaled = PreProcessingUtil.standardize(df_train)
    X_reduced = PcaUtil.reduce_dimension(X_scaled, n_components=50)
    model = KMeanUtil.get_kmean_model(X_reduced, n_clusters=5, random_state=42)
    return model


def read_based_space_to_dataframe():
    """
    Read data from file and convert to dataframe for input X that will be predicted and generated as data in scatter plot
    """
    # TODO need to change this setting to DB
    df_based_space = DataFrameUtil.convert_file_to_dataframe(fs.get_full_path("radiomic_result_501_600.csv"), header=0)
    return df_based_space


def read_data_detail_to_dataframe(data_file_name):
    # TODO change to DB 
    data_file_name = "health_and_medical_history_501_600.csv"
    file_full_path = fs.get_full_path(file_name=data_file_name)
    df_data_detail = DataFrameUtil.convert_file_to_dataframe(file_full_path, header=0)
    return df_data_detail

# 
# def draw_dash(df): 
#     """
#     This function is for creating dashboard for radiomic data and medical history of patients.
#     """
# #      marker = dict(
# #         color = 'rgb(17, 157, 255)',
# #         size = 120,
# #         line = dict(
# #           color = 'rgb(231, 99, 250)',
# #           width = 12
# #         )
# #       ),
#     # Create different trace for different label.
#     n_labels = len(np.unique(df['label']))    
#     traces = []
#     for label in range(0, n_labels):
#         key = df[df['label'] == label]['f.eid']
#         texts = []
#         for id in key:
#             text = "Patient ID: " + str(id)
#             texts.append(text)
#         legend = "Cluster " + str(label)  
#         trace = go.Scatter(
#             x=df[df['label'] == label]['x'],
#             y=df[df['label'] == label]['y'],
#             text=texts,
#             mode='markers',
#             marker=dict(size=20, opacity=0.7),
#             name=legend
#         )
#         traces.append(trace) 
# 
#     layout = {"title": "",
#           "xaxis": {"title": "", },
#           "yaxis": {"title": ""}}
#     
#     # updatemenus, annotations = filters(df)
#     long_illness_choice = df['bio:long-standing illness, disability or infirmity:0:baseline'].unique()
# #     long_illness_widget = dict(
# #         buttons=list([   
# #             dict(
# #                 args=long_illness_choice, label='Yes', method='restyle'
# #             )]),
# #         direction='down',
# #         pad={'r': 10, 't': 10},
# #         showactive=True,
# #         x=0.3,
# #         xanchor='left',
# #         # y=button_layer_1_height,
# #         yanchor='top' 
# #     )
# 
#     # 1 dict inside list is one widget
#     button_layer_1_height = 1.12
#     updatemenus = list([
#         dict(buttons=generate_dropdown(long_illness_choice),
#             direction='down',
#             pad={'r': 10, 't': 10},
#             showactive=True,
#             x=0.1,
#             xanchor='left',
#             y=button_layer_1_height,
#             yanchor='top' 
#              )
#         # New widget here
#     ])
#     # updatemenus = generate_dropdown(long_illness_widget)  # list([dict(long_illness_widget)])
#     
#     annotations = list([
#         dict(text='Long standing illness', x=0, y=1.11, yref='paper', align='left', showarrow=False),
#     ])
#     
#     layout['updatemenus'] = updatemenus
#     layout['annotations'] = annotations
#     
#     # cancer = df['bio:cancer diagnosed by doctor:0:baseline'].unique()
#     
# #     w_long_illness = widgets.Dropdown(
# #             options=list(long_illness_choice),
# #             # value='Yes',
# #             description='bio:cancer diagnosed by doctor:0:baseline',
# #     )
#     # Register widget to response
#     # long_illness_widget.observe(response, names="value")
#     
#     fig = {
#         'data': traces,
#         'layout': layout
#     }
#     p = py.plot(fig, filename='fig.html', output_type='div', include_plotlyjs=False, show_link=False)
#     return p
# 
# # function that will handle the input from the widgets, and alter the state of the graph.
# 
# 
# def filters(df):
#     # Widgets for filtering data
#     # - Take column in dataframe and get its unique to make the widget's choice. 
# 
#     updatemenus = list([
#         dict(
#             buttons=list([   
#                 dict(
#                     args=['type', 'surface'],
#                     label='Long illness',
#                     method='restyle'
#                 ),
#                 dict(
#                     args=['type', 'heatmap'],
#                     label='Heatmap',
#                     method='restyle'
#                 ),
#                 dict(
#                     args=['type', 'contour'],
#                     label='Contour',
#                     method='restyle'
#                 )                     
#             ]),
#             direction='down',
#             pad={'r': 10, 't': 0},
#             showactive=True,
#             x=0.3,
#             xanchor='left',
#             # y=button_layer_1_height,
#             yanchor='top' 
#         ),
#     ])
# 
#     annotations = list([
# #         dict(text='cmocean<br>scale', x=0, y=1.11, yref='paper', align='left', showarrow=False),
# #         dict(text='Trace<br>type', x=0.25, y=1.11, yref='paper', showarrow=False),
# #         dict(text="Colorscale", x=0.5, y=1.10, yref='paper', showarrow=False),
# #         dict(text="Lines", x=0.75, y=1.10, yref='paper', showarrow=False)
#     ])
#     
#     return updatemenus, annotations
# 
# 
# def response(change):
#     print(change)
#     
#     
# def generate_dropdown(choices):
#     """
#     Generate list of dict objects for each choice
#     """
#     # Ex. dict(args=long_illness_choice, label='Yes', method='restyle')]
#     arr_dropdown = []
#     button = dict(args=['long_stand_illness', 'All'], label='All', method='restyle')
#     arr_dropdown.append(button)
#     for c in choices:
#         button = dict(args=['long_stand_illness', c], label=c, method='restyle')
#         arr_dropdown.append(button)
#     dropdown = list(arr_dropdown)
#     return dropdown
     
