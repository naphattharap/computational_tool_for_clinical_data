from bokeh import events
from bokeh.embed import components
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Div, Button, LassoSelectTool, Selection
from bokeh.plotting import figure
from bokeh.plotting import figure, output_file, show 
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import render, render_to_response
from django.template.context_processors import request
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from diabetes_logic.diabetes_logic import DiabetesLogic
from bokeh.models.sources import ColumnDataSource
import numpy as np
from bokeh.io import curdoc
from bokeh.layouts import widgetbox, layout
from bokeh.models.widgets import DataTable, DateFormatter, TableColumn
from bokeh.models.widgets import Panel, Tabs
import os
from bokeh.models import ColumnDataSource, Patches
from bokeh.plotting import figure
from bokeh.layouts import row
from bokeh.io import output_file, curdoc
import pandas as pd
from datetime import date
from random import randint
import pandas as pd
from idlelib import tooltip
from bokeh.models.widgets import Button, RadioButtonGroup, Select, Slider, RangeSlider
from gc import callbacks

n_samples = 100
x = np.random.randint(45, 80, n_samples)
y = np.random.randint(0, 100, n_samples)
patient_id = []
for i in range(n_samples):
   patient_id.append("patient" + str(i)) 

test_data = dict(
            x=x,
            y=y,
            patient_id=patient_id
)

tools = "reset, pan, wheel_zoom, box_zoom, box_select, lasso_select, save, help"           


# Class based view
class HelloWorld(View):

    def get(self, request):
        return HttpResponse("Hello again in eclipse")


class BokehView(View):

    def get(self, request):
        x = [1, 3, 5, 7, 9, 11, 13]
        y = [1, 2, 3, 4, 5, 6, 7]
        title = 'y = f(x)'
    
        plot = figure(title=title ,
            x_axis_label='X-Axis',
            y_axis_label='Y-Axis',
            plot_width=400,
            plot_height=400)
    
        plot.line(x, y, legend='f(x)', line_width=2)
        # Store components 
        script, div = components(plot)
    
        # Feed them to the Django template.
        return render(request, 'bokeh/index.html',
                {'script' : script , 'div' : div})


def callback_range_slider(obj):
    print("call back")

            
class VisCallBack(View):
        
    def get(self, request):

        s1 = ColumnDataSource(data=test_data)
                
        TOOLTIPS = [
            ("index", "$index"),
            ("(x,y)", "($x, $y)"),
            ("patient id", "@patient_id"),
            ]
        
        p1 = figure(
                    # plot_width=400, 
                    # plot_height=400, 
                    tools=tools,
                    title="Select Here",
                    tooltips=TOOLTIPS,)
        p1.circle('x', 'y', source=s1, alpha=0.6, size=15)
        
        s2 = ColumnDataSource(data=dict(x=[], y=[]))
        p2 = figure(plot_width=400, plot_height=400, x_range=(0, 100), y_range=(0, 100),
                    tools="", title="Watch Here")
        p2.circle('x', 'y', source=s2, alpha=0.6)
        
        s1.selected.js_on_change('indices', CustomJS(args=dict(s1=s1, s2=s2), code="""
                var tbody = $('#tbl_selected_items').children('tbody');
                             
                 var table = tbody.length ? tbody : $('#tbl_selected_items');
                 var row = '<tr>'+
                    '<td>%%seq%%</td>'+
                    '<td>%%patient_id%%</td>'+
                    '<td>%%x%%</td>'+
                    '<td>%%y%%</td>'
                '</tr>';
                 
                $('#tbl_selected_items tbody').empty();
                 
                var inds = cb_obj.indices;
                var d1 = s1.data;
                var d2 = s2.data;
                d2['x'] = []
                d2['y'] = []
                var row_no = 0;
                for (var i = 0; i < inds.length; i++) {
                    var x = d1['x'][inds[i]];
                    var y = d1['y'][inds[i]];
                    var patient_id = d1['patient_id'][inds[i]];
                    d2['x'].push(x);
                    d2['y'].push(y);
                    
                    //row_no += 1;
                    table.append(row.compose({
                    'seq': (i+1),
                    'patient_id': patient_id,
                    'x': x,
                    'y': y}));
                }
                s2.change.emit();
            """)
        )
        
        dx_min = test_data['x'].min()
        dx_max = test_data['x'].max()
        
        def callback_range_slider(source=test_data, window=None):
            
            print("call================", source)
            
        range_slider = RangeSlider(title="Filter range X", value=[dx_min, dx_max],
                                   start=dx_min, end=dx_max, step=1,
                                   callback=CustomJS.from_py_func(callback_range_slider)
                                   )

