import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3'
import {useResizeObserver} from '../utils/customHooks'

function Density({ data,name }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
  
    if (!dimensions) return; 
    svg
    .attr("width", dimensions.width)
    .attr("height", dimensions.height - 20)

    var x = d3.scaleLinear()
    .domain([-10,15])
    .range([0, dimensions.width]);
    
    var y = d3.scaleLinear()
    .range([dimensions.height, 0])
    .domain([0, 0.12]);

    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60))
    var density1 =  kde( data
        .filter( function(d){return d.intensity !== ""} )
        .map(function(d){  return d.intensity; }) )

    var density2 =  kde( data
        .filter( function(d){return d.relevance !== ""} )
        .map(function(d){  return d.relevance; }) )

    var density3 =  kde( data
      .filter( function(d){return d.likelihood !== ""} )
      .map(function(d){  return d.likelihood; }) )

    svg.append("path")
    .attr("class", "mypath")
    .datum(density1)
    .attr("fill", "#69b3a2")
    .attr("opacity", ".6")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
    );

    svg.append("path")
    .attr("class", "mypath")
    .datum(density2)
    .attr("fill", "#404080")
    .attr("opacity", ".6")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
    );

    svg.append("path")
    .attr("class", "mypath")
    .datum(density3)
    .attr("fill", "#44af69")
    .attr("opacity", ".6")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
      .curve(d3.curveBasis)
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
    );

    //legend
    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",50).attr("r", 6).style("fill", "#404080")
    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",70).attr("r", 6).style("fill", "#44af69")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 30).text("intensity").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 50).text("relevance").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 70).text("likelihood").style("font-size", "15px").attr("alignment-baseline","middle")

    function kernelDensityEstimator(kernel, X) {
      return function(V) {
        return X.map(function(x) {
          return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }



  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ gridArea: name,paddingBottom: '20px',backgroundColor: 'white' }}>
      <h1 className="title">Density chart</h1>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default Density;