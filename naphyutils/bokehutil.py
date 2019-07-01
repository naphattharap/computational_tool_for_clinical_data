from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.models.widgets import Panel, Tabs, DataTable, DateFormatter, TableColumn
from bokeh.embed import components
from bokeh.models import ColumnDataSource
from bokeh.layouts import widgetbox, layout

import numpy as np


def draw_scatter_with_centriod(x, y, centriods_coordinate):
 
    # Add data to source to show on hover, other data can be added here.
    data_source = ColumnDataSource(data=dict(
        x=x,
        y=y,
        centriods=centriods_coordinate
    ))
    
    # For hover event
#     TOOLTIPS = [
#         ("id", "@id")
#     ]
        
    # tooltips=TOOLTIPS,
    p1 = figure(title="Principal Component",
                tools="hover,pan,wheel_zoom,box_zoom,reset", \
                plot_width=700, plot_height=500, \
                x_axis_label='Dimension', y_axis_label='Explained Variance')

    # Refer to attribute in source.
    p1.line('x', 'y', source=data_source)
    
    tab = Panel(child=p1, title="")
    return tab
    # Add a panel to tab
#     tabs = Tabs(tabs=[ tab1 ])
#     script, div = components(tabs)
#     bokeh_plot = {'script' : script , 'div' : div}
#     return bokeh_plot
