// ======== SlickGrid =========

var data_view_medical_history;
var data_view_radiomic_result;
var all_grids = [];
var plugin = new Slick.ColumnGroup();
//======== SlickGrid Option =========

var options = {
  columnPicker: {
    columnTitle: "Columns",
    hideForceFitButton: false,
    hideSyncResizeButton: false, 
    forceFitTitle: "Force fit columns",
    syncResizeTitle: "Synchronous resize",
  },
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  asyncEditorLoading: true,
  forceFitColumns: false,
  topPanelHeight: 25,
  frozenColumn: 0, // Frozen first column
  enableColumnReorder: true //Group column
};
var sortcol = "id";
var sortdir = 1;
//var percentCompleteThreshold = 0;



// ========= Column to display in Grid ========
var columns_rediomic_result = [ "id",
	"0","1","2","3","4","5","6","7","8","9","10",
	"11", "12","13","14","15","16","17","18","19","20",
	"21","22","23","24","25","26","27","28","29","30"
];


function get_radiomic_grid_columns(arr_columns){
	//arr_columns is column
	//groupName: "Group-1"
	// Not good layout shown, so not using
	var columns = [];
	for(var i in arr_columns){
		var col_field = arr_columns[i];
		columns.push({id: i, name:col_field, field:col_field});
//		if(i <= 15){
//			columns.push({id: i, name:col_field, field:col_field, groupName: "Shape"});
//		}else if (i <= 30){
//			columns.push({id: i, name:col_field, field:col_field, groupName: "First Order"});
//		}
	}
	return columns;
}

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
//var columns = [];
//	if(target_div_id == "grid_radiomic_result"){
//		columns = get_radiomic_grid_columns(arr_columns);
//	}else{
//		columns = get_grid_columns(target_div_id, arr_columns);
//	}
 columns = arr_columns;
	
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
  
  // Register plugin for grouping column
 // grid.registerPlugin(plugin);
 // grid.render();
  
  // if you don't want the items that are not visible (due to being filtered out
  // or being on a different page) to stay selected, pass 'false' to the second arg
  dataView.syncGridSelection(grid, true);
  $("#gridContainer").resizable();
  
  return dataView;
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
 

 function enableGrouping() {
     plugin.enableColumnGrouping();
 }
 
 function removeGrouping() {
     plugin.removeColumnGrouping();  
 }
 
 

