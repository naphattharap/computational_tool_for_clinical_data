from django.shortcuts import render

# Create your views here.
from django.urls import path

from . import views

# list of path, django looks for it by default
# after adding url here, go to add it in config/urls.py
urlpatterns = [
    # path("home/", MainMenuView.as_view(), name="home"),
    # Set r'' to redirect to main page as initial startup server.
    path(r'', views.go_to_homepage, name="home"),
    path("main_menu/main", views.go_to_main, name="main"),
    
]
