
// === Plotly preperties 
var graphDiv; //Div object to display graph
var plot_feature_ranking;
var _data_traces = [];
// _plot_data: x, y, z, label, id
var _plot_data = [];
var is_hidden_marker_text = true; // Toggle text on dots
var is_new_plot = true; //check if update or newPlot should be called
var _columns = [];
var radiomic_view_columns_name = [];
var clinical_outcomes_view_columns_name = [];
var _clinical_outcomes_cate_columns_name = [];

var marker_size = 8;
var marker_opacity = 0.7;
// global marker properties for 3d
// Available colorscale
//[Blackbody,Bluered, Blues, Earth, Electric, Greens, Greys,
//	Hot,Jet,Picnic,Portland,Rainbow,RdBu,Reds,Viridis,YlGnBu,YlOrRd]
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

var plot3d_marker_cate = { 
	      size: marker_size,
	      opacity: marker_opacity,
	      color: [],
	      colorscale: 'Blues',
	      colorbar:{}
	};


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
		  title: 'Radiomic Space',
		  hovermode: 'closest', /*Change default on hover to the data point itself*/		  
};
// Data table
var _dt_radiomics; // Map with data_tables.table1
var _dt_clinical_outcomes; // Map with data_tables.table2

// ======= Filter Properties ==========
var txt_search = "";
var search_id = "";
var filter_health_rating = "";
var search_selected_dots = [];
var age_min = 0;
var age_max = 0;
var height_min = 0;
var height_max = 0;
var weight_min = 0;
var weight_max = 0;
var def_age_min = 0;
var def_age_max = 120;
var def_height_min = 0;
var def_height_max = 200;
var def_weight_min = 0;
var def_weight_max = 200;
var sex = "";

// ======= Data table properties
var data_tables; // Store all data tables --> table1, table2
// Column name in dataset (item) for flexibility
var ds_col_id = "id";
var ds_col_sex = "sex";
var ds_col_age = "age";
var ds_col_weight = "weight";
var ds_col_height = "height";


