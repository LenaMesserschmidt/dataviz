const data = await d3.csv("data/asoiaf.csv")

var sizeScale = d3.scaleOrdinal().range([280 * 835 / 1216, 280 * 1009 / 1216, 280, 280 * 1104 / 1216, 280 * 1056 / 1216])
var depthScale = d3.scaleOrdinal()
    .range(['#96747a', '#d4c7ad', '#271631'])

var nestedTweets = d3.group(data, d => d.book)
var packChart = d3.pack()

d3.select("svg")
    .append("text")
    .attr("id", "namebox")
    .attr("transform", "translate(500,100)")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("")
    .style("opacity", 0)

d3.select("svg")
    .append("g")
    .attr("transform", `translate(35,25)`)
    .attr("class", `book-g book-1`)
    .append("text")
    .attr("class", "book-label")
    .attr("transform", `translate(35,210)`)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("BOOK 1")

d3.select("svg")
    .append("g")
    .attr("transform", `translate(130,175)`)
    .attr("class", `book-g book-2`)
    .append("text")
    .attr("class", "book-label")
    .attr("transform", `translate(75,250)`)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("BOOK 2")

d3.select("svg")
    .append("g")
    .attr("transform", `translate(335,255)`)
    .attr("class", `book-g book-3`)
    .append("text")
    .attr("class", "book-label")
    .attr("transform", `translate(135,300)`)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("BOOK 3")

d3.select("svg")
    .append("g")
    .attr("transform", `translate(600,195)`)
    .attr("class", `book-g book-4`)
    .append("text")
    .attr("class", "book-label")
    .attr("transform", `translate(160,275)`)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("BOOK 4")

d3.select("svg")
    .append("g")
    .attr("transform", `translate(765,20)`)
    .attr("class", `book-g book-5`)
    .append("text")
    .attr("class", "book-label")
    .attr("transform", `translate(184,260)`)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .html("BOOK 5")

/*
for (let i = 0; i < 5; i++) {
    d3.select("svg")
        .append("g")
        .attr("transform", `translate(${i * 200},${i % 2 == 0 ? 20 : 220})`)
        .attr("class", `book-g book-${i + 1}`)
        .append("text")
        .attr("class", "book-label")
        .attr("transform", `translate(75,${i % 2 == 0 ? 0 : 200})`)
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .html("BOOK " + (i + 1))
}*/

nestedTweets.forEach((value, key, map) => {
    packChart
        .size([sizeScale(key - 1), sizeScale(key - 1)])
        .padding(10)

    var root = d3.hierarchy(d3.group(value, d => d.book))
        .sum(d => d.povs ? d.povs + 1 : undefined)
        .sort((a, b) => b.value - a.value)

    d3.select(`g.book-${key}`)
        .selectAll("circle")
        .data(packChart(root))
        .enter()
        .append("g")
        .append("circle")
        .attr("class", d => d.data.classname)
        .attr("r", d => d.r)
        .attr("cx", d => d.x)
        .attr('cy', d => d.y)
        .style("fill", d => depthScale(d.depth))

    /*
d3.select(`g.book-${key}`)
    .selectAll("g")
    .select("text")
    .data(packChart(root))
    .join("text")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("class", "label")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .text(d => d.data.character)
    */
})

d3.selectAll("circle")

d3.selectAll("circle")
    .on("mouseover", highlightChar)

d3.selectAll("circle")
    .on("mouseout", unhighlight)

function highlightChar(e, d) {
    if (!d.data.classname) {
        return
    }
    d3.selectAll(`circle.${d.data.classname}`)
        .classed("highlighted", true)
        .style("fill", "#C18B00")

    d3.select("text#namebox")
        .html(d.data.character.toUpperCase())
        .transition()
        .duration(250)
        .style("opacity", 1)
}

function unhighlight(e, d) {
    if (!d.data.classname) {
        return
    }
    d3.selectAll(`circle.${d.data.classname}`)
        .classed("highlighted", false)
        .style("fill", d => depthScale(d.depth))

    d3.select("text#namebox")
        .transition()
        .duration(250)
        .style("opacity", 0)
}
