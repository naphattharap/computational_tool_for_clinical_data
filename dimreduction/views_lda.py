from django.shortcuts import render
from django.views import View
from sklearn.decomposition import PCA
from sklearn import preprocessing

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import codecs, json 
from django.core import serializers
from naphyutils.dataframe import DataFrameUtil
import numpy as np

import pandas as pd
from .forms import LdaPlotForm
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis


# Create your views here.
def init_view(request):
    """
    Display home page of LDA
    """
    return render(request, template_name='lda.html')


@csrf_exempt  
def lda_plot(request):
    """
    Display home page of PCA
    """
    form = LdaPlotForm(request.POST, request.FILES)
    resp_data = dict();
    # PCA 3D
    plot = dict()
    
    if form.is_valid():
        # Get input files
        data_file = form.cleaned_data["data_file"]
        label_file = form.cleaned_data["label_file"]
        
        df_input = DataFrameUtil.file_to_dataframe(data_file, header=None)
        df_label = DataFrameUtil.file_to_dataframe(label_file, header=None)
        
        clf = LinearDiscriminantAnalysis(n_components=3)
        X = df_input.values
        y = df_label.values
        
        clf.fit_transform(X, y)
        plot['x'] = list(X[:, 0])
        plot['y'] = list(X[:, 1])
        plot['z'] = list(X[:, 2])
        resp_data['plot'] = plot
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)