$(document).ready(function() {
	
	
	$('#upload_file_title').on('click', function(){
		$('#upload_file_section').toggle();
	});

	$('#search_group_title').on('click', function(){
		$('#search_group_section').toggle();
	});
	
	render_slider_filter();
	
	
	var url_process_data = $('#process_data_url').attr('data-url');
	$('#form_upload_file').on('submit', function(e){
		// Upload file and render result
		e.preventDefault();
		var form = document.getElementById('form_upload_file');
		var formData = new FormData(form);
		
		formData.append('data_file', $('#data_file').val());
		
		var outcomes_file = document.getElementById('outcomes_file').files[0];
		formData.append('outcomes_file', outcomes_file);

		
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
				is_new_plot = true;
				// Clear data in traces
				_data_traces = []; 
				color_index = 0;
				arr_keys = [];
				// Plot graph to target div
				console.log(resp);
				alert_message(resp);

				//console.log(resp.plot);
				//Important to getElementById to avoid error in plotly.js
				// plotly-1.47.0.min.js:7 Uncaught TypeError: r.getAttribute is not a function
				graphDiv = document.getElementById('plotjs_container');
				radiomic_layout.scene.xaxis.title = resp.plot.column_names[0];
				radiomic_layout.scene.yaxis.title = resp.plot.column_names[1];
				radiomic_layout.scene.zaxis.title = resp.plot.column_names[2];
				//_columns = resp.plot.column_names
				
				// Clear all button in area.
				$('#colorscale_buttons').empty();
				
				data_tables = resp.data_tables;
				radiomic_view_columns_name = data_tables.table1.column_names;
				clinical_outcomes_view_columns_name = data_tables.table2.column_names;
				
				// For testing colorscale, remove later
				_dt_clinical_outcomes = JSON.parse(data_tables.table2.table_data);
				_clinical_outcomes_cate_columns_name = data_tables.table2.cate_columns;
				var arr_all_columns = Object.keys(_dt_clinical_outcomes[0]);
				generate_colorscale_buttons(arr_all_columns);
				
				// end test
				_plot_data = JSON.parse(resp.plot.data);
				// plot_3d(graphDiv);
				// Fire first button in colorscale group as default.
				$('#colorscale_buttons').children()[0].click();
				
				
				var n_disp_features = 10;
				if (resp.plot_feature_ranking.importances.length < 10){
					n_disp_features = resp.plot_feature_ranking.importances.length;
				}
				var arr_fx = resp.plot_feature_ranking.importances.slice(0, n_disp_features);
				var arr_fy = resp.plot_feature_ranking.column_names.slice(0, n_disp_features);
				//https://stackoverflow.com/questions/42187139/plotly-horizontal-bar-display-all-y-axis-labels
				var data_feature_ranking = [{
					  type: 'bar',
					  x: arr_fx,
					  y: arr_fy,
					  orientation: 'h',
					  width: 0.8,
					    transforms: [{
					        type: 'sort',
					        target: 'x',
					        order: 'ascending'
					      }, {
					        type: 'filter',
					        target: 'x',
					        operation: '>',
					        value: 0
					      }]
					}];
				
				
				var feature_ranking_layout = {
						autosize: true,
						title: 'Feature Importance',
						//width: 200,
					    xaxis:{
					        //autorange:'reversed'
					    },
					    yaxis: {
					        title: '',
					        side:'left', //right
					        dtick: 1
					      }
					    ,
					      margin: {
					        l: 300
					     }
				};
				
				plot_feature_ranking = document.getElementById('plot_feature_ranking');
				Plotly.newPlot(plot_feature_ranking, data_feature_ranking, feature_ranking_layout);
				
				
				//Reset filter in grid table
				reset_filter();

				
				
				// ======= Render data table for radiomic result =========
				if (data_tables.table1 != undefined 
						&& data_tables.table1.table_data != undefined){
					// Get grid data
					_dt_radiomics = JSON.parse(data_tables.table1.table_data);
					//_dt_radiomics = grid_data;
					// Generate grid items by taking columns name from dataframe
					// and set width.
					// Column 'id' is skipped to display in table because it's just running no.
					// to make item unique.
					
					// Get column names from first object.
					var data0 = _dt_radiomics[0]
					var all_columns_radiomic = Object.keys(data0);
					var selected_columns = [];
					for (var i in all_columns_radiomic){
						var field_name = all_columns_radiomic[i];
						if(field_name == "id"){
							selected_columns.push({id:i, field: "id", name: radiomic_view_columns_name[i], width: 80 });
							continue;
						}else{
							selected_columns.push({id:i, field: field_name, name: radiomic_view_columns_name[i], width: 200});
							
						}
					}
					data_view_radiomic_result = render_grid("grid_radiomic_result", "pager_grid_radiomic_result", _dt_radiomics, selected_columns);
					update_filter(data_view_radiomic_result);
				}
				
				
				
				// ======= Render data table for clinical outcomes =========
				
				if (data_tables.table2 != undefined && data_tables.table2.table_data != undefined){
					
					_dt_clinical_outcomes = JSON.parse(data_tables.table2.table_data);
					//_dt_clinical_outcomes = grid_data;
					// Get column names from first object.
					var data0 = _dt_clinical_outcomes[0]
					var all_columns = Object.keys(data0);
					var selected_columns = [];
					for (var i in all_columns){
						var field_name = all_columns[i];
						if(field_name == "id"){
							selected_columns.push({id:i, field: "id", name: clinical_outcomes_view_columns_name[i], width: 80 });
							continue;
						}else{
							selected_columns.push({id:i, field: field_name, name: clinical_outcomes_view_columns_name[i], width: 200});
						}
					}
					data_view_clinical_outcomes = render_grid("grid_clinical_outcomes", "pager_clinical_outcomes", _dt_clinical_outcomes, selected_columns);
					update_filter(data_view_clinical_outcomes);
				}
				
//				// Generated and set default to filter
//				def_weight_min = weight_min = parseInt(resp.weight_min);
//				def_weight_max = weight_max = parseInt(resp.weight_max);
//				def_height_min = height_min = parseInt(resp.height_min);
//				def_height_max = height_max = parseInt(resp.height_max);
//				def_age_min = age_min = parseInt(resp.age_min);
//				def_age_max = age_max = parseInt(resp.age_max);
				
//				render_slider_filter();
				
				// resize_all_grids_canvas();
				//generateFilter(JSON.parse(data_tables.table2.table_data));
				
				$('#upload_file_section').toggle();
				//$('.nav.nav-tabs').show();
				$('#process_result').show();
				$('#process_result_tabs').show();
			},
			error : function(resp) {
				alert_error_message(resp);
			}
			
		});
	
	});
	
	//Hide or show text over the dots
	$("#btn_hide_text_on_dot").on('click', function(e){
		if(_data_traces != undefined && _data_traces.length > 0){
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
	
	// ========= Plotly Event Handlers =============
	$( window ).resize(function() {
		  Plotly.relayout(plot_feature_ranking, {
			  width: $(plot_feature_ranking).width(), 
			  height: $(plot_feature_ranking).height()  
		  });
	});
//	window.onresize = function() {
//		if(graphDiv != undefined){
//			var update = {
//					  width: $(graphDiv).width(), 
//					  height: $(graphDiv).height()  
//			};
//			Plotly.relayout('plotjs_container', update);
//		}
//	};
	
//	Plotly.relayout(myDiv, {
//	    width: 0.9 * window.innerWidth,
//	    height: 0.9 * window.innerHeight
//	  })
	
//	
//	$('#plotjs_container').on('plotly_event', function(e){
//    	// do something;
//		console.log("plotly_event: ", e)
//	});
//	
//	$('#plotjs_container').on('plotly_hover', function(e, a){
//    	// do something;
//		console.log("plotly_hover: ", e, a)
//	});

	$('#plotjs_container').on('plotly_selected', function(e, data){
	    console.log('plotly_selected:'+ e.points + "-" + data);
	    
	    if(data_tables != undefined){
	    	var selected_data_id = current_selected_data(data);
		    if(selected_data_id != undefined && selected_data_id.length > 0){
		    	// Clear data in filter area
		    	
		    	reset_filter();
		    	
		    	search_selected_dots = selected_data_id;
				update_filter(data_view_radiomic_result);
				//update_plot(data_view_radiomic_result);
				
				update_filter(data_view_clinical_outcomes);
			    //update_plot(data_view_clinical_outcomes);
				
				// Data at row
				 $('#data_table_clinical_outcomes > div.jexcel-content > table [id*="row"]').on('click', function(idx, tr){
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
		// When click on data point.
		console.log(e, data);
	    search_selected_dots =  current_selected_data(data);
	    update_filter(data_view_clinical_outcomes);
	    update_filter(data_view_radiomic_result);
	    
//	    var pn='',
//	    tn='',
//	    colors=[];
//		for(var i=0; i < data.points.length; i++){
//		    pn = data.points[i].pointNumber;
//		    tn = data.points[i].curveNumber;
//		    colors = data.points[i].data.marker.color;
//		};
//		colors[pn] = '#C54C82';
//	
//		var update = {'marker':{color: colors, size:10}};
//		Plotly.restyle('myDiv', update, [tn]);
	  
	    // update selected data point color. Any data view can pass here.
	    // update_plot(data_view_clinical_outcomes);

	});
	
	$('#plotjs_container').on('plotly_doubleclick', function(e, data){
	    console.log('plotly_doubleclick:', e);
	    //Reset filtered data in table to unfiled.
	    reset_filter();
	    update_filter(data_view_clinical_outcomes);
	    // update_plot(data_view_clinical_outcomes);
	});
	
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
//		    Slick.GlobalEditorLock.cancelCurrentEdit();
//		    // clear on Esc
//		    if (e.which == 27) {
//		      this.value = "";
//		    }
		    txt_search = this.value;
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);

	  });
	  
	  $("#search_id").on('change',function (e) {
		    search_id = this.value;
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);
	  });
	  
	  
	  $("#sel_gender").on('change',function (e) {
		    sex = this.value;
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);
	  });
	  
	  // Bind slide to the div in order to see the change on graph
	  // and bind slidechange to update last min, max value
      $("#slider-range-age").on( "slide slidechange", function( event, ui ) {
		  	age_min = $( "#slider-range-age" ).slider( "values", 0 ); 
			age_max =  $( "#slider-range-age" ).slider( "values", 1 );
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);
	  } );
      
      
      $("#slider-range-height").on( "slide slidechange", function( event, ui ) {
		  	height_min = $( "#slider-range-height" ).slider( "values", 0 ); 
			height_max =  $( "#slider-range-height" ).slider( "values", 1 );
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);
	  } );
      
      $("#slider-range-weight").on( "slide slidechange", function( event, ui ) {
		  	weight_min = $( "#slider-range-weight" ).slider( "values", 0 ); 
			weight_max =  $( "#slider-range-weight" ).slider( "values", 1 );
		    update_filter(data_view_clinical_outcomes);
		    update_plot(data_view_clinical_outcomes);
	  } );
	   
	   // Reset filter when button is clicked.
	   $('#btn_reset_filter').on('click', function(e){
		   reset_filter();
		   update_filter(data_view_radiomic_result);
		   update_plot(data_view_radiomic_result);
		   update_filter(data_view_clinical_outcomes);
		   update_plot(data_view_clinical_outcomes);
	   })
	   
	 
});

