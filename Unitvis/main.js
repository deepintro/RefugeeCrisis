var margin = { top: 20, right: 50, bottom: 150, left: 50 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var xScale = d3.scaleBand().range([0, width]);
var yScale = d3.scaleLinear()
//yScale.range([821, 0]);
//yScale.domain([0, 70])
var colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5, 6, 7])
    .range(['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'])

var barMargin
var bandwidth
var size
var persons
var ratio
var numOfCountries = 15;
var unitsEnter;
var allCountriesData;
var allYears = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]
var yearTotalPersons;
var yearsTotalPersonsArray

var svg = d3.select(".fixed").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function (d) {
        return "<div class = 'label'>Country </div>" + d.country
            + "<br><br><div class = 'label'>Year </div>" + d.year
            + "<br><br><div class = 'label'>Asylum Seekers </div>" + d.yearTotal
    });


d3.csv("asylum.csv", function (dataSet) {
    data = dataSet;
    yearTotalPersons = d3.nest()
        .key(function (d) {
            return d["Year"]
        })
        .rollup(function (rows) {
            return d3.sum(rows, d => {
                return d["Asylum-seekers"]
            })
        })
        .object(dataSet)



    yearsTotalPersonsArray = Object.keys(yearTotalPersons).map(d => {
        return { 'year': d, 'count': yearTotalPersons[d] }
    })
    yearsTotalPersonsArray.sort(function (a, b) {
        return a.count - b.count;
    })

    yearsTotalPersonsArray = yearsTotalPersonsArray.map(d => { return +d.year });


    allCountriesData = d3.nest()
        .key(function (d) {
            return d["Country of Asylum"];
        })
        .key(function (d) {
            return d["Year"];
        })
        .entries(data)
        .map(function (d) {
            var years = {};
            var total = 0;
            years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
            d.values.forEach(y => {
                years[y.key] = +y.values[0]['Total Population'];
                total += +y.values[0]['Total Population'];
            })
            return { 'country': d.key, 'years': years, 'total': total };
        })

    //console.log(allCountriesData);
    allCountriesData.sort(function (a, b) {
        return b.total - a.total;
    })
    var yearData = [];
    Object.assign(yearData, allCountriesData);
    yearData = yearData.splice(0, numOfCountries);
    //console.log(allCountriesData);

    var countries = yearData.map(function (d) { return d.country })

    xScale.domain(countries);

    var maxCount = d3.max(yearData.map(function (d) {
        return +d.total;
    }))

    yScale.domain([0, (+maxCount / 10000)]);


    var year = 2011;

    cols = 20;
    barMargin = 5;
    bandwidth = xScale.bandwidth() - (2 * barMargin);
    size = bandwidth / cols;
    persons = [];
    ratio = 5000;


    //cumulative
    yearData.forEach((c, idx) => {
        var total = Math.round(c.total / ratio);
        var xStart = xScale(c.country) + barMargin;
        var cumulative = { 2011: c.years[2011], 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 };

        for (i = 2012; i <= 2018; i++) {
            cumulative[i] = cumulative[i - 1] + c.years[i];
        }

        var nodes = d3.range(total).map(function (d, i) {
            return {
                size: size,
                xpos: (i % cols) * size + xStart,
                ypos: height - (Math.floor((i / cols)) * size),
                color: colorScale(idx),
                year: getYear(i, cumulative),
                country: c.country,
                yearTotal: c.years[getYear(i, cumulative)]
            }

        })
        persons = persons.concat(nodes);

    })


    createSparkline();
    persons.sort(function (a, b) {
        return a.year - b.year;
    })
    //console.log(persons.length);

    // new scroll('pixelPersonRatio', '75%', showPixelPersonRatio, dummyfunction);
    // new scroll('pixelPersonRatio2', '75%', showPixelGroup, showPixelPersonRatio);
    new scroll('person', '75%', showPerson, dummyfunction);
    new scroll('100person', '75%', show100Persons, showPerson);
    new scroll('personRatio', '75%', shift100Persons, show100Persons);
    new scroll('2011pixels', '75%', hide100Persons, shift100Persons);
    new scroll('div1', '75%', scrollYear2011, hide100Persons);
    new scroll('div2', '75%', scrollYear2012, scrollYear2011);
    new scroll('div3', '75%', scrollYear2013, scrollYear2012);
    new scroll('div4', '75%', scrollYear2014, scrollYear2013);
    new scroll('div5', '75%', scrollYear2015, scrollYear2014);
    new scroll('div6', '75%', scrollYear2016, scrollYear2015);
    new scroll('div7', '75%', scrollYear2017, scrollYear2016);
    new scroll('div8', '75%', scrollYear2018, scrollYear2017);
    new scroll('div9', '75%', showBlock, scrollYear2018);
    //new scroll('div10', '75%', showOtherCountryPersons, showBlock);
    new scroll('div11', '75%', changeColor, showBlock);
    new scroll('showChildren', '75%', showChildren, changeColor);
    new scroll('div12', '75%', splitResettled, showChildren);
    new scroll('div15', '75%', conclusion, createOriginDestDropDown);
    new scroll('div13', '75%', createOriginCountryViz, splitResettled);
    new scroll('div14', '75%', createOriginDestDropDown, createOriginCountryViz);

})


