/*
 * Handle events to interact with user
 */
var arr_slider_min = [];
var arr_slider_max = [];

// global object for plot
$(document).ready(function() {
	
	// Toggle to show or hide target sections
	bind_toggle_event();
	
	// Upload file handler
	bind_file_upload_event();
	
	// Render plot after selecting feature and criteria
	bind_render_plot();

	var plot_strat_mean_bar = document.getElementById('plot_strat_mean_bar');
	$( window ).resize(function() {
		  Plotly.relayout(plot_strat_mean_bar, {
			  width: $(plot_strat_mean_bar).width(), 
			  height: $(plot_strat_mean_bar).height()  
		  });
	});
	

	
	// ========= Plotly Event Handlers =============
	$('#plotjs_container').on('plotly_event', function(e){
    	// do something;
		console.log("plotly_event: ", e)
	});
	
	$('#plotjs_container').on('plotly_hover', function(e, a){
    	// do something;
		//console.log("plotly_hover: ", e, a)
	});

	$('#plotjs_container').on('plotly_selected', function(e, data){
	    console.log('plotly_selected:'+ e.points + "-" + data);
	    
	    if(data_tables != undefined){
	    	var selected_data_id = current_selected_data(data);
		    if(selected_data_id != undefined && selected_data_id.length > 0){
		    	// Clear data in filter area
		    	
		    	reset_filter();
		    	
		    	search_selected_dots = selected_data_id;
				update_filter(data_view_radiomic_result);
				update_plot(data_view_radiomic_result);
				
				update_filter(data_view_medical_history);
			    update_plot(data_view_medical_history);
				
				// Data at row
				 $('#data_table_medical_history > div.jexcel-content > table [id*="row"]').on('click', function(idx, tr){
					 console.log(idx, tr);
					 // get first column: patient id
					 var key_idx = 1;
					 console.log($(this).children().eq(key_idx).text());
					 var row_id = $(this).attr('id');
					 if(row_id != undefined){
						 row_id = row_id.replace("row-", "");
						 console.log("row id: " + row_id);
					 }
				 });
		    }
	    }
	});
	
	$('#plotjs_container').on('plotly_selecting', function(e, data){
	    console.log('plotly_selected:', e);
	    current_selected_data(data);
	});
	
	
	
	$('#plotjs_container').on('plotly_click', function(e, data){
		// Fired when click on the dot.
	    console.log('plotly_click:', e);
	    Slick.GlobalEditorLock.cancelCurrentEdit();
	    // clear on Esc
	    if (e.which == 27) {
	      this.value = "";
	    }
	    search_selected_dots =  current_selected_data(data);;
	    update_filter(data_view_medical_history);
	    update_plot(data_view_medical_history);
	});
	
	$('#plotjs_container').on('plotly_doubleclick', function(e, data){
	    console.log('plotly_doubleclick:', e);
	    //Reset filtered data in table to unfiled.
	    reset_filter();
	    update_filter(data_view_medical_history);
	    update_plot(data_view_medical_history);
	});
	
	$('#plotjs_container').on('plotly_relayout', function(e, data){
		console.log('plotly_relayout', " e: ", e," data:", data);
		if(data != undefined ){
			if(data.dragmode == "select"){
				console.log("select");
			}else if(data.dragmode == "lasso"){
				console.log("lasso");
			}
			
		}
	});

	
	// ========== Tab Select Event Handlers ============
	// Show/Hide table when the tab is switched.
	 $("ul.nav.nav-tabs").on('click',function(e){
		 var target_tab = e.target;
		 var target_div = target_tab.getAttribute('href');
		 console.log(target_div);
		 $(".tab-pane").hide();
		 $(target_div).show();
		 resize_all_grids_canvas();
	});
	 
	 
	 // =======================================================================
	 // =================== Grid Related Function / Event Handler ============= 
	 // =======================================================================
	
	 $(".grid-header .ui-icon")
	         .addClass("ui-state-default ui-corner-all")
	         .mouseover(function (e) {
	           $(e.target).addClass("ui-state-hover")
	         })
	         .mouseout(function (e) {
	           $(e.target).removeClass("ui-state-hover")
	 });
	 
	// ==================== Search Criteria ======================
	  $("#txt_search").on('change',function (e) {
		    Slick.GlobalEditorLock.cancelCurrentEdit();
		    // clear on Esc
		    if (e.which == 27) {
		      this.value = "";
		    }
		    txt_search = this.value;
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);

	  });
	  
	  $("#search_id").on('change',function (e) {
		    search_id = this.value;
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);
	  });
	  
	  
	  $("#sel_gender").on('change',function (e) {
		    sex = this.value;
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);
	  });
	  
	  // Bind slide to the div in order to see the change on graph
	  // and bind slidechange to update last min, max value
      $("#slider-range-age").on( "slide slidechange", function( event, ui ) {
		  	age_min = $( "#slider-range-age" ).slider( "values", 0 ); 
			age_max =  $( "#slider-range-age" ).slider( "values", 1 );
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);
	  } );
      
      
      $("#slider-range-height").on( "slide slidechange", function( event, ui ) {
		  	height_min = $( "#slider-range-height" ).slider( "values", 0 ); 
			height_max =  $( "#slider-range-height" ).slider( "values", 1 );
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);
	  } );
      
      $("#slider-range-weight").on( "slide slidechange", function( event, ui ) {
		  	weight_min = $( "#slider-range-weight" ).slider( "values", 0 ); 
			weight_max =  $( "#slider-range-weight" ).slider( "values", 1 );
		    update_filter(data_view_medical_history);
		    update_plot(data_view_medical_history);
	  } );
	   
	   // Reset filter when button is clicked.
	   $('#btn_reset_filter').on('click', function(e){
		   reset_filter();
		   update_filter(data_view_radiomic_result);
		   update_plot(data_view_radiomic_result);
		   update_filter(data_view_medical_history);
		   update_plot(data_view_medical_history);
	   })
	   
	 
});



