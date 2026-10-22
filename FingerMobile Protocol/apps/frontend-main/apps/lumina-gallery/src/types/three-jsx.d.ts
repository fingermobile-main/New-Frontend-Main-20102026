
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {group: ThreeElements['group'];
  mesh: ThreeElements['mesh'];
  pointLight: ThreeElements['pointLight'];
  points: ThreeElements['points'];
  primitive: ThreeElements['primitive'];
  boxGeometry: ThreeElements['boxGeometry'];
  sphereGeometry: ThreeElements['sphereGeometry'];
  planeGeometry: ThreeElements['planeGeometry'];
  bufferGeometry: ThreeElements['bufferGeometry'];
  bufferAttribute: ThreeElements['bufferAttribute'];
  meshStandardMaterial: ThreeElements['meshStandardMaterial'];
  meshBasicMaterial: ThreeElements['meshBasicMaterial'];
    }
  }
}

interface ThreeElements {group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>,
  HTMLElement> & {
    args?: any[];
    attach?: string;
  };
mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
    attach?: string;
  };
pointLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
    position?: [number, number, number];
    intensity?: number;
    distance?: number;
  };
points: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
  };
primitive: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {object: any;
  };
boxGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: [number, number, number];
  };
sphereGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: [number, number, number];
  };
planeGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: [number, number];
  };
bufferGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
  };
bufferAttribute: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
    attach?: string;
  };
meshStandardMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
    color?: string | number;
    metalness?: number;
    roughness?: number;
  };
meshBasicMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    args?: any[];
    color?: string | number;
  };
}

export {};
