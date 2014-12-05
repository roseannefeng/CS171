/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
var zoomed;
var radii = {};

var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var detailVis = d3.select("#detailVis").append("svg").attr({
    width:350,
    height:200
})

var svg2 = detailVis.append("g").attr({
		transform: "translate(" + 0 + "," + 0 + ")"
	});

xticks = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
	"16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

function draw_detail(data, name) {
	svg2.selectAll("rect").remove();

	storage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var time in data) {
		if (time != "USAF") {
			storage[+time.substr(0,2)] = data[time];
		}
	}

	var xScale = d3.scale.ordinal().rangeRoundBands([0, 300]).domain(xticks);
	var yScale = d3.scale.linear().range([130, 0]).domain([d3.min(storage), d3.max(storage)]);	
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.tickValues(xticks);
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");	
	svg2.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, 150)")
		.call(xAxis);
	svg2.selectAll("text")
		.attr("transform", "rotate(270, 0, 0), translate(-20, -10)");
	svg2.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0, 20)")
		.call(yAxis);

	perhour = svg2.selectAll("bar")
				.data(storage)
				.enter().append("g")
					.attr("class", "bar");
	perhour.append("rect")	
			.attr("x", function(d, i) {return (i+1)*12;})
			.attr("y", 20)
			.attr("width", "12px")
//			.attr("opacity", 0.2)
			.attr("height", function(d) {return (130 - yScale(d)) + "px";})
			.attr("transform", function(d) {return "translate(0," + yScale(d) + ")"})
			.append("svg:title")
				.text(function(d, i) {return [xticks[i], d];});
	
	svg2.append("text")
		.attr("x", 10)
		.attr("y", 10)
		.attr("text-anchor", "left")
		.style("font-size", "9pt")
		.style("font-family", "sans-serif")
		.text(name);
}	

var canvas = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    })
	
var svg = canvas.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });


var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);

var dataSet = {};

//given USAF id, returns [sum over all months, true] if there is data, ["unknown", false] otherwise
function year(list, id) {
	temp = new Array(12);
	temp[0] = list["Jan"][id];
	temp[1] = list["Feb"][id];
	temp[2] = list["Mar"][id];
	temp[3] = list["Apr"][id]; 
	temp[4] = list["May"][id]; 
	temp[5] = list["Jun"][id];
	temp[6] = list["Jul"][id]; 
	temp[7] = list["Aug"][id]; 
	temp[8] = list["Sep"][id]; 
	temp[9] = list["Oct"][id];
	temp[10] = list["Nov"][id];
	temp[11] = list["Dec"][id];
	undef = true;
	sum = 0;
	for (i = 0; i < temp.length; i++) {
		if (temp[i] != undefined) {
			undef = false;
			sum += temp[i].sum;}
	}
	if (undef) {
		return ["unknown", false];
	}
	else {
		return [sum, true];
	}
}

function yearhourly(list, id) {
	temp2 = new Array(12);
	temp2[0] = list["Jan"][id];
	temp2[1] = list["Feb"][id];
	temp2[2] = list["Mar"][id];
	temp2[3] = list["Apr"][id]; 
	temp2[4] = list["May"][id]; 
	temp2[5] = list["Jun"][id];
	temp2[6] = list["Jul"][id]; 
	temp2[7] = list["Aug"][id]; 
	temp2[8] = list["Sep"][id]; 
	temp2[9] = list["Oct"][id];
	temp2[10] = list["Nov"][id];
	temp2[11] = list["Dec"][id];
	undef = true;
	sum2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (i = 0; i < temp2.length; i++) {
		if (temp2[i] != undefined) {
			undef = false;
			for (j = 0; j < 24; j++) {
				hourof = "";
				if (j < 12) {
					if (j < 10) {
						hourof = "0" + j + ":00:00 AM"
						}
					else {
						hourof = "" + j + ":00:00 AM"
						}
					}
				else {
					hourof = "" + j + ":00:00 PM"
					}
				store = temp2[i]["hourly"][hourof];
				if (store != undefined) {
					sum2[j] += store;
				}
			}
		}
	}
	newobj = {};
	newobj["USAF"] = id;
	newobj["00:00:00 AM"] = sum2[0];
	newobj["01:00:00 AM"] = sum2[1];
	newobj["02:00:00 AM"] = sum2[2];
	newobj["03:00:00 AM"] = sum2[3];
	newobj["04:00:00 AM"] = sum2[4];
	newobj["05:00:00 AM"] = sum2[5];
	newobj["06:00:00 AM"] = sum2[6];
	newobj["07:00:00 AM"] = sum2[7];
	newobj["08:00:00 AM"] = sum2[8];
	newobj["09:00:00 AM"] = sum2[9];
	newobj["10:00:00 AM"] = sum2[10];
	newobj["11:00:00 AM"] = sum2[11];
	newobj["12:00:00 AM"] = sum2[12];
	newobj["13:00:00 AM"] = sum2[13];
	newobj["14:00:00 AM"] = sum2[14];
	newobj["15:00:00 AM"] = sum2[15];
	newobj["16:00:00 AM"] = sum2[16];
	newobj["17:00:00 AM"] = sum2[17];
	newobj["18:00:00 AM"] = sum2[18];
	newobj["19:00:00 AM"] = sum2[19];
	newobj["20:00:00 AM"] = sum2[20];
	newobj["21:00:00 AM"] = sum2[21];
	newobj["22:00:00 AM"] = sum2[22];	
	newobj["23:00:00 AM"] = sum2[23];	
	
	return newobj;
}

