export type SpaceType = 'hall' | 'bedroom' | 'kitchen' | 'garden';

export type RoomStyle = 'minimal' | 'modern' | 'scandinavian' | 'bohemian';

export type LightingMood = 'morning' | 'afternoon' | 'golden' | 'evening';

export type CameraPreset = 'isometric' | 'front' | 'top' | 'lounge';

export type FurnitureItem = 
  | 'sofa' 
  | 'coffeeTable' 
  | 'armchair' 
  | 'floorLamp' 
  | 'plant'
  | 'bed'
  | 'nightstand'
  | 'bench'
  | 'kitchenIsland'
  | 'barstool'
  | 'patioTable'
  | 'patioChair'
  | 'gardenTree';

export type LayoutPreset = 'default' | 'conversational' | 'open' | 'reading';

export type CustomizerTab = 'space' | 'style' | 'materials' | 'color' | 'placement' | 'lighting';

export type MaterialCategory = 'sofaFabric' | 'woodFinish' | 'tableSurface' | 'chairFabric' | 'beddingFabric' | 'countertopSurface' | 'cabinetFinish' | 'deckTimber';

export type SofaModelType = 'contemporary' | 'minimalist' | 'tufted';
export type TableModelType = 'round' | 'square' | 'oval';
export type BedModelType = 'platform' | 'tufted' | 'wood';
export type KitchenIslandType = 'waterfall' | 'minimalist' | 'butcher';
export type GardenSetType = 'dining' | 'lounge' | 'firepit';

export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  category: MaterialCategory;
}

export interface WallColor {
  id: string;
  name: string;
  hex: string;
  classBg: string;
}

export interface DemoFormData {
  fullName: string;
  email: string;
  roomType: string;
  planInterest: string;
  message: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  roomType?: string;
}

// Workspace CAD Studio Types
export type WorkspaceCategory = 'living' | 'dining' | 'bedroom' | 'decor' | 'build';

export type FloorFinishType = 'oak' | 'mocha' | 'marble' | 'herringbone' | 'concrete';

export interface CatalogFurnitureItem {
  id: string;
  name: string;
  category: 'living' | 'dining' | 'bedroom' | 'decor';
  subtitle: string;
  defaultColor: string;
  defaultMaterial: string;
  defaultDims: { widthMm: number; depthMm: number; heightMm: number };
  priceEst: number;
  tags: string[];
}

export interface PlacedFurnitureObject {
  id: string;
  catalogId: string;
  name: string;
  category: 'living' | 'dining' | 'bedroom' | 'decor';
  x: number;
  z: number;
  y: number; // elevation above floor
  rotY: number; // rotation in radians
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  color: string;
  material: string;
  style: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  isWishlisted: boolean;
}

export interface RoomDimensions {
  width: number;  // in meters (e.g. 5.5)
  length: number; // in meters (e.g. 6.0)
  height: number; // in meters (e.g. 2.8)
}

export interface WorkspaceHistorySnapshot {
  placedObjects: PlacedFurnitureObject[];
  roomDimensions: RoomDimensions;
  wallColor: string;
  floorFinish: FloorFinishType;
}

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roomType: 'living' | 'dining' | 'bedroom' | 'kitchen' | 'studio';
  roomDimensions: RoomDimensions;
  wallColor: string;
  floorFinish: FloorFinishType;
  placedObjects: PlacedFurnitureObject[];
  itemCount: number;
  totalCostEst: number;
}
