$(document).ready(function() {

	$("#search_title").click(function(e) {
		$("#seach_criterion_section").toggle();
	});

	// Auto-complete file
	var url_suggest_files = $("#suggest_files").attr("data-url");
	$("#data_file_name").autocomplete({
		source : function(request, response) {
			$.get(url_suggest_files, {
				query : request.term
			}, function(data) {
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			// current_selected_file = term.item.value;
		},
		minLength : 2
	});

	// =============== Load Graph: Hierarchical Analysis ================
	// URL for handling event when user clicks on load graph button
	// var url_hierarchical_analysis =
	// $("#hierarchical_analysis").attr("data-url");
	$("#btn_load_hierarchy").on("click", {
		url : $("#hierarchical_analysis").attr("data-url"),
		div_target : $("#plot_hierarchy")
	}, load_graph);
	$("#btn_load_mean_shift").on("click", {
		url : $("#mean_shift_analysis").attr("data-url"),
		div_target : $("#plot_mean_shift")
	}, load_graph);
	$("#btn_load_kmean").on("click", {
		url : $("#kmean_analysis").attr("data-url"),
		div_target : $("#plot_kmean"),
		n_clusters : $("#n_clusters")
	}, load_graph);
	$("#btn_load_silhouette").on("click", {
		url : $("#silhouette_analysis").attr("data-url"),
		div_target : $("#plot_silhouet")
	}, load_graph);
	$("#btn_load_elbow").on("click", {
		url : $("#elbow_method").attr("data-url"),
		div_target : $("#plot_elbow")
	}, load_graph);

});

function load_graph(event) {
	// var formData = new FormData();
	if (!validate_required_fields()){
		return false;
	}
	var data_file_name = $('#data_file_name').val().trim();
	if (data_file_name != "") {
		var column_header = $('#column_header').val();

		var data = {
			data_file_name : data_file_name,
			column_header : column_header
		};
		
		if(event.target.id == "btn_load_kmean"){
			data['n_clusters'] = $("#n_clusters").val().trim();
		}else if(event.target.id == "btn_load_elbow"){
			
			data['n_cluster_from'] = $("#elbow_n_cluster_from").val().trim();
			data['n_cluster_to'] = $("#elbow_n_cluster_to").val().trim();
			
		}else if(event.target.id == "btn_load_silhouette"){
			data['n_cluster_from'] = $("#silhouette_n_cluster_from").val().trim();
			data['n_cluster_to'] = $("#silhouette_n_cluster_to").val().trim();
		}
		$.ajax({
			type : "GET",
			dataType : "json",
			url : event.data.url,
			data : data,
			beforeSend : function(e) {
				$(".spinner").show();
			},
			complete : function() {
				$(".spinner").hide();
			},
			success : function(resp) {
				// Plot graph to target div
				alert_message(resp);

				var div_plot = $('<div />').html(resp.plot).text();
				var $target = event.data.div_target;
				$target.html('');
				$target.append(div_plot);
			},
			error : function(resp) {
				alert_error_message(resp);
			}
		});
	}
}

function validate_required_fields(){
	if($('#data_file_name').val().trim() == ""){
		error_html = add_required_field_messages("Data File");
		var msg = {msg_error: error_html};
		alert_message(msg);
		return false;
	}else{
		return true;
	}
}