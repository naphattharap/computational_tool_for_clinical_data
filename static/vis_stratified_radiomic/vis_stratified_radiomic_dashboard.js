
var male_color = "rgb(86, 179, 247)";
var female_color = "rgb(238, 187, 247)";


var trace_pie_gender = {
		  values: [19, 26],
		  labels: ['Male', 'Female'],
		  type: 'pie',
		  domain: {
			  row: 0,
			  column: 0
			  },
			  marker: {
				    colors: [male_color, female_color]
				  },
		  hoverinfo: 'none',
		  textinfo: 'label+percent+value' //'label+percent+name',
		  
		};
	
	var layout = {
			title: 'Total ' + 45,
			 width: 250,
	 		// grid: {rows: 2, columns: 3, pattern: 'independent'},
	  		showlegend: false
	};
	// {displayModeBar: false} = hide toolbox
	Plotly.newPlot('plot_gender', [trace_pie_gender], layout,{displayModeBar: false});
	
	// x = arg range
	// y =

	var male = {
	  x: ["<= 20", "21 - 40", "41 - 60", " > 60"],
	  y: [20, 14, 23, 1],
	  name: "Male",
	  type: "bar",
	  marker: {color: male_color},
	  barmode: "stack",
	  domain: {
		    row: 0,
		    column: 1
	 } 
		
	};
	 var female = {
	  x: ["<= 20", "21 - 40", "41 - 60", " > 60"],
	  y: [12, 18, 29, 2],
	  name: "Female",
	  type: "bar",
	  marker: {color: female_color},
	  barmode: "stack",
	  domain: {
		    row: 0,
		    column: 1
		  }
	}; 
	 
	 var layout_gender_age = {
		  title: 'Gender vs Age',
		  width: 400,
		   barmode: "stack",
	       
		  showlegend: true ,
		  xaxis: {domain: [0.8, 0.1]} // size of stacked bar
		};
	
	Plotly.newPlot('plot_gender_age', [male, female], layout_gender_age, {displayModeBar: false});
	//Plotly.plot('gender_graph', trace4, layout);
	// barmode: "stack"
	
	
	// ======== BMI
	var data_bmi = [{
	  values: [1,2,3,4],
	  labels: ["Underweight", "Normal", "Overweight", "Obese"],
	  //domain: {column: 0},
	  name: '',
	  marker: {colors: ["rgb(1, 128, 191)", "rgb(1, 163, 103)", "rgb(249, 225, 44)", "rgb(193, 21, 1)"]},
	  hoverinfo: 'label+percent+name',
	  hole: .5,
	  type: 'pie'
	}];

var layout_bmi = {
  title: '',
  //autoresize: true,
  height: 300,
  width: 350,
  showlegend: true,
  //grid: {rows: 1, columns: 2}
  annotations: [
	    {
	      font: {
	        size: 18
	      },
	      showarrow: false,
	      text: 'BMI',
	      x: 0.5,
	      y: 0.5
	    }
	  ]
};

Plotly.newPlot('plot_bmi', data_bmi, layout_bmi, {displayModeBar: false});



// ===========
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

Plotly.newPlot('plot_nutrition_factor_bar', data, layout3);