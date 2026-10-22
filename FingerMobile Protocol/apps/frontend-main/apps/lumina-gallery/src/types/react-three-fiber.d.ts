import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
  }
}

export {};
