var chartG;
var yearTotal;
var yScale;
var chartWidth
var chartHeight
var xScaleSparkline
var parseDate = d3.timeParse('%Y');
var g = 0;
function createSparkline(){
    yearTotal = d3.nest()
        .key(function(d){
            return +d["Year"];
        })
        .rollup(function(leaves){
            var total = d3.sum(leaves, function(c){
                return +c["Asylum-seekers"];
            });
            return {year:leaves[0]["Year"],totalAsylumSeekers: total};
        })
        .entries(data);
    console.log(yearTotal)
    chartWidth = width/3
    chartHeight = height/4
    positionX = width/1.5
    positionY = 0

    xScaleSparkline = d3.scaleTime()
        .domain([parseDate(2011),parseDate(2018)])
        .range([0, chartWidth]);

    yScaleSparkline = d3.scaleLinear()        
        .domain([0,d3.max(yearTotal,function(d){
            return +(d.value.totalAsylumSeekers);
        })])
        .range([chartHeight,0]); 


    chartG = d3.select('svg')
        .append('g')
        .attr('transform', 'translate('+[positionX,positionY]+')')
        .attr('class','sparklineVis')
}

function buildSparkline(year){
    d3.select('.xAxisSparkline').remove()
    d3.selectAll('.sparklineTextAsylum').remove()
    d3.selectAll('.sparklineTextNumber').remove()

    var xAxisSparkline = d3.axisBottom()
        .scale(xScaleSparkline)

    chartG
        .append('g')
        .attr('transform', 'translate(0,' + (+chartHeight) + ')')
        .call(xAxisSparkline)
        .attr('class','xAxisSparkline')

    var currYearTotal = yearTotal.filter(function(d){
        return d.key <= year;
    })
    var lineInterpolate = d3.line()
        .x(function(d) {return xScaleSparkline(parseDate(d.value.year)); })
        .y(function(d) {return yScaleSparkline(d.value.totalAsylumSeekers); })

    var line = chartG
    .selectAll('.line-plot')    
    .data([currYearTotal])

    line.exit().remove();
    
    var lineEnter = line
    .data([currYearTotal])
    .enter()
    .append("path")

    //console.log("Nodes")

    var mergedLine = lineEnter.merge(line)
    len = mergedLine.node().getTotalLength()
    g = len;
    //console.log(len)

    mergedLine
    .attr('d', lineInterpolate)
    .attr("fill", function(d){
        return "none"
    })
    .attr('class', 'line-plot')

    chartG.append("text")
    .attr("dx", "25em")
    .attr("dy", "13em")
    .text("Asylum Seekers: ")
    .attr("class","sparklineTextAsylum")

    chartG.append("text")
    .attr("dx", "33em")
    .attr("dy", "13em")
    .text(yearTotal[year%2011].value.totalAsylumSeekers)
    .attr("class","sparklineTextNumber")

}
function createSparklineCircles(currYearTotal){
    var circle = chartG
    .selectAll('circle')
    .data(currYearTotal)    

    circle.exit().remove();
    
    var circleEnter = circle
    .enter()
    .append("circle")
    .style("fill", "none")

    circleEnter.merge(circle)
    .attr('cx',function(d){
        return xScaleSparkline(parseDate(d.value.year));
    })
    .attr('cy',function(d){
        return yScaleSparkline(d.value.totalAsylumSeekers);
    })
    .attr('r',"2px")
    .transition()
    .ease(d3.easeLinear)    
    .style('fill', "#aa0000")
    .attr('çlass','sparklineCircle');
}

