var chartG;
var yearTotal;
var xScale;
var yScale;
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

    xScale = d3.scaleLinear()
        .domain([2011,2018])
        .range([0, chartWidth]);

    yScale = d3.scaleLinear()        
        .domain([0,d3.max(yearTotal,function(d){
            return +(d.value.totalAsylumSeekers);
        })])
        .range([chartHeight,0]);

    chartG = d3.select('svg')
        .append('g')
        .attr('transform', 'translate('+[positionX,positionY]+')');    

}

function buildSparkline(year){
    var currYearTotal = yearTotal.filter(function(d){
        return d.key <= year;
    })
    //console.log("Hi")
    //console.log(currYearTotal)
    var lineInterpolate = d3.line()
        .x(function(d) {return xScale(d.value.year); })
        .y(function(d) {return yScale(d.value.totalAsylumSeekers); })
    .curve(d3.curveMonotoneX);


    var line = chartG
    .selectAll('.line-plot')    
    .data([currYearTotal])

    line.exit().remove();
    //console.log("Before exit")
    //console.log(lineExit)
    var lineEnter = line
    .enter()
    .append("path")

    lineEnter.merge(line)
    .attr('d', lineInterpolate)
    .attr("fill", function(d){
        return "none"
    })
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)    
    .attr('class', 'line-plot')
    
    console.log(chartG.selectAll('.sparklineCircle'))
    var circle = chartG
    .selectAll(".sparklineCircle")
    .data(currYearTotal)
    console.log("Please work")
    console.log(circle)
    
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
    .attr('çlass',"sparklineCircle")
    .style('fill', "steelblue");
}

