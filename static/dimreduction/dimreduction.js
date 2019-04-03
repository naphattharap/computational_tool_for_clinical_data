var file_data = null;
var columns = null;
var current_last_row_idx = 0;
var len_data = 0;
var len_load = 50; // Render every 500 row.
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
				// assuming data is a JavaScript array such as
				// ["one@abc.de", "onf@abc.de","ong@abc.de"]
				// and not a string
				console.log(data.file_names);
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			// console.log("selected: "+event + "|" + term + "|" + item);
			// Get value from term.item.label, term.item.value
			// Get data from file to preview in table.
			current_selected_file = term.item.value;
		},
		minLength : 3
	});
	
	// Load data
	$("#btn_load_data").bind("click",function(){
		get_file_data(current_selected_file);
	});
	
	// Button Group Handler
	// Scree plot
	
	var url_pca_elbow_plot = $("#url_pca_elbow_plot").attr("data-url");
	$("#btn_elbow").bind("click",function(){
		var exc_col_idx = $("#inp_exc_col_index").val().trim();
		var col_header_idx = $("#col_header_index").val().trim();
		
		var data = {file_name : current_selected_file, column_header: col_header_idx, exclude_columns: exc_col_idx}
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_pca_elbow_plot,
			data : data,
			success : function(resp) {
				if(resp.msg){
					$("#result-msg-info").text(resp.msg);
					$("div.alert.alert-info").show();
				}
				console.log(resp.elbow_plot);
				// Remove previous content in div and render new data.
				$("#elbow").empty();
				$("#elbow").append(resp.elbow_plot.script);
				$("#elbow").append(resp.elbow_plot.div);
			},
			error : function(resp) {
				$("#result-msg-error").text(resp.statusText);
				$("div.alert.alert-danger").show();
			}
		});
	});
	

});

function get_file_data(req_file_name) {
	console.log("get: " + req_file_name);
	var url_get_file_data = $("#url_get_file_data").attr("data-url");
	data = {
		file_name : req_file_name
	}
	$.ajax({
		method: 'GET',
		dataType : "json",
		url : url_get_file_data,
		data : data,
		success : function(resp) {
			//console.log(resp);
			$("#data_table_section").show();
			render_data(resp)
			
		},
		error : function(resp) {
			//console.log(resp.responseText);
			$("#result-msg-error").text(resp.statusText);
			$("div.alert.alert-danger").show();
		}
	});
}

function render_data(resp) {
	console.log(resp.data);
	file_data = JSON.parse(resp.data);

	if(file_data != undefined ){
		len_data = file_data.length;
	}else{
		return;
	}
	//Slice object based on current last row index and length of row data.
	if (current_last_row_idx != len_data) {

		//Find then end of slice
		var temp_end_row_idx = 0;
		if (current_last_row_idx + len_load > len_data) {
			temp_end_row_idx = len_data;
		} else {
			temp_end_row_idx = current_last_row_idx + len_load;
		}
		
		// Clear previous rendered data
		$('#data_table div').html('');
		// Render data
		$('#data_table').jexcel({
			data : file_data.slice(current_last_row_idx, temp_end_row_idx),
			colHeaders : resp.columns
		});

		current_last_row_idx = temp_end_row_idx;
	}

	// Set readonly a specific column
//	$('#data_table').jexcel('updateSettings', {
//		cells : function(cell, col, row) {
//			// If the column is number 4 or 5
//			if (row == 2 && col == 2) {
//				$(cell).addClass('readonly');
//			}
//		}
//	});
}