/*
 * Handle events to interact with user
 */
var arr_slider_min = [];
var arr_slider_max = [];
var arr_pca_slider_min = [];
var arr_pca_slider_max = [];
// Feature list
var feature_list;
var pca_feature_list;

// Plot
var strat_mean_bar;
var plot_reduced_dim;

// Flag to check if it is new plot or not 
// in order to decide whether restyle or newPlot should be used.
var is_new_plot = true;


var radiomic_layout = {
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
		  title: 'Radiomics Space',
		  hovermode: 'closest', /*Change default on hover to the data point itself*/		  
};

var marker_size = 8;
var marker_opacity = 0.7;
var plot3d_marker = { 
	      size: marker_size,
	      opacity: marker_opacity, 
	      color: [],
	      colorscale: 'Blues', 
	      showscale: true,
	      reversescale:true,
	      colorbar:{
			        thickness: 10,
			        titleside: 'right',
			        outlinecolor: 'rgba(68,68,68,0)',
			        ticks: 'outside',
			        //ticklen: 5,
			        shoticksuffix: 'last',
			        ticksuffix: '',
			        //dtick: 0.1,
			        nticks: 10
			        
	    }
};

// global object for plot
$(document).ready(function() {
	feature_list = $('#feature_list');
	pca_feature_list = $('#pca_feature_list');
	
	strat_mean_bar = document.getElementById('plot_strat_mean_bar');
	plot_reduced_dim = document.getElementById('plot_reduced_dim');
	// Toggle to show or hide target sect
	// Toggle to show or hide target sections
	bind_toggle_event();
	
	// Upload file handler
	bind_file_upload_event();
	
	// Render plot after selecting feature and criteria
	bind_render_mean_bar_plot();

	// When click on render button
	bind_render_pca_plot();
	
	$( window ).resize(function() {
		  Plotly.relayout(strat_mean_bar, {
			  width: $(strat_mean_bar).width(), 
			  height: $(strat_mean_bar).height()  
		  });
	});
	
	// ========== Tab Select Event Handlers ============
	// Hide tab content at the begining except the first one
	 $(".tab-pane").each(function(idx){
		 if (idx > 0){
			$(this).hide();
		 }
	 });
	// Show/Hide table when the tab is switched.
	 $("ul.nav.nav-tabs").on('click',function(e){
		 var target_tab = e.target;
		 var target_div = target_tab.getAttribute('href');
		 console.log(target_div);
		 $(".tab-pane").hide();
		 $(target_div).show();
//		 resize_all_grids_canvas();
	});

	
	// ========= Plotly Event Handlers =============
//	$('#plotjs_container').on('plotly_event', function(e){
//    	// do something;
//		console.log("plotly_event: ", e)
//	});
//	
//	$('#plotjs_container').on('plotly_hover', function(e, a){
//    	// do something;
//		//console.log("plotly_hover: ", e, a)
//	});
//
//	$('#plotjs_container').on('plotly_selected', function(e, data){
//	    console.log('plotly_selected:'+ e.points + "-" + data);
//	    
//	    if(data_tables != undefined){
//	    	var selected_data_id = current_selected_data(data);
//		    if(selected_data_id != undefined && selected_data_id.length > 0){
//		    	// Clear data in filter area
//		    	
//		    	reset_filter();
//		    	
//		    	search_selected_dots = selected_data_id;
//				update_filter(data_view_radiomic_result);
//				update_plot(data_view_radiomic_result);
//				
//				update_filter(data_view_medical_history);
//			    update_plot(data_view_medical_history);
//				
//				// Data at row
//				 $('#data_table_medical_history > div.jexcel-content > table [id*="row"]').on('click', function(idx, tr){
//					 console.log(idx, tr);
//					 // get first column: patient id
//					 var key_idx = 1;
//					 console.log($(this).children().eq(key_idx).text());
//					 var row_id = $(this).attr('id');
//					 if(row_id != undefined){
//						 row_id = row_id.replace("row-", "");
//						 console.log("row id: " + row_id);
//					 }
//				 });
//		    }
//	    }
//	});
//	
//	$('#plotjs_container').on('plotly_selecting', function(e, data){
//	    console.log('plotly_selected:', e);
//	    current_selected_data(data);
//	});
//	
//	
//	
//	$('#plotjs_container').on('plotly_click', function(e, data){
//		// Fired when click on the dot.
//	    console.log('plotly_click:', e);
//	    Slick.GlobalEditorLock.cancelCurrentEdit();
//	    // clear on Esc
//	    if (e.which == 27) {
//	      this.value = "";
//	    }
//	    search_selected_dots =  current_selected_data(data);;
//	    update_filter(data_view_medical_history);
//	    update_plot(data_view_medical_history);
//	});
//	
//	$('#plotjs_container').on('plotly_doubleclick', function(e, data){
//	    console.log('plotly_doubleclick:', e);
//	    //Reset filtered data in table to unfiled.
//	    reset_filter();
//	    update_filter(data_view_medical_history);
//	    update_plot(data_view_medical_history);
//	});
//	
//	$('#plotjs_container').on('plotly_relayout', function(e, data){
//		console.log('plotly_relayout', " e: ", e," data:", data);
//		if(data != undefined ){
//			if(data.dragmode == "select"){
//				console.log("select");
//			}else if(data.dragmode == "lasso"){
//				console.log("lasso");
//			}
//			
//		}
//	});

	

	 
	 
	 // =======================================================================
	 // =================== Grid Related Function / Event Handler ============= 
	 // =======================================================================
	
//	 $(".grid-header .ui-icon")
//	         .addClass("ui-state-default ui-corner-all")
//	         .mouseover(function (e) {
//	           $(e.target).addClass("ui-state-hover")
//	         })
//	         .mouseout(function (e) {
//	           $(e.target).removeClass("ui-state-hover")
//	 });
//	 
//	// ==================== Search Criteria ======================
//	  $("#txt_search").on('change',function (e) {
//		    Slick.GlobalEditorLock.cancelCurrentEdit();
//		    // clear on Esc
//		    if (e.which == 27) {
//		      this.value = "";
//		    }
//		    txt_search = this.value;
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//
//	  });
//	  
//	  $("#search_id").on('change',function (e) {
//		    search_id = this.value;
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  });
//	  
//	  
//	  $("#sel_gender").on('change',function (e) {
//		    sex = this.value;
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  });
//	  
//	  // Bind slide to the div in order to see the change on graph
//	  // and bind slidechange to update last min, max value
//      $("#slider-range-age").on( "slide slidechange", function( event, ui ) {
//		  	age_min = $( "#slider-range-age" ).slider( "values", 0 ); 
//			age_max =  $( "#slider-range-age" ).slider( "values", 1 );
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  } );
//      
//      
//      $("#slider-range-height").on( "slide slidechange", function( event, ui ) {
//		  	height_min = $( "#slider-range-height" ).slider( "values", 0 ); 
//			height_max =  $( "#slider-range-height" ).slider( "values", 1 );
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  } );
//      
//      $("#slider-range-weight").on( "slide slidechange", function( event, ui ) {
//		  	weight_min = $( "#slider-range-weight" ).slider( "values", 0 ); 
//			weight_max =  $( "#slider-range-weight" ).slider( "values", 1 );
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  } );
//	   
//	   // Reset filter when button is clicked.
//	   $('#btn_reset_filter').on('click', function(e){
//		   reset_filter();
//		   update_filter(data_view_radiomic_result);
//		   update_plot(data_view_radiomic_result);
//		   update_filter(data_view_medical_history);
//		   update_plot(data_view_medical_history);
//	   })
//	   
	 
});



