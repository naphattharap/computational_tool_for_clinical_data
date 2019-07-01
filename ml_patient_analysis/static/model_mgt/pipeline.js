$(document).ready(function() {
	
	$('#btn_save').hide();
	
	
	//URL for listing all files
	var url_list_files = $("#url_list_all_file").attr("data-url");
	search_file(url_list_files, $("#dataset_file_name"));
	search_file(url_list_files, $("#label_file_name"));
	
	$(".widget").each(function(idx, widget){
		console.log(idx, widget);
		$(widget).on('click', function(e){
			var component_id = $(this).attr('id');
			console.log("target_component_id", '#p_'+component_id);
			
			var cloned_comp = $('#t_'+component_id).clone()
			cloned_comp.attr('id', 'p_' + component_id);
			$('#pipeline').append(cloned_comp);
			
		})
	});
	
	$('#panel_sec1_title').on('click', function(e){
		$('#panel_sec1').toggle();
		
	})
	
	
	// Select pipeline
	var url_pipeline_run = $("#data_pipeline").attr("data-url");
	$('#btn_train, #btn_save').on('click', function(e){
		//console.log('btn_train');
		var selected_steps = [];
		$('#pipeline [id*="p_"]').each(function(idx, obj){
			//console.log(obj);
			var obj_id = $(this).attr('id');
			console.log(obj_id);
			var sel_step = obj_id.replace("p_","");
			selected_steps.push(sel_step);
		});
		
		var data = get_pipeline_input();
		data['pipeline'] = selected_steps.toString();
		
		if(e.target.id == "btn_save"){
			var save_as_name = prompt("Please enter file name","");
			if(save_as_name != null && save_as_name != ""){
				data["save_as_name"] = save_as_name;
				//data['is_saved'] = 1;
			}else{
				return false;
			}
		}else{
			data["save_as_name"] = "";
			//data['is_saved'] = 0;
		}

		// Send request to server side to process input data and get result to plot
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_pipeline_run,
			data : data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				console.log(resp);
				alert_message(resp);
				$(".spinner").hide();
					// Show model description
					render_start_result(resp);
					// Show graph
					$('#plotjs_container').html('');
					if(resp.plot_data != undefined){
						var df = JSON.parse(resp.plot_data);
						var graphDiv = document.getElementById('plotjs_container');
						
						if(resp.dimension == 2){
							plotlyjs_2d_scatter(graphDiv, df);
						}else if(resp.dimension == 3){
							plotlyjs_3d_scatter(graphDiv, df);
						}
						
						$('#btn_save').show();
					}
					
					// Show data table
					if(resp.table_data != undefined){
						var data = resp.table_data;
						var columns = resp.table_columns;
						//Call common-jexcel-ext.js
						render_table("data_table", columns, data);
					}
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	});
	
	
//	$('.close').on('click', function(){
//		element.parentNode.remove();
//	});

});


function get_pipeline_input(){
	var data = {};
	// Dataset file name
	data['dataset_file_name'] = $('#dataset_file_name').val();
	data['column_header'] = $('#column_header').val();
	data['label_file_name'] = $('#label_file_name').val();
	data['label_column_header'] = $('#label_column_header').val();
	
	//Dimensiality Reduction
	data['pca_n_components'] = $('#pipeline #pca_n_components').val();
	data['lda_n_components'] = $('#pipeline #lda_n_components').val();
	data['tsne_n_components'] = $('#pipeline #tsne_n_components').val();
	
	//Test
	// - Handout
	data['test_size'] = $('#pipeline #test_size').val();
	// - Kfold, Stratified K-Fold
	data['n_folds'] = $('#pipeline #n_folds').val();
	
	// Feature Selection
	
	data['sfs_k_neighbors'] = $('#pipeline #sfs_k_neighbors').val();
	data['sfs_k_features'] = $('#pipeline #sfs_k_features').val();
	data['sfs_forward'] = $('#pipeline #sfs_forward').val();
	data['sfs_floating'] = $('#pipeline #sfs_floating').val();
	data['sfs_scoring'] = $('#pipeline #sfs_scoring').val();
	data['sfs_cv'] = $('#pipeline #sfs_cv').val();
	data['sfs_n_jobs'] = $('#pipeline #sfs_n_jobs').val();
	
	
	data['select_k_best_n_k'] = $('#pipeline #select_k_best_n_k').val();
	
	data['stratified_kfold_shuffle'] = $('#pipeline #stratified_kfold_shuffle').val();
	
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


function removeDiv(obj){
	obj.on('click', function(){
		element.parentNode.remove();
	});
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
				  name: label,
				  legendgroup: "group"+idx,
				  mode: 'markers',
				  type: 'scatter',
				  //name: 'Cluster '+idx,
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
				  name: label,
				  legendgroup: "group"+idx,
				  mode: 'markers',
				  type: 'scatter3d',
				  //name: 'Cluster '+idx,
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
