var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};

dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var format = d3.time.format("%B %Y");

d3.text("unHealth.csv", function(data) {
		dataSet = d3.csv.parseRows(data);
		return createVis()
	});


var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};


    createVis = function() {
        var xAxis, xScale, yAxis,  yScale;
		var line, line2, area;

		store = []
		for (i = 1; i < dataSet.length; i += 1) {
			store.push({time: format.parse(dataSet[i][0]), health: +dataSet[i][1]});
		}
		t = d3.max(store.map(function(d) {return d.health;}));
		buffer = 50;

		
		var over = svg.append("g")
					.attr("class", "over")
					.attr("transform", "translate(" + buffer + ",0)");
		var det = svg.append("g")
					.attr("class", "detail")
					.attr("transform", "translate(" + buffer + "," + (bbOverview.h - buffer) + ")");		

		xScale = d3.scale.linear().domain([format.parse(dataSet[1][0]), format.parse(dataSet[dataSet.length-1][0])]).range([0, bbOverview.w]);  // define the right domain generically
		yScale = d3.scale.linear().domain([t, 0]).range([0, bbOverview.h])
			
		xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.tickFormat(function(d) {return format(new Date(d))});
		yAxis = d3.svg.axis()
				.scale(yScale)
				.ticks(3)
				.orient("left");
			
		var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { return xScale(d.time); })
			.y(function(d) { return yScale(d.health); });
				
		over.append("path")
			.datum(store)
			.attr("class", "line")
			.attr("d", line)
			.attr("transform", "translate(" + buffer + ",0");

			
	    xScale2 = d3.scale.linear().domain([format.parse(dataSet[1][0]), format.parse(dataSet[dataSet.length-1][0])]).range([0, bbDetail.w]);
		yScale2 = d3.scale.linear().domain([t, 0]).range([0, bbDetail.h])
		xAxis2 = d3.svg.axis()
				.scale(xScale2)
				.orient("bottom")
				.tickFormat(function(d) {return format(new Date(d))});
		yAxis2 = d3.svg.axis()
				.scale(yScale2)
				.ticks(6)
				.orient("left");
		var line2 = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { return xScale2(d.time);})
			.y(function(d) { return yScale2(d.health) + buffer + bbOverview.h; });
		var area = d3.svg.area()
			.x(function(d) { return xScale2(d.time);})
			.y0(bbOverview.h + bbDetail.h + buffer)
			.y1(function(d) { return bbOverview.h + yScale2(d.health) + buffer; });			


		det.append("path")
			.datum(store)
			.attr("class", "timeArea")
			.attr("d", area)
			.attr("opacity", 0.4)
			.attr("transform", "translate(0," + (bbOverview.h - buffer) + ")");
		det.append("path")
			.datum(store)
			.attr("class", "line")
			.attr("d", line2)
			.attr("transform", "translate(0," + (bbOverview.h - buffer) + ")");
		det.append("rect")
			.attr("height", bbDetail.h)
			.attr("width", 2 * buffer)
			.style("fill", "white")
			.style("opacity", 1)
			.attr("transform", "translate(-100," + (bbOverview.h+buffer) + ")");

		det.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + (bbDetail.h + bbOverview.h + buffer) + ")")
			  .call(xAxis2);
		det.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(0," + (buffer + bbOverview.h) + ")")
				.call(yAxis2)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6);				
		over.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + bbOverview.h + ")")
				.call(xAxis);
		over.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(0,0)")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6);

			
			
		var node = over.selectAll(".node")
					  .data(store)
					  .enter()
					  .append("g").attr("class", "node1");			  
		var node2 = det.selectAll(".node")
					  .data(store)
					  .enter()
					  .append("g").attr("class", "node2");
		node.append("circle")
			.attr("r", 1.5)
			.style("fill", "steelblue")
			.attr("class", "circle1")
			.attr("cx", function(d) {return xScale(d.time);})
			.attr("cy", function(d) {return yScale(d.health);})
			.attr("transform", "translate(" + buffer + ",0");
		node2.append("circle")
			.attr("r", 2)
			.style("fill", "steelblue")
			.attr("class", "circle2")
			.attr("cx", function(d) {return xScale2(d.time);})
			.attr("cy", function(d) {return yScale2(d.health);})
			.attr("transform", "translate(" + 0 + "," + (buffer+bbOverview.h) + ")");

			
		function brushed() {
			xScale2.domain(brush.empty() ? xScale.domain() : brush.extent());
			det.select(".timeArea").attr("d", area);
			det.select(".line").attr("d", line2);
			det.select(".x.axis").call(xAxis2);
			if (brush.empty() == false) {
				det.selectAll(".circle2").attr("visibility", "hidden");}
			else {
				det.selectAll(".circle2").attr("visibility", "visible");}
			det.select(".circle2").attr("visibility", "visible").attr("cx", function(d) {return xScale2(d.time);});
		}
			
		brush = d3.svg.brush().x(xScale).on("brush", brushed);
			
		over.append("g").attr("class", "brush").call(brush)
		  .selectAll("rect").attr({
			height: bbOverview.h,
			transform: "translate(" + 0 + "," + 0 + ")"
		});	
		
		function find(date) {
			for (i = 0; i < store.length; i+= 1) {
				if (format(store[i].time) == date)
					return store[i];
			}
		}
		
			t = find("February 2012");
			svg.append("rect")
				.attr("class", "temp1")
				.attr("width", 20)
				.attr("height", bbOverview.h)
				.style("fill", "#FFFFCC")
				.style("opacity", 0)
				.attr("x", function(d) {return xScale(t.time) + buffer - 10;})
				.attr("y", 0);
			r = find("August 2012");
			svg.append("rect")
				.attr("class", "temp2")
				.attr("width", 20)
				.attr("height", bbOverview.h)
				.style("fill", "#FFFFCC")
				.style("opacity", 0)
				.attr("x", function(d) {return xScale(r.time) + buffer - 10;})
				.attr("y", 0);

		d3.select(".clear").on("click", function() {
			svg.selectAll(".temp1").transition().style("opacity", 0);
			svg.selectAll(".temp2").transition().style("opacity", 0);
		})
		d3.select(".february").on("click", function() {
			svg.selectAll(".temp1").transition().style("opacity", 0.9);
			svg.select(".brush").call(brush.extent([xScale2(t.time) - 10 + buffer, xScale2(t.time) + 10 + buffer]));
		})		
		d3.select(".august").on("click", function() {
			svg.selectAll(".temp2").transition().style("opacity", 0.9);
			svg.select(".brush").call(brush.extent([xScale2(r.time) - 10 + buffer, xScale2(r.time) + 10 + buffer]));
		})

		
    };