// ShaderMaterials - Centralized export for all custom shaders

// Hero Background Shader
export {
  heroBackgroundVertex,
  heroBackgroundFragment,
  heroBackgroundUniforms,
} from "./heroBackground";

// Particle Field Shader
export {
  particleFieldVertex,
  particleFieldFragment,
  particleFieldUniforms,
} from "./particleField";

// Geometric Orbit Shader
export {
  geometricOrbitVertex,
  geometricOrbitFragment,
  geometricOrbitUniforms,
} from "./geometricOrbit";

// Scroll Progress Path Shader
export {
  scrollProgressVertex,
  scrollProgressFragment,
  milestoneVertex,
  milestoneFragment,
  scrollProgressUniforms,
} from "./scrollProgress";

// Interactive Card Shader
export {
  interactiveCardVertex,
  interactiveCardFragment,
  interactiveCardUniforms,
} from "./interactiveCard";

// Shader utility types
export interface ShaderUniforms {
  [key: string]: THREE.IUniform;
}

export interface ShaderMaterial {
  vertexShader: string;
  fragmentShader: string;
  uniforms: ShaderUniforms;
  transparent?: boolean;
  depthWrite?: boolean;
  blending?: THREE.Blending;
  side?: THREE.Side;
}

// Helper to create Three.js ShaderMaterial from shader exports
export function createShaderMaterial(shader: ShaderMaterial) {
  return new THREE.ShaderMaterial({
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: shader.uniforms,
    transparent: shader.transparent ?? true,
    depthWrite: shader.depthWrite ?? false,
    blending: shader.blending ?? THREE.NormalBlending,
    side: shader.side ?? THREE.FrontSide,
  });
}

// Pre-built shader materials
export const heroBackgroundMaterial = createShaderMaterial({
  vertexShader: heroBackgroundVertex,
  fragmentShader: heroBackgroundFragment,
  uniforms: heroBackgroundUniforms,
  transparent: false,
});

export const particleFieldMaterial = createShaderMaterial({
  vertexShader: particleFieldVertex,
  fragmentShader: particleFieldFragment,
  uniforms: particleFieldUniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

export const geometricOrbitMaterial = createShaderMaterial({
  vertexShader: geometricOrbitVertex,
  fragmentShader: geometricOrbitFragment,
  uniforms: geometricOrbitUniforms,
  transparent: true,
  depthWrite: true,
});

export const scrollProgressMaterial = createShaderMaterial({
  vertexShader: scrollProgressVertex,
  fragmentShader: scrollProgressFragment,
  uniforms: scrollProgressUniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

export const milestoneMaterial = createShaderMaterial({
  vertexShader: milestoneVertex,
  fragmentShader: milestoneFragment,
  uniforms: scrollProgressUniforms,
  transparent: true,
  depthWrite: true,
});

export const interactiveCardMaterial = createShaderMaterial({
  vertexShader: interactiveCardVertex,
  fragmentShader: interactiveCardFragment,
  uniforms: interactiveCardUniforms,
  transparent: false,
});

import * as THREE from "three";
import {
  heroBackgroundVertex,
  heroBackgroundFragment,
  heroBackgroundUniforms,
} from "./heroBackground";
import {
  particleFieldVertex,
  particleFieldFragment,
  particleFieldUniforms,
} from "./particleField";
import {
  geometricOrbitVertex,
  geometricOrbitFragment,
  geometricOrbitUniforms,
} from "./geometricOrbit";
import {
  scrollProgressVertex,
  scrollProgressFragment,
  milestoneVertex,
  milestoneFragment,
  scrollProgressUniforms,
} from "./scrollProgress";
import {
  interactiveCardVertex,
  interactiveCardFragment,
  interactiveCardUniforms,
} from "./interactiveCard";
