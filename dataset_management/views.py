from django.core import serializers
from django.http import Http404
from django.http import HttpResponse
from django.http import HttpRequest
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from dataset_management.forms import DatasetFileForm, CleanUpSettingsForm, DataCleanupFileForm
from dataset_management.logic import ProcessDataset
from services.naphyutils.file import FileStorage
from services.naphyutils.dataframe import DataFrameUtil
import simplejson as json

fs = FileStorage()


# class DatasetManagementView(View):
#     
#     def get(self, request):
#         """
#         Forward to main page of data management module.
#         """
#         return render(request, template_name='upload_dataset.html')
#     
#     
def init_data_upload_handler(request):
        """
        Forward to main page of data management module.
        """
        return render(request, template_name='upload_dataset.html')

    
def data_upload_process(request):
    """
    Forward to main page of data management module.
    """

    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # and request.FILES['file_train_test_data']
        # check whether it's valid:
        # create a form instance and populate it with data from the request:
        # form = DatasetFileForm(request.POST)
        form = DatasetFileForm(request.POST, request.FILES)
        if form.is_valid():
            # process the data in form.cleaned_data as required
            dataset_file = request.FILES['dataset_file']
            data_file = request.FILES['data_file']
            label_file = request.FILES['label_file']
            
            ProcessDataset.process_data(dataset_file, data_file, label_file, form);

            data = dict()
            # data['file_url'] = file_url
            json_serializer = serializers.get_serializer("json")()
            # response =  json_serializer.serialize(data, ensure_ascii=False, indent=2, use_natural_keys=True)
            # return HttpResponse(response, mimetype="application/json")
            return JsonResponse({'file_url': "temp", 'msg':'The file has been uploaded successfully.'})
        else:
            # Error 
            # form = DatasetFileForm()
            # return render(request, 'upload_dataset.html', {'form': form})
            return JsonResponse({'msg':'Failed'})
    else:
        return JsonResponse({'msg':'Failed'})
    
 
def init_view_cleanup_handler(request):
    """
    Forward to data clean up page
    """
    return render(request, template_name='data_cleanup.html')


def upload_file_handler(request):
    if(request.method == 'POST'):
        # upload file
        form = DataCleanupFileForm(request.POST, request.FILES)
        if form.is_valid():
            data_file = request.FILES['data_file']
            filename = fs.save_file(data_file)
            
            # Read JSON data into the datastore variable
            analyze_results = None
            if filename:
                file_full_path = fs.get_base_location() + filename
                file_json_data, columns_value = DataFrameUtil.convert_csv_to_json(file_full_path, header_row=0, orient='values')  # values, records
                analyze_results = analyze_data(file_full_path)
            
            resp_data = {'msg':'The file has been uploaded successfully.', \
                    'table_data': file_json_data, \
                    'table_columns': columns_value, \
                    'analysis': analyze_results}

            return JsonResponse(resp_data)
        else:
            form = DataCleanupFileForm()
            return render(request, 'data_cleanup.html', {'form': form})
    else:
        resp_data = {'msg':'Failed'}
        return JsonResponse(data)


def clean_up_data_handler(request):
    """
    Clean up data by removing NaN rows, drop columns
    """
    file_name = request.GET.get("file_name")
    choice_cleanup = request.GET.get("choice_cleanup")
    column_header = request.GET.get("column_header")
    exclude_columns = request.GET.get("exclude_columns")
    
    df = None
    if file_name:
        
        # When column header is check, set to row 0 (zero based index) 
        column_header_idx = None
        if column_header == "on":
            column_header_idx = 0
    
        df = read_file_to_dataframe(file_name, column_header_idx)
        
        # Drop columns and store to new df.
        if exclude_columns:
            df = dataframe_exclude_columns(df, exclude_columns)
        
        # Delete NaN row
        file_json_data = None
        columns_value = None
        if choice_cleanup == "delete":
            df = DataFrameUtil.drop_na_row(df)
            columns_value = df.columns.tolist()
            file_json_data = df.to_json(orient='values')
            
        # TODO file with mean, median
        
        analyze_results = analyze_dataframe(df, header_row=column_header_idx)
        
        resp_data = {'msg':'The file has been uploaded successfully.', \
        'table_data': file_json_data, \
        'table_columns': columns_value, \
        'analysis': analyze_results}  
    else:
        resp_data = {'msg':'[ERROR] Invalid request parameters.'}
    
    return JsonResponse(resp_data)

    
