from django.urls import path
from . import views

urlpatterns = [
    path("vis/dynamicsource/home", views.home_hander, name="vis_dynamic_source_home"),
    path("vis/dynamicsource/process", views.process_data_handler, name="vis_dynamic_source_process"),
]
