var file_data = null;
var columns = null;
var current_last_row_idx = 0;
var len_data = 0;
var len_load = 20;
var current_selected_file;
var _plot_data;
var div_pca_plot; //Div object to display graph

var _data_traces = [];
var marker_size = 8;
var marker_opacity = 0.7;

var plot3d_marker = { 
	      size: marker_size,
	      opacity: marker_opacity, 
	      color: [],
	      colorscale: 'Blues', 
	      showscale: true,
	      reversescale:true,
	      colorbar:{
			        thickness: 10,
			        titleside: 'right',
			        outlinecolor: 'rgba(68,68,68,0)',
			        ticks: 'outside',
			        //ticklen: 5,
			        shoticksuffix: 'last',
			        ticksuffix: '',
			        //dtick: 0.1,
			        nticks: 10
			        
	    }
	};



var layout1 = {
	   	scene: {
			xaxis:{ title: '',
				 //backgroundcolor: "rgb(200, 200, 230)",
				 backgroundcolor: 'rgb(230, 230,230)',
				 gridcolor: "rgb(255, 255, 255)",
				 showbackground: true,
				 zerolinecolor: "rgb(255, 255, 255)"
			},
			yaxis:{title: '',
				//backgroundcolor: "rgb(230, 200,230)",
				backgroundcolor: 'rgb(230, 230,230)',
				gridcolor: "rgb(255, 255, 255)",
				showbackground: true,
				zerolinecolor: "rgb(255, 255, 255)"
			},
			zaxis:{title: '',
			 	//backgroundcolor: "rgb(230, 230,200)",
				backgroundcolor: 'rgb(230, 230,230)',
			 	gridcolor: "rgb(255, 255, 255)",
			 	showbackground: true,
			 	zerolinecolor: "rgb(255, 255, 255)"
			}},
			 
		  autosize : true,
		  title: '3D Space',
		  hovermode: 'closest', /*Change default on hover to the data point itself*/		  
};




