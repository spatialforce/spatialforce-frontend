import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../Covid19 webmap/All.css'

const VirusParticleLayer = ({ active, density }) => {
  const map = useMap();

  useEffect(() => {
    if (!active || !map) return;

    const particles = [];
    const particleCount = density || 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = L.divIcon({
        html: `<div class="floating-particle"></div>`,
        className: 'virus-particle-layer',
        iconSize: [8, 8]
      });

      // Random position within visible map bounds
      const bounds = map.getBounds();
      const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
      const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());

      const marker = L.marker([lat, lng], {
        icon: particle,
        zIndexOffset: -1000
      }).addTo(map);

      particles.push(marker);

      // Animate particle
      animateParticle(marker, map);
    }

    return () => {
      particles.forEach(particle => map.removeLayer(particle));
    };
  }, [active, density, map]);

  const animateParticle = (marker, map) => {
    const duration = 15000 + Math.random() * 10000;
    const startTime = Date.now();
    const startLatLng = marker.getLatLng();
    const endLat = startLatLng.lat + (Math.random() * 2 - 1) * 5;
    const endLng = startLatLng.lng + (Math.random() * 2 - 1) * 10;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        const lat = startLatLng.lat + (endLat - startLatLng.lat) * progress;
        const lng = startLatLng.lng + (endLng - startLatLng.lng) * progress;
        marker.setLatLng([lat, lng]);
        requestAnimationFrame(animate);
      } else {
        // Reset particle to new random position
        const bounds = map.getBounds();
        const newLat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
        const newLng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
        marker.setLatLng([newLat, newLng]);
        animateParticle(marker, map);
      }
    };

    requestAnimationFrame(animate);
  };

  return null;
};

export default VirusParticleLayer;