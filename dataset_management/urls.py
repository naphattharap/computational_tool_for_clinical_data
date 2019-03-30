from django.urls import path
from dataset_management.views import DatasetManagementView as view, DatasetManagementUpload as upload
 
 # dataset_management_upload is refered from html and navigation bar
urlpatterns = [
    path("dataset_management/view", view.as_view(), name="dataset_management_view"),
    path("dataset_management/upload", upload.as_view(), name="dataset_management_upload"),
#     path("dataset_management/download", test.as_view(), name="dataset_download"),
#     path("dataset_management/delete", test.as_view(), name="dataset_delete"),
      
]
