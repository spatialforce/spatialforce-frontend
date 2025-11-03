// Updated GeoJSON Type Definitions
type GeoJSONFeature = {
    type: 'Feature';
    geometry: {
      type: 'Point' | 'Polygon' | 'MultiPolygon';
      coordinates: number[] | number[][] | number[][][];
    };
    properties: {
      // Common properties from your point features
      Name?: string;
      descriptio?: string;
      timestamp?: string;
      begin?: string;
      end?: string;
      altitudeMo?: string;
      tessellate?: number;
      extrude?: number;
      visibility?: number;
      drawOrder?: number | null;
      icon?: string;
      snippet?: string;
      
      // Properties from your polygon features
      fid?: number;
      OBJECTID_1?: number;
      admin3Name?: string;
      admin3Pcod?: string;
      admin2Name?: string;
      admin2Pcod?: string;
      admin1Name?: string;
      admin1Pcod?: string;
      Shape_Leng?: number;
      Shape_Area?: number;
      case_recor?: string;
      num_of_Cas?: string;
      hotspot?: string;
      
      // Catch-all for any other properties
      [key: string]: any;
    };
  };
  
  type GeoJSONFeatureCollection = {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
  };