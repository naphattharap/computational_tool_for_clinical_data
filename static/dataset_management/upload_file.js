$(document).ready(function() {
	
	// ======== Initial Display ========	
	
	//Toggle upload file area.
	$("#upload_file_title").click(function(e) {
		$("#upload_file_section").toggle();
	});
	

	//based on: http://stackoverflow.com/a/9622978
	$('#form_upload_file').on('submit', function(e) {
		e.preventDefault();
		var form = e.target;
		var formData = new FormData();
		formData.append('file_name', $('#file_name').val());
		
		var data_file = document.getElementById('data_file').files[0];
		formData.append('data_file', data_file);

		$.ajax({
			url : form.action,
			method : form.method,
			processData : false, // important
			contentType : false,
			data : formData,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		})
	});

});