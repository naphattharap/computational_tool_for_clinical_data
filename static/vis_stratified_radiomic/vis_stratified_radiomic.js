//var df = null;
//var arr_x = null;
//var arr_y = null;
//var arr_label= null;
//var arr_unique_label=null;
//var arr_feid = null;
//var arr_clusters = [];
//var arr_obj_key = [];

// Div object to display graph
var  graphDiv;
var data_traces = [];
var is_hidden_marker_text = true;
var search_points = []; // keep search points info to reset later
//var color_ranges = Plotly.d3.scale.category20().range();
//var color_index = 0;
var temp_search_dot_color;
var temp_search_dot_idx;
var temp_search_dot;
var data_tables;
// Keep row index and keys
// {row_index: [...], id: [..] }
//var arr_keys;
var grid_data;
//var disp_table2 = [
//	{column_name: "f.eid", label: "Patient"},
//	{column_name: "bio:overall health rating:0:baseline", label: "Health Rating"},
//	{column_name: "bio:long-standing illness, disability or infirmity:0:baseline", label: "long-standing illness:baseline"},
//	{column_name: "bio:diabetes diagnosed by doctor:0:baseline", label: "diabetes diagnosed by doctor"},
//	{column_name: "bio:cancer diagnosed by doctor:0:baseline", label: "cancer diagnosed by doctor"},
//
//	{column_name: "bio:other serious medical condition/disability diagnosed by doctor:0:baseline", label: "other serious medical condition"},
//	{column_name: "bio:age high blood pressure diagnosed:0:baseline", label: "age high blood pressure diagnosed"},
//	{column_name: "bio:age diabetes diagnosed:0:baseline", label: "age diabetes diagnosed"},
//
//	{column_name: "bio:age angina diagnosed:0:baseline", label: "age angina diagnosed"},
//	{column_name: "bio:age heart attack diagnosed:0:baseline", label: "age heart attack diagnosed"},
//	
//];

var disp_table1 = [{column_name: "0", label: "Test0"},
{column_name: "1", label: "Test1"},
{column_name: "2", label: "Test2"}];

//var disp_radiomic_column = [
//	{column_name: "f.eid", label: "Patient"},
//	{column_name: "Volume_LV_ED", label: "Volume_LV_ED" },
//	{column_name: "SurfaceArea_LV_ED", label: "SurfaceArea_LV_ED" },
//	{column_name: "SurfaceAreatoVolumeRatio_LV_ED", label: "SurfaceAreatoVolumeRatio_LV_ED" },
//	{column_name: "Sphericity_LV_ED", label: "Sphericity_LV_ED" },
//	{column_name: "SphericalDisproportion_LV_ED", label: "SphericalDisproportion_LV_ED" },
//	{column_name: "Compactness_LV_ED", label: "Compactness_LV_ED" },
//	{column_name: "Compactness2_LV_ED", label: "Compactness2_LV_ED" },
//	{column_name: "Max3Ddiameter_LV_ED", label: "Max3Ddiameter_LV_ED" },
//	{column_name: "Max2DdiameterSlice_LV_ED", label: "Max2DdiameterSlice_LV_ED" },
//	{column_name: "Max2DdiameterColumn_LV_ED", label: "Max2DdiameterColumn_LV_ED" },
//	{column_name: "Max2DdiameterRow_LV_ED", label: "Max2DdiameterRow_LV_ED" },
//	{column_name: "MajorAxis_LV_ED", label: "MajorAxis_LV_ED" },
//	{column_name: "MinorAxis_LV_ED", label: "MinorAxis_LV_ED" },
//	{column_name: "LeastAxis_LV_ED", label: "LeastAxis_LV_ED" },
//	{column_name: "Elongation_LV_ED", label: "Elongation_LV_ED" },
//];