function plot_2d(graphDiv, plot){
	
	/* Plot configuration settings */
	var marker_size = 15;
	var marker_opacity = 0.7;

	var trace_options = {};
	if (is_hidden_marker_text == true){
		trace_options['mode'] =  "markers+text";
	}else{
		trace_options['mode'] =  "markers";
	}
	
	trace_options['group_counter'] = 0;
	
	if(plot.original_data != undefined){
		var data = JSON.parse(plot.original_data)
		trace_options['marker'] = { size: marker_size, opacity:0.7};
		trace_options['legendgroup_prefix_text'] = "Diagnosed: ";
		var ori_data_traces = get_data_traces(data, trace_options);
		for(var t_idx in ori_data_traces){
			var trace = ori_data_traces[t_idx];
			data_traces.push(trace);
		}	
	}
	if(plot.new_data != undefined){
		var dot_border_color = 'rgb(249, 2, 2)';
		var dot_border_width = 2;
		var data = JSON.parse(plot.new_data);
		trace_options['legendgroup_prefix_text'] = "Predict: ";
		trace_options['group_counter'] = data_traces.length;
		trace_options['marker'] = { size: marker_size, 
//		  		line: {
//		  			color: dot_border_color,
//		  			width: dot_border_width
//		  		},
		  		opacity: marker_opacity};

		var new_data_traces = get_data_traces(data, trace_options);
		for(var t_idx in new_data_traces){
			var trace = new_data_traces[t_idx];
			data_traces.push(trace);
		}
	}
	
	Plotly.newPlot(graphDiv, data_traces, get_layout());
}

