// Interactive Card Shader - 3D tilt with glare
export const interactiveCardVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const interactiveCardFragment = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uHighlightColor;
  uniform vec3 uGlareColor;
  uniform float uTiltX;
  uniform float uTiltY;
  uniform float uHoverProgress;
  uniform float uTime;
  uniform bool uIsDark;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Base material
    vec3 color = uBaseColor;

    // Lighting based on normals
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    color *= 0.5 + diffuse * 0.5;

    // Tilt-based highlight
    float tiltHighlight = (uTiltX * vNormal.x + uTiltY * vNormal.y) * 0.1;
    color += uHighlightColor * tiltHighlight * uHoverProgress;

    // Glare effect (view-dependent)
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float glare = pow(max(dot(reflect(-viewDir, vNormal), vec3(uTiltX, uTiltY, 1.0)), 0.0), 32.0);
    color += uGlareColor * glare * uHoverProgress * 0.3;

    // Subtle animated noise for texture
    float noise = sin(vWorldPosition.x * 10.0 + uTime * 0.5) *
                  cos(vWorldPosition.y * 10.0 + uTime * 0.3) * 0.02;
    color += vec3(noise);

    // Theme adjustment
    if (uIsDark) {
      color = mix(color, vec3(0.1), 0.1);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const interactiveCardUniforms = {
  uBaseColor: { value: new THREE.Color(0x18181b) },
  uHighlightColor: { value: new THREE.Color(0x6366f1) },
  uGlareColor: { value: new THREE.Color(0xffffff) },
  uTiltX: { value: 0 },
  uTiltY: { value: 0 },
  uHoverProgress: { value: 0 },
  uTime: { value: 0 },
  uIsDark: { value: true },
};

import * as THREE from "three";