var rpersons = [];
var xResettlementScale = d3.scaleBand().range([0, width]);
function resettlementVis() {
    console.log("persons5", persons)
    d3.csv("resettlementdata.csv", function (rdata) {
        var resettlementYearData = d3.nest()
            .key(function (d) {
                return d["Country of Resettlement (ISO)"];
            })
            .key(function (d) {
                return d["Year"];
            })
            .entries(rdata)
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
            
        resettlementYearData.sort(function (a, b) {
            return b.total - a.total;
        })
        resettlementYearData = resettlementYearData.splice(0, numOfCountries);

        var countries = resettlementYearData.map(function (d) { return d.name })

        svg.selectAll('.xaxis').remove()

        xResettlementScale.domain(countries);

        var xAxis = d3.axisBottom()
            .scale(xResettlementScale)
        //x axis
        svg.append('g')
            .attr('transform', 'translate(0,' + (+height + 10) + ')')
            .call(xAxis)
            .attr('class','resettlementaxis')
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .style("font-size", "10px");


        cols = 24;
        barMargin = 5;
        bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
        size = bandwidth / cols;
        ratio = 100;

        //cumulative
        resettlementYearData.forEach((c, idx) => {
            var total = Math.round(c.total / ratio);
            var xStart = xResettlementScale(c.name) + barMargin;

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
        createResettlementViz();
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




