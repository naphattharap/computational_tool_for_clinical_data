var df = null;
var arr_x = null;
var arr_y = null;
var arr_label= null;
var arr_unique_label=null;
var arr_feid = null;
var arr_clusters = [];
var arr_obj_key = [];

var disp_medical_history_columns = [
	{column_name: "f.eid", label: "Patient"},
	{column_name: "bio:overall health rating:0:baseline", label: "Health Rating"},
	{column_name: "bio:long-standing illness, disability or infirmity:0:baseline", label: "long-standing illness:baseline"},
	{column_name: "bio:diabetes diagnosed by doctor:0:baseline", label: "diabetes diagnosed by doctor"},
	{column_name: "bio:cancer diagnosed by doctor:0:baseline", label: "cancer diagnosed by doctor"},

	{column_name: "bio:other serious medical condition/disability diagnosed by doctor:0:baseline", label: "other serious medical condition"},
	{column_name: "bio:age high blood pressure diagnosed:0:baseline", label: "age high blood pressure diagnosed"},
	{column_name: "bio:age diabetes diagnosed:0:baseline", label: "age diabetes diagnosed"},

	{column_name: "bio:age angina diagnosed:0:baseline", label: "age angina diagnosed"},
	{column_name: "bio:age heart attack diagnosed:0:baseline", label: "age heart attack diagnosed"},
	
];

var disp_radiomic_column = [
	{column_name: "f.eid", label: "Patient"},
	{column_name: "Volume_LV_ED", label: "Volume_LV_ED" },
	{column_name: "SurfaceArea_LV_ED", label: "SurfaceArea_LV_ED" },
	{column_name: "SurfaceAreatoVolumeRatio_LV_ED", label: "SurfaceAreatoVolumeRatio_LV_ED" },
	{column_name: "Sphericity_LV_ED", label: "Sphericity_LV_ED" },
	{column_name: "SphericalDisproportion_LV_ED", label: "SphericalDisproportion_LV_ED" },
	{column_name: "Compactness_LV_ED", label: "Compactness_LV_ED" },
	{column_name: "Compactness2_LV_ED", label: "Compactness2_LV_ED" },
	{column_name: "Max3Ddiameter_LV_ED", label: "Max3Ddiameter_LV_ED" },
	{column_name: "Max2DdiameterSlice_LV_ED", label: "Max2DdiameterSlice_LV_ED" },
	{column_name: "Max2DdiameterColumn_LV_ED", label: "Max2DdiameterColumn_LV_ED" },
	{column_name: "Max2DdiameterRow_LV_ED", label: "Max2DdiameterRow_LV_ED" },
	{column_name: "MajorAxis_LV_ED", label: "MajorAxis_LV_ED" },
	{column_name: "MinorAxis_LV_ED", label: "MinorAxis_LV_ED" },
	{column_name: "LeastAxis_LV_ED", label: "LeastAxis_LV_ED" },
	{column_name: "Elongation_LV_ED", label: "Elongation_LV_ED" },
];

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
				// Plot graph to target div
				console.log(resp);
				alert_message(resp);

				console.log(resp.plot);
				//Important to getElementById to avoid error in plotly.js
				// plotly-1.47.0.min.js:7 Uncaught TypeError: r.getAttribute is not a function
				var graphDiv = document.getElementById('plotjs_container');
				plot_2d(graphDiv, resp.plot);
				
				//$('.nav.nav-tabs').show();
				//$('#filter_group').show();
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		});
	
	});
	

	// ========= Plotly Event Handlers =============
	$('#plotjs_container').on('plotly_event', function(e){
    	// do something;
		console.log("plotly_event: ", e)
	});

	$('#plotjs_container').on('plotly_selected', function(e, data){
	    console.log('plotly_selected:'+ e.points + "-" + data);
	    var selected_data = current_selected_data(data);
	    
	    var table_medical_history = get_table(selected_data, disp_medical_history_columns);
	    var div_id_medical_history = "data_table_medical_history";
	    render_table(div_id_medical_history, 
	    		table_medical_history.table_columns, 
	    		table_medical_history.table_data);
	    
	   // Radiomic Result
	    var table_radiomic_result = get_table(selected_data, disp_radiomic_column);
	    var div_id_radiomic_result = "data_table_radiomic_result";
	    render_table(div_id_radiomic_result, 
	    		table_radiomic_result.table_columns, 
	    		table_radiomic_result.table_data);
	    
		 $('#data_table_radiomic_result > div.jexcel-content > table [id*="row"]').on('click', function(idx, tr){
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
	    
	});
	
	$('#plotjs_container').on('olotly_selecting', function(e, data){
	    console.log('plotly_selected:', e);
	    current_selected_data(data);
	});
	
	$('#plotjs_container').on('plotly_click', function(e, data){
	    console.log('plotly_click:', e);
	    current_selected_data(data);
	    
	});

//	$('#plot_container').on('plotly_hover', function(e){
//	    console.log('plotly_hover', e);
//	});
	
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
	 
});


