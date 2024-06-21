import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const svg = d3.select(chartRef.current)
        .attr('width', 800)
        .attr('height', 400)
        .style('background-color', '#1E1E1E'); // Fond plus foncé

      const margin = { top: 20, right: 30, bottom: 60, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.diameter)]).nice()
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.volume)]).nice()
        .range([height - margin.bottom, margin.top]);

      const size = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.volume)])
        .range([0, 40]);

      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "120px")
        .style("height", "28px")
        .style("padding", "2px")
        .style("font", "12px sans-serif")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("opacity", 0);

      svg.selectAll('*').remove(); // Clear the SVG before rendering

      svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => x(d.diameter))
        .attr('cy', d => y(d.volume))
        .attr('r', d => size(d.volume))
        .attr('fill', d => d.color)
        .attr('opacity', 0.7)
        .on("mouseover", (event, d) => {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(d.name)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "#CCCCCC"); // Texte gris clair

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#CCCCCC"); // Texte gris clair

      // Adding X axis label
      svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top)
        .text('Diamètre (mm)')
        .style("fill", "#58A6FF"); // Texte bleu clair

      // Adding Y axis label
      svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.left - 50)
        .attr('x', -margin.top - height / 2 + 20)
        .text('Volume (cm³)')
        .style("fill", "#58A6FF"); // Texte bleu clair
    }
  }, [data]);

  return (
    <svg ref={chartRef}></svg>
  );
};

export default ScatterChart;
