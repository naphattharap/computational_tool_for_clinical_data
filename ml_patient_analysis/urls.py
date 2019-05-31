"""ml_patient_analysis URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from vis_brain import urls as vis_brain_urls
from main_menu import urls as main_menu_urls
from dataset_management import urls as dataset_management_urls
from model_mgt import urls as model_mgt_urls
from dimreduction import urls as dimreduction_urls
from db import urls as db_urls
from visualization import urls as vis_urls
from cluster import urls as cluster_urls
from vis_radiomic import urls as vis_radiomic_urls
from vis_stratified_radiomic import urls as vis_stratified_radiomic_urls
from feature_analysis import urls as feature_analysis_urls

from corr_explore import urls as corr_explore_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include(corr_explore_urls)),
    
    # go to main page
    # our project app urls path
    path("", include(vis_brain_urls)),
    path("", include(main_menu_urls)),
    path("", include(dataset_management_urls)),
    path("", include(model_mgt_urls)),
    path("", include(dimreduction_urls)),
    path("", include(db_urls)),
    path("", include(vis_urls)),
    path("", include(cluster_urls)),
    path("", include(vis_radiomic_urls)),
    path("", include(vis_stratified_radiomic_urls)),
    path("", include(feature_analysis_urls))
   # path('django_plotly_dash/', include('django_plotly_dash.urls')),
]
