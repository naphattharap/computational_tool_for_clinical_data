from django.urls import path
from . import views

urlpatterns = [
    path("feature/analysis/home", views.home_hander, name="feature_analysis_home"),
    path("feature/analysis/process", views.process_data_handler, name="feature_analysis_process"),
]
