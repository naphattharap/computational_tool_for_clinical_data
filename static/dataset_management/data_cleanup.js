var current_last_row_idx = 0;
var len_data = 0;
var len_load = 50; // Render every 500 row.
$(document).ready(function() {
	
	// ======== Initial Display ========
	// Hide preprocess area and show it after the file uploaded succesfully.
	$("#preprocess_section").hide();
	
	$("#data_check_result_section").hide();
	
	// Download data button will be available after user saves the data.
	$("#dowload_dataset").hide();
	

	//based on: http://stackoverflow.com/a/9622978
	$('#form_upload_file').on('submit', function(e) {
		e.preventDefault();
		var form = e.target;
		var data = new FormData(form);
		// console.log("upload");
		$.ajax({
			url : form.action,
			method : form.method,
			processData : false,
			contentType : false,
			data : data,
			processData : false,
			success : function(resp) {
				//alert(data.msg);
				$("#result-msg-success").text(resp.msg);
				$(".alert.alert-success").show();
				//console.log(resp.table_columns);
				//console.log(res_data.table_data);
				//render_jexcel(data.table_columns, data.table_data);
				
				// Calculate column width
				var upload_data = JSON.parse(resp.table_data);
				if(upload_data != undefined){
					current_last_row_idx = 0;
					len_data = upload_data.length;
					var columns = resp.table_columns;
					render_by_jexcel(columns, upload_data);
					// auto-toggle upload file section
					$("#data_file").toggle();
					// show preprocess area
					$("#preprocess_section").show();
					render_analysis_result(resp.analysis);
					$("#data_check_result_section").show();
				}
				
			}
		})
	});
	
	//Toggle upload file area.
	$("#upload_file_title").click(function(e) {
		$("#data_file").toggle();
	});
	

	//Toggle preprocess area
	$("#preprocess_title").click(function(e) {
		$("#preprocess_spec").toggle();
	});
	
	
	// When table is scrolled
	$("#data_table").scroll(function(){
		if($("#data_table").scrollTop < 50){
			if (current_last_row_idx != (len_data -1)) {
				//render_by_jexcel(upload_data);
			}
		}	
	});
	
	
	// When user clicks on process button.
	// Process data from current file name and show analysis result.
	var url_data_cleanup_process = $("#url_data_cleanup_process").attr("data-url");
	$("#process_dataset").bind("click", function(){
		var data = get_process_data_settings();
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_data_cleanup_process,
			data : data,
			success : function(resp) {
				var process_data = JSON.parse(resp.table_data);
				current_last_row_idx = 0;
				len_data = process_data.length;
				var columns = resp.table_columns;
				render_by_jexcel(columns, process_data);
				render_analysis_result(resp.analysis);
				
				if (resp.msg != undefined && resp.msg != ""){
					$("#result-msg-success").text(resp.msg);
					$(".alert.alert-success").show();
				}
			},
			error : function(resp) {
				$("#result-msg-error").text(resp.statusText);
				$("div.alert.alert-danger").show();
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
			var data = get_process_data_settings();
			data['save_as_name'] = save_as_name;
			$.ajax({
				type: "GET",
				dataType : "json",
				url : url_data_cleanup_save,
				data : data,
				success : function(resp) {
					// Set download file name to be able to refer later.
					$("#download_file").attr("data-download-name", save_as_name);
					
					var process_data = JSON.parse(resp.table_data);
					current_last_row_idx = 0;
					len_data = process_data.length;
					var columns = resp.table_columns;
					render_by_jexcel(columns, process_data);
					render_analysis_result(resp.analysis);
					
					// Enable Download Data button.
					$("#dowload_dataset").show();
					
					$("#result-msg-success").text(resp.msg);
					$(".alert.alert-success").show();
				},
				error : function(resp) {
					$("#result-msg-error").text(resp.statusText);
					$("div.alert.alert-danger").show();
				}
			});
		}
	});
	
	$("#dowload_dataset").bind("click", function(){
		// Check if the file does exist.
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
	
	
	
	$('#GetFile').on('click', function () {
	    $.ajax({
	        url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/172905/test.pdf',
	        method: 'GET',
	        xhrFields: {
	            responseType: 'blob'
	        },
	        success: function (data) {
	            var a = document.createElement('a');
	            var url = window.URL.createObjectURL(data);
	            a.href = url;
	            a.download = 'myfile.pdf';
	            a.click();
	            window.URL.revokeObjectURL(url);
	        }
	    });
	});
	
	
	
	
	
	
//	$('#data_table').jexcel('updateSettings', {
//	    cells: function (cell, col, row) {
//	        // If the column is number 4 or 5
//	        if (row == 2 && col == 2) {
//	            $(cell).addClass('readonly');
//	        }
//	    }
//	});
});

/**
 * Render content in table when scroll down.
 * @returns
 */
function render_by_jexcel(columns, data) {
	//Slice object based on current last row index and length of row data.
	if(data != undefined && (current_last_row_idx != len_data)){
		
		//Find then end of slice
		var temp_end_row_idx = 0;
		if(current_last_row_idx+len_load > len_data){
			temp_end_row_idx = len_data;
		}else{
			temp_end_row_idx = current_last_row_idx + len_load;
		}
		// Clear previous rendered data
		$('#data_table div').html('');
		
		$('#data_table').jexcel({
			data : data.slice(current_last_row_idx, temp_end_row_idx),
			colHeaders : columns
	//			    colWidths: [ 300, 80, 100, 100 ],
	//			    columns: [
	//			        { type: 'text' },
	//			        { type: 'numeric' },
	//			        { type: 'numeric' },
	//			        { type: 'calendar', options: { format:'DD/MM/YYYY' } },
	//			    ]
		});
		
		current_last_row_idx = temp_end_row_idx; 
	}
}

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

function get_text_width(){
	var fontSize = 12;
	test.style.fontSize = fontSize;
	//var height = (test.clientHeight + 1) + "px";
	var width = (test.clientWidth + 1); // + "px"
	return width;
}
/**
 * Read all input data that related to settings for processing dataset file.
 * @returns An object contains selected settings' value. 
 */
function get_process_data_settings(){
	var chioce_cleanup = $("input[name='choice_cleanup']:checked"). val();
	var column_header = $("input[name='column_header']:checked"). val();
	var file_name = $("input[name='data_file']").val().replace("C:\\fakepath\\","").replace("C:\/fakepath\/","")
	var exclude_columns = $("#exclude_columns").val();
	var data = {choice_cleanup: chioce_cleanup, 
				column_header: column_header, 
				file_name: file_name,
				exclude_columns: exclude_columns};
	return data;
}