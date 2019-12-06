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
    chartWidth = width/4
    chartHeight = height/5
    positionX = width/1.3
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
    chartG.selectAll('.xAxisSparkline').remove()

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

    if(chartG.select('path').node()!=null){
       // console.log(g);
    }
    
    line.exit().remove();
    
    var lineEnter = line
    .enter()
    .append("path")

    console.log("Nodes")

    var mergedLine = lineEnter.merge(line)
    len = mergedLine.node().getTotalLength()
    g = len;
    console.log(len)

    mergedLine
    .attr('d', lineInterpolate)
    .attr("fill", function(d){
        return "none"
    })
    .attr("stroke", "red")
    .attr("stroke-width", 1)    
    .attr('class', 'line-plot')

    // d3.select(mergedLine.node())
    // .attr("stroke-dasharray",len+" "+len)
    // .attr("stroke-dashoffset",len)
    // .transition()
    // .duration(1000)
    // .attr("stroke-dashoffset",0)
    
    //createSparklineCircles(currYearTotal)

}
function createSparklineCircles(currYearTotal){
    var circle = chartG
    .selectAll('circle')
    .data(currYearTotal)    

    circle.exit().remove();
    
    var circleEnter = circle
    .enter()
    .append("circle")

    circleEnter.merge(circle)
    .attr('cx',function(d){
        return xScaleSparkline(d.value.year);
    })
    .attr('cy',function(d){
        return yScaleSparkline(d.value.totalAsylumSeekers);
    })
    .attr('r',"5px")
    .style("fill", "none")
    .transition()
    .ease(d3.easeLinear)
    
    .style('fill', "steelblue")
    .attr('çlass','sparklineCircle');
}

