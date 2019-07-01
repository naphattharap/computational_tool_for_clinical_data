
/**
 * Render feature 
 * @param arr_features
 * @returns
 */
function render_feature_columns($target, checkbox_name, arr_features){
// HTML to append to target
//	<div class="form-group row ustom-control custom-checkbox">
//		<input type="checkbox" id="feature1"  name="feature_indexes" class="custom-control-input">
//		<label class="custom-control-label" for="feature1">Volume MYO ES</label> -->
//	</div>
	
	if (arr_features != undefined && arr_features.length > 0){
		// Clear existing content in target div
		// var $target = $('#feature_list');
		$target.html("");
		
		len_data = arr_features.length;
		
		for(var i=0; i < len_data; i++){
			col_name = arr_features[i];
			$div = $('<div/>').attr({class:"form-group row ustom-control custom-checkbox"});
			var feature_id = checkbox_name + "_" + i;
			var $checkbox = $('<input>').attr({type: 'checkbox',id: feature_id, name: checkbox_name});
			// Set feature column index to value and will be used in backend.
			$checkbox.val(i);
			$div.append($checkbox);
			var $label = $('<label>').attr({class:'custom-control-label', for:feature_id});
			$label.text(col_name);
			$label.appendTo($div);
			$target.append($div);
		}
	
	
	}else{
		console.error('Empty array cannot be processed!');
	}
	
	// Bind event on click at select/clear all checkbox
	$('#chk_all_features').on('click',function(){
		if($(this).is(':checked')){
			$('input[type=checkbox][name="feature_indexes"]').prop('checked', true);
		}else{
			// Set all rows' background color
			$('input[type=checkbox][name="feature_indexes"]').prop('checked', false);
		}
	});
}


/**
 * Render feature 
 * @param arr_features
 * @returns
 */
