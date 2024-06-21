import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
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

      const x = d3.scaleBand()
        .domain(data.map(d => d.nom_metastase))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.volume)]).nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.nom_metastase))
        .range(d3.schemeCategory10);

      svg.selectAll('*').remove(); // Clear the SVG before rendering

      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', d => x(d.nom_metastase))
        .attr('y', d => y(d.volume))
        .attr('height', d => y(0) - y(d.volume))
        .attr('width', x.bandwidth())
        .attr('fill', d => d.color);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
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
        .attr('y', height + margin.top + 40)
        .text('Nom des Métastases')
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

export default BarChart;
