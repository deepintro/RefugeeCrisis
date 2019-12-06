var rpersons = [];
var xResettlementScale = d3.scaleBand().range([0, width]);
var resettlementCompleteData = []
var rTimeData = []

d3.csv("resettlementTimeSeries.csv", function (rdata) {
    resettlementCompleteData = rdata
})

// function resettlementVisSyria() {
//     console.log("persons5", persons)
//     d3.csv("resettlementTimeSeries.csv", function (rdata) {
//         // sdata = filter(rdata, function(obj)
//         // {
//         //     if(obj["Country of Origin (ISO)"] == "SYR")
//         //         return true;
//         // })
//         resettlementCompleteData = rdata
//         var generalResettlementData = d3.nest()
//             .key(function (d) {
//                 return d["Country of Resettlement (ISO)"];
//             })
//             .key(function (d) {
//                 return d["Year"];
//             })
//             .entries(rdata)
//             .map(function (d) {
//                 var years = {};
//                 var total = 0;
//                 years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
//                 d.values.forEach(y => {
//                     years[y.key] = +y.values[0]['Total submissions (persons)'];
//                     total += +y.values[0]['Total submissions (persons)'];
//                 })
//                 return { 'country': d.key, 'years': years, 'total': total, 'name': d.values[0].values[0]['Country of Resettlement']]};
//             })
//         var resettlementCountrywiseYearData = d3.nest()
//             .key(function (d) {
//                 return d["Country of Resettlement (ISO)"];
//             })
//             .key(function (d) {
//                 return d["Year"];
//             })
//             .entries(rdata)
//             .map(function (d) {
//                 var years = {};
//                 var total = 0;
//                 years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
//                 d.values.forEach(y => {
//                     years[y.key] = +y.values[0]['Total submissions (persons)'];
//                     total += +y.values[0]['Total submissions (persons)'];
//                 })
//                 return { 'country': d.key, 'years': years, 'total': total, 'name': d.values[0].values[0]['Country of Resettlement']]};
//             })

//         var resrettlementYearwiseCountryData = d3.nest()
//             .key(function (d) {
//                 return d["Year"];
//             })
//             .key(function (d) {
//                 return d["Country of Resettlement (ISO)"];
//             })
//             .entries(rdata)
//             .map(function (d) {
//                 var countries = (map(d.values, function(o)
//                 {
//                     return {key : 0}
//                 }));
//                 console.log(countries)
//                 var total = 0;
//                 //years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
//                 d.values.forEach(y => {
//                     countries[y.key] = y.values.reduce(function(total, i){return total + y.values[i]['Total submissions (persons)']}, 0);
//                     total += countries[y.key]
//                 })
//                 return { 'resettlementcountries': countries , 'year': d.key, 'total': total, 'name': d.values[0].values[0]['Country of Resettlement']};
//             })
//         console.log("resettlementYearwiseCountryData ", resettlementYearwiseCountryData)
            
//         resettlementCountrywiseYearData.sort(function (a, b) {
//             return b.total - a.total;
//         })
//         resettlementCountrywiseYearData = resettlementCountrywiseYearData.splice(0, numOfCountries);

//         var countries = resettlementCountrywiseYearData.map(function (d) { return d.name })

//         svg.selectAll('.xaxis').remove()

//         xResettlementScale.domain(countries);

//         var xAxis = d3.axisBottom()
//             .scale(xResettlementScale)
//         //x axis
//         svg.append('g')
//             .attr('transform', 'translate(0,' + (+height + 10) + ')')
//             .call(xAxis)
//             .attr('class','resettlementaxis')
//             .selectAll("text")
//             .style("text-anchor", "end")
//             .attr("dx", "-.8em")
//             .attr("dy", ".15em")
//             .attr("transform", "rotate(-65)")
//             .style("font-size", "10px");


//         cols = 24;
//         barMargin = 5;
//         bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
//         size = bandwidth / cols;
//         ratio = 100;

//         //cumulative
//         resettlementCountrywiseYearData.forEach((c, idx) => {
//             var total = Math.round(c.total / ratio);
//             var xStart = xResettlementScale(c.name) + barMargin;

