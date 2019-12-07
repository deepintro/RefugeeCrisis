var rpersons = [];
var xResettlementScale = d3.scaleBand().range([0, width]);
var xTimeScale = d3.scaleBand().range([height, 0]);
var resettlementCompleteData = []
var rTimeData = []
var countryList = []
var destList = []
var timeOrigin = "Syrian Arab Rep.";
var timeDest = "all";
var dropdown2;
var dropdown3;

d3.csv("resettlementTimeSeries.csv", function (rdata) {
    resettlementCompleteData = rdata
    resettlementCompleteData.forEach(d => {
        if(countryList.indexOf(d.origin)==-1)
            countryList.push(d.origin)
    }) 
    resettlementCompleteData.forEach(d => {
        if(destList.indexOf(d.destination)==-1)
            destList.push(d.destination)
    }) 
})

function createOriginDropDown(){
    svg.selectAll(".originDropDown").remove()
    svg.selectAll(".yearDropdownOrigin").remove()
    svg.select(".yearDropdownDest").remove()

    var dropdown = d3.select('.fixed')
                        .insert("select","svg")
                        .attr("class", "originDropDown")
                        .on("change",updateOrigin)

    dropdown.selectAll("option")
    .data(countryList)
    .enter().append("option")
    .attr("value", function(d){return d})
    .text(function(d){
        return d[0].toUpperCase()+d.slice(1,d.length)
    })
    //var 
    createOriginCountryViz("Syrian Arab Rep.")
}

function updateOrigin(){
    var originSelected = d3.select(this).property('value')
    createOriginCountryViz(originSelected)
}

function createOriginDestDropDown(){

    d3.selectAll(".originDropDown").remove()
    dropdown2 = d3.select('.fixed')
                        .insert("select","svg")
                        .attr("class", "yearDropdownOrigin")
                        .on("change",updateTimeOrigin)

    dropdown3 = d3.select('.fixed')
                        .insert("select","svg")
                        .attr("class", "yearDropdownDest")
                        .on("change",updateTimeDest)

    dropdown2.selectAll("option")
            .data(countryList)
            .enter().append("option")
            .attr("value", function(d){return d})
            .text(function(d){
                return d[0].toUpperCase()+d.slice(1,d.length)
            })

    dropdown3.selectAll("option")
            .data(destList)
            .enter().append("option")
            .attr("value", function(d){return d})
            .text(function(d){
                return d[0].toUpperCase()+d.slice(1,d.length)
            })
    //var 
    createTimeLine(timeOrigin, timeDest)
}

function updateTimeOrigin(){
    console.log("lalalalalalalalala")
    timeOrigin = d3.select(this).property('value')
    console.log(timeOrigin)
    var filterOriginBased = resettlementCompleteData.filter(function(obj)
    {
        if(obj.origin == timeOrigin)
            return true;
    })
    destList = []
    filterOriginBased.forEach(d => {
        if(destList.indexOf(d.destination)==-1)
            destList.push(d.destination)
    }) 
    console.log(destList)
    var opts = dropdown3.selectAll("option")
                    .data(destList)

    opts.exit().remove()

    var optsEnter = opts.enter().append("option")
                    .attr("value", function(d){return d})
                    .text(function(d){
                        return d[0].toUpperCase()+d.slice(1,d.length)
                    })
    opts = opts.merge(optsEnter)
    createTimeLine(timeOrigin, destList[0])
}

function updateTimeDest(){
    console.log("lalalalalalalalala")
    timeDest = d3.select(this).property('value')
    console.log(timeDest)
    var filterDestBased = resettlementCompleteData.filter(function(obj)
    {
        if(obj.destination == timeDest)
            return true;
    })
    oList = []
    filterDestBased.forEach(d => {
        if(oList.indexOf(d.origin)==-1)
            oList.push(d.origin)
    }) 
    console.log(oList)
    var opts = dropdown2.selectAll("option")
                    .data(oList)

    opts.exit().remove()

    var optsEnter = opts.enter().append("option")
                    .attr("value", function(d){return d})
                    .text(function(d){
                        return d[0].toUpperCase()+d.slice(1,d.length)
                    })
    opts = opts.merge(optsEnter)
    createTimeLine(oList[0], timeDest)
}

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
    svg.selectAll('.timeaxis').remove()
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


    resettlement_cols = 24;
    barMargin = 5;
    resettlement_bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / resettlement_cols;
    resettlement_ratio = 10;

    //cumulative
    rpersons = []
    resettlementCountrywiseYearData.forEach((c, idx) => {
        console.log(c)
        var total = Math.round(c.total / resettlement_ratio);

        var xStart = xResettlementScale(c.country) + barMargin;

        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                x: (i % resettlement_cols) * resettlement_size + xStart,
                y: height - (Math.floor((i / resettlement_cols)) * resettlement_size)
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
        if(obj["origin"] == origin && obj["destination"]==destination)
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
    svg.selectAll('.timeaxis').remove()
    xTimeScale.domain(years);

    var xAxis = d3.axisLeft()
        .scale(xTimeScale)
    //x axis
    svg.append('g')
        
        .call(xAxis)
        .attr('class','timeaxis')
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "end")
        .attr("x",40)
        .attr("dy", "5em")
        .style("font-size", "10px")
        .style("color", "white");

    resettlement_cols = 12;
    barMargin = 5;
    resettlement_bandwidth = xTimeScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / resettlement_cols;
    resettlement_ratio = 10;

    //cumulative
    rTimeData = []
    yearWiseOriginDestData.forEach((c, idx) => {
        var total = Math.round(c.total / resettlement_ratio);
        var xStart = xTimeScale(c.year) + barMargin;

        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                y: height - ((i % resettlement_cols) * resettlement_size + xStart),
                x: (Math.floor((i / resettlement_cols)) * resettlement_size)
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

