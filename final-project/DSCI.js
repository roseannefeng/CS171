var FocusVis, ContextVis,height2, width2, innerWidth2, innerHeight2, brush, centered;

var	margin = {top: 30, right: 0, bottom: 30, left: 30},
    margin2 = {top: 350, right: 0, bottom: 70, left: 45},
    padding = {top: 0, right: 0, bottom: 0, left: 0},
    padding2 = {top: 0, right: 0, bottom: 0, left: 0},
    outerWidth = 960,
    outerHeight = 800,
    outerWidth2 = 250,
    outerHeight2 = 520,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;

innerWidth2 = outerWidth2 - margin2.left - margin2.right;
innerHeight2 = outerHeight2 - margin2.top - margin2.bottom;
width2 = innerWidth2 - padding2.left - padding2.right;
height2 = innerHeight2 - padding2.top - padding2.bottom;

var marginIndVis = {top: 20, right: 20, bottom: 20, left: 20},
    widthIndVis = 500 - marginIndVis.left - marginIndVis.right,
    widthIndVisBar = 200,
    widthIndVisCA = 50,
    widthIndVisName = 170,
    heightIndVis = 550 - marginIndVis.top - marginIndVis.bottom;

FocusVis = {x: margin2.left, y: margin2.top, w: innerWidth2, h: innerHeight2};
ContextVis = {w: width, h: height};


////////////////////// Stuff for treemap
/////  Mostly from Mike Bostock example http://bost.ocks.org/mike/treemap/
var Treemapmargin = {top: 40, right: 10, bottom: 10, left: 10},
    Treemapwidth = 960,
    Treemapheight = 800 - Treemapmargin.top - Treemapmargin.bottom,
	formatNumber = d3.format(",d"),
    transitioning;

var Treemapx = d3.scale.linear()
    .domain([0, Treemapwidth])
    .range([0, Treemapwidth]);

var Treemapy = d3.scale.linear()
    .domain([0, Treemapheight])
    .range([0, Treemapheight]);

var treemap = d3.layout.treemap()
			.children(function(d, depth) { return depth ? null : d._children; })
			.sort(function(a, b) { return a.value - b.value; })
			.ratio(Treemapheight / Treemapwidth * 0.5 * (1 + Math.sqrt(5)))
			.sticky(false)
			.round(false);	  	
	
var Treemapdiv = d3.select("#chart").append("svg")
    .attr("width", Treemapwidth + Treemapmargin.left + Treemapmargin.right)
    .attr("height", Treemapheight + Treemapmargin.bottom + Treemapmargin.top)
    .style("margin-left", -Treemapmargin.left + "px")
    .style("margin.right", -Treemapmargin.right + "px")
  .append("g")
    .attr("transform", "translate(" + Treemapmargin.left + "," + Treemapmargin.top + ")")
    .style("shape-rendering", "crispEdges");

var grandparent = Treemapdiv.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -Treemapmargin.top)
    .attr("width", Treemapwidth)
    .attr("height", Treemapmargin.top);

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - Treemapmargin.top)
    .attr("dy", ".75em");
////// end for treemap setup 

// Starting defaults for selectors, and some formats
var DataSetCode = "TIVAORIGINVA",
/*	ActualCountryString = "CAN",
	ActualCountryName = "Canada", 
	ActualVariableString = "EXGR_VA_BSCI",  */
	ActualCountryString = 'TOTAL';
	ActualCountryName = 'Partner World';
	ActualVariableString = "VAR eq 'EXGR_DDC' or VAR eq 'EXGR_IDC' or VAR eq 'EXGR_RIM' or VAR eq 'EXGR_FVA'",
	ActualIndustryString = "TOTAL",
	ActualSourceString = "TOTAL",
	ActualYearString = "2009";

//11 - BrBG, PRGn, PiYG, PuOr, RdBu, RdGy, RdYlBu, RdYlGn, Spectral
//12 - Paired, Set3
treeColors = colorbrewer["RdYlBu"][9].concat(colorbrewer["PiYG"][10])
	
var industryCodes = {"01T05": ["Agriculture, hunting, forestry and fishing", treeColors[0]],
					"10T14": ["Mining and quarrying", treeColors[1]],
					"15T16": ["Food products, beverages and tobacco", treeColors[2]],
					"17T19": ["Textiles, textile products, leather and footwear", treeColors[3]],
					"20T22": ["Wood, paper, paper products, printing and publishing", treeColors[4]],
					"23T26": ["Chemicals and non-metallic mineral products", treeColors[5]],
					"27T28": ["Basic metals and fabricated metal products", treeColors[6]],
					"29": ["Machinery and equipment, nec ", treeColors[7]],
					"30T33": ["Electrical and optical equipment", treeColors[8]],
					"34T35": ["Transport equipment", treeColors[9]],
					"36T37": ["Manufacturing nec; recycling ", treeColors[10]],
					"40T41": ["Electricity, gas and water supply", treeColors[11]],
					"45": ["Construction", treeColors[12]],
					"50T55": ["Wholesale and retail trade; Hotels and restaurants", treeColors[14]],
					"60T64": ["Transport and storage, post and telecommunication", treeColors[15]],
					"65T67": ["Financial intermediation", treeColors[16]],
					"70T74": ["Business services", treeColors[17]],
					"75T95": ["Other services", treeColors[18]],
					"TOTAL": ["TOTAL", "#ffffff"]};
	
