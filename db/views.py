from django.shortcuts import render
from django.http import JsonResponse
from services.naphyutils.dataframe import DataFrameUtil

from naphyutils.file import FileStorage
# Create your views here.

fs = FileStorage()


def list_all_files_handler(request):
    """
    List all file in FILE DB and return as Json.
    """
    file_names = fs.list_all_files()
    resp_data = dict()
    resp_data["file_names"] = file_names
    return JsonResponse(resp_data)
    

def get_file_json_data(request):
    file_name = request.GET.get('file_name')
    resp_data = dict()
    if file_name:
        file_full_path = fs.get_base_location() + file_name
        # print(fs.is_file(file_full_path))
        
        # If file does exist, get data as JSON
        if fs.is_file(file_full_path):
            json_data, columns = DataFrameUtil.convert_csv_to_json(file_full_path, header_row=0)
            resp_data["columns"] = columns
            resp_data["data"] = json_data
            resp_data["msg"] = "[SUCCESS]"
        else:
            resp_data["msg"] = "[ERROR] File is not found."
    else:        
        resp_data["msg"] = "[ERROR] Request parameter is incorrect."
        
    # print(resp_data)
    return JsonResponse(resp_data) 


def plot_pca_explain_variance(request): 
    pass  
    