//function plot_2d(graphDiv, plot){
//	
//	/* Plot configuration settings */
//	var marker_size = 15;
//	var marker_opacity = 0.7;
//
//	var trace_options = {};
//	if (is_hidden_marker_text == true){
//		trace_options['mode'] =  "markers+text";
//	}else{
//		trace_options['mode'] =  "markers";
//	}
//	
//	trace_options['group_counter'] = 0;
//	
//	if(plot.original_data != undefined){
//		var data = JSON.parse(plot.original_data)
//		trace_options['marker'] = { size: marker_size, opacity:0.7};
//		trace_options['legendgroup_prefix_text'] = "Diagnosed: ";
//		var ori_data_traces = get_data_traces(data, trace_options);
//		for(var t_idx in ori_data_traces){
//			var trace = ori_data_traces[t_idx];
//			data_traces.push(trace);
//		}	
//	}
//	if(plot.new_data != undefined){
//		var dot_border_color = 'rgb(249, 2, 2)';
//		var dot_border_width = 2;
//		var data = JSON.parse(plot.new_data);
//		trace_options['legendgroup_prefix_text'] = "Predict: ";
//		trace_options['group_counter'] = data_traces.length;
//		trace_options['marker'] = { size: marker_size, 
////		  		line: {
////		  			color: dot_border_color,
////		  			width: dot_border_width
////		  		},
//		  		opacity: marker_opacity};
//
//		var new_data_traces = get_data_traces(data, trace_options);
//		for(var t_idx in new_data_traces){
//			var trace = new_data_traces[t_idx];
//			data_traces.push(trace);
//		}
//	}
//	
//	Plotly.newPlot(graphDiv, data_traces, get_layout());
//}


