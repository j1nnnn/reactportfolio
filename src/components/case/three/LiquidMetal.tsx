"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

// A liquid-metal background shader, after the effect in Rune's gallery. Domain-warped noise
// banded into steel highlights with a gold tint, darkened so text on top stays readable.
// Reduced motion: the surface is frozen in one pose.

const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
void main() {
  vec2 uv = vUv; uv.x *= uRes.x / uRes.y;
  float t = uTime * 0.08;
  vec2 q = vec2(fbm(uv * 2.0 + t), fbm(uv * 2.0 + vec2(5.2, 1.3) - t));
  float n = fbm(uv * 2.5 + q * 2.2 + t * 0.5);
  float bands = 0.5 + 0.5 * sin(n * 12.0 + q.x * 6.0);
  vec3 dark = vec3(0.08, 0.085, 0.1), steel = vec3(0.62, 0.64, 0.68), hi = vec3(0.95, 0.93, 0.88), gold = vec3(0.89, 0.70, 0.25);
  vec3 col = mix(dark, steel, smoothstep(0.2, 0.8, bands));
  col = mix(col, hi, pow(bands, 8.0));
  col = mix(col, gold, smoothstep(0.55, 0.75, n) * 0.35);
  col *= 0.38;
  gl_FragColor = vec4(col, 1.0);
}
`;

function Surface({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const uniforms = useMemo(() => ({ uTime: { value: 12.0 }, uRes: { value: new THREE.Vector2(1, 1) } }), []);
  useFrame((_, dt) => {
    uniforms.uRes.value.set(size.width, size.height);
    if (!reduced) uniforms.uTime.value += dt;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function LiquidMetal({ reduced }: { reduced: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={reduced ? "demand" : "always"}>
      <Surface reduced={reduced} />
    </Canvas>
  );
}
