from django.urls import path
from . import views

 # dataset_management_upload is refered from html and navigation bar
urlpatterns = [
    path("data/upload", views.init_data_upload_handler, name="data_upload"),
    path("data/cleanup", views.init_view_cleanup_handler, name="data_cleanup"),
    path("data/cleanup/upload", views.upload_file_handler, name="data_cleanup_upload"),
    path("data/cleanup/process", views.clean_up_data_handler, name="data_cleanup_process"),
    path("data/cleanup/save", views.save_data_handler, name="data_cleanup_save"),
    path("data/cleanup/download", views.download_file_handler, name="data_cleanup_download"),
    
#     path("data/cleanup/analyze", views.analyze_upload_file, name="data_cleanup_analyze"),
#     path("dataset_management/download", test.as_view(), name="dataset_download"),
#     path("dataset_management/delete", test.as_view(), name="dataset_delete"),
      
]