//
//function get_data_traces(data, trace_options){
//	if(data != undefined){
//	//Get data to plot from df variables.
//	var arr_x = get_obj_values(data.x);
//	var arr_y = get_obj_values(data.y);
//	var arr_label = get_obj_values(data.label);
//	
//	var obj_point_id = data.point_id;
//	var arr_point_id = []
//	if (obj_point_id != undefined){
//		arr_point_id = get_obj_values(obj_point_id);
//	}
//
//	var arr_data = {arr_x: arr_x, arr_y: arr_y, arr_label: arr_label, arr_point_id:arr_point_id }
//	var cluster_data = get_cluster_data(arr_data);
//	
//	var group_counter = trace_options.group_counter;
//	
//	var traces= [];
//	for(var cidx in cluster_data){
//		var obj_cluster = cluster_data[cidx];
//		var arr_cx = obj_cluster.x;
//		var arr_cy = obj_cluster.y;
//		// optional data
//		var arr_id = [];
//		var arr_text = []; // for hover text
//		if(obj_cluster.arr_id != undefined){
//			arr_id = obj_cluster.arr_id;
//			arr_text = arr_id;
//		}
//
//		var group_label = trace_options.legendgroup_prefix_text + obj_cluster.label;
//		var legendgroup = "group"+group_counter;
//		var trace = get_trace_scatter(arr_cx, arr_cy, arr_id, arr_text, 
//					trace_options.mode, group_label, legendgroup, trace_options.marker);
//		
//		group_counter += 1;
//		traces.push(trace);
//	}
//	
//	return traces;
//	}else{
//		console.error("Cannot create a trace from undefined data.");
//	}
//}

//function get_layout(){
//	var layout = {
//			  autosize : true,
//			  title: 'Radiomic Space',
//			  xaxis: {
//			    title: '',
//			    showgrid: true,
//			    zeroline: false
//			  },
//			  yaxis: {
//			    title: '',
//			    showgrid: true,
//			    showline: false,
//			    zeroline: false
//			  },
//			  //dragmode: 'lasso', /* Set default selection tool to lasso*/
//			  hovermode: 'closest', /*Change default on hover to the data point itself*/
//			  showlegend: true,
//			  
//			};
//	return layout;
//}


//function get_selected_data_table(selected_keys, arr_obj_columns, data_table, arr_obj_keys){
//	// For all keys in selected data, find corresponding data in dataframe.
//	var table = {};
//	if (arr_obj_columns != undefined && selected_keys.length > 0){
//		var table_data = []; // Store array of value for each column.
//		var table_columns = Object.keys(arr_obj_columns).map(function (key) {
//		    return arr_obj_columns[key].label;
//		});
//		for(var idx in selected_keys){
//			var key_value = selected_keys[idx];
//			var key_idx = Object.keys(arr_obj_keys).find(key => arr_obj_keys[key] === key_value);
//			if(key_idx != undefined && key_idx > -1){
//				// index found in array then get data at the same index from other columns in dataframe.
//				var column_values = [];
//				for (var column_index in arr_obj_columns){
//					if (column_index != undefined){
//						var column = arr_obj_columns[column_index];
//						// Get data at specified column at the same row index of key index.
//						var value = data_table[column.column_name][key_idx];
//						console.log(column.column_name, "/", value);
//						column_values.push(value);
//					}
//				}
//				// Push row
//				table_data.push(column_values);
//			}
//		}
//		table = {table_data: table_data, table_columns: table_columns};
//	}
//	return table;
//}

// ========= Prepare Option for filter data
//function generate_option_heart_rating(data_table){
//	var op_health_rate = getOptionsFromData(data_table, "bio:overall health rating:0:baseline");
//	for(var i in op_health_rate){
//		var value = op_health_rate[i];
//		$('#sel_health_rate').append($('<option>', {
//		    value: value,
//		    text: value
//		}));
//	}
//	
//}
//function getOptionsFromData(data_table, column_name){
//	return get_unique_values(get_obj_values(data_table[column_name]));
//}

//function update_plot(dataView){
//if(dataView != undefined){
//    var filtered_items = dataView.getFilteredItems();
//    var filtered_ids = [];
//    for(var i = 0 ; i < filtered_items.length; i++){
//    	var id = filtered_items[i].id;
//    	filtered_ids.push(id);
//    	//console.log(id);
//    }
//    
//    for (var t_idx in data_traces){
//    	var selected_points = get_indexes(data_traces[t_idx].ids, filtered_ids);
//    	data_traces[t_idx].selectedpoints = selected_points;
//    }
//}
// 
//    Plotly.update(graphDiv, data_traces, get_layout());
//}

