import React, { useEffect, useRef, useState } from 'react';
import './Healthmap.css';
import L, { LatLng, Marker, MarkerOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faLocationArrow,
  faTimes,
  faDiamondTurnRight,
  faCheck,
  faMoon, 
  faSun, 
  faLayerGroup, 
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';


declare module 'leaflet' {
  interface MarkerOptions {
    type?: 'hospital' | 'clinic';
  }
}

// Create mobile-specific icon sizes
const createMobileIcon = (iconUrl) => L.icon({
  iconUrl,
  iconSize: [30, 48],    // Smaller for mobile
  iconAnchor: [15, 48],  // Adjusted anchor
  popupAnchor: [0, -40]  // Higher popup
});

const greenIconMobile = createMobileIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png');
const redIconMobile = createMobileIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png');
const yellowIconMobile = createMobileIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png');

const DefaultIcon = L.icon({
  iconUrl: '/leaflet-images/marker-icon.png',
  iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
  shadowUrl: '/leaflet-images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const yellowIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type LocationData = {
  name: string;
  latitude: number;
  longitude: number;
  type: 'hospital' | 'clinic';
  marker: Marker;
};

const HealthMap = () => {
  const center = new LatLng(-20.10082688303694, 28.548323728894705);
  const [hospitals, setHospitals] = useState<any>(null);
  const [clinics, setClinics] = useState<any>(null);
  const [wards, setWards] = useState<any>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<Marker[]>([]);
  const [ghostText, setGhostText] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  const wardLayersRef = useRef<{ [key: string]: { layer: L.Layer, originalStyle: L.PathOptions } }>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [autoCompleteHint, setAutoCompleteHint] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedMarker, setHighlightedMarker] = useState<Marker | null>(null);
  const userPositionMarkerRef = useRef<Marker | null>(null);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileUIState, setMobileUIState] = useState<'default' | 'selecting' | 'routing'>('default');
  const [selectedStartPoint, setSelectedStartPoint] = useState<LatLng | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showLayerControls, setShowLayerControls] = useState(false);
  const [hospitalLayer, setHospitalLayer] = useState<L.LayerGroup | null>(null);
  const [clinicLayer, setClinicLayer] = useState<L.LayerGroup | null>(null);
  const [wardLayer, setWardLayer] = useState<L.LayerGroup | null>(null);
  const [activePanel, setActivePanel] = useState<'search' | 'layers' | 'info' | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    hospitals: true,
    clinics: true,
    wards: true
  });
  const [baseMap, setBaseMap] = useState<string>('osm');
  const baseLayersRef = useRef<{[key: string]: L.TileLayer}>({}); 
  const baseMaps = {
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      crossOrigin: true,
      referrerPolicy: 'no-referrer-when-downgrade',
      subdomains: 'abc'  // For load balancing
    }),
    
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      crossOrigin: true,
      detectRetina: true  // For high-DPI displays
    }),
    
    'Topographic': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      crossOrigin: true,
      subdomains: 'abc'
    }),
    
    'Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      crossOrigin: true,
      detectRetina: true
    })
  };

  const safeMapAccess = (callback: (map: L.Map) => void) => {
    if (mapRef.current) {
      callback(mapRef.current);
    }
  };
  
const toggleSearch = () => {
  setActivePanel(activePanel === 'search' ? null : 'search');
};

const toggleLayers = () => {
  setActivePanel(activePanel === 'layers' ? null : 'layers');
};

const toggleInfo = () => {
  setActivePanel(activePanel === 'info' ? null : 'info');
};