$(document).ready(function() {

	$("#search_title").click(function(e) {
		$("#seach_criterion_section").toggle();
	});
	
	// Hide data table section at initial time and show when user has selected file.
	$("#data_table_section").hide();
	
	$("#data_table_title").click(function(e) {
		$("#data_table").toggle();
	});

	//URL for listing all files
	var url_list_files = $("#url_list_all_file").attr("data-url");
	$("#inp_dataset_name").autocomplete({
		source : function(request, response) {
			$.get(url_list_files, {
				query : request.term
			}, function(data) {
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			current_selected_file = term.item.value;
		},
		minLength : 3
	});
	
	// View PCA 3D
	$("#btn_view_data").bind("click",function(){
		//reset_const();
		//get_file_data(current_selected_file);
		
		// submit file to server and does PCA then return to plot on screen
		var formData = get_form_view_data();
		var url_pca_plot = $("#url_pca_plot").attr("data-url");
		$.ajax({
			type: "POST",
	        enctype: 'multipart/form-data',
			processData : false,
			contentType : false,
			data : formData,
			url : url_pca_plot,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				//console.log(resp);
				if(resp.msg_error == undefined){
					_data_traces = [];
					_plot_data = resp.plot //JSON.parse(resp.plot);
					graphDiv = document.getElementById('plotjs_pca_plot');
					plot_3d(graphDiv);
				}
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		}); // end ajax
	});
	
	
	// Render more data when scroll data_table
	var scrollBottom = Math.max($('.jexcel-content').height() - $('#jexcel-content').height(), 0);
    $('#jexcel-content').scrollTop(scrollBottom);
	// When table is scrolled
	$("#data_table").scroll(function(e){
		var lim_scroll = Math.max($('.jexcel-content').height() - $('#data_table').height() + 20, 0);
		//console.log("scoll is fired" + $("#data_table").scrollTop() + "lim: "+ lim_scroll);
		if($("#data_table").scrollTop() > lim_scroll){
			if (current_last_row_idx != (len_data -1)) {
				$(".spinner").show();
				current_last_row_idx = render_more_data(columns, file_data, current_last_row_idx, len_data, len_load);
				$(".spinner").hide();
				lim_scroll += lim_scroll;
			}
		}	
	});
	
	// Button Group Handler
	// Scree plot
	
	var url_pca_elbow_plot = $("#url_pca_elbow_plot").attr("data-url");
	$("#btn_elbow").bind("click",function(){
		
		//var exc_col_idx = $("#inp_exc_col_index").val().trim();
		//var col_header_idx = $("#col_header_index").val().trim();
		//var column_header = $("#column_header").val();
		// submit file to server and does PCA then return to plot on screen
		var formData = get_form_view_data();
		var url_pca_elbow_plot = $("#url_pca_elbow_plot").attr("data-url");
		$.ajax({
			type: "POST",
	        enctype: 'multipart/form-data',
			processData : false,
			contentType : false,
			data : formData,
			url : url_pca_elbow_plot,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				//console.log(resp);
				if(resp.msg_error == undefined){
					console.log(resp.bokeh_plot.script);
					// Remove previous content in div and render new data.
					$("#bokeh_plot").empty();
					$("#bokeh_plot").append(resp.bokeh_plot.script);
					$("#bokeh_plot").append(resp.bokeh_plot.div);
					
					$(".spinner").hide();
					alert_message(resp);
				}
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		}); // end ajax
		//var data = {file_name : current_selected_file, column_header: column_header, exclude_columns: ""}
//		$.ajax({
//			type: "GET",
//			dataType : "json",
//			url : url_pca_elbow_plot,
//			data : data,
//			beforeSend: function(e){
//				$(".spinner").show();
//			},
//			complete:function(){
//				$(".spinner").hide();
//			},
//			success : function(resp) {
//				
//				console.log(resp.bokeh_plot.script);
//				// Remove previous content in div and render new data.
//				$("#bokeh_plot").empty();
//				$("#bokeh_plot").append(resp.bokeh_plot.script);
//				$("#bokeh_plot").append(resp.bokeh_plot.div);
//				
//				$(".spinner").hide();
//				alert_message(resp);
//			},
//			error : function(resp) {
//				alert_error_message(resp);
//			}
//		});
	});
	

});

function reset_const(){
	file_data = null;
	columns = null;
	current_last_row_idx = 0;
	len_data = 0;
}


// outdated, wait to delete
function get_file_data(req_file_name) {
	//console.log("get: " + req_file_name);
	var url_get_file_data = $("#url_get_file_data").attr("data-url");
	data = {
		file_name : req_file_name,
		column_header: $("#column_header").val()
	}
	
	$.ajax({
		method: 'GET',
		dataType : "json",
		url : url_get_file_data,
		data : data,
		beforeSend: function(e){
			$(".spinner").show();
		},
		complete:function(){
			$(".spinner").hide();
		},
		success : function(resp) {
			//console.log(resp);
			if(resp != undefined && resp.table_columns){
				$("#data_table_section").show();
				file_data = JSON.parse(resp.table_data);
				columns = resp.table_columns;
				len_data =file_data.length; 
				current_last_row_idx = render_by_jexcel(columns, file_data, current_last_row_idx, len_data);
			}
			alert_message(resp);
		},
		error : function(resp) {
			alert_error_message(resp);
		}
	});
}


function get_form_view_data(){
	var formData = new FormData();
	var data_file = document.getElementById('data_file').files[0];
	formData.append('data_file', data_file);
	return formData;
}


var is_hidden_marker_text = false;

function plot_3d(graphDiv){
	if(_plot_data != undefined){
	var trace_options = {};
	if (is_hidden_marker_text == true){
		trace_options['mode'] =  "markers+text";
	}else{
		trace_options['mode'] =  "markers";
	}

	
		//Get data to plot from df variables.
		var arr_x = _plot_data.x;
		var arr_y = _plot_data.y;
		var arr_z = _plot_data.z;
//		var arr_label = get_obj_values(_plot_data.label);
		legendgroup = '';
		trace = {
				  x: arr_x,
				  y: arr_y,
				  z: arr_z,
//				  ids: arr_label,
				  //customdata: cluster_data,
				  name: name,
				  legendgroup: legendgroup,
				  mode: trace_options['mode'],
				  type: 'scatter3d',
//				  text: arr_label,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: plot3d_marker
		}//end trace
		_data_traces.push(trace);
		Plotly.newPlot(graphDiv, _data_traces, layout1);
	}
}

