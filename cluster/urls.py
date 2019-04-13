from django.urls import path
from . import views

urlpatterns = [
    path("cluster/home", views.home_hander, name="cluster_analysis_home"),
    path("cluster/hierarchy", views.view_hierarchical_handler, name="hierarchical_analysis"),
    path("cluster/meanshift", views.view_mean_shift_analysis_handler, name="mean_shift_analysis"),
    path("cluster/silhouette", views.view_silhouette_analysis_handler, name="silhouette_analysis"),
    path("cluster/kmean", views.view_kmean_analysis_handler, name="kmean_analysis"),
    path("cluster/elbow", views.view_elbow_method_handler, name="elbow_method"),
]
