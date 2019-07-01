function search_file(url, $target){
	//URL for listing all files
	var url_list_files = $("#url_list_all_file").attr("data-url");
	
	$target.autocomplete({
		source : function(request, response) {
			$.get(url_list_files, {
				query : $target.val()
			}, function(data) {
				console.log(data.file_names);
				response(data.file_names);
			});
		},
		select : function(event, term, item) {
			// console.log("selected: "+event + "|" + term + "|" + item);
			// Get value from term.item.label, term.item.value
			// Get data from file to preview in table.
			current_selected_file = term.item.value;
		},
		minLength : 3
	});
}