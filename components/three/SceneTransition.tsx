"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens, springs } from "@/lib/motion-tokens";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";

interface SceneTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: "wipe" | "morph" | "dissolve" | "slide" | "pixelate" | "liquid";
  duration?: number;
  direction?: "forward" | "backward";
  onComplete?: () => void;
}

export function SceneTransition({
  children,
  className = "",
  transitionType = "wipe",
  duration = 1.2,
  direction = "forward",
  onComplete,
}: SceneTransitionProps) {
  const shouldAnimate = useShouldAnimate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || !resolvedTheme;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const triggerTransition = (dir: "forward" | "backward") => {
    if (!shouldAnimate) {
      onComplete?.();
      return;
    }
    setIsTransitioning(true);
    setTransitionProgress(0);
    direction = dir;
  };

  // This component provides transition context
  return (
    <SceneTransitionProvider
      value={{
        isTransitioning,
        transitionProgress,
        triggerTransition,
        transitionType,
        duration,
        direction,
        onComplete,
      }}
    >
      <motion.div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}

        {/* Transition overlay */}
        <AnimatePresence mode="wait">
          {isTransitioning && (
            <SceneTransitionOverlay
              key={`transition-${direction}`}
              transitionType={transitionType}
              duration={duration}
              direction={direction}
              isDark={isDark}
              onComplete={() => {
                setIsTransitioning(false);
                setTransitionProgress(0);
                onComplete?.();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </SceneTransitionProvider>
  );
}

// Context for transition state
interface TransitionContextValue {
  isTransitioning: boolean;
  transitionProgress: number;
  triggerTransition: (dir: "forward" | "backward") => void;
  transitionType: string;
  duration: number;
  direction: "forward" | "backward";
  onComplete?: () => void;
}

const TransitionContext = React.createContext<TransitionContextValue | null>(null);

function SceneTransitionProvider({
  value,
  children,
}: { value: TransitionContextValue; children: React.ReactNode }) {
  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useSceneTransition() {
  const context = React.useContext(TransitionContext);
  if (!context) {
    throw new Error("useSceneTransition must be used within a SceneTransition provider");
  }
  return context;
}

// Main transition overlay using R3F
function SceneTransitionOverlay({
  transitionType,
  duration,
  direction,
  isDark,
  onComplete,
}: {
  transitionType: string;
  duration: number;
  direction: "forward" | "backward";
  isDark: boolean;
  onComplete: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <TransitionScene
          type={transitionType}
          duration={duration}
          direction={direction}
          isDark={isDark}
          onComplete={onComplete}
        />
      </Canvas>
    </div>
  );
}

function TransitionScene({
  type,
  duration,
  direction,
  isDark,
  onComplete,
}: {
  type: string;
  duration: number;
  direction: "forward" | "backward";
  isDark: boolean;
  onComplete: () => void;
}) {
  const { clock } = useThree();
  const startTime = clock.elapsedTime;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      onComplete();
    }
  });

  switch (type) {
    case "wipe":
      return <WipeTransition direction={direction} isDark={isDark} duration={duration} />;
    case "morph":
      return <MorphTransition direction={direction} isDark={isDark} duration={duration} />;
    case "dissolve":
      return <DissolveTransition direction={direction} isDark={isDark} duration={duration} />;
    case "slide":
      return <SlideTransition direction={direction} isDark={isDark} duration={duration} />;
    case "pixelate":
      return <PixelateTransition direction={direction} isDark={isDark} duration={duration} />;
    case "liquid":
      return <LiquidTransition direction={direction} isDark={isDark} duration={duration} />;
    default:
      return <WipeTransition direction={direction} isDark={isDark} duration={duration} />;
  }
}

// Wipe transition - revealing new scene with a moving line/shape
function WipeTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useThree().clock.elapsedTime;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (meshRef.current) {
      const scale = direction === "forward" ? eased : 1 - eased;
      meshRef.current.scale.x = scale;
      meshRef.current.scale.y = scale;
    }
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Morph transition - organic shape morphing
function MorphTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePositionsRef = useRef<Float32Array | null>(null);
  const startTime = useThree().clock.elapsedTime;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      const basePositions = basePositionsRef.current ?? positions.slice();
      basePositionsRef.current ??= basePositions;

      // Morph between circle and organic shape
      for (let i = 0; i < positions.length; i += 3) {
        const x = basePositions[i];
        const y = basePositions[i + 1];
        const angle = Math.atan2(y, x);
        const radius = Math.sqrt(x * x + y * y);

        // Target: organic blob shape
        const targetRadius = radius * (1 + 0.5 * Math.sin(angle * 5 + state.clock.elapsedTime * 2));
        const currentRadius = radius + (targetRadius - radius) * eased;

        positions[i] = Math.cos(angle) * currentRadius;
        positions[i + 1] = Math.sin(angle) * currentRadius;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.scale.setScalar(direction === "forward" ? eased : 1 - eased);
    }
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <circleGeometry args={[5, 64]} />
      <meshBasicMaterial
        color={color}
        transparent={true}
        opacity={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Dissolve transition - particle-based dissolve
function DissolveTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const startTime = useThree().clock.elapsedTime;
  const particleCount = 5000;

  const geometry = useRef<THREE.BufferGeometry>(null);
  const basePositions = useRef<Float32Array>(null);
  const velocities = useRef<Float32Array>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (!pointsRef.current) return;

    if (!basePositions.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      basePositions.current = positions.slice();
      velocities.current = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        velocities.current[i] = (Math.random() - 0.5) * 10;
      }
    }

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const alphas = pointsRef.current.geometry.attributes.alpha?.array as Float32Array;

    if (!velocities.current || !basePositions.current) return;

    for (let i = 0; i < particleCount; i++) {
      const progress3D = i / particleCount;
      const delay = progress3D * 0.3;
      const particleProgress = Math.max(0, (eased - delay) / (1 - delay));

      if (direction === "forward") {
        // Dissolve out
        positions[i * 3] += velocities.current[i * 3] * particleProgress * 0.1;
        positions[i * 3 + 1] += velocities.current[i * 3 + 1] * particleProgress * 0.1;
        positions[i * 3 + 2] += velocities.current[i * 3 + 2] * particleProgress * 0.1;
        if (alphas) alphas[i] = 1 - particleProgress;
      } else {
        // Assemble in
        const targetX = basePositions.current[i * 3];
        const targetY = basePositions.current[i * 3 + 1];
        const targetZ = basePositions.current[i * 3 + 2];
        positions[i * 3] = positions[i * 3] * (1 - particleProgress) + targetX * particleProgress;
        positions[i * 3 + 1] = positions[i * 3 + 1] * (1 - particleProgress) + targetY * particleProgress;
        positions[i * 3 + 2] = positions[i * 3 + 2] * (1 - particleProgress) + targetZ * particleProgress;
        if (alphas) alphas[i] = particleProgress;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (alphas) pointsRef.current.geometry.attributes.alpha.needsUpdate = true;
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  // Create initial geometry - full screen quad of particles
  if (!geometry.current) {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < particleCount; i++) {
      // Distribute across screen
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = 0.5 + Math.random() * 1.5;
      alphas[i] = direction === "forward" ? 1 : 0;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    geometry.current = g;
  }

  return (
    <points ref={pointsRef} geometry={geometry.current}>
      <pointsMaterial
        size={1.5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Slide transition - directional slide with depth
function SlideTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useThree().clock.elapsedTime;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (groupRef.current) {
      const slideDistance = 15;
      const offset = direction === "forward" ? -slideDistance * (1 - eased) : slideDistance * eased;
      groupRef.current.position.x = offset;
    }
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color={color} transparent={true} opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Accent lines */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, -7 + i * 3.5, 0.1]}>
          <planeGeometry args={[20, 0.5]} />
          <meshBasicMaterial
            color={isDark ? "#a5b4fc" : "#4f46e5"}
            transparent={true}
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Pixelate transition - retro pixel effect
function PixelateTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useThree().clock.elapsedTime;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (meshRef.current) {
      // Scale the pixel grid
      const scale = direction === "forward" ? eased : 1 - eased;
      meshRef.current.scale.setScalar(scale);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = direction === "forward" ? eased : 1 - eased;
    }
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  // Create pixelated geometry
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const indices = [];

    const pixelSize = 0.3;
    const gridSize = 30;
    let vertexIndex = 0;

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        if (Math.random() > 0.1) continue; // Sparse pixels

        const px = x * pixelSize;
        const py = y * pixelSize;
        const size = pixelSize * (0.5 + Math.random() * 0.5);

        // Quad vertices
        positions.push(px - size / 2, py - size / 2, 0);
        positions.push(px + size / 2, py - size / 2, 0);
        positions.push(px + size / 2, py + size / 2, 0);
        positions.push(px - size / 2, py + size / 2, 0);

        const colorObj = new THREE.Color(color);
        for (let c = 0; c < 4; c++) {
          colors.push(colorObj.r, colorObj.g, colorObj.b);
        }

        indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2, vertexIndex, vertexIndex + 2, vertexIndex + 3);
        vertexIndex += 4;
      }
    }

    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.setIndex(indices);

    return g;
  }, [color]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -1]}>
      <meshBasicMaterial vertexColors={true} transparent={true} opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Liquid transition - fluid simulation inspired