var	formatNumber = d3.format(",d"),
	PercentFormatter = d3.format(".0%");  // added for stacked bars

//just a global junk container and arrays for testing
var TryArray = [];
var TreeCountries = {};
var dataset = {};
var TTdataset = {};

var mapCanvas = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var g = mapCanvas.append("g");

// projection methods
var projectionMethod = d3.geo.mercator().translate([width / 2, height / 2]);

// Color scales
var color = d3.scale.quantile().range(colorbrewer.Greens[9]);
// A position encoding for the key only.
var y = d3.scale.ordinal().rangeRoundBands([0, heightIndVis], .1);
var x = d3.scale.linear().rangeRound([0, widthIndVisBar]);
var Industrycolor = d3.scale.ordinal().range(colorbrewer.Paired[4]);

var path = d3.geo.path().projection(projectionMethod);

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")
            .attr("d", path.projection(projectionMethod));
    });

function initVis(error, tooltipd, bigmatrix, dimensions, world, industry) {
    dataset = bigmatrix;
    TTdataset = tooltipd;
	var treemapData = JSON.parse(JSON.stringify( tooltipd ));
	
    for (var i in dataset[ActualYearString]) {
        if (dataset[ActualYearString][i].COU == ActualCountryString) {
            matrix = dataset[ActualYearString][i].matrix;
        }
    }
/*
    for (var i in TTdataset[ActualYearString]) {
        if (TTdataset[ActualYearString][i].COU == ActualCountryString) {
			for (var obj in TTdataset[ActualYearString][i].source) {
				if (TTdataset[ActualYearString][i].source[obj].COX == d.id) {
					sortedIndustries = allData[obj].industries;
					total = allData[obj].total;
				}	}  }  }
*/
    visualizeChord();
	chordUpdate(ActualYearString, ActualCountryString);
	
    g.attr("id", "country")
        .selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path);

    mapCanvas.selectAll(".country").data(world.features).enter();

	    ///////////////////////////////////////////////////////////
	// Create a legend
    var legend = mapCanvas.selectAll('g.legendEntry')
        .data(color.range())
        .enter()
        .append('g').attr('class', 'legendEntry');

    legend.append('rect')
        .attr("x",  25)
        .attr("y", function(d, i) {
            return (i * -20 + 480);	})
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d){return d;});

    var legendtext = legend.append('text')
        .attr("class", "legendtext")
        .attr("x", 40)
        .attr("y", function(d, i) {
            return (i * -20 + 480);	})
        .attr("dy", "0.8em")
        .text(function(d) {
            var extent = color.invertExtent(d);
            var format;
            if (-10 < +extent[1] < 10) {
                format = d3.format(".2f")
            }
            else if (0 < +extent[1] < 1) {
                format = d3.format(".0%")
            }
            else {
                format = d3.format(",.0f")
            }
            return format(+extent[0]) + " - " + format(+extent[1]);
        });