/**
 * Generate buttons for displaying different colorscale.
 * @param arr_columns
 * @returns
 */
function generate_colorscale_buttons(arr_columns){
	
	var target_area = $('#colorscale_buttons');
	for(var col_idx in arr_columns) {
		var col_name = arr_columns[col_idx]
		if(col_name == "id"){
			//Skip when column's ID is "id" because it's for slickgrid row data.
			continue;
		}else{
		    var button = $('<button/>', {
		        text: col_name, 
		        id: 'btn_colorscale_'+col_idx,
		        click: function () { 
		        	// console.log($(this).text()); 
		        	restyle_plot3d_colorscale($(this));
		        	//Set button style to disable and enable the rest.
		        	// add bootstrap class
		        	//$(this).addClass("disabled");
		        }
		    });
		    button.addClass("btn btn-default");
		    target_area.append(button);
		}
	  }	
}

//function plotlyjs_3d_scatter(graphDiv, data){
//	
//	var arr_x = Object.keys(df.x).map(function(_) { return df.x[_]; })
//	var arr_y = Object.keys(df.y).map(function(_) { return df.y[_]; })
//	var arr_z = Object.keys(df.z).map(function(_) { return df.z[_]; })
//	
//	var arr_label = Object.keys(df.label).map(function(_) { return df.label[_]; })
//	var arr_unique_label = arr_label.filter((v, i, a) => a.indexOf(v) === i);
//	
//	//arr_feid = Object.keys(df['f.eid']).map(function(_) { return df['f.eid'][_]; })
//
//	var arr_clusters = [];
//	// Create array of traces based on label
//	var data = [];
//	for(var idx in arr_unique_label){
//		//console.log(arr_unique_label[idx]);
//		
//		label = arr_unique_label[idx];
//		var idx_cluster_data = arr_label.map((e, i) => e === label ? i : '').filter(String)
//		// Find data in current label to create a trace.
//		var arr_cx = [];
//		var arr_cy = [];
//		var arr_cz = [];
//		var arr_text = [];
//		var cluster_data = [];
//		var custom_data= [];
//		for(var xi in idx_cluster_data){
//			var pt_x = arr_x[idx_cluster_data[xi]];
//			var pt_y = arr_y[idx_cluster_data[xi]];
//			var pt_z = arr_z[idx_cluster_data[xi]];
//			//var pt_feid = arr_feid[idx_cluster_data[xi]];
//			arr_cx.push(pt_x);
//			arr_cy.push(pt_y);
//			arr_cz.push(pt_z);
//			//arr_text.push("f.eid: "+pt_feid);
//			//cluster_data.push(pt_feid);
//			//var test = "test custom data: "+pt_feid;
//			//custom_data.push(test);
//		}
//		
//		var trace = {
//				  x: arr_cx,
//				  y: arr_cy,
//				  z: arr_cz,
//				  //ids: cluster_data,
//				  //customdata: cluster_data,
//				  name: label,
//				  legendgroup: "group"+idx,
//				  mode: 'markers',
//				  type: 'scatter3d',
//				  //name: 'Cluster '+idx,
//				  text: arr_text,
//				  textposition: 'top center',
//				  textfont : {
//					    family:'Times New Roman'
//					  },
//				  marker: { size: 5, opacity:0.7}
//				};
//		
//		data.push(trace);
//		//arr_clusters.push(cluster_data);
//	}
//	var layout = {
//			  title: '',
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
//			  }
//			};
//	Plotly.newPlot(graphDiv, data, layout);
//}

