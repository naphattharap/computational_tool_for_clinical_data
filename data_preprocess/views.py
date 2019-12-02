from django.core import serializers
from django.http import Http404, HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from django.views import View
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

from data_preprocess.forms import UploadFileForm, CleanUpSettingsForm, ProcessFileForm, SaveFileForm, UploadFileAsForm
from data_preprocess.logic import ProcessDataset
from naphyutils.file import FileStorage
from naphyutils.dataframe import DataFrameUtil
import simplejson as json

import pandas as pd

from .forms import ExtractMatchedKeysForm

import constants.const_msg as msg

fs = FileStorage()
    
# ====== Upload Menu =====

  
def init_data_upload_handler(request):
        """
        Forward to main page of data management module.
        """
        return render(request, template_name='upload.html')

     
@csrf_exempt    
def upload_file_as_handler(request):
    """
    Forward to main page of data management module.
    """
    resp_data = dict();
    form = UploadFileAsForm(request.POST, request.FILES)
    # if this is a POST request we need to process the form data
    if form.is_valid():
        # and request.FILES['file_train_test_data']
        # check whether it's valid:
        # create a form instance and populate it with data from the request:
        # form = DatasetFileForm(request.POST)
        # form = DatasetFileForm(request.POST, request.FILES)
 
        # process the data in form.cleaned_data as required
        data_file = request.FILES['data_file']
        file_name = form.cleaned_data['file_name']
        file_name = fs.save_file_as(data_file, file_name)
        resp_data[msg.SUCCESS] = 'The file has been uploaded successfully as ' + file_name
        return JsonResponse(resp_data)
 
    else:
        resp_data[msg.ERROR] = escape(form._errors)
        return JsonResponse(resp_data)


# ======= Data Preparation Menu ========
def init_view_cleanup_handler(request):
    """
    Forward to data clean up page
    """
    return render(request, template_name='data_cleanup.html')


def upload_file_handler(request):
    if(request.method == 'POST'):
        # upload file
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            data_file = request.FILES['data_file']
            column_header = form.cleaned_data['column_header']
            
            # filename = fs.save_file(data_file)
 
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
            df = DataFrameUtil.file_to_dataframe(data_file, header=column_header_idx)
            # file_json_data, columns_value = DataFrameUtil.convert_csv_to_json(file_full_path, header_row=column_header_idx, orient='values')  # values, records
            # analyze_results = analyze_data(file_full_path)
            analyze_results = DataFrameUtil.analyze_dataframe(df)
            file_json_data, columns_name = DataFrameUtil.dataframe_to_json(df)
            
            resp_data = {  # msg.SUCCESS:'The file has been uploaded successfully.', \
                    'table_data': file_json_data, \
                    'table_columns': columns_name, \
                    'analysis': analyze_results}

            return JsonResponse(resp_data)
        else:
            # Form validation error
            resp_data = {msg.ERROR: escape(form._errors)}
            return JsonResponse(resp_data)
    else:
        resp_data = {msg.ERROR: "request is not POST."}
        return JsonResponse(resp_data)