def save_data_handler(request):
    """
    Clean up data
    """
    form = CleanUpSettingsForm(request.GET)
    if form.is_valid():
        file_name = form.cleaned_data['file_name']
        choice_cleanup = form.cleaned_data['choice_cleanup']  # on or not
        column_header = form.cleaned_data['column_header']
        exclude_columns = form.cleaned_data['exclude_columns']
        save_as_name = form.cleaned_data['save_as_name']
        # When column header is check, set to row 0 (zero based index) 
        column_header_idx = None
        if column_header == "on":
            column_header_idx = 0
            
        df = read_file_to_dataframe(file_name, column_header_idx)
        
        # Drop columns and store to new df.
        if exclude_columns:
            df = dataframe_exclude_columns(df, exclude_columns)
            
        # Delete NaN row
        file_json_data = None
        columns_value = None
        if choice_cleanup == "delete":
            df = DataFrameUtil.drop_na_row(df)
        
        # Don't forget to add '.csv' at the end of the path
        header = False
        if column_header_idx != None:
            header = True
            
        df.to_csv(fs.get_base_location() + save_as_name, index=None, header=header) 

        columns_value = df.columns.tolist()
        file_json_data = df.to_json(orient='values') 
        analyze_results = analyze_dataframe(df, header_row=column_header_idx)
        
        resp_data = {'msg':'The file has been save as ' + save_as_name, \
        'table_data': file_json_data, \
        'table_columns': columns_value, \
        'analysis': analyze_results} 
    else:
        resp_data = {'msg':'[ERROR] Invalid request parameters.'} 

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

 
def analyze_data(file_full_path, header_row=None):
    
    # Read data from file by panda dataframe
    # TODO header should be specified by user
    
    # Check NaN
    df = DataFrameUtil.convert_file_to_dataframe(file_full_path, header=header_row)
    results = analyze_dataframe(df, header_row)
    
    return results


def analyze_dataframe(df, header_row=None):
    results = dict()
    column_with_nan = df.columns[df.isna().any()].tolist()
    results["columns_nan"] = column_with_nan

    # Count NaN Row
    rows_nan = df.isna().sum(axis=1)
    cnt_rows_nan = 0
    for r in rows_nan:
        if r != 0:
             cnt_rows_nan += 1
    
    results["n_rows_nan"] = cnt_rows_nan
    
    # Check Null
    column_with_null = df.columns[df.isnull().any()].tolist()
    results["columns_null"] = column_with_null
     
    # Count Null Row
    rows_null = df.isnull().sum(axis=1)
    cnt_rows_null = 0
    for r in rows_null:
        if r != 0:
             cnt_rows_null += 1
    
    results["n_rows_null"] = cnt_rows_null
    
    # Get number of rows, columns
    count_row, count_col = df.shape
    results["n_columns"] = count_col
    results["n_rows"] = count_row
    
    return results

    
def dataframe_exclude_columns(df, exclude_columns):
    if exclude_columns:
        str_column_indexs = exclude_columns.split(",")
        column_indexs = [int(i) - 1 for i in str_column_indexs]
        return DataFrameUtil.drop_column_by_index(df, column_indexs)


def read_file_to_dataframe(file_name, column_header_idx):
    file_full_path = fs.get_base_location() + file_name
    # Read the file data  
    return DataFrameUtil.convert_file_to_dataframe(file_full_path, header=column_header_idx)
