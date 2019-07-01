var file_data = null;
var columns = null;
var current_last_row_idx = 0;
var len_data = 0;
var len_load = 20;
var current_selected_file;

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
	
	// Load data
	$("#btn_load_data").bind("click",function(){
		reset_const();
		get_file_data(current_selected_file);
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
		var column_header = $("#column_header").val();
		
		var data = {file_name : current_selected_file, column_header: column_header, exclude_columns: ""}
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_pca_elbow_plot,
			data : data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				
				console.log(resp.bokeh_plot.script);
				// Remove previous content in div and render new data.
				$("#bokeh_plot").empty();
				$("#bokeh_plot").append(resp.bokeh_plot.script);
				$("#bokeh_plot").append(resp.bokeh_plot.div);
				
				$(".spinner").hide();
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
	

});

function reset_const(){
	file_data = null;
	columns = null;
	current_last_row_idx = 0;
	len_data = 0;
}

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