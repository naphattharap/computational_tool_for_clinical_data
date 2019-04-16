from django.urls import path
from . import views

urlpatterns = [
    path("vis/radiomic/home", views.home_hander, name="vis_radiomic_result_home"),
    path("vis/radiomic/dashboard", views.load_dashboard_handler, name="vis_radiomic_dashboard"),
]
