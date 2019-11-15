from django.urls import path
from . import views

 # data_preprocess_upload is refered from html and navigation bar
urlpatterns = [
    path("visualization/home", views.init_view, name="flex_vis_home"),
    path("visualization/vis2d", views.flex_vis_2d_handler, name="flex_vis_2d"),
    ]
