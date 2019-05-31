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
from . import views
from .forms import FormUploadFile, FormStratifyData
from .helpers import Helper
import constants.const_msg as msg

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
            
            data['feature_columns'] = list(df_source.columns)
            
        if target_file:
            # Check if data contains header
            target_column_header_idx = None
            if target_column_header == "on":
                target_column_header_idx = 0
                
            df_target = DataFrameUtil.file_to_dataframe(target_file, header=target_column_header_idx)
            arr_criterion = Helper.get_criterion_data(df_target)
            data['criterions'] = arr_criterion          
        
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)


def stratify_data(request):
    
    # Init response data
    resp = dict();
    data = dict();
    resp['data'] = data
    
    form = FormStratifyData(request.POST, request.FILES)
    # If form is valid, continue processing
    if form.is_valid():
         # Get parameter from form through cleaned_data to get correct data type
        source_file = form.cleaned_data["source_file"]
        target_file = form.cleaned_data["target_file"]
        source_column_header = form.cleaned_data['source_column_header']
        target_column_header = form.cleaned_data['target_column_header']
        feature_indexes = form.cleaned_data['feature_indexes']
        numtypes = form.cleaned_data['numtypes']  # format: 'INTERVAL', 'NOMINAL', ...
        bins = form.cleaned_data['bin']  # format: 'INTERVAL', 'NOMINAL', ...
        criterion = form.cleaned_data['criterion']  # Format Male,Female&1938,1969&45,104&50,112 
        groupby = form.cleaned_data['groupby']  # 
        
        # Validate group by
        arr_groupby = groupby.split(",")
        if all('' == s or s.isspace() for s in arr_groupby):
            form._errors["Group By"] = form.error_class(["Group By must be entered."])
            resp[msg.ERROR] = escape(form._errors)
            return JsonResponse(resp)
        
        # print(feature_indexes, "/", criterion)
        
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
        
        # Process data with the criterions
        arr_criterion = criterion.split("&")
        arr_numtype = numtypes.split(",")
        arr_bin = bins.split(",")
        arr_groupby = groupby.split(",")
        arr_traces = Helper.startify_mean(df_source, df_target, feature_indexes, arr_numtype, \
                                        arr_criterion, arr_bin, arr_groupby)
        resp['traces'] = arr_traces
    else:
        resp[msg.ERROR] = escape(form._errors)
        
    return JsonResponse(resp)
