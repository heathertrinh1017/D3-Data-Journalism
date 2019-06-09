var svgWidth = 900;
var svgHeight = 500;

var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
var chartWidth = svgWidth - chartMargin.left - chartMargin.right
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom

var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(70, ${chartMargin.top})`);


d3.csv("assets/data/data.csv").then(function(populationData) {
    populationData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    var xLinearscale = d3.scaleLinear()
        .domain([9, d3.max(populationData.map(d=>d.poverty).reverse())])
        .range([0, chartWidth]);


    var yLinearscale = d3.scaleLinear()
        .domain([20.5, d3.max(populationData.map(d=>d.obesity))])
        .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xLinearscale);
    var leftAxis = d3.axisLeft(yLinearscale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(populationData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearscale(d.poverty))
        .attr("cy", d => yLinearscale(d.obesity))
        .attr("r", "9")
        .attr("fill", "rgb(6.5%, 68.6%, 84.7%)")
        .attr("opacity", ".5");
      


    var yLabel=  chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 50)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity (%)")
        .style("fill", "rgb(1.3%, 52.9%, 68.3%)");

    var xLabel = chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 15})`)
        .attr("class", "axisText")
        .text("Poverty (%)")
        .style("fill", "rgb(1.3%, 52.9%, 68.3%)");
        

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "9.5px")
        .attr("fill","white")
        .selectAll("tspan")
        .data(populationData)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
                return xLinearscale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearscale(data.obesity - 0.2);
            })
            .text(function(data) {
                return data.abbr
            });

  });