const toggleMarkerSelection = (marker: Marker) => {
  const markerLatLng = marker.getLatLng();
  
  if (selectedMarkers.length === 0) {
    setSelectedStartPoint(markerLatLng);
    setSelectedMarkers([marker]);
    marker.setIcon(isMobile ? redIconMobile : redIcon); // Updated here
    setMobileUIState('routing');
  } else if (selectedMarkers.length === 1) {
    setSelectedMarkers(prev => [...prev, marker]);
    marker.setIcon(isMobile ? redIconMobile : redIcon); // Updated here
    handleDirections();
  }
};

  const handleDirections = () => {
    if (selectedMarkers.length !== 2) return;
    
    if (routingControlRef.current) {
      safeMapAccess(map => map.removeControl(routingControlRef.current!));
    }

    try {
      const waypoints = [
        selectedStartPoint || userPosition || selectedMarkers[0].getLatLng(),
        selectedMarkers[1].getLatLng()
      ];
      const routingControl = L.Routing.control({
        waypoints: [
          selectedStartPoint || userPosition || selectedMarkers[0].getLatLng(),
          selectedMarkers[1].getLatLng()
        ],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#3388ff', opacity: 0.7, weight: 5 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        router: L.Routing.osrmv1({
          serviceUrl: '/osrm/route/v1'
        })
      }).addTo(mapRef.current!);

      routingControlRef.current.on('routesfound', (e) => {
        const bounds = L.latLngBounds(e.routes[0].coordinates.map(
          (coord: any) => L.latLng(coord.lat, coord.lng)
        
        ));
        safeMapAccess(map => map.fitBounds(bounds.pad(0.5)));
      });

    } catch (error) {
      console.error('Routing error:', error);
      alert('Could not calculate route. Please try again.');
    } finally {
      setMobileUIState('default');
    }
  };
  // Add this to your map initialization
const addTileErrorHandling = (layer: L.TileLayer) => {
  layer.on('tileerror', (error) => {
    console.error('Tile loading error:', error);
  });
};


