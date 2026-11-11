"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useDiveInView } from "./diveInView";
import { DIVE_INTRO } from "./stations";

// The dive's world (spec #13): drifting coloured particles and slowly turning low-poly crystals,
// all procedural. Scroll progress flies the camera forward through it. Loaded in the browser only.

const SKY = new THREE.Color("#cfe3f3"); // the island's pale sky
const SPACE = new THREE.Color("#060a14");
const DEPTH = 120; // how far the camera travels across the whole dive
const PALETTE = ["#7aa2ff", "#b18cff", "#5fe0d0", "#ffb38a", "#f3f6ff"];

/** A seeded random so the world is the same on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const rand = rng(7);
    const n = 2400;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 40;
      pos[i * 3 + 1] = (rand() - 0.5) * 24;
      pos[i * 3 + 2] = 10 - rand() * (DEPTH + 40);
      c.set(PALETTE[Math.floor(rand() * PALETTE.length)]);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.01;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.09} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Crystals() {
  const ref = useRef<THREE.Group>(null);
  const crystals = useMemo(() => {
    const rand = rng(23);
    return Array.from({ length: 46 }, () => {
      const side = rand() < 0.5 ? -1 : 1;
      return {
        position: [side * (4 + rand() * 9), (rand() - 0.5) * 12, -rand() * DEPTH] as [number, number, number],
        scale: 0.4 + rand() * 1.4,
        color: PALETTE[Math.floor(rand() * PALETTE.length)],
        spin: (rand() - 0.5) * 0.4,
        detail: rand() < 0.5 ? 0 : 1,
      };
    });
  }, []);
  useFrame((_, dt) => {
    ref.current?.children.forEach((m, i) => {
      m.rotation.x += dt * crystals[i].spin;
      m.rotation.y += dt * crystals[i].spin * 0.7;
    });
  });
  return (
    <group ref={ref}>
      {crystals.map((c, i) => (
        <mesh key={i} position={c.position} scale={c.scale}>
          <icosahedronGeometry args={[1, c.detail]} />
          <meshStandardMaterial color={c.color} flatShading roughness={0.35} metalness={0.2} emissive={c.color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

/** Flies the camera along the progress, with a gentle sway; fades the sky to deep space. */
function Flight({ progress }: { progress: RefObject<number> }) {
  const { camera, scene } = useThree();
  const bg = useMemo(() => new THREE.Color(), []);
  const z = useRef(0);
  useFrame(({ clock }, dt) => {
    const p = progress.current ?? 0;
    bg.copy(SKY).lerp(SPACE, Math.min(1, p / DIVE_INTRO));
    scene.background = bg;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg);
    z.current += (-p * DEPTH - z.current) * Math.min(1, dt * 4);
    const t = clock.elapsedTime;
    camera.position.set(Math.sin(t * 0.3) * 0.4, Math.cos(t * 0.23) * 0.25, z.current + 8);
    camera.rotation.set(Math.sin(t * 0.2) * 0.02, Math.sin(t * 0.17) * 0.03, Math.sin(t * 0.25) * 0.015);
  });
  return null;
}

export default function DiveWorld({ progress }: { progress: RefObject<number> }) {
  // Runs only while the dive is on screen; the island runs the rest of the time.
  const inView = useDiveInView();
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 80 }}
      frameloop={inView ? "always" : "demand"}
    >
      <fog attach="fog" args={["#060a14", 10, 60]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#b9c8ff", "#1a1030", 0.8]} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} />
      <Flight progress={progress} />
      <Particles />
      <Crystals />
    </Canvas>
  );
}
