function get_obj_keys(obj){
	return Object.keys(obj);
}


function get_obj_values(obj){
	return Object.keys(obj).map(function(_) { return obj[_]; })
}

function get_unique_values(obj){
	return obj.filter((v, i, a) => a.indexOf(v) === i);
}

function get_indexes(arr_values, arr_search_values){
    var indexes = [];
	for(var i in arr_search_values){
		var val = arr_search_values[i];
		var result_idx = arr_values.indexOf(val);
		if(result_idx >=0){
			indexes.push(result_idx);
		}
	}
	return indexes;
}

function get_cluster_data(arr_data){
	var arr_x = arr_data.arr_x;
	var arr_y = arr_data.arr_y;
	var arr_label = arr_data.arr_label;
	// Optional
	var arr_point_id = arr_data.arr_point_id;
	// Create array of traces based on label
	var cluster_data = [];
	
	var arr_unique_label = get_unique_values(arr_label);
	var is_point_id_attched = false;
	for(var idx in arr_unique_label){
		//console.log(arr_unique_label[idx]);
		
		var label = arr_unique_label[idx];
		var idx_cluster_data = arr_label.map((e, i) => e === label ? i : '').filter(String)
		// Find data in current label to create a trace.
		var arr_cx = [];
		var arr_cy = [];
		if(arr_point_id != undefined && arr_point_id.length > 0){
			var arr_id = [];
			is_point_id_attched = true;
		}
		for(var xi in idx_cluster_data){
			var pt_x = arr_x[idx_cluster_data[xi]];
			var pt_y = arr_y[idx_cluster_data[xi]];
			
			arr_cx.push(pt_x);
			arr_cy.push(pt_y);
			
			if(is_point_id_attched){
				var pt_id = arr_point_id[idx_cluster_data[xi]];
				arr_id.push(pt_id);
			}
		}
		cluster_data.push({x: arr_cx, y:arr_cy, label: label, arr_id:arr_id});
	}
	
	return cluster_data;
}


function get_trace_scatter(arr_x, arr_y, arr_id, arr_text, mode, name, legendgroup, marker){
	var trace;
	var custom_mode = "markers";
	if (mode != undefined && mode != ""){
		custom_mode = mode;
	}
	if(arr_id != undefined && arr_id.length > 0){
		trace = {
				  x: arr_x,
				  y: arr_y,
				  ids: arr_id,
				  //customdata: cluster_data,
				  name: name,
				  legendgroup: legendgroup,
				  mode: custom_mode,
				  type: 'scatter',
				  text: arr_text,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: marker
				};
	}else{
		trace = {
				  x: arr_x,
				  y: arr_y,
				  //customdata: cluster_data,
				  name: name,
				  legendgroup: legendgroup,
				  mode: custom_mode,
				  type: 'scatter',
				  text: arr_text,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: marker
				};
	}
	return trace;
}


/**
 * Generate table from array data
 * @param keys
 * @param arr_obj_columns
 * @returns
 */
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




/**
 * Get Patient ID from selected points
 * @param data
 * @returns array of patient ID
 */
function current_selected_data(data){
	var selected_data_ids = [];
	if (data != undefined && data.points){
		data.points.forEach(function(pt) {
//    	console.log("cluster: "+pt.curveNumber);
//    	console.log("pointIndex: "+pt.pointIndex);
//        console.log("x,y: "+pt.x +","+ pt.y);
//        console.log("text", pt.text);
        //var current_cluster = arr_clusters[pt.curveNumber];
        //var current_feid = current_cluster[pt.pointIndex]; 
        //console.log("patient id: "+current_feid);
		selected_data_ids.push(pt.id);
    });
    //console.log(selected_data_ids);
    
	}
	return selected_data_ids;
}


function plotlyjs_2d_scatter(graphDiv, df){
	
	var arr_x = Object.keys(df.x).map(function(_) { return df.x[_]; })
	var arr_y = Object.keys(df.y).map(function(_) { return df.y[_]; })
	var arr_label = Object.keys(df.label).map(function(_) { return df.label[_]; })
	var arr_unique_label = arr_label.filter((v, i, a) => a.indexOf(v) === i);
	
	//arr_feid = Object.keys(df['f.eid']).map(function(_) { return df['f.eid'][_]; })

	var arr_clusters = [];
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
			//var pt_feid = arr_feid[idx_cluster_data[xi]];
			arr_cx.push(pt_x);
			arr_cy.push(pt_y);
			//arr_text.push("f.eid: "+pt_feid);
			//cluster_data.push(pt_feid);
			//var test = "test custom data: "+pt_feid;
			//custom_data.push(test);
		}
		
		var trace = {
				  x: arr_cx,
				  y: arr_cy,
				  //ids: cluster_data,
				  //customdata: cluster_data,
				  mode: 'markers',
				  type: 'scatter',
				  name: 'Cluster '+idx,
				  text: arr_text,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: { size: 5, opacity:0.7}
				};
		
		data.push(trace);
		//arr_clusters.push(cluster_data);
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

function plotlyjs_3d_scatter(graphDiv, df){
	
	var arr_x = Object.keys(df.x).map(function(_) { return df.x[_]; })
	var arr_y = Object.keys(df.y).map(function(_) { return df.y[_]; })
	var arr_z = Object.keys(df.z).map(function(_) { return df.z[_]; })
	
	var arr_label = Object.keys(df.label).map(function(_) { return df.label[_]; })
	var arr_unique_label = arr_label.filter((v, i, a) => a.indexOf(v) === i);
	
	//arr_feid = Object.keys(df['f.eid']).map(function(_) { return df['f.eid'][_]; })

	var arr_clusters = [];
	// Create array of traces based on label
	var data = [];
	for(var idx in arr_unique_label){
		//console.log(arr_unique_label[idx]);
		
		label = arr_unique_label[idx];
		var idx_cluster_data = arr_label.map((e, i) => e === label ? i : '').filter(String)
		// Find data in current label to create a trace.
		var arr_cx = [];
		var arr_cy = [];
		var arr_cz = [];
		var arr_text = [];
		var cluster_data = [];
		var custom_data= [];
		for(var xi in idx_cluster_data){
			var pt_x = arr_x[idx_cluster_data[xi]];
			var pt_y = arr_y[idx_cluster_data[xi]];
			var pt_z = arr_z[idx_cluster_data[xi]];
			//var pt_feid = arr_feid[idx_cluster_data[xi]];
			arr_cx.push(pt_x);
			arr_cy.push(pt_y);
			arr_cz.push(pt_z);
			//arr_text.push("f.eid: "+pt_feid);
			//cluster_data.push(pt_feid);
			//var test = "test custom data: "+pt_feid;
			//custom_data.push(test);
		}
		
		var trace = {
				  x: arr_cx,
				  y: arr_cy,
				  z: arr_cz,
				  //ids: cluster_data,
				  //customdata: cluster_data,
				  mode: 'markers',
				  type: 'scatter3d',
				  name: 'Cluster '+idx,
				  text: arr_text,
				  textposition: 'top center',
				  textfont : {
					    family:'Times New Roman'
					  },
				  marker: { size: 5, opacity:0.7}
				};
		
		data.push(trace);
		//arr_clusters.push(cluster_data);
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
