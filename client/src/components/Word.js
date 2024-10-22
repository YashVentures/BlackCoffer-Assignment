import React, { useRef, useEffect } from "react";
import {rollup,select} from 'd3'
import {useResizeObserver} from '../utils/customHooks'
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

function Word({ data,name }) {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);
  let dataCountByTopic = rollup(data, v => v.length, d => d['topic']);
  let wordCloudData = Array.from(dataCountByTopic, ([topic,count]) => ({
    text: topic,
    value: count
  }));
  
  useEffect(() => {
    const div = select(wrapperRef.current);
  
    if (!dimensions) return; 
    div.select('svg')
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    

  }, [dimensions]);

  return (
    <div ref={wrapperRef} style={{gridArea: name}}>
        <WordCloud
        data={wordCloudData}        
        width={100}
        height={40}
        />
    </div>
  );
}

export default Word;