function loadStations(info) {
    d3.csv("../data/NSRDB_StationsMeta.csv",function(error,data){
        //....
		stationData = data;
//		console.log("stationData", stationData);
		missing = [];
		max = 0;

		stationData.forEach(function(d, i) {
				temp = year(info, d.USAF)
				radii[d.USAF] = temp;
				if (max < temp[0])
					max = temp[0];
				});

		radiiScale = d3.scale.linear().domain([0, max]).range([1, 5])
		
		stations = svg.selectAll(".node")
					.data(stationData)
					.enter().append("g")
						.attr("class", "node");
		stations.append("circle")
				.attr("r", function(d) {if (radii[d.USAF][1])
											return radiiScale(radii[d.USAF][0]);
										else 
											return 1.5})
				.attr("cx", function(d) {if (projection([d.NSRDB_LON, d.NSRDB_LAT]) != null) return projection([d.NSRDB_LON, d.NSRDB_LAT])[0];
											else {missing.push(d); return -100;}})
				.attr("cy", function(d) {if (projection([d.NSRDB_LON, d.NSRDB_LAT]) != null) return projection([d.NSRDB_LON, d.NSRDB_LAT])[1];
											else return -100;})
				.style("fill", function(d) {if (radii[d.USAF][1])
												return "blue";
											else
												return "grey";})
				.on("click", aggregate)
				.append("svg:title")
					.text(function(d) {return [d.STATION, radii[d.USAF][0]]});

		console.log("missing", missing);
    });
}


function loadStats() {

    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error,data){
        completeDataSet = data;
//		console.log("completeDataSet", completeDataSet);
		//....
		
        loadStations(completeDataSet);
    })

}


d3.json("../data/us-named.json", function(error, data) {

    var usMap = topojson.feature(data,data.objects.states).features
//    console.log("usMap", usMap);

    //svg.selectAll(".country").data(usMap).enter().... 
    // see also: http://bl.ocks.org/mbostock/4122298
	  svg.selectAll("path")
		  .data(usMap)
		.enter().append("path")
		  .attr("class", "country")
		  .attr("d", path)
		  .on("click", clicked);
	
    loadStats();
});



// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
/*var createDetailVis = function(){

}

var updateDetailVis = function(data, name){
  
}*/


// ZOOMING
function aggregate(d) {
	hourly_data = yearhourly(completeDataSet, d.USAF);	
//	console.log(d.USAF, hourly_data);
	draw_detail(hourly_data, d.STATION);
}

//this is basically all code from http://bl.ocks.org/mbostock/4122298 though
function clicked(d) {
	var x, y, k;

	//zoomtoBB
	if (d && zoomed !== d) {
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
		k = 4;
		zoomed = d;
	}
	//resetZoom
	else {
		x = width / 2;
		y = height / 2;
		k = 1;
		zoomed = null;
	}

	svg.selectAll("path")
		.classed("active", zoomed && function(d) { return d === zoomed; });

	svg.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		.style("stroke-width", 1.5 / k + "px");
}

/*
function zoomToBB() {
}

function resetZoom() {    
}*/