#         callback_range_slider = CustomJS(args=dict(data=test_data), code="""
#             var d = data;
#             var range_data = cb_obj.value;
#             range_data_min = range_data[0];
#             range_data_max = range_data[1];
#             console.log(range_data[0]);
#             console.log(range_data[1]);
#         """)
# 
#         range_slider.js_on_change('value', callback_range_slider)

        # range_slider.on_change('value', callback_range_slider)
        
        callback_button = CustomJS(args=dict(data=test_data), code="""
            var a = cb_obj.value;
            console.log(a[0]);
            console.log(a[1]);
        """)
        
        button_search = Button(label="Filter", width=100, disabled=False, callback=callback_button)
        
        slider = Slider(start=0, end=100, value=1, step=1, title="Range x")
        select = Select(title="Gender:", value="all", options=["all", "male", "female"])
        row_criteria = row(range_slider, slider, select)
        layout = column(row_criteria, button_search, row(p1, p2))
        script, div = components(layout)
        
        return render(request, 'report_radiomic_brain.html', {'script' : script , 'div' : div})
    
    def slider_callback(self, df, attr, old, new):
        N = new  # this works also with slider.value but new is more explicit
        new1 = ColumnDataSource(df.loc[(df.winner == 'Democratic') & (df.population >= N)])
        new2 = ColumnDataSource(df.loc[(df.winner == 'Republican') & (df.population >= N)])


class VisMultiTabs(View):

    def get(self, request):
        p1 = figure(plot_width=300, plot_height=300)
        p1.circle([1, 2, 3, 4, 5], [6, 7, 2, 4, 5], size=20, color="navy", alpha=0.5)
        tab1 = Panel(child=p1, title="circle")
        
        p2 = figure(plot_width=300, plot_height=300)
        p2.line([1, 2, 3, 4, 5], [6, 7, 2, 4, 5], line_width=3, color="navy", alpha=0.5)
        tab2 = Panel(child=p2, title="line")
        
        tabs = Tabs(tabs=[ tab1, tab2 ])
        script, div = components(tabs)
        
        return render(request, 'multi_tabs.html', {'script' : script , 'div' : div})


class VisBrainRadiomic(View):

    def get(self, request):

        s1 = ColumnDataSource(data=test_data)
        
        TOOLTIPS = [
            ("index", "$index"),
            ("(x,y)", "($x, $y)"),
            ("patient id", "@patient_id"),
            ]
        # DEFAULT_TOOLS = "pan,wheel_zoom,box_zoom,save,reset,help"
        
        p = figure(tools="reset, pan, wheel_zoom, box_zoom, box_select, lasso_select, save, help",
                   tooltips=TOOLTIPS,
                   title="Mouse over the dots")
        # p.scatter(x, y, radius=1, fill_alpha=0.6, line_color=None)
        p.circle('x', 'y', size=20, source=s1, alpha=0.6)
        s1.selected.js_on_change('indices', CustomJS(args=dict(s1=s1), code="""
            var inds = cb_obj.indices;
            var d1 = s1.data;

            for (var i = 0; i < inds.length; i++) {
                console.log(d1['x'][inds[i]] +'|'+d1['y'][inds[i]] +'|'+ d1['patient_id'][inds[i]]);
            }
            """)
        )
        
        button = Button(label="Button")
        div = Div(id="mydiv", name="div_selected_data", width=400)
        # Events with no attributes
        button.js_on_event(events.ButtonClick, CustomJS(args=dict(div=div), code="""
            div.text = "Button is clicked!";
        """)) 

        columns = [
            TableColumn(field="patient_id", title="Patient ID"),
            TableColumn(field="x", title="X"),
            TableColumn(field="y", title="Y"),
        ]

        source = ColumnDataSource(test_data)
        data_table = DataTable(source=source, columns=columns, width=400, height=280)
        # , widgetbox(data_table)
         
        # layout = column(button, row(p, div), data_table)
        layout = column(button, row(p, div), data_table) 

        script, div = components(layout)
        # script, div = components(layout)
        
        return render(request, 'report_radiomic_brain.html', {'script' : script , 'div' : div})


class VisDiabeteClassification(View):

    def get(self, request):
        diabetesLogic = DiabetesLogic()
        
        dataset_file_path = "dataset_management/diabetes.txt"
        df = diabetesLogic.read_dataset(dataset_file_path)
        source = ColumnDataSource(df);

        columns = [TableColumn(field=Ci, title=Ci) for Ci in df.columns]  # bokeh columns
        data_table = DataTable(source=source, columns=columns, width=1000,
                                    editable=True, fit_columns=True)
        script, div = components(widgetbox(data_table))
        return render(request, 'vis_diabetes.html', {'script' : script , 'div' : div, 'dataset_file_path':dataset_file_path})

# class VisBrainRadiomic(View):
#     def get(self, request):
# 
#         x = np.random.random(size=2000) * 100
#         y = np.random.random(size=2000) * 100
#         
#         p = figure(tools="box_select")
#         p.scatter(x, y, radius=1, fill_alpha=0.6, line_color=None)
#         
#         div = Div(width=400)
#         button = Button(label="Button")
#         layout = column(button, row(p, div))
#         
#         # Events with no attributes
#         button.js_on_event(events.ButtonClick,  CustomJS(args=dict(div=div), code="""
#         div.text = "Button!";
#         """)) 
#         
#         p.js_on_event(events.SelectionGeometry, CustomJS(args=dict(div=div), code="""
#         code="alert('you tapped a circle!')";
#         div.text = "Selection! <p> <p>" + JSON.stringify(cb_obj.geometry, undefined, 2);
#         """))
#         
#         script, div = components(layout)
#         
#         return render_to_response('report_radiomic_brain.html', {'script' : script , 'div' : div} )
