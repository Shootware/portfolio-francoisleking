"use client";

import * as THREE from "three";

/**
 * Hero Background Shader - Gradient mesh with animated noise
 * Creates a subtle animated gradient background for the hero section
 */
export const heroBackgroundMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSpeed: { value: 0.15 },
    uIntensity: { value: 0.8 },
    uColorA: { value: new THREE.Color(0x0f172a) },
    uColorB: { value: new THREE.Color(0x1e1b4b) },
    uColorC: { value: new THREE.Color(0x0c4a6e) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec2 vUv;

    // 2D simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.y  = a0.y  * x12.x + h.y  * x12.y;
      g.z  = a0.z  * x12.z + h.z  * x12.w;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;

      // FBM noise for organic movement
      float noise = fbm(uv * 1.5 + uTime * uSpeed, 4);
      float noise2 = fbm(uv * 0.8 - uTime * uSpeed * 0.7, 3);

      // Radial gradient center
      float dist = length(uv);
      float vignette = smoothstep(1.2, 0.3, dist);

      // Color mixing with noise
      float mixFactor = noise * 0.3 + noise2 * 0.2 + 0.5;
      vec3 color = mix(uColorA, uColorB, mixFactor);
      color = mix(color, uColorC, smoothstep(0.3, 0.8, noise));

      // Apply intensity and vignette
      color *= uIntensity * vignette;

      // Subtle pulsing glow at center
      float centerGlow = smoothstep(0.5, 0.0, dist) * 0.15 * (0.5 + 0.5 * sin(uTime * 2.0));
      color += vec3(centerGlow) * uColorB;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
});

/**
 * Particle Field Shader - Animated particles with glow effect
 * Used for ambient background particle systems
 */