function get_data_traces(data, trace_options){
	if(data != undefined){
	//Get data to plot from df variables.
	var arr_x = get_obj_values(data.x);
	var arr_y = get_obj_values(data.y);
	var arr_label = get_obj_values(data.label);
	
	var obj_point_id = data.point_id;
	var arr_point_id = []
	if (obj_point_id != undefined){
		arr_point_id = get_obj_values(obj_point_id);
	}

	var arr_data = {arr_x: arr_x, arr_y: arr_y, arr_label: arr_label, arr_point_id:arr_point_id }
	var cluster_data = get_cluster_data(arr_data);
	
	var group_counter = trace_options.group_counter;
	
	var traces= [];
	for(var cidx in cluster_data){
		var obj_cluster = cluster_data[cidx];
		var arr_cx = obj_cluster.x;
		var arr_cy = obj_cluster.y;
		// optional data
		var arr_id = [];
		var arr_text = []; // for hover text
		if(obj_cluster.arr_id != undefined){
			arr_id = obj_cluster.arr_id;
			arr_text = arr_id;
		}

		var group_label = trace_options.legendgroup_prefix_text + obj_cluster.label;
		var legendgroup = "group"+group_counter;
		var trace = get_trace_scatter(arr_cx, arr_cy, arr_id, arr_text, 
					trace_options.mode, group_label, legendgroup, trace_options.marker);
		
		group_counter += 1;
		traces.push(trace);
	}
	
	return traces;
	}else{
		console.error("Cannot create a trace from undefined data.");
	}
}

function get_layout(){
	var layout = {
			  autosize : true,
			  title: 'Radiomic Space',
			  xaxis: {
			    title: '',
			    showgrid: true,
			    zeroline: false
			  },
			  yaxis: {
			    title: '',
			    showgrid: true,
			    showline: false,
			    zeroline: false
			  },
			  //dragmode: 'lasso', /* Set default selection tool to lasso*/
			  hovermode: 'closest', /*Change default on hover to the data point itself*/
			  showlegend: true,
			  
			};
	return layout;
}


function get_selected_data_table(selected_keys, arr_obj_columns, data_table, arr_obj_keys){
	// For all keys in selected data, find corresponding data in dataframe.
	var table = {};
	if (arr_obj_columns != undefined && selected_keys.length > 0){
		var table_data = []; // Store array of value for each column.
		var table_columns = Object.keys(arr_obj_columns).map(function (key) {
		    return arr_obj_columns[key].label;
		});
		for(var idx in selected_keys){
			var key_value = selected_keys[idx];
			var key_idx = Object.keys(arr_obj_keys).find(key => arr_obj_keys[key] === key_value);
			if(key_idx != undefined && key_idx > -1){
				// index found in array then get data at the same index from other columns in dataframe.
				var column_values = [];
				for (var column_index in arr_obj_columns){
					if (column_index != undefined){
						var column = arr_obj_columns[column_index];
						// Get data at specified column at the same row index of key index.
						var value = data_table[column.column_name][key_idx];
						console.log(column.column_name, "/", value);
						column_values.push(value);
					}
				}
				// Push row
				table_data.push(column_values);
			}
		}
		table = {table_data: table_data, table_columns: table_columns};
	}
	return table;
}

// ========= Prepare Option for filter data
function generate_option_heart_rating(data_table){
	var op_health_rate = getOptionsFromData(data_table, "bio:overall health rating:0:baseline");
	for(var i in op_health_rate){
		var value = op_health_rate[i];
		$('#sel_health_rate').append($('<option>', {
		    value: value,
		    text: value
		}));
	}
	
}
function getOptionsFromData(data_table, column_name){
	return get_unique_values(get_obj_values(data_table[column_name]));
}

function update_plot(dataView){
if(dataView != undefined){
    var filtered_items = dataView.getFilteredItems();
    var filtered_ids = [];
    for(var i = 0 ; i < filtered_items.length; i++){
    	var id = filtered_items[i].id;
    	filtered_ids.push(id);
    	//console.log(id);
    }
    
    for (var t_idx in data_traces){
    	var selected_points = get_indexes(data_traces[t_idx].ids, filtered_ids);
    	data_traces[t_idx].selectedpoints = selected_points;
    }
}
 
    Plotly.update(graphDiv, data_traces, get_layout());
}

