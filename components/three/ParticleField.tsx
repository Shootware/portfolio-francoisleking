"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  radius?: number;
  colors?: string[];
  interactive?: boolean;
  speed?: number;
  size?: number;
}

export function ParticleField({
  className = "",
  particleCount = 500,
  radius = 50,
  colors = ["#6366f1", "#818cf8", "#a5b4fc"],
  interactive = true,
  speed = 1,
  size = 1,
}: ParticleFieldProps) {
  const shouldAnimate = useShouldAnimate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || !resolvedTheme;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const colorObjects = colors.map((c) => {
      const hex = c.replace("#", "");
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    });

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random color from palette
      const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
      colorsArray[i * 3] = color[0];
      colorsArray[i * 3 + 1] = color[1];
      colorsArray[i * 3 + 2] = color[2];

      sizes[i] = size * (0.5 + Math.random() * 1.5);

      // Initial velocity for gentle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions, colorsArray, sizes, velocities };
  }, [particleCount, radius, colors, size]);

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 80], fov: 50 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      shadows={false}
    >
      <ParticleSystem
        particles={particles}
        particleCount={particleCount}
        interactive={interactive}
        speed={speed}
        isDark={isDark}
        shouldAnimate={shouldAnimate}
      />
      <fog attach="fog" args={[isDark ? "#09090b" : "#fafafa", 50, 150]} />
    </Canvas>
  );
}

function ParticleSystem({
  particles,
  particleCount,
  interactive,
  speed,
  isDark,
  shouldAnimate,
}: {
  particles: { positions: Float32Array; colorsArray: Float32Array; sizes: Float32Array; velocities: Float32Array };
  particleCount: number;
  interactive: boolean;
  speed: number;
  isDark: boolean;
  shouldAnimate: boolean;
}) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!shouldAnimate || !pointsRef.current) return;

    const points = pointsRef.current;
    const positions = points.geometry.attributes.position.array as Float32Array;
    const velocities = particles.velocities;

    // Gentle rotation
    points.rotation.y += delta * 0.02 * speed;
    points.rotation.x += delta * 0.01 * speed;

    // Particle movement
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3] * delta * 60 * speed;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60 * speed;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60 * speed;

      // Boundary check - wrap around
      const maxDist = 80;
      const dist = Math.sqrt(
        positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2
      );
      if (dist > maxDist) {
        // Reset to center with new random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 10;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
    }

    points.geometry.attributes.position.needsUpdate = true;

    // Mouse interaction
    if (interactive && (mouseRef.current.x !== 0 || mouseRef.current.y !== 0)) {
      const mouseInfluence = 0.5;
      points.rotation.y += mouseRef.current.x * delta * mouseInfluence;
      points.rotation.x -= mouseRef.current.y * delta * mouseInfluence;
    }
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <points
      ref={pointsRef}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} count={particleCount} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-color" args={[particles.colorsArray, 3]} count={particleCount} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} count={particleCount} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={isDark ? 0.8 : 0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}