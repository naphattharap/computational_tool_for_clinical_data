from django.shortcuts import render

# Create your views here.
from django.urls import path

from . import views

urlpatterns = [
    path("dimreduction/pca/home/", views.init_view, name="dimreduction_pca_home"),
    path("dimreduction/pca/load/", views.pca_process, name="dimreduction_pca_search_dataset"),
    path("dimreduction/pca/elbow/", views.elbow_plot_handler, name="pca_elbow_plot"),

]
