from django.shortcuts import render

# Create your views here.
from django.urls import path
from . import views 

urlpatterns = [
    path("db/files/list_all_files", views.list_all_files_handler, name="db_list_all_files"),
    path("db/files/get_file_data", views.get_file_json_data, name="get_file_data"),
]
