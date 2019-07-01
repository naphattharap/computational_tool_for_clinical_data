
// === Plotly preperties 
var graphDiv; //Div object to display graph
var data_traces = [];
var is_hidden_marker_text = true; // Toggle text on dots
//var temp_search_dot_color;
//var temp_search_dot_idx;
//var temp_search_dot;

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


// ======== SlickGrid =========

var data_view_medical_history;
var data_view_radiomic_result;
var all_grids = [];

// ========= Column to display in Grid ========
var columns_rediomic_result = [ "id",
	"0","1","2","3","4","5","6","7","8","9","10",
	"11", "12","13","14","15","16","17","18","19","20",
	"21","22","23","24","25","26","27","28","29"
];
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
//	"bio:chest pain or discomfort walking normally:0:baseline",
//	"bio:chest pain or discomfort walking normally:0:imaging",
//	"bio:chest pain due to walking ceases when standing still:0:baseline",
//	"bio:chest pain due to walking ceases when standing still:0:imaging",
//	"bio:age angina diagnosed:0:baseline",
//	"bio:age angina diagnosed:0:imaging",
//	"bio:stomach/abdominal pain for 3+ months:0:baseline",
//	"bio:stomach/abdominal pain for 3+ months:0:imaging",
//	"bio:chest pain or discomfort when walking uphill or hurrying:0:baseline",
//	"bio:chest pain or discomfort when walking uphill or hurrying:0:imaging",
//	"bio:age hay fever, rhinitis or eczema diagnosed:0:baseline",
//	"bio:age hay fever, rhinitis or eczema diagnosed:0:imaging",
//	"bio:knee pain for 3+ months:0:baseline",
//	"bio:knee pain for 3+ months:0:imaging",
//	"bio:age asthma diagnosed:0:baseline",
//	"bio:age asthma diagnosed:0:imaging",
//	"bio:headaches for 3+ months:0:baseline",
//	"bio:headaches for 3+ months:0:imaging",
//	"bio:time since last prostate specific antigen (psa) test:0:baseline",
//	"bio:time since last prostate specific antigen (psa) test:0:imaging",
//	"bio:age heart attack diagnosed:0:baseline",
//	"bio:age heart attack diagnosed:0:imaging",
//	"bio:age emphysema/chronic bronchitis diagnosed:0:baseline",
//	"bio:age emphysema/chronic bronchitis diagnosed:0:imaging",
//	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:baseline",
//	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:imaging",
//	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:baseline",
//	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:imaging",
//	"bio:gestational diabetes only:0:baseline",
//	"bio:gestational diabetes only:0:imaging",
//	"bio:age stroke diagnosed:0:baseline",
//	"bio:age stroke diagnosed:0:imaging",
//	"bio:facial pains for 3+ months:0:baseline",
//	"bio:facial pains for 3+ months:0:imaging",
//	"bio:age glaucoma diagnosed:0:baseline",
//	"bio:age glaucoma diagnosed:0:imaging",
//	"bio:age cataract diagnosed:0:baseline",
//	"bio:age cataract diagnosed:0:imaging",
//	"bio:shortness of breath walking on level ground:0:baseline",
//	"bio:shortness of breath walking on level ground:0:imaging",
//	"bio:leg pain on walking:0:baseline",
//	"bio:leg pain on walking:0:imaging",
//	"bio:cochlear implant:0:baseline",
//	"bio:cochlear implant:0:imaging",
//	"bio:tinnitus:0:baseline",
//	"bio:tinnitus:0:imaging",
//	"bio:tinnitus severity/nuisance:0:baseline",
//	"bio:tinnitus severity/nuisance:0:imaging",
//	"bio:noisy workplace:0:baseline",
//	"bio:noisy workplace:0:imaging",
//	"bio:loud music exposure frequency:0:baseline",
//	"bio:loud music exposure frequency:0:imaging",
//	"bio:which eye(s) affected by amblyopia (lazy eye):0:baseline",
//	"bio:which eye(s) affected by amblyopia (lazy eye):0:imaging",
//	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:baseline",
//	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:imaging",
//	"bio:age when loss of vision due to injury or trauma diagnosed:0:baseline",
//	"bio:age when loss of vision due to injury or trauma diagnosed:0:imaging",
//	"bio:which eye(s) are affected by cataract:0:baseline",
//	"bio:which eye(s) are affected by cataract:0:imaging",
//	"bio:leg pain when standing still or sitting:0:baseline",
//	"bio:leg pain when standing still or sitting:0:imaging",
//	"bio:leg pain in calf/calves:0:baseline",
//	"bio:leg pain in calf/calves:0:imaging",
//	"bio:leg pain when walking uphill or hurrying:0:baseline",
//	"bio:leg pain when walking uphill or hurrying:0:imaging",
//	"bio:leg pain when walking normally:0:baseline",
//	"bio:leg pain when walking normally:0:imaging",
//	"bio:leg pain when walking ever disappears while walking:0:baseline",
//	"bio:leg pain when walking ever disappears while walking:0:imaging",
//	"bio:leg pain on walking : action taken:0:baseline",
//	"bio:leg pain on walking : action taken:0:imaging",
//	"bio:leg pain on walking : effect of standing still:0:baseline",
//	"bio:leg pain on walking : effect of standing still:0:imaging",
//	"bio:surgery on leg arteries (other than for varicose veins):0:baseline",
//	"bio:surgery on leg arteries (other than for varicose veins):0:imaging",
//	"bio:surgery/amputation of toe or leg:0:baseline",
//	"bio:surgery/amputation of toe or leg:0:imaging",
//	"bio:which eye(s) affected by presbyopia:0:baseline",
//	"bio:which eye(s) affected by presbyopia:0:imaging",
//	"bio:which eye(s) affected by hypermetropia (long sight):0:baseline",
//	"bio:which eye(s) affected by hypermetropia (long sight):0:imaging",
//	"bio:which eye(s) affected by myopia (short sight):0:baseline",
//	"bio:which eye(s) affected by myopia (short sight):0:imaging",
//	"bio:which eye(s) affected by astigmatism:0:baseline",
//	"bio:which eye(s) affected by astigmatism:0:imaging",
//	"bio:which eye(s) affected by other eye condition:0:baseline",
//	"bio:which eye(s) affected by other eye condition:0:imaging",
//	"bio:which eye(s) affected by diabetes-related eye disease:0:baseline",
//	"bio:which eye(s) affected by diabetes-related eye disease:0:imaging",
//	"bio:age when diabetes-related eye disease diagnosed:0:baseline",
//	"bio:age when diabetes-related eye disease diagnosed:0:imaging",
//	"bio:which eye(s) affected by macular degeneration:0:baseline",
//	"bio:which eye(s) affected by macular degeneration:0:imaging",
//	"bio:age macular degeneration diagnosed:0:baseline",
//	"bio:age macular degeneration diagnosed:0:imaging",
//	"bio:which eye(s) affected by other serious eye condition:0:baseline",
//	"bio:which eye(s) affected by other serious eye condition:0:imaging",
//	"bio:age other serious eye condition diagnosed:0:baseline",
//	"bio:age other serious eye condition diagnosed:0:imaging",
//	"bio:which eye(s) affected by glaucoma:0:baseline",
//	"bio:which eye(s) affected by glaucoma:0:imaging",
//	"bio:reason for glasses/contact lenses:0:baseline",
//	"bio:reason for glasses/contact lenses:1:baseline",
//	"bio:reason for glasses/contact lenses:2:baseline",
//	"bio:reason for glasses/contact lenses:3:baseline",
//	"bio:reason for glasses/contact lenses:4:baseline",
//	"bio:reason for glasses/contact lenses:0:imaging",
//	"bio:reason for glasses/contact lenses:1:imaging",
//	"bio:reason for glasses/contact lenses:2:imaging",
//	"bio:reason for glasses/contact lenses:3:imaging",
//	"bio:reason for glasses/contact lenses:4:imaging",
//	"bio:eye problems/disorders:0:baseline",
//	"bio:eye problems/disorders:1:baseline",
//	"bio:eye problems/disorders:2:baseline",
//	"bio:eye problems/disorders:3:baseline",
//	"bio:eye problems/disorders:0:imaging",
//	"bio:eye problems/disorders:1:imaging",
//	"bio:eye problems/disorders:2:imaging",
//	"bio:eye problems/disorders:3:imaging",
//	"bio:mouth/teeth dental problems:0:baseline",
//	"bio:mouth/teeth dental problems:1:baseline",
//	"bio:mouth/teeth dental problems:2:baseline",
//	"bio:mouth/teeth dental problems:3:baseline",
//	"bio:mouth/teeth dental problems:4:baseline",
//	"bio:mouth/teeth dental problems:5:baseline",
//	"bio:mouth/teeth dental problems:0:imaging",
//	"bio:mouth/teeth dental problems:1:imaging",
//	"bio:mouth/teeth dental problems:2:imaging",
//	"bio:mouth/teeth dental problems:3:imaging",
//	"bio:mouth/teeth dental problems:4:imaging",
//	"bio:mouth/teeth dental problems:5:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:0:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:1:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:2:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:3:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:0:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:1:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:2:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:3:imaging",
//	"bio:fractured bone site(s):0:baseline",
//	"bio:fractured bone site(s):1:baseline",
//	"bio:fractured bone site(s):2:baseline",
//	"bio:fractured bone site(s):0:imaging",
//	"bio:fractured bone site(s):1:imaging",
//	"bio:fractured bone site(s):2:imaging",
//	"bio:fractured bone site(s):3:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:imaging",
//	"bio:medication for pain relief, constipation, heartburn:0:baseline",
//	"bio:medication for pain relief, constipation, heartburn:1:baseline",
//	"bio:medication for pain relief, constipation, heartburn:2:baseline",
//	"bio:medication for pain relief, constipation, heartburn:3:baseline",
//	"bio:medication for pain relief, constipation, heartburn:0:imaging",
//	"bio:medication for pain relief, constipation, heartburn:1:imaging",
//	"bio:medication for pain relief, constipation, heartburn:2:imaging",
//	"bio:medication for pain relief, constipation, heartburn:3:imaging",
//	"bio:medication for pain relief, constipation, heartburn:4:imaging",
//	"bio:vitamin and mineral supplements:0:baseline",
//	"bio:vitamin and mineral supplements:1:baseline",
//	"bio:vitamin and mineral supplements:2:baseline",
//	"bio:vitamin and mineral supplements:3:baseline",
//	"bio:vitamin and mineral supplements:4:baseline",
//	"bio:vitamin and mineral supplements:5:baseline",
//	"bio:vitamin and mineral supplements:6:baseline",
//	"bio:vitamin and mineral supplements:0:imaging",
//	"bio:vitamin and mineral supplements:1:imaging",
//	"bio:vitamin and mineral supplements:2:imaging",
//	"bio:vitamin and mineral supplements:3:imaging",
//	"bio:vitamin and mineral supplements:4:imaging",
//	"bio:vitamin and mineral supplements:5:imaging",
//	"bio:vitamin and mineral supplements:6:imaging",
//	"bio:pain type(s) experienced in last month:0:baseline",
//	"bio:pain type(s) experienced in last month:1:baseline",
//	"bio:pain type(s) experienced in last month:2:baseline",
//	"bio:pain type(s) experienced in last month:3:baseline",
//	"bio:pain type(s) experienced in last month:4:baseline",
//	"bio:pain type(s) experienced in last month:5:baseline",
//	"bio:pain type(s) experienced in last month:6:baseline",
//	"bio:pain type(s) experienced in last month:0:imaging",
//	"bio:pain type(s) experienced in last month:1:imaging",
//	"bio:pain type(s) experienced in last month:2:imaging",
//	"bio:pain type(s) experienced in last month:3:imaging",
//	"bio:pain type(s) experienced in last month:4:imaging",
//	"bio:pain type(s) experienced in last month:5:imaging",
//	"bio:pain type(s) experienced in last month:6:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:0:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:1:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:2:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:0:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:1:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:2:imaging",
//	"bio:mineral and other dietary supplements:0:baseline",
//	"bio:mineral and other dietary supplements:1:baseline",
//	"bio:mineral and other dietary supplements:2:baseline",
//	"bio:mineral and other dietary supplements:3:baseline",
//	"bio:mineral and other dietary supplements:4:baseline",
//	"bio:mineral and other dietary supplements:5:baseline",
//	"bio:mineral and other dietary supplements:0:imaging",
//	"bio:mineral and other dietary supplements:1:imaging",
//	"bio:mineral and other dietary supplements:2:imaging",
//	"bio:mineral and other dietary supplements:3:imaging",
//	"bio:mineral and other dietary supplements:4:imaging",
//	"bio:mineral and other dietary supplements:5:imaging",
//	"bio:which eye(s) affected by strabismus (squint):0:baseline",
//	"bio:which eye(s) affected by strabismus (squint):0:imaging"
];

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
				
				
				if (data_tables.table1 != undefined 
						&& data_tables.table1.table_data != undefined){
					var grid_data = JSON.parse(data_tables.table1.table_data);
					data_view_radiomic_result = render_grid("grid_radiomic_result", "pager_grid_radiomic_result", grid_data, columns_rediomic_result);
				}
				
				//Row data for slickgrid table
				if (data_tables.table2 != undefined && data_tables.table2.table_data != undefined){
					var grid_data = JSON.parse(data_tables.table2.table_data);
					data_view_medical_history = render_grid("grid_medical_history", "pager_grid_medical_history", grid_data, columns_medical_history);
				}
				
				// Generated and set default to filter
				def_weight_min = weight_min = parseInt(resp.weight_min);
				def_weight_max = weight_max = parseInt(resp.weight_max);
				def_height_min = height_min = parseInt(resp.height_min);
				def_height_max = height_max = parseInt(resp.height_max);
				def_age_min = age_min = parseInt(resp.age_min);
				def_age_max = age_max = parseInt(resp.age_max);
				
				render_slider_filter();
				
				
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
	
	/*
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
	*/

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
		    	// Clear data in filter area
		    	
		    	reset_filter();
		    	
		    	search_selected_dots = selected_data_id;
				update_filter(data_view_radiomic_result);
				update_plot(data_view_radiomic_result);
				
				update_filter(data_view_medical_history);
			    update_plot(data_view_medical_history);
			    
			    //if(data_table.table1 != undefined){
			    	//var arr_all_keys = JSON.parse(data_tables.table1.point_id);
			    	//var data_table1 = JSON.parse(data_tables.table1.table_data);
				    // jExcel: var table_radiomic_result = get_selected_data_table(selected_data_id, disp_table1,data_table, arr_all_keys);
				    
				    //Slick.GlobalEditorLock.cancelCurrentEdit();
				    // clear on Esc
