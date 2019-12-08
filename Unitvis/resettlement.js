var rpersons = [];
var xResettlementScale = d3.scaleBand().range([0, width]);
var xTimeScale = d3.scaleBand().range([height, 0]);
var resettlementCompleteData = []
var rTimeData = []
var countryList = []
var destList = []
var timeOrigin = "Syrian Arab Rep.";
var timeDest = "USA";
var dropdown2;
var dropdown3;
var submissionData = []

d3.csv("resettlementTimeSeries.csv", function (rdata) {
    resettlementCompleteData = rdata
    // resettlementCompleteData.forEach(d => {
    //     if(countryList.indexOf(d.origin)==-1)
    //         countryList.push(d.origin)
    // }) 
    // resettlementCompleteData.forEach(d => {
    //     if(destList.indexOf(d.destination)==-1)
    //         destList.push(d.destination)
    // }) 
})
d3.csv("resettlementSubmissions.csv", function (sdata) {
    submissionData = sdata
    submissionData.forEach(d => {
        if(countryList.indexOf(d.origin)==-1)
            countryList.push(d.origin)
    }) 
    submissionData.forEach(d => {
        if(destList.indexOf(d.destination)==-1)
            destList.push(d.destination)
    }) 
})

var rtoolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function (d) {
        if(d.isTime == false && d.setAccepted == true){
            console.log("ooooooooooooooooooooooooooooooo")
            return "Total Submissions: " + parseInt(d.total) + "<br><br>Accepted Submissions: " + parseInt(d.accepted)
        }
        else if(d.isTime == false && d.setAccepted == false){
            console.log("ddddddhhhhhhhhh", d.total, d.accepted, parseInt(d.total) - parseInt(d.accepted))
            return "Total Submissions: " + parseInt(d.total) + "<br><br>Pending Submissions: " + (parseInt(d.total) - parseInt(d.accepted))
        }
        else if(d.isTime == true && d.setAccepted == true){
            console.log("ccscdscsdfdsfdsfsdfsdf", d.total, d.accepted)
            return "Total Submissions: " + parseInt(d.total) + "<br><br>Accepted Submissions: " + parseInt(d.accepted)
        }
        else if(d.isTime == true && d.setAccepted == false){
            console.log("werewrewrewrewrewr", d.total, d.accepted, parseInt(d.total) - parseInt(d.accepted))
            return "Total Submissions: " + parseInt(d.total) + "<br><br>Pending Submissions: " + (parseInt(d.total) - parseInt(d.accepted))
        }
    });

// function createOriginDropDown(){
//     d3.select('.xAxisSparkline').remove()
//     d3.selectAll(".dropdownLabel").remove()
//     d3.selectAll(".originDropDown").remove()
//     d3.selectAll(".yearDropdownOrigin").remove()
//     d3.select(".yearDropdownDest").remove()
//     d3.selectAll(".not_resettled").remove()

//     svg
//     .append("image")
//     .attr('xlink:href','resettlementRatio.png')
//     .attr('width',200)
//     .attr('height',200)
//     .attr('x',width-3.5*margin.right)
//     .attr('y',-100)
//     .attr('class',"ResettlementRatioImage")

//     var originDropDownLabel = d3.select('.fixed')
//                         .insert("span","svg")
//                         .attr("class", "originDropDownLabel dropdownLabel")
//     originDropDownLabel.text("Origin:")
                        
//     var dropdown = d3.select('.fixed')
//                         .insert("select","svg")
//                         .attr("class", "originDropDown dropdown")
//                         .on("change",updateOrigin)

//     dropdown.selectAll("option")
//             .data(countryList)
//             .enter().append("option")
//             .attr("value", function(d){return d})
//             .text(function(d){
//                 return d[0].toUpperCase()+d.slice(1,d.length)
//             })

//     dropdown.property('value', "Syrian Arab Rep.");
//     //var 
//     createOriginCountryViz("Syrian Arab Rep.")
    
