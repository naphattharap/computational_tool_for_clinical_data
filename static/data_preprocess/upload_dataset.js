$(document).ready(function() {
	
	// hide div
	
    $("#data_label_row").hide();
    $("#data_row").hide();
    $("#label_row").hide()
	$("#data_key_col").hide();
	//Upload button
	$("#upload_dataset").click(function(e) {
		var csrftoken = '';
		var headers = new Headers();
		headers.append('X-CSRFToken', csrftoken);
		//alert(csrftoken);
	    var form = $("#form_upload_file");
	    var url = form.attr('action');
	    form.append('file', $('#file')[0].files[0]);
	    $.ajax({
	           type: "POST",
	           url: url,
	           data: form.serialize(), // serializes the form's elements.
	           dataType: 'jsonp',
	           success: function(data){
	               alert(data); // show response from the php script.
	           },
	           error: function (data) {
	                console.log('An error occurred.');
	                console.log(data);
	                alert(data); 
	            }
	         });
	    //e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	$("#file_spec_title").click(function(e) {
		$("#file_spec_elements").toggle();
	});

	$("#preprocess_spec_title").click(function(e) {
		$("#preprocess_spec_elements").toggle();
	});
	

	$("input[name='upload_type']").on('change click',function(){
	    selected_val = this.value;
	    console.log("selected val: "+ selected_val);
	    
	    $("#file_data_label").val("");
	    $("#data_file").val("");
	    $("#label_file").val("");
	    
	    if(selected_val == "data_label_in_one"){
	    	$("#data_label_row").show();
	    	$("#data_row").hide();
	    	$("#label_row").hide();
	    	$("#data_key_col").hide();
	    }else if(selected_val == "data_label_sep"){
	    	$("#data_row").show();
	    	$("#label_row").show();
	    	$("#data_key_col").show();
	    	$("#data_label_row").hide();
	    	
	    }else if(selected_val == "data_only"){
	    	$("#data_row").show();
	    	$("#data_label_row").hide();
	    	$("#label_row").hide();
	    	$("#data_key_col").hide();
	    }
	});
	
	// Set default selected 
	$("#rdo_data_label_sep").prop("checked", true).trigger('click');
	
	$("#rdo_sep_comma").prop("checked", true);
	
	
});