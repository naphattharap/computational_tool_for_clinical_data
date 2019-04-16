
/**
 * Render content in table when scroll down.
 * @returns
 */
function render_by_jexcel(columns, data, current_last_row_idx, len_data) {
	//Slice object based on current last row index and length of row data.
	if (len_data == 0){
		// Clear previous rendered data
		$('#data_table div').html('');
		$('#data_table').jexcel({
			data : {},
			colHeaders : columns
		});
		
	}else if(data != undefined && (current_last_row_idx != len_data)){
		
		//Find then end of slice
		var temp_end_row_idx = 0;
		if(current_last_row_idx+len_load > len_data){
			temp_end_row_idx = len_data;
		}else{
			temp_end_row_idx = current_last_row_idx + len_load;
		}
		// Clear previous rendered data
		$('#data_table div').remove();
		
		$('#data_table').jexcel({
			data : data.slice(current_last_row_idx, temp_end_row_idx),
			colHeaders : columns
		});
		
		current_last_row_idx = temp_end_row_idx; 
	}
	return current_last_row_idx;
}

/**
 * Render content in table when scroll down.
 * @returns
 */
function render_more_data(columns, data, current_last_row_idx, len_data, len_load) {
	//Slice object based on current last row index and length of row data.
	if(data != undefined && (current_last_row_idx != len_data)){
		//Find then end of slice
		var temp_end_row_idx = 0;
		if(current_last_row_idx+len_load > len_data){
			temp_end_row_idx = len_data;
		}else{
			temp_end_row_idx = current_last_row_idx + len_load;
		}
		
		// appendTo table
		// $('#data_table').appendTo(new_tr);

		// Clear previous rendered data
		//$('#data_table div').html('');
		var append_data = data.slice(current_last_row_idx, temp_end_row_idx);
		var len_row = append_data.length;
		var at_row_idx = current_last_row_idx;
		// false = don't clone event and data.
		
		var $tableBody = $('#data_table > div.jexcel-content > table > tbody');
		for (var r_idx = 0; r_idx < len_row; r_idx++){
			$trLast = $tableBody.find("tr:last");
			var new_tr = $trLast.clone();
			//console.log("append at "+after_row_idx);
			//$('#data_table').jexcel('insertRow', append_data[i], after_row_idx);
			// var new_tr = cloned_tr;
			
			// Replace row  id
			new_tr[0].id = "row-"+at_row_idx; 

			//Loop through all columns but minus one for row label which is not in original data.
			var len_col = new_tr[0].childElementCount - 1;
			
			// Take row data to be rendered
			var row_data = append_data[r_idx];

			// At column 0, set row number
			var td_idx = 0;
			var td_0 = new_tr[0].childNodes[td_idx];
			td_0.innerText = at_row_idx+1;

			// Iterate from td_1 with column index from 0.
			for(var c_idx = 0; c_idx < len_col; c_idx++){
				td_idx += 1;
				var col_data = row_data[c_idx];
				var curr_td = new_tr[0].childNodes[td_idx];
				var obj_curr_td = $(curr_td);
				obj_curr_td.removeClass();
				obj_curr_td.text(col_data);
				// format = column index + "-" + row index // zero based
				obj_curr_td.attr('id', c_idx + "-" + at_row_idx) 
				obj_curr_td.addClass("c"+c_idx);
				obj_curr_td.addClass("r"+at_row_idx);
			}
			//console.log(new_tr.html());
			$trLast.after(new_tr);
			at_row_idx += 1;
		}
		current_last_row_idx = temp_end_row_idx; 
	}
	
	return current_last_row_idx;
}



/**
 * Render content in table when scroll down.
 * @returns
 */
function render_table(target_div_id, columns, data) {
	if(data != undefined){
		// Clear previous rendered data
		$('#'+target_div_id+' div').remove();
		
		var colWidths = [];
		for(var idx in columns){
			var column_text = columns[idx];
			// refer to column width in common.js
			colWidths.push(Math.ceil(column_text.width()));
		}
		$('#'+target_div_id).jexcel({
			data : data,
			colHeaders : columns,
			colWidths: colWidths
		});
		
	}
}

