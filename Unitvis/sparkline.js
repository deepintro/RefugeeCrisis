function createSparkline(){
    var yearTotal = d3.nest()
        .key(function(d){
            return d["Year"];
        })
        .rollup(function(leaves){
            var total = d3.sum(leaves, function(c){
                return +c["Asylum-seekers"];
            });
            return {year:leaves[0]["Year"],totalAsylumSeekers: total};
        })
        .entries(data);
    var chartWidth = 400
    var chartHeight = 400
    var positionX = 750
    var positionY = 1000

    var xScale = d3.scaleLinear()
        .domain([2011,2018])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()        
        .domain([0,d3.max(yearTotal,function(d){
            return +(d.value.totalAsylumSeekers);
        })])
        .range([chartHeight,0]);

    var chartG = d3.select('svg')
        //.data(yearTotal)
        .append('g')
        .attr('transform', 'translate('+[positionX,positionY]+')');

    // chartG.append("g")
    //   .attr("transform", "translate(0," + chartHeight + ")")
    //   .call(d3.axisBottom(xScale));

    // chartG.append("g")
    //     .call(d3.axisLeft(yScale));

    var lineInterpolate = d3.line()
        .x(function(d) {return xScale(d.value.year); })
        .y(function(d) {return yScale(d.value.totalAsylumSeekers); })
    .curve(d3.curveMonotoneX);

    console.log(yearTotal);

    var path = chartG
    .append("path")
    .data([yearTotal])
    .attr('d', lineInterpolate)
    .attr("fill", function(d){
        console.log(d)
        return "none"
    })
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)    
    .attr('class', 'line-plot')
    
    d3.select('.line-plot')
    .attr("stroke-dasharray",len)
    .attr("stroke-dashoffset",len)
    .transition()
    .duration(5000)
    .attr("stroke-dashoffset",0);

    console.log("Sparkline")
    console.log(yearTotal);
}

