/*
 Much of this code for the chord diagram was borrowed from or influenced by http://bl.ocks.org/mbostock/4062006
 */

var chordWidth = 960,
    chordHeight = 800,
    innerRadius = Math.min(chordWidth, chordHeight) * .25,
    outerRadius = innerRadius * 1.1;

var fill = d3.scale.category20();

var svgChord = d3.select("#chord").append("svg")
    .attr("width", chordWidth)
    .attr("height", chordHeight)
    .attr("id", "chordDiagram")
    .append("g")
    .attr("transform", "translate(" + chordWidth / 2 + "," + chordHeight / 2 + ")");

var matrix = [];
var industryNames = ["Agriculture", "Mining", "Food products", "Textiles & apparel", "Wood & paper", "Chemicals & minerals", "Basic metals", "Machinery",
    "Electrical equipment", "Transport equipment", "Other manufactures", "Utilities", "Construction", "Wholesale & retail", "Transport & telecoms",
    "Finance & insurance", "Business services", "Other services"];
	
// row and column positions of industries
var industriesPos = {"01T05":0,
    "10T14":1,
    "15T16":2,
    "17T19":3,
    "20T22":4,
    "23T26":5,
    "27T28":6,
    "29":7,
    "30T33":8,
    "34T35":9,
    "36T37":10,
    "40T41":11,
    "45":12,
    "50T55":13,
    "60T64":14,
    "65T67":15,
    "70T74":16,
    "75T95":17};

function chordUpdate(ActualYearString, ActualCountryString) {
    for (var i in dataset[ActualYearString]) {
        if (dataset[ActualYearString][i].COU == ActualCountryString) { matrix = dataset[ActualYearString][i].matrix; }	}

    for (var i in TTdataset[ActualYearString]) {
        if (TTdataset[ActualYearString][i].COU == ActualCountryString) { allData = TTdataset[ActualYearString][i].source; }	}

    updateChord();
}

var allData;

function visualizeChord() {

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    svgChord.append("g").selectAll("path")
        .data(chord.groups)
        .enter().append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    svgChord.append("g").selectAll("text")
        .data(chord.groups)
        .enter().append("text")
        // influenced by http://mbostock.github.io/d3/talk/20111018/chord.html
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (outerRadius + 5) + ")"
                + (d.angle > (Math.PI) ? "rotate(180)" : "");
        })
        .text(function(d) { return industryNames[d.index];});

    svgChord.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1);
}

function updateChord() {

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    svgChord.selectAll("g path")
        .data(chord.groups)
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

    svgChord.selectAll("g text")
        .data(chord.groups)
        // influenced by http://mbostock.github.io/d3/talk/20111018/chord.html
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (outerRadius + 5) + ")"
                + (d.angle > (Math.PI) ? "rotate(180)" : "");
        })
        .text(function(d) { return industryNames[d.index];});

    svgChord.selectAll("g.chord path")
        .data(chord.chords)
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function(d) { return fill(d.target.index); })
        .style("opacity", 1);
}

// Returns an event handler for fading a given chord group.
function fade(opacity) {
    return function(g, i) {
        svgChord.selectAll(".chord path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
            .transition()
            .style("opacity", opacity);
    };
}

var xTooltipPadding = 25;
var yTooltipPadding = 25;

function showTooltip(d) {

    var sortedIndustries;
    var total;
    d3.select("#tooltip")
        .style("left", d3.event.pageX + xTooltipPadding + "px")
        .style("top", d3.event.pageY + yTooltipPadding + "px");

    d3.select("#tooltip")
        .select("#source")
        .text(d.properties.name);

    for (var obj in allData) {
        if (allData[obj].COX == d.id) {
            sortedIndustries = allData[obj].industries;
            total = allData[obj].total;
        }
    }

    d3.select("#tooltip")
        .select("#total")
        .text(total);

    d3.select("#tooltip")
        .select("#industry1")
        .text(function() {
            if (typeof sortedIndustries !== 'undefined') {
                return industryNames[industriesPos[sortedIndustries[0].industry]];
            }
            else {
                return "No data"
            }
        });

    d3.select("#tooltip")
        .select("#industry2")
        .text(function() {
            if (typeof sortedIndustries !== 'undefined') {
                return industryNames[industriesPos[sortedIndustries[1].industry]];
            }
            else {
                return "";
            }
        });

    d3.select("#tooltip")
        .select("#industry3")
        .text(function() {
            if (typeof sortedIndustries !== 'undefined') {
                return industryNames[industriesPos[sortedIndustries[2].industry]];
            }
            else {
                return "";
            }
        });

    d3.select("#tooltip")
        .select("#value1")
        .text(function() {
            if (typeof sortedIndustries !== 'undefined') {
                return sortedIndustries[0].value;
			}
            else {
                return "";
            }
        });

    d3.select("#tooltip")
        .select("#value2")
        .text(function() {
            if (typeof sortedIndustries !== 'undefined') {
                return sortedIndustries[1].value;
            }
            else {
                return "";
            }
        });

    d3.select("#tooltip")
        .select("#value3")
        .text(function () {
            if (typeof sortedIndustries !== 'undefined') {
                return sortedIndustries[2].value;
            }
            else {
                return "";
            }
        });

    // Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
}