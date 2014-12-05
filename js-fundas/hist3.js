
var hist3 = function (d3) {
	//Width and height
	var histogram_maker = function (dataset, divhistid) {
		var that={};
		var w = 600;
		var h = 250;
		that.rs=undefined;
		//var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
		//				11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

		var xScale = d3.scale.ordinal()
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(dataset)])
						.range([0, h]);
		
		//Create SVG element
		var svg = d3.select(divhistid)
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		that.get_svg = function () {
			return svg;
		};

		that.get_xScale = function(i) {
			return xScale(i);
		};

		that.create_bars = function() {

			//Create bars
			var rectset = svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return xScale(i);
			   })
			   .attr("y", function(d) {
			   		return h - yScale(d);
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
			   		return yScale(d);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
			   });

			that.rs = rectset;
		};

		that.set_mouseover = function(f) {
		   	that.rs.on("mouseover", f || function(d) {

				//Get this bar's x/y values, then augment for the tooltip
				var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
				var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;

				//Update the tooltip position and value
				d3.select(divhistid).select(".tooltip")
					.style("left", xPosition + "px")
					.style("top", yPosition + "px")						
					.select(".value")
					.text(d);
		   
				//Show the tooltip
				d3.select(divhistid).select(".tooltip").classed("hidden", false);

		   	});
		};
		that.set_mouseout = function(f) {
			that.rs.on("mouseout", f || function() {

				//Hide the tooltip
				d3.select(divhistid).select(".tooltip").classed("hidden", true);
				
			})
		};

		that.set_click = function(f) {
			that.rs.on("click", f || function() {
					sortBars();
			});
		};

		that.flip_sortOrder = function () {
			sortOrder = !sortOrder;
		};
		that.get_sortOrder = function () {
			return sortOrder;
		};
		//Define sort order flag
		var sortOrder = false;
		
		//Define sort function
		var sortBars = function() {

			//Flip value of sortOrder
		   	sortOrder = !sortOrder;

			svg.selectAll("rect")
			   .sort(function(a, b) {
			   		if (sortOrder) {
				   		return d3.ascending(a, b);
			   		} else {
				   		return d3.descending(a, b);
			   		}
			   	})
			   .transition()
			   .delay(function(d, i) {
				   return i * 50;
			   })
			   .duration(1000)
			   .attr("x", function(d, i) {
			   		return xScale(i);
			   });
		};
		return that;
	};
	return {histogram_maker:histogram_maker};
} (d3);