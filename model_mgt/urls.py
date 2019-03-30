from django.shortcuts import render

# Create your views here.
from django.urls import path

from .views import ModelMgt

urlpatterns = [
    path("model_mgt/model/create", ModelMgt.as_view(), name="model_mgt_create"),
    path("model_mgt/model/list", ModelMgt.as_view(), name="model_mgt_list"),
    path("model_mgt/model/update", ModelMgt.as_view(), name="model_mgt_update"),
    path("model_mgt/model/delete", ModelMgt.as_view(), name="model_mgt_delete"),
]
