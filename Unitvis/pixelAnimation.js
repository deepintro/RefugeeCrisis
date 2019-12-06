var initialSize
var xStart
var pixelCols
var yStart

function showPixelPersonRatio() {
    initialSize = 20;
    xStart = 100;
    pixelCols = Math.sqrt(ratio)
    yStart = height / 2 - (initialSize * pixelCols / 2);

    var pixels = d3.range(0, ratio);
    console.log(pixels);

    var images = svg.selectAll('.personImg')
        .data(pixels)

    images
        .enter()
        .append("svg:image")

        .attr("xlink:href", function (d) { return "./person.png" })
        .attr("class", "personImg")
        .attr('x', function (d, i) {
            return (i % pixelCols) * initialSize + xStart
        })
        .attr('y', function (d, i) {
            return (Math.floor((i / pixelCols)) * initialSize) + yStart
        })
        .attr("height", 15)
        .attr("width", 15);
    // var pixelRects = svg.selectAll('rect')
    //     .data(pixels)


    // pixelRects.enter()
    //     .append('rect')
    //     .attr('class', 'pixel')

    //     //show 100 huge pixels 
    //     .transition()
    //     .duration(1000)
    //     .attr('height', initialSize)
    //     .attr('width', initialSize)
    //     .attr('x', function (d, i) {
    //         return (i % pixelCols) * initialSize + xStart
    //     })
    //     .attr('y', function (d, i) {
    //         return (Math.floor((i / pixelCols)) * initialSize) + yStart
    //     })
    //     .style('fill', 'red')
    //     .style("stroke-width", "1px")

    //     //shrink to actual size
    //     .transition()
    //     .delay(5000)
    //     .duration(1000)
    //     .attr('height', size)
    //     .attr('width', size)
    //     .attr('x', function (d, i) {
    //         return (i % pixelCols) * size + xStart
    //     })
    //     .attr('y', function (d, i) {
    //         return (Math.floor((i / pixelCols)) * size) + yStart
    //     })
    //     .style('fill', 'red')
    //     .style("stroke-width", "0.5px")

    //show as 1 pixel 
    // .transition()
    // .delay(5000)
    // .duration(1000)
    // .ease(d3.easeLinear)
    // .style("stroke", "none")
    // .style("stroke-width", "0px")

}

function showPixelGroup() {
    d3.selectAll('.pixel').remove()

    svg.append('rect')
        .attr('height', size * 10)
        .attr('width', size * 10)
        .attr('x', function (d, i) {
            return xStart
        })
        .attr('y', function (d, i) {
            return yStart
        })
        .style('fill', 'red')
        .style("stroke-width", "0.5px")
}


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

function show100Persons() {
    d3.selectAll('.personImg').remove();
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
        .attr("width", initialSize - 5);
}

function shift100Persons() {
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
        .attr('x', function (d, i) {
            return (i % pixelCols) * initialSize + xStart + 100;
        })


    var pixelData = [1];
    var pixel = svg.selectAll('.pixel')
        .data(pixelData)

    pixel.exit().remove();

    var pixelEnter = pixel.enter()
        .append("rect")

    var pixelHeight = 15;
    pixel = pixel.merge(pixelEnter)
        .attr("class", "pixel")
        .style("fill", "black")
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("height", pixelHeight)
        .attr("width", pixelHeight)
        .attr('x', 100)
        .attr('y', (height / 2) - (pixelHeight / 2))


    var equals = svg.append('text')
        .attr('class', 'equals')
        .text("=")
        .style("font-size", "15px")
        .attr("transform", "translate(150," + +height / 2 + ")")


}

function hide100Persons() {
    initialSize = 15;
    xStart = 100;    
    yStart = height / 2 - (initialSize * pixelCols / 2);

    d3.selectAll('.personImg').remove();
    d3.selectAll('.equals').remove();

    var pixelData = d3.range(0, 140);
    pixelCols = 10;
    var pixel = svg.selectAll('.pixel')
        .data(pixelData)

    pixel.exit().remove();

    var pixelEnter = pixel.enter()
        .append("rect")

    var pixelHeight = 20;
    pixel = pixel.merge(pixelEnter)
        .attr("class", "pixel")
        .style("fill", "black")
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("height", pixelHeight)
        .attr("width", pixelHeight)
        .attr('x', function (d, i) {
            return (i % pixelCols) * pixelHeight + xStart
        })
        .attr('y', function (d, i) {
            return (Math.floor((i / pixelCols)) * pixelHeight) + yStart
        })

}