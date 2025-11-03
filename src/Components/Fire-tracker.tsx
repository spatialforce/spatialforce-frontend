import React, { useEffect, useState, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './fire-tracker.css';
import FileUploadModal from './fileuploadmodal';
import * as GeoJSON from 'geojson';


interface FeatureProperties {
  admin1Name?: string;
  admin2Name?: string;
  acq_date?: string;
  confidence?: number;
  frp?: number;
}
// Correct type definition using Leaflet's types
interface GeoJSONFeature extends L.Layer {
  feature?: {
    type: 'Feature';
    geometry: L.GeoJSON.Geometry;
    properties?: FeatureProperties;
  };
}

// SVG Icon Components with distinctive classes
const PolygonIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const PointIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const TrashIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="firetracker-icon" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const MapViewer = () => {
  // State
  const [provinces, setProvinces] = useState<any>(null);
  const [districts, setDistricts] = useState<any>(null);
  const [firepoints, setFirepoints] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [searchResults, setSearchResults] = useState<L.Layer[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteType, setDeleteType] = useState<'province' | 'district' | 'firepoint' | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    provinces?: L.GeoJSON;
    districts?: L.GeoJSON;
    firepoints?: L.GeoJSON;
  }>({});
  const allFeatures = useRef<{
    provinces: L.FeatureGroup;
    districts: L.FeatureGroup;
    firepoints: L.FeatureGroup;
  }>({
    provinces: L.featureGroup(),
    districts: L.featureGroup(),
    firepoints: L.featureGroup()
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const confirmAdminAction = (action: string, model: string, actionType: 'add' | 'change' = 'add') => {
    const confirmed = window.confirm(
      `You must be a superuser or have admin privileges to ${action} this data.\n\nAre you sure you want to continue to the admin portal?`
    );
    
    if (confirmed) {
      redirectToAdmin(model, actionType);
    }
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
// Add this at the top of your component
const [loadingError, setLoadingError] = useState<string | null>(null);

const transformToGeoJSON = (data: any, type: string) => {
  console.log(`Raw ${type} data:`, data);
  
  // Handle case where data is already a FeatureCollection
  if (data.type === 'FeatureCollection') {
    return data;
  }

  // Handle array input
  if (Array.isArray(data)) {
    const features = data.map((item) => {
      try {
        // Handle both stringified and direct GeoJSON
        const geometry = typeof item.geojson === 'string' 
          ? JSON.parse(item.geojson)
          : item.geojson || item.geometry;

        if (!geometry) {
          console.warn(`Item missing geometry:`, item);
          return null;
        }

        return {
          type: "Feature",
          properties: { ...item },
          geometry
        };
      } catch (e) {
        console.error(`Error parsing feature:`, e, item);
        return null;
      }
    }).filter(Boolean);

    return { type: "FeatureCollection", features };
  }

  // Fallback for unexpected formats
  console.error(`Unexpected data format for ${type}:`, data);
  return { type: "FeatureCollection", features: [] };
};
// Remove the outer useEffect and keep only the inner one
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timestamp = Date.now();
      const [provincesRes, districtsRes, firepointsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/provinces/?v=${dataVersion}&t=${timestamp}`).then(res => {
          if (!res.ok) throw new Error('Provinces fetch failed');
          return res.json();
        }),
        fetch(`http://localhost:8000/api/districts/?v=${dataVersion}&t=${timestamp}`).then(res => {
          if (!res.ok) throw new Error('Districts fetch failed');
          return res.json();
        }),
        fetch(`http://localhost:8000/api/firepoints/?v=${dataVersion}&t=${timestamp}`).then(res => {
          if (!res.ok) throw new Error('Firepoints fetch failed');
          return res.json();
        })
      ]);

      console.log('API Responses:', {
        provinces: provincesRes,
        districts: districtsRes,
        firepoints: firepointsRes
      });

      setProvinces(provincesRes.data || []);
      setDistricts(districtsRes.data || []);
      setFirepoints(firepointsRes.data || []);
      
    } catch (err) {
      console.error('Data loading error:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  const intervalId = setInterval(() => {
    setDataVersion(prev => prev + 1);
  }, 30000);

  return () => clearInterval(intervalId);
}, [dataVersion]);  // Only this single useEffect is needed


// Initialize map
useEffect(() => {
  if (!mapRef.current) return;
  
  // Initialize map only once
  if (!mapInstance.current) {
    mapInstance.current = L.map(mapRef.current).setView([-20, 28], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);
  }
}, []);

