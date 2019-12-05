var chartG;
var yearTotal;
var xScale;
var yScale;
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
    var chartWidth = width/3
    var chartHeight = height/3
    var positionX = width/1.5
    var positionY = 50

    xScale = d3.scaleTime()
        .domain([parseDate(2011),parseDate(2018)])
        .range([0, chartWidth]);

    yScale = d3.scaleLinear()        
        .domain([0,d3.max(yearTotal,function(d){
            return +(d.value.totalAsylumSeekers);
        })])
        .range([chartHeight,0]);

    var xAxis = d3.axisBottom()
        .scale(xScale)


    chartG = d3.select('svg')
        .append('g')
        .attr('transform', 'translate('+[positionX,positionY]+')'); 

    chartG
    .append('g')
    .attr('transform', 'translate(0,' + (+chartHeight) + ')')
        .call(xAxis)   

}

function buildSparkline(year){
    var currYearTotal = yearTotal.filter(function(d){
        return d.key <= year;
    })
    var lineInterpolate = d3.line()
        .x(function(d) {return xScale(parseDate(d.value.year)); })
        .y(function(d) {return yScale(d.value.totalAsylumSeekers); })

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
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)    
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
        return xScale(d.value.year);
    })
    .attr('cy',function(d){
        return yScale(d.value.totalAsylumSeekers);
    })
    .attr('r',"5px")
    .style("fill", "none")
    .transition()
    .ease(d3.easeLinear)
    
    .style('fill', "steelblue")
    .attr('çlass','sparklineCircle');
}

