from bokeh import events
from bokeh.embed import components
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Div, Button, LassoSelectTool
from bokeh.plotting import figure
from bokeh.plotting import figure, output_file, show 
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render, render_to_response
from django.template.context_processors import request
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView


def go_to_homepage(request):
    return render(request, template_name='main_menu/index.html')

   
def go_to_main(request):
    return render(request, template_name='main_menu/main.html')
