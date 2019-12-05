// var margin = { top: 20, right: 50, bottom: 150, left: 50 },
// width = 1500 - margin.left - margin.right,
// height = 1000 - margin.top - margin.bottom;

// var xScale = d3.scaleBand().range([0, width]);
// var yScale = d3.scaleLinear().range([height, 0]);
// var colorScale = d3.scaleOrdinal(d3.schemeCategory20c);
// var cols
// var barMargin
// var bandwidth
// var size
// var persons
// var ratio
// var numOfCountries = 20;
// var unitsEnter

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

function resettlementVis()
{
    d3.csv("resettlementdata.csv", function (data) {
        console.log("==============>>>>>>>>>>>",data);
        var yearData = d3.nest()
            .key(function (d) {
                return d["Country of Resettlement (ISO)"];
            })
            .key(function (d) {
                return d["Year"];
            })
            .entries(data)
            .map(function (d) {
                console.log("ddddddddd",d)
                var years = {};
                var total = 0;
                years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
                d.values.forEach(y => {
                    years[y.key] = +y.values[0]['Total submissions (persons)'];
                    total += +y.values[0]['Total submissions (persons)'];
                })
                return { 'country': d.key, 'years': years, 'total': total, 'name' :  d.values[0].values[0]['Country of Resettlement']};
            })
        console.log("----------->>>>>>>>>",yearData);
        yearData.sort(function (a, b) {
            return b.total - a.total;
        })
        yearData = yearData.splice(0, numOfCountries);
        console.log("*********",yearData)

        var countries = yearData.map(function (d) { return d.name })

        xScale.domain(countries);

        var xAxis = d3.axisBottom()
            .scale(xScale)

        //x axis
        svg.append('g')
            .attr('transform', 'translate(0,' + (+height + 10) + ')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .style("font-size", "10px");


        cols = 12;
        barMargin = 5;
        bandwidth = xScale.bandwidth() - (2 * barMargin);
        size = bandwidth / cols;
        persons = [];
        ratio = 100;

        //cumulative
        yearData.forEach((c, idx) => {
            //console.log(c,idx)
            //console.log("prevyear ------ ", prevEnd)
            var total = Math.round(c.total / ratio);
            var xStart = xScale(c.name) + barMargin;
            var cumulative = { 2011: c.years[2011], 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 };

            for (i = 2012; i <= 2018; i++) {
                cumulative[i] = cumulative[i - 1] + c.years[i];
            }

            var resettlementNodes = d3.range(total).map(function (d, i) {
                return {
                    size: size,
                    x: (i % cols) * size + xStart,
                    y: height - (Math.floor((i / cols)) * size),
                    color: colorScale(idx),
                    year: getYear(i, cumulative),
                    country: c.name
                }

            })
            // console.log("nodes ",nodes)
            // prevEnd = prevEnd + ((Math.floor(total/rows) + 3) * size)
            persons = persons.concat(nodes);

        })
        console.log("persons",persons);


        persons.sort(function (a, b) {
            return a.year - b.year;
        })
        console.log(persons.length);

        for(y = 2011; y<=2018; y++){
            createUnitVis11(y);
        }    
    })
}


function createUnitVis11(currYear) {
    console.log("bla bla bla")
    if(currYear > 2018)
        return;
    var curr_YearPersons = persons.filter(p => {
        if (p.year == currYear)
            return true;
    })


    var units = svg
        .selectAll('.year' + currYear)
        .data(curr_YearPersons)

        .enter()
        .append('rect')
        .attr('class','year' + currYear)
        .attr('height', function (d) {
            return d.size;
        })
        .attr('width', function (d) {
            return d.size;
        })
        .attr('x', function (d) {
            return d.x;
        })
        .attr('y', function (d) {
            return d.y - size;
        })
        .style("fill", function (d) {
            //return "white"
            return colorScale(d.year % 2011) 
        })

        //.merge(units)
        // .attr('x', function (d) {
        //     return d.x;
        // })
        // .attr('y', function (d) {
        //     return d.y - size;
        // })
        
    units.transition()
        .duration(500)
        .style("fill", function (d) { return colorScale(d.year % 2011) })
        

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


function getYear(node, cumulative) {
    for (i = 2011; i <= 2018; i++) {
        if (node < cumulative[i] / ratio) {
            return i;
        }
    }
    return 0;
}




