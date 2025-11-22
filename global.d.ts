declare module "lucide-react" {
    import * as React from "react";
  
    export interface LucideProps extends React.SVGProps<SVGSVGElement> {
      size?: string | number;
      color?: string;
      absoluteStrokeWidth?: boolean;
    }
  
    export type Icon = React.ForwardRefExoticComponent<
      LucideProps & React.RefAttributes<SVGSVGElement>
    >;
  
    export const Map: Icon;
    export const Globe: Icon;
    export const Layers: Icon;
    export const Building: Icon;
    export const TreePine: Icon;
    export const Users: Icon;
    export const Shield: Icon;
    export const Cpu: Icon;
    export const Database: Icon;
    export const Cloud: Icon;
    export const Compass: Icon;
    export const Camera: Icon;
    export const Sun: Icon;
    export const Moon: Icon;
    export const Bell: Icon;
    export const Home: Icon;
    export const Settings: Icon;
    export const Search: Icon;
    export const Check: Icon;
    export const AlertTriangle: Icon;
    export const Info: Icon;
    export const X: Icon;
    export const Menu: Icon;
    export const ChevronDown: Icon;
    export const ChevronUp: Icon;
    export const ChevronRight: Icon;
    export const ChevronLeft: Icon;
    export const Star: Icon;
    export const Heart: Icon;
    export const Globe2: Icon;
    export const Layers3: Icon;
    export const MapPin: Icon;
    export const Target: Icon;
    export const ZoomIn: Icon;
    export const ZoomOut: Icon;
    export const ArrowRight: Icon;
    export const ArrowLeft: Icon;
    export const ArrowUp: Icon;
    export const ArrowDown: Icon;
    export const Trash: Icon;
    export const Edit: Icon;
    export const Upload: Icon;
    export const Download: Icon;
    export const Folder: Icon;
    export const Image: Icon;
    export const Plus: Icon;
    export const Minus: Icon;
    export const RefreshCw: Icon;
    export const RefreshCcw: Icon;
    export const Clipboard: Icon;
    export const Share: Icon;
    export const Link: Icon;
    export const ExternalLink: Icon;
  }
  