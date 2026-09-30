declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { LoadingManager, Object3D } from 'three';
  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<{ scene: Object3D }>;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, TOUCH } from 'three';
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enabled: boolean;
    target: import('three').Vector3;
    enableDamping: boolean;
    dampingFactor: number;
    screenSpacePanning: boolean;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enablePan: boolean;
    panSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enableZoom: boolean;
    zoomSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
    mouseButtons: { LEFT: MOUSE | null; MIDDLE: MOUSE | null; RIGHT: MOUSE | null };
    touches: { ONE: TOUCH | null; TWO: TOUCH | null };
    update(deltaTime?: number): boolean;
    listenToKeyEvents(domElement: HTMLElement): void;
    saveState(): void;
    reset(): void;
    dispose(): void;
  }
}
