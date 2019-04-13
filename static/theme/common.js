/**
 * Process result message that comes with response data object from AJAX.
 * There are 4 types of message to be processed here. 
 * E.g. Success, Info, Warning, Error. 
 * All of these types will fall to success function of .ajax.
 */
function alert_message(resp){
	console.log(resp)
	// Hide all previous alert messages.
	$("div.alert.alert-success").hide();
	$("div.alert.alert-info").hide();
	$("div.alert.alert-warning").hide();
	$("div.alert.alert-danger").hide();
	
	if (resp.msg_success != undefined && resp.msg_success != ""){
		$("#result-msg-success").text(resp.msg_success);
		$("div.alert.alert-success").show();
	}else if (resp.msg_info != undefined && resp.msg_info != ""){
		$("#result-msg-info").text(resp.msg_info);
		$("div.alert.alert-info").show();
	}else if (resp.msg_warning != undefined && resp.msg_warning != ""){
		$("#result-msg-warning").text(resp.msg_warning);
		$("div.alert.alert-info").show();
	}else if (resp.msg_error != undefined && resp.msg_error != ""){
		// Remove previous error
		$(".errorlist").remove();
		var div_error = $('<div />').html(resp.msg_error).text();
		//console.log(div_error);
		
		$("#result-msg-error").after(div_error);
		$("div.alert.alert-danger").show();
	}
}

/**
 * Display error message that occurred in server side which is not business error.
 * @param resp
 * @returns None
 */
function alert_error_message(resp){
	$("div.alert.alert-danger").hide();
	if (resp != undefined){
		$("#result-msg-error").text(resp.statusText);
		$("div.alert.alert-danger").show();
	}
}