function plot_2d(graphDiv, plot){
	//Get data to plot from df variables.
	var arr_x = get_obj_values(JSON.parse(plot.original_data).x);
	var arr_y = get_obj_values(JSON.parse(plot.original_data).y);
	var arr_label = get_obj_values(JSON.parse(plot.original_data).label);
	
	var obj_point_id = JSON.parse(plot.original_data).point_id;
	var arr_point_id = []
	if (obj_point_id != undefined){
		arr_point_id = get_obj_values(obj_point_id);
	}

	var arr_data = {arr_x: arr_x, arr_y: arr_y, arr_label: arr_label, arr_point_id:arr_point_id }
	var cluster_data_ori = get_cluster_data(arr_data);
	
	var data = []; // store trace
	
	var marker_size = 15;
	//'rgb(244, 69, 66)' //red
	//'rgb(0, 0, 0)'; //black
	var dot_border_color = 'rgb(249, 2, 2)';
	var dot_border_width = 2;
	var group_counter = 1;
	
	var marker = { size: marker_size, opacity:0.7}
	for(var cidx in cluster_data_ori){
		var obj_cluster = cluster_data_ori[cidx];
		var arr_cx = obj_cluster.x;
		var arr_cy = obj_cluster.y;
		// optional data
		var arr_id = [];
		var arr_text = []; // for hover text
		if(obj_cluster.arr_id != undefined){
			arr_id = obj_cluster.arr_id;
			arr_text = arr_id;
		}
		
		
//		trace = {
//				  x: arr_cx,
//				  y: arr_cy,
//				  ids: arr_id,
//				  //customdata: cluster_data,
//				  name: "Diagnosed: "+obj_cluster.label,
//				  legendgroup: "group"+group_counter,
//				  mode: 'markers',
//				  type: 'scatter',
//				  text: arr_text,
//				  textposition: 'top center',
//				  textfont : {
//					    family:'Times New Roman'
//					  },
//				  marker: marker
//		};
		var group_label = "Diagnosed: "+obj_cluster.label;
		var legendgroup = "group"+group_counter;
		var trace = get_trace_scatter(arr_cx, arr_cy, arr_id, arr_text, group_label, legendgroup, marker);
		group_counter += 1;
		data.push(trace);
	}
	
	// If New Data to be predicted is uploaded (it's optional)
	if(plot.new_data != undefined){
		var arr_x_new = get_obj_values(JSON.parse(plot.new_data).x);
		var arr_y_new = get_obj_values(JSON.parse(plot.new_data).y);
		var arr_label_new = get_obj_values(JSON.parse(plot.new_data).label);
		
		var obj_point_id = JSON.parse(plot.new_data).point_id;
		var arr_point_id = []
		if (obj_point_id != undefined){
			arr_point_id = get_obj_values(obj_point_id);
		}
		var arr_data2 = {arr_x: arr_x_new, arr_y: arr_y_new, arr_label: arr_label_new, arr_point_id:arr_point_id};
		var cluster_data_new = get_cluster_data(arr_data2);
		
		var marker = { size: marker_size, 
				  		line: {
				  			color: dot_border_color,
				  			width: dot_border_width
				  		},
				  		opacity:0.7};
		
		for(var cidx in cluster_data_new){
			var obj_cluster = cluster_data_new[cidx];
			var arr_cx = obj_cluster.x;
			var arr_cy = obj_cluster.y;
			// optional data
			var arr_id = [];
			var arr_text = [];
			if(obj_cluster.arr_id != undefined){
				arr_id = obj_cluster.arr_id;
				arr_text = arr_id;
			}
			
			var group_label = "Predict: "+obj_cluster.label;
			var legendgroup = "group"+group_counter;
			var trace = get_trace_scatter(arr_cx, arr_cy, arr_id, arr_text, group_label, legendgroup, marker);
			group_counter += 1;
			data.push(trace);
		}
		
	}	
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
			  }
			};
	Plotly.newPlot(graphDiv, data, layout);
}