@csrf_exempt 
def process_clean_up_data_handler(request):
    """
    Clean up data by removing NaN rows, drop columns
    """
    form = ProcessFileForm(request.POST, request.FILES)
    if form.is_valid():
        file_name = request.FILES["data_file"]
        choice_cleanup = form.cleaned_data["choice_cleanup"]
        column_header = form.cleaned_data["column_header"]
        exclude_columns = form.cleaned_data["exclude_columns"]
        remain_columns = form.cleaned_data["remain_columns"]
        split_row_from = form.cleaned_data["split_row_from"]
        split_row_to = form.cleaned_data["split_row_to"]
        
        df = None
        if file_name:
            
            # When column header is check, set to row 0 (zero based index) 
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
        
            df = DataFrameUtil.file_to_dataframe(file_name, header=column_header_idx)
            # df = read_file_to_dataframe(file_name, column_header_idx)
            
            # Split row from - to
            if split_row_from and split_row_from:
                # To zero based index.
                split_row_from_idx = split_row_from - 1
                split_row_to_idx = split_row_to
                df = df.iloc[split_row_from_idx:split_row_to_idx, :]
            
            # TODO file with mean, median
            # Delete NaN row
            if choice_cleanup == "delete":
                df = DataFrameUtil.drop_na_row(df)
                  
            # Drop columns and store to new df.
            if exclude_columns:
                df = dataframe_exclude_columns(df, exclude_columns)
            
            # Drop other columns except those specified by user.
            if remain_columns:
                df = dataframe_remain_columns(df, remain_columns) 
    
            file_json_data = df.to_json(orient='values')
            columns_value = df.columns.tolist()
                
            analyze_results = DataFrameUtil.analyze_dataframe(df)
            
            resp_data = {  # msg.SUCCESS:'The file has been uploaded successfully.', \
            'table_data': file_json_data, \
            'table_columns': columns_value, \
            'analysis': analyze_results}  
        else:
            resp_data = {msg.ERROR:'[ERROR] Invalid request parameters.'}
    else:
        # Form validation error
        resp_data = {msg.ERROR: escape(form._errors)}
        return JsonResponse(resp_data)
    return JsonResponse(resp_data)


@csrf_exempt    
def save_data_handler(request):
    """
    Clean up data
    """
    form = SaveFileForm(request.POST, request.FILES)
    if form.is_valid():
        file = request.FILES["data_file"]
        choice_cleanup = form.cleaned_data["choice_cleanup"]
        column_header = form.cleaned_data["column_header"]
        exclude_columns = form.cleaned_data["exclude_columns"]
        remain_columns = form.cleaned_data["remain_columns"]
        split_row_from = form.cleaned_data["split_row_from"]
        split_row_to = form.cleaned_data["split_row_to"]
        save_as_name = form.cleaned_data["save_as_name"]
    
        if save_as_name:
            # When column header is check, set to row 0 (zero based index) 
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
                
            # df = read_file_to_dataframe(file_name, column_header_idx)
            df = DataFrameUtil.file_to_dataframe(file, header=column_header_idx)
            # Split row from - to
            if split_row_from and split_row_from:
                # To zero based index.
                split_row_from_idx = int(split_row_from) - 1
                split_row_to_idx = int(split_row_to)
                df = df.iloc[split_row_from_idx:split_row_to_idx, :]
                
            # Delete NaN row
            if choice_cleanup == "delete":
                df = DataFrameUtil.drop_na_row(df)
                
            # Drop columns and store to new df.
            if exclude_columns:
                df = dataframe_exclude_columns(df, exclude_columns)
                
            if remain_columns:
                df = dataframe_remain_columns(df, remain_columns) 
            
            # Don't forget to add '.csv' at the end of the path
            header = False
            if column_header_idx != None:
                header = True
                
            df.to_csv(fs.get_base_location() + save_as_name, index=None, header=header) 
        
            columns_value = df.columns.tolist()
            file_json_data = df.to_json(orient='values') 
            analyze_results = DataFrameUtil.analyze_dataframe(df)
            
            resp_data = {msg.SUCCESS:'The file has been save as ' + save_as_name, \
            'table_data': file_json_data, \
            'table_columns': columns_value, \
            'analysis': analyze_results} 
    else:
        resp_data = {msg.ERROR:'[ERROR] Invalid parameter.'}
    return JsonResponse(resp_data)


def download_file_handler(request):
    file_name = request.GET.get("file_name")
    
    if file_name:
        file_full_path = fs.get_base_location() + file_name
        
        if fs.is_file(file_full_path):
            with open(file_full_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="text/csv")
                response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_name)  # = 'inline; filename=' + file_full_path  # os.path.basename(file_path)
                return response
        raise Http404


# ======= Data Matching ========
def init_matched_keys_handler(request):
    """
    Forward to main page of data matching.
    """
    return render(request, template_name='data_matching.html')

    