///////////////////////////////////////////////////////
// Start the visualisation by getting the data	
	if (ActualCountryString == 'TOTAL') {
	getWorldTotal(ActualYearString, ActualIndustryString, ActualVariableString, ActualYearString);
	} else {
	runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString,ActualVariableString, ActualYearString);
	}
    UpdateIndVis(ActualIndustryString);
	visualize_Treemap();
    mapCanvas.call(zoom);
		
	//// For the treemap visualisation

	function initialize(root) {
		root.x = root.y = 0;
		root.dx = Treemapwidth;
		root.dy = Treemapheight;
		root.depth = 0;
	}

	function accumulate(d) {
	return (d._children = d.children)
		? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
		: d.value;
	}

	function layout(d) {
	if (d._children) {
	  treemap.nodes({_children: d._children});
	  d._children.forEach(function(c) {
		c.x = d.x + c.x * d.dx;
		c.y = d.y + c.y * d.dy;
		c.dx *= d.dx;
		c.dy *= d.dy;
		c.parent = d;
		layout(c);
	  });
	}
	}

    function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d));

    var g1 = Treemapdiv.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", transition);

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter().append("rect")
        .attr("class", "child")
        .call(rect);

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
      .append("title")
        .text(function(d) { return formatNumber(d.value); });

    g.append("text")
        .attr("dy", ".75em")
        .text(function(d) { return d.name; })
        .call(text);

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      Treemapx.domain([d.x, d.x + d.dx]);
      Treemapy.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      Treemapdiv.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      Treemapdiv.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll("text").call(text).style("fill-opacity", 0);
      t2.selectAll("text").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        Treemapdiv.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
	  }
        return g;
	} 
	
	function text(text) {
		text.attr("x", function(d) { return Treemapx(d.x) + 6; })
			.attr("y", function(d) { return Treemapy(d.y) + 6; });
	}

	function rect(rect) {
		rect.attr("x", function(d) { return Treemapx(d.x); })
			.attr("y", function(d) { return Treemapy(d.y); })
			.attr("width", function(d) { return Treemapx(d.x + d.dx) - Treemapx(d.x); })
			.attr("height", function(d) { return Treemapy(d.y + d.dy) - Treemapy(d.y); })
			.style("fill", function(d) { return d.color; });
	}

	function name(d) {
		return d.parent
			? name(d.parent) + " originating from " + d.name + ", by Industry"
			: d.name + ": Value added for "+ 	d.name ;
	}	
	
	
	function visualize_Treemap() {
		var Countries = {}

		for (var i in treemapData[ActualYearString]) {
					if (treemapData[ActualYearString][i].COU == ActualCountryString) {
							countrydata = treemapData[ActualYearString][i].source;
							var data_array = []; 
							for (var obj in countrydata) {		
								KeyNameChange('industry', 'name', countrydata[obj].industries);
								for (var j = 0; j < world.features.length; j++) {
									var WorldID = world.features[j].properties["Alpha-3 code"];
									if (countrydata[obj].COX == WorldID && countrydata[obj].COX != ActualCountryString) {
										for (var k in countrydata[obj].industries){
											if (k != undefined)
												temp = industryCodes[countrydata[obj].industries[k]["name"]]
												countrydata[obj].industries[k]["name"] = temp[0];
												countrydata[obj].industries[k]["color"] = temp[1];
										}
										data_array.push({'name': world.features[j].properties.name, 'children': countrydata[obj].industries});
										//console.log("countrydata[obj].industries", countrydata[obj].industries);
									}
								}	
							}
//							console.log("Data array: ", data_array);
							var Countries = { 'name': ActualCountryName, 'children': data_array};
					}
				}

		initialize(Countries);
		accumulate(Countries);
		layout(Countries);
		display(Countries);

	};
  
	//////////// End of treemap initialisation
    
	function UpdateIndVis(industryString)  {
        $( "#Industry_List tbody").remove();
        $( "#IndustryLegend").remove();
		$('#Industry_Total').click();
		
        var showBars = false;
        for (var obj in industry[ActualYearString]) {
            if (industry[ActualYearString][obj].COU == ActualCountryString) {
                showBars = true;
				result = industry[ActualYearString][obj].source
			}
		}

        if (showBars == true ) {
            result.forEach(function(d) {for (var i = 0; i < d.values.length; i++) {
                d[d.values[i].VAR] = d.values[i].Value;  }
            });

            Industrycolor.domain(d3.permute(d3.keys(result[0]).filter(function(key) {
                return key == "EXGR_DDC" || key == "EXGR_IDC" || key == "EXGR_RIM" || key == "EXGR_FVA" ;
            }), [0,2,3,1]	));

            result.forEach(function(d) {
                var y0 = 0;
                var VarName;
                var Gross = +d["EXGR"];
                d.shares = Industrycolor.domain().map(function(name) {
                    for (var obj in dimensions.TIVA_OECD_WTO.VAR) {
                        if (dimensions.TIVA_OECD_WTO.VAR[obj].MemberCode == name) {
                            VarName = dimensions.TIVA_OECD_WTO.VAR[obj].MemberName;
                        }
                    }
                    return {name: name, VAR: VarName, y0: y0, y1: y0 += +d[name], sh: (+d[name]/Gross)}; });
                d.total = d.shares[d.shares.length - 1].y1;
            });

            result.sort(function(a, b) { return b.total - a.total; });
            var resultTotal = result.slice(0);
            result = result.slice(1, result.length);

            var yTot = d3.scale.ordinal().rangeRoundBands([0, 40], .1);
            var xTot = d3.scale.linear().rangeRound([0, 290]);
            yTot.domain([0,1]);
            xTot.domain([0, resultTotal[0].total]);
            y.domain(result.map(function(d) { return d.key; }));
            x.domain([0, d3.max(result, function(d) { return d.total; })]);

            var IndustryTotalBar = d3.select("#Industry_Total_Bar").append("g");

            IndustryTotalBar.selectAll("rect")
                    .data(resultTotal[0].shares)
                    .enter().append("rect")
                    .attr("height", 40)
                    .attr("x", function(d) { return xTot(d.y0); })
                    .attr("width", function(d) { return xTot(d.y1) - xTot(d.y0); })
                    .style("fill", function(d) { return Industrycolor(d.name); })
                    .on("mouseover", showIndustrytooltip)
                    .on("mouseout", function() {
                        d3.select("#Industrytooltip").classed("hidden", true); })
                ;
       

        var IndustrySelect = d3.select("#Industry_List").append("tbody")
            .attr("id", "selectIndustry")
            .selectAll("tr")
            .data(result)
            .enter()
            .append("tr");

         var IndustrySelectCA = IndustrySelect.insert("td")
                .attr("width", widthIndVisCA)
				.attr("height", y.rangeBand())
				.style("font-size", "14px")
                .style("text-align", "center")
                .style("background-color", function(d, i) {
                    if (i%2===0) {return "rgb(231, 225, 225)";} else{return "white";}
                })
		}
		
        if (showBars == true ) {
                IndustrySelectCA
				.attr("value", function(d){ return d.key; })
                .on("mouseover", showExportRatiotooltip)
                .on("mouseout", function() {
                    d3.select("#ExportRatiotooltip").classed("hidden", true); })
                .text( function (d) { return PercentFormatter(+d.EXGRDVA_EX/100)} );
        }
		
        var IndustrySelectName = IndustrySelect.insert("td")
            .attr("width", widthIndVisName)
			.attr("height", y.rangeBand())
            .attr("value", function(d){ return d.key; })
            .style("font-size", "14px")
            .style("background-color", function(d, i) {
                if (i%2===0) {return "rgb(231, 225, 225)";} else{return "white";}
            })
            .on("click", function(d) {
 				IndustrySelectName.style("background-color", function(d, i) {
                    if (i%2===0) {return "rgb(231, 225, 225)";} else{return "white";}
                })
                    .style("border-radius", "0px")
                    .style("box-shadow", "none");
                IndustryTotal.style("background-color", function() {
                    return "white";
                });
				ActualIndustryString = d.key;
                d3.select(this).transition().duration(300)
                    .style("background-color", "#f7fcb9")
                    .style("border-radius", "10px")
                    .style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)");
                return IndustryChange(d.key);

            })
            .text( function (d) { return d.values[0].ShortName} );

        if (showBars == true ) {
            var IndustryTotal = d3.select("#Industry_Total")
                    .on("click", function() {
                        IndustrySelectName.style("background-color", function(d, i) {
                            if (i%2===0) {return "rgb(231, 225, 225)";} else{return "white";}
                        })
                            .style("border-radius", "0px")
                            .style("box-shadow", "none");
						ActualIndustryString = resultTotal[0].key;
                        d3.select(this).transition().duration(300)
                            .style("background-color", "#f7fcb9");
                        return IndustryChange(resultTotal[0].key);

                    })
                    .text("Industry Total");

            var IndustrySelectBar = IndustrySelect.insert("td").append("svg")
                .attr("class", "g")
                .attr("id", "BarIndustry")
                .attr("width", widthIndVisBar)
                .attr("height", y.rangeBand());

            IndustrySelectBar.selectAll("rect")
                .data(function(d) { return d.shares; })
                .enter().append("rect")
                .attr("height", y.rangeBand())
				.transition()
				.duration(300)
                .attr("x", function(d) { return x(d.y0); })
                .attr("width", function(d) { return x(d.y1) - x(d.y0); })
				;
				
            IndustrySelectBar.selectAll("rect")
				.style("fill", function(d) { return Industrycolor(d.name); })
                .on("mouseover", showIndustrytooltip)
                .on("mouseout", function() {
                    d3.select("#Industrytooltip").classed("hidden", true);
                });
        }

        // To add a legend for the industry panel
        var industryValues = ["Direct domestic", "Indirect domestic", "Re-imported domestic","Foreign content"];

        var legendsvg = d3.select("#Industry_List").append("svg")
            .attr("id", "IndustryLegend")
            .attr("width", widthIndVis/2)
            .attr("height", heightIndVis/2)
            .attr("transform", "translate(0,0)");

        var IndustryLegend = legendsvg.selectAll("svg")
            .data(Industrycolor.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(-70," + (i * 20+100) + ")"; });

        IndustryLegend.append("rect")
            .attr("x", widthIndVis/2 - 12)
            //.attr("y", heightIndVis)
            .attr("y", 60)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", Industrycolor);

        IndustryLegend.append("text")
            .data(industryValues.reverse())
            .attr("x", widthIndVis/2 - 20)
            .attr("y", 69)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    }

    ///////////////////////////////////////////////////////////////////
	// Not used 
	// put together the selector for variable from the list of variables in the json file
    d3.select("#selectorIndicator").append("ul")
        .attr("id", "ul")
        .selectAll("ul")
        .data(dimensions.TIVAORIGINVA.VAR)
        .enter()
        .append("ul")
        .attr("id", function(d){ return d.MemberCode; })
        .text( function (d) { return d.MemberName; } );
    ///////////////////////////////////////////////////////////////////

	$(document).ready(function() {
	//////////////////////////////////////////////////////////////
		// Dynamic elements - here is where changes are controlled
		$("#chord").hide(); 
		$("#chart").hide(); 
		$('#EXGR_VA_BSCI_SH').hide();
		$('#EXGR_VA_BSCI').show();
		$('#focusCountry').text("With partner World");
		$('#data1').css('color', 'black');
		$('#data4').css('color', 'black');
		$('#Industry_Total').click();
		$('#data4').click();
		$('#checkboxes').show();
		
		$('#Industry_Total').click(function() {
			$('#Industry_Total').css('background-color', '#f7fcb9');
			$('#Industry_Total').css('border-radius', '10px');
			$('#Industry_Total').css('"box-shadow', '4px 4px 10px rgba(0, 0, 0, 0.4)');
		});

		
		$('#data1').click(function() {
			if (ActualCountryString !== "TOTAL") {
			$('#EXGR_VA_BSCI_SH').hide();
			$('#EXGR_VA_BSCI').show();
			$('#data1').css('color', 'black');
			$('#data2').css('color', '#999');
			ActualVariableString = 'EXGR_VA_BSCI';
			runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
			}
		});

		$('#data2').click(function() {
			if (ActualCountryString !== "TOTAL") {
			$('#EXGR_VA_BSCI').hide();
			$('#EXGR_VA_BSCI_SH').show();
			$('#data2').css('color', 'black');
			$('#data1').css('color', '#999');
			ActualVariableString = 'EXGR_VA_BSCI_SH';
			runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
			}		
		});

		$('#data2').mouseover(function() {
			if (ActualCountryString == "TOTAL") {		
				d3.select("#CountryButtontooltip")
					.classed("hidden", false)
					.style("font-size", "14px")
					.text("Share does not work with World totals, only for specific countries");		 
				}
			} );
			 
		$('#data2').mouseout(function() {
			 d3.select("#CountryButtontooltip").classed("hidden", true);
			 });
		
		$('#data3').mouseover(function() {
			 d3.select("#CountryButtontooltip")
				.classed("hidden", false)
				.style("font-size", "14px")
				.text("Click on any country in the map to select");	
			 });
		$('#data3').mouseout(function() {
			 d3.select("#CountryButtontooltip").classed("hidden", true);
			 });		 

		$('#data4').click(function() {
			$('#EXGR_VA_BSCI').show();
			$('#focusCountry').text("With partner World");
			$('#EXGR_VA_BSCI_SH').hide();
			$('#checkboxes').show();
			$('#data4').css('color', 'black');
			$('#data1').css('color', 'black');
			$('#data2').css('color', '#999');
			$('#data3').css('color', '#999');
			$('#data5').css('color', '#999');
			$('.VA_Checkbox').prop("checked", true);
			
			ActualCountryString = 'TOTAL';
			ActualVariableString = "VAR eq 'EXGR_DDC' or VAR eq 'EXGR_IDC' or VAR eq 'EXGR_RIM' or VAR eq 'EXGR_FVA'"
			getWorldTotal(ActualYearString, ActualIndustryString, ActualVariableString, ActualYearString);
			UpdateIndVis(ActualIndustryString);
			chordUpdate(ActualYearString, ActualCountryString);
			//visualize_Treemap();		
		});	

		$('#data5').hide();
		$('#data5').click(function() {
			$('#EXGR_VA_BSCI').hide();
			$('#EXGR_VA_BSCI_SH').hide();
			$('#data5').css('color', 'black');
			$('#data3').css('color', '#999');
			$('#data4').css('color', '#999');
			ActualVariableString = 'EXGR_VA_BSCI_SH';
			runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
		});	
		
			$('#Redraw').click(function() {
			var sel = $('input[type=checkbox]:checked').map(function(_, el) {
				return $(el).val();
			}).get();
			ActualVariableString = "";
			for (var i = 0; i < sel.length; i++) {
				ActualVariableString = ActualVariableString + sel[i] + " or ";
			}
			var s = ActualVariableString;
				ActualVariableString = s.slice(0, -3);
				ActualIndustryString = "TOTAL";
				$('#Industry_Total').click();
				UpdateIndVis(ActualIndustryString);
				getWorldTotal(ActualYearString, ActualIndustryString, ActualVariableString,  ActualYearString);
				chordUpdate(ActualYearString, ActualCountryString);
				//visualize_Treemap();
		})
		
	});

    // create a list of years to populate the list that will be in the year selector
    var years = ["1995", "2000", "2005", "2008", "2009"];

    // Year selector from radio buttons
    var form = d3.select("body #selectorYear")
        .append("form")
        .attr("id", "selectYear");

    labels = form.selectAll("label")
        .data(years)
        .enter()
        .append("label")
        .attr('id', 'selectYearLabels')
        //.attr({"transform":"translate(20," + (height-20) + ")" })
        .text(function(d) {return d;})
        .insert("input")
        .attr({
            type: "radio",
            class: "shape",
            name: "Year",
            value: function(d) {return d;}
        })
        .property("checked", function(d, i) {return i===4;});

    d3.selectAll("input[type=radio]")
        .on("change",  function() {
            labels.style("color", "#999" )   // doesn't work
                .style("font-weight", "normal");
            d3.select(this).transition().duration(100)
                .style("color", "#333")
                .style("font-weight", "bold");
            ActualYearString = this.value;
			
			//////  Redraws industry but with Industry Total
			////////////////////////////////////////////////////////////////////
			ActualIndustryString = "TOTAL";
			$('#Industry_Total').click();
            UpdateIndVis(ActualIndustryString);
			
            if (ActualCountryString == 'TOTAL') {
			getWorldTotal(ActualYearString, ActualIndustryString, ActualVariableString,  ActualYearString);
			} else {
			runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString,ActualVariableString, ActualYearString);
			}
            chordUpdate(ActualYearString, ActualCountryString);
			//visualize_Treemap();
        } );

    /* Functions for the change in Industry, Variable, Year
       and to redraw after clicking on a country */

    function IndustryChange(ActualIndustryString) {
            if (ActualCountryString == 'TOTAL') {
			getWorldTotal(ActualYearString, ActualIndustryString, ActualVariableString, ActualYearString);
			} else {
			runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString,ActualVariableString, ActualYearString);
			}
			console.log("Check" , ActualCountryString, ActualIndustryString, ActualSourceString,ActualVariableString, ActualYearString);
    }

    function SourceChange() {
        ActualSourceString = this.options[this.selectedIndex].value;
        runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
    }
	
	// Show Country
	function ShowName(CountryName, Code) {
		var showName = false;
		if (CountryName == "TOTAL") {
			d3.select("#focusCountry").text("With partner World");
			}
		for (var obj in dimensions.TIVAORIGINVA.COU) {
			if (dimensions.TIVAORIGINVA.COU[obj].MemberCode == Code) {
				showName = true;
				d3.select("#focusCountry").text(CountryName);
			}}
		if (showName == false) {
				d3.select("#focusCountry").text(CountryName + " (No data available)");
			}
		return showName;
	} 

	// Return Country Name
	function ReturnName(Code) {
		if (Code == "TOTAL") {
			return "Partner World";
		}
		else {
			for (var obj in dimensions.TIVAORIGINVA.COU) {
				if (dimensions.TIVAORIGINVA.COU[obj].MemberCode == Code) {
					return dimensions.TIVAORIGINVA.COU[obj].MemberName;
				}}
		}	
	} 
	
    function runAQueryOn(countryString, industryString, sourceString, variableString, yearString) {
		var url = "http://stats.oecd.org/OECDStatWCF_OData/OData.svc/" + DataSetCode +"?$filter=(COU eq '" + countryString + "') and (IND eq '" + industryString + "') and (INX eq '" + sourceString + "') and (VAR eq '" + variableString + "') and (TIME eq '" + yearString + "')&$format=json" 
        TryArray = [];
        TreeCountries = {};
		var data_Array = [];
        $.ajax({
            url: url,
            success: function (data){
                $.each(data.value, function() {
                    // add values from API call to the GeoJSON
                    for (var i = 0 ; i < data.value.length; i++) {
                        // grab country name
                        for (var j = 0; j < world.features.length; j++) {
                            var WorldID = world.features[j].properties["Alpha-3 code"];
                            if (data.value[i].COX == WorldID) {
                                world.features[j].properties.value = data.value[i].Value;
                                world.features[j].properties.year = data.value[i].TIME;
                                world.features[j].properties.variable = data.value[i].VAR;
                                if (data.value[i].COX !== data.value[i].COU) {
                                    TryArray[j] = data.value[i].Value;
									data_Array[j] = {'name': world.features[j].properties.name, 'size': data.value[i].Value};							
                                }

                                break;
                            }
                        }

					}
				TreeCountries = { name: countryString, children : data_Array};
                });

                //d3.select("#focusCountry").text(countryNameString);

                // Adjust the colour domain to the new data values from the API call
                var MaxNotSame = d3.max(TryArray, function(d) { return d; });

                color.domain([MaxNotSame, d3.min(world.features, function(d) { return d.properties.value; })]);
                x.domain([MaxNotSame, d3.min(world.features, function(d) { return d.properties.value; })]);

                // Update the map colouring based on the new values
                mapCanvas.selectAll("path")
                    .style("fill", function(d) {
                        var value = d.properties.value;
                        if (value) {
                            return color(value);
                        } else {
                            return "#ccc";
                        }
                    })
                    .style("stroke-width", function(d) {
                        if (d.id == countryString) {
                            return 3;
                        }
                        else {
                            return 1; //0;
                        }
                    })
					.style("stroke", function(d) {
                        if (d.id == countryString) {
                            return "00ffff";
                        }
						else {
                            return "#2c7fb8";
                        }
                    })
                   .on("click", function(d) {
   							var res = ShowName(d.properties.name, d.id);
							if ( res == true) {
							ActualCountryString = d.id;
							$('#EXGR_VA_BSCI_SH').hide();
							$('#EXGR_VA_BSCI').show();
							$('#data1').css('color', 'black');
							$('#data2').css('color', '#999');
							$('#data3').css('color', 'black');
							$('#data4').css('color', '#999');
							$('#data5').css('color', '#999');
							$('#checkboxes').hide();
							ActualVariableString = 'EXGR_VA_BSCI';
							ActualCountryName = ReturnName(ActualCountryString);
							ActualIndustryString = "TOTAL";
							UpdateIndVis(ActualIndustryString);
							runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
							chordUpdate(ActualYearString, ActualCountryString);
							//visualize_Treemap();
							}
                    }) 
                    .on("mouseover",  function() { d3.select(this).transition().duration(300).style("fill", "#f7fcb9");
                    })
                    .on("mousemove", showTooltip)
                    .on("mouseout", function() { d3.select(this).transition().duration(300)
                        .style("fill", function(d) {
                            var value = d.properties.value;
                            if (value) {
                                return color(value);
                            } else {
                                return "#ccc";
                            }
                        });
                        d3.select("#tooltip").classed("hidden", true);
                    });

	
                legend.select(".legendtext")
                    .text(function(d) {
                        var extent = color.invertExtent(d);
                        var format;
                        if (-10+extent[1] < 10) {
                            format = d3.format(".2f")
                        }
                        else {
                            format = d3.format(",.0f")
                        }
                        return format(+extent[0]) + " - " + format(+extent[1]);
                    });
            },
            error: function() { return console.log("ajax did not finish"); }
        });
    }
	
	function getWorldTotal(yearString, industryString, variablesString, yearString) {
		var url = "http://stats.oecd.org/OECDStatWCF_OData/OData.svc/TIVA_OECD_WTO?$filter=(PAR eq 'TOTAL') and (IND eq '" + industryString + "') and (" + variablesString + ") and (TIME eq '" + yearString + "')&$format=json";
		console.log("url", url);
        TryArray = [];
        TreeCountries = {};
		var data_Array = [];
		$.ajax({
			url: url,
			async: false,
			success: function (data){
					worldVA = d3.nest()
						.key(function(d) { return d.COU; })
						.rollup(function(leaves, i) { return d3.sum(leaves, function(d) {return parseFloat(d.Value);})} )
						.entries(data.value);
						// add values from API call to the GeoJSON
						for (var i = 0 ; i < worldVA.length; i++) {
							// grab country name
							for (var j = 0; j < world.features.length; j++) {
								var WorldID = world.features[j].properties["Alpha-3 code"];
								if (worldVA[i].key == WorldID) {
									world.features[j].properties.value = worldVA[i].values;
									world.features[j].properties.year = yearString;
										TryArray[j] = worldVA[i].values;
										data_Array[j] = {'name': world.features[j].properties.name, 'size': worldVA[i].values};							
									 break;
								}
							}

						}
					TreeCountries = { name: "TOTAL", children: data_Array};				

					// Adjust the colour domain to the new data values from the API call
					var Max = d3.max(world.features, function(d) { return d.properties.value; });

					color.domain([Max, d3.min(world.features, function(d) { return d.properties.value; })]);
					x.domain([Max, d3.min(world.features, function(d) { return d.properties.value; })]);

					// Update the map colouring based on the new values

					mapCanvas.selectAll("path")
						.style("fill", function(d) {
							var value = d.properties.value;
							if (value) {
								return color(value);
							} else {
								return "#ccc";
							}
						})
						.style("stroke-width", 1)
						.style("stroke", "#2c7fb8")
					   .on("click", function(d) {
   							var res = ShowName(d.properties.name, d.id);
							if ( res == true) {
							ActualCountryString = d.id;
							$('#EXGR_VA_BSCI_SH').hide();
							$('#EXGR_VA_BSCI').show();
							$('#data1').css('color', 'black');
							$('#data2').css('color', '#999');
							$('#data3').css('color', 'black');
							$('#data4').css('color', '#999');
							$('#data5').css('color', '#999');
							$('#checkboxes').hide();
							ActualVariableString = 'EXGR_VA_BSCI';
							ActualCountryName = ReturnName(ActualCountryString);
							ActualIndustryString = "TOTAL";
							UpdateIndVis(ActualIndustryString);
							runAQueryOn(ActualCountryString, ActualIndustryString, ActualSourceString, ActualVariableString, ActualYearString);
							chordUpdate(ActualYearString, ActualCountryString);
							//visualize_Treemap();
							}
						}) 
						.on("mouseover",  function() { d3.select(this).transition().duration(300).style("fill", "#f7fcb9");
						})
						.on("mousemove", showTooltip)
						.on("mouseout", function() { d3.select(this).transition().duration(300)
							.style("fill", function(d) {
								var value = d.properties.value;
								if (value) {
									return color(value);
								} else {
									return "#ccc";
								}
							});
							d3.select("#tooltip").classed("hidden", true);
						});
					
					legend.select(".legendtext")
						.text(function(d) {
							var extent = color.invertExtent(d);
							var format;
							if (-10+extent[1] < 10) {
								format = d3.format(".2f")
							}
							else {
								format = d3.format(",.0f")
							}
							return format(+extent[0]) + " - " + format(+extent[1]);
						});
			},
			error: function() { return console.log("ajax did not finish"); }
		});
	}

	
	
    startIntro();
}

