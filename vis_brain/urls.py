# Create your views here.
from django.urls import path

from .views import VisBrainRadiomic, VisDiabeteClassification, VisMultiTabs, VisCallBack

# list of path, django looks for it by default
# / = root when I added it , it error
# after adding url here, go to add it in config/urls.py
urlpatterns = [
    # path("", hello_world, name="hello")
#     path("", HelloWorld.as_view(), name="hello"),
#     path("bokeh/", BokehView.as_view(), name="bokeh"),
    path("radiomic_brain/", VisBrainRadiomic.as_view(), name="radiomic_brain"),
    path("vis/diabetes_class/", VisDiabeteClassification.as_view(), name="vis_diabetes_class"),
    path("vis/multi_tabs/", VisMultiTabs.as_view(), name="vis_multi_tabs"),
    path("vis/callback/", VisCallBack.as_view(), name="vis_call_back"),
    
]