function LiquidTransition({
  direction,
  isDark,
  duration,
}: { direction: "forward" | "backward"; isDark: boolean; duration: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useThree().clock.elapsedTime;
  const basePositions = useRef<Float32Array>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = THREE.MathUtils.smootherstep(0, 1, progress);

    if (!meshRef.current) return;

    if (!basePositions.current) {
      basePositions.current = (meshRef.current.geometry.attributes.position.array as Float32Array).slice();
    }

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < positions.length; i += 3) {
      const x = basePositions.current[i];
      const y = basePositions.current[i + 1];

      // Wave simulation
      const dist = Math.sqrt(x * x + y * y);
      const wave = Math.sin(dist * 2 - time * 5) * 0.5;
      const wave2 = Math.sin(x * 3 - time * 3) * 0.3;
      const wave3 = Math.sin(y * 3 - time * 4) * 0.3;

      const displacement = (wave + wave2 + wave3) * eased * (direction === "forward" ? 1 : 1 - eased);

      positions[i] = x + displacement * Math.cos(Math.atan2(y, x));
      positions[i + 1] = y + displacement * Math.sin(Math.atan2(y, x));
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.scale.setScalar(direction === "forward" ? eased : 1 - eased);
  });

  const color = isDark ? "#818cf8" : "#6366f1";

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    const resolution = 80;
    const size = 15;

    for (let y = 0; y <= resolution; y++) {
      for (let x = 0; x <= resolution; x++) {
        const px = (x / resolution - 0.5) * size;
        const py = (y / resolution - 0.5) * size;
        positions.push(px, py, 0);
      }
    }

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const a = y * (resolution + 1) + x;
        const b = a + 1;
        const c = a + resolution + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();

    return g;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -1]}>
      <meshPhysicalMaterial
        color={color}
        transparent={true}
        opacity={0.9}
        metalness={0}
        roughness={0.2}
        transmission={0.3}
        thickness={0.5}
        ior={1.33}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Hook for page-level transitions
