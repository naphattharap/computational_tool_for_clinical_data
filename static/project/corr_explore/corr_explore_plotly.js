function example(){
	var trace_name_alco = "Alcohol intake";
	var trace9 = {
	  x: [
	    [	trace_name_alco, trace_name_alco, trace_name_alco,
	    	trace_name_alco,
	    ],
	    [	'Never',
	    	'...', 
	    	'.....', 
	    	'Daily or almost daily' ]
	  ],
	  y: [1, 5, 5, 29],
	  name: trace_name_alco,
	  type: 'bar',
	  width: 0.3
};
	
var trace_name = "Never eat eggs, dairy, wheat, sugar";
var trace1 = {
  x: [
      	[   trace_name, trace_name, trace_name, trace_name],
    	[	'I eat all of the above', 
    		'Sugar or foods/drinks containing sugar',
    		'Wheat products', 
    		'Eggs or foods containing eggs']
  ],
  y: [8, 24, 5, 3],
  name: trace_name,
  text: ["a", "b", "c", "d"],
  textinfo: 'label+percent+value',
  type: 'bar',
  width: 0.3
};

var trace_name2 = "sleep duration"
var trace2 = {
  x: [
    [trace_name2, trace_name2, trace_name2],
    ['<5', '5 - 10', '> 10']
  ],
  y: [8, 22, 5,5],
  name: trace_name2,
  type: 'bar',
  width: 0.3
};


var trace_name3 = "activity 3"
	var trace3 = {
	  x: [
	    [trace_name3, trace_name3, trace_name3],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [5,5, 20, 10],
	  name: trace_name3,
	  type: 'bar',
	  width: 0.3
	};
	
var trace_name4 = "activity 4"
	var trace4 = {
	  x: [
	    [trace_name4, trace_name4, trace_name4],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [10, 20, 5,5],
	  name: trace_name4,
	  type: 'bar',
	  width: 0.3
	};
	
var trace_name5 = "activity 5"
	var trace5 = {
	  x: [
	    [trace_name5, trace_name5, trace_name5],
	    ['<5', '5 - 10', '> 10']
	  ],
	  y: [15, 15, 5,5],
	  name: trace_name5,
	  type: 'bar',
	  width: 0.3
};

var trace_name6 = "Beek intake in a week";
	var trace6 = {
	  x: [
	    [	trace_name6, trace_name6, trace_name6,
	    	trace_name6, trace_name6, trace_name6,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name6,
	  type: 'bar',
	  width: 0.3
};
	
	
	var trace_name7 = "Poultry intake in a week";
	var trace7 = {
	  x: [
	    [	trace_name7, trace_name7, trace_name7,
	    	trace_name7, trace_name7, trace_name7,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name7,
	  type: 'bar',
	  width: 0.3
};
	
// processed meat intake
	var trace_name8 = "Processed meat intake";
	var trace8 = {
	  x: [
	    [	trace_name8, trace_name8, trace_name8,
	    	trace_name8, trace_name8, trace_name8,
	    ],
	    [	'Never',
	    	'Less than once a week', 
	    	'once a week', 
	    	'2-4 times a week',
	    	'5-6 times a week',
	    	'Once or more daily' ]
	  ],
	  y: [1, 5, 5,5, 10, 14],
	  name: trace_name8,
	  type: 'bar',
	  width: 0.3
};

//cheese intake

var data = [trace9, trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];
var layout3 = {
 // autoresize: true,
  showlegend: true,
  width: 1200,
  height: 500,
  xaxis: {
     tickson: "boundaries",
    ticklen: 10,
    showdividers: true,
    dividercolor: 'grey',
    dividerwidth: 0
  }, 
  barmode: 'group',
  bargap: 0.25,
  bargroupgap: 0.1
};

Plotly.newPlot('plot_strat_bar', data, layout3);
}


function plot_strat_mean_bar(traces){
	if(traces != undefined && traces.length > 0){
		// data for keeping all traces
		var data = [];
		for(t_idx in traces){
			temp_trace = traces[t_idx];
			// Generate array of duplicate trace name for grouping bar in case there are many groups
			var t_name = temp_trace.trace_name
			var len_group_item = temp_trace.x_labels.length
			var arr_t_name = []
			for(var i = 0; i < len_group_item; i++){
				arr_t_name.push(t_name);
			}
			var trace = {
					  x: [arr_t_name, temp_trace.x_labels],
					  y: temp_trace.y_values,
					  text: temp_trace.y_values, // show text on bar
					  name: t_name,
					  type: 'bar'
					  //width: 0.3
				};
			data.push(trace);
		}// end of for
		
		var layout = {
				  autosize: true,
				  showlegend: true,
//				  width: 1200,
//				  height: 500,
				  xaxis: {
//					type: 'category', // error for this
					automargin: true,
					tickangle: 35,
//				    tickson: "boundaries",
//				    ticklen: 10,
				    showdividers: false, // vertical line between group
//				    dividercolor: 'grey',
//				    dividerwidth: 0
				  }, 
				  barmode: 'group',
//				  bargap: 0.25,
				  bargroupgap: 0.25
				};
		Plotly.newPlot('plot_strat_mean_bar', data, layout);
			
	}
	
}