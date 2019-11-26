from django.shortcuts import render

# Create your views here.
from django.urls import path

from . import views, views_lda, views_tsne

urlpatterns = [
    path("dimreduction/pca/home/", views.init_view, name="pca_home"),
    path("dimreduction/pca/pca_plot/", views.pca_plot, name="pca_plot"),
    path("dimreduction/pca/elbow/", views.elbow_plot_handler, name="pca_elbow_plot"),
    path("dimreduction/lda/home/", views_lda.init_view, name="lda_home"),
    path("dimreduction/lda/plot/", views_lda.lda_plot, name="lda_plot"),
    path("dimreduction/tsne/home/", views_tsne.init_view, name="tsne_home"),
   # path("dimreduction/pca/load/", views.pca_process, name="dimreduction_pca_search_dataset"),

]
