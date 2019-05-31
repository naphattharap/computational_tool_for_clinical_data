from django.urls import path
from . import views

urlpatterns = [
    path("corr_explore/home", views.home_hander, name="corr_explore_home"),
    path("corr_explore/analyze_source_target", views.get_source_target, name="corr_explore_analyze_source_target"),
    path("corr_explore/stratify_data", views.stratify_data, name="corr_explore_stratify_data"),
]