// Queue call to get the data from files
queue()
    .defer(d3.json,"./data/TooltipData.json")
    .defer(d3.json,"./data/matrix.json")
    .defer(d3.json,"./data/superData.json")
    .defer(d3.json,"./data/world_data.json")
    .defer(d3.json,"./data/IndustryTotals.json")
    .await(initVis);

var result, worldVA;

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

var industryNames = ["Agriculture", "Mining", "Food products", "Textiles & apparel", "Wood & paper", "Chemicals & minerals", "Basic metals", "Machinery",
    "Electrical equipment", "Transport equipment", "Other manufactures", "Utilities", "Construction", "Wholesale & retail", "Transport & telecoms",
    "Finance & insurance", "Business services", "Other services"];

var countryCat = {
	//organized by which of the industry total values is highest
	dirDomestic: ["CAN", "USA", "MEX", "ARG", "CHL", "ZAF", "DEU", "ESP", "PRT", "FRA", "GBR", "BEL", "CHE", "NLD", "SVN", "AUT", "POL", "HUN", "ROU", "BGR", "GRC", "TUR", "ISR", "SAU", "RUS", "LTU", "LVA", "EST", "NOR", "SWE", "FIN", "ISL", "TUR", "IND", "THA", "KHM", "VNM", "IDN", "AUS", "BRN", "HKG", "MLT"],
	//indirect domestic origin
	indDomestic: ["BRA", "ITA", "CHN", "JPN", "NZL"],
	reimported: [],
	foreignValue: ["IRL", "LUX", "CZE", "SVK", "KOR", "PHL", "TWN", "MYS", "SGP"]
	}
	
