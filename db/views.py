from django.shortcuts import render
from django.http import JsonResponse
from naphyutils.dataframe import DataFrameUtil

from naphyutils.file import FileStorage
import constants.const_msg as msg 

fs = FileStorage()


def list_all_files_handler(request):
    """
    List all file in FILE DB and return as Json.
    """
    filter_file_name = request.GET.get("query")
    file_names = fs.list_all_files(filter_file_name)
    resp_data = dict()
    resp_data["file_names"] = file_names
    return JsonResponse(resp_data)
    

def get_file_json_data(request):
    file_name = request.GET.get('file_name')
    column_header = request.GET.get('column_header')
    
    resp_data = dict()
    if file_name:
        file_full_path = fs.get_base_location() + file_name

        # If file does exist, get data as JSON
        if fs.is_file(file_full_path):
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
                
            json_data, columns = DataFrameUtil.convert_csv_to_json(file_full_path, header=column_header_idx)
            resp_data["table_columns"] = columns
            resp_data["table_data"] = json_data

        else:
            resp_data[msg.ERROR] = "File is not found."
    else:        
        resp_data[msg.ERROR] = "Request parameter is incorrect."
        
    return JsonResponse(resp_data) 

