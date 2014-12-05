/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    width = 960 - margin.left - margin.right;

    height = 300 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 10,
        w: width - 100,
        h: 100
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


        // convert your csv data and add it to dataSet
		d3.text("timeline.csv", function(data) {
			dataSet = d3.csv.parseRows(data);
			return createVis(dataSet);
		})
		
		
    createVis = function() {
        var xAxis, xScale, yAxis,  yScale;

		var estimate1 = []; var name1 = dataSet[0][1]; //var first1 = -1; var last1 = -1;
		var estimate2 = []; var name2 = dataSet[0][2]; //var first2 = -1; var last2 = -1;
		var estimate3 = []; var name3 = dataSet[0][3]; //var first3 = -1; var last3 = -1;
		var estimate4 = []; var name4 = dataSet[0][4]; //var first4 = -1; var last4 = -1;
		var estimate5 = []; var name5 = dataSet[0][5]; //var first5 = -1; var last5 = -1;
			for (i = 1; i < dataSet.length; i += 1) {	
				if (dataSet[i][1] != "") {
					estimate1.push({index: i, year: +dataSet[i][0], popul: +dataSet[i][1], interp: false});
/*					if (first1 < 0)
						first1 = i;
					last1 = i;*/}
				if (dataSet[i][2] != "") {
					estimate2.push({index: i, year: +dataSet[i][0], popul: +dataSet[i][2], interp: false});
/*					if (first2 < 0)
						first2 = i;
					last2 = i;*/}
				if (dataSet[i][3] != "") {
					estimate3.push({index: i, year: +dataSet[i][0], popul: +dataSet[i][3], interp: false});
/*					if (first3 < 0)
						first3 = i;
					last3 = i;*/}
				if (dataSet[i][4] != "") {
					estimate4.push({index: i, year: +dataSet[i][0], popul: +dataSet[i][4], interp: false});
/*					if (first4 < 0)
						first4 = i;
					last4 = i;*/}
				if (dataSet[i][5] != "") {
					estimate5.push({index: i, year: +dataSet[i][0], popul: +dataSet[i][5], interp: false});
/*					if (first5 < 0)
						first5 = i;
					last5 = i;*/}
			}

//		console.log(first1, last1, first2, last2, first3, last3, first4, last4, first5, last5);

//		var interp1 = estimate1.map(function(d) {return [d.year, d.index]});
		function interpvals (ourlist, n, l) {
			for (i = 0; i < l - 1; i += 1) {
				d = ourlist[i]; e = ourlist[i+1];
				scale = d3.scale.linear().domain([d.index, e.index]).range([d.popul, e.popul]);
				for (j = d.index+1; j < e.index; j += 1) {
					temp = {index: j, year: +dataSet[j][0], popul: scale(j), interp: true}
					ourlist.push(temp);
				}
			}
		}
		
		interpvals(estimate1, 1, estimate1.length);
		interpvals(estimate2, 2, estimate2.length);
		interpvals(estimate3, 3, estimate3.length);
		interpvals(estimate4, 4, estimate4.length);
		interpvals(estimate5, 5, estimate5.length);
//		console.log(estimate2);	
		
		var maxpop1 = d3.max(estimate1, function(d) {return d.popul;});
		var maxpop2 = d3.max(estimate2, function(d) {return d.popul;});
		var maxpop3 = d3.max(estimate3, function(d) {return d.popul;});
		var maxpop4 = d3.max(estimate4, function(d) {return d.popul;});
		var maxpop5 = d3.max(estimate5, function(d) {return d.popul;});

		var overallmaxpop = d3.max([maxpop1, maxpop2, maxpop3, maxpop4, maxpop5], function(d) {return d;});
		
        xScale = d3.scale.linear().domain([0,dataSet[dataSet.length-1][0]]).range([0, bbVis.w]);  // define the right domain generically

		// example that translates to the bottom left of our vis space:
		var visFrame = svg.append("g").attr({
		    "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
			//....
			  
		});
		  
		visFrame.append("rect");
		//....
		 
		yScale = d3.scale.linear().domain([overallmaxpop, 0]).range([0, bbVis.h])

        xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");
        yAxis = d3.svg.axis()
				.scale(yScale)
				.ticks(5)
				.orient("left");

		buffer = 100;

		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return xScale(d.year) + buffer; })
			.y(function(d) { return yScale(d.popul); });
			
		svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(" + buffer + "," + bbVis.h + ")")
			  .call(xAxis);

		svg.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(" + buffer + ",0)")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)

		svg.append("path")
			.datum(estimate1.filter(function (d) {if (!d.interp) return d;}))
			.attr("class", "line1")
			.attr("d", line);
		var node1 = svg.selectAll(".node1")
					  .data(estimate1)
					  .enter()
					  .append("g").attr("class", "node1");			  
		node1.append("circle")
			.attr("r", 1.5)
			.style("fill", function(d) {if (d.interp == false) {return "steelblue";} else {return "#CCCCCC";}})
			.attr("cx", function(d) {return xScale(d.year) + buffer;})
			.attr("cy", function(d) {return yScale(d.popul);});					

		svg.append("path")
			.datum(estimate2.filter(function (d) {if (!d.interp) return d;}))
			.attr("class", "line2")
			.attr("d", line);
		var node2 = svg.selectAll(".node2")
					  .data(estimate2)
					  .enter()
					  .append("g").attr("class", "node2");
		node2.append("circle")
			.attr("r", 1.5)
			.style("fill", function(d) {if (d.interp == false) {return "lime";} else {return "#CCCCCC";}})
			.attr("cx", function(d) {return xScale(d.year) + buffer;})
			.attr("cy", function(d) {return yScale(d.popul);});

		svg.append("path")
			.datum(estimate3.filter(function (d) {if (!d.interp) return d;}))
			.attr("class", "line3")
			.attr("d", line);
		var node3 = svg.selectAll(".node3")
					  .data(estimate3)
					  .enter()
					  .append("g").attr("class", "node3");
		node3.append("circle")
			.attr("r", 1.5)
			.style("fill", function(d) {if (d.interp == false) {return "orange";} else {return "#CCCCCC";}})
			.attr("cx", function(d) {return xScale(d.year) + buffer;})
			.attr("cy", function(d) {return yScale(d.popul);});

		svg.append("path")
			.datum(estimate4.filter(function (d) {if (!d.interp) return d;}))
			.attr("class", "line4")
			.attr("d", line);		
		var node4 = svg.selectAll(".node4")
					  .data(estimate4)
					  .enter()
					  .append("g").attr("class", "node4");	
		node4.append("circle")
			.attr("r", 1.5)
			.style("fill", function(d) {if (d.interp == false) {return "red";} else {return "#CCCCCC";}})
			.attr("cx", function(d) {return xScale(d.year) + buffer;})
			.attr("cy", function(d) {return yScale(d.popul);});

		svg.append("path")
			.datum(estimate5.filter(function (d) {if (!d.interp) return d;}))
			.attr("class", "line5")
			.attr("d", line);
		var node5 = svg.selectAll(".node5")
					  .data(estimate5)
					  .enter()
					  .append("g").attr("class", "node5");
		node5.append("circle")
			.attr("r", 1.5)
			.style("fill", function(d) {if (d.interp == false) {return "magenta";} else {return "#CCCCCC";}})
			.attr("cx", function(d) {return xScale(d.year) + buffer;})
			.attr("cy", function(d) {return yScale(d.popul);});
			
		function clear_graph() {
			svg.selectAll(".line1").transition().style("visibility", "hidden");
			svg.selectAll(".line2").transition().style("visibility", "hidden");
			svg.selectAll(".line3").transition().style("visibility", "hidden");
			svg.selectAll(".line4").transition().style("visibility", "hidden");
			svg.selectAll(".line5").transition().style("visibility", "hidden");
			svg.selectAll(".node1").transition().style("visibility", "hidden");
			svg.selectAll(".node2").transition().style("visibility", "hidden");
			svg.selectAll(".node3").transition().style("visibility", "hidden");
			svg.selectAll(".node4").transition().style("visibility", "hidden");
			svg.selectAll(".node5").transition().style("visibility", "hidden");
		}

		function drawline(n) {
			svg.selectAll(".line" + n).transition().style("visibility", "visible");
			svg.selectAll(".node" + n).transition().style("visibility", "visible");
		}
		
		clear_graph();
		drawline(1);
		
		d3.select("input[value=\"usc\"]").on("click", function() {
			clear_graph();
			drawline(1);
		})
		d3.select("input[value=\"pb\"]").on("click", function() {
			clear_graph();
			drawline(2);
		})
		d3.select("input[value=\"un\"]").on("click", function() {
			clear_graph();
			drawline(3);
		})
		d3.select("input[value=\"hyde\"]").on("click", function() {
			clear_graph();
			drawline(4);
		})
		d3.select("input[value=\"mad\"]").on("click", function() {
			clear_graph();
			drawline(5);
		})
			
			
    };
