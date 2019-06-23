from django.urls import path
from . import views

urlpatterns = [
    path("corr_explore/home", views.home_hander, name="corr_explore_home"),
    path("corr_explore/analyze_source_target", views.get_source_target, name="corr_explore_analyze_source_target"),
    path("corr_explore/stratify_data", views.stratify_data, name="corr_explore_stratify_data"),
    path("corr_explore/reduce_dimension", views.reduce_dimension, name="corr_explore_reduce_dim_data"),
    path("corr_explore/feature_selection", views.select_features, name="corr_explore_feature_selection"),
    path("corr_explore/framingham_radiomics", views.framingham_radiomics, name="corr_explore_framingham_radiomics"),
]
