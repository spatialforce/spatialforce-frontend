import React, { useState, useEffect, useRef, useCallback } from 'react';

import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './covid19map.css';
import TimeSlider from './Covid19 webmap/TimeSlider';
import DataHeatmap from './Covid19 webmap/DataHeatmap';
import VirusParticleLayer from './Covid19 webmap/VirusParticleLayer';
import CountryComparisonTool from './Covid19 webmap/CountryComparisonTool';
import PredictiveModelVisualization from './Covid19 webmap/PredictiveModelVisualization';
import { FaInfoCircle, FaGlobe, FaDatabase, FaCode } from 'react-icons/fa';

import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  useMap, 
  GeoJSON,
  LayersControl  // Add this import
} from 'react-leaflet';

const COUNTRY_NAME_MAP: Record<string, string> = {
    "United States of America": "United States",
    "United States": "United States",
    "US": "United States",
    "United Kingdom": "United Kingdom",
    "Great Britain": "United Kingdom",
    "Czech Republic": "Czechia",
    // Keep only the most common mappings
    // Remove reverse mappings
  };
  
 

interface CountryCovidData {
  country: string;
  countryInfo: {
    _id: number;
    lat: number;
    long: number;
    flag: string;
    iso2: string;
    iso3: string;
  };
  cases: number;
  deaths: number;
  recovered: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  updated: number;
}

interface HistoricalData {
  [date: string]: number;
}

interface CountryHistoricalData {
  country: string;
  province: string[] | null;
  timeline: {
    cases: HistoricalData;
    deaths: HistoricalData;
    recovered: HistoricalData;
  };
}

interface CountryFeatureProperties {
    iso_a2: string;  // Add this
    name: string;
    [key: string]: any;
  }
  
  interface CountryFeature extends GeoJSON.Feature {
    properties: CountryFeatureProperties;
    id?: string | number;
  }
  
  interface CountryGeoJSON extends GeoJSON.FeatureCollection {
    features: CountryFeature[];
  }

  
   // Enhanced normalization function
   const normalizeCountryName = (name: string): string => {
    // Handle undefined/null cases
    if (!name) return '';
    
    // Remove common prefixes/suffixes and trim
    const cleaned = name
      .replace(/^the\s+/i, '')
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/\s*\{.*?\}\s*/g, '')
      .replace(/\s*\[.*?\]\s*/g, '')
      .replace(/[.,]/g, '')
      .trim();
    
    // Return mapped name or original cleaned name
    return COUNTRY_NAME_MAP[cleaned] || COUNTRY_NAME_MAP[name] || cleaned || name;
  };

  

  
const matchCountryName = (covidCountry: string, geoJsonName: string) => {
    // Handle common mismatches (e.g., "United States" vs "USA")
    const nameMap: Record<string, string> = {
      "USA": "United States",
      "UK": "United Kingdom",
      // Add other common mismatches
    };
    return nameMap[covidCountry] === geoJsonName || covidCountry === geoJsonName;
  };
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
  iconUrl: '/leaflet-images/marker-icon.png',
  shadowUrl: '/leaflet-images/marker-shadow.png',
});


