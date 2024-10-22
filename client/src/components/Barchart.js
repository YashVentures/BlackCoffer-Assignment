import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import { useResizeObserver } from '../utils/customHooks';

function BarChart({ data, name }) {
  const [dimension, setDimension] = useState('source');
  const [aggregate, setAggregate] = useState('sum');
  const [measure, setMeasure] = useState('intensity');
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const dataAggregateByDimension = d3.flatRollup(data, v => {
      if (aggregate === 'sum') {
        return d3.sum(v, d => d[measure]);
      }
      if (aggregate === 'max') {
        return d3.max(v, d => d[measure]);
      }
      if (aggregate === 'count') {
        return v.length;
      }
      if (aggregate === 'avg') {
        return Math.round(d3.mean(v, d => d[measure]));
      }
    }, d => d[dimension]);

    const sortedDataAggregateByDimension = dataAggregateByDimension.sort((a, b) => {
      return d3.descending(a[1], b[1]);
    });

    let xDomain = (dimension === 'source') ? 50 : 500;
    if (measure === 'intensity') {
      if (aggregate === 'count') {
        xDomain = (dimension === 'source') ? 50 : 500;
      } else if (aggregate === 'sum') {
        xDomain = (dimension === 'source') ? 500 : 5000;
      } else if (aggregate === 'avg') {
        xDomain = (dimension === 'source' || dimension === 'topic') ? 100 : 20;
      } else if (aggregate === 'max') {
        xDomain = 100;
      }
    } else {
      xDomain = (aggregate === 'sum' || aggregate === 'count') ? 900 : 40;
    }
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!dimensions) return;
    const width = dimensions.width * .9;
    const height = (dimensions.width < 768) ? ((dimensions.width < 400) ? dimensions.height - 40 : dimensions.height - 30) : dimensions.height;
    svg
      .attr("width", width)
      .attr("height", height);

    const barGroup = svg.append("g")
      .attr("transform", "translate(" + 140 + "," + 0 + ")");

    const x = d3.scaleLinear()
      .domain([0, xDomain])
      .range([0, width - 140]);

    const y = d3.scaleBand()
      .range([0, height])
      .domain(sortedDataAggregateByDimension.map(d => d[0]).slice(0, 10))
      .padding(.1);

    svg.append("g")
      .attr("transform", "translate(" + 140 + "," + 0 + ")")
      .call(d3.axisLeft(y));

    const colorScale = d3.scaleThreshold()
      .domain([-150, -100, -50, 1, 50, 100, 300, 500])
      .range(d3.schemeBlues[9]);

    const tooltip = d3.select(wrapperRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    const showTooltip = function (e, d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 1);
      tooltip
        .html(dimension + ": " + d[0] + "<br/>" + measure + ": " + d[1])
        .style("left", (d3.pointer(e, svg)[0] + 20) + "px")
        .style("top", (d3.pointer(e, svg)[1] - 100) + "px");
    };

    const moveTooltip = function (e, d) {
      tooltip
        .style("left", (d3.pointer(e, svg)[0] + 20) + "px")
        .style("top", (d3.pointer(e, svg)[1] - 100) + "px");
    };

    const hideTooltip = function (d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0);
    };

    const bar = barGroup.selectAll("myRect")
      .data(sortedDataAggregateByDimension.slice(0, 10))
      .enter()
      .append("g");

    bar.append("rect")
      .attr("x", x(0))
      .attr("y", function (d) { return y(d[0]); })
      .attr("width", function (d) { return x(d[1]); })
      .attr("height", y.bandwidth())
      .attr("fill", function (d) { return colorScale(d[1]); })
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

    bar.append("text")
      .attr("x", function (d) { return x(d[1]) - 40; })
      .attr("y", function (d) { return y(d[0]) + 18; })
      .attr("fill", "#ffffff")
      .text(function (d) { return d[1]; });

  }, [data, dimensions, dimension, aggregate, measure]);

  return (
    <div
      className="barchart"
      ref={wrapperRef}
      style={{
        display: 'flex',
        gridArea: name,
        backgroundColor: 'white',
        padding: '10px 0',
      }}
    >
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <form className="compare-form" style={{ marginLeft: '20px' }}>
        <div>
          <label
            htmlFor="aggregate"
            style={{
              fontWeight: "bold",
              color: "#282c34",
              marginBottom: "5px",
              display: "block",
            }}
          >
            Aggregate:
          </label>
          <select
            name="aggregate"
            value={aggregate}
            onChange={(e) => setAggregate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              color: "#282c34",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              width: "100%",
              maxWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#e6e6e6";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f9f9f9";
            }}
          >
            <option value="sum">Sum</option>
            <option value="count">Count</option>
            <option value="avg">Average</option>
            <option value="max">Max</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="dimension"
            style={{
              fontWeight: "bold",
              color: "#282c34",
              marginBottom: "5px",
              display: "block",
            }}
          >
            Dimension:
          </label>
          <select
            name="dimension"
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              color: "#282c34",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              width: "100%",
              maxWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#e6e6e6";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f9f9f9";
            }}
          >
            <option value="source">Source</option>
            <option value="topic">Topic</option>
            <option value="pestle">Pestle</option>
            <option value="sector">Sector</option>
          </select>
        </div>
        {aggregate !== 'count' && (
          <div>
            <label
              htmlFor="measure"
              style={{
                fontWeight: "bold",
                color: "#282c34",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Measure:
            </label>
            <select
              name="measure"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                color: "#282c34",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                width: "100%",
                maxWidth: "150px",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#e6e6e6";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f9f9f9";
              }}
            >
              <option value="intensity">Intensity</option>
              <option value="likelihood">Likelihood</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        )}
      </form>
    </div>
  );
}

export default BarChart;
