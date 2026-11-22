"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate, useSafeMotion } from "@/hooks/use-reduced-motion";

interface ScrollProgressPathProps {
  className?: string;
  points?: Array<{ x: number; y: number; z: number; label?: string; color?: string }>;
  lineColor?: string;
  pointColors?: string[];
  lineWidth?: number;
  pointSize?: number;
  animated?: boolean;
  duration?: number;
}

export function ScrollProgressPath({
  className = "",
  points = [],
  lineColor,
  pointColors,
  lineWidth = 3,
  pointSize = 0.2,
  animated = true,
  duration = 2,
}: ScrollProgressPathProps) {
  const shouldAnimate = useShouldAnimate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || !resolvedTheme;

  const defaultPoints = useMemo(() => [
    { x: -5, y: -3, z: 0, label: "Start" },
    { x: -2, y: -1, z: 1, label: "Junior" },
    { x: 0, y: 1, z: 0, label: "Mid" },
    { x: 2, y: 3, z: -1, label: "Senior" },
    { x: 5, y: 5, z: 0, label: "Lead" },
  ], []);

  const pathPoints = points.length > 0 ? points : defaultPoints;
  const themeLineColor = lineColor || (isDark ? "#818cf8" : "#6366f1");
  const themePointColors = pointColors || [
    isDark ? "#a5b4fc" : "#6366f1",
    isDark ? "#fcd34d" : "#f59e0b",
    isDark ? "#6ee7b7" : "#1d9e75",
    isDark ? "#fca5a5" : "#ef4444",
    isDark ? "#c4b5fd" : "#8b5cf6",
  ];

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 15], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <PathSystem
        points={pathPoints}
        lineColor={themeLineColor}
        pointColors={themePointColors}
        lineWidth={lineWidth}
        pointSize={pointSize}
        animated={animated && shouldAnimate}
        duration={duration}
        isDark={isDark}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
    </Canvas>
  );
}

interface PathSystemProps {
  points: Array<{ x: number; y: number; z: number; label?: string }>;
  lineColor: string;
  pointColors: string[];
  lineWidth: number;
  pointSize: number;
  animated: boolean;
  duration: number;
  isDark: boolean;
}