// }
function createOriginCountryViz(origin) {
    d3.select('.xAxisSparkline').remove()
    d3.selectAll(".dropdownLabel").remove()
    d3.selectAll(".originDropDown").remove()
    d3.selectAll(".yearDropdownOrigin").remove()
    d3.select(".yearDropdownDest").remove()
    d3.selectAll(".not_resettled").remove()

    svg
    .append("image")
    .attr('xlink:href','resettlementRatio.png')
    .attr('width',200)
    .attr('height',200)
    .attr('x',width-3.5*margin.right)
    .attr('y',-100)
    .attr('class',"ResettlementRatioImage")

    if(!origin)
        origin = "Syrian Arab Rep."
    svg.call(rtoolTip)
    var originData = resettlementCompleteData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"]!="all")
            return true
    })
    console.log("originData",originData)
    var totalSubmissions = submissionData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"]!="all")
            return true
    })
    console.log("totalSubmissions",totalSubmissions)
    var resettlementCountrywiseYearData = d3.nest()
        .key(function (d) {
            return d["destination"];
        })
        .key(function (d) {
            return d["year"];
        })
        .entries(totalSubmissions)
        .map(function (d) {
            var years = {};
            var total = 0;
            years = { 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 }
            d.values.forEach(y => {
                years[y.key] = +y.values[0]['submissions'];
                total += +y.values[0]['submissions'];
            })
            return { 'country': d.key, 'years': years, 'total': total };
        })

    var totalDepartures = d3.nest()
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
    console.log("totalDepartures ", totalDepartures) 

    resettlementCountrywiseYearData.sort(function (a, b) {
        return b.total - a.total;
    })
    totalDepartures.sort(function (a, b) {
        return b.total - a.total;
    })

    resettlementCountrywiseYearData = resettlementCountrywiseYearData.splice(0, 10);
    //totalDepartures = totalDepartures.splice(0, 10);

    var countries = resettlementCountrywiseYearData.map(function (d) { return d.country })

    svg.selectAll('.xaxis').remove()
    d3.selectAll(".yAxisAsylum").remove();
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
        //.style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", ".15em")
        // .attr("transform", "rotate(-65)")
        // .style("font-size", "10px");


    resettlement_cols = 20;
    barMargin = 10;
    resettlement_bandwidth = xResettlementScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / resettlement_cols;
    resettlement_ratio = 100;

    //cumulative
    rpersons = []
    safepersons = []
    resettlementCountrywiseYearData.forEach((c, idx) => {
        //console.log(c)
        var total = Math.ceil(c.total / resettlement_ratio);

        var xStart = xResettlementScale(c.country) + barMargin;
        var accepted = totalDepartures.filter(function(o){
            return o.country == c.country
        })
        console.log(accepted[0].total)
        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                x: (i % resettlement_cols) * resettlement_size + xStart,
                y: height - (Math.floor((i / resettlement_cols)) * resettlement_size),
                c : c.country,
                total : c.total,
                setAccepted : (i < Math.floor(accepted[0].total/resettlement_ratio)) ? true : false,
                accepted : accepted[0].total,
                totalCountries : countries,
                origin : origin,
                isTime : false
            }

        })
        rpersons = rpersons.concat(resettlementNodes);

    })
    createResettlementViz(rpersons);
}

// function updateOrigin(){
//     var originSelected = d3.select(this).property('value')
//     createOriginCountryViz(originSelected)
// }

function createOriginDestDropDown(){
    d3.select(".originDropDownLabel").remove()
    d3.select('.xAxisSparkline').remove()
    d3.selectAll(".originDropDown").remove()
    d3.selectAll(".yearDropdownOrigin").remove()
    d3.select(".yearDropdownDest").remove()

    // var yearOriginDropDownLabel = d3.select('.fixed')
    //                     .insert("span","svg")
    //                     .attr("class", "yearOriginDropDownLabel dropdownLabel")
    // yearOriginDropDownLabel.text("Origin:")

    // dropdown2 = d3.select('.fixed')
    //                     .insert("select","svg")
    //                     .attr("class", "yearDropdownOrigin dropdown")
    //                     .on("change",updateTimeOrigin)

    var yearDestDropDownLabel = d3.select('.fixed')
                        .insert("span","svg")
                        .attr("class", "yearDestDropDownLabel dropdownLabel")
    yearDestDropDownLabel.text("Resettlement:")

    dropdown3 = d3.select('.fixed')
                        .insert("select","svg")
                        .attr("class", "yearDropdownDest dropdown")
                        .on("change",updateTimeDest)

    // dropdown2.selectAll("option")
    //         .data(countryList)
    //         .enter().append("option")
    //         .attr("value", function(d){return d})
    //         .text(function(d){
    //             return d[0].toUpperCase()+d.slice(1,d.length)
    //         })

    // dropdown3.selectAll("option")
    //         .data(destList)
    //         .enter().append("option")
    //         .attr("value", function(d){return d})
    //         .text(function(d){
    //             return d[0].toUpperCase()+d.slice(1,d.length)
    //         })
    // dropdown2.property('value', timeOrigin);

    var filterOriginBased = submissionData.filter(function(obj)
    {
        if(obj.origin == timeOrigin)
            return true;
    })
    destList = []
    filterOriginBased.forEach(d => {
        if(destList.indexOf(d.destination)==-1)
            destList.push(d.destination)
    }) 
    //console.log(destList)
    var opts = dropdown3.selectAll("option")
                    .data(destList)

    opts.exit().remove()

    var optsEnter = opts.enter().append("option")
                    .attr("value", function(d){return d})
                    .text(function(d){
                        return d[0].toUpperCase()+d.slice(1,d.length)
                    })

    opts = opts.merge(optsEnter)
    if(destList.indexOf(timeDest) == -1)
    {
        timeDest = destList[0]
    }

    d3.select('.yearDropdownDest').property('value', timeDest);
    //var 
    //updateTimeOrigin()
    createTimeLine(timeOrigin,timeDest)
}