//function get_layout(){
//	//gray  backgroundcolor: 'rgb(230, 230,230)'
//	   var layout = {
//			   	scene: {
//					xaxis:{title: _columns[0],
//						 //backgroundcolor: "rgb(200, 200, 230)",
//						 backgroundcolor: 'rgb(230, 230,230)',
//						 gridcolor: "rgb(255, 255, 255)",
//						 showbackground: true,
//						 zerolinecolor: "rgb(255, 255, 255)"
//					},
//					yaxis:{title:  _columns[1],
//						//backgroundcolor: "rgb(230, 200,230)",
//						backgroundcolor: 'rgb(230, 230,230)',
//						gridcolor: "rgb(255, 255, 255)",
//						showbackground: true,
//						zerolinecolor: "rgb(255, 255, 255)"
//					},
//					zaxis:{title:  _columns[2],
//					 	//backgroundcolor: "rgb(230, 230,200)",
//						backgroundcolor: 'rgb(230, 230,230)',
//					 	gridcolor: "rgb(255, 255, 255)",
//					 	showbackground: true,
//					 	zerolinecolor: "rgb(255, 255, 255)"
//					}},
//					 
//				  autosize : true,
//				  title: 'Radiomic Space',
////				  xaxis: {
////				    showgrid: true,
////				    zeroline: false
////				  },
////				  yaxis: {
////				    showgrid: true,
////				    showline: false,
////				    zeroline: false
////				  },
////				  zaxis: {
////					    showgrid: true,
////					    showline: false,
////					    zeroline: false
////				  },
//				  //dragmode: 'lasso', /* Set default selection tool to lasso*/
//				  hovermode: 'closest', /*Change default on hover to the data point itself*/
//				  // showlegend: true,
//				  
//	    };
//	   return layout;
//}

