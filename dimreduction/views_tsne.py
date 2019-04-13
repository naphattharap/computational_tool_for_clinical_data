from django.shortcuts import render
from django.views import View
from sklearn.decomposition import PCA
from sklearn import preprocessing

from django.http import JsonResponse
from diabetes_logic.diabetes_logic import DiabetesLogic
import codecs, json 
from django.core import serializers
from services.naphyutils.file import FileStorage
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

import pandas as pd


# Create your views here.
def init_view(request):
    """
    Display home page of LDA
    """
    return render(request, template_name='tsne.html')