useEffect(() => {
  if (!mapInstance.current || loading) return;

  // Clear existing layers
  mapInstance.current.eachLayer(layer => {
    if (!(layer instanceof L.TileLayer)) {
      mapInstance.current?.removeLayer(layer);
    }
  });

  // Reset feature groups
  allFeatures.current = {
    provinces: L.featureGroup(),
    districts: L.featureGroup(),
    firepoints: L.featureGroup()
  };

  // Helper function to create GeoJSON FeatureCollection
  const createFeatureCollection = (items: any[]): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: items.map(item => ({
        type: "Feature",
        properties: item,
        geometry: typeof item.geojson === 'string' 
          ? JSON.parse(item.geojson) 
          : item.geojson
      }))
    };
  };

  // Add provinces
  if (provinces?.length) {
    const provinceLayer = L.geoJSON(createFeatureCollection(provinces), {
      style: { 
        color: '#3388ff',
        weight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.1 
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.admin1Name) {
          layer.bindPopup(`<b>Province:</b> ${feature.properties.admin1Name}`);
        }
        allFeatures.current.provinces.addLayer(layer);
      }
    }).addTo(mapInstance.current);
  }

  // Add districts
  if (districts?.length) {
    const districtLayer = L.geoJSON(createFeatureCollection(districts), {
      style: { 
        color: '#ee2400',
        weight: 1,
        fillColor: '#ee2400',
        fillOpacity: 0.05 
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.admin2Name) {
          layer.bindPopup(`
            <b>District:</b> ${feature.properties.admin2Name}<br>
            <b>Province:</b> ${feature.properties.admin1Name}
          `);
        }
        allFeatures.current.districts.addLayer(layer);
      }
    }).addTo(mapInstance.current);
  }

  // Add firepoints
  if (firepoints?.length) {
    firepoints.forEach((firepoint: any) => {
      try {
        const geometry = typeof firepoint.geojson === 'string' 
          ? JSON.parse(firepoint.geojson) 
          : firepoint.geojson;
        
        if (geometry?.type === "Point") {
          const marker = L.circleMarker(
            [geometry.coordinates[1], geometry.coordinates[0]],
            { 
              radius: 8,
              fillColor: '#ff0000',
              fillOpacity: 0.8 
            }
          );
          
          marker.bindPopup(`
            <b>Fire Point</b><br>
            <b>Date:</b> ${firepoint.acq_date || 'N/A'}<br>
            <b>Confidence:</b> ${firepoint.confidence || 'N/A'}%<br>
            <b>Intensity (FRP):</b> ${firepoint.frp || 'N/A'}
          `);
          
          marker.addTo(mapInstance.current!);
          allFeatures.current.firepoints.addLayer(marker);
        }
      } catch (e) {
        console.error('Error parsing firepoint:', firepoint, e);
      }
    });
  }

  // Log rendered counts
  console.log('Rendered features:', {
    provinces: allFeatures.current.provinces.getLayers().length,
    districts: allFeatures.current.districts.getLayers().length,
    firepoints: allFeatures.current.firepoints.getLayers().length
  });
}, [provinces, districts, firepoints, loading]);

  // Search functionality
  const getSearchableNames = useCallback(() => {
    const names: string[] = [];
    
    allFeatures.current.provinces.eachLayer((layer: GeoJSONFeature) => {
      if (layer.feature?.properties?.admin1Name) {
        names.push(layer.feature.properties.admin1Name);
      }
    });

    allFeatures.current.districts.eachLayer((layer: GeoJSONFeature) => {
      if (layer.feature?.properties?.admin2Name) {
        names.push(layer.feature.properties.admin2Name);
      }
    });

    allFeatures.current.firepoints.eachLayer((layer: GeoJSONFeature) => {
      if (layer.feature?.properties?.acq_date) {
        names.push(new Date(layer.feature.properties.acq_date).toLocaleString());
      }
    });

    return names;
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchError(null);
    
    if (!value) {
      setGhostText('');
      return;
    }

    const searchableNames = getSearchableNames();
    const lowerValue = value.toLowerCase();

    const match = searchableNames.find(name => 
      name.toLowerCase().startsWith(lowerValue) && 
      name.toLowerCase() !== lowerValue
    );

    setGhostText(match || '');
  };

  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery || !mapInstance.current) return;

    // Clear previous search highlights and errors
    searchResults.forEach(layer => {
      const props = (layer as GeoJSONFeature).feature?.properties;
      if (props && layer instanceof L.Path) {
        layer.setStyle({ 
          weight: props.admin1Name ? 2 : 1,
          color: props.admin1Name ? '#3388ff' : '#ee2400'
        });
      }
    });
    setSearchError(null);

    const newResults: L.Layer[] = [];
    const searchTerm = searchQuery.toLowerCase();

    const searchInLayerGroup = (group: L.FeatureGroup) => {
      group.eachLayer((layer: L.Layer) => {
        const feature = (layer as GeoJSONFeature).feature;
        if (!feature?.properties) return;

        const { admin1Name, admin2Name, acq_date } = feature.properties;
        const matches = (
          (admin1Name?.toLowerCase().includes(searchTerm)) ||
          (admin2Name?.toLowerCase().includes(searchTerm)) ||
          (acq_date?.toLowerCase().includes(searchTerm))
        );

        if (matches) {
          newResults.push(layer);
          if (layer instanceof L.Path) {
            layer.setStyle({ 
              weight: 3, 
              color: admin1Name ? '#FFD700' : 
                     admin2Name ? '#FFA500' : '#FF6347'
            });
          }
          (layer as L.Marker).fire('click');
        }
      });
    };

    searchInLayerGroup(allFeatures.current.provinces);
    searchInLayerGroup(allFeatures.current.districts);
    searchInLayerGroup(allFeatures.current.firepoints);

    setSearchResults(newResults);

    if (newResults.length > 0) {
      const group = L.featureGroup(newResults);
      mapInstance.current.fitBounds(group.getBounds().pad(0.2));
    } else {
      setSearchError(`"${searchQuery}" doesn't exist`);
    }
  }, [searchQuery, searchResults]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };
  const redirectToAdmin = (model: string, action: 'add' | 'change' = 'add') => {
    window.open(`http://localhost:8000/admin/Firetracker/${model}/${action}/`, '_blank');
  };

  // Update handleDelete to use confirmation
  const handleDelete = (type: 'province' | 'district' | 'firepoint') => {
    confirmAdminAction('delete', type, 'change');
    setDeleteMode(false);
    setDeleteType(null);
  };

  const cancelDelete = () => {
    setDeleteMode(false);
    setDeleteType(null);
  };


  
  const handleAdminUpload = (type: 'add' | 'upload') => {
    const confirmed = window.confirm(
      `You must be a superuser to ${type} data.\n\nContinue to admin portal?`
    );
    
    if (confirmed) {
      if (type === 'upload') {
        // Updated to use the correct admin URL
        window.open('http://localhost:8000/admin/Firetracker/geodataupload/', '_blank');
      } else {
        redirectToAdmin(model, 'add');
      }
    }
  };
  

  return (
    <div className="firetracker-map-container">

<button
  onClick={() => handleAdminUpload('upload')}
  className="upload-button"
>
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
  Upload from Computer
</button>

      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Search Bar */}
      <div className="firetracker-search-container">
        <div className="firetracker-search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Search provinces, districts, firepoints..."
            className={`firetracker-search-input ${searchError ? 'firetracker-search-input-error' : ''}`}
          />
          {ghostText && searchQuery && (
            <div className="firetracker-ghost-text">
              <span className="firetracker-ghost-text-prefix">{searchQuery}</span>
              <span className="firetracker-ghost-text-suffix">{ghostText.slice(searchQuery.length)}</span>
            </div>
          )}
        </div>
        {searchError && (
          <div className="firetracker-search-error">
            {searchError}
          </div>
        )}
        <button
          onClick={handleSearchSubmit}
          className="firetracker-search-button"
        >
          Search
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="firetracker-map-container" />
      
      {/* Edit Menu */}
      <div className="firetracker-edit-menu">
        <div 
          className={`firetracker-menu-header ${editMenuOpen ? 'firetracker-menu-header-open' : ''}`}
          onClick={() => setEditMenuOpen(!editMenuOpen)}
        >
          <EditIcon />
          <span>Edit Data</span>
          {editMenuOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </div>

        {editMenuOpen && (
        <div className="firetracker-menu-content">
          <div 
            className="firetracker-menu-item"
            onClick={() => confirmAdminAction('add', 'province')}
          >
            <PolygonIcon />
            <span>Add Province</span>
          </div>

          <div 
            className="firetracker-menu-item"
            onClick={() => confirmAdminAction('add', 'district')}
          >
            <PolygonIcon />
            <span>Add District</span>
          </div>

          <div 
            className="firetracker-menu-item"
            onClick={() => confirmAdminAction('add', 'firepoint')}
          >
            <PointIcon />
            <span>Add Firepoint</span>
          </div>

            <div className="firetracker-delete-section">
              <div 
                className="firetracker-menu-item"
                onClick={() => setDeleteMode(!deleteMode)}
                style={{ backgroundColor: deleteMode ? '#fff5f5' : undefined }}
              >
                <TrashIcon />
                <span>Delete</span>
                {deleteMode ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </div>

              {deleteMode && (
                <div className="firetracker-nested-menu">
                  <div 
                    className={`firetracker-delete-menu-item ${deleteType === 'province' ? 'firetracker-delete-menu-item-active' : ''}`}
                    onClick={() => handleDelete('province')}
                  >
                    <PolygonIcon />
                    <span>Province</span>
                  </div>
                  <div 
                    className={`firetracker-delete-menu-item ${deleteType === 'district' ? 'firetracker-delete-menu-item-active' : ''}`}
                    onClick={() => handleDelete('district')}
                  >
                    <PolygonIcon />
                    <span>District</span>
                  </div>
                  <div 
                    className={`firetracker-delete-menu-item ${deleteType === 'firepoint' ? 'firetracker-delete-menu-item-active' : ''}`}
                    onClick={() => handleDelete('firepoint')}
                  >
                    <PointIcon />
                    <span>Firepoint</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Mode Indicator */}
      {deleteMode && deleteType && (
        <div className="firetracker-delete-mode-indicator">
          <span>Click on a {deleteType} to delete it</span>
          <button
            className="firetracker-cancel-button"
            onClick={cancelDelete}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Data Loading Status */}
      <div className="firetracker-loading-status">
        {!provinces && <p>Loading provinces...</p>}
        {!districts && <p>Loading districts...</p>}
        {!firepoints && <p>Loading firepoints...</p>}
      </div>
    </div>
  );
};

export default MapViewer;