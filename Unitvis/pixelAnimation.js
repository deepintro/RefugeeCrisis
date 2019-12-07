var initialSize
var xStart
var pixelCols
var yStart

//step 1
function showPerson() {
    d3.selectAll('.personImg').remove();
    d3.selectAll('.equals').remove();

    var imgData = [1];
    var person = svg.selectAll('.personImg')
        .data(imgData)

    person.exit().remove();

    var personEnter = person.enter()
        .append("svg:image")

    person = person.merge(personEnter)
        .attr("xlink:href", function (d) { return "./person.png" })
        .attr("class", "personImg")
        .attr('x', 100)
        .attr('y', height / 2)
        .attr("height", 60)
        .attr("width", 60);

}

//step 2
function show100Persons() {
    console.log("show 100 persons")
    //d3.selectAll('.personImg').remove();
    d3.selectAll('.equals').remove();
    d3.selectAll('.pixel').remove();

    initialSize = 25;
    xStart = 100;
    pixelCols = Math.sqrt(ratio)
    yStart = height / 2 - (initialSize * pixelCols / 2);

    var personData = d3.range(0, ratio);

    var images = svg.selectAll('.personImg')
        .data(personData)
    images.exit().remove()

    var imagesEnter = images
        .enter()
        .append("svg:image")

    images = images.merge(imagesEnter)
        .transition()
        .duration(1000)
        .delay(function (d, i) {
            return i * 10;
        })
        .attr("xlink:href", function (d) { return "./person.png" })
        .attr("class", "personImg")
        .attr('x', function (d, i) {
            return (i % pixelCols) * initialSize + xStart
        })
        .attr('y', function (d, i) {
            return (Math.floor((i / pixelCols)) * initialSize) + yStart
        })
        .attr("height", initialSize - 5)
        .attr("width", initialSize - 5)

}


//step 3
function shift100Persons() {
    console.log("shift")
    initialSize = 25;
    xStart = 100;
    pixelCols = Math.sqrt(ratio)
    yStart = height / 2 - (initialSize * pixelCols / 2);
    var pixelHeight = 15;
    var personData = d3.range(0, ratio);

    var images = svg.selectAll('.personImg')
        .data(personData)
    images.exit().remove()

    var imagesEnter = images
        .enter()
        .append("svg:image")

    images = images.merge(imagesEnter)       
        .attr("xlink:href", function (d) { return "./person.png" })
        .attr("class", "personImg")
        .attr('y', function (d, i) {
            return (Math.floor((i / pixelCols)) * initialSize) + yStart
        })
        .attr("height", initialSize - 5)
        .attr("width", initialSize - 5)

        .transition()
        .duration(1000)
        .attr('x', function (d, i) {
            return (i % pixelCols) * initialSize + xStart + 100;
        })

        .transition()
        .duration(1000)
        .delay(1000)
        .attr('x', function (d, i) {
            return 100;
        })
        .attr('y', function (d, i) {
            return (height / 2) - (pixelHeight / 2)
        })
        .attr("height", 0)
        .attr("width", 0)
        .remove()


    var pixelData = [1];
    var pixel = svg.selectAll('.pixel')
        .data(pixelData)

    pixel.exit().remove();

    var pixelEnter = pixel.enter()
        .append("rect")

    
    pixel = pixel.merge(pixelEnter)
        .attr("class", "pixel")
        .style("fill", "white")
        .attr('x', 0)
        .attr('y', (height / 2) - (pixelHeight / 2))

        .transition()
        .duration(1000)
        .delay(1000)
        .attr("height", pixelHeight)
        .attr("width", pixelHeight)
        .attr('x', 100)
        .attr('y', (height / 2) - (pixelHeight / 2))


}

//step 4
function hide100Persons() {
    //remove extra stuff in case scroll back occurs
    d3.select('.xAxisSparkline').remove()
    d3.selectAll('.sparklineTextAsylum').remove()
    d3.selectAll('.sparklineTextNumber').remove()
    svg.selectAll('.resettlementaxis').remove()
    svg.selectAll('.xaxis').remove()
    svg.selectAll('.dataPixel').remove()


    initialSize = 15;
    xStart = 100;
    yStart = height / 2 - (initialSize * pixelCols / 2);

    d3.selectAll('.personImg')
        .transition()
        .duration(1000)
        .remove();
    d3.selectAll('.equals')
        .transition()
        .duration(1000)
        .remove();

    var personData2011 = persons.filter(p => {
        if (p.year <= 2011)
            return true;
    })
    var pixelData = d3.range(0, personData2011.length);
    pixelCols = 10;
    var pixel = svg.selectAll('.pixel')
        .data(pixelData)

    pixel.exit().remove();

    var pixelEnter = pixel.enter()
        .append("rect")

    var pixelHeight = 20;
    pixel = pixel.merge(pixelEnter)
        .attr("class", "pixel")
        .style("fill", "white")
        .transition()
        .duration(1000)
        .delay(2000)
        .attr("height", pixelHeight)
        .attr("width", pixelHeight)
        .attr('x', function (d, i) {
            return (i % pixelCols) * pixelHeight + xStart
        })
        .attr('y', function (d, i) {
            return (Math.floor((i / pixelCols)) * pixelHeight) + yStart
        })

}