//				    if (e.which == 27) {
//				      this.value = "";
//				    }
				   // search_selected_dots = selected_data_id;
				   // update_filter(data_view_radiomic_result);
				   // update_plot(data_view_radiomic_result);
//				    
			    //}
			    
			    // JExcel
//			    render_table(div_id_radiomic_result, 
//			    		table_radiomic_result.table_columns, 
//			    		table_radiomic_result.table_data);
			    

				 
				/* if(data_tables.table2 != undefined){
					var arr_all_keys = JSON.parse(data_tables.table2.point_id);
					var data_table2 = JSON.parse(data_tables.table2.table_data);
				    if(data_table2 != undefined){
				    	Slick.GlobalEditorLock.cancelCurrentEdit();
					    // clear on Esc
					    if (e.which == 27) {
					      this.value = "";
					    }
					    search_selected_dots = selected_data_id;
					    update_filter(data_view_medical_history);
					    update_plot(data_view_medical_history);
				    } */
					
//					var table2_result = get_selected_data_table(selected_data_id, disp_table2, data_table2, arr_all_keys);
//				    var div_id_tab2 = "data_table_medical_history";
//				    render_table(div_id_tab2, 
//				    		table2_result.table_columns, 
//				    		table2_result.table_data);
	//			}
				
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
	  

	  
	  
