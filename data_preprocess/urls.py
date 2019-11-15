from django.urls import path
from . import views

 # data_preprocess_upload is refered from html and navigation bar
urlpatterns = [
    path("data/upload/home", views.init_data_upload_handler, name="data_upload_init"),
    path("data/upload/", views.upload_file_as_handler, name="data_upload"),
    path("data/cleanup", views.init_view_cleanup_handler, name="data_cleanup"),
    path("data/cleanup/upload", views.upload_file_handler, name="data_cleanup_upload"),
    path("data/cleanup/process", views.process_clean_up_data_handler, name="data_cleanup_process"),
    path("data/cleanup/save", views.save_data_handler, name="data_cleanup_save"),
    path("data/cleanup/download", views.download_file_handler, name="data_cleanup_download"),
    path("data/matching/home", views.init_matched_keys_handler, name="data_matching_home"),
    path("data/matched/keys", views.matched_keys_handler, name="data_matched_keys"),
    path("data/matched/download", views.download_matched_key_handler, name="data_matched_keys_download"),
  
]