Object.values(baseLayersRef.current).forEach(addTileErrorHandling);

  const handleMobileControl = (action: string) => {
    switch(action) {
      case 'search':
        setShowSearch(!showSearch);
        break;
      case 'myLocation':
        if (userPosition) {
          safeMapAccess(map => map.setView(userPosition, 15));
        } else {
          alert('Please enable location services to center on your position.');
        }
        break;
      case 'startRoute':
        setMobileUIState('selecting');
        handleDeselect();
        break;
      case 'cancel':
        handleDeselect();
        setMobileUIState('default');
        break;
      default:
        break;
    }
  };

  const handleDeselect = () => {
    selectedMarkers.forEach(marker => {
      const originalIcon = marker.options.type === 'hospital' ? greenIcon : yellowIcon;
      marker.setIcon(originalIcon);
    });
    setSelectedMarkers([]);
    setSelectedStartPoint(null);
    if (routingControlRef.current) {
      safeMapAccess(map => map.removeControl(routingControlRef.current!));
      routingControlRef.current = null;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    
    const locationNames = locations.map(loc => loc.name.toLowerCase());
    const wardNames = Object.keys(wardLayersRef.current);
    const allOptions = [...locationNames, ...wardNames];
    
    const match = allOptions.find(option => 
      option.toLowerCase().startsWith(value.toLowerCase()) && 
      option.toLowerCase() !== value.toLowerCase()
    );
    
    setAutoCompleteHint(match || '');
  };
  

  const handleSearch = () => {
    if (!searchInputRef.current || !mapRef.current) return;
  
    const searchTerm = searchInputRef.current.value.trim().toLowerCase();
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }
  
    // Reset any previously highlighted marker
    if (highlightedMarker) {
      const iconElement = highlightedMarker.getElement()?.querySelector('img');
      if (iconElement) {
        iconElement.classList.remove('bouncing-marker');
      }
    }
  
    // Search in locations
    const foundLocation = locations.find(loc => 
      loc.name.toLowerCase().includes(searchTerm)
    );
  
    if (foundLocation) {
      const marker = foundLocation.marker;
      setHighlightedMarker(marker);
    
      const bouncingIcon = L.divIcon({
        className: 'bouncing-marker-wrapper',
        html: '<div class="bouncing-marker-inner"></div>',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -55]
      });
    
      const originalIcon = marker.getIcon(); 
      marker.setIcon(bouncingIcon);          
      marker.openPopup();                    
    
      safeMapAccess(map => {
        map.flyTo([foundLocation.latitude, foundLocation.longitude], 15, {
          duration: 1
        });
      });
    
      // Auto-close popup after 4 seconds
      setTimeout(() => {
        marker.closePopup();
        marker.setIcon(originalIcon); // Restore normal icon
      }, 4000);
    
      return;
    }
    

  

    const matchedKey = Object.keys(wardLayersRef.current).find(key =>
      key.includes(searchTerm)
    );
  
    if (matchedKey && wardLayersRef.current[matchedKey]) {
      const { layer, originalStyle } = wardLayersRef.current[matchedKey];
      
      if (layer instanceof L.Path) {
        layer.setStyle({
          weight: 3,
          color: '#FFD700',
          fillColor: '#FFD700',
          fillOpacity: 0.3
        });
        
        setTimeout(() => layer.setStyle(originalStyle), 5000);
      }
      
      const bounds = (layer as any).getBounds?.();
      if (bounds) {
        safeMapAccess(map => map.flyToBounds(bounds, {
          padding: [50, 50], // Add some padding
          duration: 1 // Animation duration in seconds
        }));
      }
      return;
    }
  
    alert('Location not found');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (autoCompleteHint && searchValue && autoCompleteHint !== searchValue) {
        // Use the full autoCompleteHint instead of just appending
        setSearchValue(autoCompleteHint);
        handleSearch();
      } else {
        handleSearch();
      }
    }
  };

 
  useEffect(() => {
    const loadData = async () => {
      try {
        const [h, c, w] = await Promise.all([
          fetch('/data/hospitals.json').then(res => res.json()),
          fetch('/data/Clinics.json').then(res => res.json()),
          fetch('/data/bulawayo_wards.json').then(res => res.json())
        ]);
        setHospitals(h);
        setClinics(c);
        setWards(w);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !hospitals || !clinics || !wards) return;
  
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      touchZoom: true,  // Enable touch gestures
      tapTolerance: 15,        // Enable tap support
      dragging: true    // Enable dragging
    }).setView(center, isMobile ? 10.7 : 11.3);

    mapRef.current = map;
    Object.entries(baseMaps).forEach(([name, layer]) => {
      baseLayersRef.current[name] = layer;
      if (name.toLowerCase() === baseMap) {
        layer.addTo(map);
      }
    });
    if (isMobile) {
      map.doubleClickZoom.disable(); 
    }
     

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 10,
      attribution: ''
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ position: 'bottomright' }).addTo(map);

    L.Marker.prototype.options.icon = DefaultIcon;

    const wardStyle: L.PathOptions = {
      color: "#ee2400",
      weight: 2,
      opacity: 1,
      fillColor: "#ADD8E6",
      fillOpacity: 0.1
    };

    const hLayer = L.geoJSON(hospitals, {
      pointToLayer: (feature, latlng) => {
        const coords = feature.geometry.coordinates;
        const marker = L.marker([coords[1], coords[0]], {
          icon: greenIcon,
          type: 'hospital'
        }).bindPopup(feature.properties?.Name || 'Hospital');
        
        setLocations(prev => [...prev, {
          name: feature.properties?.Name || 'Hospital',
          latitude: coords[1],
          longitude: coords[0],
          type: 'hospital',
          marker
        }]);
        
        return marker;
      }
    });
    setHospitalLayer(hLayer);
    if (activeLayers.hospitals) hLayer.addTo(map);
    
    const cLayer = L.geoJSON(clinics, {
      pointToLayer: (feature, latlng) => {
        const coords = feature.geometry.coordinates;
        const marker = L.marker([coords[1], coords[0]], {
          icon: yellowIcon,
          type: 'clinic'
        }).bindPopup(feature.properties?.Name || 'Clinic');
        
        setLocations(prev => [...prev, {
          name: feature.properties?.Name || 'Clinic',
          latitude: coords[1],
          longitude: coords[0],
          type: 'clinic',
          marker
        }]);
        
        return marker;
      }
    });
    setClinicLayer(cLayer);
    if (activeLayers.clinics) cLayer.addTo(map);
    
    const wLayer = L.geoJSON(wards, {
      style: wardStyle,
      coordsToLatLng: (coords) => L.latLng(coords[1], coords[0]),
      onEachFeature: (feature, layer) => {
        const wardName = feature.properties?.admin3Name?.toLowerCase();
        if (wardName) {
          wardLayersRef.current[wardName] = {
            layer: layer,
            originalStyle: {...wardStyle}
          };
        }

        layer.bindPopup(`Ward: ${feature.properties?.admin3Name}`);
        
        layer.on('mouseover', function (e) {
          const pathLayer = e.target as L.Path;
          pathLayer.setStyle({
            weight: 2,
            color: '#3e6a40',
            fillColor: ' #7A7C58',
            fillOpacity: 0.3
          });
        });

        layer.on('mouseout', function (e) {
          const pathLayer = e.target as L.Path;
          if (wardName) {
            pathLayer.setStyle(wardLayersRef.current[wardName].originalStyle);
          }
        });
      }
    });
    setWardLayer(wLayer);
    if (activeLayers.wards) wLayer.addTo(map);

    return () => {
      if (mapRef.current) {
        if (hospitalLayer) mapRef.current.removeLayer(hospitalLayer);
        if (clinicLayer) mapRef.current.removeLayer(clinicLayer);
        if (wardLayer) mapRef.current.removeLayer(wardLayer);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hospitals, clinics, wards]);
  const handleBaseMapChange = (mapName: string) => {
    setBaseMap(mapName);
    safeMapAccess(map => {
      // Remove all base layers
      Object.values(baseLayersRef.current).forEach(layer => {
        map.removeLayer(layer);
      });
      // Add selected base layer
      baseLayersRef.current[mapName].addTo(map);
    });
  }



  useEffect(() => {
    if (!mapRef.current) return;

    safeMapAccess(map => {
      if (hospitalLayer) {
        if (activeLayers.hospitals) {
          map.addLayer(hospitalLayer);
        } else {
          map.removeLayer(hospitalLayer);
        }
      }

      if (clinicLayer) {
        if (activeLayers.clinics) {
          map.addLayer(clinicLayer);
        } else {
          map.removeLayer(clinicLayer);
        }
      }

      if (wardLayer) {
        if (activeLayers.wards) {
          map.addLayer(wardLayer);
        } else {
          map.removeLayer(wardLayer);
        }
      }
    });
  }, [activeLayers, hospitalLayer, clinicLayer, wardLayer]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLatLng = L.latLng(
          position.coords.latitude,
          position.coords.longitude
        );
        setUserPosition(userLatLng);
        
        if (!userPositionMarkerRef.current) {
          userPositionMarkerRef.current = L.marker(userLatLng, {
            icon: L.divIcon({
              className: 'user-position-marker',
              html: '<div class="user-position-pulse"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapRef.current!);
        } else {
          userPositionMarkerRef.current.setLatLng(userLatLng);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, [mapRef.current]);
  return (
    <div className="health-map-container">
      <div id="map" ref={mapContainerRef}></div>
      
      {/* Theme toggle button */}
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="sm" />
      </button>
  
      {/* Improved Layer Controls */}
      <div className="layer-controls-container">
        <button 
          className="layer-toggle-button"
          onClick={() => setShowLayerControls(!showLayerControls)}
          aria-label="Layer controls"
        >
          <FontAwesomeIcon icon={faLayerGroup} size="sm" />
        </button>
        
        <div className={`layer-panel ${showLayerControls ? 'visible' : ''}`}>
          <div className="panel-header">
            <h3>Map Layers</h3>
            <button 
              className="close-panel"
              onClick={() => setShowLayerControls(false)}
              aria-label="Close panel"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="panel-content">
            <div className="layer-section">
              <h4>Base Map</h4>
              <div className="compact-base-map-options">
                {Object.keys(baseMaps).map(name => (
                  <button
                    key={name}
                    className={`compact-base-map-option ${baseMap === name ? 'active' : ''}`}
                    onClick={() => handleBaseMapChange(name)}
                    title={name}
                  >
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="layer-section">
              <h4>Overlays</h4>
              <div className="compact-layer-options">
                <label className="compact-layer-option">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.hospitals}
                    onChange={(e) => setActiveLayers({...activeLayers, hospitals: e.target.checked})}
                  />
                  <span className="layer-color hospital-color"></span>
                  <span>Hospitals</span>
                </label>
                <label className="compact-layer-option">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.clinics}
                    onChange={(e) => setActiveLayers({...activeLayers, clinics: e.target.checked})}
                  />
                  <span className="layer-color clinic-color"></span>
                  <span>Clinics</span>
                </label>
                <label className="compact-layer-option">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.wards}
                    onChange={(e) => setActiveLayers({...activeLayers, wards: e.target.checked})}
                  />
                  <span className="layer-color ward-color"></span>
                  <span>Wards</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Info button */}
      <button className="info-button">
        <FontAwesomeIcon icon={faInfoCircle} />
        <span className="tooltip">About this map</span>
      </button>
  
      {isMobile && (
  <>
    {/* Mobile Controls */}
    <div className="mobile-controls">
      {/* Search Toggle Button */}
      <button 
        className={`mobile-control-button ${activePanel === 'search' ? 'active' : ''}`}
        onClick={toggleSearch}
        aria-label="Search"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>

   
      <button 
        className="mobile-control-button"
        onClick={() => {
          setActivePanel(null);
          if (userPosition) {
            safeMapAccess(map => map.setView(userPosition, 15));
          } else {
            alert('Please enable location services');
          }
        }}
        aria-label="My Location"
      >
        <FontAwesomeIcon icon={faLocationArrow} />
      </button>

      {/* Route/Cancel Button */}
      {mobileUIState === 'default' ? (
        <button 
          className="mobile-control-button"
          onClick={() => {
            setActivePanel(null);
            setMobileUIState('selecting');
            handleDeselect();
          }}
          aria-label="Start Route"
        >
          <FontAwesomeIcon icon={faDiamondTurnRight} />
        </button>
      ) : (
        <button 
          className="mobile-control-button cancel-button"
          onClick={() => {
            setMobileUIState('default');
            handleDeselect();
          }}
          aria-label="Cancel"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
    {activePanel === 'layers' && (
  <div className="mobile-layer-panel">
    <div className="panel-header">
      <h3>Map Layers</h3>
      <button 
        className="close-panel"
        onClick={() => setActivePanel(null)}
        aria-label="Close panel"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
    <div className="panel-content">
      <div className="layer-section">
        <h4>Base Map</h4>
        <div className="compact-base-map-options">
          {Object.keys(baseMaps).map(name => (
            <button
              key={name}
              className={`compact-base-map-option ${baseMap === name ? 'active' : ''}`}
              onClick={() => handleBaseMapChange(name)}
              title={name}
            >
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="layer-section">
        <h4>Overlays</h4>
        <div className="compact-layer-options">
          <label className="compact-layer-option">
            <input 
              type="checkbox" 
              checked={activeLayers.hospitals}
              onChange={(e) => setActiveLayers({...activeLayers, hospitals: e.target.checked})}
            />
            <span className="layer-color hospital-color"></span>
            <span>Hospitals</span>
          </label>
          <label className="compact-layer-option">
            <input 
              type="checkbox" 
              checked={activeLayers.clinics}
              onChange={(e) => setActiveLayers({...activeLayers, clinics: e.target.checked})}
            />
            <span className="layer-color clinic-color"></span>
            <span>Clinics</span>
          </label>
          <label className="compact-layer-option">
            <input 
              type="checkbox" 
              checked={activeLayers.wards}
              onChange={(e) => setActiveLayers({...activeLayers, wards: e.target.checked})}
            />
            <span className="layer-color ward-color"></span>
            <span>Wards</span>
          </label>
        </div>
      </div>
    </div>
  </div>
)}
{activePanel === 'search' && (
  <div className="mobile-search-container">
    <div className="autocomplete-wrapper">
      <input
        type="text"
        ref={searchInputRef}
        placeholder="Search health facilities..."
        value={searchValue}
        onChange={(e) => {
          const value = e.target.value;
          setSearchValue(value);
          
          const locationNames = locations.map(loc => loc.name);
          const wardNames = Object.keys(wardLayersRef.current);
          const allOptions = [...locationNames, ...wardNames];
          
          const match = allOptions.find(option => 
            option.toLowerCase().startsWith(value.toLowerCase()) && 
            option.toLowerCase() !== value.toLowerCase()
          );
          
          setAutoCompleteHint(match || '');
        }}
        className="autocomplete-input"
      />
      
      {searchValue && autoCompleteHint && (
        <div 
          className="ghost-text"
          onClick={() => {
            setSearchValue(autoCompleteHint);
            handleSearch();
          }}
        >
          <span className="ghost-matched">{searchValue}</span>
          <span className="ghost-suggestion">
            {autoCompleteHint.slice(searchValue.length)}
          </span>
        </div>
      )}
    </div>
    <button 
      className="search-confirm-button"
      onClick={() => {
        if (autoCompleteHint) {
          setSearchValue(autoCompleteHint);
        }
        handleSearch();
      }}
      aria-label="Search"
    >
      <FontAwesomeIcon icon={faSearch} />
    </button>
  </div>
)}
  
   

    {/* Route Status Notifications */}
    {mobileUIState === 'selecting' && activePanel === null && (
      <div className="mobile-notification">
        Select a health facility to start your route
      </div>
    )}

    {mobileUIState === 'routing' && activePanel === null && (
      <div className="mobile-notification">
        Now select your destination
      </div>
    )}
  </>
)}
  
    
      {!isMobile && (
        <div className="desktop-controls">
          <div className="search-container">
            <div className="autocomplete-wrapper">
            <input
    type="text"
    ref={searchInputRef}
    placeholder="Search health facilities..."
    value={searchValue}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
    className="autocomplete-input"
  />
              {autoCompleteHint && searchValue && (
                <div className="ghost-text">
                  <span className="ghost-matched">{searchValue}</span>
                  <span className="ghost-suggestion">
                    {autoCompleteHint.slice(searchValue.length)}
                  </span>
                </div>
              )}
            </div>
            <button 
              className="search-button"
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
  
          <div className="control-buttons">
            <button 
              className="control-button"
              onClick={() => {
                if (userPosition) {
                  safeMapAccess(map => map.setView(userPosition, 15));
                } else {
                  alert('Please enable location services');
                }
              }}
            >
              <FontAwesomeIcon icon={faLocationArrow} />
              <span>My Location</span>
            </button>
  
            <button 
              className="control-button route-button"
              onClick={() => {
                setMobileUIState('selecting');
                alert('Select two health facilities to route between them');
              }}
            >
              <FontAwesomeIcon icon={faDiamondTurnRight} />
              <span>Get Directions</span>
            </button>
  
            <button 
              className="control-button cancel-button"
              onClick={handleDeselect}
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Clear Route</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMap;