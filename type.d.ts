declare module "*.json" {
    import { GeoJSONFeatureCollection } from "./types";
    const value: GeoJSONFeatureCollection;
    export default value;
  }