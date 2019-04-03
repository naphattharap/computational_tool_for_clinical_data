from django.shortcuts import render

# Create your views here.
from django.urls import path

from .views import MainMenuView

# list of path, django looks for it by default
# after adding url here, go to add it in config/urls.py
urlpatterns = [
    # path("home/", MainMenuView.as_view(), name="home"),
    # Set r'' to redirect to main page as initial startup server.
    path(r'', MainMenuView.as_view(), name="home"),
    
]
