$(document).ready(function() {

	$("#section1_title").click(function(e) {
		$("#section1").toggle();
	});
	
	var url_model_info = $("#model_info").attr("data-url");
	$("#inp_model_file_name").autocomplete({
		source : function(request, response) {
			$.get(url_model_info, {
				query : request.term
			}, function(data) {
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			current_selected_file = term.item.value;
		},
		minLength : 2
	});
	
	
	var url_data_info = $("#data_info").attr("data-url");
	$("#inp_data_file_name").autocomplete({
		source : function(request, response) {
			$.get(url_data_info, {
				query : request.term
			}, function(data) {
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			current_selected_file = term.item.value;
		},
		minLength : 2
	});
	
	var url_data_detail_info = $("#data_detail_info").attr("data-url");
	$("#inp_data_detail").autocomplete({
		source : function(request, response) {
			$.get(url_data_detail_info, {
				query : request.term
			}, function(data) {
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			current_selected_file = term.item.value;
		},
		minLength : 2
	});
	
	
	var url_vis_2d = $("#flex_vis_2d").attr("data-url");
	$("#btn_vis_2d").bind("click",function(){
		
		var inp_model_file_name = $("#inp_model_file_name").val().trim();
		var inp_data_file_name = $("#inp_data_file_name").val().trim();
		var inp_data_detail = $("#inp_data_detail").val().trim();
		
		
		var data = {model_file_name : inp_model_file_name, 
					data_file_name: inp_data_file_name, 
					data_detail_file_name: inp_data_detail}
		$.ajax({
			type: "GET",
			dataType : "json",
			url : url_vis_2d,
			data : data,
			beforeSend: function(e){
				$(".spinner").show();
			},
			complete:function(){
				$(".spinner").hide();
			},
			success : function(resp) {
				console.log(JSON.stringify(resp));
				if(resp.msg){
					$("#result-msg-info").text(resp.msg);
					$("div.alert.alert-info").show();
					
					$("#section1").toggle();
					
				}else if(resp.msg_error){
					var div_error = $('<div />').html(resp.msg_error).text();
					//console.log(div_error);
					$("div.alert.alert-danger").show();
					$("#result-msg-error").after(div_error);
				}
				
				if (!resp.msg_error){
					// console.log(resp.bokeh_plot.script);
					// Remove previous content in div and render new data.
					$("#bokeh_plot").empty();
					$("#bokeh_plot").append(resp.bokeh_plot.script);
					$("#bokeh_plot").append(resp.bokeh_plot.div);
				}
			},
			error : function(resp) {
				if (resp.msg != undefined && resp.msg != ""){
					$("#result-msg-error").after(resp.msg);
				}else{
					$("#result-msg-error").after(resp.statusText);
				}
				
				$("div.alert.alert-danger").show();
			}
		});
	});
	
	
	
	
});