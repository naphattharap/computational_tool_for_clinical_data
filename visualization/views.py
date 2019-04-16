from django.shortcuts import render
from django.http import JsonResponse
from django.utils.html import escape

from naphyutils.model import ModelUtils
from naphyutils.pca import PcaUtil
from naphyutils.file import FileStorage
from naphyutils.dataframe import DataFrameUtil
from naphyutils.standardization import PreProcessingUtil

from bokeh.embed import components
from bokeh.layouts import column, row
from bokeh.models import ColumnDataSource, TableColumn, CustomJS, Div
from bokeh.plotting import figure
from bokeh.models.widgets import DataTable

import numpy as np
import pandas as pd
import logging

from .forms import FlexViewForm

logger = logging.getLogger(__name__)


def init_view(request):
    """
    Display home page of PCA
    """
    return render(request, template_name='flex_vis.html')


def flex_vis_2d_handler(request):
    resp_data = dict()
    form = FlexViewForm(request.GET)
    if form.is_valid():
        model_file_name = form.cleaned_data['model_file_name']
        data_file_name = form.cleaned_data['data_file_name']
        data_detail_file_name = form.cleaned_data['data_detail_file_name']
        
        fs = FileStorage()
        if fs.is_file_in_base_location(model_file_name) and \
            fs.is_file_in_base_location(data_file_name) and \
            fs.is_file_in_base_location(data_detail_file_name):
            
            plot = process_model_data(model_file_name, data_file_name, data_detail_file_name)
        
            resp_data['bokeh_plot'] = plot
        else:
            
            resp_data['msg_error'] = "File(s) is invalid."
    else:
        
        resp_data['msg_error'] = escape(form._errors)
    
    return JsonResponse(resp_data) 


def flex_vis_3d_handler(request):
    pass


def process_model_data(model_file_name, data_file_name, data_detail_file_name):
    # convert file to dataframe
    fs = FileStorage()
    # TODO change
    column_header_idx = None
    # Dataframe of data to process, it is new data apart from training
    df_data = DataFrameUtil.convert_file_to_dataframe(fs.get_full_path(data_file_name), \
                                             header=column_header_idx) 
    
    # Dataframe for matching index with processed data and show detail
    column_header_idx = 0
    df_data_detail = DataFrameUtil.convert_file_to_dataframe(fs.get_full_path(data_detail_file_name), \
                                             header=column_header_idx) 
    
    # Load model
    model = ModelUtils.load_model(model_file_name)
    
    # TODO!!!!!! change to DB and dynamic
    # Do PCA
    logger.debug("Dimensionality Reduction by PCA...")
    pca_helper = PcaUtil()
    # Standardize data, reduce dimensions and return as X.
    X_scaled = PreProcessingUtil.fit_transform(df_data)
    
    # TODO change n =100 to dynamic 
    X_reduced = pca_helper.get_pc(X_scaled, n_components=100)
    pred_y = model.predict(X_reduced)
    df_label = pd.DataFrame(pred_y, columns=["Label"])
    
    # TODO Keep predicted result as label
    
    # https://www.geeksforgeeks.org/different-ways-to-create-pandas-dataframe/
    X_graph = pca_helper.get_pc(X_scaled, n_components=2)
    df_data = pd.DataFrame(X_graph, columns=['PC1', 'PC2']) 
    
    df_graph = df_label.join(df_data);
    scrip, div = draw_2d(df_graph, df_data_detail)
    
    plot = dict()
    plot['script'] = scrip
    plot['div'] = div
    # Matching detail of data based row/index
    
    return plot


def draw_2d(df_graph, df_data_detail):
    """
    Source of data for plot and table must be the same so that
    it can highlight and link event to each other
    """
    # TODO change key to 0, 1 in previous process
    colormap = {'0': 'blue', '1': 'green'}
    colors = [colormap[str(int(x))] for x in df_graph['Label']]
#     colors2 = []
#     for c in df['Label']:
#         colors2.append(colormap[str(int(c))])

    # patient_id = df_data.loc[0].values.ravel()

    # TODO check this --> Take only PC1 and PC2
    # TODO change df_data_detail to read data from file
    # df_data_detail = pd.DataFrame(data=patient_id, columns=['PatientID'])
    
    df_graph = df_graph[['PC1', 'PC2']].join(df_data_detail)
    
    df_color = pd.DataFrame(data=colors, columns=['Color'])
    df_graph = df_graph.join(df_color)
    
    source = ColumnDataSource(data=df_graph)
        
    TOOLTIPS = [
        ("index", "@index"),
        ("(x,y)", "(@PC1, @PC2)"),
        ("Patient ID", "@{f.eid}"),
        ]
    # DEFAULT_TOOLS = "pan,wheel_zoom,box_zoom,save,reset,help"
    p = figure(tools="reset, pan, wheel_zoom, box_zoom, box_select, lasso_select, save, help",
               tooltips=TOOLTIPS, title="Test 2D",
               x_axis_label='PC1', y_axis_label='PC2', width=1000)
    
    # Remove scale mark
    p.xaxis.major_tick_line_color = None  # turn off x-axis major ticks
    p.xaxis.minor_tick_line_color = None  # turn off x-axis minor ticks
    p.yaxis.major_tick_line_color = None  # turn off y-axis major ticks
    p.yaxis.minor_tick_line_color = None  # turn off y-axis minor ticks
    p.xaxis.major_label_text_font_size = '0pt'  # preferred method for removing tick labels
    p.yaxis.major_label_text_font_size = '0pt'  # preferred method for removing tick labels

    # p.scatter(x, y, radius=1, fill_alpha=0.6, line_color=None)
    
    p.circle('PC1', 'PC2', size=10, source=source, alpha=0.6, fill_color='Color')
    # p.scatter('PC1', 'PC2', source=source, fill_color='Color', radius=1, fill_alpha=0.6, line_color=None)
    source.selected.js_on_change('indices', CustomJS(args=dict(source=source), code="""
        var inds = cb_obj.indices;
        var d1 = source.data;

        for (var i = 0; i < inds.length; i++) {
            console.log(d1['PC1'][inds[i]] +'|'+d1['PC2'][inds[i]] +'|'+ d1['f.eid'][inds[i]]);
        }
        """)
    )
    
#     button = Button(label="Button")
#     div = Div(id="mydiv", name="div_selected_data", width=400)
#     # Events with no attributes
#     button.js_on_event(events.ButtonClick, CustomJS(args=dict(div=div), code="""
#         div.text = "Button is clicked!";
#     """)) 
    table_columns = []
    list_columns = df_data_detail.columns.tolist()
    for col in list_columns:
#         title_col = ""
#         if "." in col:
#             # title_col = col.replace(".", ":")
#             # set to original column then rename column for data table
#             title_col = col
#             dt_col = col.replace(".", "")
#             df_data_detail = df_data_detail.rename(columns={col:dt_col})
#         else:
#             title_col = col
#             dt_col = col
        table_columns.append(TableColumn(field=col, title=col))

    # source2 = ColumnDataSource(test_data)
    source2 = ColumnDataSource(data=df_data_detail)
    data_table = DataTable(source=source, columns=table_columns, width=1000, height=280)
    # , widgetbox(data_table)
     
    # layout = column(button, row(p, div), data_table)
    layout = column(row(p), row(data_table)) 

    script, div = components(layout)
    return script, div 
