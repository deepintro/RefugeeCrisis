var blockCols;
var otherCountryPersons;
function showBlock() {
    //TODO: hide axis
    blockCols = Math.ceil(Math.sqrt(persons.length));
  
    otherCountryPersons = [];
    var otherCountryData = allCountriesData.splice(20, allCountriesData.length);
    console.log(otherCountryData);

    var otherPersonCount = 0
    otherCountryData.forEach((c, idx) => {
        var total = Math.round(c.total / ratio);
        otherPersonCount += c.total;
        var cumulative = { 2011: c.years[2011], 2012: 0, 2013: 0, 2014: 0, 2015: 0, 2016: 0, 2017: 0, 2018: 0 };

        for (i = 2012; i <= 2018; i++) {
            cumulative[i] = cumulative[i - 1] + c.years[i];
        }

        var nodes = d3.range(total).map(function (d, i) {
            return {
                size: size,
                year: getYear(i, cumulative),
                country: c.country
            }

        })
        otherCountryPersons = otherCountryPersons.concat(nodes);

    })
    console.log(otherCountryPersons);
    console.log(otherPersonCount);

    d3.selectAll("rect")
        .transition()
        //.delay((d, i) => 10 * i)
        .duration(1000)
        //.ease(d3.easeElastic)
        .attr('x', function (d, i) {
            return (i % blockCols) * size;
        })
        .attr('y', function (d, i) {
            return height - (Math.floor((i / blockCols)) * size);
        })

}

function showOtherCountryPersons() {
    var units = svg
        .selectAll('other')
        .data(otherCountryPersons)
        .enter()
        .append('rect')
        .attr('class', 'other')
        .attr('height', function (d) {
            return d.size;
        })
        .attr('width', function (d) {
            return d.size;
        })
        .attr('x', function (d, i) {
            return ((persons.length +i) % blockCols) * size;
        })
        .attr('y', function (d, i) {
            return height - (Math.floor(((persons.length +i) / blockCols)) * size) - 100 ;
        })
        .style("fill", function (d) {
            return "red";
            //return colorScale(d.year % 2011)
        })
        .transition()
        .delay((d, i) => 10 * i)
        .duration(1000)
        //.ease(d3.easeLinear)
        
        .attr('y', function (d, i) {
            return height - (Math.floor(((persons.length +i) / blockCols)) * size) ;
        })
       //splitResettled();
}


function splitResettled(){
    d3.selectAll("rect")
    .attr("class", function(d,i){
        if(i < 2227)
            return "resettled";
    })
    console.log(d3.selectAll(".resettled"));

    var cols = 50;

    d3.selectAll(".resettled")
        .attr("x", function(d,i){
            return (i % cols) * size + 500;
        })
        .attr("y", function(d,i){
            return height - (Math.floor((i / cols)) * size);
        })
}
