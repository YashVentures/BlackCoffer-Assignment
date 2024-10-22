import { useState, useEffect } from 'react';
import Card from './Card';
import Barchart from './Barchart';
import WorldMap from './WorldMap';
import Density from './Density';
import Word from './Word';
import LineChart from './LineChart';

function Source({ filters, items, aggregate, dimension, measure }) {
  let data = items;
  const [dItems, setItems] = useState(items);

  useEffect(() => {
    setItems(items);
  }, [items.length]);

  useEffect(() => {
    let result = [];
    if (filters.reset === true) {
      setItems(data);
      return;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (key === 'start_year') {
          if (result.length > 0) {
            result = result.filter(d => Number(d[key]) >= Number(filters[key]));
          } else {
            result = data.filter(d => Number(d[key]) >= Number(filters[key]));
          }
        } else if (key === 'end_year') {
          if (result.length > 0) {
            result = result.filter(d => Number(d.end_year) <= Number(filters.end_year));
          } else {
            result = data.filter(d => Number(d.end_year) <= Number(filters.end_year));
          }
        }
      } else {
        if (value && value.length > 0) {
          if (result.length > 0) {
            result = result.filter(d => value.includes(d[key]));
          } else {
            result = data.filter(d => value.includes(d[key]));
          }
        }
      }
    });

    console.log(result.length);
    setItems(result);
  }, [filters]);

  return (
    <div className="grid-layout main">
      <Card dimension="topic" icon="far fa-lightbulb" color="#b93c32" data={dItems} name="card1" />
      <Card dimension="source" icon="far fa-newspaper" color="#f03f37" data={dItems} name="card2" />
      <Card dimension="region" icon="fas fa-globe-asia" color="#45a54a" data={dItems} name="card3" />
      <Card dimension="country" icon="fas fa-flag-usa" color="#fd8f23" data={dItems} name="card4" />
      <Card dimension="sector" icon="fas fa-industry" color="#464458" data={dItems} name="card5" />
      <WorldMap data={dItems} name="map" />
      <Density data={dItems} name="density" />
      <Barchart data={dItems} aggregate={aggregate} dimension={dimension} measure={measure} name="compare" />
      <Word data={dItems} name="word" />
      <LineChart data={dItems} name="evolution" />
    </div>
  );
}

export default Source;