function PathSystem({
  points,
  lineColor,
  pointColors,
  lineWidth,
  pointSize,
  animated,
  duration,
  isDark,
}: PathSystemProps) {
  const lineRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const progressLineRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const pointRefs = useRef<THREE.Mesh[]>([]);
  const progressRef = useRef(0);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null);

  useFrame((state, delta) => {
    if (!animated) return;

    if (!curveRef.current && points.length > 1) {
      // Create smooth curve through points
      const curvePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
      curveRef.current = new THREE.CatmullRomCurve3(curvePoints);
      curveRef.current.closed = false;
    }

    // Animate progress
    progressRef.current = (progressRef.current + delta / duration) % 1;

    // Update line drawing progress using tube geometry draw range
    if (progressLineRef.current && tubeGeometryRef.current) {
      const geometry = progressLineRef.current.geometry as THREE.TubeGeometry;
      const totalSegments = geometry.parameters.tubularSegments ?? 100;
      const visibleSegments = Math.floor(totalSegments * progressRef.current);

      // Use drawRange on the geometry (works for both indexed and non-indexed)
      geometry.setDrawRange(0, visibleSegments * 12); // 12 indices per segment (6 faces * 2 triangles)
      geometry.drawRange = geometry.drawRange;
    }

    // Animate points along the curve
    if (curveRef.current && pointRefs.current.length > 0) {
      pointRefs.current.forEach((mesh, index) => {
        const pointProgress = (progressRef.current + index * 0.2) % 1;
        const position = curveRef.current!.getPointAt(pointProgress);
        mesh.position.copy(position);

        // Pulse animation
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
        mesh.scale.setScalar(pulseScale);
      });
    }
  });

  // Create the curved line geometry as a tube (mesh-based line)
  const { lineGeometry, progressLineGeometry } = useMemo(() => {
    if (points.length < 2) {
      return {
        lineGeometry: new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)), 10, lineWidth / 100, 4, false),
        progressLineGeometry: new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)), 10, lineWidth / 100, 4, false)
      };
    }
    const curvePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    // Base line tube (always visible, lower opacity)
    const baseTube = new THREE.TubeGeometry(curve, 100, lineWidth / 100, 8, false);

    // Progress line tube (animated draw)
    const progressTube = new THREE.TubeGeometry(curve, 100, lineWidth / 80, 8, false); // slightly thicker

    tubeGeometryRef.current = progressTube;

    return { lineGeometry: baseTube, progressLineGeometry: progressTube };
  }, [points, lineWidth]);

  // Create point geometries
  const pointGeometries = useMemo(() => {
    return points.map((_, index) => {
      const geometry = new THREE.SphereGeometry(pointSize, 16, 16);
      return geometry;
    });
  }, [points, pointSize]);

  return (
    <group>
      {/* Base curved path line (tube mesh) - always visible, subtle */}
      <mesh
        ref={lineRef}
        geometry={lineGeometry}
      >
        <meshBasicMaterial
          color={lineColor}
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated progress line (draws along the path) - tube mesh with draw range */}
      {animated && (
        <mesh
          ref={progressLineRef}
          geometry={progressLineGeometry}
        >
          <meshBasicMaterial
            color={lineColor}
            transparent={true}
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Points at each milestone */}
      {points.map((point, index) => (
        <mesh
          key={index}
          ref={(el) => { if (el) pointRefs.current[index] = el; }}
          position={[point.x, point.y, point.z]}
        >
          <sphereGeometry args={[pointSize, 16, 16]} />
          <meshStandardMaterial
            color={pointColors[index % pointColors.length]}
            metalness={0.2}
            roughness={0.5}
            emissive={pointColors[index % pointColors.length]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Glowing particles along the path */}
      {animated && <PathParticles curve={curveRef.current} color={lineColor} count={50} isDark={isDark} />}
    </group>
  );
}

function PathParticles({
  curve,
  color,
  count = 50,
  isDark,
}: {
  curve: THREE.CatmullRomCurve3 | null;
  color: string;
  count: number;
  isDark: boolean;
}) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const particleData = useRef<Array<{ progress: number; speed: number; size: number }>>([]);

  useFrame((state, delta) => {
    if (!curve || !pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;

    // Initialize particles on first frame
    if (particleData.current.length === 0) {
      for (let i = 0; i < count; i++) {
        particleData.current.push({
          progress: Math.random(),
          speed: 0.05 + Math.random() * 0.15,
          size: 0.5 + Math.random() * 1.5,
        });
      }
    }

    particleData.current.forEach((particle, index) => {
      particle.progress = (particle.progress + delta * particle.speed) % 1;
      const position = curve.getPointAt(particle.progress);
      positions[index * 3] = position.x;
      positions[index * 3 + 1] = position.y;
      positions[index * 3 + 2] = position.z;

      // Pulse size
      sizes[index] = particle.size * (1 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.3);
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
      sizes[i] = 1;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count, color]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={isDark ? 0.8 : 0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Wrapper component for scroll-linked progress (to be used with useScroll)
interface ScrollLinkedPathProps {
  progress: number; // 0 to 1 from useScroll
  points: Array<{ x: number; y: number; z: number; label?: string }>;
  className?: string;
  lineColor?: string;
  pointColors?: string[];
  lineWidth?: number;
  pointSize?: number;
  isDark?: boolean;
}

export function ScrollLinkedPath({
  progress,
  points,
  className = "",
  lineColor,
  pointColors,
  lineWidth = 3,
  pointSize = 0.2,
  isDark = false,
}: ScrollLinkedPathProps) {
  const shouldAnimate = useShouldAnimate();
  const themeLineColor = lineColor || (isDark ? "#818cf8" : "#6366f1");
  const themePointColors = pointColors || [
    isDark ? "#a5b4fc" : "#6366f1",
    isDark ? "#fcd34d" : "#f59e0b",
    isDark ? "#6ee7b7" : "#1d9e75",
    isDark ? "#fca5a5" : "#ef4444",
    isDark ? "#c4b5fd" : "#8b5cf6",
  ];

  const lineRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const progressLineRef = useRef<THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const pointRefs = useRef<THREE.Mesh[]>([]);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null);

  useFrame(() => {
    if (!shouldAnimate) return;

    if (!curveRef.current && points.length > 1) {
      const curvePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
      curveRef.current = new THREE.CatmullRomCurve3(curvePoints);
    }

    // Update line draw range based on scroll progress
    if (progressLineRef.current && tubeGeometryRef.current) {
      const geometry = progressLineRef.current.geometry as THREE.TubeGeometry;
      const totalSegments = geometry.parameters.tubularSegments ?? 100;
      const visibleSegments = Math.floor(totalSegments * progress);

      // Use drawRange on the geometry
      geometry.setDrawRange(0, visibleSegments * 12);
      geometry.drawRange = geometry.drawRange;
    }

    // Move points along curve based on progress
    if (curveRef.current && pointRefs.current.length > 0) {
      pointRefs.current.forEach((mesh, index) => {
        const pointProgress = (progress + index * 0.15) % 1;
        const position = curveRef.current!.getPointAt(pointProgress);
        mesh.position.copy(position);

        // Pulse when point is "active" (near current progress)
        const distanceToProgress = Math.abs(pointProgress - progress);
        const isActive = distanceToProgress < 0.1 || distanceToProgress > 0.9;
        const targetScale = isActive ? 1.5 : 1;
        mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1));
      });
    }
  });

  const lineGeometry = useMemo(() => {
    if (points.length < 2) {
      return {
        lineGeometry: new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)), 10, lineWidth / 100, 4, false),
        progressLineGeometry: new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)), 10, lineWidth / 100, 4, false)
      };
    }
    const curvePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    const baseTube = new THREE.TubeGeometry(curve, 100, lineWidth / 100, 8, false);
    const progressTube = new THREE.TubeGeometry(curve, 100, lineWidth / 80, 8, false);

    tubeGeometryRef.current = progressTube;

    return { lineGeometry: baseTube, progressLineGeometry: progressTube };
  }, [points, lineWidth]);

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 15], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <group>
        <mesh
          ref={lineRef}
          geometry={lineGeometry.lineGeometry}
        >
          <meshBasicMaterial
            color={themeLineColor}
            transparent={true}
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Progress line */}
        <mesh
          ref={progressLineRef}
          geometry={lineGeometry.progressLineGeometry}
        >
          <meshBasicMaterial
            color={themeLineColor}
            transparent={true}
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Milestone points */}
        {points.map((point, index) => (
          <mesh
            key={index}
            ref={(el) => { if (el) pointRefs.current[index] = el; }}
            position={[point.x, point.y, point.z]}
          >
            <sphereGeometry args={[pointSize, 16, 16]} />
            <meshStandardMaterial
              color={themePointColors[index % themePointColors.length]}
              metalness={0.2}
              roughness={0.5}
              emissive={themePointColors[index % themePointColors.length]}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Moving indicator at current progress */}
        {curveRef.current && progress > 0 && progress < 1 && (
          <mesh
            position={curveRef.current.getPointAt(progress)}
          >
            <sphereGeometry args={[pointSize * 1.5, 16, 16]} />
            <meshStandardMaterial
              color={themeLineColor}
              metalness={0}
              roughness={0.3}
              emissive={themeLineColor}
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
    </Canvas>
  );
}
