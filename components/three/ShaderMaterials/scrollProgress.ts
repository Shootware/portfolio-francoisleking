// Scroll Progress Path Shader - Animated path with progress
export const scrollProgressVertex = /* glsl */ `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aProgress; // 0-1 along path

  uniform float uTime;
  uniform float uScrollProgress; // 0-1 from scroll
  uniform float uDrawProgress; // Animated draw progress
  uniform float uLineWidth;
  uniform vec3 uGlowColor;
  uniform float uGlowWidth;

  varying vec3 vColor;
  varying float vProgress;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vColor = aColor;
    vProgress = aProgress;

    // Determine visibility based on scroll progress
    float visible = step(aProgress, uScrollProgress);
    float drawVisible = step(aProgress, uDrawProgress);
    vAlpha = visible * drawVisible;

    // Glow at the progress head
    float glowDist = abs(aProgress - uScrollProgress);
    vGlow = smoothstep(uGlowWidth, 0.0, glowDist);

    // Project position
    vec4 mvPosition = modelViewMatrix * vec4(aPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uLineWidth * (300.0 / -mvPosition.z) * (1.0 + vGlow * 2.0);
  }
`;

export const scrollProgressFragment = /* glsl */ `
  uniform float uBaseOpacity;
  uniform float uGlowIntensity;
  uniform vec3 uHeadColor;

  varying vec3 vColor;
  varying float vProgress;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    // Circular point for line
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.45, dist);

    // Base line color
    vec3 color = vColor;
    float finalAlpha = alpha * vAlpha * uBaseOpacity;

    // Add glow at progress head
    color = mix(color, uHeadColor, vGlow * uGlowIntensity);
    finalAlpha += vGlow * uGlowIntensity * 0.5;

    // Pulse at head
    float pulse = sin(vProgress * 20.0) * 0.5 + 0.5;
    color = mix(color, uHeadColor, pulse * vGlow * 0.3);

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

// Milestone markers vertex shader
export const milestoneVertex = /* glsl */ `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aProgress; // Position along path
  attribute float aActive; // Is this the active milestone

  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uActiveProgress; // Progress of active milestone
  uniform float uPulseSpeed;

  varying vec3 vColor;
  varying float vScale;
  varying float vAlpha;
  varying float vIsActive;

  void main() {
    vColor = aColor;
    vIsActive = aActive;

    // Determine if this milestone is passed
    float passed = step(aProgress, uScrollProgress);
    vAlpha = passed;

    // Pulse animation for active milestone
    float pulse = 1.0;
    if (aActive > 0.5) {
      pulse = 1.0 + sin(uTime * uPulseSpeed) * 0.3;
      // Scale based on how close to exact progress
      float proximity = 1.0 - abs(aProgress - uActiveProgress) * 5.0;
      pulse *= max(0.5, proximity);
    }

    vScale = aSize * pulse;

    vec4 mvPosition = modelViewMatrix * vec4(aPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = vScale * (300.0 / -mvPosition.z);
  }
`;

export const milestoneFragment = /* glsl */ `
  uniform vec3 uActiveColor;
  uniform float uRingWidth;
  uniform float uRingPulseSpeed;

  varying vec3 vColor;
  varying float vScale;
  varying float vAlpha;
  varying float vIsActive;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Main circle
    float circleAlpha = smoothstep(0.5, 0.47, dist);

    // Outer ring for active milestone
    float ringAlpha = 0.0;
    if (vIsActive > 0.5) {
      float ringDist = abs(dist - (0.5 + uRingWidth));
      ringAlpha = smoothstep(uRingWidth * 0.5, 0.0, ringDist);
      ringAlpha *= 0.5 + sin(uTime * uRingPulseSpeed) * 0.5;
    }

    vec3 color = mix(vColor, uActiveColor, vIsActive);
    float alpha = (circleAlpha + ringAlpha) * vAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

export const scrollProgressUniforms = {
  uTime: { value: 0 },
  uScrollProgress: { value: 0 },
  uDrawProgress: { value: 0 },
  uLineWidth: { value: 3.0 },
  uGlowColor: { value: new THREE.Color(0x818cf8) },
  uGlowWidth: { value: 0.05 },
  uBaseOpacity: { value: 0.8 },
  uGlowIntensity: { value: 1.0 },
  uHeadColor: { value: new THREE.Color(0xfcd34d) },
  uActiveColor: { value: new THREE.Color(0xfcd34d) },
  uRingWidth: { value: 0.08 },
  uRingPulseSpeed: { value: 3.0 },
  uPulseSpeed: { value: 2.0 },
};

import * as THREE from "three";