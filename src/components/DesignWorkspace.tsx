import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import confetti from 'canvas-confetti';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Camera,
  Trash2,
  Copy,
  RotateCw,
  Move,
  Heart,
  Palette,
  Layers,
  Sparkles,
  Check,
  Search,
  Plus,
  RefreshCw,
  X,
  Grid,
  Save,
  FolderOpen,
  Download,
  Upload,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Home,
  Eye
} from 'lucide-react';
import type {
  WorkspaceCategory,
  CatalogFurnitureItem,
  PlacedFurnitureObject,
  RoomDimensions,
  FloorFinishType,
  WorkspaceHistorySnapshot,
  SavedDesign
} from '../types';
import {
  CATALOG_ITEMS,
  DESIGNER_COLORS,
  MATERIAL_FINISHES,
  FLOOR_FINISHES,
  SAMPLE_ROOM_PRESETS
} from '../utils/furnitureCatalog';
import { buildFurniture3DGroup } from '../utils/furniture3D';

interface DesignWorkspaceProps {
  onSelectPlanInterest?: (styleName: string) => void;
  className?: string;
}

export const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({ onSelectPlanInterest, className = '' }) => {
  // --- Workspace Layout States ---
  const [activeCategory, setActiveCategory] = useState<WorkspaceCategory>('living');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [is2DMode, setIs2DMode] = useState<boolean>(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState<boolean>(false);
  const [showFloorModal, setShowFloorModal] = useState<boolean>(false);
  const [showWallColorModal, setShowWallColorModal] = useState<boolean>(false);
  const [showSpacePlanDropdown, setShowSpacePlanDropdown] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showSavedDesignsModal, setShowSavedDesignsModal] = useState<boolean>(false);
  const [isCatalogExpanded, setIsCatalogExpanded] = useState<boolean>(true);
  const [rightPanelTab, setRightPanelTab] = useState<'customize' | 'dimensions'>('customize');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [lightingMood, setLightingMood] = useState<'day' | 'golden' | 'evening'>('day');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active space plan tracking & room focus view
  const [activeSpacePlan, setActiveSpacePlan] = useState<string>('full-apartment-residence');
  const [cameraFocusZone, setCameraFocusZone] = useState<'all' | 'living' | 'dining' | 'kitchen' | 'entry'>('all');

  // --- 3D Room Config (Full Residence Floorplan matching Image 2) ---
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
    width: 9.5,
    length: 9.5,
    height: 2.5
  });
  const [wallColor, setWallColor] = useState<string>('#F5EFEB'); // Alabaster Cream
  const [floorFinish, setFloorFinish] = useState<FloorFinishType>('oak');

  // --- Placed Objects & Selection (Default: Full Multi-Room Residence matching Image 2) ---
  const [placedObjects, setPlacedObjects] = useState<PlacedFurnitureObject[]>(() => {
    const defaultPreset = SAMPLE_ROOM_PRESETS[0]; // full-apartment-residence
    return defaultPreset.items.map((it, idx) => ({
      ...it,
      id: `obj-init-${Date.now()}-${idx}`
    }));
  });
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(placedObjects[0]?.id || null);

  // --- Saved Designs in Browser Storage ---
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(() => {
    try {
      const stored = localStorage.getItem('spaceplan_saved_designs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'saved-full-apartment',
        name: 'Full Multi-Room Residence (Image 2)',
        createdAt: 'Nov 15, 2026, 10:30 AM',
        updatedAt: 'Nov 15, 2026, 10:30 AM',
        roomType: 'living',
        roomDimensions: { width: 9.5, length: 9.5, height: 2.5 },
        wallColor: '#F5EFEB',
        floorFinish: 'oak',
        placedObjects: SAMPLE_ROOM_PRESETS[0].items.map((it, idx) => ({ ...it, id: `seed-apt-${idx}` })),
        itemCount: SAMPLE_ROOM_PRESETS[0].items.length,
        totalCostEst: 14850
      },
      {
        id: 'saved-mocha-living',
        name: 'Roasted Mocha Living Lounge Suite',
        createdAt: 'Nov 15, 2026, 09:15 AM',
        updatedAt: 'Nov 15, 2026, 09:15 AM',
        roomType: 'living',
        roomDimensions: { width: 9.5, length: 9.5, height: 2.5 },
        wallColor: '#F5EFEB',
        floorFinish: 'oak',
        placedObjects: SAMPLE_ROOM_PRESETS[1].items.map((it, idx) => ({ ...it, id: `seed-liv-${idx}` })),
        itemCount: SAMPLE_ROOM_PRESETS[1].items.length,
        totalCostEst: 5120
      }
    ];
  });

  // Save Modal Form State
  const [designNameInput, setDesignNameInput] = useState<string>('Full Residence Multi-Room Design');
  const [designRoomTypeInput, setDesignRoomTypeInput] = useState<'living' | 'dining' | 'bedroom' | 'kitchen' | 'studio'>('living');

  // --- Undo / Redo History Stack ---
  const [history, setHistory] = useState<WorkspaceHistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // --- Three.js Refs ---
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Three.js Scene Components
  const roomGroupRef = useRef<THREE.Group | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const floorGridRef = useRef<THREE.GridHelper | null>(null);
  const wallGroupRef = useRef<THREE.Group | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Dragging State on Canvas
  const isDraggingObjectRef = useRef<boolean>(false);
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Screen coordinates for floating contextual action toolbar
  const [floatingToolbarPos, setFloatingToolbarPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });

  const selectedObject = placedObjects.find((o) => o.id === selectedObjectId) || null;

  // Show quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Push current state to undo history
  const pushHistorySnapshot = useCallback(
    (newPlaced: PlacedFurnitureObject[], newDims = roomDimensions, newWall = wallColor, newFloor = floorFinish) => {
      const snap: WorkspaceHistorySnapshot = {
        placedObjects: JSON.parse(JSON.stringify(newPlaced)),
        roomDimensions: { ...newDims },
        wallColor: newWall,
        floorFinish: newFloor
      };

      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, snap];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, roomDimensions, wallColor, floorFinish]
  );

  // Undo Action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevSnap = history[historyIndex - 1];
      setPlacedObjects(JSON.parse(JSON.stringify(prevSnap.placedObjects)));
      setRoomDimensions(prevSnap.roomDimensions);
      setWallColor(prevSnap.wallColor);
      setFloorFinish(prevSnap.floorFinish);
      setHistoryIndex(historyIndex - 1);
      showToast('Undo action restored');
    }
  }, [history, historyIndex]);

  // Redo Action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextSnap = history[historyIndex + 1];
      setPlacedObjects(JSON.parse(JSON.stringify(nextSnap.placedObjects)));
      setRoomDimensions(nextSnap.roomDimensions);
      setWallColor(nextSnap.wallColor);
      setFloorFinish(nextSnap.floorFinish);
      setHistoryIndex(historyIndex + 1);
      showToast('Redo action restored');
    }
  }, [history, historyIndex]);

  // Initialize first snapshot on mount
  useEffect(() => {
    if (history.length === 0) {
      const initialSnap: WorkspaceHistorySnapshot = {
        placedObjects: JSON.parse(JSON.stringify(placedObjects)),
        roomDimensions: { ...roomDimensions },
        wallColor,
        floorFinish
      };
      setHistory([initialSnap]);
      setHistoryIndex(0);
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedObjectId) {
          e.preventDefault();
          handleDeleteObject(selectedObjectId);
        }
      } else if (e.key === 'Escape') {
        setSelectedObjectId(null);
        setShowSpacePlanDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedObjectId]);

  // --- Three.js Scene Setup & Render Loop ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF7F2');
    sceneRef.current = scene;

    // 2. Perspective Camera (Isometric view matching Image 2)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(11.5, 10.5, 12.8);
    cameraRef.current = camera;

    // 3. Orthographic Camera (2D Blueprint)
    const aspect = width / height;
    const frustumSize = 14;
    const orthoCam = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );
    orthoCam.position.set(0, 18, 0);
    orthoCam.lookAt(0, 0, 0);
    orthoCameraRef.current = orthoCam;

    // 4. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 4;
    controls.maxDistance = 28;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // 6. Lighting Suite (Sunlight matching clean bright architectural render in Image 2)
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.95);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight('#FFFDF7', '#EDE6DC', 0.65);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight('#FFF9EE', 2.2);
    dirLight.position.set(8, 16, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -9;
    dirLight.shadow.camera.right = 9;
    dirLight.shadow.camera.top = 9;
    dirLight.shadow.camera.bottom = -9;
    dirLight.shadow.bias = -0.0003;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 7. Architectural Room Container
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    roomGroupRef.current = roomGroup;

    // Floor Mesh
    const floorGeo = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.length);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#DFD3C3',
      roughness: 0.65,
      metalness: 0.02
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'room-floor';
    roomGroup.add(floor);
    floorMeshRef.current = floor;

    // Floor CAD Grid
    const grid = new THREE.GridHelper(roomDimensions.width, Math.round(roomDimensions.width * 2), '#5F4336', '#D6C7B8');
    grid.position.y = 0.005;
    roomGroup.add(grid);
    floorGridRef.current = grid;

    // Architectural Walls Container
    const wallGroup = new THREE.Group();
    roomGroup.add(wallGroup);
    wallGroupRef.current = wallGroup;

    // 8. Furniture Group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // 9. Glowing Cyan Selection Ring
    const ringGeo = new THREE.RingGeometry(0.85, 0.94, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#00E5FF',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.set(0, 0.012, 0);
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // 10. Animation Loop
    let lastTime = 0;
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      if (selectionRingRef.current && selectionRingRef.current.visible) {
        selectionRingRef.current.rotation.z += delta * 0.4;
      }

      controls.update();

      const activeCam = is2DMode && orthoCameraRef.current ? orthoCameraRef.current : camera;
      renderer.render(scene, activeCam);

      // 2D screen coordinates for floating gizmo
      if (selectedObjectId && cameraRef.current && containerRef.current) {
        const selObj = placedObjects.find((o) => o.id === selectedObjectId);
        if (selObj) {
          const worldPos = new THREE.Vector3(selObj.x, selObj.y + 0.85, selObj.z);
          worldPos.project(cameraRef.current);

          const hw = containerRef.current.clientWidth / 2;
          const hh = containerRef.current.clientHeight / 2;
          const sx = worldPos.x * hw + hw;
          const sy = -(worldPos.y * hh) + hh;

          if (worldPos.z < 1) {
            setFloatingToolbarPos({ x: sx, y: sy, visible: true });
          } else {
            setFloatingToolbarPos((p) => ({ ...p, visible: false }));
          }
        }
      } else {
        setFloatingToolbarPos((p) => ({ ...p, visible: false }));
      }
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      if (orthoCameraRef.current) {
        const asp = w / h;
        orthoCameraRef.current.left = (frustumSize * asp) / -2;
        orthoCameraRef.current.right = (frustumSize * asp) / 2;
        orthoCameraRef.current.top = frustumSize / 2;
        orthoCameraRef.current.bottom = frustumSize / -2;
        orthoCameraRef.current.updateProjectionMatrix();
      }

      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // --- Build Multi-Room Architectural Residence Shell (Image 2 Exact Architecture) ---
  useEffect(() => {
    if (!roomGroupRef.current || !floorMeshRef.current || !floorGridRef.current || !wallGroupRef.current) return;

    // 1. Resize Floor
    floorMeshRef.current.geometry.dispose();
    floorMeshRef.current.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.length);

    // 2. Resize CAD Grid
    roomGroupRef.current.remove(floorGridRef.current);
    floorGridRef.current.dispose();
    const newGrid = new THREE.GridHelper(
      roomDimensions.width,
      Math.round(roomDimensions.width * 2),
      '#5F4336',
      '#D6C7B8'
    );
    newGrid.position.y = 0.005;
    newGrid.visible = showGrid;
    roomGroupRef.current.add(newGrid);
    floorGridRef.current = newGrid;

    // 3. Clear and Rebuild Multi-Room Cutaway Walls (Matching Image 2!)
    while (wallGroupRef.current.children.length > 0) {
      const c = wallGroupRef.current.children[0];
      wallGroupRef.current.remove(c);
      if (c instanceof THREE.Mesh) c.geometry.dispose();
    }

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.85,
      side: THREE.DoubleSide
    });

    const brickAccentMat = new THREE.MeshStandardMaterial({
      color: '#8D5B4C', // Dining brick accent wall as seen in Image 2!
      roughness: 0.9
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: '#1F2421',
      roughness: 0.7
    });

    const halfW = roomDimensions.width / 2;
    const halfL = roomDimensions.length / 2;
    const wallH = roomDimensions.height;
    const wallThick = 0.28;

    // --- A. EXTERIOR PERIMETER WALLS (Cutaway height to look into apartment) ---
    // Back Wall (full height with window opening in dining & kitchen)
    const backWallLeft = new THREE.Mesh(new THREE.BoxGeometry(halfW - 0.5, wallH, wallThick), brickAccentMat);
    backWallLeft.position.set(-halfW / 2 - 0.25, wallH / 2, -halfL - wallThick / 2);
    backWallLeft.receiveShadow = true;

    const backWallRight = new THREE.Mesh(new THREE.BoxGeometry(halfW + 0.5, wallH, wallThick), wallMat);
    backWallRight.position.set(halfW / 2 - 0.25, wallH / 2, -halfL - wallThick / 2);
    backWallRight.receiveShadow = true;
    wallGroupRef.current.add(backWallLeft, backWallRight);

    // Left Exterior Wall (Dining & Living side)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomDimensions.length), wallMat);
    leftWall.position.set(-halfW - wallThick / 2, wallH / 2, 0);
    leftWall.receiveShadow = true;
    wallGroupRef.current.add(leftWall);

    // Right Exterior Wall (Kitchen & Entry side - cutaway doorway)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, halfL + 1.0), wallMat);
    rightWall.position.set(halfW + wallThick / 2, wallH / 2, -halfL / 2 + 0.5);
    rightWall.receiveShadow = true;
    wallGroupRef.current.add(rightWall);

    // Front Exterior Wall (Low cutaway so interior living room is 100% visible)
    const frontWallLow = new THREE.Mesh(new THREE.BoxGeometry(roomDimensions.width, 0.45, wallThick), wallMat);
    frontWallLow.position.set(0, 0.225, halfL + wallThick / 2);
    frontWallLow.receiveShadow = true;
    wallGroupRef.current.add(frontWallLow);

    // --- B. INTERIOR PARTITION WALLS (Creating the distinct room zones as in Image 2!) ---
    // 1. Partition dividing Dining Room (back-left) from Kitchen (back-right)
    const diningKitchenPartition = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, 2.8), wallMat);
    diningKitchenPartition.position.set(-0.1, wallH / 2, -halfL + 1.4);
    diningKitchenPartition.receiveShadow = true;
    wallGroupRef.current.add(diningKitchenPartition);

    // 2. Kitchen Pass-Through Half-Wall (dividing kitchen from hallway)
    const kitchenHalfWall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.15, wallThick), wallMat);
    kitchenHalfWall.position.set(2.4, 0.575, -halfL + 3.8);
    kitchenHalfWall.receiveShadow = true;
    const kitchenCounterTop = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, wallThick + 0.12), darkTrimMat);
    kitchenCounterTop.position.set(2.4, 1.17, -halfL + 3.8);
    wallGroupRef.current.add(kitchenHalfWall, kitchenCounterTop);

    // 3. Hallway / Staircase Dividing Partition
    const stairWellPartition = new THREE.Mesh(new THREE.BoxGeometry(wallThick, 1.15, 2.8), wallMat);
    stairWellPartition.position.set(halfW - 3.2, 0.575, 1.4);
    stairWellPartition.receiveShadow = true;
    wallGroupRef.current.add(stairWellPartition);

    // 4. Update Floor Finish Material
    const selectedFloor = FLOOR_FINISHES.find((f) => f.id === floorFinish) || FLOOR_FINISHES[0];
    const floorMat = floorMeshRef.current.material as THREE.MeshStandardMaterial;
    floorMat.color.set(selectedFloor.color);
    floorMat.roughness = selectedFloor.roughness;
    floorMat.needsUpdate = true;
  }, [roomDimensions, wallColor, floorFinish, showGrid]);

  // --- Synchronize Placed Objects to Three.js Meshes ---
  useEffect(() => {
    const furnitureGroup = furnitureGroupRef.current;
    if (!furnitureGroup) return;

    while (furnitureGroup.children.length > 0) {
      const child = furnitureGroup.children[0];
      furnitureGroup.remove(child);
      child.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose();
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else c.material.dispose();
        }
      });
    }

    placedObjects.forEach((obj) => {
      const group3D = buildFurniture3DGroup(obj);
      furnitureGroup.add(group3D);
    });

    const ring = selectionRingRef.current;
    if (ring) {
      if (selectedObjectId) {
        const selObj = placedObjects.find((o) => o.id === selectedObjectId);
        if (selObj) {
          ring.position.set(selObj.x, 0.015, selObj.z);
          const radiusScale = Math.max(selObj.widthMm, selObj.depthMm) / 1000 / 1.8;
          ring.scale.set(radiusScale, radiusScale, 1);
          ring.visible = true;
        } else {
          ring.visible = false;
        }
      } else {
        ring.visible = false;
      }
    }
  }, [placedObjects, selectedObjectId]);

  // --- Lighting Mood Sync ---
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current || !sceneRef.current) return;

    if (lightingMood === 'day') {
      dirLightRef.current.color.set('#FFF9EE');
      dirLightRef.current.intensity = 2.2;
      dirLightRef.current.position.set(8, 16, 8);
      ambientLightRef.current.intensity = 0.95;
      hemiLightRef.current.color.set('#FFFDF7');
      sceneRef.current.background = new THREE.Color('#FAF7F2');
    } else if (lightingMood === 'golden') {
      dirLightRef.current.color.set('#FFB76B');
      dirLightRef.current.intensity = 2.8;
      dirLightRef.current.position.set(10, 8, 5);
      ambientLightRef.current.intensity = 0.7;
      hemiLightRef.current.color.set('#FFE2BA');
      sceneRef.current.background = new THREE.Color('#F7EFE8');
    } else if (lightingMood === 'evening') {
      dirLightRef.current.color.set('#4B6584');
      dirLightRef.current.intensity = 0.8;
      dirLightRef.current.position.set(4, 9, 5);
      ambientLightRef.current.intensity = 0.45;
      hemiLightRef.current.color.set('#273C75');
      sceneRef.current.background = new THREE.Color('#1F2428');
    }
  }, [lightingMood]);

  // --- Camera Focus Between Room Zones (Living, Dining, Kitchen, Entry, All) ---
  const handleFocusZone = (zone: 'all' | 'living' | 'dining' | 'kitchen' | 'entry') => {
    setCameraFocusZone(zone);
    if (!cameraRef.current || !controlsRef.current) return;

    setIs2DMode(false);
    if (zone === 'all') {
      cameraRef.current.position.set(11.5, 10.5, 12.8);
      controlsRef.current.target.set(0, 0.8, 0);
      showToast('Camera overview: Full Residence');
    } else if (zone === 'living') {
      cameraRef.current.position.set(2.8, 6.2, 5.8);
      controlsRef.current.target.set(-0.2, 0.6, 0.6);
      setActiveCategory('living');
      showToast('Camera focused on Living Lounge');
    } else if (zone === 'dining') {
      cameraRef.current.position.set(-1.0, 6.5, -0.2);
      controlsRef.current.target.set(-2.8, 0.8, -2.8);
      setActiveCategory('dining');
      showToast('Camera focused on Dining Room');
    } else if (zone === 'kitchen') {
      cameraRef.current.position.set(3.8, 6.5, -0.5);
      controlsRef.current.target.set(1.4, 0.8, -2.8);
      setActiveCategory('dining');
      showToast('Camera focused on Open Kitchen');
    } else if (zone === 'entry') {
      cameraRef.current.position.set(5.5, 6.0, 4.5);
      controlsRef.current.target.set(2.8, 0.8, 1.5);
      setActiveCategory('decor');
      showToast('Camera focused on Entryway & Stairs');
    }
  };

  // --- 2D / 3D Camera Switching ---
  const handleToggle2D3D = () => {
    const next2D = !is2DMode;
    setIs2DMode(next2D);
    if (!controlsRef.current || !cameraRef.current) return;

    if (next2D) {
      cameraRef.current.position.set(0.01, 18, 0.01);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.maxPolarAngle = 0.01;
      showToast('Switched to 2D Top Blueprint');
    } else {
      cameraRef.current.position.set(11.5, 10.5, 12.8);
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.04;
      showToast('Switched to 3D Isometric View');
    }
  };

  // Zoom Handlers
  const handleZoom = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target);
    offset.multiplyScalar(factor);
    cameraRef.current.position.copy(controlsRef.current.target).add(offset);
    setZoomLevel((prev) => Math.round(prev * (1 / factor)));
  };

  const handleResetCamera = () => {
    handleFocusZone('all');
    setZoomLevel(100);
  };

  // --- Canvas Pointer Selection & Dragging Across Any Room ---
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);

    if (!furnitureGroupRef.current) return;
    const intersects = raycasterRef.current.intersectObjects(furnitureGroupRef.current.children, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      let foundId: string | null = null;

      while (targetObj && targetObj !== furnitureGroupRef.current) {
        if (targetObj.userData && targetObj.userData.id) {
          foundId = targetObj.userData.id;
          break;
        }
        targetObj = targetObj.parent;
      }

      if (foundId) {
        setSelectedObjectId(foundId);
        isDraggingObjectRef.current = true;
        if (controlsRef.current) controlsRef.current.enabled = false;
      }
    } else {
      const floorIntersects = raycasterRef.current.intersectObject(floorMeshRef.current!);
      if (floorIntersects.length > 0) {
        setSelectedObjectId(null);
      }
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingObjectRef.current || !selectedObjectId || !containerRef.current || !cameraRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);

    const hit = new THREE.Vector3();
    if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, hit)) {
      const halfW = roomDimensions.width / 2 - 0.5;
      const halfL = roomDimensions.length / 2 - 0.5;
      const clampedX = Math.max(-halfW, Math.min(halfW, Number(hit.x.toFixed(2))));
      const clampedZ = Math.max(-halfL, Math.min(halfL, Number(hit.z.toFixed(2))));

      setPlacedObjects((prev) =>
        prev.map((o) => (o.id === selectedObjectId ? { ...o, x: clampedX, z: clampedZ } : o))
      );
    }
  };

  const handleCanvasPointerUp = () => {
    if (isDraggingObjectRef.current) {
      isDraggingObjectRef.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
      pushHistorySnapshot(placedObjects);
    }
  };

  // --- Drag & Drop from Bottom Catalog onto 3D Canvas ---
  const handleDropOnCanvas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const catalogId = e.dataTransfer.getData('text/plain');
    const catalogItem = CATALOG_ITEMS.find((it) => it.id === catalogId);
    if (!catalogItem || !containerRef.current || !cameraRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseVecRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);

    const hit = new THREE.Vector3();
    let dropX = 0;
    let dropZ = 0;

    if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, hit)) {
      const halfW = roomDimensions.width / 2 - 0.5;
      const halfL = roomDimensions.length / 2 - 0.5;
      dropX = Math.max(-halfW, Math.min(halfW, Number(hit.x.toFixed(2))));
      dropZ = Math.max(-halfL, Math.min(halfL, Number(hit.z.toFixed(2))));
    }

    const newObj: PlacedFurnitureObject = {
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      catalogId: catalogItem.id,
      name: catalogItem.name,
      category: catalogItem.category,
      x: dropX,
      z: dropZ,
      y: 0,
      rotY: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      color: catalogItem.defaultColor,
      material: catalogItem.defaultMaterial,
      style: 'Modern',
      widthMm: catalogItem.defaultDims.widthMm,
      depthMm: catalogItem.defaultDims.depthMm,
      heightMm: catalogItem.defaultDims.heightMm,
      isWishlisted: false
    };

    const nextPlaced = [...placedObjects, newObj];
    setPlacedObjects(nextPlaced);
    setSelectedObjectId(newObj.id);
    pushHistorySnapshot(nextPlaced);
    showToast(`Placed ${catalogItem.name}`);
  };

  const handleAddFromCatalog = (item: CatalogFurnitureItem) => {
    const randOffset = (Math.random() - 0.5) * 2.0;
    const newObj: PlacedFurnitureObject = {
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      catalogId: item.id,
      name: item.name,
      category: item.category,
      x: randOffset,
      z: randOffset * 0.8,
      y: 0,
      rotY: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      color: item.defaultColor,
      material: item.defaultMaterial,
      style: 'Modern',
      widthMm: item.defaultDims.widthMm,
      depthMm: item.defaultDims.depthMm,
      heightMm: item.defaultDims.heightMm,
      isWishlisted: false
    };

    const nextPlaced = [...placedObjects, newObj];
    setPlacedObjects(nextPlaced);
    setSelectedObjectId(newObj.id);
    pushHistorySnapshot(nextPlaced);
    showToast(`Added ${item.name}`);
  };

  // --- Transformations & Actions ---
  const handleRotateObject = (id: string, deltaAngle: number) => {
    const nextPlaced = placedObjects.map((o) =>
      o.id === id ? { ...o, rotY: Number((o.rotY + deltaAngle).toFixed(3)) } : o
    );
    setPlacedObjects(nextPlaced);
    pushHistorySnapshot(nextPlaced);
  };

  const handleDuplicateObject = (id: string) => {
    const target = placedObjects.find((o) => o.id === id);
    if (!target) return;

    const dup: PlacedFurnitureObject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: Math.min(roomDimensions.width / 2 - 0.5, target.x + 0.6),
      z: Math.min(roomDimensions.length / 2 - 0.5, target.z + 0.6)
    };

    const nextPlaced = [...placedObjects, dup];
    setPlacedObjects(nextPlaced);
    setSelectedObjectId(dup.id);
    pushHistorySnapshot(nextPlaced);
    showToast(`Duplicated ${target.name}`);
  };

  const handleDeleteObject = (id: string) => {
    const target = placedObjects.find((o) => o.id === id);
    const nextPlaced = placedObjects.filter((o) => o.id !== id);
    setPlacedObjects(nextPlaced);
    if (selectedObjectId === id) setSelectedObjectId(null);
    pushHistorySnapshot(nextPlaced);
    showToast(`Removed ${target ? target.name : 'item'}`);
  };

  const handleToggleWishlist = (id: string) => {
    setPlacedObjects((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const nextWish = !o.isWishlisted;
          showToast(nextWish ? `Saved to Wishlist` : `Removed from Wishlist`);
          return { ...o, isWishlisted: nextWish };
        }
        return o;
      })
    );
  };

  const handleUpdateSelected = (patch: Partial<PlacedFurnitureObject>) => {
    if (!selectedObjectId) return;
    const nextPlaced = placedObjects.map((o) => (o.id === selectedObjectId ? { ...o, ...patch } : o));
    setPlacedObjects(nextPlaced);
    pushHistorySnapshot(nextPlaced);
  };

  // --- Space Plan Layout Switcher ---
  const handleSwitchSpacePlan = (presetId: string) => {
    const preset = SAMPLE_ROOM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const loadedItems: PlacedFurnitureObject[] = preset.items.map((it, idx) => ({
      ...it,
      id: `plan-${preset.id}-${Date.now()}-${idx}`
    }));

    setPlacedObjects(loadedItems);
    setSelectedObjectId(loadedItems[0]?.id || null);
    setActiveSpacePlan(preset.id);
    setWallColor(preset.recommendedWall);
    setFloorFinish(preset.recommendedFloor);

    // Focus camera overview
    handleFocusZone('all');

    pushHistorySnapshot(loadedItems, roomDimensions, preset.recommendedWall, preset.recommendedFloor);
    showToast(`Switched 3D layout to ${preset.name}!`);
  };

  const handleClearRoom = () => {
    if (placedObjects.length === 0) return;
    setPlacedObjects([]);
    setSelectedObjectId(null);
    pushHistorySnapshot([]);
    showToast('Room cleared');
  };

  const handleTakeSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `SpacePlan-Residence-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast('3D Residence Snapshot downloaded');
  };

  // --- SAVE DESIGN & VIEW SAVED DESIGNS SYSTEM ---
  const handleSaveCurrentDesign = () => {
    const totalCost = placedObjects.reduce((acc, curr) => {
      const cat = CATALOG_ITEMS.find((c) => c.id === curr.catalogId);
      return acc + (cat ? cat.priceEst : 450);
    }, 0);

    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newDesign: SavedDesign = {
      id: `design-${Date.now()}`,
      name: designNameInput.trim() || 'My Residence Space Plan',
      createdAt: nowStr,
      updatedAt: nowStr,
      roomType: designRoomTypeInput,
      roomDimensions: { ...roomDimensions },
      wallColor,
      floorFinish,
      placedObjects: JSON.parse(JSON.stringify(placedObjects)),
      itemCount: placedObjects.length,
      totalCostEst: totalCost
    };

    const nextSaved = [newDesign, ...savedDesigns];
    setSavedDesigns(nextSaved);
    try {
      localStorage.setItem('spaceplan_saved_designs', JSON.stringify(nextSaved));
    } catch (e) {
      console.error(e);
    }

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5F4336', '#C65A38', '#866350', '#D4A373']
      });
    } catch (_) {}

    setShowSaveModal(false);
    showToast(`Design "${newDesign.name}" saved to your projects!`);
  };

  const handleLoadSavedDesign = (design: SavedDesign) => {
    setPlacedObjects(JSON.parse(JSON.stringify(design.placedObjects)));
    setRoomDimensions({ ...design.roomDimensions });
    setWallColor(design.wallColor);
    setFloorFinish(design.floorFinish);
    setSelectedObjectId(design.placedObjects[0]?.id || null);
    handleFocusZone('all');

    pushHistorySnapshot(design.placedObjects, design.roomDimensions, design.wallColor, design.floorFinish);
    setShowSavedDesignsModal(false);
    showToast(`Loaded "${design.name}" in 3D canvas!`);
  };

  const handleDeleteSavedDesign = (id: string, name: string) => {
    const nextSaved = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(nextSaved);
    try {
      localStorage.setItem('spaceplan_saved_designs', JSON.stringify(nextSaved));
    } catch (e) {
      console.error(e);
    }
    showToast(`Deleted "${name}"`);
  };

  const handleDuplicateSavedDesign = (design: SavedDesign) => {
    const dup: SavedDesign = {
      ...JSON.parse(JSON.stringify(design)),
      id: `design-${Date.now()}`,
      name: `${design.name} (Copy)`,
      createdAt: new Date().toLocaleString()
    };
    const nextSaved = [dup, ...savedDesigns];
    setSavedDesigns(nextSaved);
    try {
      localStorage.setItem('spaceplan_saved_designs', JSON.stringify(nextSaved));
    } catch (e) {
      console.error(e);
    }
    showToast(`Duplicated "${design.name}"`);
  };

  const handleExportJSON = (design: SavedDesign) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(design, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${design.name.toLowerCase().replace(/\s+/g, '-')}.spaceplan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${design.name}.spaceplan.json`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.placedObjects && Array.isArray(parsed.placedObjects)) {
          const importedDesign: SavedDesign = {
            ...parsed,
            id: `imported-${Date.now()}`,
            name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Design'
          };
          const nextSaved = [importedDesign, ...savedDesigns];
          setSavedDesigns(nextSaved);
          try {
            localStorage.setItem('spaceplan_saved_designs', JSON.stringify(nextSaved));
          } catch (_) {}
          handleLoadSavedDesign(importedDesign);
          showToast(`Imported and loaded "${importedDesign.name}"!`);
        } else {
          alert('Invalid spaceplan file format.');
        }
      } catch (err) {
        alert('Could not parse imported JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter Catalog Items
  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    const matchCat = activeCategory === 'build' ? true : item.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const wishlistedItems = placedObjects.filter((o) => o.isWishlisted);
  const totalEstimatedCost = wishlistedItems.reduce((acc, curr) => {
    const cat = CATALOG_ITEMS.find((c) => c.id === curr.catalogId);
    return acc + (cat ? cat.priceEst : 450);
  }, 0);

  const currentPreset = SAMPLE_ROOM_PRESETS.find((p) => p.id === activeSpacePlan) || SAMPLE_ROOM_PRESETS[0];

  return (
    <div
      id="workspace"
      className={`relative w-full flex flex-col bg-[#FAF7F2] select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[880px] rounded-3xl border border-[#E8DFD3] shadow-soft-xl'
      } ${className}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1D2520] text-white text-xs px-4 py-2.5 rounded-full shadow-soft-lg flex items-center gap-2 animate-fade-in border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Importing Designs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json,.spaceplan"
        className="hidden"
      />

      {/* ============================================================ */}
      {/* 1. TOP CAD TOOLBAR (Unified Heights & Symmetrical Alignment) */}
      {/* ============================================================ */}
      <header className="h-14 sm:h-16 px-3 sm:px-4 border-b border-[#EDE6DC] bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 z-20 gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
        {/* Left: Project title & History Undo/Redo */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-xl bg-[#5F4336] text-white flex items-center justify-center font-bold text-xs shadow-soft-sm shrink-0">
              SP
            </span>
            <div className="hidden sm:block shrink-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-[#1A231F] leading-none whitespace-nowrap">Studio CAD</h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-[#78877E] leading-tight whitespace-nowrap mt-0.5">
                Multi-Room Canvas
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-[#E5DDD2] mx-0.5 hidden xl:block shrink-0" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EDE6DC] shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className="h-6 w-6 flex items-center justify-center rounded-lg text-[#3C4A42] hover:bg-white hover:text-[#1A231F] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="h-6 w-6 flex items-center justify-center rounded-lg text-[#3C4A42] hover:bg-white hover:text-[#1A231F] disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SPACE PLAN TEMPLATE SWITCHER */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSpacePlanDropdown(!showSpacePlanDropdown)}
              className="h-8 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold bg-[#5F4336] text-white hover:bg-[#4E372C] transition-all shadow-soft-xs whitespace-nowrap shrink-0"
              title="Switch 3D Space Plan"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EFE7E1] shrink-0" />
              <span className="hidden md:inline text-[11px] text-[#EFE7E1]/80 font-normal">Plan:</span>
              <span className="max-w-[120px] sm:max-w-[155px] truncate text-[11px] sm:text-xs font-bold">
                {currentPreset.name.replace(' Space Plan', '')}
              </span>
              <ChevronDown className="w-3 h-3 opacity-80 shrink-0" />
            </button>

            {showSpacePlanDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-soft-2xl border border-[#EDE6DC] py-2 z-50 animate-scale-up">
                <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-[#78877E] tracking-wider">
                  Select 3D Space Plan
                </div>
                {SAMPLE_ROOM_PRESETS.map((p) => {
                  const isCur = activeSpacePlan === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleSwitchSpacePlan(p.id);
                        setShowSpacePlanDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                        isCur ? 'text-[#5F4336] bg-[#5F4336]/10 font-bold' : 'text-[#1A231F]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base shrink-0">
                          {p.id === 'full-apartment-residence' ? '🏠' : p.category === 'living' ? '🛋️' : p.category === 'dining' ? '🍽️' : p.category === 'bedroom' ? '🛏️' : p.category === 'kitchen' ? '🍳' : '🏢'}
                        </span>
                        <div className="min-w-0">
                          <div className="leading-tight truncate">{p.name}</div>
                          <div className="text-[10px] text-[#78877E] font-normal">{p.items.length} 3D models</div>
                        </div>
                      </div>
                      {isCur && <Check className="w-4 h-4 text-[#5F4336] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Camera Focus Zones (Image 2 Multi-Room Navigation) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-[#EDE6DC] shrink-0">
          <button
            onClick={() => handleFocusZone('all')}
            className={`h-7 px-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              cameraFocusZone === 'all' ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Full Residence</span>
          </button>
          <button
            onClick={() => handleFocusZone('living')}
            className={`h-7 px-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              cameraFocusZone === 'living' ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
            }`}
          >
            Living
          </button>
          <button
            onClick={() => handleFocusZone('dining')}
            className={`h-7 px-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              cameraFocusZone === 'dining' ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
            }`}
          >
            Dining
          </button>
          <button
            onClick={() => handleFocusZone('kitchen')}
            className={`h-7 px-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              cameraFocusZone === 'kitchen' ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
            }`}
          >
            Kitchen
          </button>
          <button
            onClick={() => handleFocusZone('entry')}
            className={`h-7 px-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              cameraFocusZone === 'entry' ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
            }`}
          >
            Stairs/Entry
          </button>
        </div>

        {/* Right Tools: Wall, Floor, 2D/3D, Save, Saved Designs, Snapshot */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Wall Paint Swatch */}
          <button
            onClick={() => setShowWallColorModal(true)}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white transition-all shadow-soft-xs whitespace-nowrap shrink-0"
            title="Change Wall Paint"
          >
            <span className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: wallColor }} />
            <span className="hidden xl:inline">Wall</span>
          </button>

          {/* Floor Finish */}
          <button
            onClick={() => setShowFloorModal(true)}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white transition-all shadow-soft-xs whitespace-nowrap shrink-0"
            title="Change Flooring"
          >
            <Layers className="w-3.5 h-3.5 text-[#5F4336] shrink-0" />
            <span className="hidden xl:inline capitalize">{floorFinish}</span>
          </button>

          {/* CAD Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`h-8 w-8 flex items-center justify-center rounded-xl border transition-all shrink-0 ${
              showGrid ? 'bg-white border-[#5F4336]/50 text-[#5F4336] shadow-soft-xs' : 'bg-[#FAF7F2] border-[#E5DDD2] text-[#78877E]'
            }`}
            title={showGrid ? 'CAD Floor Grid On (Click to Hide)' : 'CAD Floor Grid Off (Click to Show)'}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Lighting Mood Toggle */}
          <button
            onClick={() => setLightingMood(lightingMood === 'day' ? 'golden' : lightingMood === 'golden' ? 'evening' : 'day')}
            className="h-8 flex items-center gap-1 px-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white transition-all shadow-soft-xs whitespace-nowrap shrink-0"
            title="Switch Lighting Mood (Day / Golden / Evening)"
          >
            <span className="text-xs">{lightingMood === 'day' ? '☀️' : lightingMood === 'golden' ? '🌅' : '🌙'}</span>
            <span className="hidden 2xl:inline capitalize">{lightingMood}</span>
          </button>

          {/* 2D / 3D Mode Toggle */}
          <div className="h-8 flex items-center bg-[#FAF7F2] p-0.5 rounded-xl border border-[#EDE6DC] shrink-0">
            <button
              onClick={handleToggle2D3D}
              className={`h-7 px-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                !is2DMode ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
              }`}
            >
              3D
            </button>
            <button
              onClick={handleToggle2D3D}
              className={`h-7 px-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                is2DMode ? 'bg-[#5F4336] text-white shadow-soft-xs' : 'text-[#6E7B73] hover:text-[#1A231F]'
              }`}
            >
              2D
            </button>
          </div>

          {/* SAVE DESIGN BUTTON */}
          <button
            onClick={() => {
              setDesignNameInput('Residence Multi-Room Design');
              setShowSaveModal(true);
            }}
            className="h-8 flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold bg-[#5F4336] text-white hover:bg-[#4E372C] transition-all shadow-soft-sm whitespace-nowrap shrink-0"
            title="Save this 3D Room Design"
          >
            <Save className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* MY SAVED DESIGNS BUTTON ("Where it is view the saved design?") */}
          <button
            onClick={() => setShowSavedDesignsModal(true)}
            className="h-8 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold bg-white border border-[#5F4336]/40 text-[#5F4336] hover:bg-[#FAF7F2] transition-all relative shadow-soft-xs whitespace-nowrap shrink-0"
            title="View & Open Saved Designs"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#5F4336] shrink-0" />
            <span className="hidden sm:inline">Saved</span>
            <span className="w-4 h-4 rounded-full bg-[#5F4336] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
              {savedDesigns.length}
            </span>
          </button>

          {/* Wishlist Drawer Trigger */}
          <button
            onClick={() => setShowWishlistDrawer(true)}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white hover:border-[#5F4336] transition-all relative shrink-0"
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 shrink-0 ${wishlistedItems.length > 0 ? 'text-[#C65A38] fill-[#C65A38]' : 'text-[#78877E]'}`} />
            {wishlistedItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C65A38] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                {wishlistedItems.length}
              </span>
            )}
          </button>

          {/* HD Snapshot */}
          <button
            onClick={handleTakeSnapshot}
            title="Download HD 3D Snapshot"
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white transition-all shadow-soft-xs shrink-0"
          >
            <Camera className="w-3.5 h-3.5 text-[#5F4336]" />
          </button>

          {/* Fullscreen Mode */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen CAD Studio'}
            className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E5DDD2] text-[#1A231F] hover:bg-white transition-all shadow-soft-xs shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN CENTER 3D CANVAS & RIGHT PANEL (Catalog moved to bottom!) */}
      {/* ============================================================ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* CENTER 3D CANVAS (FULL WIDTH & EXPANSIVE CENTER STAGE) */}
        <main
          ref={containerRef}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={handleDropOnCanvas}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          className="flex-1 h-full relative cursor-crosshair overflow-hidden touch-none"
        >
          {/* Canvas Floating Top Overlay: Zoom & Reset */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#EDE6DC] shadow-soft-md">
            <button
              onClick={() => handleZoom(0.85)}
              title="Zoom In (+)"
              className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#1A231F] transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#6E7B73] px-1 min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(1.15)}
              title="Zoom Out (-)"
              className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#1A231F] transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-[#EDE6DC] mx-0.5" />
            <button
              onClick={handleResetCamera}
              title="Reset View"
              className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#5F4336] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Active Layout Badge */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#EDE6DC] shadow-soft-sm">
            <span className="w-2 h-2 rounded-full bg-[#5F4336] animate-pulse" />
            <span className="text-xs font-bold text-[#1A231F]">{currentPreset.name}</span>
            <span className="text-[10px] text-[#78877E]">({placedObjects.length} pieces in residence)</span>
          </div>

          {/* Floating Action Overlay on Selected 3D Object */}
          {floatingToolbarPos.visible && selectedObject && (
            <div
              style={{
                left: `${floatingToolbarPos.x}px`,
                top: `${floatingToolbarPos.y - 45}px`
              }}
              className="absolute -translate-x-1/2 z-20 flex items-center gap-1 bg-[#1A231F]/90 backdrop-blur-md text-white p-1 rounded-xl shadow-soft-xl border border-white/20 animate-fade-in pointer-events-auto"
            >
              <button
                onClick={() => handleRotateObject(selectedObject.id, Math.PI / 4)}
                title="Rotate 45°"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDuplicateObject(selectedObject.id)}
                title="Duplicate"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleToggleWishlist(selectedObject.id)}
                title="Add to Wishlist"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-all"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    selectedObject.isWishlisted ? 'text-[#C65A38] fill-[#C65A38]' : 'text-white'
                  }`}
                />
              </button>
              <button
                onClick={() => handleDeleteObject(selectedObject.id)}
                title="Delete Object"
                className="p-1.5 rounded-lg hover:bg-red-500/80 text-red-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom Left Quick Tips */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden md:flex items-center gap-2 bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#EDE6DC] text-[11px] text-[#6E7B73] shadow-soft-sm">
            <Move className="w-3.5 h-3.5 text-[#5F4336]" />
            <span>Click & Drag to Arrange in Any Room • Drag Catalog Models Below into 3D Space</span>
          </div>

          {/* Bottom Right Clear Button */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleClearRoom}
              className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#EDE6DC] text-xs font-semibold text-[#8B3A2B] hover:bg-red-50 hover:border-red-200 transition-all shadow-soft-sm"
            >
              Clear Room
            </button>
          </div>
        </main>

        {/* RIGHT CUSTOMIZATION PANEL (DOCK ON RIGHT) */}
        <aside className="w-80 xl:w-84 bg-white border-l border-[#EDE6DC] flex flex-col shrink-0 z-10 overflow-hidden shadow-soft-md">
          {selectedObject ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-[#EDE6DC] bg-[#FAF7F2]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#5F4336] uppercase tracking-wider bg-[#5F4336]/10 px-2 py-0.5 rounded-md">
                    {selectedObject.category} Piece
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleWishlist(selectedObject.id)}
                      title="Add to Wishlist"
                      className="p-1.5 rounded-lg text-[#78877E] hover:text-[#C65A38] hover:bg-white transition-all"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          selectedObject.isWishlisted ? 'text-[#C65A38] fill-[#C65A38]' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDuplicateObject(selectedObject.id)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-[#78877E] hover:text-[#1A231F] hover:bg-white transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteObject(selectedObject.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-[#78877E] hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#1A231F] leading-snug">{selectedObject.name}</h3>

                {/* Right Panel Tabs: Color/Material vs Size/Dimensions */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-white rounded-xl border border-[#EDE6DC] mt-3">
                  <button
                    onClick={() => setRightPanelTab('customize')}
                    className={`py-1 text-xs font-bold rounded-lg transition-all ${
                      rightPanelTab === 'customize'
                        ? 'bg-[#5F4336] text-white shadow-soft-xs'
                        : 'text-[#6E7B73] hover:text-[#1A231F]'
                    }`}
                  >
                    Finish & Color
                  </button>
                  <button
                    onClick={() => setRightPanelTab('dimensions')}
                    className={`py-1 text-xs font-bold rounded-lg transition-all ${
                      rightPanelTab === 'dimensions'
                        ? 'bg-[#5F4336] text-white shadow-soft-xs'
                        : 'text-[#6E7B73] hover:text-[#1A231F]'
                    }`}
                  >
                    Size & Position
                  </button>
                </div>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {rightPanelTab === 'customize' ? (
                  <>
                    {/* Finish Color Swatches */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#1A231F]">Color Palette</span>
                        <span className="text-[11px] text-[#5F4336] font-semibold">
                          {DESIGNER_COLORS.find((c) => c.hex.toLowerCase() === selectedObject.color.toLowerCase())
                            ?.name || 'Custom'}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {DESIGNER_COLORS.map((c) => {
                          const isSel = selectedObject.color.toLowerCase() === c.hex.toLowerCase();
                          return (
                            <button
                              key={c.id}
                              onClick={() => handleUpdateSelected({ color: c.hex })}
                              title={c.name}
                              className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center relative ${
                                isSel
                                  ? 'border-[#5F4336] ring-2 ring-[#5F4336]/30 scale-105 shadow-soft-sm'
                                  : 'border-black/10 hover:scale-105'
                              }`}
                              style={{ backgroundColor: c.hex }}
                            >
                              {isSel && (
                                <Check
                                  className={`w-4 h-4 ${
                                    c.hex === '#FFFFFF' || c.hex === '#F5EFEB' ? 'text-[#1A231F]' : 'text-white'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Material Textures */}
                    <div>
                      <span className="text-xs font-bold text-[#1A231F] block mb-2">Material Texture</span>
                      <div className="grid grid-cols-2 gap-2">
                        {MATERIAL_FINISHES.map((mat) => {
                          const isSel = selectedObject.material === mat.id;
                          return (
                            <button
                              key={mat.id}
                              onClick={() => handleUpdateSelected({ material: mat.id })}
                              className={`p-2 rounded-xl border text-left transition-all ${
                                isSel
                                  ? 'bg-[#5F4336]/10 border-[#5F4336] text-[#5F4336] font-bold'
                                  : 'bg-[#FAF7F2] border-[#EDE6DC] text-[#4A5750] hover:bg-white'
                              }`}
                            >
                              <div className="text-xs">{mat.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Aesthetic Style */}
                    <div>
                      <span className="text-xs font-bold text-[#1A231F] block mb-2">Aesthetic Style</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Contemporary', 'Minimalist Japandi', 'Modern Scandi', 'Mid-Century'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateSelected({ style: st })}
                            className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              selectedObject.style === st
                                ? 'bg-[#5F4336] text-white border-[#5F4336]'
                                : 'bg-[#FAF7F2] border-[#EDE6DC] text-[#4A5750] hover:bg-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Size & Dimensions Tab */
                  <div className="space-y-4">
                    {/* Width */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A231F] mb-1">
                        <span>Width (X-Axis)</span>
                        <span className="text-[#5F4336]">{selectedObject.widthMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min="400"
                        max="3600"
                        step="50"
                        value={selectedObject.widthMm}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleUpdateSelected({
                            widthMm: val,
                            scaleX: Number((val / 2000).toFixed(2))
                          });
                        }}
                        className="w-full accent-[#5F4336] cursor-pointer"
                      />
                    </div>

                    {/* Depth */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A231F] mb-1">
                        <span>Depth (Z-Axis)</span>
                        <span className="text-[#5F4336]">{selectedObject.depthMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="3200"
                        step="50"
                        value={selectedObject.depthMm}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleUpdateSelected({
                            depthMm: val,
                            scaleZ: Number((val / 1000).toFixed(2))
                          });
                        }}
                        className="w-full accent-[#5F4336] cursor-pointer"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A231F] mb-1">
                        <span>Height (Y-Axis)</span>
                        <span className="text-[#5F4336]">{selectedObject.heightMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="2400"
                        step="50"
                        value={selectedObject.heightMm}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleUpdateSelected({
                            heightMm: val,
                            scaleY: Number((val / 1000).toFixed(2))
                          });
                        }}
                        className="w-full accent-[#5F4336] cursor-pointer"
                      />
                    </div>

                    {/* Rotation (0° to 360°) */}
                    <div className="pt-3 border-t border-[#EDE6DC]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A231F] mb-1">
                        <span>Rotation</span>
                        <span className="text-[#5F4336]">
                          {Math.round(((selectedObject.rotY * 180) / Math.PI) % 360)}°
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRotateObject(selectedObject.id, -Math.PI / 4)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#5F4336] hover:text-white border border-[#EDE6DC] text-xs font-bold transition-all"
                        >
                          -45°
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={Math.PI * 2}
                          step="0.05"
                          value={selectedObject.rotY % (Math.PI * 2)}
                          onChange={(e) => {
                            handleUpdateSelected({ rotY: Number(e.target.value) });
                          }}
                          className="w-full accent-[#5F4336] cursor-pointer"
                        />
                        <button
                          onClick={() => handleRotateObject(selectedObject.id, Math.PI / 4)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#5F4336] hover:text-white border border-[#EDE6DC] text-xs font-bold transition-all"
                        >
                          +45°
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Add to Wishlist Button */}
              <div className="p-4 border-t border-[#EDE6DC] bg-[#FAF7F2]/60">
                <button
                  onClick={() => handleToggleWishlist(selectedObject.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-soft-sm ${
                    selectedObject.isWishlisted
                      ? 'bg-[#C65A38] text-white hover:bg-[#A9492C]'
                      : 'bg-[#5F4336] text-white hover:bg-[#4E372C]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedObject.isWishlisted ? 'fill-white' : ''}`} />
                  <span>{selectedObject.isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State: Residence Overview */
            <div className="flex-1 flex flex-col justify-between p-5 text-[#78877E]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#5F4336]/10 text-[#5F4336] flex items-center justify-center">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A231F]">Residence Space Plan</h4>
                    <p className="text-[10px] text-[#78877E]">Multi-Room Connected Architecture</p>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#EDE6DC] space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span>Total Area:</span>
                    <strong className="text-[#1A231F]">{(roomDimensions.width * roomDimensions.length).toFixed(1)} m²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Placed 3D Furniture:</span>
                    <strong className="text-[#1A231F]">{placedObjects.length} models</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wall Paint:</span>
                    <span className="flex items-center gap-1.5 font-semibold text-[#1A231F]">
                      <span className="w-3 h-3 rounded-full border border-black/10 inline-block" style={{ backgroundColor: wallColor }} />
                      Alabaster
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flooring:</span>
                    <strong className="text-[#1A231F] capitalize">{floorFinish} Hardwood</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#1A231F] tracking-wider block mb-1">
                    Room Zone Focus
                  </span>
                  <button
                    onClick={() => handleFocusZone('living')}
                    className="w-full text-left p-2 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EDE6DC] text-xs font-semibold text-[#1A231F] flex items-center justify-between"
                  >
                    <span>🛋️ Living Room Zone</span>
                    <Eye className="w-3.5 h-3.5 text-[#5F4336]" />
                  </button>
                  <button
                    onClick={() => handleFocusZone('dining')}
                    className="w-full text-left p-2 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EDE6DC] text-xs font-semibold text-[#1A231F] flex items-center justify-between"
                  >
                    <span>🍽️ Dining Room Zone</span>
                    <Eye className="w-3.5 h-3.5 text-[#5F4336]" />
                  </button>
                  <button
                    onClick={() => handleFocusZone('kitchen')}
                    className="w-full text-left p-2 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EDE6DC] text-xs font-semibold text-[#1A231F] flex items-center justify-between"
                  >
                    <span>🍳 Kitchen Island Zone</span>
                    <Eye className="w-3.5 h-3.5 text-[#5F4336]" />
                  </button>
                  <button
                    onClick={() => handleFocusZone('entry')}
                    className="w-full text-left p-2 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EDE6DC] text-xs font-semibold text-[#1A231F] flex items-center justify-between"
                  >
                    <span>🚪 Staircase & Entry Zone</span>
                    <Eye className="w-3.5 h-3.5 text-[#5F4336]" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDE6DC] space-y-2">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-[#5F4336] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save This Design</span>
                </button>
                <button
                  onClick={() => setShowSavedDesignsModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EDE6DC] text-xs font-semibold text-[#1A231F] flex items-center justify-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#5F4336]" />
                  <span>View Saved Designs ({savedDesigns.length})</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM FURNITURE CATALOG (DOCK AT BOTTOM AS REQUESTED!) */}
      {/* ============================================================ */}
      <footer className="border-t border-[#EDE6DC] bg-white shrink-0 z-20 shadow-soft-xl transition-all">
        {/* Top Control Bar of Bottom Dock */}
        <div className="h-10 px-4 bg-[#FAF7F2] border-b border-[#EDE6DC] flex items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] uppercase font-bold text-[#5F4336] tracking-wider mr-1 hidden sm:inline">
              Catalog:
            </span>
            <button
              onClick={() => setActiveCategory('living')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                activeCategory === 'living'
                  ? 'bg-[#5F4336] text-white shadow-soft-xs'
                  : 'text-[#6E7B73] hover:text-[#1A231F] hover:bg-white'
              }`}
            >
              🛋️ Living Room
            </button>
            <button
              onClick={() => setActiveCategory('dining')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                activeCategory === 'dining'
                  ? 'bg-[#5F4336] text-white shadow-soft-xs'
                  : 'text-[#6E7B73] hover:text-[#1A231F] hover:bg-white'
              }`}
            >
              🍽️ Dining Room
            </button>
            <button
              onClick={() => setActiveCategory('bedroom')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                activeCategory === 'bedroom'
                  ? 'bg-[#5F4336] text-white shadow-soft-xs'
                  : 'text-[#6E7B73] hover:text-[#1A231F] hover:bg-white'
              }`}
            >
              🛏️ Bedroom
            </button>
            <button
              onClick={() => setActiveCategory('decor')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                activeCategory === 'decor'
                  ? 'bg-[#5F4336] text-white shadow-soft-xs'
                  : 'text-[#6E7B73] hover:text-[#1A231F] hover:bg-white'
              }`}
            >
              🪴 Decor & Accents
            </button>
          </div>

          {/* Quick Search & Collapse Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9BA89F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="bg-white border border-[#EDE6DC] rounded-xl pl-7 pr-2.5 py-1 text-[11px] text-[#1A231F] placeholder-[#9BA89F] focus:outline-none focus:border-[#5F4336] w-36"
              />
            </div>
            <button
              onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
              className="p-1 rounded-lg text-[#6E7B73] hover:bg-white hover:text-[#1A231F] transition-all flex items-center gap-1 text-[11px] font-semibold"
              title={isCatalogExpanded ? 'Collapse Catalog' : 'Expand Catalog'}
            >
              <span>{isCatalogExpanded ? 'Hide' : 'Show Catalog'}</span>
              {isCatalogExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Furniture Cards (When Expanded) */}
        {isCatalogExpanded && (
          <div className="p-3 overflow-x-auto flex items-center gap-3 scrollbar-thin max-h-40">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.id);
                }}
                onClick={() => handleAddFromCatalog(item)}
                className="group shrink-0 w-44 bg-[#FAF7F2] hover:bg-white rounded-2xl p-2.5 border border-[#EDE6DC] hover:border-[#5F4336] hover:shadow-soft-md transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between text-left"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-7 h-7 rounded-lg shadow-soft-xs shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: item.defaultColor }}
                  >
                    {item.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#1A231F] leading-tight truncate">{item.name}</h5>
                    <p className="text-[10px] text-[#78877E] truncate">{item.defaultDims.widthMm}mm W</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#EDE6DC]">
                  <span className="font-bold text-[#5F4336]">${item.priceEst}</span>
                  <span className="text-[10px] text-[#5F4336] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>+ Add</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </footer>

      {/* ============================================================ */}
      {/* 4. MODALS (SAVE, SAVED DESIGNS, ROOM RESIZING, WALL, FLOOR, WISHLIST) */}
      {/* ============================================================ */}

      {/* SAVE DESIGN MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-soft-2xl border border-[#EDE6DC] animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5F4336] text-white flex items-center justify-center">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A231F]">Save Residence Design</h3>
                  <p className="text-[10px] text-[#78877E]">Persist layout to your browser projects</p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1 rounded-xl text-[#78877E] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1A231F] block mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={designNameInput}
                  onChange={(e) => setDesignNameInput(e.target.value)}
                  placeholder="e.g. Full Residence Multi-Room Design"
                  className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-xl px-3.5 py-2 text-xs text-[#1A231F] focus:outline-none focus:border-[#5F4336] font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1A231F] block mb-1.5">Primary Category</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['living', 'dining', 'bedroom', 'kitchen', 'studio'] as const).map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => setDesignRoomTypeInput(rt)}
                      className={`py-1.5 text-[10px] font-bold rounded-xl border capitalize transition-all ${
                        designRoomTypeInput === rt
                          ? 'bg-[#5F4336] text-white border-[#5F4336] shadow-soft-xs'
                          : 'bg-[#FAF7F2] text-[#6E7B73] border-[#EDE6DC] hover:bg-white'
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6E7B73]">Placed 3D Furniture:</span>
                  <span className="font-bold text-[#1A231F]">{placedObjects.length} models</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E7B73]">Residence Dimensions:</span>
                  <span className="font-bold text-[#1A231F]">
                    {roomDimensions.width}m × {roomDimensions.length}m ({(roomDimensions.width * roomDimensions.length).toFixed(1)} m²)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E7B73]">Finishes:</span>
                  <span className="font-bold text-[#1A231F] capitalize flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-black/15 inline-block" style={{ backgroundColor: wallColor }} />
                    {floorFinish} Flooring
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="w-1/3 py-2.5 rounded-xl border border-[#EDE6DC] text-xs font-bold text-[#6E7B73] hover:bg-[#FAF7F2] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentDesign}
                className="w-2/3 py-2.5 rounded-xl bg-[#5F4336] text-white font-bold text-xs hover:bg-[#4E372C] transition-all shadow-soft-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to My Projects</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MY SAVED DESIGNS GALLERY MODAL */}
      {showSavedDesignsModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] shadow-soft-2xl border border-[#EDE6DC] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE6DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5F4336] text-white flex items-center justify-center shadow-soft-xs">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A231F]">My Saved Designs ({savedDesigns.length})</h3>
                  <p className="text-[11px] text-[#78877E]">Click any project to load it into the live 3D canvas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl border border-[#EDE6DC] text-[11px] font-semibold text-[#1A231F] hover:bg-[#FAF7F2] transition-all flex items-center gap-1"
                  title="Import .spaceplan JSON file"
                >
                  <Upload className="w-3 h-3 text-[#5F4336]" />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => setShowSavedDesignsModal(false)}
                  className="p-1 rounded-xl text-[#78877E] hover:bg-[#FAF7F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
              {savedDesigns.length > 0 ? (
                savedDesigns.map((des) => (
                  <div
                    key={des.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] hover:border-[#5F4336] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white border border-[#EDE6DC] flex items-center justify-center text-xl shrink-0 shadow-soft-xs">
                        {des.roomType === 'living' ? '🛋️' : des.roomType === 'dining' ? '🍽️' : des.roomType === 'bedroom' ? '🛏️' : des.roomType === 'kitchen' ? '🍳' : '🏢'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#1A231F]">{des.name}</h4>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[#5F4336]/10 text-[#5F4336]">
                            {des.roomType}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[#78877E] mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {des.createdAt}
                          </span>
                          <span>•</span>
                          <span>{des.itemCount} furniture pieces</span>
                          <span>•</span>
                          <span>
                            {des.roomDimensions.width}m × {des.roomDimensions.length}m
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-[#78877E]">Finishes:</span>
                          <span className="w-3 h-3 rounded-full border border-black/10 inline-block" style={{ backgroundColor: des.wallColor }} title="Wall Paint" />
                          <span className="text-[10px] text-[#1A231F] capitalize font-medium">{des.floorFinish} Floor</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleLoadSavedDesign(des)}
                        className="px-3 py-1.5 rounded-xl bg-[#5F4336] hover:bg-[#4E372C] text-white text-xs font-bold transition-all shadow-soft-xs flex items-center gap-1"
                        title="Load this design in 3D"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open in 3D</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateSavedDesign(des)}
                        className="p-1.5 rounded-xl border border-[#EDE6DC] hover:bg-white text-[#78877E] hover:text-[#1A231F] transition-all"
                        title="Duplicate design"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExportJSON(des)}
                        className="p-1.5 rounded-xl border border-[#EDE6DC] hover:bg-white text-[#78877E] hover:text-[#1A231F] transition-all"
                        title="Download .spaceplan file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSavedDesign(des.id, des.name)}
                        className="p-1.5 rounded-xl border border-[#EDE6DC] hover:bg-red-50 text-[#78877E] hover:text-red-600 transition-all"
                        title="Delete design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#78877E]">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 text-[#D6C7B8]" />
                  <p className="text-xs font-bold text-[#1A231F]">No Saved Designs Yet</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#EDE6DC] flex items-center justify-between">
              <span className="text-[11px] text-[#78877E]">Stored locally in browser</span>
              <button
                onClick={() => {
                  setShowSavedDesignsModal(false);
                  setShowSaveModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#5F4336] text-white text-xs font-bold hover:bg-[#4E372C] transition-all shadow-soft-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current as New</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALL COLOR MODAL */}
      {showWallColorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-soft-2xl border border-[#EDE6DC] animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#5F4336]" />
                <h3 className="text-base font-bold text-[#1A231F]">Wall Paint Customization</h3>
              </div>
              <button
                onClick={() => setShowWallColorModal(false)}
                className="p-1 rounded-xl text-[#78877E] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {DESIGNER_COLORS.map((c) => {
                const isSel = wallColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setWallColor(c.hex);
                      pushHistorySnapshot(placedObjects, roomDimensions, c.hex);
                    }}
                    className={`p-2 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                      isSel ? 'border-[#5F4336] ring-2 ring-[#5F4336]/25 bg-[#FAF7F2]' : 'border-[#EDE6DC] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-[11px] font-bold text-[#1A231F] leading-tight line-clamp-1">{c.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowWallColorModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#5F4336] text-white font-bold text-xs hover:bg-[#4E372C] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* FLOOR FINISH MODAL */}
      {showFloorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-soft-2xl border border-[#EDE6DC] animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#5F4336]" />
                <h3 className="text-base font-bold text-[#1A231F]">Floor Material Selection</h3>
              </div>
              <button
                onClick={() => setShowFloorModal(false)}
                className="p-1 rounded-xl text-[#78877E] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {FLOOR_FINISHES.map((f) => {
                const isSel = floorFinish === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFloorFinish(f.id as FloorFinishType);
                      pushHistorySnapshot(placedObjects, roomDimensions, wallColor, f.id as FloorFinishType);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSel ? 'border-[#5F4336] bg-[#5F4336]/5 ring-2 ring-[#5F4336]/20' : 'border-[#EDE6DC] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl border border-black/10 shrink-0 shadow-soft-xs" style={{ backgroundColor: f.color }} />
                      <div>
                        <div className="text-xs font-bold text-[#1A231F]">{f.name}</div>
                        <div className="text-[10px] text-[#78877E]">{f.desc}</div>
                      </div>
                    </div>
                    {isSel && <Check className="w-4 h-4 text-[#5F4336]" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowFloorModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#5F4336] text-white font-bold text-xs hover:bg-[#4E372C] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER */}
      {showWishlistDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-soft-2xl flex flex-col border-l border-[#EDE6DC] animate-slide-left">
            <div className="p-4 border-b border-[#EDE6DC] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C65A38] fill-[#C65A38]" />
                <div>
                  <h3 className="text-sm font-bold text-[#1A231F]">Residence Wishlist</h3>
                  <p className="text-[10px] text-[#78877E]">{wishlistedItems.length} curated pieces</p>
                </div>
              </div>
              <button
                onClick={() => setShowWishlistDrawer(false)}
                className="p-1.5 rounded-xl hover:bg-white text-[#78877E] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {wishlistedItems.length > 0 ? (
                wishlistedItems.map((item) => {
                  const catItem = CATALOG_ITEMS.find((c) => c.id === item.catalogId);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-10 h-10 rounded-xl shadow-soft-xs border border-black/10 shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#1A231F] leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-[#78877E] mt-0.5">
                            {item.widthMm}mm W • {item.material} finish
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-[#5F4336]">
                          ${catItem ? catItem.priceEst : 450}
                        </div>
                        <button
                          onClick={() => handleToggleWishlist(item.id)}
                          className="text-[10px] text-red-500 hover:underline mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-[#78877E]">
                  <Heart className="w-10 h-10 text-[#D5CABB] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1A231F]">Your Wishlist is Empty</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#EDE6DC] bg-[#FAF7F2]/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E7B73]">Estimated Furniture Total:</span>
                <span className="text-base font-bold text-[#1A231F]">${totalEstimatedCost.toLocaleString()}</span>
              </div>
              <button
                onClick={() => {
                  setShowWishlistDrawer(false);
                  if (onSelectPlanInterest) onSelectPlanInterest('Full Residence Wishlist');
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                  showToast('Wishlist exported to demo request');
                }}
                className="w-full py-2.5 rounded-xl bg-[#5F4336] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4E372C] transition-all shadow-soft-sm"
              >
                Request Quote with Wishlist Specs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