def matched_keys_handler(request):
    form = ExtractMatchedKeysForm(request.POST, request.FILES)
    resp_data = dict()
    if form.is_valid():
        key_file = request.FILES["key_file"]
        data_file = request.FILES["data_file"]
        
        df_result = extract_matched_key(key_file, data_file)
        
        file_json_data = df_result.to_json(orient='values')
        analyze_results = DataFrameUtil.analyze_dataframe(df_result)
        resp_data['table_data'] = file_json_data  # df_result.values
        resp_data['table_columns'] = df_result.columns.tolist()
        resp_data['analysis'] = analyze_results
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data) 
    

@csrf_exempt  
def download_matched_key_handler(request):
    form = ExtractMatchedKeysForm(request.POST, request.FILES)
    resp_data = dict()
    if form.is_valid():
        key_file = request.FILES["key_file"]
        data_file = request.FILES["data_file"]
        
        df_result = extract_matched_key(key_file, data_file)
        # csv = df_result.to_csv(index=False)
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=download.csv'
        # TODO change this to dynamic
#         df_result = DataFrameUtil.drop_column_by_index(df_result, column_indexes=[0])
        # index=False => do not add index at the first column
        df_result.to_csv(path_or_buf=response, index=False)  # ,sep=';',float_format='%.2f',,decimal=","
#         with open(csv, 'rb') as fh:
#             response = HttpResponse(fh.read(), content_type="text/csv")
#             response['Content-Disposition'] = 'attachment; filename="{}"'.format(data_file.name)  
        return response
        
    else:
        resp_data[msg.ERROR] = escape(form._errors)
        return JsonResponse(resp_data) 
    
    return JsonResponse(resp_data) 
#     df.to_csv(index=False)
#     file_name = request.GET.get("file_name")
#     if file_name:
#         file_full_path = fs.get_base_location() + file_name
#         
#         if fs.is_file(file_full_path):
#             with open(file_full_path, 'rb') as fh:
#                 response = HttpResponse(fh.read(), content_type="text/csv")
#                 response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_name)  # = 'inline; filename=' + file_full_path  # os.path.basename(file_path)
#                 return response
#         raise Http404


def extract_matched_key(key_file, data_file):
    # Process matching between keys from both file and write a new file for result.
    df_keys = DataFrameUtil.file_to_dataframe(key_file, header=None)
    df_data = DataFrameUtil.file_to_dataframe(data_file, header=None)
    
    # select data from df_data where the first column (keys) exist in df_keys
    keys = list(df_keys.iloc[:, 0].values)
#     print("Key", keys)
#     print("df data\n", df_data.iloc[:, 0])
#     print("df data\n", df_data.iloc[:, 1])
    df_result = df_data[ df_data.iloc[:, 0].isin(keys)]
#     print("Result", df_result)
    return df_result


def analyze_data(file_full_path, header_row=None):
    
    # Read data from file by panda dataframe
    # TODO header should be specified by user
    
    # Check NaN
    df = DataFrameUtil.convert_file_to_dataframe(file_full_path, header=header_row)
    results = DataFrameUtil.analyze_dataframe(df, header_row)
    
    return results

    
def dataframe_exclude_columns(df, exclude_columns):
    """
    exclude_columns - A string array of column entered by user from 1, 2, ...
    """
    if exclude_columns:
        str_column_indexs = exclude_columns.split(",")
        column_indexs = [int(i) - 1 for i in str_column_indexs]
        return DataFrameUtil.drop_column_by_index(df, column_indexs)


def dataframe_remain_columns(df, remain_columns):
    """
    remain_columns - A string array of column entered by user from 1, 2, ...
    """
    if remain_columns:
        remain_columns = remain_columns.split(",")
        column_indexs = [int(i) - 1 for i in remain_columns]
        return df.iloc[:, column_indexs]


def read_file_to_dataframe(file_name, column_header_idx):
    file_full_path = fs.get_base_location() + file_name
    # Read the file data  
    return DataFrameUtil.convert_file_to_dataframe(file_full_path, header=column_header_idx)

