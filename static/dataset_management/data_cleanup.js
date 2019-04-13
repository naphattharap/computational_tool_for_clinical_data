var current_last_row_idx = 0;
var len_data = 0;
var len_load = 20; // Render every 500 row.
var lim_scroll_top = 100; // 20 rows
var upload_data;
var columns;
$(document).ready(function() {
	
	// ======== Initial Display ========
	// Hide preprocess area and show it after the file uploaded succesfully.
	$("#preprocess_section").hide();
	
	$("#data_check_result_section").hide();
	
	// Download data button will be available after user saves the data.
	$("#dowload_dataset").hide();
	
	// Reload dataset button will be available after data has been uploaded.
	$("#reload_dataset").hide();
	
	
	//Toggle upload file area.
	$("#upload_file_title").click(function(e) {
		$("#upload_file_section").toggle();
	});
	
	//Toggle preprocess area
	$("#preprocess_title").click(function(e) {
		$("#preprocess_group_section").toggle();
	});
	
	//based on: http://stackoverflow.com/a/9622978
	$('#form_upload_file').on('submit', function(e) {
		e.preventDefault();
		var form = e.target;
		// form.append('csrfmiddlewaretoken', $("csrfmiddlewaretoken").val())
		$.ajax({
			url : form.action,
			method : form.method,
			processData : false, // important
			contentType : false,
			data : data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				if(resp.msg_error == undefined){
					upload_data = JSON.parse(resp.table_data);
					if(upload_data != undefined){
						current_last_row_idx = 0;
						len_data = upload_data.length;
						columns = resp.table_columns;
						current_last_row_idx = render_by_jexcel(columns, upload_data, current_last_row_idx, len_data);
						// auto-toggle upload file section
						$("#data_file").toggle();
						// show preprocess area
						$("#preprocess_section").show();
						render_analysis_result(resp.analysis);
						$("#data_check_result_section").show();
						
						$("#reload_dataset").show();
						
						$(".spinner").hide();
						alert_message(resp);
					}else{
						upload_data = null;
					}
				}else{
					alert_error_message(resp);
				}
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		})
	});
	
	// When user clicks on process button.
	// Process data from current file name and show analysis result.
	var url_data_cleanup_process = $("#url_data_cleanup_process").attr("data-url");
	$("#process_dataset").bind("click", function(){
		var formData = get_form_process_data();
		$.ajax({
			type: "POST",
	        enctype: 'multipart/form-data',
			processData : false,
			contentType : false,
			data : formData,
			url : url_data_cleanup_process,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				if(resp.msg_error == undefined){
					upload_data = JSON.parse(resp.table_data);
					columns = resp.table_columns;
					current_last_row_idx = 0;
					len_data = upload_data.length;
					current_last_row_idx = render_by_jexcel(columns, upload_data, current_last_row_idx, len_data);
					render_analysis_result(resp.analysis);
					
					
				}
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
	
	
	// Save as.. button
	$("#save_dataset").bind("click", function(){
		var save_as_name = prompt("Please enter file name and file extension (default is .csv)","");
		if(save_as_name != null && save_as_name != ""){
			// Send settings information to process original data and save as a new file.
			// then enable download button.
			var url_data_cleanup_save = $("#url_data_cleanup_save").attr("data-url");
			var formData = get_form_process_data();
			formData.append('save_as_name', save_as_name);
			$.ajax({
				type: "POST",
		        enctype: 'multipart/form-data',
				processData : false,
				contentType : false,
				data : formData,
				url : url_data_cleanup_save,
				beforeSend: function(e){
					$(".spinner").show();
				},
				complete:function(){
					$(".spinner").hide();
				},
				success : function(resp) {
					// Set download file name to be able to refer later.
					$("#download_file").attr("data-download-name", save_as_name);
					
					var process_data = JSON.parse(resp.table_data);
					current_last_row_idx = 0;
					len_data = process_data.length;
					var columns = resp.table_columns;
					current_last_row_idx = render_by_jexcel(columns, process_data, current_last_row_idx, len_data);
					render_analysis_result(resp.analysis);
					
					// Enable Download Data button.
					$("#dowload_dataset").show();
					
					alert_message(resp);
				},
				error : function(resp) {
					alert_error_message(resp);
				}
			});
		}
	});
	
	$("#dowload_dataset").bind("click", function(){
		// Check if the file does exist.
		//$('#data_table').jexcel('download');
		var download_file_name = $("#download_file").attr("data-download-name");
		if(download_file_name != undefined && download_file_name != ""){
			var url_download_file = $("#download_file").attr("data-url");
			var data = {file_name: download_file_name};
		    $.ajax({
		        url: url_download_file,
		        method: 'GET',
		        data: data,
		        xhrFields: {
		            responseType: 'blob'
		        },
		        beforeSend: function(e){
					$(".spinner").show();
				},
				complete:function(){
					$(".spinner").hide();
				},
		        success: function (data) {
		            var a = document.createElement('a');
		            var url = window.URL.createObjectURL(data);
		            a.href = url;
		            a.download = download_file_name;
		            a.click();
		            window.URL.revokeObjectURL(url);
		        }
		    });
		}
	});

	var scrollBottom = Math.max($('.jexcel-content').height() - $('#jexcel-content').height(), 0);
    $('#jexcel-content').scrollTop(scrollBottom);
	// When table is scrolled
	$("#data_table").scroll(function(e){
		var lim_scroll = Math.max($('.jexcel-content').height() - $('#data_table').height() + 20, 0);
		//console.log("scoll is fired" + $("#data_table").scrollTop() + "lim: "+ lim_scroll);
		if($("#data_table").scrollTop() > lim_scroll){
			if (current_last_row_idx != (len_data -1)) {
				$(".spinner").show();
				current_last_row_idx = render_more_data(columns, upload_data, current_last_row_idx, len_data, len_load);
				$(".spinner").hide();
				lim_scroll += lim_scroll;
			}
		}	
	});
	
	
	$("#reset_form").bind("click",function(e){
		$("input[name='choice_cleanup']:checked").each(function(e){
			$(this).prop('checked', false);
		});
		
		$("#exclude_columns").val("");
		$("#remain_columns").val("");
		$("#split_row_from").val("");
		$("#split_row_to").val("");
	});
});

/**
 * Set value of analysis result to target fields.
 * @param analysis
 * @returns
 */
function render_analysis_result(analysis){
	$("#columns_nan").text((analysis.columns_nan.length != 0)? analysis.columns_nan: "-");
	$("#n_rows_nan").text(analysis.n_rows_nan);
	$("#columns_null").text((analysis.columns_null.length != 0)? analysis.columns_null: "-");
	$("#n_rows_null").text(analysis.n_rows_null);
	$("#n_columns").text(analysis.n_columns);
	$("#n_rows").text(analysis.n_rows);
	
}

/**
 * Read all input data that related to settings for processing dataset file.
 * @returns An object contains selected settings' value. 
 */
function get_process_data_settings(){
	var chioce_cleanup = $("input[name='choice_cleanup']:checked"). val();
	var column_header = $("input[name='column_header']:checked"). val();
	//var data_file = $("input[name='data_file']").val().replace("C:\\fakepath\\","").replace("C:\/fakepath\/","")
	var exclude_columns = $("#exclude_columns").val();
	var remain_columns = $("#remain_columns").val();
	var split_row_from = $("#split_row_from").val();
	var split_row_to = $("#split_row_to").val();
	var data = {choice_cleanup: chioce_cleanup, 
				column_header: column_header, 
				//data_file: data_file,
				exclude_columns: exclude_columns,
				remain_columns: remain_columns,
				split_row_from: split_row_from,
				split_row_to: split_row_to};
	
	return data;
}

function get_form_process_data(){
	var formData = new FormData();
	var data_file = document.getElementById('data_file').files[0];
	formData.append('data_file', data_file);
	var data = get_process_data_settings();
	formData.append('choice_cleanup', data['choice_cleanup']);
	formData.append('column_header', data['column_header']);
	formData.append('exclude_columns', data['exclude_columns']);
	formData.append('remain_columns', data['remain_columns']);
	formData.append('split_row_from', data['split_row_from']);
	formData.append('split_row_to', data['split_row_to']);

	return formData;
}