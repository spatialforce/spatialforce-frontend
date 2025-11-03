import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './All.css'

const PredictiveModelVisualization = ({ data, historicalData }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || !map) return;

    // This is a simplified predictive model - in a real app you would use actual predictive algorithms
    const predictionLayer = L.layerGroup();

    data.forEach(country => {
      if (!country.countryInfo.lat || !country.countryInfo.long) return;

      const growthRate = calculateGrowthRate(country, historicalData);
      const predictedSpreadRadius = Math.sqrt(country.cases) * 100 * (1 + growthRate * 0.5);

      L.circle([country.countryInfo.lat, country.countryInfo.long], {
        radius: predictedSpreadRadius,
        color: '#ff7800',
        fillColor: '#ff7800',
        fillOpacity: 0.2,
        weight: 1,
        dashArray: '5,5'
      }).addTo(predictionLayer);

      L.circle([country.countryInfo.lat, country.countryInfo.long], {
        radius: predictedSpreadRadius * 1.5,
        color: '#ff7800',
        fillColor: '#ff7800',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '5,5'
      }).addTo(predictionLayer);
    });

    predictionLayer.addTo(map);

    return () => {
      map.removeLayer(predictionLayer);
    };
  }, [data, historicalData, map]);

  const calculateGrowthRate = (country, historicalData) => {
    if (!historicalData) return 0.1; // Default growth rate
    
    const countryHistory = historicalData.find(h => h.country === country.country);
    if (!countryHistory) return 0.1;

    const timeline = countryHistory.timeline.cases;
    const dates = Object.keys(timeline).sort();
    if (dates.length < 2) return 0.1;

    const lastWeekDates = dates.slice(-14);
    const cases = lastWeekDates.map(date => timeline[date]);
    
    // Simple linear regression for growth rate
    const sumX = cases.length * (cases.length - 1) / 2;
    const sumY = cases.reduce((a, b) => a + b, 0);
    const sumXY = cases.reduce((a, b, i) => a + b * i, 0);
    const sumX2 = cases.reduce((a, b, i) => a + i * i, 0);
    
    const slope = (cases.length * sumXY - sumX * sumY) / (cases.length * sumX2 - sumX * sumX);
    const growthRate = slope / cases[cases.length - 1];

    return Math.min(Math.max(growthRate, 0), 0.5); // Cap between 0% and 50%
  };

  return null;
};

export default PredictiveModelVisualization;