function createUnitVis(currYear) {
    //tootlip to show the total of each country for that year
    svg.call(tool_tip);
    //don't delete this log..adds delay required in the code
    console.log("create unit vis is being called")

    svg.selectAll('.resettlementaxis').remove()
    svg.selectAll('.xaxis').remove()
    d3.selectAll(".yAxisAsylum").remove();
    d3.selectAll('.personImg').remove()

    var xAxis = d3.axisBottom()
        .scale(xScale)

    //y axis
    var yMax = d3.max(persons, d => {
        return d.ypos;
    })
    var yMin = d3.min(persons, d => {
        return d.ypos;
    })
    
    var yScaleRange = yMax - yMin + size;
    yScale.range([height, height - yScaleRange]);
    
    var yScalePixels = yScaleRange/size;

    yScale.domain([0,yScalePixels*cols*ratio]);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .call(yAxis)
        .attr('class','yAxisAsylum')
        

    svg.append('g')
        .attr('transform', 'translate(0,' + (+height + 10) + ')')
        .call(xAxis)
        .attr('class', 'xaxis')
        .selectAll("text")
        //.style("text-anchor", "end")
        .attr("dx", "-.5em")
        .attr("dy", ".15em")
    // .attr("transform", "rotate(-65)")
    // .style("font-size", "10px");


    if (currYear > 2018)
        return;
    var currYearPersons = persons.filter(p => {
        if (p.year <= currYear)
            return true;
    })

    //console.log("currpersons",currYearPersons);

    var units = svg
        .selectAll('rect')
        .data(currYearPersons)

    units.exit().remove();

    var unitsEnter = units
        .enter()
        .append('rect')
        .style("fill", function (d) {
            return colorScale(yearsTotalPersonsArray.indexOf(d.year));
        })

    units = units.merge(unitsEnter);

    units
        .attr('class', function (d, i) {
            return ('dataPixel year' + d.year);
        })
        .transition()
        .duration(1000)

        //very important. Don't discard this change
        .attr('height', function (d) {
            return d.size;
        })
        .attr('width', function (d) {
            return d.size;
        })
        .attr('x', function (d, i) {
            return d.xpos;
        })
        .attr('y', function (d) {
            return d.ypos - size;
        })
        .style("fill", function (d) {
            return colorScale(yearsTotalPersonsArray.indexOf(d.year));
            //return colorScale(d.year % 2011)
        })

    units
        .on("mouseover", function (d) {
            var year = d.year;
            d3.selectAll('.dataPixel').style('opacity', function (r) {
                return (r.year == year) ? 1.0 : 0.5;
            })
            tool_tip.show(d);
        })
        .on("mouseout", function (d) {
            d3.selectAll('.dataPixel').style('opacity', 1.0)
            tool_tip.hide();
        })

}

function dummyfunction() {
    d3.select('.personImg').remove()
    d3.select('.xAxisSparkline').remove()
    d3.selectAll('.sparklineTextAsylum').remove()
    d3.selectAll('.sparklineTextNumber').remove()
    svg.selectAll('.resettlementaxis').remove()
    svg.selectAll('.xaxis').remove()
    d3.selectAll(".yAxisAsylum").remove();
    svg.selectAll('rect').remove()
    console.log("just displaying nothing ---- ")
}

function getYear(node, cumulative) {
    for (i = 2011; i <= 2018; i++) {
        if (node < cumulative[i] / ratio) {
            return i;
        }
    }
    return 0;
}


//waypoints scroll constructor
function scroll(n, offset, func1, func2) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
    });
};


function scrollYear2011() {
    createUnitVis(2011);
    buildSparkline(2011);
}
function scrollYear2012() {
    createUnitVis(2012);
    buildSparkline(2012);
}
function scrollYear2013() {
    createUnitVis(2013);
    buildSparkline(2013);
}
function scrollYear2014() {
    createUnitVis(2014);
    buildSparkline(2014);
}
function scrollYear2015() {
    createUnitVis(2015);
    buildSparkline(2015);
}
function scrollYear2016() {
    createUnitVis(2016);
    buildSparkline(2016);
}
function scrollYear2017() {
    createUnitVis(2017);
    buildSparkline(2017);
}
function scrollYear2018() {
    createUnitVis(2018);
    buildSparkline(2018);
}
function conclusion()
{
    
}