//console.log("countryCat", countryCat);//, countryCat.dirDomestic.length + countryCat.indDomestic.length + countryCat.foreignValue.length);
	
function showExportRatiotooltip() {
    d3.select("#ExportRatiotooltip")
        .style("left", d3.event.pageX + xTooltipPadding + "px")
        .style("top", d3.event.pageY + yTooltipPadding + "px");

    d3.select("#ExportRatiotooltip")
        .select("#heading")
        .text("Value Added Export Ratio - total domestic value added share of gross exports, %");

    d3.select("#ExportRatiotooltip")
        .select("#text")
        .text("This reflects the domestic value-added embodied in exports as a per cent of exports. It provides a simple measure that illustrates how much value-added is generated throughout the economy for a given unit of exports. The lower the ratio the higher the foreign content and so the higher the importance of imports to exports.");

    d3.select("#ExportRatiotooltip").classed("hidden", false);
}

function KeyNameChange(oldkey, newkey, ArrayWithKeys) {
	var keyArray = [];
	for(var i = 0; i < ArrayWithKeys.length; i++) { 
		var Object = ArrayWithKeys[i];
		Object[newkey] = Object[oldkey];
		delete(Object[oldkey]);
		keyArray.push(Object);   }
	return keyArray; }	


function showIndustrytooltip(d) {
    var toolbox = d3.select("#Industrytooltip")
        .style("left", d3.event.pageX + xTooltipPadding + "px")
        .style("top", d3.event.pageY + yTooltipPadding + "px")
        .style("font-size", "14px");

    toolbox.text(d.VAR + ": " + PercentFormatter(d.sh));

    d3.select("#Industrytooltip").classed("hidden", false);
}