export const particleFieldMaterial = {
  vertexShader: /* glsl */ `
    attribute float aSize;
    attribute vec3 aColor;
    attribute vec3 aVelocity;
    attribute float aLife;
    attribute float aDelay;
    uniform float uTime;
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    uniform vec3 uGravity;
    uniform float uTurbulence;
    varying vec3 vColor;
    varying float vAlpha;
    varying float vSize;

    // Simplex noise for turbulence
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.xyz;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 z_ = j - 7.0 * x_ - y_;
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 z = z_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y) - abs(z);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vColor = aColor;
      vSize = aSize;

      // Particle lifetime animation
      float age = mod(uTime * 10.0 + aDelay, aLife);
      float lifeRatio = age / aLife;

      // Position with velocity and turbulence
      vec3 pos = position;
      pos += aVelocity * uTime * 60.0;
      pos += uGravity * uTime * 10.0;

      // Turbulence
      float turb = fbm(pos * 0.1 + uTime * 0.1) * uTurbulence;
      pos.x += turb;
      pos.z += turb;

      // Wrap around boundary
      float maxDist = 80.0;
      float dist = length(pos);
      if (dist > maxDist) {
        float resetTime = uTime * 10.0 + aDelay;
        if (mod(resetTime, aLife) < 0.1) {
          pos = normalize(pos) * 10.0;
        }
      }

      // Alpha based on life
      vAlpha = 1.0 - smoothstep(0.0, 1.0, lifeRatio);
      vAlpha *= smoothstep(0.0, 0.1, lifeRatio); // Fade in

      // Size pulse
      float sizePulse = 1.0 + 0.3 * sin(uTime * 3.0 + aDelay * 10.0);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * sizePulse * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    varying vec3 vColor;
    varying float vAlpha;
    varying float vSize;

    void main() {
      // Circular particle with soft edges
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);

      // Soft circular falloff
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

      // Add glow effect
      float glow = smoothstep(0.5, 0.2, dist) * uGlowIntensity;

      vec3 finalColor = mix(vColor, uGlowColor, glow * 0.5);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uGlowColor: { value: new THREE.Color(0x818cf8) },
    uGlowIntensity: { value: 0.6 },
    uGravity: { value: new THREE.Vector3(0, -0.02, 0) },
    uTurbulence: { value: 0.3 },
  },
};

/**
 * Creates a custom shader material from shader definitions
 */
export function createShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent = true,
  depthWrite = false,
  blending = THREE.NormalBlending,
}: {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, THREE.IUniform>;
  transparent?: boolean;
  depthWrite?: boolean;
  blending?: THREE.Blending;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent,
    depthWrite,
    blending,
  });
}

/**
 * Geometric Orbit Shader - For animated geometric shapes
 */
export const geometricOrbitMaterial = (color: THREE.Color, isDark: boolean) =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: isDark ? 0.15 : 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

/**
 * Interactive Card Shader - For 3D card effects
 */
export const interactiveCardMaterial = (isDark: boolean) =>
  new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x18181b : 0xfafafa,
    metalness: 0,
    roughness: 0.9,
    transmission: 0.1,
    thickness: 0.5,
    ior: 1.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.95,
  });

/**
 * UI/UX Design System Shader - Wireframe artboards, grids, and design elements
 * Subtle animated background representing UI/UX design workflow
 */
export const uiuxDesignShaderMaterial = (isDark: boolean) =>
  new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIsDark: { value: isDark },
      uGridColor: { value: new THREE.Color(isDark ? 0x3b82f6 : 0x6366f1) },
      uAccentColor: { value: new THREE.Color(isDark ? 0x818cf8 : 0x4f46e5) },
      uWireframeColor: { value: new THREE.Color(isDark ? 0x1e293b : 0xe2e8f0) },
      uBgColor: { value: new THREE.Color(isDark ? 0x0f172a : 0xfafafa) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform bool uIsDark;
      uniform vec3 uGridColor;
      uniform vec3 uAccentColor;
      uniform vec3 uWireframeColor;
      uniform vec3 uBgColor;
      varying vec2 vUv;
      varying vec3 vPosition;

      // Hash function for pseudo-random
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      // 2D value noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      // FBM noise
      float fbm(vec2 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 6; i++) {
          if (i >= octaves) break;
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      // Grid pattern
      float grid(vec2 uv, float scale, float thickness) {
        uv *= scale;
        vec2 gridLines = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
        float grid = min(gridLines.x, gridLines.y);
        return smoothstep(thickness, thickness + 0.02, grid);
      }

      // Rounded rectangle SDF
      float roundedRect(vec2 p, vec2 size, float radius) {
        vec2 d = abs(p) - size + vec2(radius);
        return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        vec3 color = uBgColor;

        // Base subtle atmospheric noise
        float atm = fbm(uv * 0.5 + uTime * 0.02, 3) * 0.02;
        color += vec3(atm) * (uIsDark ? 0.5 : 1.0);

        // Design grid system (8px baseline grid)
        float designGrid = grid(uv * 8.0, 1.0, 0.08);
        color = mix(color, uGridColor, designGrid * 0.15 * (uIsDark ? 0.4 : 1.0));

        // Major grid lines (every 8th line = 64px)
        float majorGrid = grid(uv * 1.0, 1.0, 0.05);
        color = mix(color, uAccentColor, majorGrid * 0.08 * (uIsDark ? 0.6 : 1.0));

        // Floating wireframe artboards
        for (int i = 0; i < 5; i++) {
          float seed = float(i) * 17.3;
          vec2 center = vec2(
            sin(uTime * 0.08 + seed) * 0.7,
            cos(uTime * 0.06 + seed * 1.3) * 0.7
          );
          vec2 size = vec2(0.35 + hash(vec2(seed, 1.0)) * 0.25, 0.25 + hash(vec2(seed, 2.0)) * 0.15);
          float radius = 0.04;

          vec2 localUv = uv - center;
          float dist = roundedRect(localUv, size, radius);

          // Artboard stroke
          float stroke = smoothstep(0.015, 0.0, abs(dist)) * 0.4;
          float opacity = (0.3 + 0.4 * sin(uTime * 0.5 + seed)) * stroke;
          color = mix(color, uWireframeColor, opacity * (uIsDark ? 0.6 : 1.0));

          // Inner content blocks (representing UI elements)
          if (dist < 0.0) {
            float blockGrid = grid(localUv * 6.0, 1.0, 0.03);
            color = mix(color, uAccentColor, blockGrid * 0.06 * (uIsDark ? 0.3 : 0.8));
          }
        }

        // Floating design elements (small rectangles, circles)
        for (int i = 0; i < 8; i++) {
          float seed = float(i) * 23.7 + 100.0;
          vec2 pos = vec2(
            sin(uTime * 0.12 + seed) * 0.9,
            cos(uTime * 0.09 + seed * 1.7) * 0.9
          );
          float size = 0.015 + hash(vec2(seed, 3.0)) * 0.025;
          float d = length(uv - pos) - size;

          // Pulsing elements
          float pulse = 0.5 + 0.5 * sin(uTime * 1.5 + seed);
          float elem = smoothstep(0.01, 0.0, d) * pulse * 0.2;
          color = mix(color, uAccentColor, elem * (uIsDark ? 0.4 : 0.7));
        }

        // Subtle corner markers (like Figma frame corners)
        vec2 corners[4] = vec2[](
          vec2(-1.0, -1.0), vec2(1.0, -1.0),
          vec2(-1.0, 1.0), vec2(1.0, 1.0)
        );
        for (int i = 0; i < 4; i++) {
          float d = length(uv - corners[i] * 0.85);
          float corner = smoothstep(0.05, 0.0, d) * 0.3;
          color = mix(color, uAccentColor, corner * (uIsDark ? 0.5 : 0.8));
        }

        // Vignette
        float vignette = 1.0 - length(uv) * 0.3;
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
