"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

interface GeometricOrbitProps {
  className?: string;
  itemCount?: number;
  radius?: number;
  colors?: string[];
  rotationSpeed?: number;
  itemSize?: number;
  interactive?: boolean;
}

export function GeometricOrbit({
  className = "",
  itemCount = 12,
  radius = 4,
  colors = ["#6366f1", "#818cf8", "#a5b4fc", "#f59e0b", "#1d9e75"],
  rotationSpeed = 0.15,
  itemSize = 0.3,
  interactive = true,
}: GeometricOrbitProps) {
  const shouldAnimate = useShouldAnimate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || !resolvedTheme;

  const orbits = useMemo(() => {
    const orbitData = [];
    for (let i = 0; i < itemCount; i++) {
      const orbitRadius = radius * (0.5 + Math.random() * 0.5);
      const theta = (i / itemCount) * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;

      const color = colors[Math.floor(Math.random() * colors.length)];
      const hex = color.replace("#", "");
      const colorObj = [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];

      // Different geometries
      const geometryTypes = ["box", "sphere", "octahedron", "tetrahedron", "icosahedron"];
      const geometryType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];

      orbitData.push({
        radius: orbitRadius,
        theta,
        phi,
        color: colorObj,
        geometryType,
        size: itemSize * (0.5 + Math.random() * 1.5),
        rotationSpeed: (Math.random() - 0.5) * 2,
        initialTheta: theta,
        initialPhi: phi,
      });
    }
    return orbitData;
  }, [itemCount, radius, colors, itemSize]);

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 12], fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      shadows={false}
    >
      <OrbitSystem
        orbits={orbits}
        rotationSpeed={rotationSpeed}
        interactive={interactive}
        isDark={isDark}
        shouldAnimate={shouldAnimate}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
    </Canvas>
  );
}

function OrbitSystem({
  orbits,
  rotationSpeed,
  interactive,
  isDark,
  shouldAnimate,
}: {
  orbits: Array<{
    radius: number;
    theta: number;
    phi: number;
    color: number[];
    geometryType: string;
    size: number;
    rotationSpeed: number;
    initialTheta: number;
    initialPhi: number;
  }>;
  rotationSpeed: number;
  interactive: boolean;
  isDark: boolean;
  shouldAnimate: boolean;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);

  // Create meshes on mount - do it once in useEffect-like pattern
  useFrame((state, delta) => {
    if (!initializedRef.current && groupRef.current) {
      const group = groupRef.current;
      orbits.forEach((orbit, index) => {
        let geometry: THREE.BufferGeometry;
        switch (orbit.geometryType) {
          case "box":
            geometry = new THREE.BoxGeometry(orbit.size, orbit.size, orbit.size);
            break;
          case "sphere":
            geometry = new THREE.SphereGeometry(orbit.size, 16, 16);
            break;
          case "octahedron":
            geometry = new THREE.OctahedronGeometry(orbit.size, 0);
            break;
          case "tetrahedron":
            geometry = new THREE.TetrahedronGeometry(orbit.size, 0);
            break;
          case "icosahedron":
            geometry = new THREE.IcosahedronGeometry(orbit.size, 0);
            break;
          default:
            geometry = new THREE.BoxGeometry(orbit.size, orbit.size, orbit.size);
        }

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(orbit.color[0], orbit.color[1], orbit.color[2]),
          metalness: 0.3,
          roughness: 0.6,
          transparent: true,
          opacity: isDark ? 0.8 : 0.6,
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Position on sphere immediately - don't render at origin
        const x = orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta);
        const y = orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta);
        const z = orbit.radius * Math.cos(orbit.phi);
        mesh.position.set(x, y, z);

        mesh.userData = {
          orbit,
          initialTheta: orbit.initialTheta,
          initialPhi: orbit.initialPhi,
        };

        group.add(mesh);
        meshRefs.current.push(mesh);
      });
      initializedRef.current = true;
    }

    if (!shouldAnimate || !groupRef.current || !initializedRef.current) return;

    const group = groupRef.current;

    // Group rotation
    group.rotation.y += delta * rotationSpeed;

    // Individual item rotations and orbit movement
    meshRefs.current.forEach((mesh, index) => {
      const { orbit } = mesh.userData;
      if (!orbit) return;

      // Self rotation
      mesh.rotation.x += delta * orbit.rotationSpeed;
      mesh.rotation.y += delta * orbit.rotationSpeed * 0.5;

      // Orbital movement
      orbit.theta += delta * rotationSpeed * (0.5 + index * 0.1);
      const x = orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta);
      const y = orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta);
      const z = orbit.radius * Math.cos(orbit.phi);
      mesh.position.set(x, y, z);

      // Mouse interaction - slight attraction/repulsion
      if (interactive && (mouseRef.current.x !== 0 || mouseRef.current.y !== 0)) {
        const influence = 0.02;
        mesh.position.x += mouseRef.current.x * influence;
        mesh.position.y -= mouseRef.current.y * influence;
      }
    });

    // Smooth mouse follow for group
    if (interactive) {
      group.rotation.x += (targetRotationRef.current.x - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationRef.current.y - group.rotation.y) * 0.05;
    }
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    targetRotationRef.current.x = mouseRef.current.y * 0.3;
    targetRotationRef.current.y = mouseRef.current.x * 0.3;
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
    targetRotationRef.current = { x: 0, y: 0 };
  };

  return (
    <group ref={groupRef} onPointerMove={handleMouseMove} onPointerLeave={handleMouseLeave}>
      {/* Removed empty group that could cause rendering artifacts */}
    </group>
  );
}