//function reset_filter(){
//	// Reset global variables
//	txt_search = "";
//	search_id = "";
//	filter_health_rating = ""; 
//	search_selected_dots = [];
//	age_min = def_age_min;
//	age_max = def_age_max;
//	height_min = def_height_min;
//	height_max = def_height_max;
//	weight_min = def_weight_min;
//	weight_max = def_weight_max;
//	sex = "";
//	
//	// Reset value in textbox
//	$('#txt_search').val('');
//	$('#search_id').val('');
//	//$("#sel_health_rating option[value='']").attr('selected', true);
//	$('#sel_health_rating').val("");
//	$('#sel_gender').val("");
//	$('#range_age').val(age_min + "-" + age_max);
//	$('#range_height').val(height_min + "-" + height_max);
//	$( "#range_weight" ).val(weight_min + "-" + weight_max);
//	
//	$( "#slider-range-age" ).slider( "values", [def_age_min, def_age_max] );
//	$( "#slider-range-height" ).slider( "values", [def_height_min, def_height_max] );
//	$( "#slider-range-weight" ).slider( "values", [def_weight_min, def_weight_max] );
//
//}

//function render_slider_filter(){
//	//=========== Slider for filtering data =========	
//	  // ======== Age ==========
//	   $( "#slider-range-age" ).slider({
//	        range: true,
//	        min: def_age_min,
//	        max: def_age_max,
//	        values: [ age_min, age_max ],
//	        slide: function( event, ui ) {
//	          $( "#range_age" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
//	        }
//	   });
//	   // ========= Set value to textbox for age
//	   age_min = $( "#slider-range-age" ).slider( "values", 0 ); 
//	   age_max =  $( "#slider-range-age" ).slider( "values", 1 );
//	   $( "#range_age" ).val(age_min + "-" +age_max);
//	 
//	 
//	   // ======== Height ==========
//	   $( "#slider-range-height" ).slider({
//	        range: true,
//	        min: def_height_min,
//	        max: def_height_max,
//	        values: [ height_min, height_max ],
//	        slide: function( event, ui ) {
//	          $( "#range_height" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
//	        }
//	   });
//	   
//	   // ========== Set value to textbox for height
//	   height_min = $( "#slider-range-height" ).slider( "values", 0 );
//	   height_max = $( "#slider-range-height" ).slider( "values", 1 );
//	   $( "#range_height" ).val(height_min + "-" + height_max);
//	   
//	   // ========== Weight ==========
//	   $( "#slider-range-weight" ).slider({
//	        range: true,
//	        min: def_weight_min,
//	        max: def_weight_max,
//	        values: [ weight_min, weight_max ],
//	        slide: function( event, ui ) {
//	          $( "#range_weight" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
//	        }
//	   });
//	   // ========== Set value to textbox for height
//	   weight_min = $( "#slider-range-weight" ).slider( "values", 0 );
//	   weight_max = $( "#slider-range-weight" ).slider( "values", 1 );
//	   $( "#range_weight" ).val(weight_min + "-" + weight_max);
//}





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
				if(resp.msg_error != undefined &&  resp.msg_error !== ""){
					alert_message(resp);
					return;
				}else{
					//Hide previous display error (if any)
					alert_message(resp);
				}
				// Clear data
				arr_pca_slider_min = [];
				arr_pca_slider_max = [];
				
				arr_slider_min = [];
				arr_slider_max = [];
				
				
				// Data to render table for criterion
				strat_criterions =  resp.data.criterions
				arr_features = resp.data.feature_columns;
				// =============== Tab 1: Mean Bar ===============
				// Render feature list
				render_feature_columns(feature_list, 'feature_indexes', arr_features);
				// Render table for criterion
				render_mean_bar_criterion_table(strat_criterions);
				// Bind related events
				bind_mean_bar_criterion_sliders();
				// Event for groupby column, to enable/disable readonly of Bin column
				bind_mean_bar_groupby_events();
				

				// =============== Tab 2: PCA===============
				// Render feature
				render_feature_columns(pca_feature_list,'pca_feature_indexes', arr_features);
				// Render table for criterion
				render_pca_criterion_table(strat_criterions);
				// Bind slider to criterion table
				bind_pca_criterion_sliders();
				
				// Bind button events
				bind_select_features_by_xgboost();
				
				
				// ============== Common events that bind for all bar ========
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

function bind_clear_feature_checked(){
	// tab 1
	$('#lnk_clear_features').on('click',function(){
		$('input[type=checkbox][name="feature_indexes"]').prop('checked', false);	
	});
	
	// tab 2
	$('#lnk_clear_pca_features').on('click',function(){
		$('input[type=checkbox][name="pca_feature_indexes"]').prop('checked', false);	
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
