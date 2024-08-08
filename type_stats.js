const data = await d3.csv("data/type_stats.csv")

const MAX_HP = 255
const MAX_ATK = 181
const MAX_DEF = 230
const MAX_SPATK = 173
const MAX_SPDEF = 230
const MAX_INIT = 200

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

const xScale = d3.scaleLinear().domain([0, data.length]).range([20, 600])
const yScale = d3.scaleLinear().domain([0, 255]).range([460, 60])
const colorScale = d3.scaleOrdinal().domain(Object.keys(colors)).range(Object.values(colors))

var yAxis = d3.axisLeft().scale(yScale)
    .ticks(6)

d3.select("svg")
    .append("g")
    .attr("id", "yAxisG")
    .attr("transform", "translate(60,0)")
    .call(yAxis)

// y-axis label
d3.select("svg").append("text")
    .attr("id", "yLabel")
    .attr("transform", "translate(60,40)")
    .style("text-anchor", "end")
    .style("font-size", 10)
    .text("Value");

// Bottom line
d3.select("svg")
    .append("line")
    .attr("x1", 60)
    .attr("y1", 460)
    .attr("x2", 660)
    .attr("y2", 460)
    .style("stroke", "black")

d3.select("svg").selectAll("g.box")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "box")
    .attr("transform", (d, i) => `translate(${xScale(i + 1) + 40},${yScale(d.HP_median)})`
    ).each(function (d, i) {

        d3.select(this)
            .append("line")
            .attr("class", "range")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", yScale(d.HP_max) - yScale(d.HP_median))
            .attr("y2", yScale(d.HP_min) - yScale(d.HP_median))
            .style("stroke", colorScale(d.type))
            .style("stroke-width", "3px")

        d3.select(this)
            .append("line")
            .attr("class", "max")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", yScale(d.HP_max) - yScale(d.HP_median))
            .attr("y2", yScale(d.HP_max) - yScale(d.HP_median))
            .style("stroke", colorScale(d.type))
            .style("stroke-width", "3px")

        d3.select(this)
            .append("line")
            .attr("class", "min")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", yScale(d.HP_min) - yScale(d.HP_median))
            .attr("y2", yScale(d.HP_min) - yScale(d.HP_median))
            .style("stroke", colorScale(d.type))
            .style("stroke-width", "3px")

        d3.select(this)
            .append("rect")
            .attr("class", "rect")
            .attr("width", 20)
            .attr("height", yScale(d.HP_q1) - yScale(d.HP_q3))
            .attr("x", -10)
            .attr("y", yScale(d.HP_q3) - yScale(d.HP_median))
            .style("fill", "white")
            .style("stroke", colorScale(d.type))

        d3.select(this)
            .append("line")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", 0)
            .attr("y2", 0)
            .style("stroke", colorScale(d.type))
            .style("stroke-width", "4px")

        d3.select(this)
            .insert("image", "text")
            .attr("xlink:href", `images/${d.type}.png`)
            .attr("width", "29px")
            .attr("height", "29px")
            .attr("x", -14)
            .attr("y", -14)
    })

d3.selectAll("button.button-c")
    .on("click", (event) => onButtonClick(event.target))

function onButtonClick(target) {
    d3.selectAll("button")
        .classed("active", false)
    d3.select("#" + target.id)
        .classed("active", true)

    d3.selectAll("g.box")
        .transition()
        .duration(1000)
        .attr("transform", (d, i) => `translate(${xScale(i + 1) + 40},${yScale(d[`${target.id}_median`])})`)

    d3.selectAll(".range")
        .transition()
        .duration(1000)
        .attr("y1", d => yScale(d[`${target.id}_max`]) - yScale(d[`${target.id}_median`]))
        .attr("y2", d => yScale(d[`${target.id}_min`]) - yScale(d[`${target.id}_median`]))

    d3.selectAll(".max")
        .transition()
        .duration(1000)
        .attr("y1", d => yScale(d[`${target.id}_max`]) - yScale(d[`${target.id}_median`]))
        .attr("y2", d => yScale(d[`${target.id}_max`]) - yScale(d[`${target.id}_median`]))

    d3.selectAll(".min")
        .transition()
        .duration(1000)
        .attr("y1", d => yScale(d[`${target.id}_min`]) - yScale(d[`${target.id}_median`]))
        .attr("y2", d => yScale(d[`${target.id}_min`]) - yScale(d[`${target.id}_median`]))

    d3.selectAll(".rect")
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d[`${target.id}_q3`]) - yScale(d[`${target.id}_median`]))
        .attr("height", d => yScale(d[`${target.id}_q1`]) - yScale(d[`${target.id}_q3`]))

}