const createVirusIcon = (size: number) => {
  return L.divIcon({
    html: `
      <div class="virus-marker" style="width: ${size}px; height: ${size}px;">
        <div class="virus-core"></div>
        ${Array.from({ length: 8 }).map((_, i) => 
          `<div class="virus-spike" style="transform: rotate(${i * 45}deg)"></div>`
        ).join('')}
      </div>
    `,
    className: 'virus-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};


const PulseCircle = ({ center, size, color }: { center: [number, number], size: number, color: string }) => {
  const map = useMap();
  const circleRef = useRef<L.Circle>(null);
  const [radius, setRadius] = useState(size * 0.5);
  const [opacity, setOpacity] = useState(0.7);


  useEffect(() => {
    const interval = setInterval(() => {
      setRadius(prev => {
        const newRadius = prev >= size * 1.5 ? size * 0.5 : prev + size * 0.05;
        setOpacity(0.7 - (newRadius - size * 0.5) / (size * 1.0) * 0.7);
        return newRadius;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [size]);

  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 2
      }}
      ref={circleRef}
    />
  );
};

const MapControls = ({ onTimeChange, onDataTypeChange }: { 
  onTimeChange: (date: string) => void,
  onDataTypeChange: (type: string) => void 
}) => {
  const [currentDate, setCurrentDate] = useState<string>('2023-01-01');
  const [dataType, setDataType] = useState<string>('cases');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
    onTimeChange(e.target.value);
  };

  const handleDataTypeChange = (type: string) => {
    setDataType(type);
    onDataTypeChange(type);
  };

  return (
    <div className="map-controls">
      <div className="control-panel">
        <h3>COVID-19 Data Explorer</h3>
        <div className="control-group">
          
        </div>
        <div className="control-group">
          <label>Data Type:</label>
          <div className="data-type-buttons">
            <button 
              className={dataType === 'cases' ? 'active' : ''}
              onClick={() => handleDataTypeChange('cases')}
            >
              Cases
            </button>
            <button 
              className={dataType === 'deaths' ? 'active' : ''}
              onClick={() => handleDataTypeChange('deaths')}
            >
              Deaths
            </button>
            <button 
              className={dataType === 'recovered' ? 'active' : ''}
              onClick={() => handleDataTypeChange('recovered')}
            >
              Recovered
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CovidMap = () => {
  const [covidData, setCovidData] = useState<CountryCovidData[]>([]);
  const [historicalData, setHistoricalData] = useState<CountryHistoricalData[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dataType, setDataType] = useState<string>('cases');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [showPredictiveModel, setShowPredictiveModel] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [mobileInfoVisible, setMobileInfoVisible] = useState(false);
  const [showMobileInfoPage, setShowMobileInfoPage] = useState(false);
  const ZIMBABWE_CENTER: [number, number] = [-19.0354, 29.1549];
  const ZIMBABWE_MOBILE_CENTER: [number, number] = [-18.10, 29.1549]
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const getZimbabweCenter = () => {
    return window.innerWidth <= 767 ? ZIMBABWE_MOBILE_CENTER : ZIMBABWE_CENTER;
  };
  const [isOpen, setIsOpen] = useState(false);
  const ZIMBABWE_ZOOM = 6;
  const [zimPopupOpen, setZimPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)
  const [fabOpen, setFabOpen] = useState(false);
  const zimbabweData = React.useMemo(() => {
    return covidData.find(country => normalizeCountryName(country.country) === 'Zimbabwe');
  }, [covidData]);
  const createMockFeature = (name: string, iso_a3?: string): GeoJSON.Feature => {
    return {
      type: "Feature",
      geometry: {
        type: "Point", 
        coordinates: [0, 0] 
      },
      properties: {
        name,
        iso_a3: iso_a3 || "",
      }
    };
  };

  const baseMaps = [
    {
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      crossOrigin: true,
      referrerPolicy: 'no-referrer-when-downgrade',
      subdomains: 'abc'
    },
    {
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      crossOrigin: true,
      detectRetina: true
    },
    {
      name: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      crossOrigin: true,
      subdomains: 'abc'
    },
    {
      name: "Dark",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      crossOrigin: true,
      detectRetina: true
    }
  ];

  const infoPanelRef = useRef<HTMLDivElement>(null);

  // Add click handler for the document
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (infoPanelRef.current && 
          !infoPanelRef.current.contains(e.target as Node) &&
          !(e.target as Element).closest('.info-panel-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // In your MapContainer component, add this useEffect hook:
useEffect(() => {
  if (mapRef.current) {
    // Force a reflow to ensure proper positioning
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  }
}, []);

// In your useEffect where you're trying to position the controls
useEffect(() => {
  if (mapRef.current) {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
      
      const controls = document.querySelector('.fixed-controls-container');
      if (controls) {
        const htmlElement = controls as HTMLElement;
        htmlElement.style.position = 'fixed';
        htmlElement.style.top = '20px';
        htmlElement.style.left = '20px';
        htmlElement.style.zIndex = '1000';
      }
    }, 100);
  }
}, []);

  useEffect(() => {
    if (!mapRef.current) return;
  
    // Clean up any existing layers control
    const existingControl = document.querySelector('.leaflet-control-layers');
    if (existingControl) {
      existingControl.remove();
    }
  
    // Force a small delay to ensure clean initialization
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
  
    return () => clearTimeout(timer);
  }, []);

 
  const CustomZoomControl = () => {
    const map = useMap();
  
    useEffect(() => {
      // Create a custom control
      const zoomControl = L.control.zoom({
        position: isMobile ? 'topleft' : 'topleft'
      }).addTo(map);
  
      // Cleanup function
      return () => {
        map.removeControl(zoomControl);
      };
    }, [map, isMobile]);
  
    return null;
  };
  const getMatchingCountry = (feature: GeoJSON.Feature, covidData: CountryCovidData[]) => {
    if (!feature.properties) return null;
    
    const props = feature.properties;
    // Try multiple possible name properties
    const possibleNames = [
      props.name, 
      props.NAME, 
      props.NAME_LONG, 
      props.ADMIN, 
      props.SOVEREIGNT,
      props.FORMAL_EN
    ].filter(Boolean);
    
    // Try to find direct match first
    for (const geoName of possibleNames) {
      const directMatch = covidData.find(c => 
        normalizeCountryName(c.country) === normalizeCountryName(geoName)
      );
      if (directMatch) return directMatch;
    }
    
    // Try ISO2 match
    if (props.iso_a2 || props.ISO_A2) {
      const iso2 = props.iso_a2 || props.ISO_A2;
      const iso2Match = covidData.find(c => c.countryInfo.iso2 === iso2);
      if (iso2Match) return iso2Match;
    }
    
    // Try ISO3 match
    if (props.iso_a3 || props.ISO_A3) {
      const iso3 = props.iso_a3 || props.ISO_A3;
      const iso3Match = covidData.find(c => c.countryInfo.iso3 === iso3);
      if (iso3Match) return iso3Match;
    }
    
    // Try to find by similar names
    for (const geoName of possibleNames) {
      const similarMatch = covidData.find(c => {
        const covidName = normalizeCountryName(c.country);
        const geoNormalized = normalizeCountryName(geoName);
        return (
          covidName.includes(geoNormalized) ||
          geoNormalized.includes(covidName) ||
          c.country.toLowerCase() === geoName.toLowerCase()
        );
      });
      if (similarMatch) return similarMatch;
    }
    return null;
  };
  useEffect(() => {
    if (!mapRef.current) return;
    
    const handleResize = () => {
      mapRef.current?.setView(getZimbabweCenter(), ZIMBABWE_ZOOM);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      // Force map to update controls when resizing
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !zimbabweData || zimPopupOpen || loading) return;
  
    const openZimbabwePopup = () => {
      mapRef.current?.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          const marker = layer as L.Marker;
          if (
            Math.abs(marker.getLatLng().lat - zimbabweData.countryInfo.lat) < 0.1 &&
            Math.abs(marker.getLatLng().lng - zimbabweData.countryInfo.long) < 0.1
          ) {
            marker.openPopup();
            setZimPopupOpen(true);
         
          }
        }
      });
    };
    const delays = [100, 300, 500, 1000, 2000];
    const timers = delays.map(delay => setTimeout(openZimbabwePopup, delay));
  
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [covidData, zimbabweData, zimPopupOpen, loading]);


useEffect(() => {
  if (showMobileInfoPage) {
    document.body.classList.add('mobile-info-open');
  } else {
    document.body.classList.remove('mobile-info-open');
  }
  
  return () => {
    document.body.classList.remove('mobile-info-open');
  };
}, [showMobileInfoPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const apiClient = axios.create({
          withCredentials: false, 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
  
        const [currentResponse, historicalResponse, geoJsonResponse] = await Promise.all([
          apiClient.get('https://disease.sh/v3/covid-19/countries'),
          apiClient.get('https://disease.sh/v3/covid-19/historical?lastdays=all'),
          apiClient.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        ]);
  
        setCovidData(currentResponse.data);
        setHistoricalData(historicalResponse.data);
        setGeoJsonData(geoJsonResponse.data);
      } catch (err) {
        setError('Failed to load COVID-19 data. Please try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleCountrySelect = useCallback((countryName: string) => {
    if (!comparisonMode) return;
    
    setSelectedCountries(prev => {
      // Check if we already have this country selected
      const normalizedPrev = prev.map(normalizeCountryName);
      const normalizedNew = normalizeCountryName(countryName);
      
      // Toggle selection
      if (normalizedPrev.includes(normalizedNew)) {
        return prev.filter(name => normalizeCountryName(name) !== normalizedNew);
      } else {
        // Limit selection to 4 countries max
        if (prev.length >= 4) {
          alert('Maximum of 4 countries can be compared at once');
          return prev;
        }
        return [...prev, countryName];
      }
    });
  }, [comparisonMode]);

  const getDataForDate = useCallback((date: string) => {
    return covidData;
  }, [covidData]);

  useEffect(() => {
    if (!geoJsonData || !covidData) return;
    geoJsonData.features.slice(0, 10).forEach(feature => {
      const countryData = getMatchingCountry(feature, covidData);
      const name = feature.properties?.name || feature.properties?.NAME || "Unknown";
    });
  }, [geoJsonData, covidData]);

  useEffect(() => {
    if (comparisonMode && selectedCountries.length > 0) {
      setShowComparison(true);
    } else {
      setShowComparison(false);
    }
  }, [selectedCountries, comparisonMode]);

  const calculateMarkerSize = (value: number, baseSize = 50) => {
    const maxSize = baseSize;
    const minSize = Math.floor(baseSize * 0.3); 
    const maxValue = Math.max(...covidData.map(c => c[dataType as keyof CountryCovidData] as number));
    const normalized = Math.log(value + 1) / Math.log(maxValue + 1);
    return minSize + normalized * (maxSize - minSize);
  };;


  const getColorForValue = (value: number) => {
    const maxValue = Math.max(...covidData.map(c => c[dataType as keyof CountryCovidData] as number));
    const ratio = value / maxValue;
    
    if (ratio < 0.33) return '#ffeda0';
    if (ratio < 0.66) return '#feb24c';
    return '#f03b20';
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="virus-animation">
          <div className="virus-particle"></div>
          <div className="virus-particle"></div>
          <div className="virus-particle"></div>
        </div>
        <p>Loading COVID-19 data visualization...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;

  }
  const InfoPanel = ({ 
    lastUpdated,
    mobileInfoVisible,
    setMobileInfoVisible 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
  
    // Close panel when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
  
    return (
      <>


{showMobileInfoPage && (
  <div className="mobile-info-page">
    <div className="mobile-info-header">
      <button 
        className="close-mobile-info"
        onClick={() => setShowMobileInfoPage(false)}
      >
        &times;
      </button>
      <h2>COVID-19 Data Explorer</h2>
    </div>
    
    <div className="mobile-info-content">
      <div className="info-section">
        <h3>Webmap Demonstration</h3>
        <p>
          This showcase highlights our advanced web mapping capabilities. 
          Note: Many countries have stopped regular COVID-19 reporting, 
          so data accuracy may vary. This demo focuses on technical 
          implementation rather than current health statistics.
        </p>
      </div>
      
      <div className="info-section">
        <h3>Features</h3>
        <div className="feature-card">
          <FaGlobe className="feature-icon" />
          <h4>Web Map</h4>
          <p>Explore global COVID-19 data with interactive visualization</p>
        </div>
        
        <div className="feature-card">
          <FaDatabase className="feature-icon" />
          <h4>Real-time Data</h4>
          <p>Updated statistics from reliable sources</p>
        </div>
        
        <div className="feature-card">
          <FaCode className="feature-icon" />
          <h4>Advanced Tech</h4>
          <p>Built with React and Leaflet mapping library</p>
        </div>
      </div>
      
      <div className="action-buttons">
        <a 
          href="/web-applications" 
          className="action-button primary"
        >
          Explore Our Mapping Solutions
        </a>
        <button 
          className="action-button secondary"
          onClick={() => setShowMobileInfoPage(false)}
        >
          Return to Map
        </button>
      </div>
    </div>
  </div>
)}
       
       <div 
      className={`info-panel ${isOpen ? 'open' : ''}`}
      ref={panelRef}
    >
      <button 
        className="info-panel-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaInfoCircle />
      </button>
      
      <div className="info-panel-content">
        <div className="info-section">
          <h4>Note !!</h4>
        </div>
        
        <div className="info-section">
          <h4>Webmap Demonstration</h4>
          <p>
            This showcase highlights our advanced web mapping capabilities. 
            Note: Many countries have stopped regular COVID-19 reporting, 
            so data accuracy may vary. This demo focuses on technical 
            implementation rather than current health statistics.
          </p>
          <a href="/web-applications" className="learn-more">
            Explore our mapping solutions →
          </a>
        </div>
      </div>
    </div>
  
    
        <button 
        className="mobile-info-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setShowMobileInfoPage(true);
        }}
      >
        <FaInfoCircle />
      </button>
     
      {mobileInfoVisible && (
        <div className="mobile-info-modal">
          <div className="mobile-info-content">
            <button 
              className="close-mobile-info"
              onClick={() => setMobileInfoVisible(false)}
            >
                &times;
              </button>
              
              <h3>COVID-19 Data Explorer</h3>
              <div className="info-section">
                <h4>Data Updated:</h4>
                <p>{lastUpdated.toLocaleDateString()}</p>
              </div>
              
              <div className="info-section">
                <h4>Webmap Demonstration</h4>
                <p>
                  This showcase highlights our advanced web mapping capabilities. 
                  Note: Many countries have stopped regular COVID-19 reporting, 
                  so data accuracy may vary. This demo focuses on technical 
                  implementation rather than current health statistics.
                </p>
                <a href="/web-applications" className="learn-more">
                  Explore our mapping solutions →
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <div className="advanced-map-container">
      <InfoPanel 
        lastUpdated={new Date(Math.max(...covidData.map(c => c.updated)))}
        mobileInfoVisible={mobileInfoVisible}
        setMobileInfoVisible={setMobileInfoVisible}
      />

     
      <div className="map-wrapper">
      <MapContainer 
  className={`covid-map ${comparisonMode ? 'comparison-mode-active' : ''}`}
  key="main-map"
  center={getZimbabweCenter()} 
  zoom={ZIMBABWE_ZOOM}
  minZoom={2}
  maxBounds={[[-90, -180], [90, 180]]}
  zoomControl={false}
  whenCreated={(map) => {
    mapRef.current = map;
  }}
  worldCopyJump={false}
  style={{ height: '100vh', width: '100%' }}
>
<CustomZoomControl />
 
 
  <LayersControl position="topleft">
  {baseMaps.map((map) => (
    <LayersControl.BaseLayer 
      key={map.name} 
      name={map.name}
      checked={map.name === "OpenStreetMap"}
    >
      <TileLayer
        url={map.url}
        attribution={map.attribution}
      />
    </LayersControl.BaseLayer>
  ))}
</LayersControl>

 

         
          {geoJsonData && covidData && (
  <GeoJSON
    key={`countries-geojson-${comparisonMode}`} 
    data={geoJsonData}
    style={(feature?: GeoJSON.Feature) => {
      if (!feature) return { fillOpacity: 0, weight: 0 };
      
      const countryData = getMatchingCountry(feature, covidData);
      if (!countryData) return { fillOpacity: 0, weight: 0 };
      
      const normalizedCountryName = normalizeCountryName(countryData.country);
      const isSelected = selectedCountries.some(sc => 
        normalizeCountryName(sc) === normalizedCountryName
      );
      
     
      return {
        weight: isSelected ? 2 : 1,  // Very subtle border increase
        fillColor: isSelected ? '#ff9aa2' : 'rgba(150, 150, 200, 0.4)',  // Soft pink instead of red
        color: isSelected ? '#ff9aa2' : 'rgba(255, 255, 255, 0.7)',  // Matching soft border
        fillOpacity: isSelected ? 0.5 : 0.3,  // Very transparent
        dashArray: isSelected ? '3,3' : undefined,  // Subtle dashed pattern
      };
    }}
    onEachFeature={(feature: GeoJSON.Feature, layer: L.Layer) => {
      const countryData = getMatchingCountry(feature, covidData);
      if (!countryData) return;
      
      /*layer.bindPopup(`
        <div class="geo-popup">
          <h3>${countryData.country}</h3>
          <p>Total ${dataType}: ${countryData[dataType as keyof CountryCovidData]}</p>
          ${comparisonMode ? 
            `<p class="hint">Click to ${selectedCountries.includes(countryData.country) ? 
              'remove from' : 'add to'} comparison</p>` : ''}
        </div>
      `);*/
      
      layer.on({
        click: () => {
          handleCountrySelect(countryData.country);
          if (layer instanceof L.Path) {
            layer.setStyle({
              weight: selectedCountries.includes(countryData.country) ? 4 : 1,
              fillColor: selectedCountries.includes(countryData.country) ? '#ff0000' : 'rgba(100, 100, 200, 0.5)',
              color: selectedCountries.includes(countryData.country) ? '#ff0000' : 'white',
              fillOpacity: selectedCountries.includes(countryData.country) ? 0.9 : 0.7,
            });
          }
        },
        mouseover: () => {
          if (comparisonMode && layer instanceof L.Path) {
            layer.setStyle({
              weight: 3,
              color: '#6666ff'
            });
          }
        },
        mouseout: () => {
          if (comparisonMode && layer instanceof L.Path) {
            const isSelected = selectedCountries.includes(countryData.country);
            layer.setStyle({
              weight: isSelected ? 4 : 1,
              color: isSelected ? '#ff0000' : 'white'
            });
          }
        }
      });
    }}
  />
)}

{getDataForDate(currentDate).map((country, index) => {
  const isZimbabwe = normalizeCountryName(country.country) === 'Zimbabwe';
  const value = country[dataType as keyof CountryCovidData] as number;
  const baseSize = window.innerWidth < 768 ? 30 : 50;
  const size = calculateMarkerSize(value);
  
  // Generate a unique key
  const uniqueKey = country.countryInfo._id 
    ? country.countryInfo._id 
    : `${country.country}-${country.countryInfo.iso2}-${index}`;
  
  return (
    <Marker
      key={uniqueKey}  // Use the unique key here
      position={[country.countryInfo.lat, country.countryInfo.long]}
      icon={createVirusIcon(size)}
      eventHandlers={{
        add: (e) => {
          const marker = e.target;
          if (isZimbabwe) {
            marker.openPopup();
            const markerElement = marker.getElement();
            if (markerElement) {
              markerElement.classList.add('zimbabwe-marker');
            }
          }
        }
      }}
    >
                <Popup className="country-popup">
                  <div className="popup-content">
                    <div className="popup-header">
                      <img 
                        src={country.countryInfo.flag} 
                        alt={`${country.country} flag`} 
                        className="country-flag"
                      />
                      <h3>{country.country}</h3>
                    </div>
                    <div className="popup-stats">
                      <div className="stat-item cases">
                        <span className="stat-label">Cases:</span>
                        <span className="stat-value">{country.cases.toLocaleString()}</span>
                      </div>
                      <div className="stat-item deaths">
                        <span className="stat-label">Deaths:</span>
                        <span className="stat-value">{country.deaths.toLocaleString()}</span>
                      </div>
                      <div className="stat-item recovered">
                        <span className="stat-label">Recovered:</span>
                        <span className="stat-value">{country.recovered.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              
                {animationEnabled && (
                  <PulseCircle 
                    center={[country.countryInfo.lat, country.countryInfo.long]} 
                    size={Math.sqrt(value) * 50} 
                    color={getColorForValue(value)}
                  />
                )}
              </Marker>
            );
          })}
          
          {/* Heatmap layer */}
          <DataHeatmap 
            data={covidData} 
            dataType={dataType}
            radius={20}
            maxZoom={7}
          />
          
          {/* Virus particle animation layer */}
          <VirusParticleLayer 
            active={animationEnabled}
            density={50}
          />
          
          {/* Predictive model visualization */}
          {showPredictiveModel && (
            <PredictiveModelVisualization 
              data={covidData}
              historicalData={historicalData}
            />
          )}
      
      {comparisonMode && selectedCountries.length > 0 && !showComparison && (
  <div 
    className="comparison-trigger" 
    onClick={() => setShowComparison(true)}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '10px 15px',
      borderRadius: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      zIndex: 1000
    }}
  >
    <div style={{
      background: '#ff4757',
      color: 'white',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    }}>
      {selectedCountries.length}
    </div>
    <span>Compare Selected ({selectedCountries.length})</span>
    <span style={{ marginLeft: '5px' }}>→</span>
  </div>
)}
</MapContainer>
   
        <MapControls 
          onTimeChange={setCurrentDate}
          onDataTypeChange={setDataType}
        />
      </div>
   
      {selectedCountries.length > 0 && showComparison && (
  <CountryComparisonTool 
    countries={selectedCountries}
    data={covidData.filter(c => selectedCountries.includes(c.country))}
    historicalData={historicalData.filter(h => 
      selectedCountries.some(sc => 
        normalizeCountryName(h.country) === normalizeCountryName(sc)
      )
    )}
    onClose={() => {
      setShowComparison(false);
      setComparisonMode(false);
      setSelectedCountries([]);
    }}
    visible={showComparison}
  />
)}  

<div className="map-toggle-buttons">
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setAnimationEnabled(!animationEnabled);
    }}
    className={animationEnabled ? 'active' : ''}
  >
    {animationEnabled ? 'Disable Animations' : 'Enable Animations'}
  </button>
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setShowPredictiveModel(!showPredictiveModel);
    }}
    className={showPredictiveModel ? 'active' : ''}
  >
    {showPredictiveModel ? 'Hide Predictive Model' : 'Show Predictive Model'}
  </button>
  <button 
    onClick={(e) => {
      e.stopPropagation();
      const newMode = !comparisonMode;
      setComparisonMode(newMode);
      if (!newMode) {
        setSelectedCountries([]);
        setShowComparison(false);
      }
    }}
    className={`comparison-mode-btn ${comparisonMode ? 'active' : ''}`}
    style={{
      backgroundColor: comparisonMode ? '#ff4757' : '#4CAF50',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    {comparisonMode ? (
      <>
        <span className="comparison-icon">✕</span> Exit Comparison Mode
      </>
    ) : (
      <>
        <span className="comparison-icon">🔍</span> Compare Countries
      </>
    )}
  </button>
</div>

{/* Add mobile FAB (only shows on mobile) */}
{isMobile && (
  <>
    <button 
     className={`mobile-fab ${fabOpen ? 'open' : ''}`} 
     onClick={() => setFabOpen(!fabOpen)}
    >
  <span>{fabOpen ? '×' : '☰'}</span>
</button>
    {fabOpen && (
      <div className="mobile-fab-menu">
       <button 
  onClick={(e) => {
    e.stopPropagation(); // Add this line
    setAnimationEnabled(!animationEnabled);
    setFabOpen(false);
  }}
  className={animationEnabled ? 'active' : ''}
>
  {animationEnabled ? '⏹ Stop Animation' : '▶ Animations'}
</button>

<button 
  onClick={(e) => {
    e.stopPropagation(); // Add this line
    setShowPredictiveModel(!showPredictiveModel);
    setFabOpen(false);
  }}
  className={showPredictiveModel ? 'active' : ''}
>
  {showPredictiveModel ? '✕ Predictive' : '📊 Predict'}
</button>

<button 
  onClick={(e) => {
    e.stopPropagation(); // Add this line
    const newMode = !comparisonMode;
    setComparisonMode(newMode);
    if (!newMode) {
      setSelectedCountries([]);
      setShowComparison(false);
    } else {
      setSelectedCountries([]);
    }
  }}
  className={`comparison-mode-btn ${comparisonMode ? 'active' : ''}`}
  style={{
    backgroundColor: comparisonMode ? '#ff4757' : '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
>
  {comparisonMode ? (
    <>
      <span className="comparison-icon">✕</span> Exit Comparison Mode
    </>
  ) : (
    <>
      <span className="comparison-icon">🔍</span> Compare Countries
    </>
  )}
</button>
      </div>
    )}
  </>
)}
      
      <div className="data-attribution">
        <p>Data source: disease.sh COVID-19 API 
        </p>
      </div>
    </div>
  );
};

export default CovidMap;