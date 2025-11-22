// src/Components/AirQuality.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Airquality.css";

const { BaseLayer, Overlay } = LayersControl;

// Approximate WHO-like threshold in mol/m² equivalent for NO₂ comparison.
const WHO_THRESHOLD_MEAN = 0.000024;

// Wind climatology summary (from NASA POWER 2001–2020 Monthly Climatology)
const WIND_SUMMARY = {
  meanSpeed: 4.45, // m/s
  directionShort: "ESE → WNW",
  directionLong: "from east-south-east towards west-north-west",
  periodLabel: "2001–2020 monthly climatology",
};

// Gas configuration for switcher, legend and labels
const GAS_CONFIG = {
  NO2: {
    key: "NO2",
    label: "NO₂",
    longName: "Nitrogen dioxide (NO₂)",
    tilePath: "/tiles/NO2/{z}/{x}/{y}.png",
    legendTitle: "NO₂",
    legendSub: {
      left: "Dark = lower",
      right: "Bright = higher",
    },
    gradient:
      "linear-gradient(to right, #000004, #2c105c, #711f81, #b63679, #e65163, #fb8761, #fecf92, #fcfdbf)",
    dotColor: "#fb8761",
    catField: "No2_cat",
  },
  CH4: {
    key: "CH4",
    label: "CH₄",
    longName: "Methane (CH₄)",
    tilePath: "/tiles/CH4/{z}/{x}/{y}.png",
    legendTitle: "CH₄",
    legendSub: {
      left: "Dark = lower",
      right: "Bright = higher",
    },
    gradient:
      "linear-gradient(to right, #440154, #414487, #2a788e, #22a884, #7ad151, #fde725)",
    dotColor: "#22a884",
    catField: "ch4_cat",
  },
  O3: {
    key: "O3",
    label: "O₃",
    longName: "Ozone (O₃)",
    tilePath: "/tiles/Ozone/{z}/{x}/{y}.png",
    legendTitle: "Ozone (O₃)",
    legendSub: {
      left: "Darker = lower",
      right: "Brighter = higher ",
    },
    gradient:
      "linear-gradient(to right, #2d0b59, #2644b4, #1aa38f, #a5db36, #fce623)",
    dotColor: "#f97316",
    catField: "",
  },
  CO: {
    key: "CO",
    label: "CO",
    longName: "Carbon monoxide (CO)",
    tilePath: "/tiles/CO/{z}/{x}/{y}.png",
    legendTitle: "CO",
    legendSub: {
      left: "Light = lower",
      right: "Dark = higher",
    },
    gradient:
      "linear-gradient(to right, #fde725, #a5a96a, #6c757d, #42486f, #00204c)",
    dotColor: "#facc15",
    catField: "CO_cat",
  },
} as const;

type GasKey = keyof typeof GAS_CONFIG;

