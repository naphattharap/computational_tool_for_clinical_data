var current_last_row_idx = 0;
var len_data = 0;
var len_load = 50; // Render every 500 row.
$(document).ready(function() {
	
	// ======== Initial Display (Hide/Show) ========
	// Download data button will be available after user saves the data.
	$("#dowload_result").hide();
	
	//Toggle upload file area.
	$("#upload_file_title").click(function(e) {
		$("#upload_file_section").toggle();
	});
	

	
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
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				// Calculate column width
				
				if(resp.table_data != undefined){
					var upload_data = JSON.parse(resp.table_data);
					current_last_row_idx = 0;
					len_data = upload_data.length;
					var columns = resp.table_columns;
					render_by_jexcel(columns, upload_data);
					// auto-toggle upload file section
					$("#upload_file_section").toggle();
					render_analysis_result(resp.analysis);
					
					// Enable download button
					$("#dowload_result").show();
				}
				
				if(resp.msg){
					$("#result-msg-info").text(resp.msg);
					$("div.alert.alert-info").show();
					
				}else if(resp.msg_error){
					var div_error = $('<div />').html(resp.msg_error).text();
					//console.log(div_error);
					$("div.alert.alert-danger").show();
					$("#result-msg-error").after(div_error);
				}
			},
			error : function(resp) {
				$("#result-msg-error").text(resp.statusText);
				$("div.alert.alert-danger").show();
			}
		})
	});
	
	$("#dowload_result").bind("click", function(){
		var url_download_file = $("#data_matching").attr("data-url-download");
		
		var formData = new FormData();
		var key_file = document.getElementById('key_file').files[0];
		formData.append('key_file', key_file);

		var data_file = document.getElementById('data_file').files[0];
		formData.append('data_file', data_file);
		
		console.log(formData);
		$.ajax({
			url : url_download_file,
			type: "POST",
	        enctype: 'multipart/form-data',
			processData : false,
			contentType : false,
			data : formData,
			xhrFields: {
	            responseType: 'blob'
	        },
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {

				
				var a = document.createElement('a');
	            var url = window.URL.createObjectURL(resp);
	            a.href = url;
	            a.download = "download.csv";
	            a.click();
	            window.URL.revokeObjectURL(url);
				

			},
			error : function(resp) {
				$("#result-msg-error").text(resp.statusText);
				$("div.alert.alert-danger").show();
			}
		})
	});

	
//	$("#dowload_result").bind("click", function(){
//		$("#form_upload_file").submit();
//		var url_download_file = $("#data_matching").attr("data-url-download");
//	    $.ajax({
//	        url: url_download_file,
//	        method: 'GET',
//	        data: {},
//	        xhrFields: {
//	            responseType: 'blob'
//	        },
//	        beforeSend: function(e){
//				$(".spinner").show();
//			},
//			complete:function(){
//				$(".spinner").hide();
//			},
//	        success: function (data) {
//	            var a = document.createElement('a');
//	            var url = window.URL.createObjectURL(data);
//	            a.href = url;
//	            a.download = download_file_name;
//	            a.click();
//	            window.URL.revokeObjectURL(url);
//	        }
//	    });
//	});


});

/**
 * Render content in table when scroll down.
 * @returns
 */
function render_by_jexcel(columns, data) {
	//Slice object based on current last row index and length of row data.
	if (len_data == 0){
		// Clear previous rendered data
		$('#data_table div').html('');
		$('#data_table').jexcel({
			data : {},
			colHeaders : columns
		});
		
	}else if(data != undefined && (current_last_row_idx != len_data)){
		
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