function render_mean_bar_criterion_table(criterions){
	arr_slider_min = [];
	arr_slider_min = [];
	if (criterions != undefined && criterions.length > 0){
		// Clear existing content in target div
		//var $target = $('#tbl_criterion');
		$("#tbl_criterion tbody").empty(); 
		
		var len_data = criterions.length;
		
		for(var i=0; i < len_data; i++){
			var row_data = criterions[i];
			var criterion_name = "criterion_" + i;
			var suffix = NAME_IDX_SEPARATOR+i;
			
			var $tr = $('<tr>');
			$tr.attr('id', 'row' + NAME_IDX_SEPARATOR +i);
			// Include data in filter process or not
			var $td_inc_target = $('<td align="center">');
			
			var $td_col_name = $('<td>');
			$td_col_name.attr('id', 'target_col_name' + NAME_IDX_SEPARATOR +i);
			
			var $td_num_type = $('<td align="center">');
			var $td_criterion = $('<td>');
			var $td_bin = $('<td align="center">');
			var $td_groupby = $('<td align="center">');
			
			// Include data
			var $checkbox_inc_target = $('<input>').attr({type: 'checkbox', id: "target_strat" + suffix, name: "target_strat" });
			// Add i as column index in csv for target
			$checkbox_inc_target.val(i);
			// set default to "checked"
			$checkbox_inc_target.attr('checked', 'checked');
			$td_inc_target.append($checkbox_inc_target);
			
			// Column name
			$td_col_name.text(row_data.column_name);
			
			// Select number type
			var num_type = row_data.number_type;
			var cloned_ele = $("#template_select_number").clone();
			cloned_ele.attr('id', 'numtype_' + i);
			cloned_ele.attr('name', 'numtypes');
			cloned_ele.css('display', '');
			cloned_ele.val(num_type);
			$td_num_type.append(cloned_ele);
			
			// Slider or Checkbox 
			if(num_type == "NOMINAL"){
				// Generate checkbox
				var nominal_values = row_data.nominal_values;
				
				for (var idx in nominal_values){
					var choice_val = nominal_values[idx];
					var choice_id = choice_val + idx;
					var $checkbox = $('<input>').attr({type: 'checkbox', id: choice_id, name: criterion_name});
					var $label = $('<label>').attr({class:'custom-control-label criterion_checkbox_label', for:choice_id});
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
				var $div_outer = $("<div/>");
				var $slider_textbox = $('<input>').attr({type: 'text', id: criterion_name, name: criterion_name});
				var slider_text = get_formatted_slider_textbox(row_data.min, row_data.max);
				$slider_textbox.val(slider_text);
				$slider_textbox.addClass('txb_slider');
				$slider_textbox.attr("readonly","readonly");
				
				// Need to set style here, otherwise the slider will excess the border
				var $div_slider = $('<div style="margin-left: 10px;"/>').attr({id: 'slider-'+criterion_name});
				
				$div_outer.append($slider_textbox);
				$div_outer.append($div_slider);
				$td_criterion.append($div_outer);
				
				arr_slider_min.push(row_data.min);
				arr_slider_max.push(row_data.max);
			
			}

			var $bin = $('<input>').attr({type: 'text', id: 'bin_'+i, name: "bin"});
			$bin.addClass('txb_num_fix_small txb_inactive');
			$bin.attr('readonly', 'readonly');
			$td_bin.append($bin);
			
			var $groupby = $('<input>').attr({type: 'text', id: 'groupby_'+i, name: "groupby"});
			$groupby.addClass('txb_num_fix_small');
			$td_groupby.append($groupby);
			
			
			// Append all td to tr
			$tr.append($td_inc_target).append($td_col_name).append($td_num_type).append($td_criterion).append($td_groupby).append($td_bin);
			$("#tbl_criterion tbody").append($tr);
			
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
function bind_mean_bar_criterion_sliders(){
	
	$('#chk_inc_all_targets').on('click',function(){
		if($(this).is(':checked')){
			$('input[type=checkbox][name="target_strat"]').prop('checked', true);
			// Clear all rows' background color
			// $('#tbl_criterion tbody').css('background-color','')
			$("#tbl_criterion").find("tbody>tr").each(function(e){
				$(this).css('background-color','');
			});
		}else{
			// Set all rows' background color
			$('input[type=checkbox][name="target_strat"]').prop('checked', false);
			//$('#tbl_criterion tbody').css('background-color','#eeeeee');	
			$("#tbl_criterion").find("tbody>tr").each(function(e){
				$(this).css('background-color','#eeeeee');
			});
		}
	});
	
	$("div[id^='slider-criterion_']").each(function(idx, ele){
		//console.log(idx);
		var id = $(this).attr('id');
		var idx_textbox = id.split("_");
		min_val = arr_slider_min[idx];
		max_val = arr_slider_max[idx];
		$(this).slider({
			 range: true,
			 min: min_val,
			 max: max_val,
			 values: [ min_val, max_val],
			 slide: function( event, ui ) {
				 //console.log(ui);
				 var slider_text = get_formatted_slider_textbox(ui.values[0], ui.values[ 1 ])
				 $('#criterion_'+idx_textbox[1]).val(slider_text);
			 }
	});
	});
	
	// Bind checkbox onclick event
	$("input[name='target_strat']").each(function(idx, ele){

		$(this).on('click',function(e){
			var myid = $(this).attr('id');
			var row_idx = myid.split(NAME_IDX_SEPARATOR)[1];
			var $row = $("#row" + NAME_IDX_SEPARATOR + row_idx);
			if($(this).is(":checked")){
				// clear row background color when it is selected.
				$row.css('background-color','');
			}else{
				// add gray background color for unselected row
				$row.css('background-color','#eeeeee');
			}
		});
		
	});
	
}



function bind_mean_bar_groupby_events(){
	$('input[name="groupby"]').each(function(idx){
		var $obj_gb = $(this);
		$obj_gb.on('change', function(){
			var val = $(this).val()
			var id_idx = $(this).attr('id').split('_')[1];
			var $bin_target = $('#bin_'+id_idx);
			if(val != ""){
				var $numtype_target = $('#numtype_'+id_idx);
				var numtype_val = $numtype_target.val();
				// bin value setting, only valid for interval and ordinal
				if(numtype_val == 'INTERVAL' || numtype_val == 'ORDINAL'){
					$bin_target.attr('readonly',false);
					$bin_target.removeClass('txb_inactive');
					$bin_target.addClass('txb_active_require');
				}
			}else{
				$bin_target.attr('readonly',true);
				$bin_target.addClass('txb_inactive');
				$bin_target.val('');
				$bin_target.removeClass("txb_active_require");
			}
		});

	});
}

//$('input[name="groupby"').each(function(idx){
//	$(this).on("change", function(e){
//        if($(this).val() == ""){
//            var obj_id = $(this).attr("id");
//            console.log(obj_id);
//            var row_idx = obj_id.split("_")[1];                                
//           $('#bin_'+ row_idx).val("");
//           $('#bin_'+ row_idx).removeClass("txb_active_require");
//        }
//    });
//});



/**
 * Bind event when clicks on Render Plot of tab#1 
 * then call plot stratify bar chart of mean value
 * @returns none
 */
function bind_render_mean_bar_plot(){
	$('#btn_reduced_dim_execute, #btn_fs_execute, #btn_mean_bar, #btn_fmh_score, #btn_feature_variance, #btn_fmh_radiomics_corr').on('click', function(e){
		// Get target URL that processes the file
		//$('#form_upload_file').submit(function(e){
			// Upload file and render result
			e.preventDefault();
			
			// Add parameter to form
			var form = document.getElementById('form_upload_file');
			// crsf bind here
			var form_data = new FormData(form);
			
			// Source file
			form_data.append('source_file', $('#source_file').val());
			
			var target_file = document.getElementById('target_file').files[0];
			form_data.append('target_file', target_file);
			
			var btn_id = $(this).attr('id');
			
			var is_calc_framingham = false;
			var target_action = "";
			var url = ""
			if(btn_id == "btn_fs_execute"){
				target_action =  "xgboost";
				form_data.append("target_action",target_action);
				url = $('#data_attr').attr('data-url-strat');
				// Bind data for xgboost
				var arr_target_labels = [];
				$('input[name="target_labels"]:checked').each(function() {
					arr_target_labels.push($(this).val());
				});
				form_data.append('target_labels', arr_target_labels.join(","));
				var n_feature_selection = $('#n_feature_selection').val();
				if(n_feature_selection == ""){
					msg = {msg_error: "Please enter number of features."};
					alert_message(msg);
					return false;
				}
				//alert(n_feature_selection);
				form_data.append('n_feature_selection', n_feature_selection);
				
			}else if (btn_id == "btn_fmh_score"){
				url = $('#data_attr').attr('data-url-strat');
				//is_calc_framingham = true;
				//form_data.append('is_calc_framingham', 'yes');
				target_action =  "framingham";
				form_data.append("target_action",target_action);
				
			}else if(btn_id == "btn_feature_variance"){
				url = $('#data_attr').attr('data-url-strat');
				//form_data.append('is_calc_framingham', 'no');
				target_action = "feature_variance";
				form_data.append("target_action", target_action);
				
			}else if(btn_id == "btn_mean_bar"){
				url = $('#data_attr').attr('data-url-strat');
				target_action = "stratify";
				form_data.append("target_action", target_action);
			}
			
//			else if (btn_id == "btn_pca_plot"){
//				form_data.append('dim_algo', 'PCA');
//				target_action = "pca";
//				url = $('#data_attr').attr('data-url-dim');
//
//			}
			else if(btn_id == "btn_reduced_dim_execute"){
				var $selected_col_row = $('input[name="target_reduced_dim_label"]:checked').attr('id');
				if($selected_col_row == undefined){
					msg = {msg_error: "Please select a target label."};
					alert_message(msg);
					return false;
				}
				var row_idx = $selected_col_row.split(NAME_IDX_SEPARATOR)[1];
				form_data.append('column_index', row_idx);
				
				form_data.append('dim_algo', dim_algo);
				if(dim_algo == "LDA"){
					target_action = "lda";
				}else if(dim_algo == "PCA"){
					target_action = "pca";
				} 
				
				
				
				url = $('#data_attr').attr('data-url-dim');
				
			}else if(btn_id == 'btn_fmh_radiomics_corr'){
				target_action = "framingham_radiomics";
				url = $('#data_attr').attr('data-url-fmhradiomics');
			}
			
			// Source and target criterion
			var arr_feature_indexes = [];
			$('input[name="feature_indexes"]:checked').each(function() {
				arr_feature_indexes.push($(this).val());
			});
			// not required when click xgboost
			form_data.append('feature_indexes', arr_feature_indexes.join(","));
			
			
			// Selected column index in target file for filtering
			var arr_sel_targets = [];
			var arr_numtype = [];
			var arr_criterion = [];
			var arr_groupby = []
			var arr_bin = [];
			$('input[name="target_strat"]:checked').each(function() {
				arr_sel_targets.push($(this).val());
			});
			
			// Submit only selected target rows.
			len_sel_targets = arr_sel_targets.length;
			if (len_sel_targets > 0){
				for(var i =0; i < len_sel_targets; i++){
					var row_idx = arr_sel_targets[i];
					
					var numtype = $('#numtype_'+row_idx).val()
					arr_numtype.push(numtype);
					
					var arr_checked_vals = [];
					$('input[name="criterion_'+row_idx+'"]').each(function(idx, ele){
						//console.log(ele_type);
						//console.log(($(this).attr("checked") == "checked"));
						var ele_type = $(this).attr('type');
						if(ele_type == 'checkbox' && $(this).is(":checked")){
							arr_checked_vals.push($(this).val());
						}else if(ele_type == 'text'){
							var text_val = $(this).val().replace("-", ",");
							// Submit with format "1,2&2,3&...
							arr_checked_vals.push(text_val);
						}
					});
					
					arr_criterion.push(arr_checked_vals.join(","));
					
					//Group by
					var groupby = $('#groupby_'+row_idx).val();
					arr_groupby.push(groupby);
					
					// Bin
					var bin = $('#bin_'+row_idx).val();
					arr_bin.push(bin);
					
				}
			}

			
			form_data.append('target_strat', arr_sel_targets.join(","));
			form_data.append('numtypes', arr_numtype.join(","));
			form_data.append('criterion', arr_criterion.join("&"));
			form_data.append('groupby', arr_groupby.join(","));
			form_data.append('bin', arr_bin.join(","));
			
			
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
					if (target_action == "stratify"){
						plot_strat_mean_bar(resp.traces);
						plot_feature_variance_bar(resp.feature_variances);
						//$("#plot_fmh_mean_bar").html("")
					}else if(target_action == "framingham"){
						// For all gender
						//plot_radiomics_fmh(resp.traces);
						plot_radiomics_fmh_by_gender(resp.traces.traces_female, 'Framingham 10-year risk in % for Female', 0);
						plot_radiomics_fmh_by_gender(resp.traces.traces_male, 'Framingham 10-year risk in % for Male', 1);
						
					//}else if(target_action == "feature_variance"){
					//	plot_feature_variance_bar(resp.feature_variances);
					}else if(target_action == "xgboost"){
						// check at target feature
						select_features_xgboost(resp.feature_selection.col_name, 
												resp.feature_selection.col_idx);
						// Prepare message for information dialog
						score_msg = "Train Score: "+ resp.feature_selection.train_score +
						HTML_BR + "Test Score: " + resp.feature_selection.test_score;	
						
						// Duplicated features
						var dup_features = resp.feature_selection.duplicated_features
						if (dup_features != undefined && dup_features.length > 0){
							str_dup_features =  dup_features.join(",");
							str_dup_features = str_dup_features.replace(/,/gi,", "+HTML_BR);
							score_msg = score_msg + HTML_BR + HTML_BR + "Duplicated features: "+ HTML_BR + str_dup_features;
							
						}
						
						score_msg = score_msg + HTML_BR + HTML_BR + "Selected Features: " + HTML_BR;
						
						str_msg = resp.feature_selection.col_name.join(",");
						str_msg = str_msg.replace(/,/gi,", "+HTML_BR);
						
						msg = {msg_info: score_msg + str_msg};
						alert_message(msg);
					}else if(target_action == "lda"){
						plot_reduced_dim_space(plot_reduced_dim_lda, resp.plot_data, "LDA Radiomics Space");
					}else if( target_action == "pca"){
						plot_reduced_dim_space(plot_reduced_dim_pca, resp.plot_data, "PCA Radiomics Space");
					}
					else if(target_action = "framingham_radiomics"){
						plot_radiomics_fmh_corr(resp.framingham_radiomics_corr);
					}
				},
				error : function(resp) {
					alert_error_message(resp);
				}
				
			});
	});
}

function select_features_xgboost(sorted_important_col_names, sorted_important_indexes){
	if(sorted_important_indexes != undefined && sorted_important_indexes.length > 0){
		// Uncheck existing checked features
		$('input[type=checkbox][name="feature_indexes"]').prop('checked', false);
		// Join ndarray 
		var str_idx = sorted_important_indexes.join(',');
		var arr_idx = str_idx.split(",");
		var len = arr_idx.length;
		for(var i = 0; i < len; i++){
			var col_idx = arr_idx[i];
			// set "checked" at feature
			$("#feature_indexes_"+col_idx).prop('checked', true);
		}
	}
}
/**
 * Submit to get feature selection result by xgboost 
 * and check the checkbox for corresponding features
 * @returns
 */
function bind_xgboost_regressor(){
	$('#btn_xgboostregressor').on('click', function(e){
		// get checked stratified column
		var target_label_name = "target_labels";
		var $div_target = $('#target_label_list');	
		// clear previous html
		$div_target.html('');
		var elements = $('input[name="target_strat"]:checked').each(function(e){
			// get value for column index in csv file based on selected strat data
			var col_idx = $(this).val();
			// render checkbox for target label
			var col_name = $('#target_col_name'+ NAME_IDX_SEPARATOR +col_idx).text()
			var chk_id = target_label_name + NAME_IDX_SEPARATOR + col_idx;
			var $checkbox = $('<input>').attr({type: 'checkbox', id: chk_id, name: target_label_name});
			var $label = $('<label>').attr({class:'custom-control-label criterion_checkbox_label', for:chk_id});
			
			$checkbox.val(col_idx);
			$checkbox.attr('checked', 'checked');
			$label.text(col_name);
			$div_target.append($checkbox).append($label);
		});
		$('#sel_target_labels_modal').modal('show');	
	});
}

/**
 * Render radio button for select label of LDA algo.
 * @returns
 */
function bind_reduced_dim(){
	$('#btn_lda_plot,  #btn_pca_plot').on('click', function(e){
		// Set flag to global param
		var myid = $(this).attr('id');
		if (myid == "btn_lda_plot"){
			dim_algo = "LDA";
		}else if(myid == "btn_pca_plot"){
			dim_algo = "PCA";
		}
		
		// get checked stratified column
		var target_label_name = "target_reduced_dim_label";
		var $div_target = $('#target_reduced_dim_label_list');	
		// clear previous html
		$div_target.html('');
		var elements = $('input[name="target_strat"]:checked').each(function(e){
			// get value for column index in csv file based on selected strat data
			var col_idx = $(this).val();
			// render radio for target label
			// - get column text
			var col_name = $('#target_col_name'+ NAME_IDX_SEPARATOR +col_idx).text()
			var chk_id = target_label_name + NAME_IDX_SEPARATOR + col_idx;
			var $radio = $('<input>').attr({type: 'radio', id: chk_id, name: target_label_name});
			var $label = $('<label>').attr({class:'custom-control-label criterion_checkbox_label', for:chk_id});
			
			$radio.val(col_idx);
			//$checkbox.attr('checked', 'checked');
			$label.text(col_name);
			$div_target.append($radio).append($label);
		});
		$('#sel_reduced_dim_target_label_modal').modal('show');	
	});
}

/**
 * Bind event when clicks on Render Plot of tab#2 
 * then plot scatter plot
 * @returns none
 */
/*
function bind_button_lda_execute(){
	
	$('#btn_lda_execute').on('click', function(e){
	//$('#btn_pca_plot, #btn_pca_lda_plot, #btn_lda_execute').on('click', function(e){
		var btn_id = $(this).attr("id");
		console.log(btn_id);
		var selected_algo = ""

		if(btn_id == "btn_pca_plot"){
			selected_algo = "PCA";
		} else if(btn_id == "btn_pca_lda_plot" || btn_id == "btn_lda_execute"){
			selected_algo = "LDA";
		}else{
			console.error("Selected algorithm is not defined.")
			return false;
		}
		
		e.preventDefault();
		// Add parameter to form
		var form = document.getElementById('form_upload_file');
		var form_data = get_reduced_dim_form_data(form, selected_algo);
		// Get target URL that processes the file
		var url = $('#data_attr').attr('data-url-dim');
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
				
				plot_reduced_dim_space(plot_reduced_dim, resp.plot_data, radiomic_layout);
				
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
}

function get_reduced_dim_form_data(form, selected_algo){
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
	$('input[name="feature_indexes"]:checked').each(function() {
		arr_feature_indexes.push($(this).val());
	});
	
	form_data.append('feature_indexes', arr_feature_indexes.join(","));
	
	var arr_sel_targets = [];
	// ==== Target for filtering data before LDA 
	$('input[name="target_strat"]:checked').each(function() {
		arr_sel_targets.push($(this).val());
	});
	form_data.append('target_strat', arr_sel_targets.join(","));
	
	

	// ===== Radio for Target Label
	var $selected_col_row = $('input[name="target_lda_label"]:checked').attr('id');
	if($selected_col_row == undefined){
		msg = {msg_error: "Please select target label."};
		alert_message(msg);
		return false;
	}
	var row_idx = $selected_col_row.split(NAME_IDX_SEPARATOR)[1];
	form_data.append('column_index', row_idx);
	
	// ===== Number Type
//	var number_type = $('#dimnumtype_'+row_idx).val();
//	form_data.append('numtype', number_type);
	// ===== Array Number Type for stratification
	var arr_numtype = [];
	$('select[name^="numtypes"').each(function(idx){
		arr_numtype.push($(this).val());
	});
	form_data.append('numtypes', arr_numtype.join(","));
	
	// ===== Criterion
	// Criteria for each target column to filter data
	var arr_criterion_name = [];
	$("input[name^='criterion']").each(function(idx, ele){
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
	form_data.append('dim_algo', selected_algo);
	
	return form_data;
}
*/
/**
 * Plot bar chart of stratification result in group of radiomic feature
 * @param traces
 * @returns
 */
function plot_strat_mean_bar(traces){
	if(traces != undefined && traces.length > 0){
		// data for keeping all traces
		var data = [];
		for(t_idx in traces){
			temp_trace = traces[t_idx];
			// Generate array of duplicate trace name for grouping bar in case there are many groups
			var t_name = temp_trace.trace_name
			var len_group_item = temp_trace.x_labels.length
			var arr_t_name = []
			for(var i = 0; i < len_group_item; i++){
				arr_t_name.push(t_name);
			}
			var trace = {
					  x: [arr_t_name, temp_trace.x_labels],
					  y: temp_trace.y_values,
					  text: temp_trace.n_group_member.map(String), // show text on bar
					  textposition: 'top center',
					  name: t_name,
					  type: 'bar'
					  //width: 0.3
				};
			data.push(trace);
		}// end of for
		
		var layout = {
				  autosize: true,
				  showlegend: true,
				  title: {
					    text:'Mean Value of Radiomic Features'
				  },
//				  width: 1200,
//				  height: 500,
				  xaxis: {
//					 title: 'Mean Value of Radiomic Features',
//					type: 'category', // error for this
//					automargin: true,
					tickangle: 35,
//				    tickson: "boundaries",
//				    ticklen: 10,
				    showdividers: false, // vertical line between group
//				    dividercolor: 'grey',
//				    dividerwidth: 0
				  }, 
				  barmode: 'group',
//				  bargap: 0.25,
				  bargroupgap: 0.25
				};
		
		Plotly.newPlot('plot_strat_mean_bar', data, layout);
			
	}	
}

/**
 * Plot bar chart of framingham risk score, corresponding to stratification result
 * @param traces
 * @returns
 */
function plot_radiomics_fmh(traces){
	if(traces != undefined && traces.length > 0){
		// data for keeping all traces
		var data = [];
		for(t_idx in traces){
			temp_trace = traces[t_idx];
			// Generate array of duplicate trace name for grouping bar in case there are many groups
			var t_name = temp_trace.trace_name
			var len_group_item = temp_trace.feature_names.length
			var arr_t_name = []
			for(var i = 0; i < len_group_item; i++){
				arr_t_name.push(temp_trace.feature_names[i]);
			}
			var trace = {
					  x: [arr_t_name, temp_trace.x_labels],
					  y: temp_trace.y_values,
					  text: temp_trace.n_members, // show text on bar
					  textposition: 'top center',
					  name: t_name,
					  type: 'bar'
				};
			data.push(trace);
		}// end of for
		
		var layout = {
				  autosize: true,
				  showlegend: true,
				  title: {
					    text:'Framingham 10-year risk in %'
				  },
				  xaxis: {
					tickangle: 35,
				    showdividers: false, // vertical line between group
				  }, 
				  barmode: 'group',
				  bargroupgap: 0.25
				};
		
		Plotly.newPlot('plot_fmh_mean_bar', data, layout);
			
	}	
}

function plot_radiomics_fmh_by_gender(traces, plot_title, gender){
	if(traces != undefined && traces.length > 0){
		// data for keeping all traces
		var data = [];
		for(t_idx in traces){
			temp_trace = traces[t_idx];
			
			// Generate array of duplicate trace name for grouping bar in case there are many groups
			var t_name = temp_trace.trace_name;
			var len_group_item = temp_trace.x_labels.length;
			var arr_t_name = []
			for(var i = 0; i < len_group_item; i++){
				arr_t_name.push(t_name);
			}
			var trace = {
					  x: [arr_t_name, temp_trace.x_labels],
					  y: temp_trace.y_values,
					  text:temp_trace.x_values, // show text on bar
					  textposition: 'top center',
					  name: t_name,
					  type: 'bar',
					  textposition: 'auto',
					  hoverinfo: temp_trace.x_text
				};
			data.push(trace);
		}// end of for
		
		var layout = {
				  autosize: true,
				  showlegend: true,
				  title: {
					    text: plot_title
				  },
				  xaxis: {
					tickangle: 35,
				    showdividers: false, // vertical line between group
				  }, 
				  barmode: 'group',
				  bargroupgap: 0.25
				};
		if (gender == 0){
			Plotly.newPlot('plot_fmh_female_bar', data, layout);
		}else{
			Plotly.newPlot('plot_fmh_male_bar', data, layout);
		}
			
	}else{
		msg = {msg_info: "Data for plotting ["+ plot_title +"] is invalid."};
		alert_message(msg);
	}
}
//
//function plot_radiomics_fmh_female(traces){
//	if(traces != undefined && traces.length > 0){
//		// data for keeping all traces
//		var data = [];
//		for(t_idx in traces){
//			temp_trace = traces[t_idx];
//			// If gender is not female, continue by skipping to add trace
////			if(temp_trace.sex != 0){
////				continue;
////			}
//			// Generate array of duplicate trace name for grouping bar in case there are many groups
//			var t_name = temp_trace.trace_name
////			var len_group_item = temp_trace.x_labels.length
////			var arr_t_name = []
////			for(var i = 0; i < len_group_item; i++){
////				//arr_t_name.push(temp_trace.feature_names[i]);
////				
////			}
//			var trace = {
////					  x: [arr_t_name, temp_trace.x_labels],
//					  x: [temp_trace.x_values, temp_trace.x_labels],
//					  y: temp_trace.y_values,
//					  text: temp_trace.n_members, // show text on bar
//					  textposition: 'top center',
//					  name: t_name,
//					  type: 'bar'
//				};
//			data.push(trace);
//		}// end of for
//		
//		var layout = {
//				  autosize: true,
//				  showlegend: true,
//				  title: {
//					    text:'Framingham 10-year risk in % for Female'
//				  },
//				  xaxis: {
//					tickangle: 35,
//				    showdividers: false, // vertical line between group
//				  }, 
//				  barmode: 'group',
//				  bargroupgap: 0.25
//				};
//		
//		Plotly.newPlot('plot_fmh_female_bar', data, layout);
//			
//	}
//}
	
//function plot_radiomics_fmh_male(traces){
//		if(traces != undefined && traces.length > 0){
//			// data for keeping all traces
//			var data = [];
//			for(t_idx in traces){
//				temp_trace = traces[t_idx];
//				// If gender is not male, continue by skipping to add trace
//				if(temp_trace.sex != 1){
//					continue;
//				}
//				// Generate array of duplicate trace name for grouping bar in case there are many groups
//				var t_name = temp_trace.trace_name
//				var len_group_item = temp_trace.feature_names.length
//				var arr_t_name = []
//				for(var i = 0; i < len_group_item; i++){
//					arr_t_name.push(temp_trace.feature_names[i]);
//				}
//				var trace = {
//						  x: [arr_t_name, temp_trace.x_labels],
//						  y: temp_trace.y_values,
//						  text: temp_trace.n_members, // show text on bar
//						  textposition: 'top center',
//						  name: t_name,
//						  type: 'bar'
//					};
//				data.push(trace);
//			}// end of for
//			
//			var layout = {
//					  autosize: true,
//					  showlegend: true,
//					  title: {
//						    text:'Framingham 10-year risk in % for Male'
//					  },
//					  xaxis: {
//						tickangle: 35,
//					    showdividers: false, // vertical line between group
//					  }, 
//					  barmode: 'group',
//					  bargroupgap: 0.25
//					};
//			
//			Plotly.newPlot('plot_fmh_male_bar', data, layout);
//				
//}
//}

/**
 * Plot bar chart of framingham risk score, corresponding to stratification result
 * @param traces
 * @returns
 */
function plot_radiomics_fmh_corr(corr){
	if(corr != undefined){
		// data for keeping all traces
		var data = [];
		var trace = {
				  x: corr.index_names,
				  y: corr.values,
				  //text: temp_trace.n_members, // show text on bar
				  textposition: 'top center',
				  //name: '',
				  type: 'bar'
				  //width: 0.3
		};
		data.push(trace);
		var layout = {
				  autosize: true,
				//  showlegend: true,
				  title: {
					    text:'Framingham 10-year risk score and Radiomics Correlation'
				  },
				  xaxis: {
					tickangle: 35,
				    showdividers: false, // vertical line between group
				  }, 
				  barmode: 'group',
				  bargroupgap: 0.25
				};
		
		Plotly.newPlot('plot_fmh_correlation_bar', data, layout);
			
	}	
}


/**
 * Plot bar chart of framingham risk score, corresponding to stratification result
 * @param traces
 * @returns
 */
function plot_strat_mean_fmh_bar(traces){
	// TODO assign color to individual bar
	if(traces != undefined && traces.length > 0){
		// data for keeping all traces
		var data = [];
		for(t_idx in traces){
			temp_trace = traces[t_idx];
			// Generate array of duplicate trace name for grouping bar in case there are many groups
			var t_name = temp_trace.trace_name
			var len_group_item = temp_trace.x_labels.length
			var arr_t_name = []
			for(var i = 0; i < len_group_item; i++){
				arr_t_name.push(t_name);
			}
			var trace = {
					  x: [temp_trace.x_labels, temp_trace.x_labels],
					  y: temp_trace.framingham_risk_score,
//					  title: {
//						    text:'Mean value of each features'
//					  },
//					  marker: {
//						  color: get_fmh_marker_color(temp_trace.framingham_risk_score)
//					  },
					  text: temp_trace.n_group_member.map(String), // show text on bar
					  textposition: 'top center',
					  name: t_name,
					  type: 'bar'
					  //width: 0.3
				};
			data.push(trace);
		}// end of for
		
		var layout = {
				  autosize: true,
				  showlegend: true,
				  title: {
					    text:'Framingham 10-year risk in %'
				  },
//				  width: 1200,
//				  height: 500,
				  xaxis: {
//					type: 'category', // error for this
//					automargin: true,
					tickangle: 35,
//				    tickson: "boundaries",
//				    ticklen: 10,
				    showdividers: false, // vertical line between group
//				    dividercolor: 'grey',
//				    dividerwidth: 0
				  }, 
				  barmode: 'group',
//				  bargap: 0.25,
				  bargroupgap: 0.25
				};
		
		Plotly.newPlot('plot_fmh_mean_bar', data, layout);
			
	}	
}


/**
 * Plot feature variance bar
 * @param feature_variance: object contain key: feature and value
 * @returns -
 */
function plot_feature_variance_bar(feature_variance){
	if(feature_variance != undefined){
		// data for keeping all traces
		var data = [];
		//for(idx in feature_variance.features){
			var trace = {
					  x: feature_variance.features,
					  y: feature_variance.values,
//					  title: {
//						    text:'Variance of Features'
//					  },
					 // text: temp_trace.n_group_member.map(String), // show text on bar
					 // textposition: 'top center',
					  name: feature_variance.features, //name
					  type: 'bar'
				};
			data.push(trace);
		//}
		var layout = {
				  autosize: true,
				  //showlegend: true,
				  title: {
					    text:'Feature Variance Max - Min'
				  },
				  xaxis: {
//					type: 'category', // error for this
//					automargin: true,
					tickangle: 35,
//				    tickson: "boundaries",
//				    ticklen: 10,
				    showdividers: false, // vertical line between group
//				    dividercolor: 'grey',
//				    dividerwidth: 0
				  }, 
				  barmode: 'group',
//				  bargap: 0.25,
				  bargroupgap: 0.25
				};
		
		Plotly.newPlot('plot_feature_variance_bar', data, layout);
			
	}	
}

//var fhm_color_4 = 'rgba(251,52,4,1)';
//var fhm_color_3 = 'rgba(255,123,127,1)';
//var fhm_color_2 = 'rgba(143,245,143,1)';
//var fhm_color_1 = 'rgba(2,191,2,1)';
//
//function get_fmh_marker_color(arr_y_values){
//	var arr_fhm_risk_color = [];
//	if(arr_y_values != undefined && arr_y_values.length > 0){
//		for(var idx in arr_y_values){
//			var val = arr_y_values[idx];
//			if(val > 20){
//				arr_fhm_risk_color.push(fhm_color_3);
//			}else if(val >=10 && val <= 20){
//				arr_fhm_risk_color.push(fhm_color_2);
//			}else if(val < 10){
//				arr_fhm_risk_color.push(fhm_color_1);
//			} 
//		}
//	}
//	return arr_fhm_risk_color;
//}

/**
 * Plot nominal or interval
 * @param plot_data.x, plot_data.y, plot_data.z
 * 		  plot_data.label
 * 		  plot_data.number_type (INTERVAL, NOMINAL)
 * 
 * 		  In case of INTERVAL, colorscale bar will be plotted.
 * 		  In case of NOMINAL, legend will be plotted. 
 * @returns
 */
/*
function plot_reduced_dim_space($target, plot_data, layout){

	// colorscale contains value in target column to make different color 
	var arr_colorscale = get_obj_values(JSON.parse(plot_data.label));
	
	// Check if target column is categorical data or numeric
	// In case of categorical data => display legend 
	// In case of numeric => display legend 
	var is_cate = false;
	if(plot_data.number_type == 'NOMINAL'){
		is_cate = true;
	}
	
	
	var update;
	if(is_cate){
		// categorical data, data will be clustered.
		// clear data_traces
		var traces = [];
		//plot3d_marker_cate.color = arr_colorscale;
		// call common_graph.js to get array of {x: arr_cx, y:arr_cy, z: arr_cz, label: label, arr_id:arr_cid}
		var arr_x = plot_data.x;
		var arr_y = plot_data.y;
		var arr_z = plot_data.z;
		
		// Label take from clinical items 
		var arr_label = arr_colorscale;
		// var arr_ids = get_obj_values(plot_data.labels);
		
		// Call common_graph.js to get cluster by label.
		var clusters = get_3d_cluster_data(arr_x, arr_y, arr_z, arr_label);
		for(var cidx in clusters){
			// create trace
			var curr_cluster = clusters[cidx];
			trace = {
					  x: curr_cluster.x,
					  y: curr_cluster.y,
					  z: curr_cluster.z,
					  name: curr_cluster.label,
					  legendgroup: curr_cluster.label,
					  mode: 'markers+text',
					  marker: {
							size: marker_size,
							opacity: marker_opacity},
					  type: 'scatter3d',
					  //ids: curr_cluster.arr_id,
					  //text: curr_cluster.arr_id,
					  textposition: 'top center',
			}//end trace
			traces.push(trace);
		}

		
		layout['showlegend'] = true;
		Plotly.newPlot($target,traces, layout);


	}else{
		// Data type is INTERVAL, no need to cluster data for trace
		layout['showlegend'] = false;
		plot3d_marker.color = arr_colorscale;
		if(is_new_plot){
			
			plot_3d($target, plot_data, layout);
			is_new_plot = false;
		}else{
			update = {
					marker: plot3d_marker
			}
			Plotly.update($target,update, layout);
		}
	}

	
	//disable_colorscales_button($button);
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
}*/


/**
 * Plot nominal or interval
 * @param plot_data.x, plot_data.y, plot_data.z
 * 		  plot_data.label
 * 		  plot_data.number_type (INTERVAL, NOMINAL)
 * 
 * 		  In case of INTERVAL, colorscale bar will be plotted.
 * 		  In case of NOMINAL, legend will be plotted. 
 * @returns
 */
function plot_reduced_dim_space($target, plot_data, title){

	// colorscale contains value in target column to make different color 
	var arr_colorscale = get_obj_values(JSON.parse(plot_data.label));
	
	// Check if target column is categorical data or numeric
	// In case of categorical data => display legend 
	// In case of numeric => display legend 
	var is_cate = false;
	if(plot_data.number_type == 'NOMINAL'){
		is_cate = true;
	}
	
	var layout = {
		   	scene: {
				xaxis:{ title: '',
					 //backgroundcolor: "rgb(200, 200, 230)",
					 backgroundcolor: 'rgb(230, 230,230)',
					 gridcolor: "rgb(255, 255, 255)",
					 showbackground: true,
					 zerolinecolor: "rgb(255, 255, 255)"
				},
				yaxis:{title: '',
					//backgroundcolor: "rgb(230, 200,230)",
					backgroundcolor: 'rgb(230, 230,230)',
					gridcolor: "rgb(255, 255, 255)",
					showbackground: true,
					zerolinecolor: "rgb(255, 255, 255)"
				},
				zaxis:{title: '',
				 	//backgroundcolor: "rgb(230, 230,200)",
					backgroundcolor: 'rgb(230, 230,230)',
				 	gridcolor: "rgb(255, 255, 255)",
				 	showbackground: true,
				 	zerolinecolor: "rgb(255, 255, 255)"
				}},
				 
			  autosize : true,
			  title: title,
			  hovermode: 'closest', /*Change default on hover to the data point itself*/		  
	};
	
	var update;
	if(is_cate){
		// categorical data, data will be clustered.
		// clear data_traces
		var traces = [];
		//plot3d_marker_cate.color = arr_colorscale;
		// call common_graph.js to get array of {x: arr_cx, y:arr_cy, z: arr_cz, label: label, arr_id:arr_cid}
		var arr_x = plot_data.x;
		var arr_y = plot_data.y;
		var arr_z = plot_data.z;
		
		// Label take from clinical items 
		var arr_label = arr_colorscale;
		// var arr_ids = get_obj_values(plot_data.labels);
		
		// Call common_graph.js to get cluster by label.
		var clusters = get_3d_cluster_data(arr_x, arr_y, arr_z, arr_label);
		for(var cidx in clusters){
			// create trace
			var curr_cluster = clusters[cidx];
			trace = {
					  x: curr_cluster.x,
					  y: curr_cluster.y,
					  z: curr_cluster.z,
					  name: curr_cluster.label,
					  legendgroup: curr_cluster.label,
					  mode: 'markers+text',
					  marker: {
							size: marker_size,
							opacity: marker_opacity},
					  type: 'scatter3d',
					  //ids: curr_cluster.arr_id,
					  //text: curr_cluster.arr_id,
					  textposition: 'top center',
			}//end trace
			traces.push(trace);
		}

		
		layout['showlegend'] = true;
		Plotly.newPlot($target,traces, layout);


	}else{
		// Data type is INTERVAL, no need to cluster data for trace
		layout['showlegend'] = false;
		plot3d_marker.color = arr_colorscale;
//		Plotly.newPlot($target,traces, layout);
//		if(is_new_plot){
//			
		plot_3d($target, plot_data, layout);
//			is_new_plot = false;
//		}else{
//			update = {
//					marker: plot3d_marker
//			}
//			Plotly.update($target,update, layout);
//		}
	}

	
	//disable_colorscales_button($button);
}