function restyle_plot3d_colorscale($button){
	// Get value of selected column 
	var arr_colorscale = [];
	var target_column = $button.text();
	// Check if target column is categorical data or numeric
	// In case of categorical data => display legend 
	// In case of numeric => display legend 
	var is_cate = false;
	for(var idx in _clinical_outcomes_cate_columns_name){
		if(target_column == _clinical_outcomes_cate_columns_name[idx]){
			is_cate = true;
			break;
		}
	}
	
	for ( i in _dt_clinical_outcomes){
		arr_colorscale[i] = _dt_clinical_outcomes[i][target_column];
	}
	
	var update;
	var layout = radiomic_layout;
	if(is_cate){
		
//		var data = JSON.parse(plot.original_data)
//		trace_options['marker'] = plot3d_marker_cate;
//		trace_options['legendgroup_prefix_text'] = "";
//		var ori_data_traces = get_data_traces(data, trace_options);
//		for(var t_idx in ori_data_traces){
//			var trace = ori_data_traces[t_idx];
//			data_traces.push(trace);
//		}
		
		// categorical data, data will be clustered.
		// clear data_traces
		var traces = [];
		//plot3d_marker_cate.color = arr_colorscale;
		// call common_graph.js to get array of {x: arr_cx, y:arr_cy, z: arr_cz, label: label, arr_id:arr_cid}
		var arr_x = get_obj_values(_plot_data.x);
		var arr_y = get_obj_values(_plot_data.y);
		var arr_z = get_obj_values(_plot_data.z);
		// Label take from clinical items 
		var arr_label = arr_colorscale;
		var arr_ids = get_obj_values(_plot_data.label);
		var clusters = get_3d_cluster_data(arr_x, arr_y, arr_z, arr_label, arr_ids);
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
//							line: {
//							color: 'rgba(217, 217, 217, 0.14)',
//							width: 0.5},
							opacity: marker_opacity},
					 type: 'scatter3d',
					 ids: curr_cluster.arr_id,
//					  //customdata: cluster_data,
//					  name: curr_cluster.label,
//					  legendgroup: curr_cluster.label,
//					  mode: 'marker+text',
//					  type: 'scatter3d',
					  text: curr_cluster.arr_id,
					  textposition: 'top center',
//					  textfont : {
//						    family:'Times New Roman'
//						  },
//					  marker: {size: 10}
			}//end trace
			traces.push(trace);
		}