//	  $("#sel_health_rating").on('change',function (e) {
//		    Slick.GlobalEditorLock.cancelCurrentEdit();
//		    filter_health_rating = $(this).find(":checked").val();
//		    update_filter(data_view_medical_history);
//		    update_plot(data_view_medical_history);
//	  });
	 
	  
	   
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

 
function get_grid_columns(target_div_id, arr_columns){
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
	return columns;
}

function resize_all_grids_canvas(){
	for(var i in all_grids){
		var grid = all_grids[i];
		grid.resizeCanvas();
	}
}
function render_grid(target_div_id, pager_id, data, arr_columns){

  var columns = get_grid_columns(target_div_id, arr_columns);

	
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  var grid = new Slick.Grid("#"+target_div_id, dataView, columns, options);
  all_grids.push(grid); // Use to fix bug in slickgrid when column disappear after show/hide
  grid.setSelectionModel(new Slick.RowSelectionModel());
  var pager = new Slick.Controls.Pager(dataView, grid, $("#"+pager_id));
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
  
 /* 
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
  */
  
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

  
  
  /*
  
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
  
  */
  
  // initialize the model after all the events have been hooked up
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilterArgs({
      //percentCompleteThreshold: percentCompleteThreshold,
      txt_search: txt_search,
      search_id: search_id,
      //filter_health_rating: filter_health_rating,
      search_selected_dots: search_selected_dots,
      sex: sex,
      age_min: age_min, 
      age_max: age_max, 
      height_min: height_min,
      height_max: height_max,
      weight_min: weight_min,
      weight_max: weight_max      
    });
  dataView.setFilter(filter_data);
  dataView.endUpdate();
  // if you don't want the items that are not visible (due to being filtered out
  // or being on a different page) to stay selected, pass 'false' to the second arg
  dataView.syncGridSelection(grid, true);
  $("#gridContainer").resizable();
  
  return dataView;
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


function update_filter(dataView) {
	if(dataView != undefined){
	    dataView.setFilterArgs({
	      //percentCompleteThreshold: percentCompleteThreshold,
	      txt_search: txt_search,
	      search_id: search_id,
	      filter_health_rating: filter_health_rating,
	      search_selected_dots: search_selected_dots,
	      sex: sex,
	      age_min: age_min, 
	      age_max: age_max, 
	      height_min: height_min,
	      height_max: height_max,
	      weight_min: weight_min,
	      weight_max: weight_max      
	    });
	    dataView.refresh();
	}
}

function filter_data(item, args) {
	// args is set in update_filter() function
	// console.log(args);
	// Search ID
	if (args.search_id != "" 
			&& item[ds_col_id] != args.search_id){
		return false;
	}
	
	// Scan Search
	if (args.txt_search != "" 
		   && item["bio:overall health rating:0:baseline"].indexOf(args.txt_search) == -1) {
	     return false;
	 }
	
	// Health Rating
//	if(args.filter_health_rating != "" 
//		&& item["bio:overall health rating:0:baseline"].indexOf(args.filter_health_rating) == -1) {
//		 return false;
//	}
	// Filter data when dots are selected on plot
	if (args.search_selected_dots != undefined && args.search_selected_dots.length > 0){      
             var multi_filters = args.search_selected_dots;
             var valid=false;
             for(var j=0; j < multi_filters.length; j++){
                 if (multi_filters[j] != undefined && multi_filters[j] != "" && item[ds_col_id] != undefined){
                    // if (("" +item['f:eid']).toLowerCase().indexOf(multiFilters[j].toLowerCase()) != -1){
                	 if (item[ds_col_id] == multi_filters[j]){
                        valid = true;
                     }
                 }
             }
             
             if(!valid){
                 return false;
             }
	}      

	// Sex
	if (args.sex != "" 
		&& item[ds_col_sex] != args.sex){
		return false;
	}
	
	// Age
	if (args.age_min != "" && args.age_max != ""
		&& (item[ds_col_age] < args.age_min || item[ds_col_age] > age_max)){
		return false;
	}
  
	// Height
	if (args.height_min != "" && args.height_max != ""
		&& (item[ds_col_height] < args.height_min || item[ds_col_height] > height_max)){
		return false;
	}	
	
	if (args.weight_min != "" && args.weight_max != ""
		&& (item[ds_col_weight] < args.weight_min || item[ds_col_weight] > weight_max)){
		return false;
	}

   return true;
}

function requiredFieldValidator(value) {
	   if (value == null || value == undefined || !value.length) {
	     return {valid: false, msg: "This is a required field"};
	   }
	   else {
	     return {valid: true, msg: null};
	   }
}

 function percentCompleteSort(a, b) {
   return a["percentComplete"] - b["percentComplete"];
 }
 
 function comparer(a, b) {
   var x = a[sortcol], y = b[sortcol];
   return (x == y ? 0 : (x > y ? 1 : -1));
 }
 
 //Event For clicking on grid
 function toggleFilterRow() {
   grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
 }
 
 
 