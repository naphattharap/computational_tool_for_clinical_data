

// Slider or Checkbox 
var pca_criterion_name = "pca_criterion";

///**
// * Bind event when clicks on Render Plot of tab#2 
// * then plot scatter plot
// * @returns none
// */
//function bind_button_pca_plot(){
//	
//	$('#btn_lda_execute').on('click', function(e){
//	//$('#btn_pca_plot, #btn_pca_lda_plot, #btn_lda_execute').on('click', function(e){
//		var btn_id = $(this).attr("id");
//		console.log(btn_id);
//		var selected_algo = ""
//
//		if(btn_id == "btn_pca_plot"){
//			selected_algo = "PCA";
//		} else if(btn_id == "btn_pca_lda_plot" || btn_id == "btn_lda_execute"){
//			selected_algo = "LDA";
//		}else{
//			console.error("Selected algorithm is not defined.")
//			return false;
//		}
//		
//		e.preventDefault();
//		// Add parameter to form
//		var form = document.getElementById('form_upload_file');
//		var form_data = get_pca_form_data(form, selected_algo);
//		// Get target URL that processes the file
//		var url = $('#data_attr').attr('data-url-dim');
//		// Upload file
//		$.ajax({
//			url : url,
//			method : form.method, // POST
//			processData : false,  // important
//			contentType : false,
//			data : form_data,
//			beforeSend: function(e){
//				$(".spinner").show();
//			},
//			complete:function(){
//				$(".spinner").hide();
//			},
//			success : function(resp) {
//				console.log(resp);
//				if(resp.msg_error != undefined &&  resp.msg_error !== ""){
//					alert_message(resp);
//					return;
//				}else{
//					//Hide previous display error (if any)
//					alert_message(resp);
//				}
//				
//				plot_reduced_dim_space(plot_reduced_dim, resp.plot_data, radiomic_layout);
//				
//			},
//			error : function(resp) {
//				alert_error_message(resp);
//			}
//		});
//	});
//}

/***
 * Select features by XGBoostClassifer or XGBoostRegressor.
 * In case target label is NOMINAL, Classifer is used, otherwise Regressor
 * @returns None
 */
