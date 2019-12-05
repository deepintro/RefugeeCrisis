var margin = { top: 20, right: 50, bottom: 200, left: 50 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var xScale = d3.scaleBand().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory20c);
var cols
var barMargin
var bandwidth
var size
var persons
var ratio
var numOfCountries = 15;
var unitsEnter;
var allCountriesData;


var svg = d3.select(".fixed").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.csv("asylum.csv", function (data) {
    console.log(data);
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
                years[y.key] = +y.values[0]['Asylum-seekers'];
                total += +y.values[0]['Asylum-seekers'];
            })
            return { 'country': d.key, 'years': years, 'total': total };
        })

    console.log(allCountriesData);
    allCountriesData.sort(function (a, b) {
        return b.total - a.total;
    })
    var yearData = [];
    Object.assign(yearData, allCountriesData);
    yearData = yearData.splice(0, numOfCountries);
    console.log(allCountriesData);

    var countries = yearData.map(function (d) { return d.country })

    xScale.domain(countries);

    // var xAxis = d3.axisBottom()
    //     .scale(xScale)

    //x axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + (+height + 10) + ')')
    //     .call(xAxis)
    //     .attr('class','xaxis')
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em")
    //     .attr("transform", "rotate(-65)")
    //     .style("font-size", "10px");



    var maxCount = d3.max(yearData.map(function (d) {
        return +d.total;
    }))

    yScale.domain([0, (+maxCount / 10000)]);


    var year = 2011;

    cols = 24;
    barMargin = 5;
    bandwidth = xScale.bandwidth() - (2 * barMargin);
    size = bandwidth / cols;
    persons = [];
    ratio = 100;


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
                country: c.country
            }

        })
        persons = persons.concat(nodes);

    })


    persons.sort(function (a, b) {
        return a.year - b.year;
    })
    console.log(persons.length);

    // for(y = 2011; y<=2018; y++){
    //     createUnitVis(y);
    // }
    //scrollYear2011();
    new scroll('div1', '75%', scrollYear2011, dummyfunction);
    new scroll('div2', '75%', scrollYear2012, scrollYear2011);
    new scroll('div3', '75%', scrollYear2013, scrollYear2012);
    new scroll('div4', '75%', scrollYear2014, scrollYear2013);
    new scroll('div5', '75%', scrollYear2015, scrollYear2014);
    new scroll('div6', '75%', scrollYear2016, scrollYear2015);
    new scroll('div7', '75%', scrollYear2017, scrollYear2016);
    new scroll('div8', '75%', scrollYear2018, scrollYear2017);
    new scroll('div9', '75%', showBlock, scrollYear2018);
    new scroll ('div10', '75%', showOtherCountryPersons,showBlock);
    new scroll ('div11', '75%', splitResettled,showOtherCountryPersons);
    new scroll ('div12', '75%', resettlementVis,splitResettled);
    


})


function createUnitVis(currYear) {
    //don't delete this log..adds delay required in the code
    console.log("create unit vis is being called")
    svg.selectAll('.resettlementaxis').remove()
    svg.selectAll('.xaxis').remove()
    //svg.selectAll('rect').remove()

    var xAxis = d3.axisBottom()
        .scale(xScale)

    svg.append('g')
        .attr('transform', 'translate(0,' + (+height + 10) + ')')
        .call(xAxis)
        .attr('class','xaxis')
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("font-size", "10px");

    
    if(currYear > 2018)
        return;
    var currYearPersons = persons.filter(p => {
        if (p.year <= currYear)
            return true;
    })

    var units = svg
        .selectAll('rect')
        .data(currYearPersons)

    units.exit().remove();

    var unitsEnter = units
        .enter()
        .append('rect')
        .attr('class', function(d,i){
            'year' + d.year
        })
        .attr('height', function (d) {
            return d.size;
        })
        .attr('width', function (d) {
            return d.size;
        })
        .style("fill", function (d) {
            return colorScale(d.year % 2011) 
        })

    units = units.merge(unitsEnter);

    units.transition()
        .duration(1000)
        .attr('x', function (d,i) {
            return d.xpos;
        })
        .attr('y', function (d) {
            return d.ypos - size;
        })
        
    units
        .on("mouseover", function(d){
            var className = d3.select(this).attr("class");
            d3.selectAll('.' + className)
                .style('fill', 'black');
            
        })
        .on("mouseout", function(d){
            var className = d3.select(this).attr("class");
            d3.selectAll('.' + className)
                .style('fill', function (d) { return colorScale(d.year % 2011) });
        })

}

function dummyfunction() {
    svg.selectAll('.resettlementaxis').remove()
    svg.selectAll('.xaxis').remove()
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
function scroll(n, offset, func1, func2){
    return new Waypoint({
      element: document.getElementById(n),
      handler: function(direction) {
         direction == 'down' ? func1() : func2();
      },
      //start 75% from the top of the div
      offset: offset
    });
  };


function scrollYear2011(){
    // var xAxis = d3.axisBottom()
    //     .scale(xScale)
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + (+height + 10) + ')')
    //     .call(xAxis)
    //     .attr('class','xaxis')
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em")
    //     .attr("transform", "rotate(-65)")
    //     .style("font-size", "10px");
    // console.log("lalalalalalala")
    createUnitVis(2011);
}
function scrollYear2012(){
    createUnitVis(2012);
}
function scrollYear2013(){
    createUnitVis(2013);
}
function scrollYear2014(){
    createUnitVis(2014);
}
function scrollYear2015(){
    createUnitVis(2015);
}
function scrollYear2016(){
    createUnitVis(2016);
}
function scrollYear2017(){
    createUnitVis(2017);
}
function scrollYear2018(){
    createUnitVis(2018);
}






