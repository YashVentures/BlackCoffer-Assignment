import React, { useRef, useEffect } from "react";
import { select, flatRollup, sum, scaleLinear, axisBottom, axisLeft, line, curveMonotoneX, pointer } from 'd3';
import { useResizeObserver } from '../utils/customHooks';

function LineChart({ data, name }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    if (!dimensions) return;
    svg.attr("width", dimensions.width)
       .attr("height", dimensions.height);

    // Prepare data
    let sumstat = flatRollup(data,
      v => ({
        intensity: sum(v, v => v.intensity),
        likelihood: sum(v, v => v.likelihood),
        relevance: sum(v, v => v.relevance)
      }),
      d => new Date(d.published).getFullYear(),
    );

    const xScale = scaleLinear().domain([2007, 2020]).range([0, dimensions.width - 100]);
    const yScale = scaleLinear().domain([0, 10000]).range([dimensions.height - 40, 0]);

    // Add axes
    svg.append("g")
       .attr("transform", "translate(40," + (dimensions.height - 20) + ")")
       .call(axisBottom(xScale).ticks(10))
       .selectAll("text")
       .attr("transform", "translate(0,-6)rotate(-35)")
       .style("text-anchor", "end");

    svg.append("g")
       .attr("transform", "translate(40,20)")
       .call(axisLeft(yScale).ticks(5));

    // Add grid lines
    svg.append("g")
       .attr("transform", "translate(40,20)")
       .selectAll(".grid")
       .data(yScale.ticks(5))
       .enter()
       .append("line")
       .attr("class", "grid")
       .attr("x1", 0)
       .attr("x2", dimensions.width - 100)
       .attr("y1", d => yScale(d))
       .attr("y2", d => yScale(d))
       .style("stroke", "#e0e0e0")
       .style("stroke-width", 1);

    // Draw lines and circles
    const colors = {
      intensity: "#CC0000",
      likelihood: "green",
      relevance: "blue"
    };

    Object.keys(colors).forEach(key => {
      svg.append('g')
         .selectAll("dot")
         .data(sumstat)
         .enter()
         .append("circle")
         .attr("cx", d => xScale(d[0]))
         .attr("cy", d => yScale(d[1][key] || 0))
         .attr("r", 3)
         .attr("transform", "translate(40,20)")
         .style("fill", colors[key]);

      const lineGenerator = line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1][key]))
        .curve(curveMonotoneX);

      svg.append("path")
         .datum(sumstat)
         .attr("class", "line")
         .attr("transform", "translate(40,20)")
         .attr("d", lineGenerator)
         .style("fill", "none")
         .style("stroke", colors[key])
         .style("stroke-width", "2");
    });

    // Add legend
    const legendYPosition = 30;
    Object.keys(colors).forEach((key, index) => {
      svg.append("circle")
         .attr("cx", dimensions.width - 100)
         .attr("cy", legendYPosition + (index * 20))
         .attr("r", 6)
         .style("fill", colors[key]);

      svg.append("text")
         .attr("x", dimensions.width - 80)
         .attr("y", legendYPosition + (index * 20))
         .text(key.charAt(0).toUpperCase() + key.slice(1))
         .style("font-size", "15px")
         .attr("alignment-baseline", "middle");
    });
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ gridArea: name, paddingBottom: '20px', backgroundColor: 'white' }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default LineChart;