$(document).ready(function() {
	
	
	$('#upload_file_title').on('click', function(){
		$('#upload_file_section').toggle();
	});

	
	var url_process_data = $('#process_data_url').attr('data-url');
	$('#form_upload_file').on('submit', function(e){
		// Upload file and render result
		e.preventDefault();
		var form = document.getElementById('form_upload_file');
		var formData = new FormData(form);
		
		formData.append('data_file', $('#data_file').val());
		
		var label_file = document.getElementById('label_file').files[0];
		formData.append('label_file', label_file);

		var new_data_file = document.getElementById('new_data_file').files[0];
		formData.append('new_data_file', new_data_file);
		
		if(document.getElementById('general_data_file') != undefined){
			var general_data_file = document.getElementById('general_data_file').files[0];
			formData.append('general_data_file', general_data_file);
		}
		
		
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
				// Clear data in traces
				data_traces = [];
				color_index = 0;
				arr_keys = [];
				// Plot graph to target div
				console.log(resp);
				alert_message(resp);

				//console.log(resp.plot);
				//Important to getElementById to avoid error in plotly.js
				// plotly-1.47.0.min.js:7 Uncaught TypeError: r.getAttribute is not a function
				graphDiv = document.getElementById('plotjs_container');
				plot_2d(graphDiv, resp.plot);
				
				data_tables = resp.data_tables;
				
				//Row data for slickgrid table
				if (data_tables.table2 != undefined && data_tables.table2.table_data != undefined){
					grid_data = JSON.parse(data_tables.table2.table_data);
					render_grid("grid_medical_history", grid_data, columns_medical_history);
				}
				
				// Generated filter
				//generateFilter(JSON.parse(data_tables.table2.table_data));
				
				$('#upload_file_section').toggle();
				//$('.nav.nav-tabs').show();
				//$('#filter_group').show();
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		});
	
	});
	
	//Hide or show text over the dots
	$("#btn_hide_text_on_dot").on('click', function(e){
		if(data_traces != undefined && data_traces.length > 0){
			// Restyle graph by setting mode as marker
			var update;
			// toggle;
			is_hidden_marker_text = !is_hidden_marker_text;
			
			if(is_hidden_marker_text == false){
				update = {mode: 'markers'};
			}else{
				update = {mode: 'markers+text'};
			}
			Plotly.restyle(graphDiv, update);
		}else{
			console.log("No action due to data trace is empty.")
		}
		
	});
	
	$("#btn_find_dot_by_id").on('click', function(e){
			if(graphDiv != undefined){
				var str_search_id = $('#search_id').val().trim();
				if(str_search_id == ""){
					// If empty, does nothing
					return false;
				}
				
				var int_search_id = parseInt(search_id);
				var all_dots = Plotly.d3.selectAll('.point').selectAll('path');
				var len_dots = all_dots.length;
				var target_dot;
				for(var i = 0; i < len_dots; i++){
					var dot_id = all_dots[i].parentNode.__data__.id;
					if(dot_id != undefined && str_search_id == dot_id){
						
						if (temp_search_dot != undefined){
							// Set previous search dot color back to original
							temp_search_dot.style.fill = temp_search_dot_color;
						}
						target_dot = all_dots[i].parentNode;
						temp_search_dot = target_dot;
						temp_search_dot_color = target_dot.style.fill;
						
						target_dot.style.fill = '#FF0000';
						target_dot.focus();
						break;
					}
				}
		}
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
	
	//graphDiv.on('plotly_event', eventTriggeredHandler);

	$('#plotjs_container').on('plotly_selected', function(e, data){
	    console.log('plotly_selected:'+ e.points + "-" + data);
	    
	    if(data_tables != undefined){
	    	var selected_data_id = current_selected_data(data);
		    if(selected_data_id != undefined && selected_data_id.length > 0){
		    	var arr_all_keys = JSON.parse(data_tables.table1.point_id);
		    	var data_table = JSON.parse(data_tables.table1.table_data);
			    var table_radiomic_result = get_selected_data_table(selected_data_id, disp_table1,data_table, arr_all_keys);
			    var div_id_radiomic_result = "data_table_radiomic_result";
			    render_table(div_id_radiomic_result, 
			    		table_radiomic_result.table_columns, 
			    		table_radiomic_result.table_data);
			    

				 
				if(data_tables.table2 != undefined){
					var arr_all_keys = JSON.parse(data_tables.table2.point_id);
					var data_table2 = JSON.parse(data_tables.table2.table_data);
				    var table2_result = get_selected_data_table(selected_data_id, disp_table2, data_table2, arr_all_keys);
				    var div_id_tab2 = "data_table_medical_history";
				    render_table(div_id_tab2, 
				    		table2_result.table_columns, 
				    		table2_result.table_data);
				}
				
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
	
	$('#plotjs_container').on('olotly_selecting', function(e, data){
	    console.log('plotly_selected:', e);
	    current_selected_data(data);
	});
	
	$('#plotjs_container').on('plotly_click', function(e, data){
	    console.log('plotly_click:', e);
	    current_selected_data(data);
	    
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
		    searchString = this.value;
		    updateFilter();
		    update_plot();

	  });
	  
	  $("#search_id").on('change',function (e) {
		    Slick.GlobalEditorLock.cancelCurrentEdit();
		    // clear on Esc
		    if (e.which == 27) {
		      this.value = "";
		    }
		    search_id = this.value;
		    updateFilter();
		    update_plot();
	  });
	 
	 
	 
	 
	 
	 
	 
	 
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
		  		line: {
		  			color: dot_border_color,
		  			width: dot_border_width
		  		},
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
			  title: '',
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
			  dragmode: 'lasso', /* Set default selection tool to lasso*/
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
function generateFilter(data_table){
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

var dataView;
var grid;
var data = [];
var columns_medical_history = [
	"f:eid",
	"bio:overall health rating:0:baseline",
	"bio:overall health rating:0:imaging",
	"bio:long-standing illness, disability or infirmity:0:baseline",
	"bio:long-standing illness, disability or infirmity:0:imaging",
	"bio:wears glasses or contact lenses:0:baseline",
	"bio:wears glasses or contact lenses:0:imaging",
	"bio:age started wearing glasses or contact lenses:0:baseline",
	"bio:age started wearing glasses or contact lenses:0:imaging",
	"bio:other eye problems:0:baseline",
	"bio:other eye problems:0:imaging",
	"bio:hearing difficulty/problems:0:baseline",
	"bio:hearing difficulty/problems:0:imaging",
	"bio:hearing difficulty/problems with background noise:0:baseline",
	"bio:hearing difficulty/problems with background noise:0:imaging",
	"bio:falls in the last year:0:baseline",
	"bio:falls in the last year:0:imaging",
	"bio:weight change compared with 1 year ago:0:baseline",
	"bio:weight change compared with 1 year ago:0:imaging",
	"bio:wheeze or whistling in the chest in last year:0:baseline",
	"bio:wheeze or whistling in the chest in last year:0:imaging",
	"bio:chest pain or discomfort:0:baseline",
	"bio:chest pain or discomfort:0:imaging",
	"bio:ever had bowel cancer screening:0:baseline",
	"bio:ever had bowel cancer screening:0:imaging",
	"bio:most recent bowel cancer screening:0:baseline",
	"bio:most recent bowel cancer screening:0:imaging",
	"bio:ever had prostate specific antigen (psa) test:0:baseline",
	"bio:ever had prostate specific antigen (psa) test:0:imaging",
	"bio:had major operations:0:baseline",
	"bio:had major operations:0:imaging",
	"bio:diabetes diagnosed by doctor:0:baseline",
	"bio:diabetes diagnosed by doctor:0:imaging",
	"bio:cancer diagnosed by doctor:0:baseline",
	"bio:cancer diagnosed by doctor:0:imaging",
	"bio:fractured/broken bones in last 5 years:0:baseline",
	"bio:fractured/broken bones in last 5 years:0:imaging",
	"bio:other serious medical condition/disability diagnosed by doctor:0:baseline",
	"bio:other serious medical condition/disability diagnosed by doctor:0:imaging",
	"bio:taking other prescription medications:0:baseline",
	"bio:taking other prescription medications:0:imaging",
	"bio:had other major operations:0:baseline",
	"bio:had other major operations:0:imaging",
	"bio:general pain for 3+ months:0:baseline",
	"bio:general pain for 3+ months:0:imaging",
	"bio:age high blood pressure diagnosed:0:baseline",
	"bio:age high blood pressure diagnosed:0:imaging",
	"bio:age diabetes diagnosed:0:baseline",
	"bio:age diabetes diagnosed:0:imaging",
	"bio:started insulin within one year diagnosis of diabetes:0:baseline",
	"bio:started insulin within one year diagnosis of diabetes:0:imaging",
	"bio:fracture resulting from simple fall:0:baseline",
	"bio:fracture resulting from simple fall:0:imaging",
	"bio:hearing aid user:0:baseline",
	"bio:hearing aid user:0:imaging",
	"bio:neck/shoulder pain for 3+ months:0:baseline",
	"bio:neck/shoulder pain for 3+ months:0:imaging",
	"bio:hip pain for 3+ months:0:baseline",
	"bio:hip pain for 3+ months:0:imaging",
	"bio:back pain for 3+ months:0:baseline",
	"bio:back pain for 3+ months:0:imaging",
	"bio:chest pain or discomfort walking normally:0:baseline",
	"bio:chest pain or discomfort walking normally:0:imaging",
	"bio:chest pain due to walking ceases when standing still:0:baseline",
	"bio:chest pain due to walking ceases when standing still:0:imaging",
	"bio:age angina diagnosed:0:baseline",
	"bio:age angina diagnosed:0:imaging",
	"bio:stomach/abdominal pain for 3+ months:0:baseline",
	"bio:stomach/abdominal pain for 3+ months:0:imaging",
	"bio:chest pain or discomfort when walking uphill or hurrying:0:baseline",
	"bio:chest pain or discomfort when walking uphill or hurrying:0:imaging",
	"bio:age hay fever, rhinitis or eczema diagnosed:0:baseline",
	"bio:age hay fever, rhinitis or eczema diagnosed:0:imaging",
	"bio:knee pain for 3+ months:0:baseline",
	"bio:knee pain for 3+ months:0:imaging",
	"bio:age asthma diagnosed:0:baseline",
	"bio:age asthma diagnosed:0:imaging",
	"bio:headaches for 3+ months:0:baseline",
	"bio:headaches for 3+ months:0:imaging",
	"bio:time since last prostate specific antigen (psa) test:0:baseline",
	"bio:time since last prostate specific antigen (psa) test:0:imaging",
	"bio:age heart attack diagnosed:0:baseline",
	"bio:age heart attack diagnosed:0:imaging",
	"bio:age emphysema/chronic bronchitis diagnosed:0:baseline",
	"bio:age emphysema/chronic bronchitis diagnosed:0:imaging",
	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:baseline",
	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:imaging",
	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:baseline",
	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:imaging",
	"bio:gestational diabetes only:0:baseline",
	"bio:gestational diabetes only:0:imaging",
	"bio:age stroke diagnosed:0:baseline",
	"bio:age stroke diagnosed:0:imaging",
	"bio:facial pains for 3+ months:0:baseline",
	"bio:facial pains for 3+ months:0:imaging",
	"bio:age glaucoma diagnosed:0:baseline",
	"bio:age glaucoma diagnosed:0:imaging",
	"bio:age cataract diagnosed:0:baseline",
	"bio:age cataract diagnosed:0:imaging",
	"bio:shortness of breath walking on level ground:0:baseline",
	"bio:shortness of breath walking on level ground:0:imaging",
	"bio:leg pain on walking:0:baseline",
	"bio:leg pain on walking:0:imaging",
	"bio:cochlear implant:0:baseline",
	"bio:cochlear implant:0:imaging",
	"bio:tinnitus:0:baseline",
	"bio:tinnitus:0:imaging",
	"bio:tinnitus severity/nuisance:0:baseline",
	"bio:tinnitus severity/nuisance:0:imaging",
	"bio:noisy workplace:0:baseline",
	"bio:noisy workplace:0:imaging",
	"bio:loud music exposure frequency:0:baseline",
	"bio:loud music exposure frequency:0:imaging",
	"bio:which eye(s) affected by amblyopia (lazy eye):0:baseline",
	"bio:which eye(s) affected by amblyopia (lazy eye):0:imaging",
	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:baseline",
	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:imaging",
	"bio:age when loss of vision due to injury or trauma diagnosed:0:baseline",
	"bio:age when loss of vision due to injury or trauma diagnosed:0:imaging",
	"bio:which eye(s) are affected by cataract:0:baseline",
	"bio:which eye(s) are affected by cataract:0:imaging",
	"bio:leg pain when standing still or sitting:0:baseline",
	"bio:leg pain when standing still or sitting:0:imaging",
	"bio:leg pain in calf/calves:0:baseline",
	"bio:leg pain in calf/calves:0:imaging",
	"bio:leg pain when walking uphill or hurrying:0:baseline",
	"bio:leg pain when walking uphill or hurrying:0:imaging",
	"bio:leg pain when walking normally:0:baseline",
	"bio:leg pain when walking normally:0:imaging",
	"bio:leg pain when walking ever disappears while walking:0:baseline",
	"bio:leg pain when walking ever disappears while walking:0:imaging",
	"bio:leg pain on walking : action taken:0:baseline",
	"bio:leg pain on walking : action taken:0:imaging",
	"bio:leg pain on walking : effect of standing still:0:baseline",
	"bio:leg pain on walking : effect of standing still:0:imaging",
	"bio:surgery on leg arteries (other than for varicose veins):0:baseline",
	"bio:surgery on leg arteries (other than for varicose veins):0:imaging",
	"bio:surgery/amputation of toe or leg:0:baseline",
	"bio:surgery/amputation of toe or leg:0:imaging",
	"bio:which eye(s) affected by presbyopia:0:baseline",
	"bio:which eye(s) affected by presbyopia:0:imaging",
	"bio:which eye(s) affected by hypermetropia (long sight):0:baseline",
	"bio:which eye(s) affected by hypermetropia (long sight):0:imaging",
	"bio:which eye(s) affected by myopia (short sight):0:baseline",
	"bio:which eye(s) affected by myopia (short sight):0:imaging",
	"bio:which eye(s) affected by astigmatism:0:baseline",
	"bio:which eye(s) affected by astigmatism:0:imaging",
	"bio:which eye(s) affected by other eye condition:0:baseline",
	"bio:which eye(s) affected by other eye condition:0:imaging",
	"bio:which eye(s) affected by diabetes-related eye disease:0:baseline",
	"bio:which eye(s) affected by diabetes-related eye disease:0:imaging",
	"bio:age when diabetes-related eye disease diagnosed:0:baseline",
	"bio:age when diabetes-related eye disease diagnosed:0:imaging",
	"bio:which eye(s) affected by macular degeneration:0:baseline",
	"bio:which eye(s) affected by macular degeneration:0:imaging",
	"bio:age macular degeneration diagnosed:0:baseline",
	"bio:age macular degeneration diagnosed:0:imaging",
	"bio:which eye(s) affected by other serious eye condition:0:baseline",
	"bio:which eye(s) affected by other serious eye condition:0:imaging",
	"bio:age other serious eye condition diagnosed:0:baseline",
	"bio:age other serious eye condition diagnosed:0:imaging",
	"bio:which eye(s) affected by glaucoma:0:baseline",
	"bio:which eye(s) affected by glaucoma:0:imaging",
	"bio:reason for glasses/contact lenses:0:baseline",
	"bio:reason for glasses/contact lenses:1:baseline",
	"bio:reason for glasses/contact lenses:2:baseline",
	"bio:reason for glasses/contact lenses:3:baseline",
	"bio:reason for glasses/contact lenses:4:baseline",
	"bio:reason for glasses/contact lenses:0:imaging",
	"bio:reason for glasses/contact lenses:1:imaging",
	"bio:reason for glasses/contact lenses:2:imaging",
	"bio:reason for glasses/contact lenses:3:imaging",
	"bio:reason for glasses/contact lenses:4:imaging",
	"bio:eye problems/disorders:0:baseline",
	"bio:eye problems/disorders:1:baseline",
	"bio:eye problems/disorders:2:baseline",
	"bio:eye problems/disorders:3:baseline",
	"bio:eye problems/disorders:0:imaging",
	"bio:eye problems/disorders:1:imaging",
	"bio:eye problems/disorders:2:imaging",
	"bio:eye problems/disorders:3:imaging",
	"bio:mouth/teeth dental problems:0:baseline",
	"bio:mouth/teeth dental problems:1:baseline",
	"bio:mouth/teeth dental problems:2:baseline",
	"bio:mouth/teeth dental problems:3:baseline",
	"bio:mouth/teeth dental problems:4:baseline",
	"bio:mouth/teeth dental problems:5:baseline",
	"bio:mouth/teeth dental problems:0:imaging",
	"bio:mouth/teeth dental problems:1:imaging",
	"bio:mouth/teeth dental problems:2:imaging",
	"bio:mouth/teeth dental problems:3:imaging",
	"bio:mouth/teeth dental problems:4:imaging",
	"bio:mouth/teeth dental problems:5:imaging",
	"bio:vascular/heart problems diagnosed by doctor:0:baseline",
	"bio:vascular/heart problems diagnosed by doctor:1:baseline",
	"bio:vascular/heart problems diagnosed by doctor:2:baseline",
	"bio:vascular/heart problems diagnosed by doctor:3:baseline",
	"bio:vascular/heart problems diagnosed by doctor:0:imaging",
	"bio:vascular/heart problems diagnosed by doctor:1:imaging",
	"bio:vascular/heart problems diagnosed by doctor:2:imaging",
	"bio:vascular/heart problems diagnosed by doctor:3:imaging",
	"bio:fractured bone site(s):0:baseline",
	"bio:fractured bone site(s):1:baseline",
	"bio:fractured bone site(s):2:baseline",
	"bio:fractured bone site(s):0:imaging",
	"bio:fractured bone site(s):1:imaging",
	"bio:fractured bone site(s):2:imaging",
	"bio:fractured bone site(s):3:imaging",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:baseline",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:baseline",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:baseline",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:baseline",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:imaging",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:imaging",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:imaging",
	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:imaging",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:baseline",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:baseline",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:baseline",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:baseline",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:imaging",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:imaging",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:imaging",
	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:imaging",
	"bio:medication for pain relief, constipation, heartburn:0:baseline",
	"bio:medication for pain relief, constipation, heartburn:1:baseline",
	"bio:medication for pain relief, constipation, heartburn:2:baseline",
	"bio:medication for pain relief, constipation, heartburn:3:baseline",
	"bio:medication for pain relief, constipation, heartburn:0:imaging",
	"bio:medication for pain relief, constipation, heartburn:1:imaging",
	"bio:medication for pain relief, constipation, heartburn:2:imaging",
	"bio:medication for pain relief, constipation, heartburn:3:imaging",
	"bio:medication for pain relief, constipation, heartburn:4:imaging",
	"bio:vitamin and mineral supplements:0:baseline",
	"bio:vitamin and mineral supplements:1:baseline",
	"bio:vitamin and mineral supplements:2:baseline",
	"bio:vitamin and mineral supplements:3:baseline",
	"bio:vitamin and mineral supplements:4:baseline",
	"bio:vitamin and mineral supplements:5:baseline",
	"bio:vitamin and mineral supplements:6:baseline",
	"bio:vitamin and mineral supplements:0:imaging",
	"bio:vitamin and mineral supplements:1:imaging",
	"bio:vitamin and mineral supplements:2:imaging",
	"bio:vitamin and mineral supplements:3:imaging",
	"bio:vitamin and mineral supplements:4:imaging",
	"bio:vitamin and mineral supplements:5:imaging",
	"bio:vitamin and mineral supplements:6:imaging",
	"bio:pain type(s) experienced in last month:0:baseline",
	"bio:pain type(s) experienced in last month:1:baseline",
	"bio:pain type(s) experienced in last month:2:baseline",
	"bio:pain type(s) experienced in last month:3:baseline",
	"bio:pain type(s) experienced in last month:4:baseline",
	"bio:pain type(s) experienced in last month:5:baseline",
	"bio:pain type(s) experienced in last month:6:baseline",
	"bio:pain type(s) experienced in last month:0:imaging",
	"bio:pain type(s) experienced in last month:1:imaging",
	"bio:pain type(s) experienced in last month:2:imaging",
	"bio:pain type(s) experienced in last month:3:imaging",
	"bio:pain type(s) experienced in last month:4:imaging",
	"bio:pain type(s) experienced in last month:5:imaging",
	"bio:pain type(s) experienced in last month:6:imaging",
	"bio:medication for cholesterol, blood pressure or diabetes:0:baseline",
	"bio:medication for cholesterol, blood pressure or diabetes:1:baseline",
	"bio:medication for cholesterol, blood pressure or diabetes:2:baseline",
	"bio:medication for cholesterol, blood pressure or diabetes:0:imaging",
	"bio:medication for cholesterol, blood pressure or diabetes:1:imaging",
	"bio:medication for cholesterol, blood pressure or diabetes:2:imaging",
	"bio:mineral and other dietary supplements:0:baseline",
	"bio:mineral and other dietary supplements:1:baseline",
	"bio:mineral and other dietary supplements:2:baseline",
	"bio:mineral and other dietary supplements:3:baseline",
	"bio:mineral and other dietary supplements:4:baseline",
	"bio:mineral and other dietary supplements:5:baseline",
	"bio:mineral and other dietary supplements:0:imaging",
	"bio:mineral and other dietary supplements:1:imaging",
	"bio:mineral and other dietary supplements:2:imaging",
	"bio:mineral and other dietary supplements:3:imaging",
	"bio:mineral and other dietary supplements:4:imaging",
	"bio:mineral and other dietary supplements:5:imaging",
	"bio:which eye(s) affected by strabismus (squint):0:baseline",
	"bio:which eye(s) affected by strabismus (squint):0:imaging",
]

 var options = {
   columnPicker: {
     columnTitle: "Columns",
     hideForceFitButton: false,
     hideSyncResizeButton: false, 
     forceFitTitle: "Force fit columns",
     syncResizeTitle: "Synchronous resize",
   },
   editable: true,
   enableAddRow: true,
   enableCellNavigation: true,
   asyncEditorLoading: true,
   forceFitColumns: false,
   topPanelHeight: 25
 };
 var sortcol = "f:eid";
 var sortdir = 1;
 //var percentCompleteThreshold = 0;
 var searchString = "";
 var search_id = "";
 
function render_grid(target_div_id, data, arr_columns){
	var columns = [];
	if(columns != undefined){
		for(var i in arr_columns){
			var col_field = arr_columns[i]; 
			var col_id = target_div_id + "-c" + i;
			columns.push({id: col_id, name:col_field, field:col_field});
		}
	}else{
		  console.error("Columns is undefined.");
	}
	
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  grid = new Slick.Grid("#"+target_div_id, dataView, columns, options);
  grid.setSelectionModel(new Slick.RowSelectionModel());
  var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
  var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
  // move the filter panel defined in a hidden div into grid top panel
  $("#inlineFilterPanel")
      .appendTo(grid.getTopPanel())
      .show();
  grid.onCellChange.subscribe(function (e, args) {
    dataView.updateItem(args.item.id, args.item);
  });
  grid.onAddNewRow.subscribe(function (e, args) {
    var item = {"num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false};
    $.extend(item, args.item);
    dataView.addItem(item);
  });
  grid.onKeyDown.subscribe(function (e) {
    // select all rows on ctrl-a
    if (e.which != 65 || !e.ctrlKey) {
      return false;
    }
    var rows = [];
    for (var i = 0; i < dataView.getLength(); i++) {
      rows.push(i);
    }
    grid.setSelectedRows(rows);
    e.preventDefault();
  });
  grid.onSort.subscribe(function (e, args) {
    sortdir = args.sortAsc ? 1 : -1;
    sortcol = args.sortCol.field;
    if (isIEPreVer9()) {
      // using temporary Object.prototype.toString override
      // more limited and does lexicographic sort only by default, but can be much faster
      var percentCompleteValueFn = function () {
        var val = this["percentComplete"];
        if (val < 10) {
          return "00" + val;
        } else if (val < 100) {
          return "0" + val;
        } else {
          return val;
        }
      };
      // use numeric sort of % and lexicographic for everything else
      dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
    } else {
      // using native sort with comparer
      // preferred method but can be very slow in IE with huge datasets
      dataView.sort(comparer, args.sortAsc);
    }
  });
  // wire up model events to drive the grid
  // !! both dataView.onRowCountChanged and dataView.onRowsChanged MUST be wired to correctly update the grid
  // see Issue#91
  dataView.onRowCountChanged.subscribe(function (e, args) {
    grid.updateRowCount();
    grid.render();
  });
  dataView.onRowsChanged.subscribe(function (e, args) {
    grid.invalidateRows(args.rows);
    grid.render();
  });
  dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
    grid.updatePagingStatusFromView( pagingInfo );
  });
  var h_runfilters = null;
  // wire up the slider to apply the filter to the model
//  $("#pcSlider,#pcSlider2").slider({
//    "range": "min",
//    "slide": function (event, ui) {
//      Slick.GlobalEditorLock.cancelCurrentEdit();
//      if (percentCompleteThreshold != ui.value) {
//        window.clearTimeout(h_runfilters);
//        h_runfilters = window.setTimeout(updateFilter, 10);
//        percentCompleteThreshold = ui.value;
//      }
//    }
//  });

  
  
  
  
  $("#btnSelectRows").click(function () {
    if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
      return;
    }
    var rows = [];
    for (var i = 0; i < 10 && i < dataView.getLength(); i++) {
      rows.push(i);
    }
    grid.setSelectedRows(rows);
  });
  
  
  // initialize the model after all the events have been hooked up
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilterArgs({
    //percentCompleteThreshold: percentCompleteThreshold,
    searchString: searchString,
    search_id: search_id
  });
  dataView.setFilter(filter_data);
  dataView.endUpdate();
  // if you don't want the items that are not visible (due to being filtered out
  // or being on a different page) to stay selected, pass 'false' to the second arg
  dataView.syncGridSelection(grid, true);
  $("#gridContainer").resizable();
}

function update_plot(){
	 //PINGPONG
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

 
    Plotly.update(graphDiv, data_traces, get_layout());
}


function requiredFieldValidator(value) {
	   if (value == null || value == undefined || !value.length) {
	     return {valid: false, msg: "This is a required field"};
	   }
	   else {
	     return {valid: true, msg: null};
	   }
}

function updateFilter() {
    dataView.setFilterArgs({
      //percentCompleteThreshold: percentCompleteThreshold,
      searchString: searchString,
      search_id: search_id
    });
    dataView.refresh();
  }

function filter_data(item, args) {
	// args is set in updateFilter() function
	
	 /*
		 * if (item["percentComplete"] < args.percentCompleteThreshold) { return
		 * false; }
		 */
	   
	// Search ID
	if (args.search_id != "" 
			&& item["f:eid"] != args.search_id){
		return false;
	}
	
	// Scan Search
	if (args.searchString != "" 
		   && item["bio:overall health rating:0:baseline"].indexOf(args.searchString) == -1) {
	     return false;
	 }
   
   return true;
}

 function percentCompleteSort(a, b) {
   return a["percentComplete"] - b["percentComplete"];
 }
 
 function comparer(a, b) {
   var x = a[sortcol], y = b[sortcol];
   return (x == y ? 0 : (x > y ? 1 : -1));
 }
 
 function toggleFilterRow() {
   grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
 }