// borrowed from http://forum.jquery.com/topic/how-do-i-show-a-busy-indicator-during-an-ajax-post
$.ajaxSetup({
    beforeSend:function(){
        $("#busy").show();
    },
    complete:function(){
        $("#busy").hide();
    }
});

function startIntro(){
    var intro = introJs();
    intro.setOptions({
        steps: [
            {
                intro: "Hello! Welcome to our visualization. Let's a take a walkthrough of all of the visualization's features."
            },
            {
                element: "#focusCountry",
                intro: "Our visualizations illustrates international trade data from the perspective of value added to its exports. All data shown is in relation to the source country selected. You can see what country is selected here."
            },
            {
                element: "#vis",
                intro: "The visualization starts with a view of gross exports broken down into sources of value added for world trade, and distributed through the various OECD and major trading countries in the world. You can select by the source component (foreign/domestic) of value added in gross exports by checking the boxes and redrawing. You can change to a country-specific view by clicking on the countries on the map. That way you can see information on value added in trade for an individual country. In the country specific view, highlighting over a partner country brings up a tooltip showing more information for the source of value added from that country relative to the country selected (highlighted).",
                position: "right"
            },
            {
                element: "#buttons",
                intro: "You can adjust whether the map shows data in terms of the actual value or the percentage of value added by clicking on the buttons here. The other buttons show whether it is the view of trade with world partners, or a specific view of value added for an individual country. You can come back to the world view by clicking on the button"

            },
            {
                element: "#selectorYear",
                intro: "You can choose to display data from five different years here from 1995 to 2009."
            },
            {
                element: "#selectorChord",
                intro: "This is a chord diagram. It shows which industries contribute value-added to other industries' exports. Move your mouse over an industry to highlight. <i>Click the bar to open and click again to close</i>",
				position: "left"
            },
            {
                element: "#selectorTree",
                intro: "This is a treemap that relates value added to world exports, by source country. It is zoomable: by clicking on the country, you drill down to see the breakdown by industries (given by the SIC industry category code). It shows relative size of value added for all countries and the constituent industries. Click on the header to drill back up. <i>Click the bar to open and click again to close</i>",
				position: "top"
            },
            {
                element: "#Industry_List",
                intro: "In the industry panel, you can click on a specific industry to adjust the map to show data for that individual source industry. Click on industry total button at the top to come back to a view of all value added at the level of the world or for an individual country, depending on the selected view of the map. The bar chart shows the breakdown of value added in exports into its different source components (foreign and domestic). The percentages in the left-hand column show the domestic value-added export ratio for the various industries - to give an idea of which industries have the highest share of domestic value added.",
                position: "right"
            },
            {
                element: "#checkboxes",
                intro: "In the <i>World</i> view of the map, in this panel of check-boxes you can select the components of value added that are included in the map. You can check all of them for total gross exports, 'Foreign content' for only the foreign value added content of gross exports or one or more of the domestic value added components of exports. By clicking on various options you can see the difference among global exporters."
            },
            {
                intro: "Click <i>Done</i> to explore the data on your own. Some areas of interest include the flow of trade in East Asia and the EU nations, or looking at the common industries that dominate nations' gross exports, such as electronics or mining. By selecting various years, you can see how the distribution and composition of trade in value added changes. You can click on <i>Demo</i> on the menu bar above at any time to return to this introduction."
            }
        ]
    });

    intro.start();
}

$("#demo").click(startIntro);

