// Vertex shader for artwork frames
export const artworkVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader for artwork frames with glow effect
export const artworkFragmentShader = `
uniform float time;
uniform vec3 color;
uniform bool isHighlighted;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Base color from texture
  vec3 finalColor = color;

  // Add pulsating glow effect when highlighted
  if (isHighlighted) {
    float strength = sin(time * 3.0) * 0.3 + 0.7;
    finalColor = mix(finalColor, vec3(1.0, 0.84, 0.0), strength * 0.5);
  }

  // Add subtle noise for texture
  float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 12.0 + time) * 0.01;
  finalColor += noise;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Custom shader material for animated frames
export const frameShaderMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new (window as any).THREE.Color(0x1a1a1a) },
    isHighlighted: { value: false }
  },
  vertexShader: artworkVertexShader,
  fragmentShader: artworkFragmentShader
};

// Particle system shader for floating particles around frames
export const particleVertexShader = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
  vColor = customColor;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particleFragmentShader = `
uniform vec3 particleColor;
uniform float time;

varying vec3 vColor;

void main() {
  // Create a circular particle shape
  float r = length(gl_PointCoord - vec2(0.5, 0.5));

  // Fade out at edges
  float alpha = 1.0 - smoothstep(0.4, 0.5, r);

  // Add pulsating effect based on time
  float pulse = sin(time * 2.0 + position.x * 0.1 + position.y * 0.1) * 0.2 + 0.8;

  gl_FragColor = vec4(vColor, alpha * pulse);
}
`;

// Custom shader material for particles
export const particleShaderMaterial = {
  uniforms: {
    particleColor: { value: new (window as any).THREE.Color(0x00f2ff) },
    time: { value: 0 }
  },
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  transparent: true,
  blending: (window as any).THREE.AdditiveBlending
};