const AirQuality: React.FC = () => {
  // Per-gas data (geojson, stats, hotspots)
  const [gasData, setGasData] = useState<{
    NO2: any | null;
    CH4: any | null;
    CO: any | null;
    O3: any | null;
  }>({
    NO2: null,
    CH4: null,
    CO: null,
    O3: null,
  });

  const [selectedGas, setSelectedGas] = useState<GasKey>("NO2");
  const isOzone = selectedGas === "O3";

  // visibility toggle for active gas tiles (click same gas button to hide/show)
  const [gasVisible, setGasVisible] = useState<boolean>(true);

  const [selectedWard, setSelectedWard] = useState<any | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string | number | null>(
    null
  );
  const [selectedWardOptionId, setSelectedWardOptionId] =
    useState<string>("");

  // Hotspot mode: "no2" = concentration, "exposure" = hybrid exposure
  const [priorityMode, setPriorityMode] = useState<"no2" | "exposure">("no2");

  // Extra layers
  const [industrialGeojson, setIndustrialGeojson] = useState<any | null>(null);
  const [roadsGeojson, setRoadsGeojson] = useState<any | null>(null);

  // Wind plume toggle
  const [showPlumes, setShowPlumes] = useState(false);

  // Sidebar expand mode
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Gas switcher expanded (mobile icon)
  const [gasSwitcherExpanded, setGasSwitcherExpanded] = useState(false);

  // Read more toggle
  const [showReadMore, setShowReadMore] = useState(false);

  // Initial zoom (desktop vs mobile)
  const [initialZoom, setInitialZoom] = useState<number>(11);

  // Force map "refresh" when gas changes
  const [mapKey, setMapKey] = useState<number>(0);
  const firstGasRenderRef = useRef<boolean>(true);

  const mapRef = useRef<L.Map | null>(null);

  // Keep track of individual ward layers for bringToFront / direct popups
  const wardLayersRef = useRef<{ [fid: string]: L.Layer }>({});

  // Keep track of the last opened ward popup (location + HTML)
  const lastPopupRef = useRef<{
    latlng: L.LatLngExpression;
    html: string;
  } | null>(null);

  // Bulawayo centre
  const bulawayoCenter: [number, number] = [-20.11, 28.55];

  const currentGasConfig = GAS_CONFIG[selectedGas];
  const activeGasData = gasData[selectedGas] || null;
  const summaryStats = activeGasData?.summaryStats || null;
  const hotspotsMean = activeGasData?.hotspotsMean || [];
  const hotspotsExposure = activeGasData?.hotspotsExposure || [];

  useEffect(() => {
    // Slightly more zoomed out on mobile, closer on desktop
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width <= 768) {
        setInitialZoom(10);
      } else {
        setInitialZoom(11);
      }
    }
  }, []);

  // Helper: format values (works for all gases)
  const formatValue = (value: any, decimals = 8) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "N/A";
    }
    const num = Number(value);
    if (decimals === 8 && num < 0.00001) return num.toExponential(2);
    return num.toFixed(decimals);
  };

  const formatExposure = (value: any) => formatValue(value, 3);

  const formatPopulation = (value: any) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "N/A";
    }
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  // WHO exceedance helper (NO₂ only)
  const exceedsWHO = (mean: any) => {
    if (mean === null || mean === undefined || isNaN(Number(mean))) {
      return false;
    }
    return Number(mean) > WHO_THRESHOLD_MEAN;
  };

  // Helper to build a ward name from admin3Name
  const getWardName = (props: any = {}) => {
    if (props.admin3Name !== undefined && props.admin3Name !== null) {
      return `Ward ${props.admin3Name}`;
    }
    return "Ward";
  };

  // Build gas data (stats + hotspots) from geojson
  const buildGasData = (geojson: any, gasKey: GasKey, catField: string) => {
    const features = geojson.features || [];
    const valid = features
      .map((f: any) => {
        const p = f.properties || {};
        return {
          mean: Number(p._mean),
          cat: p[catField],
          id: p.fid,
          exposure: Number(p.Exposure_idx),
          population: Number(p.BYO_population),
          feature: f,
        };
      })
      .filter((x: any) => !isNaN(x.mean));

    let summaryStats = null;
    let hotspotsMean: any[] = [];
    let hotspotsExposure: any[] = [];

    if (valid.length > 0) {
      const means = valid.map((v) => v.mean);
      const maxMean = Math.max(...means);
      const minMean = Math.min(...means);
      const highWardCount = valid.filter(
        (v) => v.cat === "High" || v.cat === "Very High"
      ).length;

      summaryStats = {
        maxMean,
        minMean,
        highWardCount,
      };

      hotspotsMean = [...valid].sort((a, b) => b.mean - a.mean).slice(0, 5);

      const validExposure = valid.filter(
        (v) => !isNaN(v.exposure) && v.exposure !== null
      );
      hotspotsExposure = [...validExposure]
        .sort((a, b) => b.exposure - a.exposure)
        .slice(0, 5);
    }

    return {
      geojson,
      features: geojson.features || [],
      summaryStats,
      hotspotsMean,
      hotspotsExposure,
      catField,
      gasKey,
    };
  };

  // Load NO₂ wards
  useEffect(() => {
    fetch("/data/NO2_hybrid_exposure.geojson")
      .then((res) => res.json())
      .then((data) => {
        const built = buildGasData(data, "NO2", GAS_CONFIG.NO2.catField);
        setGasData((prev) => ({ ...prev, NO2: built }));
      })
      .catch((err) =>
        console.error("Failed to load NO₂ exposure GeoJSON:", err)
      );
  }, []);

  // Load CH₄ wards
  useEffect(() => {
    fetch("/data/CH4_exposure.geojson")
      .then((res) => res.json())
      .then((data) => {
        const built = buildGasData(data, "CH4", GAS_CONFIG.CH4.catField);
        setGasData((prev) => ({ ...prev, CH4: built }));
      })
      .catch((err) =>
        console.error("Failed to load CH₄ exposure GeoJSON:", err)
      );
  }, []);

  // Load CO wards
  useEffect(() => {
    fetch("/data/CO_exposure.geojson")
      .then((res) => res.json())
      .then((data) => {
        const built = buildGasData(data, "CO", GAS_CONFIG.CO.catField);
        setGasData((prev) => ({ ...prev, CO: built }));
      })
      .catch((err) =>
        console.error("Failed to load CO exposure GeoJSON:", err)
      );
  }, []);

  // Load industrial polygons
  useEffect(() => {
    fetch("/data/BYO_industrial.geojson")
      .then((res) => res.json())
      .then((data) => setIndustrialGeojson(data))
      .catch((err) => console.error("Failed to load industrial GeoJSON:", err));
  }, []);

  // Load highways
  useEffect(() => {
    fetch("/data/BYO_Highway.geojson")
      .then((res) => res.json())
      .then((data) => setRoadsGeojson(data))
      .catch((err) => console.error("Failed to load highway GeoJSON:", err));
  }, []);

  // Style for ward boundary – thin green; selected ward = thicker red
  const wardStyle = (feature: any) => {
    const props = feature?.properties || {};
    const fid = props.fid;
    const isSelected =
      selectedWardId !== null &&
      selectedWardId !== undefined &&
      String(fid) === String(selectedWardId);

    return {
      color: isSelected ? "#ef4444" : "#16a34a",
      weight: isSelected ? 4 : 2,
      opacity: isSelected ? 1 : 0.8,
      fillOpacity: 0,
      className: isSelected ? "ward-polygon ward-selected" : "ward-polygon",
    };
  };

  // Style for industrial polygons
  const industrialStyle = () => ({
    fillColor: "rgba(56, 189, 248, 0.65)",
    fillOpacity: 0.65,
    color: "#0ea5e9",
    weight: 1.8,
    opacity: 0.95,
  });

  // Style for major highways
  const roadsStyle = () => ({
    color: "#facc15",
    weight: 2.5,
    opacity: 0.95,
  });

  const buildSelectedWardState = (
    feature: any,
    gasKey: GasKey,
    catField: string
  ) => {
    const props = feature.properties || {};
    const wardName = getWardName(props);
    const mean = props._mean;
    const max = props._max;
    const cat = props[catField];
    const fid = props.fid;
    const population = props.BYO_population;
    const exposureHybrid = props.Exposure_idx;

    return {
      gasKey,
      id: fid,
      name: wardName,
      mean,
      max,
      cat,
      population,
      exposure: exposureHybrid,
    };
  };

  const formatPopulationHtml = (population: any) => {
    if (
      population !== null &&
      population !== undefined &&
      !isNaN(population)
    ) {
      return formatPopulation(population);
    }
    return "N/A";
  };

  const formatExposureHtml = (exposureHybrid: any) => {
    if (
      exposureHybrid !== null &&
      exposureHybrid !== undefined &&
      !isNaN(exposureHybrid)
    ) {
      return formatExposure(exposureHybrid);
    }
    return "N/A";
  };

  const buildWardPopupHtml = (
    feature: any,
    gasKey: GasKey,
    catField: string
  ) => {
    const props = feature.properties || {};
    const wardName = getWardName(props);
    const gasLabel = GAS_CONFIG[gasKey]?.label || gasKey;

    const mean = props._mean;
    const max = props._max;
    const cat = props[catField];
    const population = props.BYO_population;
    const exposureHybrid = props.Exposure_idx;

    return `
      <div style="font-size: 11px; line-height: 1.4; min-width: 170px;">
        <div style="font-weight:600; margin-bottom:4px;">${wardName}</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Mean ${gasLabel}</span>
          <span>${formatValue(mean)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Max ${gasLabel}</span>
          <span>${formatValue(max)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Category</span>
          <span>${cat || "N/A"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Population</span>
          <span>${formatPopulationHtml(population)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:3px; padding-top:3px; border-top:1px solid rgba(148,163,184,0.45);">
          <span>Exposure index</span>
          <span>${formatExposureHtml(exposureHybrid)}</span>
        </div>
      </div>
    `;
  };

  // Helper: bring selected ward to front so highlight sits above neighbours
  const bringWardToFront = (
    fid: string | number | null | undefined
  ): void => {
    if (fid === null || fid === undefined) return;
    const layer = wardLayersRef.current[String(fid)];
    if (layer && (layer as any).bringToFront) {
      (layer as any).bringToFront();
    }
  };

  // Central helper used for hotspot clicks + dropdown, and as fallback
  const openFeaturePopup = (
    feature: any,
    gasKey: GasKey,
    catField: string,
    zoomToBounds = false
  ) => {
    if (!mapRef.current || !feature) return;

    const tmpLayer = L.geoJSON(feature);
    const bounds = tmpLayer.getBounds();
    if (!bounds.isValid()) return;

    const center = bounds.getCenter();

    if (zoomToBounds) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }

    if (gasKey === "O3") return;

    const html = buildWardPopupHtml(feature, gasKey, catField);
    const popup = L.popup({ maxWidth: 240 })
      .setLatLng(center)
      .setContent(html);

    lastPopupRef.current = { latlng: center, html };
    popup.openOn(mapRef.current);
  };

  // Attach click behaviour to each ward
  const onEachWard = (
    feature: any,
    layer: L.Layer,
    gasKey: GasKey,
    catField: string
  ) => {
    const props = feature.properties || {};
    const fid = props.fid;

    if (fid !== null && fid !== undefined) {
      wardLayersRef.current[String(fid)] = layer;
    }

    layer.on("click", () => {
      if (gasKey === "O3") {
        const propsInner = feature.properties || {};
        const fidInner = propsInner.fid;
        setSelectedWardId(fidInner);
        const leafletLayer: any = layer as any;
        if (leafletLayer.bringToFront) leafletLayer.bringToFront();
        if (mapRef.current) mapRef.current.closePopup();
        lastPopupRef.current = null;
        return;
      }

      const sel = buildSelectedWardState(feature, gasKey, catField);
      setSelectedWard(sel);
      setSelectedWardId(sel.id);
      setSelectedWardOptionId(String(sel.id ?? ""));

      const leafletLayer: any = layer as any;
      if (leafletLayer.bringToFront) {
        leafletLayer.bringToFront();
      }

      const html = buildWardPopupHtml(feature, gasKey, catField);

      let center: L.LatLng;
      if (leafletLayer && leafletLayer.getBounds) {
        center = leafletLayer.getBounds().getCenter();
      } else {
        const tmp = L.geoJSON(feature);
        center = tmp.getBounds().getCenter();
      }
      lastPopupRef.current = { latlng: center, html };

      leafletLayer.bindPopup(html).openPopup();
    });
  };

  // Popup for industrial polygons (generic)
  const onEachIndustrial = (feature: any, layer: L.Layer) => {
    const props = feature.properties || {};
    const name =
      props.name ||
      props.NAME ||
      props.ind_name ||
      props.Ind_Name ||
      "Industrial area";
    const html = `
      <div style="font-size: 12px; line-height:1.4;">
        <strong>${name}</strong><br/>
        Industrial zone
      </div>
    `;
    (layer as any).bindPopup(html);
  };

  // Popup for highways (generic)
  const onEachRoad = (feature: any, layer: L.Layer) => {
    const props = feature.properties || {};
    const name =
      props.name ||
      props.NAME ||
      props.road_name ||
      props.ROAD_NAME ||
      "Highway";
    const html = `
      <div style="font-size: 12px; line-height:1.4;">
        <strong>${name}</strong><br/>
        Major road / highway
      </div>
    `;
    (layer as any).bindPopup(html);
  };

  // When clicking a hotspot in the sidebar (NO2, CH4, CO only)
  // 🔥 NEW: use the actual Leaflet layer click, so it behaves
  // EXACTLY like manual ward clicking (highlight + popup).
  const handleHotspotClick = (
    hotspot: any,
    gasKey: GasKey,
    catField: string
  ) => {
    if (!hotspot || !hotspot.feature) return;
    if (gasKey === "O3") return;
    const feature = hotspot.feature;
    const props = feature.properties || {};
    const fid = props.fid;
    if (fid === null || fid === undefined) return;

    const fidStr = String(fid);

    // keep dropdown in sync
    setSelectedWardOptionId(fidStr);

    const layer = wardLayersRef.current[fidStr] as any;

    // If we have the live layer, fire its click handler.
    if (layer) {
      // zoom to ward bounds first
      if (mapRef.current && layer.getBounds) {
        const bounds = layer.getBounds();
        if (bounds && bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [40, 40] });
        }
      }

      if (layer.fire) {
        layer.fire("click");
        return; // manual click logic will handle highlight + popup + state
      }
    }

    // Fallback (if for some reason we don't have the layer reference)
    const sel = buildSelectedWardState(feature, gasKey, catField);
    setSelectedWard(sel);
    setSelectedWardId(sel.id);
    bringWardToFront(sel.id);
    openFeaturePopup(feature, gasKey, catField, true);
  };

  // Build ward options for dropdown (from active gas features)
  const wardOptions =
    activeGasData?.features
      ?.map((f: any) => ({
        id: f.properties?.fid,
        name: getWardName(f.properties || {}),
        feature: f,
      }))
      .sort((a: any, b: any) =>
        String(a.name).localeCompare(String(b.name), undefined, {
          numeric: true,
        })
      ) || [];

  // When selecting a ward from dropdown (NO2, CH4, CO only)
  const handleWardSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fidValue = e.target.value;
    setSelectedWardOptionId(fidValue);

    if (!fidValue || !activeGasData) return;
    if (selectedGas === "O3") return;

    const feature = activeGasData.features.find(
      (f: any) => String(f.properties?.fid) === String(fidValue)
    );
    if (!feature) return;

    const sel = buildSelectedWardState(
      feature,
      selectedGas,
      activeGasData.catField
    );
    setSelectedWard(sel);
    setSelectedWardId(sel.id);

    bringWardToFront(sel.id);

    if (mapRef.current) {
      const tmpLayer = L.geoJSON(feature);
      const bounds = tmpLayer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    const layer = wardLayersRef.current[String(sel.id)];
    const html = buildWardPopupHtml(
      feature,
      selectedGas,
      activeGasData.catField
    );

    let center: L.LatLng;
    if (layer && (layer as any).getBounds) {
      center = (layer as any).getBounds().getCenter();
    } else {
      const tmp = L.geoJSON(feature);
      center = tmp.getBounds().getCenter();
    }
    lastPopupRef.current = { latlng: center, html };

    if (layer && (layer as any).bindPopup) {
      (layer as any).bindPopup(html).openPopup();
    } else {
      openFeaturePopup(feature, selectedGas, activeGasData.catField, false);
    }
  };

  // When gas layer visibility changes: if we hide gas, clear selection + popup
  useEffect(() => {
    if (!mapRef.current) return;
    if (!gasVisible) {
      setSelectedWard(null);
      setSelectedWardId(null);
      setSelectedWardOptionId("");
      lastPopupRef.current = null;
      mapRef.current.closePopup();
    }
  }, [gasVisible]);

  // When gas changes: refresh map + clear popup/highlight
  useEffect(() => {
    if (firstGasRenderRef.current) {
      firstGasRenderRef.current = false;
      return;
    }

    setSelectedWard(null);
    setSelectedWardId(null);
    setSelectedWardOptionId("");
    setGasVisible(true);
    setGasSwitcherExpanded(false);
    lastPopupRef.current = null;

    if (mapRef.current) {
      mapRef.current.closePopup();
    }

    setMapKey((k) => k + 1);
  }, [selectedGas]);

  // When expand/collapse dashboard: just resize the map,
  // DO NOT remount or you lose the popup + highlight.
  useEffect(() => {
    if (!mapRef.current) return;

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 250);
  }, [sidebarExpanded]);

  // Helper to build a simple plume segment from ward centroid (top 5 by mean)
  const buildPlumeSegment = (feature: any) => {
    if (!feature) return null;
    const layer = L.geoJSON(feature);
    const center = layer.getBounds().getCenter();
    const start: [number, number] = [center.lat, center.lng];

    const latOffset = 0.18;
    const lngOffset = -0.18;
    const end: [number, number] = [
      center.lat + latOffset,
      center.lng + lngOffset,
    ];

    return { start, end };
  };

  // Which hotspot list to show in sidebar
  const activeHotspotList =
    priorityMode === "no2" ? hotspotsMean : hotspotsExposure;

  // Hotspots for plume animation – always top 5 by mean for active gas
  const plumeHotspots = hotspotsMean;

  // Gas button click: toggle visibility if same gas, otherwise switch gas & show
  const handleGasButtonClick = (gasKey: GasKey) => {
    if (gasKey === selectedGas) {
      setGasVisible((prev) => !prev);
    } else {
      setSelectedGas(gasKey);
    }
  };

  return (
    <div className={`no2-page gas-${selectedGas.toLowerCase()}`}>
      <div
        className={`no2-layout ${
          sidebarExpanded ? "no2-layout-expanded" : ""
        }`}
      >
        {/* LEFT: Map + legend */}
        <div className="no2-map-column">
          <div className="no2-map-shell">
            <MapContainer
              key={mapKey}
              center={bulawayoCenter}
              zoom={initialZoom}
              minZoom={8}
              maxZoom={14}
              scrollWheelZoom
              className="no2-map"
              whenCreated={(map) => {
                mapRef.current = map;

                // If user unchecks Wards boundary in the control, clear highlight + popup
                map.on("overlayremove", (e: any) => {
                  if (e.name === "Wards boundary") {
                    setSelectedWard(null);
                    setSelectedWardId(null);
                    setSelectedWardOptionId("");
                    lastPopupRef.current = null;
                    map.closePopup();
                  }
                });
              }}
            >
              <LayersControl position="topright">
                {/* Base layers */}
                <BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                </BaseLayer>

                <BaseLayer name="Carto Dark">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                  />
                </BaseLayer>

                <BaseLayer name="Satellite (Esri World Imagery)">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  />
                </BaseLayer>

                {/* Wards boundary */}
                {activeGasData?.geojson && !isOzone && (
                  <Overlay checked name="Wards boundary">
                    <GeoJSON
                      data={activeGasData.geojson}
                      style={wardStyle}
                      onEachFeature={(feature, layer) =>
                        onEachWard(
                          feature,
                          layer,
                          selectedGas,
                          activeGasData.catField
                        )
                      }
                    />
                  </Overlay>
                )}

                {isOzone && gasData.NO2?.geojson && (
                  <Overlay checked name="Wards boundary">
                    <GeoJSON
                      data={gasData.NO2.geojson}
                      style={wardStyle}
                      onEachFeature={(feature, layer) =>
                        onEachWard(feature, layer, "O3", "")
                      }
                    />
                  </Overlay>
                )}

                {/* Industrial zones */}
                {industrialGeojson && (
                  <Overlay name="Industrial zones">
                    <GeoJSON
                      data={industrialGeojson}
                      style={industrialStyle}
                      onEachFeature={onEachIndustrial}
                    />
                  </Overlay>
                )}

                {/* Major highways */}
                {roadsGeojson && (
                  <Overlay name="Major highways">
                    <GeoJSON
                      data={roadsGeojson}
                      style={roadsStyle}
                      onEachFeature={onEachRoad}
                    />
                  </Overlay>
                )}
              </LayersControl>

              {/* Active gas raster tiles – reduce opacity for O3 */}
              {currentGasConfig && gasVisible && (
                <TileLayer
                  key={currentGasConfig.key}
                  url={currentGasConfig.tilePath}
                  opacity={selectedGas === "O3" ? 0.55 : 1}
                  zIndex={500}
                  minNativeZoom={8}
                  maxNativeZoom={12}
                />
              )}

              {/* Wind-driven plume lines – only for NO2, CH4, CO */}
              {showPlumes &&
                !isOzone &&
                plumeHotspots.length > 0 &&
                plumeHotspots.map((h: any) => {
                  const seg = buildPlumeSegment(h.feature);
                  if (!seg) return null;
                  const fid = h.feature.properties?.fid;
                  return (
                    <React.Fragment key={fid ?? Math.random()}>
                      <Polyline
                        positions={[seg.start, seg.end]}
                        pathOptions={{
                          weight: 2.5,
                          opacity: 0.95,
                        }}
                        className="no2-plume-path"
                      />
                      <CircleMarker
                        center={seg.start}
                        radius={4}
                        pathOptions={{
                          weight: 1,
                          opacity: 1,
                          fillOpacity: 1,
                        }}
                        className="no2-plume-origin"
                      />
                    </React.Fragment>
                  );
                })}

              <ScaleControl position="bottomleft" />
            </MapContainer>

            {/* Gas switcher */}
            <div className="no2-gas-switcher">
              <button
                type="button"
                className="no2-gas-switcher-pill"
                onClick={() => setGasSwitcherExpanded((prev) => !prev)}
              >
                <span className="no2-gas-pill-icon" />
                <span className="no2-gas-pill-label">
                  {currentGasConfig.label}
                </span>
              </button>

              <div
                className={
                  "no2-gas-switcher-panel" +
                  (gasSwitcherExpanded ? " open" : "")
                }
              >
                <span className="no2-gas-switcher-label">Gas layer</span>
                <div className="no2-gas-switcher-buttons">
                  {(Object.values(GAS_CONFIG) as any[]).map((gas) => (
                    <button
                      key={gas.key}
                      type="button"
                      className={`no2-gas-button ${
                        selectedGas === gas.key && gasVisible ? "active" : ""
                      }`}
                      onClick={() => handleGasButtonClick(gas.key as GasKey)}
                    >
                      <span
                        className="no2-gas-dot"
                        style={{ backgroundColor: gas.dotColor }}
                      />
                      {gas.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gas legend */}
            <div className="no2-legend">
              <h2>{currentGasConfig.legendTitle}</h2>
              <p className="no2-legend-sub">
                <span>{currentGasConfig.legendSub.left}</span>
                <span>{currentGasConfig.legendSub.right}</span>
              </p>
              <div
                className="no2-legend-gradient"
                style={{ background: currentGasConfig.gradient }}
              />
              <div className="no2-legend-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Wind plume toggle */}
            <div className="no2-plume-toggle">
              <button
                type="button"
                onClick={() => setShowPlumes((v) => !v)}
                className={showPlumes ? "active" : ""}
                disabled={isOzone}
              >
                <span className="no2-plume-toggle-dot" />
                {isOzone
                  ? "Wind plumes off for ozone"
                  : showPlumes
                  ? `Stop wind-driven ${currentGasConfig.label} plumes`
                  : `Animate wind-driven ${currentGasConfig.label} plumes`}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Dashboard sidebar */}
        <aside className="no2-sidebar">
          <header className="no2-sidebar-header">
            <div className="no2-sidebar-header-top">
              <div>
                <h1>Urban air pollution over Bulawayo</h1>
                <p className="no2-current-gas">
                  Currently showing:{" "}
                  <strong>{currentGasConfig.longName}</strong>
                  {!gasVisible && " (map layer hidden)"}
                </p>
              </div>
              <button
                type="button"
                className="no2-expand-toggle"
                onClick={() => setSidebarExpanded((v) => !v)}
              >
                {sidebarExpanded ? "Show map & dashboard" : "Expand dashboard"}
              </button>
            </div>
            <p>
              This dashboard is a climate and environment decision-support tool
              for Bulawayo. It combines two short-lived urban air pollutants
              (NO₂ and CO), one potent greenhouse gas (CH₄) and a total-column
              ozone layer (O₃) to help interpret patterns of exposure and
              background chemistry over the city.
            </p>
          </header>

          {/* Ward search / jump-to-ward */}
          <section className="no2-ward-search">
            <label htmlFor="ward-select" className="no2-ward-search-label">
              Jump to ward
            </label>
            <select
              id="ward-select"
              className="no2-ward-select"
              value={selectedWardOptionId}
              onChange={handleWardSelectChange}
              disabled={isOzone || wardOptions.length === 0}
            >
              <option value="">
                {isOzone
                  ? "Ward search disabled for ozone"
                  : "Select a ward…"}
              </option>
              {!isOzone &&
                wardOptions.map((w) => (
                  <option key={w.id ?? w.name} value={w.id}>
                    {w.name}
                  </option>
                ))}
            </select>
            {isOzone && (
              <p className="no2-ozone-note">
                Use NO₂, CO or CH₄ for ward detail. O₃ acts as a regional
                chemistry backdrop rather than a ward-level exposure layer.
              </p>
            )}
          </section>

          {/* Global key numbers */}
          <section className="no2-stats">
            {isOzone ? (
              <>
                <h2>Ozone context</h2>
                <p className="no2-ozone-note">
                  O₃ is shown as a total column from Sentinel-5P. It forms in
                  the atmosphere from other gases and is used here as a
                  background chemistry not as a ward exposure metric.
                </p>
              </>
            ) : (
              <>
                <h2>Key numbers ({currentGasConfig.label} ward statistics)</h2>
                <div className="no2-stat-grid">
                  <div className="no2-stat-card">
                    <span className="no2-stat-label">
                      Max ward mean {currentGasConfig.label}
                    </span>
                    <span className="no2-stat-value">
                      {summaryStats ? formatValue(summaryStats.maxMean) : "…"}
                    </span>
                  </div>
                  <div className="no2-stat-card">
                    <span className="no2-stat-label">
                      Min ward mean {currentGasConfig.label}
                    </span>
                    <span className="no2-stat-value">
                      {summaryStats ? formatValue(summaryStats.minMean) : "…"}
                    </span>
                  </div>
                  <div className="no2-stat-card">
                    <span className="no2-stat-label">
                      Wards with high / very high {currentGasConfig.label}
                    </span>
                    <span className="no2-stat-value">
                      {summaryStats ? summaryStats.highWardCount : "…"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Selected ward details – only for NO2, CH4, CO */}
          {selectedWard && !isOzone && (
            <section className="no2-selected-ward">
              <h2>Selected ward ({currentGasConfig.label} exposure)</h2>
              <p className="no2-selected-name">{selectedWard.name}</p>
              <div className="no2-selected-grid">
                <div>
                  <span className="no2-selected-label">
                    Mean {currentGasConfig.label}
                  </span>
                  <span className="no2-selected-value">
                    {formatValue(selectedWard.mean)}
                  </span>
                </div>
                <div>
                  <span className="no2-selected-label">
                    Max {currentGasConfig.label}
                  </span>
                  <span className="no2-selected-value">
                    {formatValue(selectedWard.max)}
                  </span>
                </div>
                <div>
                  <span className="no2-selected-label">Category</span>
                  <span className="no2-selected-value">
                    {selectedWard.cat || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="no2-selected-label">WHO guideline</span>
                  <span className="no2-selected-value">
                    {selectedWard.gasKey === "NO2"
                      ? exceedsWHO(selectedWard.mean)
                        ? "Above guideline ⚠"
                        : "At / below guideline ✅"
                      : "N/A (NO₂-only guideline)"}
                  </span>
                </div>
                <div>
                  <span className="no2-selected-label">Population</span>
                  <span className="no2-selected-value">
                    {formatPopulation(selectedWard.population)}
                  </span>
                </div>
                <div>
                  <span className="no2-selected-label">Exposure index</span>
                  <span className="no2-selected-value">
                    {formatExposure(selectedWard.exposure)}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Hotspots / Exposure priority list */}
          <section className="no2-hotspots">
            {isOzone ? (
              <>
                <h2>How to read O₃</h2>
                <p className="no2-ozone-note">
                  Scan the O₃ tiles with NO₂, CO and CH₄. High ozone background
                  together with repeated gas hotspots can point to air masses
                  that are both polluted and chemically active around Bulawayo,
                  rather than a single local source.
                </p>
              </>
            ) : (
              <>
                <div className="no2-hotspots-header-row">
                  <h2>
                    {priorityMode === "no2"
                      ? `Top ${currentGasConfig.label} hotspots`
                      : "Top exposure hotspots"}
                  </h2>
                  <div className="no2-mode-toggle">
                    <button
                      type="button"
                      className={priorityMode === "no2" ? "active" : ""}
                      onClick={() => setPriorityMode("no2")}
                    >
                      {currentGasConfig.label}
                    </button>
                    <button
                      type="button"
                      className={priorityMode === "exposure" ? "active" : ""}
                      onClick={() => setPriorityMode("exposure")}
                    >
                      Exposure
                    </button>
                  </div>
                </div>

                <p className="no2-hotspots-note">
                  Switch between gas hotspots and exposure hotspots to see where
                  pollution and people overlap.
                </p>

                <ul className="no2-hotspot-list">
                  {activeHotspotList.length === 0 && <li>Loading hotspots…</li>}
                  {activeHotspotList.map((h: any) => {
                    const props = h.feature.properties || {};
                    const name = getWardName(props);
                    const isActive = selectedWardId === props.fid;
                    const exposureHybrid = props.Exposure_idx;
                    const population = props.BYO_population;

                    return (
                      <li
                        key={props.fid ?? name}
                        className={
                          isActive
                            ? "no2-hotspot-item active"
                            : "no2-hotspot-item"
                        }
                        onClick={() =>
                          handleHotspotClick(
                            h,
                            selectedGas,
                            activeGasData?.catField
                          )
                        }
                      >
                        <div className="no2-hotspot-main">
                          <span className="no2-hotspot-name">{name}</span>
                          <span className="no2-hotspot-cat">
                            {props[activeGasData?.catField] || "N/A"}
                          </span>
                        </div>

                        {priorityMode === "no2" ? (
                          <div className="no2-hotspot-mean">
                            Mean {currentGasConfig.label}:{" "}
                            {formatValue(props._mean)}
                          </div>
                        ) : (
                          <div className="no2-hotspot-mean">
                            Exposure index:{" "}
                            {formatExposure(exposureHybrid)} • Pop:{" "}
                            {formatPopulation(population)}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>

          {/* Read more – data, methods, wind, badge */}
          <section
            className={
              "no2-readmore" + (showReadMore ? " no2-readmore-open" : "")
            }
          >
            <button
              type="button"
              className="no2-readmore-toggle"
              onClick={() => setShowReadMore((v) => !v)}
            >
              {showReadMore ? "Hide read more" : "Read more"}
            </button>

            {showReadMore && (
              <div className="no2-readmore-body">
                <h2>Data & methods</h2>
                <p>
                  Gas layers are Sentinel-5P TROPOMI column densities processed
                  and tiled per gas. For NO₂, CO and CH₄, ward statistics and
                  exposure indices are computed using zonal statistics over
                  Bulawayo wards and a composite index that normalises gas
                  values, total population and population density (0–1). Ozone
                  (O₃) is shown only as a total-column tile layer and is not
                  converted into ward exposure metrics. Contextual layers
                  include industrial polygons and major highways digitised for
                  Bulawayo.
                </p>

                <h2>Wind & dispersion context</h2>
                <p>
                  Long-term wind climatology for Bulawayo (
                  {WIND_SUMMARY.periodLabel}) shows:
                </p>
                <ul className="no2-wind-list">
                  <li>
                    Average wind speed:{" "}
                    <strong>{WIND_SUMMARY.meanSpeed.toFixed(2)} m/s</strong>
                  </li>
                  <li>
                    Prevailing wind direction:{" "}
                    <strong>{WIND_SUMMARY.directionShort}</strong>
                  </li>
                </ul>
                <p>
                  The wind plume tool draws simple ESE → WNW segments from the
                  most polluted wards. Use it to see where gas plumes tend to
                  drift over time, as particles are carried by the prevailing
                  wind. Comparing plume directions with NO₂, CO and CH₄
                  hotspots helps identify downwind wards that are repeatedly
                  exposed even if emissions start somewhere else.
                </p>

                <div className="no2-wind-arrow">
                  <span className="no2-wind-arrow-label">ESE</span>
                  <span className="no2-wind-arrow-body">
                    <span className="no2-wind-arrow-line" />
                    <span className="no2-wind-arrow-head">➜</span>
                  </span>
                  <span className="no2-wind-arrow-label">WNW</span>
                </div>

                <p className="no2-readmore-footer">
                  Sentinel-5P • Urban air pollution, chemistry & climate •
                  Decision-support
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AirQuality;