function reset_filter(){
	// Reset global variables
	txt_search = "";
	search_id = "";
	filter_health_rating = ""; 
	search_selected_dots = [];
	age_min = def_age_min;
	age_max = def_age_max;
	height_min = def_height_min;
	height_max = def_height_max;
	weight_min = def_weight_min;
	weight_max = def_weight_max;
	sex = "";
	
	// Reset value in textbox
	$('#txt_search').val('');
	$('#search_id').val('');
	//$("#sel_health_rating option[value='']").attr('selected', true);
	$('#sel_health_rating').val("");
	$('#sel_gender').val("");
	$('#range_age').val(age_min + "-" + age_max);
	$('#range_height').val(height_min + "-" + height_max);
	$( "#range_weight" ).val(weight_min + "-" + weight_max);
	
	$( "#slider-range-age" ).slider( "values", [def_age_min, def_age_max] );
	$( "#slider-range-height" ).slider( "values", [def_height_min, def_height_max] );
	$( "#slider-range-weight" ).slider( "values", [def_weight_min, def_weight_max] );

}

function render_slider_filter(){
	//=========== Slider for filtering data =========	
	  // ======== Age ==========
	   $( "#slider-range-age" ).slider({
	        range: true,
	        min: def_age_min,
	        max: def_age_max,
	        values: [ age_min, age_max ],
	        slide: function( event, ui ) {
	          $( "#range_age" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	        }
	   });
	   // ========= Set value to textbox for age
	   age_min = $( "#slider-range-age" ).slider( "values", 0 ); 
	   age_max =  $( "#slider-range-age" ).slider( "values", 1 );
	   $( "#range_age" ).val(age_min + "-" +age_max);
	 
	 
	   // ======== Height ==========
	   $( "#slider-range-height" ).slider({
	        range: true,
	        min: def_height_min,
	        max: def_height_max,
	        values: [ height_min, height_max ],
	        slide: function( event, ui ) {
	          $( "#range_height" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	        }
	   });
	   
	   // ========== Set value to textbox for height
	   height_min = $( "#slider-range-height" ).slider( "values", 0 );
	   height_max = $( "#slider-range-height" ).slider( "values", 1 );
	   $( "#range_height" ).val(height_min + "-" + height_max);
	   
	   // ========== Weight ==========
	   $( "#slider-range-weight" ).slider({
	        range: true,
	        min: def_weight_min,
	        max: def_weight_max,
	        values: [ weight_min, weight_max ],
	        slide: function( event, ui ) {
	          $( "#range_weight" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	        }
	   });
	   // ========== Set value to textbox for height
	   weight_min = $( "#slider-range-weight" ).slider( "values", 0 );
	   weight_max = $( "#slider-range-weight" ).slider( "values", 1 );
	   $( "#range_weight" ).val(weight_min + "-" + weight_max);
}





function bind_toggle_event(){
	
	$('#upload_file_title').on('click', function(){
		$('#upload_file_group').toggle();
	});

	$('#source_target_selection_title').on('click', function(){
		$('#source_target_selection_group_outer').toggle();
	});
	
	$('#plot_title').on('click', function(){
		$('#plot_group').toggle();
	});
}

/**
 * Handle event when button inside upload find section is clicked.
 * @returns None
 */
function bind_file_upload_event(){
	// Get target URL that processes the file
//	var url = $('#data_attr').attr('data-url');
	
	$('#form_upload_file').on('submit', function(e){
		// Upload file and render result
		e.preventDefault();
		
		// Add parameter to form
		var form = document.getElementById('form_upload_file');
		var formData = new FormData(form);
		
		// Source file
		formData.append('source_file', $('#source_file').val());
		
		var target_file = document.getElementById('target_file').files[0];
		formData.append('target_file', target_file);

		// Upload file
		$.ajax({
			url : form.action,
			method : form.method, // POST
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
				console.log(resp);
				// Render list of feature in Source Feature
				arr_features = resp.data.feature_columns;
				render_feature_columns(arr_features);
				
				// Render table for criterion
				strat_criterions =  resp.data.criterions
				render_criterion_list(strat_criterions);
				bind_sliders();
				// Event for groupby column, to enable/disable readonly of Bin column
				bind_groupby_events();
				// Clear all checked in feature list if clicked
				bind_clear_feature_checked();
				// Hide upload file section after success
				$('#upload_file_group').toggle();
				
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		});
	
	});
}

function bind_render_plot(){
	
	$('#render_plot').on('click', function(e){
		// Get target URL that processes the file
		var url = $('#data_attr').attr('data-url-strat');
		
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
			
			// Source and target criterion
			var arr_feature_indexes = [];
			$('input[name="feature_indexes"]:checked').each(function() {
				arr_feature_indexes.push(this.value);
			});
			form_data.append('feature_indexes', arr_feature_indexes.join(","));
			
			// Num type
			var arr_numtype = [];
			$('select[name^="numtypes"').each(function(idx){
				arr_numtype.push($(this).val());
			});
			form_data.append('numtypes', arr_numtype.join(","));
			
			
			// == Criterion
			// Criteria for each target column to filter data
			var arr_criterion_name = [];
			$('input[name^="criterion_"]').each(function(idx, ele){
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
			

			// ===== Bin
			var arr_bin = [];
			$('input[name="bin"]').each(function(idx){
				arr_bin.push($(this).val());
			});	
			form_data.append('bin', arr_bin.join(","));
			
			// ===== Group by
			arr_groupby = []
			$('input[name="groupby"').each(function(idx){
				arr_groupby.push($(this).val());
			});
			form_data.append('groupby', arr_groupby.join(","));
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
					alert_message(resp);
					plot_strat_mean_bar(resp.traces);
					
				},
				error : function(resp) {
					alert_error_message(resp);
				}
				
			});
		
		//});
//		$('#form_upload_file').submit();
	});
	
	
}
/**
 * Render feature 
 * @param arr_features
 * @returns
 */
function render_feature_columns(arr_features){
// HTML to append to target
//	<div class="form-group row ustom-control custom-checkbox">
//		<input type="checkbox" id="feature1"  name="feature_indexes" class="custom-control-input">
//		<label class="custom-control-label" for="feature1">Volume MYO ES</label> -->
//	</div>
	
	if (arr_features != undefined && arr_features.length > 0){
		// Clear existing content in target div
		var $target = $('#feature_list');
		$target.html("");
		
		len_data = arr_features.length;
		
		for(var i=0; i < len_data; i++){
			col_name = arr_features[i];
			$div = $('<div/>').attr({class:"form-group row ustom-control custom-checkbox"});
			var feature_id = 'feature'+i;
			var $checkbox = $('<input>').attr({type: 'checkbox',id: feature_id, name: 'feature_indexes'});
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
}

/**
 * Render feature 
 * @param arr_features
 * @returns
 */
function render_criterion_list(criterions){
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
			
			var $tr = $('<tr>');
			$tr.attr('id', 'row_'+i);
			var $td_col_name = $('<td>');
			var $td_num_type = $('<td align="center">');
			var $td_criterion = $('<td>');
			var $td_bin = $('<td align="center">');
			var $td_groupby = $('<td align="center">');
			
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
			$tr.append($td_col_name).append($td_num_type).append($td_criterion).append($td_groupby).append($td_bin);
			$("#tbl_criterion tbody").append($tr);
			
		}

	}else{
		console.error('Empty array cannot be processed!');
	}
}
function bind_groupby_events(){
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
			}
		});

	});
}
/**
 * Slider has to bind to textbox after object rendered,
 * so it needs to be separated.
 * @param criterions
 * @returns
 */
function bind_sliders(){
	$("div[id^='slider-criterion_']").each(function(idx, ele){
		console.log(idx);
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
				 console.log(ui);
				 var slider_text = get_formatted_slider_textbox(ui.values[0], ui.values[ 1 ])
				 $('#criterion_'+idx_textbox[1]).val(slider_text);
			 }
	});
	});
}

function bind_clear_feature_checked(){
	$('#lnk_clear_features').on('click',function(){
		$('input[type=checkbox][name="feature_indexes"]').prop('checked', false);	
	});
}
/**
 * Centralize formatting textbox for slider
 * @param $textbox
 * @param val1
 * @param val2
 * @returns
 */
function get_formatted_slider_textbox(val1, val2){
	return val1 + "-" + val2;
}
