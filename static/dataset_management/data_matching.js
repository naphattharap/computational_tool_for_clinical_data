var current_last_row_idx = 0;
var len_data = 0;
var len_load = 20; // Render every 20 row.
var lim_scroll_top = 100; // 20 rows
var upload_data;
var columns;
$(document).ready(function() {
	
	// ======== Initial Display (Hide/Show) ========
	// Download data button will be available after user saves the data.
	$("#dowload_result").hide();
	
	//Toggle upload file area.
	$("#upload_file_title").click(function(e) {
		$("#upload_file_section").toggle();
	});
	
	$("#data_info_title").click(function(e) {
		$("#data_info_section").toggle();
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
					upload_data = JSON.parse(resp.table_data);
					columns = resp.table_columns;
					len_data = upload_data.length;
					current_last_row_idx = render_by_jexcel(columns, upload_data, current_last_row_idx, len_data);
					
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
