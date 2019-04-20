from django.urls import path
from . import views

urlpatterns = [
    path("vis/stratified/radiomic/home", views.home_hander, name="vis_stratified_radiomic_home"),
    path("vis/stratified/radiomic/process", views.process_data_handler, name="vis_stratified_radiomic_process"),
    path("vis/stratified/radiomic/dashboard", views.vis_dashboard_handler, name="vis_stratified_radiomic_dashboard"),
]