export function usePageTransition() {
  const transition = useSceneTransition();

  const navigateWithTransition = (href: string, dir: "forward" | "backward" = "forward") => {
    transition.triggerTransition(dir);
    // Navigate after transition starts
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  return {
    ...transition,
    navigateWithTransition,
  };
}

// Link wrapper with automatic transition
interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  direction?: "forward" | "backward";
  transitionType?: "wipe" | "morph" | "dissolve" | "slide" | "pixelate" | "liquid";
}

export function TransitionLink({
  href,
  children,
  className = "",
  direction = "forward",
  transitionType = "wipe",
}: TransitionLinkProps) {
  const { triggerTransition } = useSceneTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerTransition(direction);
    setTimeout(() => {
      window.location.href = href;
    }, 150);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`transition-link ${className}`}
      style={{ cursor: "pointer" }}
    >
      {children}
    </a>
  );
}

// Transition-aware page wrapper
interface TransitionPageProps {
  children: React.ReactNode;
  layoutId?: string;
  className?: string;
}

export function TransitionPage({ children, layoutId, className = "" }: TransitionPageProps) {
  const shouldAnimate = useShouldAnimate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!shouldAnimate || !mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      layoutId={layoutId}
      initial={{ opacity: 0, y: motionTokens.distance.sm }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -motionTokens.distance.sm }}
      transition={{
        duration: motionTokens.duration.normal,
        ease: motionTokens.easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children on page enter
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function StaggerContainer({ children, className = "", delay = 0.1, stagger = 0.08 }: StaggerContainerProps) {
  const shouldAnimate = useShouldAnimate();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: motionTokens.distance.md },
    visible: { opacity: 1, y: 0, transition: springs.gentle },
  };

  return (
    <motion.div className={className} variants={containerVariants} initial="hidden" animate="visible">
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ children?: React.ReactNode }>, {
              key: child.key || index,
            })
          : child
      )}
    </motion.div>
  );
}

import React, { useMemo } from "react";
