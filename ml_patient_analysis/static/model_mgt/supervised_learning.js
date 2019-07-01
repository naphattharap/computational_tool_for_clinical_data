var current_selected_file;

$(document).ready(function() {
	
	
	// ================== Toggle Events ====================
	// Click __title, hide __section
	
	$("#settings_section_title").click(function(e) {
		$("#settings_section").toggle();
	});
	
	
	//URL for listing all files
	var url_list_files = $("#url_list_all_file").attr("data-url");
	$("#dataset_file_name").autocomplete({
		source : function(request, response) {
			$.get(url_list_files, {
//				query : request.term
				query : $("#dataset_file_name").val()
			}, function(data) {
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
	
	$("#label_file_name").autocomplete({
		source : function(request, response) {
			$.get(url_list_files, {
//				query : request.term
				query : $("#label_file_name").val()
			}, function(data) {
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
	
	// When user clicks on start button.
	// Create model based on the settings.
	var url_supervised_train_test = $("#supervised_train_test").attr("data-url");
	$("#btn_create, #btn_create_save").bind("click", function(e){
		var data = get_settings();
		if(e.target.id == "btn_create_save"){
			var model_file_name = prompt("Please enter file name","");
			if(model_file_name != null && model_file_name != ""){
				data["model_file_name"] = model_file_name;
				data['is_saved'] = 1;
			}else{
				return false;
			}
		}else{
			data["model_file_name"] = "";
			data['is_saved'] = 0;
		}
		
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_supervised_train_test,
			data : data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				render_start_result(resp);
				alert_message(resp);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
	
});

/**
 * Get parameter settings' value
 * @returns An object contains entered value for settings to create model.
 */
function get_settings(){
	var data = {};
	data['sel_algorithm'] = $('#sel_algorithm').val();
	data['sel_dim_reduction'] = $('#sel_dim_reduction').val();
	data['n_components'] = $('#n_components').val();
	data['dataset_file_name'] = $('#dataset_file_name').val();
	data['column_header'] = $('#column_header').val();
	data['label_file_name'] = $('#label_file_name').val();
	data['label_column_header'] = $('#label_column_header').val();
	data['test_size'] = $('#test_size').val();
	data['sel_test_method'] = $('#sel_test_method').val();
	data['n_folds'] = $('#n_folds').val();
	return data;

}

/**
 * Render result from creating model.
 * @returns
 */
function render_start_result(data){
	console.log(data);
	$('#scores').text(data.scores);
	$('#accuracy_mean').text(data.accuracy_mean);
	$('#model_desc').text(data.model_desc);
	$('#params').text(JSON.stringify(data.params));
	
}