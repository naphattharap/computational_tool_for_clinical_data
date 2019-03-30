from django.shortcuts import render

# Create your views here.
from django.urls import path

from .views import PcaTechView, PcaProcess

urlpatterns = [
    path("pca/home/", PcaTechView.as_view(), name="pca_tech_home"),
    path("pca/process/", PcaProcess.as_view(), name="pca_tech_process"),

]
