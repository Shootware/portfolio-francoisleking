"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { uiuxDesignShaderMaterial } from "@/components/three/ShaderMaterials";

/**
 * Full-screen quad with the UI/UX design system shader
 */
function SkillsBackgroundMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Initialize material with correct theme
  useEffect(() => {
    if (meshRef.current && !materialRef.current) {
      // We'll update the material based on theme in useFrame
      materialRef.current = meshRef.current.material as THREE.ShaderMaterial;
    }
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={meshRef} geometry={useMemo(() => new THREE.PlaneGeometry(2, 2), [])}>
      <shaderMaterial
        attach="material"
        args={[{}]}
      />
    </mesh>
  );
}

/**
 * Custom shader material component that creates our UI/UX design shader
 */
function ShaderMaterialWrapper() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { gl } = useThree();

  useEffect(() => {
    // Check for dark mode
    const isDark = document.documentElement.classList.contains("dark");
    const material = uiuxDesignShaderMaterial(isDark);
    materialRef.current = material;

    // Update theme when it changes
    const observer = new MutationObserver(() => {
      const newIsDark = document.documentElement.classList.contains("dark");
      if (materialRef.current) {
        materialRef.current.uniforms.uIsDark.value = newIsDark;
        materialRef.current.uniforms.uBgColor.value.set(newIsDark ? 0x0f172a : 0xfafafa);
        materialRef.current.uniforms.uGridColor.value.set(newIsDark ? 0x3b82f6 : 0x6366f1);
        materialRef.current.uniforms.uAccentColor.value.set(newIsDark ? 0x818cf8 : 0x4f46e5);
        materialRef.current.uniforms.uWireframeColor.value.set(newIsDark ? 0x1e293b : 0xe2e8f0);
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      material.dispose();
    };
  }, []);

  if (!materialRef.current) return null;

  return <primitive object={materialRef.current} attach="material" />;
}

/**
 * Skills Section Background - UI/UX Design System Theme
 * Renders a subtle animated background with:
 * - Design grid system (8px baseline grid)
 * - Floating wireframe artboards
 * - Design element particles
 * - Corner markers (Figma-style)
 * - Theme-aware colors (light/dark mode)
 */
export function SkillsBackground() {
  return (
    <Canvas
      className="absolute inset-0 -z-10"
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ preserveDrawingBuffer: false, alpha: true, antialias: true }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={[0x000000]} />
      <fog attach="fog" args={[0x000000, 10, 50]} />
      <SkillsBackgroundMesh />
    </Canvas>
  );
}

