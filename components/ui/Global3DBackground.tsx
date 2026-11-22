"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useShouldAnimate } from "@/hooks/use-reduced-motion";
import {
  heroBackgroundMaterial,
  particleFieldMaterial,
  createShaderMaterial,
} from "@/components/three/ShaderMaterials";
import * as THREE from "three";

interface Global3DBackgroundProps {
  variant?: "hero" | "ambient" | "minimal";
  className?: string;
  children?: React.ReactNode;
}

export function Global3DBackground({
  variant = "ambient",
  className = "",
  children,
}: Global3DBackgroundProps) {
  const shouldAnimate = useShouldAnimate();
  const { resolvedTheme, forcedTheme } = useTheme();
  const pathname = usePathname();

  // Default to light mode when theme is not yet resolved to avoid dark flash
  const isDark = resolvedTheme === "dark" || forcedTheme === "dark" || (!resolvedTheme && !forcedTheme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Don't render 3D background on admin, docs, and other non-public routes
  // during prerendering to avoid R3F hooks outside Canvas errors
  const excludedPaths = ["/admin", "/docs", "/work", "/projects", "/_not-found", "/404", "/500"];
  if (pathname && excludedPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  // La 3D est décorative : ne pas créer de contexte WebGL sur les appareils
  // faibles ou lorsque l'utilisateur demande moins de mouvement.
  if (!shouldAnimate) {
    return null;
  }

  switch (variant) {
    case "hero":
      return <HeroBackground isDark={isDark} shouldAnimate={shouldAnimate} className={className} />;
    case "minimal":
      return <MinimalBackground isDark={isDark} shouldAnimate={shouldAnimate} className={className} />;
    case "ambient":
    default:
      return (
        <AmbientBackground
          isDark={isDark}
          shouldAnimate={shouldAnimate}
          className={className}
        >
          {children}
        </AmbientBackground>
      );
  }
}

// Hero section background with custom shader
function HeroBackground({
  isDark,
  shouldAnimate,
  className,
}: { isDark: boolean; shouldAnimate: boolean; className?: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const startTime = useRef(0);

  const colors = useMemo(() => {
    if (isDark) {
      return {
        colorA: new THREE.Color(0x0f172a),
        colorB: new THREE.Color(0x1e1b4b),
        colorC: new THREE.Color(0x0c4a6e),
      };
    }
    return {
      colorA: new THREE.Color(0xf5f7ff),  // Near white with barely visible indigo tint
      colorB: new THREE.Color(0xfafbff),  // Near white with barely visible blue tint
      colorC: new THREE.Color(0xf5fdf8),  // Near white with barely visible green tint
    };
  }, [isDark]);

  const material = useMemo(() => {
    const mat = heroBackgroundMaterial.clone();
    mat.uniforms.uColorA.value = colors.colorA;
    mat.uniforms.uColorB.value = colors.colorB;
    mat.uniforms.uColorC.value = colors.colorC;
    mat.uniforms.uIntensity.value = isDark ? 0.8 : 1.0; // Full intensity for light mode to match fog brightness
    materialRef.current = mat;
    return mat;
  }, [colors, isDark]);

  return (
    <div className={`absolute inset-0 z-[-1] pointer-events-none ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}>
        <HeroBackgroundMesh material={material} shouldAnimate={shouldAnimate} startTime={startTime} materialRef={materialRef} />
        <fog attach="fog" args={[isDark ? "#09090b" : "#fafafa", 10, 50]} />
      </Canvas>
    </div>
  );
}

// Inner component that runs inside Canvas - useFrame works here
function HeroBackgroundMesh({
  material,
  shouldAnimate,
  startTime,
  materialRef,
}: {
  material: THREE.ShaderMaterial;
  shouldAnimate: boolean;
  startTime: React.MutableRefObject<number>;
  materialRef: React.MutableRefObject<THREE.ShaderMaterial | null>;
}) {
  useFrame((state) => {
    if (!shouldAnimate || !materialRef.current) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;

    materialRef.current.uniforms.uTime.value = elapsed * 0.3;
    materialRef.current.uniforms.uSpeed.value = 0.15;
  });

  return <mesh geometry={new THREE.PlaneGeometry(20, 20)} material={material} position={[0, 0, -1]} />;
}

// Ambient background with subtle particles and stars
function AmbientBackground({
  isDark,
  shouldAnimate,
  className,
  children,
}: { isDark: boolean; shouldAnimate: boolean; className?: string; children?: React.ReactNode }) {
  const particleRef = useRef<THREE.Points>(null);
  const starRef = useRef<THREE.Group>(null);
  const startTime = useRef(0);

  // Particle configuration
  const particleUniforms = useMemo(() => {
    return {
      ...particleFieldMaterial.uniforms,
      uTime: { value: 0 },
      uGlowColor: { value: isDark ? new THREE.Color(0x818cf8) : new THREE.Color(0x6366f1) },
      uGlowIntensity: { value: isDark ? 0.6 : 0.55 }, // Increased from 0.4 to 0.55
      uGravity: { value: new THREE.Vector3(0, -0.02, 0) },
      uTurbulence: { value: 0.3 },
    };
  }, [isDark]);

  const particleMaterial = useMemo(() => {
    return createShaderMaterial({
      vertexShader: particleFieldMaterial.vertexShader,
      fragmentShader: particleFieldMaterial.fragmentShader,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [particleUniforms]);

  // Generate particle positions
  const particleGeometry = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const delay = new Float32Array(count);

    const colorOptions = isDark
      ? [new THREE.Color(0x818cf8), new THREE.Color(0xa5b4fc), new THREE.Color(0xc4b5fd)]
      : [new THREE.Color(0x6366f1), new THREE.Color(0x818cf8), new THREE.Color(0xa5b4fc)];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 15 + Math.random() * 10;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.5 + Math.random() * 1.5;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      life[i] = 20 + Math.random() * 40;
      delay[i] = Math.random() * 60;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("aLife", new THREE.BufferAttribute(life, 1));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));

    return geometry;
  }, [isDark]);

  const starCount = isDark ? 2000 : 1000;

  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 50], fov: 50 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}>
        <AmbientParticles
          particleRef={particleRef}
          starRef={starRef}
          startTime={startTime}
          shouldAnimate={shouldAnimate}
          particleGeometry={particleGeometry}
          particleMaterial={particleMaterial}
          starCount={starCount}
        />
        {/* Optional: Render children in 3D space */}
        {children && (
          <Html
            center
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "auto",
            }}
          >
            {children}
          </Html>
        )}
        <fog attach="fog" args={[isDark ? "#09090b" : "#fafafa", 50, 150]} />
      </Canvas>
    </div>
  );
}

// Inner component for particle animation - runs inside Canvas
function AmbientParticles({
  particleRef,
  starRef,
  startTime,
  shouldAnimate,
  particleGeometry,
  particleMaterial,
  starCount,
}: {
  particleRef: React.MutableRefObject<THREE.Points | null>;
  starRef: React.MutableRefObject<THREE.Group | null>;
  startTime: React.MutableRefObject<number>;
  shouldAnimate: boolean;
  particleGeometry: THREE.BufferGeometry;
  particleMaterial: THREE.ShaderMaterial;
  starCount: number;
}) {
  useFrame((state) => {
    if (!shouldAnimate) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;

    // Animate particles
    if (particleRef.current) {
      particleRef.current.rotation.y += 0.0001;
      particleRef.current.rotation.x += 0.00005;
      (particleRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
    }

    // Slowly rotate stars
    if (starRef.current) {
      starRef.current.rotation.y += 0.00005;
      starRef.current.rotation.x += 0.00002;
    }
  });

  return (
    <>
      {/* Particle field */}
      <points ref={particleRef} geometry={particleGeometry} material={particleMaterial} />

      {/* Stars */}
      <group ref={starRef} rotation={[0, 0, Math.PI / 4]}>
        <Stars
          radius={100}
          depth={50}
          count={starCount}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
      </group>
    </>
  );
}

// Minimal background for performance-sensitive pages
function MinimalBackground({
  isDark,
  shouldAnimate,
  className,
}: { isDark: boolean; shouldAnimate: boolean; className?: string }) {
  const starRef = useRef<THREE.Group>(null);
  const startTime = useRef(0);

  const starCount = isDark ? 800 : 400;

  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 50], fov: 50 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}>
        <MinimalStars starRef={starRef} startTime={startTime} shouldAnimate={shouldAnimate} starCount={starCount} isDark={isDark} />
        <fog attach="fog" args={[isDark ? "#09090b" : "#fafafa", 50, 150]} />
      </Canvas>
    </div>
  );
}

// Inner component for minimal stars animation - runs inside Canvas
function MinimalStars({
  starRef,
  startTime,
  shouldAnimate,
  starCount,
  isDark,
}: {
  starRef: React.MutableRefObject<THREE.Group | null>;
  startTime: React.MutableRefObject<number>;
  shouldAnimate: boolean;
  starCount: number;
  isDark: boolean;
}) {
  useFrame((state) => {
    if (!shouldAnimate) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;

    if (starRef.current) {
      starRef.current.rotation.y += 0.00002;
      starRef.current.rotation.x += 0.00001;
    }
  });

  return (
    <group ref={starRef} rotation={[0, 0, Math.PI / 4]}>
      <Stars
        radius={100}
        depth={50}
        count={starCount}
        factor={isDark ? 2 : 1}
        saturation={0}
        fade
        speed={0.3}
      />
    </group>
  );
}

// Fix: isDark is not accessible here, need to pass it
// Let me fix this by adding isDark to the props

// Export helper components for specific use cases
export function HeroBackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Global3DBackground variant="hero" />
      {children}
    </>
  );
}

export function SectionBackground({ variant = "minimal", children }: { variant?: "ambient" | "minimal"; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Global3DBackground variant={variant} />
      {children}
    </div>
  );
}