//		update = {
//				marker: plot3d_marker_cate,
//		}
	    
		
		layout['showlegend'] = true;
		//update: div, data, layout
		//if(is_new_plot){
		//	is_new_plot = false;
			Plotly.newPlot(graphDiv,traces, layout);
		//}else{
		//	Plotly.update(graphDiv,traces, layout);
		//}

	}else{
		layout['showlegend'] = false;
		plot3d_marker.color = arr_colorscale;
		if(is_new_plot){
			
			plot_3d(graphDiv);
			is_new_plot = false;
		}else{
			update = {
					marker: plot3d_marker
			}
			Plotly.update(graphDiv,update, layout);
		}
		//Plotly.update(graphDiv, update, layout);
	}

	
	disable_colorscales_button($button);
}

/**
 * Add CSS "disabled" to provided button object and remove the CSS to the rest.
 * @param $button
 * @returns None
 */
function disable_colorscales_button($button){
	// Add disabled class to the button
	$('#colorscale_buttons').children().each(function(idx,obj){
		//console.log(idx,obj);
		$(obj).removeClass('disabled');
	});
	
	$button.addClass('disabled');
}
function plot_3d(graphDiv){
	if(_plot_data != undefined){
	var trace_options = {};
	if (is_hidden_marker_text == true){
		trace_options['mode'] =  "markers+text";
	}else{
		trace_options['mode'] =  "markers";
	}
	
	
		//Get data to plot from df variables.
		var arr_x = get_obj_values(_plot_data.x);
		var arr_y = get_obj_values(_plot_data.y);
		var arr_z = get_obj_values(_plot_data.z);
		var arr_label = get_obj_values(_plot_data.label);
		legendgroup = '';
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
		_data_traces.push(trace);
		Plotly.newPlot(graphDiv, _data_traces, radiomic_layout);
	}
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
    
    for (var t_idx in _data_traces){
    	var selected_points = get_indexes(_data_traces[t_idx].ids, filtered_ids);
    	_data_traces[t_idx].selectedpoints = selected_points;
    }
}
 
    Plotly.update(graphDiv, _data_traces, radiomic_layout);
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