//             var resettlementNodes = d3.range(total).map(function (d, i) {
//                 return {
//                     size: size,
//                     x: (i % cols) * size + xStart,
//                     y: height - (Math.floor((i / cols)) * size)
//                 }

//             })

//             rpersons = rpersons.concat(resettlementNodes);

//         })
//         createResettlementViz();
//     })
// }

function createOriginCountryViz(origin) {
    if(!origin)
        origin = "Syrian Arab Rep."
    var originData = resettlementCompleteData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"]!="all")
            return true
    })
    console.log(originData)
    var resettlementCountrywiseYearData = d3.nest()
        .key(function (d) {
            return d["destination"];
        })
        .key(function (d) {
            return d["year"];
        })
        .entries(originData)
        .map(function (d) {
            var years = {};
            var total = 0;
            years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
            d.values.forEach(y => {
                years[y.key] = +y.values[0]['total'];
                total += +y.values[0]['total'];
            })
            return { 'country': d.key, 'years': years, 'total': total };
        })
    console.log("resettlementYearwiseCountryData ", resettlementCountrywiseYearData)
            
    resettlementCountrywiseYearData.sort(function (a, b) {
        return b.total - a.total;
    })
    resettlementCountrywiseYearData = resettlementCountrywiseYearData.splice(0, 15);

    var countries = resettlementCountrywiseYearData.map(function (d) { return d.country })

    svg.selectAll('.xaxis').remove()
    svg.selectAll('.resettlementaxis').remove()
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
    resettlement_bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / cols;
    ratio = 100;

    //cumulative
    rpersons = []
    resettlementCountrywiseYearData.forEach((c, idx) => {
        console.log(c)
        var total = Math.round(c.total / ratio);

        var xStart = xResettlementScale(c.country) + barMargin;

        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                x: (i % cols) * resettlement_size + xStart,
                y: height - (Math.floor((i / cols)) * resettlement_size)
            }

        })
        rpersons = rpersons.concat(resettlementNodes);

    })
    createResettlementViz(rpersons);
}

function createTimeLine(origin, destination){
    if(!origin)
        origin = "all"
    if(!destination)
        destination = "all "
    var yearWiseOriginDestData = resettlementCompleteData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"]!="destination")
            return true
    })
    
    console.log("resettlementYearwiseCountryData ", yearWiseOriginDestData)
            
    yearWiseOriginDestData.sort(function (a, b) {
        return b.year - a.year;
    })
    //yearWiseOriginDestData = yearWiseOriginDestData.splice(0, numOfCountries);

    var years = yearWiseOriginDestData.map(function (d) { return d.year })

    svg.selectAll('.xaxis').remove()
    svg.selectAll('.resettlementaxis').remove()
    xResettlementScale.domain(years);

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
        .style("font-size", "10px");

    cols = 24;
    barMargin = 5;
    resettlement_bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / cols;
    ratio = 100;

    //cumulative
    rTimeData = []
    yearWiseOriginDestData.forEach((c, idx) => {
        var total = Math.round(c.total / ratio);
        var xStart = xResettlementScale(c.year) + barMargin;

        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                x: (i % cols) * resettlement_size + xStart,
                y: height - (Math.floor((i / cols)) * resettlement_size)
            }
        })
        rTimeData = rTimeData.concat(resettlementNodes);

    })
    createResettlementViz(rTimeData);
}

function createResettlementViz(dataToVisualize) {
    var units = svg
        .selectAll('rect')
        .data(dataToVisualize)

    units.exit().remove();

    var unitsEnter = units
        .enter()
        .append('rect')
        

    units = units.merge(unitsEnter);

    units
        .transition()
        .duration(1000)
        .attr('height', function (d) {
            return d.size;
        })
        .attr('width', function (d) {
            return d.size;
        })
        .attr('x', function (d, i) {
            return d.x;
        })
        .attr('y', function (d) {
            return d.y - size;
        })
        .attr('y', function (d) {
            return d.y - size;
        })
        .style('fill', function (d) { return 'green'});

}

// function getYear(node, cumulative) {
//     for (i = 2011; i <= 2018; i++) {
//         if (node < cumulative[i] / ratio) {
//             return i;
//         }
//     }
//     return 0;
// }




