


function example(){
	var trace_name_alco = "Alcohol intake";
	var trace9 = {
	  x: [
	    [	trace_name_alco, trace_name_alco, trace_name_alco,
	    	trace_name_alco,
	    ],
	    [	'Never',
	    	'...', 
	    	'.....', 
	    	'Daily or almost daily' ]
	  ],
	  y: [1, 5, 5, 29],
	  name: trace_name_alco,
	  type: 'bar',
	  width: 0.3
};
	
var trace_name = "Never eat eggs, dairy, wheat, sugar";
var trace1 = {
  x: [
      	[   trace_name, trace_name, trace_name, trace_name],
    	[	'I eat all of the above', 
    		'Sugar or foods/drinks containing sugar',
    		'Wheat products', 
    		'Eggs or foods containing eggs']
  ],
  y: [8, 24, 5, 3],
  name: trace_name,
  text: ["a", "b", "c", "d"],
  textinfo: 'label+percent+value',
  type: 'bar',
  width: 0.3
};

var trace_name2 = "sleep duration"
var trace2 = {
  x: [
    [trace_name2, trace_name2, trace_name2],
    ['<5', '5 - 10', '> 10']
  ],
  y: [8, 22, 5,5],
  name: trace_name2,
  type: 'bar',
  width: 0.3
};


var trace_name3 = "activity 3"
	var trace3 = {
	  x: [
	    [trace_name3, trace_name3, trace_name3],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [5,5, 20, 10],
	  name: trace_name3,
	  type: 'bar',
	  width: 0.3
	};
	
var trace_name4 = "activity 4"
	var trace4 = {
	  x: [
	    [trace_name4, trace_name4, trace_name4],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [10, 20, 5,5],
	  name: trace_name4,
	  type: 'bar',
	  width: 0.3
	};
	
var trace_name5 = "activity 5"
	var trace5 = {
	  x: [
	    [trace_name5, trace_name5, trace_name5],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [15, 15, 5,5],
	  name: trace_name5,
	  type: 'bar',
	  width: 0.3
};

var trace_name6 = "Beek intake in a week";
	var trace6 = {
	  x: [
	    [	trace_name6, trace_name6, trace_name6,
	    	trace_name6, trace_name6, trace_name6,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name6,
	  type: 'bar',
	  width: 0.3
};
	
	
	var trace_name7 = "Poultry intake in a week";
	var trace7 = {
	  x: [
	    [	trace_name7, trace_name7, trace_name7,
	    	trace_name7, trace_name7, trace_name7,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name7,
	  type: 'bar',
	  width: 0.3
};
	
// processed meat intake
	var trace_name8 = "Processed meat intake";
	var trace8 = {
	  x: [
	    [	trace_name8, trace_name8, trace_name8,
	    	trace_name8, trace_name8, trace_name8,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name8,
	  type: 'bar',
	  width: 0.3
};

//cheese intake

var data = [trace9, trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];
var layout3 = {
 // autoresize: true,
  showlegend: true,
  width: 1200,
  height: 500,
  xaxis: {
     tickson: "boundaries",
    ticklen: 10,
    showdividers: true,
    dividercolor: 'grey',
    dividerwidth: 0
  }, 
  barmode: 'group',
  bargap: 0.25,
  bargroupgap: 0.1
};

Plotly.newPlot('plot_strat_bar', data, layout3);
}




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
			
			var $tr = $('<tr>');
			$tr.attr('id', 'row_'+i);
			var $td_pca_target = $('<td>');
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

/**
 * Slider has to bind to textbox after object rendered,
 * so it needs to be separated.
 * @param criterions
 * @returns
 */
function bind_mean_bar_criterion_sliders(){
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
				 //console.log(ui);
				 var slider_text = get_formatted_slider_textbox(ui.values[0], ui.values[ 1 ])
				 $('#criterion_'+idx_textbox[1]).val(slider_text);
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
			}
		});

	});
}




/**
 * Bind event when clicks on Render Plot of tab#1 
 * then call plot stratify bar chart of mean value
 * @returns none
 */
function bind_render_mean_bar_plot(){
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
					if(resp.msg_error != undefined &&  resp.msg_error !== ""){
						alert_message(resp);
						return;
					}else{
						//Hide previous display error (if any)
						alert_message(resp);
					}
					plot_strat_mean_bar(resp.traces);
					
				},
				error : function(resp) {
					alert_error_message(resp);
				}
				
			});
	});
}

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
		
		Plotly.newPlot('plot_strat_mean_bar', data, layout);
			
	}	
}



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
