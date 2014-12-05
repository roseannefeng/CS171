/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;



var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var dataSet = {};

var svg = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

// --- this is just for fun.. play around with it if you like :)
var projectionMethods = [
    {
        name:"mercator",
        method: d3.geo.mercator().translate([width / 2, height / 2]).precision(.01)//;
    },{
        name:"equiRect",
        method: d3.geo.equirectangular().translate([width / 2, height / 2])//.precision(.1);
    },{
        name:"stereo",
        method: d3.geo.stereographic().translate([width / 2, height / 2])//.precision(.1);
    }
];
// --- this is just for fun.. play around with it if you like :)


var actualProjectionMethod = 0;
var colorMin = colorbrewer.Greens[3][0];
var colorMax = colorbrewer.Greens[3][2];
var color = d3.scale.quantize().range([colorMin, colorMax]);


var path = d3.geo.path().projection(projectionMethods[0].method);




function runAQueryOn(indicatorString) {
	valueArray = {};
	$.ajax({
		url: "http://api.worldbank.org/countries/all/indicators/" + indicatorString + "?format=jsonP&prefix=Getdata&per_page=32000", //&date=" + year, //do something here
		async: false,
		jsonpCallback:'getdata',
		dataType:'jsonp',
		success: function (data, status){
			$.each(data[1], function(index, value) {
				if (value.value != null)
					valueArray[value.country.id] = value.value;
				});
			//console.log("valueArray of" + indicatorString, valueArray);
			return valueArray;
			},
		error: function() {
			return console.log("error");
			} 
	});
}


var initVis = function(error, indicators, world, countries){
    console.log("indicators", indicators);
    console.log("world", world);
	console.log("countries", countries);

	
/*	var q = queue();
	indicators.forEach(function(d) {q.defer(runAQueryOn, d.IndicatorCode)});
	q.await(dummy);*/

//	runAQueryOn(indicators[0].IndicatorCode);
	
	svg.selectAll("path")
		.data(world.features)
		.enter().append("path") 
		  .attr("class", "country")
		  .attr("d", path)
		  .style("fill", "white");	
	
}

var dummy = function(error, results) {
	console.log("done", results);	
}

// very cool queue function to make multiple calls.. 
// see 
queue()
    .defer(d3.csv,"../data/worldBank_indicators.csv")
    .defer(d3.json,"../data/world_data.json")
    .defer(d3.json,"../data/WorldBankCountries.json")
    .await(initVis);


// just for fun 
var textLabel = svg.append("text").text(projectionMethods[actualProjectionMethod].name).attr({
    "transform":"translate(-40,-30)"
})

var changePro = function(){
    actualProjectionMethod = (actualProjectionMethod+1) % (projectionMethods.length);

    textLabel.text(projectionMethods[actualProjectionMethod].name);
    path= d3.geo.path().projection(projectionMethods[actualProjectionMethod].method);
    //svg.selectAll(".country").transition().duration(750).attr("d",path);
};

d3.select("body").append("button").text("changePro").on({
    "click":changePro
})






//})