function bind_select_features_by_xgboost(){
	
	//Re-submit for feature selection
	$("#reload_feature_selection").on('click', function(e){
		$('#pca_feature_selection_algo').click();
		$('#pca_feature_selection_algo').change();
	});
	
	
	var $last_selected_algo_val;
	$('#pca_feature_selection_algo').on('click', function(e){
		$last_selected_algo_val = $("#pca_feature_selection_algo option:selected");
	});
	
	$('#pca_feature_selection_algo').on('change', function(e){
//		e.preventDefault();
		
		var select_by = $(this).val();

		
		if(select_by == "MANUAL"){
			return;
		}else{
			// ===== Radio for target label
			var $selected_col_row = $('input[name="dimtarget"]:checked').attr('id');
			if($selected_col_row == undefined){
				alert("Please select target label.");
				$last_selected_algo_val.prop("selected", true);
				return false;
			}
		
		}
		
		
		// Prompt for number of features, default is 3 for 3d scatter plot
		var n_features = prompt("Please enter number of features","3");
		
		if(n_features == undefined || n_features == ""){
			return;
		}
		
		// Add parameter to form
		var form = document.getElementById('form_upload_file');
		// crsf bind here
		var form_data = new FormData(form);
		
		// Source file
		form_data.append('source_file', $('#source_file').val());
		// Label file
		var target_file = document.getElementById('target_file').files[0];
		form_data.append('target_file', target_file);
		

		var row_idx = $selected_col_row.split("-")[1];
		form_data.append('label_column_index', row_idx);
		

		// ===== Array Number Type for stratification
		var arr_numtype = [];
		$('select[name^="numtypes"').each(function(idx){
			arr_numtype.push($(this).val());
		});
		form_data.append('numtypes', arr_numtype.join(","));
		
		
		// N Feature
		form_data.append('n_features', n_features);
		
		// Algorithm
		form_data.append('algorithm', select_by);
		
		// Get target URL that processes the file
		var url = $('#data_attr').attr('data-url-fselection1');
		// Upload file
		$.ajax({
			url : url,
			method : form.method, // POST
			processData : false,  // important
			contentType : false,
			data : form_data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				console.log(resp);
				if(resp.msg_error != undefined &&  resp.msg_error !== ""){
					alert_message(resp);
					return;
				}else{
					//Hide previous display error (if any)
					alert_message(resp);
				}
				set_features(resp.sorted_important_col_names, resp.sorted_important_indexes, n_features);
				//plot_reduced_dim_space(plot_reduced_dim, resp.plot_data, radiomic_layout);
				
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
}


function set_features(sorted_important_col_names, sorted_important_indexes, n_features){
	if(sorted_important_indexes != undefined && sorted_important_indexes.length > 0){
		// Clear existing checked features
		$('input[type=checkbox][name="pca_feature_indexes"]').prop('checked', false);
		
		for(var i = 0; i < n_features; i++){
			var col_idx = sorted_important_indexes[i];
			// set "checked" at feature
			$("#pca_feature_indexes_"+col_idx).prop('checked', true);
		}
	}
}
//function get_pca_form_data(form, selected_algo){
//
//	
//	// Add parameter to form
//	var form = document.getElementById('form_upload_file');
//	
//	// crsf bind here
//	var form_data = new FormData(form);
//	
//	// Source file
//	form_data.append('source_file', $('#source_file').val());
//	
//	var target_file = document.getElementById('target_file').files[0];
//	form_data.append('target_file', target_file);
//	
//	// Source and target criterion
//	var arr_feature_indexes = [];
//	$('input[name="feature_indexes"]:checked').each(function() {
//		arr_feature_indexes.push($(this).val());
//	});
//	
//	form_data.append('pca_feature_indexes', arr_feature_indexes.join(","));
//	
//	var arr_sel_targets = [];
//	// ==== Target for filtering data before LDA 
//	$('input[name="target_strat"]:checked').each(function() {
//		arr_sel_targets.push($(this).val());
//	});
//	form_data.append('target_strat', arr_sel_targets.join(","));
//	
//	
//
//	// ===== Radio for Target Label
//	var $selected_col_row = $('input[name="target_lda_label"]:checked').attr('id');
//	if($selected_col_row == undefined){
//		msg = {msg_error: "Please select target label."};
//		alert_message(msg);
//		return false;
//	}
//	var row_idx = $selected_col_row.split(NAME_IDX_SEPARATOR)[1];
//	form_data.append('column_index', row_idx);
//	
//	// ===== Number Type
////	var number_type = $('#dimnumtype_'+row_idx).val();
////	form_data.append('numtype', number_type);
//	// ===== Array Number Type for stratification
//	var arr_numtype = [];
//	$('select[name^="numtypes"').each(function(idx){
//		arr_numtype.push($(this).val());
//	});
//	form_data.append('numtypes', arr_numtype.join(","));
//	
//	// ===== Criterion
//	// Criteria for each target column to filter data
//	var arr_criterion_name = [];
//	$("input[name^='criterion']").each(function(idx, ele){
//		arr_criterion_name.push($(this).attr('name'));
//	});
//	// Get only unique name to prevent duplicated result for checkbox
//	var arr_unique_name = $.unique(arr_criterion_name); 
//	var arr_criterion = [];
//	for (var idx in arr_unique_name){
//		var ele_name = arr_unique_name[idx];
//		var $target = $("input[name='"+ele_name+"']");
//		var ele_type = $target.attr('type');
//		if(ele_type == 'checkbox'){
//			// Get checked value data and serialize to 1d text
//			// arr_criterion.push($("input[name='"+ele_name+"']:checked").serialize());
//			var arr_checked_vals = [];
//			$("input[name='"+ele_name+"']:checked").each(function(idx){
//				arr_checked_vals.push($(this).val());
//			});
//			
//			arr_criterion.push(arr_checked_vals.join(","));
//		}else if(ele_type == 'text'){
//			var text_val = $target.val().replace("-", ",");
//			// Submit with format "1,2&2,3&...
//			arr_criterion.push(text_val);
//		}
//	}
//
//	form_data.append('criterion', arr_criterion.join("&"));
//	form_data.append('dim_algo', selected_algo);
//	
//	return form_data;
//}
function get_pca_form_data_old(form, selected_algo){

		
		// Add parameter to form
		var form = document.getElementById('form_upload_file');
		
		// crsf bind here
		var form_data = new FormData(form);
		
		// Source file
		form_data.append('source_file', $('#source_file').val());
		
		var target_file = document.getElementById('target_file').files[0];
		form_data.append('target_file', target_file);
		
		// Source and target criterion
		var arr_feature_indexes = [];
		$('input[name="pca_feature_indexes"]:checked').each(function() {
			arr_feature_indexes.push(this.value);
		});
		
		form_data.append('pca_feature_indexes', arr_feature_indexes.join(","));
		

		// ===== Radio for Target
		var $selected_col_row = $('input[name="dimtarget"]:checked').attr('id');
		if($selected_col_row == undefined){
			alert("Please select target label");
			return false;
		}
		var row_idx = $selected_col_row.split("-")[1];
		form_data.append('column_index', row_idx);
		
		// ===== Number Type
//		var number_type = $('#dimnumtype_'+row_idx).val();
//		form_data.append('numtype', number_type);
		// ===== Array Number Type for stratification
		var arr_numtype = [];
		$('select[name^="numtypes"').each(function(idx){
			arr_numtype.push($(this).val());
		});
		form_data.append('numtypes', arr_numtype.join(","));
		
		// ===== Criterion
		// Criteria for each target column to filter data
		var arr_criterion_name = [];
		$("input[name^='"+pca_criterion_name+"']").each(function(idx, ele){
			arr_criterion_name.push($(this).attr('name'));
		});
		// Get only unique name to prevent duplicated result for checkbox
		var arr_unique_name = $.unique(arr_criterion_name); 
		var arr_criterion = [];
		for (var idx in arr_unique_name){
			var ele_name = arr_unique_name[idx];
			var $target = $("input[name='"+ele_name+"']");
			var ele_type = $target.attr('type');
			if(ele_type == 'checkbox'){
				// Get checked value data and serialize to 1d text
				// arr_criterion.push($("input[name='"+ele_name+"']:checked").serialize());
				var arr_checked_vals = [];
				$("input[name='"+ele_name+"']:checked").each(function(idx){
					arr_checked_vals.push($(this).val());
				});
				
				arr_criterion.push(arr_checked_vals.join(","));
			}else if(ele_type == 'text'){
				var text_val = $target.val().replace("-", ",");
				// Submit with format "1,2&2,3&...
				arr_criterion.push(text_val);
			}
		}

		form_data.append('criterion', arr_criterion.join("&"));
		
		// ===== Dim algo
//		var selected_algo = $('input[name="dimalgo"]:checked').val();
//		if(selected_algo == undefined){
//			alert("Please select algo");
//		}
		form_data.append('dim_algo', selected_algo);
		
		return form_data;
}
/**
 * Render row for table #tbl_pca_criterion
 * @param criterions - column name
 * @returns
 */
function render_pca_criterion_table(criterions){

	if (criterions != undefined && criterions.length > 0){
		// Clear existing content in target table body
		var $tbl_body = $("#tbl_pca_criterion tbody")
		$tbl_body.empty(); 
		
		var len_data = criterions.length;
		

		
		for(var i=0; i < len_data; i++){
			
			// initial row
			var $tr = $('<tr>');
			$tr.attr('id', 'dimrow'+ NAME_IDX_SEPARATOR +i);
			
			// Radio button to select column name
			var $td_select = $('<td align="center">');
			var sel_label_id = 'dimcolumn-'+i
			var $select = $('<input>').attr({type: 'radio', id: sel_label_id, name: "dimtarget"});
			$td_select.append($select)
			
			
			row_data = criterions[i];
			
			// Column name
			var $td_col_name = $('<td>');
			//$td_col_name.text(row_data.column_name);
			
			var $label = $('<label>').attr({class:'custom-control-label', for:sel_label_id});
			$label.text(row_data.column_name);
			$td_col_name.append($label);
			
			
			// Number Type by system
			var $td_num_type = $('<td align="center">');
			// Select number type
			var num_type = row_data.number_type;
			var cloned_ele = $("#template_select_number").clone();
			cloned_ele.attr('id', 'dimnumtype'+ NAME_IDX_SEPARATOR + i);
			cloned_ele.attr('name', 'dimnumtypes');
			cloned_ele.css('display', '');
			cloned_ele.val(num_type);
			$td_num_type.append(cloned_ele);
			
			
			$td_criterion = $('<td>');
			var criterion_name = pca_criterion_name + NAME_IDX_SEPARATOR + i;
			if(num_type == "NOMINAL"){
				// Generate checkbox
				var nominal_values = row_data.nominal_values;
				
				for (var idx in nominal_values){
					var choice_val = nominal_values[idx];
					var choice_id = pca_criterion_name + "_chk" + NAME_IDX_SEPARATOR + idx;
					var $checkbox = $('<input>').attr({type: 'checkbox', id: choice_id, name: criterion_name});
					var $label = $('<label>').attr({class:'custom-control-label', for:choice_id});
					$checkbox.val(choice_val);
					$checkbox.attr('checked', 'checked');
					$label.text(choice_val);
					$td_criterion.append($checkbox);
					$td_criterion.append($label);
				} 
				
			}else if(num_type == "ORDINAL" || num_type == "INTERVAL"){
				// Generate slider
				// template for slider
//				<div>
//  				<input type="text" id="range_weight" name="range_weight" readonly style="border:0; color:#2196f3;font-weight:bold;">
//				<div id="slider-range-weight"></div>
//				</div>
				var criterion_id = pca_criterion_name + NAME_IDX_SEPARATOR + i;
				var $div_outer = $("<div/>");
				var $slider_textbox = $('<input>').attr({type: 'text', id: criterion_id, name: criterion_name});
				var slider_text = get_formatted_slider_textbox(row_data.min, row_data.max);
				$slider_textbox.val(slider_text);
				$slider_textbox.addClass('txb_slider');
				$slider_textbox.attr("readonly","readonly");
				
				// Need to set style here, otherwise the slider will excess the border
				var $div_slider = $('<div style="margin-left: 10px;"/>').attr({id: 'slider_'+criterion_id});
				
				$div_outer.append($slider_textbox);
				$div_outer.append($div_slider);
				$td_criterion.append($div_outer);
				
				// Array will be used in binding slider event
				// It has to bind after render DOM
				arr_pca_slider_min.push(row_data.min);
				arr_pca_slider_max.push(row_data.max);
			
			}
			
			// Append all td to tr
			$tr.append($td_select).append($td_col_name).append($td_num_type).append($td_criterion);
			$tbl_body.append($tr);	
		}


	}else{
		console.error('Empty array cannot be processed!');
	}
}


/**
 * Slider has to bind to textbox after object rendered,
 * so it needs to be separated.
 * @param criterions
 * @returns
 */
function bind_pca_criterion_sliders(){
	// slider_pca_criterion-0
	$("div[id^='slider_"+pca_criterion_name+"']").each(function(idx, ele){
		console.log(idx);
		var id = $(this).attr('id');
		var idx_textbox = id.split(NAME_IDX_SEPARATOR);
		min_val = arr_pca_slider_min[idx];
		max_val = arr_pca_slider_max[idx];
		$(this).slider({
			 range: true,
			 min: min_val,
			 max: max_val,
			 values: [ min_val, max_val],
			 slide: function( event, ui ) {
				 //console.log(ui);
				 var slider_text = get_formatted_slider_textbox(ui.values[0], ui.values[ 1 ])
				 $('#'+pca_criterion_name+ NAME_IDX_SEPARATOR+idx_textbox[1]).val(slider_text);
			 }
	});
	});
}



function plot_3d($target, plot_data, layout){
	if(plot_data != undefined){
		
		var trace_options = {};
		trace_options['mode'] =  "markers";
//		if (is_hidden_marker_text == true){
//			trace_options['mode'] =  "markers+text";
//		}else{
//			trace_options['mode'] =  "markers";
//		}
	
	
		//Get data to plot from df variables.
		var arr_x = plot_data.x;
		var arr_y = plot_data.y;
		var arr_z = plot_data.z;
		var arr_label = get_obj_values(JSON.parse(plot_data.label));
		legendgroup = '';
		
		data_traces = [];
		trace = {
				  x: arr_x,
				  y: arr_y,
				  z: arr_z,
				  ids: arr_label,
				  //customdata: cluster_data,
				  name: name,
				  legendgroup: legendgroup,
				  mode: trace_options['mode'],
				  type: 'scatter3d',
				  text: arr_label,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: plot3d_marker
		}//end trace
		data_traces.push(trace);
		Plotly.newPlot($target, data_traces, layout);
	}
}
