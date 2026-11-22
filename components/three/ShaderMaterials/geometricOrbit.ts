// Geometric Orbit Shader - Instanced orbiting shapes
export const geometricOrbitVertex = /* glsl */ `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute vec3 aOrbitCenter;
  attribute float aOrbitRadius;
  attribute float aOrbitSpeed;
  attribute float aOrbitPhase;
  attribute float aOrbitTilt;
  attribute vec3 aRotationAxis;
  attribute float aRotationSpeed;
  attribute float aPulseSpeed;
  attribute float aPulsePhase;

  uniform float uTime;
  uniform float uGlobalSpeed;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec3 vColor;
  varying float vPulse;

  void main() {
    vColor = aColor;

    // Calculate orbit position
    float angle = uTime * aOrbitSpeed * uGlobalSpeed + aOrbitPhase;
    float tiltedAngle = angle * cos(aOrbitTilt);

    vec3 orbitOffset = vec3(
      aOrbitRadius * cos(tiltedAngle),
      aOrbitRadius * sin(tiltedAngle) * sin(aOrbitTilt),
      aOrbitRadius * sin(tiltedAngle) * cos(aOrbitTilt)
    );

    vec3 worldPos = aOrbitCenter + orbitOffset;

    // Apply rotation around own axis
    float rotAngle = uTime * aRotationSpeed;
    vec3 rotatedPos = aPosition;
    float c = cos(rotAngle);
    float s = sin(rotAngle);
    vec3 axis = normalize(aRotationAxis);
    rotatedPos = rotatedPos * c + cross(axis, rotatedPos) * s + axis * dot(axis, rotatedPos) * (1.0 - c);

    // Pulse animation
    vPulse = 1.0 + sin(uTime * aPulseSpeed + aPulsePhase) * 0.15;
    float size = aSize * vPulse;

    vec4 mvPosition = uViewMatrix * vec4(worldPos + rotatedPos, 1.0);
    gl_Position = uProjectionMatrix * mvPosition;
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

export const geometricOrbitFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uFresnelColor;
  uniform float uFresnelPower;

  varying vec3 vColor;
  varying float vPulse;

  void main() {
    // Circular shape with anti-aliasing
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.45, dist);

    // Fresnel-like edge glow
    float fresnel = pow(1.0 - dist * 2.0, uFresnelPower);
    vec3 color = mix(vColor, uFresnelColor, fresnel * 0.5);

    // Pulse brightness
    color *= vPulse;

    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;

export const geometricOrbitUniforms = {
  uTime: { value: 0 },
  uGlobalSpeed: { value: 1.0 },
  uOpacity: { value: 0.8 },
  uFresnelColor: { value: new THREE.Color(0xffffff) },
  uFresnelPower: { value: 3.0 },
};

import * as THREE from "three";