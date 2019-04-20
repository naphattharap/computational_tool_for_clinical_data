from django.shortcuts import render

# Create your views here.
from django.urls import path

from . import views, views_unsupervised 
urlpatterns = [
    path("model_mgt/model/supervised/home", views.supervised_learning_home_handler, name="supervised_home"),
    path("model_mgt/model/supervised/traintest", views.supervised_learning_train_test_handler, name="supervised_train_test"),
    path("model_mgt/model/unsupervised/home", views_unsupervised.unsupervised_learning_home_handler, name="unsupervised_home"),
    path("model_mgt/model/unsupervised/traintest", views_unsupervised.unsupervised_learning_train_test_handler, name="unsupervised_train_test"),
    
    path("model_mgt/model/pipeline/home", views.pipeline_home_handler, name="pipeline_home"),
    path("model_mgt/model/pipeline/run", views.pipeline_run_handler, name="pipeline_run"),
#     path("model_mgt/model/update", ModelMgt.as_view(), name="model_mgt_update"),
#     path("model_mgt/model/delete", ModelMgt.as_view(), name="model_mgt_delete"),

]