// function updateTimeOrigin(){
//     console.log("lalalalalalalalala")
//     timeOrigin = d3.select(this).property('value')
//     console.log(timeOrigin)
//     var filterOriginBased = resettlementCompleteData.filter(function(obj)
//     {
//         if(obj.origin == timeOrigin)
//             return true;
//     })
//     destList = []
//     filterOriginBased.forEach(d => {
//         if(destList.indexOf(d.destination)==-1)
//             destList.push(d.destination)
//     }) 
//     //console.log(destList)
//     var opts = dropdown3.selectAll("option")
//                     .data(destList)

//     opts.exit().remove()

//     var optsEnter = opts.enter().append("option")
//                     .attr("value", function(d){return d})
//                     .text(function(d){
//                         return d[0].toUpperCase()+d.slice(1,d.length)
//                     })

//     opts = opts.merge(optsEnter)
//     if(destList.indexOf(timeDest) == -1)
//     {
//         timeDest = destList[0]
//     }
//     d3.select('.yearDropdownDest').property('value', timeDest);
//     createTimeLine(timeOrigin, timeDest)
// }

function updateTimeDest(){
    console.log("lalalalalalalalala")
    timeDest = d3.select(this).property('value')
    // console.log(timeDest)
    // var filterDestBased = resettlementCompleteData.filter(function(obj)
    // {
    //     if(obj.destination == timeDest)
    //         return true;
    // })
    // oList = []
    // filterDestBased.forEach(d => {
    //     if(oList.indexOf(d.origin)==-1)
    //         oList.push(d.origin)
    // }) 
    // //console.log(oList)
    // var opts = dropdown2.selectAll("option")
    //                 .data(oList)

    // opts.exit().remove()

    // var optsEnter = opts.enter().append("option")
    //                 .attr("value", function(d){return d})
    //                 .text(function(d){
    //                     return d[0].toUpperCase()+d.slice(1,d.length)
    //                 })
    // opts = opts.merge(optsEnter)
    createTimeLine(timeOrigin, timeDest)
}

function createTimeLine(origin, destination){
    // if(!origin)
    //     origin = "all"
    // if(!destination)
    //     destination = "all "
    var yearWiseOriginDestData = submissionData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"] == destination)
            return true
    })
    var resettledData = resettlementCompleteData.filter(function(obj){
        if(obj["origin"] == origin && obj["destination"]== destination)
            return true
    })
    console.log(origin,destination)
    console.log("yearWiseOriginDestData ", yearWiseOriginDestData)
    console.log("resettledData ", resettledData)
            
    yearWiseOriginDestData.sort(function (a, b) {
        return b.year - a.year;
    })
    //yearWiseOriginDestData = yearWiseOriginDestData.splice(0, numOfCountries);

    var years = yearWiseOriginDestData.map(function (d) { return d.year })
    years.reverse()
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
        .attr("transform", "rotate(0)")
        .style("text-anchor", "end")
        .attr("x",-10)
        .attr("dy", "0.5em")
        .style("font-size", "12px")
        .style("color", "white");

    resettlement_cols = 10;
    barMargin = 5;
    resettlement_bandwidth = xTimeScale.bandwidth() - (2 * barMargin);
    resettlement_size = resettlement_bandwidth / resettlement_cols;
    resettlement_ratio = 100;

    //cumulative
    rTimeData = []
    yearWiseOriginDestData.forEach((c, idx) => {
        var total = Math.ceil(c.submissions / resettlement_ratio);
        var xStart = xTimeScale(c.year) + barMargin;
        var accepted = resettledData.filter(function(o){
            return o.year == c.year
        })
        var resettlementNodes = d3.range(total).map(function (d, i) {
            return {
                size: resettlement_size,
                y: ((i % resettlement_cols) * resettlement_size + xStart),
                x: (Math.floor((i / resettlement_cols)) * resettlement_size),
                year : c.year,
                total : c.submissions,
                setAccepted : (accepted.length && i < Math.floor(accepted[0].total/resettlement_ratio)) ? true : false,
                accepted : accepted.length > 0 ? accepted[0].total : 0,
                origin : origin,
                isTime : true
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
        .attr('class', function(d,i)
        {
            if(d.setAccepted == true){
                return 'accepted'
            }
            else{
                return 'not_accepted'
            }
        })
        .style('fill', function (d) { 
            if(d.setAccepted == true)
                return 'green'
            else
                return 'yellow'
        });

    units
        .on("mouseover", function (d, i) {
            if(d.setAccepted == true)
                d3.selectAll('.accepted').style('opacity', 0.5)   
            else 
                d3.selectAll('.not_accepted').style('opacity',0.5)
            rtoolTip.show(d)
        })
        .on("mouseout", function (d) {
            d3.selectAll('.accepted').style('opacity', 1.0)
            d3.selectAll('.not_accepted').style('opacity',1.0)
            rtoolTip.hide();
        })

}

