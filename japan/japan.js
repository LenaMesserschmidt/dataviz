const japan = await d3.json("data/japan-detailed-boundary_945.geojson")
// src: https://cartographyvectors.com/map/945-japan-detailed-boundary

const cities = await d3.csv("data/cities.csv")
const icon1 = await d3.html("resources/cherry-blossom1.svg")
const icon2 = await d3.html("resources/cherry-blossom2.svg")
const icon3 = await d3.html("resources/cherry-blossom3.svg")

const colors = ['#564740', '#4c1711', '#aa6f73', '#fcdfe4', '#ebe7e4']

const opScale = d3.scaleLinear().domain([7, 3, 0]).range([0, .9, 1])

// 23.3. - 2.5.
const dateScale = d3.scaleTime().domain([new Date(2024, 2, 24), new Date(2024, 4, 3)]).range([0, 100])

let currentDate = dateScale.invert(50).toISOString().split("T")[0]
d3.select("#date-label")
    .html(`Date: ${formatDate(currentDate)}`)

var shadow_projection = d3.geoMercator().scale(1300).translate([-2596, 1204])
var projection = d3.geoMercator().scale(1300).translate([-2600, 1200])

var geoPath = d3.geoPath().projection(projection)
var shadowPath = d3.geoPath().projection(shadow_projection)

d3.select("svg")
    .selectAll("path.japan-shadow")
    .data(japan.features)
    .enter()
    .append("path")
    .attr("d", shadowPath)
    .attr("class", "japan-shadow")

d3.select("svg")
    .selectAll("path.japan-outline")
    .data(japan.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "japan-outline")

d3.select("svg")
    .selectAll("g")
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "cityG")
    .attr("transform", d => `translate(${projection([d.x, d.y])[0] - 19},${projection([d.x, d.y])[1] - 19}) scale(.6)`)
    .style("opacity", d => {
        let diff = getAbsDayDiff(new Date(currentDate), new Date(d.full_bloom))
        if (diff > 7) {
            return 0
        } else {
            return opScale(diff)
        }
    })

/**
    d3.select("svg")
    .selectAll("circle")
    .data(cities)
    .enter()
    .append("circle")
    .attr("class", "cities")
    .attr("r", 3)
    .attr("cx", d => projection([d.x, d.y])[0])
    .attr("cy", d => projection([d.x, d.y])[1])
     */

d3.select("input#date")
    .on("input", onDateChange)

loadSVG(icon1, 'color1')
loadSVG(icon2, 'color2')
loadSVG(icon3, 'color1')

//d3.selectAll("g.cityG").selectAll("path")
//    .style("fill", "#aa6f73")

function onDateChange(e) {
    let input = e.target.value
    let datum = dateScale.invert(input).toISOString().split("T")[0]
    currentDate = datum
    d3.selectAll("g.cityG")
        .style("opacity", d => {
            let diff = getAbsDayDiff(new Date(currentDate), new Date(d.full_bloom))
            if (diff > 7) {
                return 0
            } else {
                return opScale(diff)
            }
        })

    d3.select("#date-label")
        .html(`Date: ${formatDate(currentDate)}`)
}

function formatDate(dateString) {
    let month = dateString.split("-")[1]
    let day = dateString.split("-")[2]
    switch (month) {
        case '03':
            return `March, ${day}`
        case '04':
            return `April, ${day}`
        case '05':
            return `May, ${day}`
        default:
            return ''
    }
}

function getDayDiff(date1, date2) {
    const diffTime = date2 - date1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

function getAbsDayDiff(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

function loadSVG(svgData, className) {
    d3.selectAll("g").each(function () {
        var gParent = this
        d3.select(svgData).selectAll("path").each(function () {
            gParent.appendChild(this.cloneNode(true)).setAttribute("class", className)
        })
    })
}