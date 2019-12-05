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
// var rpersons
// var ratio
// var numOfCountries = 20;
// var unitsEnter

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
var rpersons = [];
function resettlementVis() {
    d3.csv("resettlementdata.csv", function (data) {

        var yearData = d3.nest()
            .key(function (d) {
                return d["Country of Resettlement (ISO)"];
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
                    years[y.key] = +y.values[0]['Total submissions (persons)'];
                    total += +y.values[0]['Total submissions (persons)'];
                })
                return { 'country': d.key, 'years': years, 'total': total, 'name': d.values[0].values[0]['Country of Resettlement'] };
            })

        yearData.sort(function (a, b) {
            return b.total - a.total;
        })
        yearData = yearData.splice(0, numOfCountries);


        var countries = yearData.map(function (d) { return d.name })

        svg.selectAll('.xaxis').remove()

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


        cols = 24;
        barMargin = 5;
        bandwidth = xScale.bandwidth() - (2 * barMargin);
        size = bandwidth / cols;
        persons = [];
        ratio = 100;

        //cumulative
        yearData.forEach((c, idx) => {
            var total = Math.round(c.total / ratio);
            var xStart = xScale(c.name) + barMargin;

            var resettlementNodes = d3.range(total).map(function (d, i) {
                return {
                    size: size,
                    x: (i % cols) * size + xStart,
                    y: height - (Math.floor((i / cols)) * size),

                    country: c.name
                }

            })

            rpersons = rpersons.concat(resettlementNodes);

        })

        createResettlementViz(2018);

    })
}


function createResettlementViz() {
    units2 = svg.selectAll('.resettled')
    units2
        .transition()
        .duration(2000)
        .attr('width', function (d, i) {
            return size
        })
        .attr('height', function (d, i) {
            return size
        })
        .attr('x', function (d, i) {

            return rpersons[i].x;
        })
        .attr('y', function (d, i) {

            return rpersons[i].y - size;
        })
        .style("fill", function (d) {
            return "red"
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




