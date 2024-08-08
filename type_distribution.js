const data = await d3.csv("data/type_counts.csv", d3.autoType)
const tooltip = await d3.text("tooltip.html")


// Sum count values for each type across gen and add to data
let max_sum = 0
for (let i = 0; i < data.length; i++) {
    let sum = 0
    for (let j = 1; j <= 9; j++) {
        sum += parseInt(data[i][`gen${j}_count`])
    }
    data[i]["total_count"] = sum
    if (sum > max_sum) {
        max_sum = sum
    }
}
data.columns.push("total_count")

const colors = {
    normal: "#9299A0",
    fire: "#F1A162",
    water: "#5D8ECF",
    grass: "#79B966",
    fighting: "#BE4B6A",
    flying: "#94A7D9",
    poison: "#A26DC3",
    ghost: "#5768A7",
    steel: "#668D9F",
    electric: "#EED35A",
    psychic: "#E8797A",
    ground: "#CC7C50",
    rock: "#C4B890",
    bug: "#9AC049",
    ice: "#8ACCC0",
    dragon: "#306BBE",
    dark: "#595365",
    fairy: "#DF93E1"
}

let currentSelect = "total_count"


let yScaleTotal = d3.scaleLinear().domain([0, max_sum]).range([0, 400])
let yScaleSingle = d3.scaleLinear().domain([0, 40]).range([0, 400])
let colorScale = d3.scaleOrdinal().domain(Object.keys(colors)).range(Object.values(colors))

const yAxisScaleTotal = d3.scaleLinear().domain([0, max_sum]).range([400, 0])
var yAxisTotal = d3.axisLeft().scale(yAxisScaleTotal)

const yAxisScaleSingle = d3.scaleLinear().domain([0, 40]).range([400, 0])
var yAxisSingle = d3.axisLeft().scale(yAxisScaleSingle)

let currentAxis = "total"

var axis = d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    .attr("transform", "translate(80,50)")

axis.call(yAxisTotal)

// y-axis label
d3.select("svg").append("text")
    .attr("id", "yLabel")
    .attr("transform", "translate(80,30)")
    .style("text-anchor", "end")
    .style("font-size", 10)
    .text("# of");

d3.select("svg").append("text")
    .attr("id", "yLabel")
    .attr("transform", "translate(80,40)")
    .style("text-anchor", "end")
    .style("font-size", 10)
    .text("Pokémon");

d3.select("svg")
    .append("g")
    .attr("id", "overallG")
    .attr("transform", "translate(110,0)")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "typeG")
    .attr("transform", (d, i) => "translate(" + (i * 30) + ", 0)")

var typeG = d3.selectAll("g.typeG")

// Create Stick rectangle
typeG
    .append("rect")
    .attr("y", d => 450 - yScaleTotal(d.total_count))
    .attr("width", 5)
    .attr("height", d => yScaleTotal(d.total_count))
    .style("fill", d => colors[d.type])

// Create type icon
typeG
    .insert("image", "text")
    .attr("xlink:href", d => `images/${d.type}.png`)
    .attr("width", "31px")
    .attr("height", "31px")
    .attr("x", -13)
    .attr("y", d => 450 - yScaleTotal(d.total_count) - 16)

// Bottom line
d3.select("svg")
    .append("line")
    .attr("x1", 80)
    .attr("y1", 450)
    .attr("x2", 650)
    .attr("y2", 450)
    .style("stroke", "black")

// Tooltip
var tip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .html(tooltip)

// Tooltip event
typeG.select("image")
    .on("mouseover", (e, d) => {
        d3.select("#typeDiv")
            .html(d.type)
        d3.select("#countDiv")
            .html(d[currentSelect])
        tip
            .style("left", (e.pageX - 25) + "px")
            .style("top", (e.pageY - 75) + "px")
            .style("display", "block")
            .transition()
            .duration(500)
            .style("opacity", .85)

    })
    .on("mouseout", (e, d) => {
        tip
            .style("display", "none")
            .style("opacity", 0)
    })

d3.select("#allGens")
    .on("click", allGens)

d3.select("#gen1")
    .on("click", gen1)

d3.select("#gen2")
    .on("click", gen2)

d3.select("#gen3")
    .on("click", gen3)

d3.select("#gen4")
    .on("click", gen4)

d3.select("#gen5")
    .on("click", gen5)

d3.select("#gen6")
    .on("click", gen6)

d3.select("#gen7")
    .on("click", gen7)

d3.select("#gen8")
    .on("click", gen8)

d3.select("#gen9")
    .on("click", gen9)

function allGens() {
    currentSelect = "total_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#allGens")
        .classed("active", true)
    if (currentAxis != "total") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisTotal)
        currentAxis = "total"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleTotal(d.total_count))
        .attr("height", d => yScaleTotal(d.total_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleTotal(d.total_count) - 16)
}

function gen1() {
    currentSelect = "gen1_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen1")
        .classed("active", true)
    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }

    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen1_count))
        .attr("height", d => yScaleSingle(d.gen1_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen1_count) - 16)
}

function gen2() {
    currentSelect = "gen2_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen2")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen2_count))
        .attr("height", d => yScaleSingle(d.gen2_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen2_count) - 16)
}

function gen3() {
    currentSelect = "gen3_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen3")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen3_count))
        .attr("height", d => yScaleSingle(d.gen3_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen3_count) - 16)
}

function gen4() {
    currentSelect = "gen4_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen4")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen4_count))
        .attr("height", d => yScaleSingle(d.gen4_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen4_count) - 16)
}

function gen5() {
    currentSelect = "gen5_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen5")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen5_count))
        .attr("height", d => yScaleSingle(d.gen5_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen5_count) - 16)
}

function gen6() {
    currentSelect = "gen6_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen6")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen6_count))
        .attr("height", d => yScaleSingle(d.gen6_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen6_count) - 16)
}

function gen7() {
    currentSelect = "gen7_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen7")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen7_count))
        .attr("height", d => yScaleSingle(d.gen7_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen7_count) - 16)
}

function gen8() {
    currentSelect = "gen8_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen8")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen8_count))
        .attr("height", d => yScaleSingle(d.gen8_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen8_count) - 16)
}

function gen9() {
    currentSelect = "gen9_count"
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#gen9")
        .classed("active", true)

    if (currentAxis != "single") {
        axis
            .transition()
            .duration(1000)
            .call(yAxisSingle)
        currentAxis = "single"
    }
    typeG.select("rect")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen9_count))
        .attr("height", d => yScaleSingle(d.gen9_count))
        .style("fill", d => colorScale(d.type))

    typeG.select("image")
        .transition()
        .duration(1000)
        .attr("y", d => 450 - yScaleSingle(d.gen9_count) - 16)
}
