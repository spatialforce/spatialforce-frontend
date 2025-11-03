import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';


const DataHeatmap = ({ data, dataType, radius, maxZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || !map) return;

    const heatData = data
      .filter(item => item.countryInfo.lat && item.countryInfo.long)
      .map(item => {
        const value = item[dataType] || 0;
        const normalizedValue = Math.log(value + 1) / Math.log(1000000);
        return [item.countryInfo.lat, item.countryInfo.long, Math.min(normalizedValue * 10, 1)];
      });

    const heatLayer = L.heatLayer(heatData, {
      radius: radius || 25,
      blur: 15,
      maxZoom: maxZoom || 7,
      gradient: {
        0.1: 'blue',
        0.3: 'cyan',
        0.5: 'lime',
        0.7: 'yellow',
        1: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, dataType, map, radius, maxZoom]);

  return null;
};

export default DataHeatmap;