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
	// When document has finished loading, send request to draw graph
	var url_load_dashboard = $('#load_dashboard').attr('data-url');
	$.ajax({
		type : "GET",
		dataType : "json",
		url : url_load_dashboard,
		data : {},
		beforeSend : function(e) {
			$(".spinner").show();
		},
		complete : function() {
			$(".spinner").hide();
		},
		success : function(resp) {
			// Plot graph to target div
			alert_message(resp);
			df = JSON.parse(resp.data);
			arr_obj_key = df['f.eid'];
			console.log(resp.data);
//			var div_plot = $('<div />').html(resp.plot).text();
//			var $target =$('#plot_container');
//			$target.html('');
//			$target.append(div_plot);
			
			plotly_js();
		},
		error : function(resp) {
			alert_error_message(resp);
		}
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
	    
//		 $('#data_table_radiomic_result > div.jexcel-content > table [id*="row"]').each(function(idx, tr){
//			 console.log(idx, tr);
//			 var row_id = $(this).attr('id');
//			 if(row_id != undefined){
//				 row_id = row_id.replace("row-", "");
//				 console.log("row id: " + row_id);
//			 }
//			 $(tr).on('click', function(e){
//				 console.log(e.target.id);
//				 
//			 });
//		 });
	    
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
	   
//	    current_selected_data(dta);
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


function plotly_js(){
	var graphDiv = document.getElementById('plotjs_container');
	arr_x = Object.keys(df.x).map(function(_) { return df.x[_]; })
	arr_y = Object.keys(df.y).map(function(_) { return df.y[_]; })
	arr_label = Object.keys(df.label).map(function(_) { return df.label[_]; })
	arr_unique_label = arr_label.filter((v, i, a) => a.indexOf(v) === i);
	
	arr_feid = Object.keys(df['f.eid']).map(function(_) { return df['f.eid'][_]; })

	// Create array of traces based on label
	var data = [];
	for(var idx in arr_unique_label){
		//console.log(arr_unique_label[idx]);
		
		label = arr_unique_label[idx];
		var idx_cluster_data = arr_label.map((e, i) => e === label ? i : '').filter(String)
		// Find data in current label to create a trace.
		var arr_cx = [];
		var arr_cy = [];
		var arr_text = [];
		var cluster_data = [];
		var custom_data= [];
		for(var xi in idx_cluster_data){
			var pt_x = arr_x[idx_cluster_data[xi]];
			var pt_y = arr_y[idx_cluster_data[xi]];
			var pt_feid = arr_feid[idx_cluster_data[xi]];
			arr_cx.push(pt_x);
			arr_cy.push(pt_y);
			arr_text.push("f.eid: "+pt_feid);
			cluster_data.push(pt_feid);
			var test = "test custom data: "+pt_feid;
			custom_data.push(test);
		}
		
		var trace = {
				  x: arr_cx,
				  y: arr_cy,
				  ids: cluster_data,
				  customdata: cluster_data,
				  mode: 'markers',
				  type: 'scatter',
				  name: 'Cluster '+idx,
				  text: arr_text,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: { size: 20, opacity:0.7}
				};
		
		data.push(trace);
		arr_clusters.push(cluster_data);
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

/**
 * Get Patient ID from selected points
 * @param data
 * @returns array of patient ID
 */
function current_selected_data(data){
	var selected_patient_ids = [];
	if (data != undefined && data.points){
    data.points.forEach(function(pt) {
    	console.log("cluster: "+pt.curveNumber);
    	console.log("pointIndex: "+pt.pointIndex);
        console.log("x,y: "+pt.x +","+ pt.y);
        console.log("text", pt.text);
        //var current_cluster = arr_clusters[pt.curveNumber];
        //var current_feid = current_cluster[pt.pointIndex]; 
        //console.log("patient id: "+current_feid);
        selected_patient_ids.push(pt.id);
    });
    console.log(selected_patient_ids);
    
	}
	return selected_patient_ids;
}


function get_table(keys, arr_obj_columns){
	// For all keys in selected data, find corresponding data in dataframe.
	var table = {};
	if (arr_obj_key != undefined && keys.length > 0){
		var table_data = []; // Store array of value for each column.
		var table_columns = Object.keys(arr_obj_columns).map(function (key) {
		    return arr_obj_columns[key].label;
		});
		for(var idx in keys){
			var key_value = keys[idx];
			var key_idx = Object.keys(arr_obj_key).find(key => arr_obj_key[key] === key_value);
			if(key_idx != undefined && key_idx > -1){
				// index found in array then get data at the same index from other columns in dataframe.
				var column_values = [];
				for (var column_index in arr_obj_columns){
					if (column_index != undefined){
						var column = arr_obj_columns[column_index];
						// Get data at specified column at the same row index of key index.
						var value = df[column.column_name][key_idx];
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
