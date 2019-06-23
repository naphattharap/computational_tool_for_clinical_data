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
// Flag for reduce dimension (PCA, LDA) 
// data change when button is clicked
var dim_algo = "";
// Plot
var strat_mean_bar;
var feature_variance_bar;
var fmh_mean_bar;
var plot_reduced_dim;

// Flag to check if it is new plot or not 
// in order to decide whether restyle or newPlot should be used.
var is_new_plot = true;
var NAME_IDX_SEPARATOR = "-";
var HTML_BR = "&lt;br&gt;"


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
	feature_variance_bar = document.getElementById('plot_feature_variance_bar');
	fmh_mean_bar = document.getElementById('plot_fmh_mean_bar');
	
	plot_reduced_dim_pca = document.getElementById('plot_reduced_dim_pca');
	plot_reduced_dim_lda = document.getElementById('plot_reduced_dim_lda');
	// Toggle to show or hide target sect
	// Toggle to show or hide target sections
	bind_toggle_event();
	
	// Upload file handler
	bind_file_upload_event();
	
	// Render plot after selecting feature and criteria
	bind_render_mean_bar_plot();

	// When click on render button
	// bind_button_pca_plot();
	
	$( window ).resize(function() {
		if (strat_mean_bar != undefined && $(strat_mean_bar).html() != ""){
		  Plotly.relayout(strat_mean_bar, {
			  width: $(strat_mean_bar).width(), 
			  height: $(strat_mean_bar).height()  
		  });
		}
		
		if (feature_variance_bar != undefined && $(feature_variance_bar).html() != ""){
			  Plotly.relayout(feature_variance_bar, {
				  width: $(feature_variance_bar).width(), 
				  height: $(feature_variance_bar).height()  
			  });
			}
		
		if (fmh_mean_bar != undefined && $(fmh_mean_bar).html() != ""){
			  Plotly.relayout(fmh_mean_bar, {
				  width: $(fmh_mean_bar).width(), 
				  height: $(fmh_mean_bar).height()  
			  });
			}
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

	 
});


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
			dataType: "json",
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
				// Bind event click for XGBoost
				bind_xgboost_regressor();
				// Bind event for PCA, LDA button
				bind_reduced_dim();
				// Bind execute button for LDA
				//bind_button_lda_execute();
				

				// =============== Tab 2: PCA===============
				// Render feature
				// render_feature_columns(pca_feature_list,'pca_feature_indexes', arr_features);
				// Render table for criterion
				// render_pca_criterion_table(strat_criterions);
				// Bind slider to criterion table
				// bind_pca_criterion_sliders();
				
				// Bind button events
				bind_select_features_by_xgboost();
				
				
				
				// ============== Common events that bind for all bar ========
				// Clear all checked in feature list if clicked
				bind_clear_feature_checked();
				
				// Hide upload file section after success
				$('#upload_file_group').toggle();
			},
			error : function(resp) {
				alert_message(resp);
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
