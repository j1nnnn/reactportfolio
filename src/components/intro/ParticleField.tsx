"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// The particle title (direction B, ADR 0002): particles fly in from depth, form the word, hold,
// then burst outward. Ported from the prototype draft. WebGL only; the overlay around it is
// ParticleIntro, which the tests reach.

const COUNT = 6000;
export const ASSEMBLE = 1.3;
export const HOLD = 0.9;

/** Filled pixels of `word`, normalized to width 1 and centred; the font shrinks to fit long words. */
function sampleWord(word: string, family: string): [number, number][] {
  const c = document.createElement("canvas");
  c.width = 1600;
  c.height = 360;
  const ctx = c.getContext("2d")!;
  (ctx as CanvasRenderingContext2D & { fontStretch?: string }).fontStretch = "expanded";
  let size = 240;
  ctx.font = `900 ${size}px ${family}`;
  const measured = ctx.measureText(word).width;
  if (measured > c.width - 60) {
    size = Math.floor((size * (c.width - 60)) / measured);
    ctx.font = `900 ${size}px ${family}`;
  }
  ctx.textBaseline = "middle";
  const w = ctx.measureText(word).width;
  ctx.fillText(word, (c.width - w) / 2, c.height / 2);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < c.height; y += 4)
    for (let x = 0; x < c.width; x += 4)
      if (data[(y * c.width + x) * 4 + 3] > 128) pts.push([(x - c.width / 2) / w, -(y - c.height / 2) / w]);
  return pts;
}

function Particles({ target, color, onBurst }: { target: Float32Array; color: string; onBurst: () => void }) {
  const { viewport } = useThree();
  const pos = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] = (Math.random() - 0.5) * 30;
      a[i * 3 + 1] = (Math.random() - 0.5) * 18;
      a[i * 3 + 2] = -10 - Math.random() * 30;
    }
    return a;
  }, []);
  const vel = useMemo(() => new Float32Array(COUNT * 3), []);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);
  const t = useRef(0);
  const burst = useRef(false);
  const burstCb = useRef(onBurst);
  burstCb.current = onBurst;

  useFrame((state, dt) => {
    t.current += Math.min(dt, 0.05);
    const scale = Math.min(viewport.width * 0.82, 15);
    if (!burst.current && t.current > ASSEMBLE + HOLD) {
      burst.current = true;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        vel[ix] += pos[ix] * 0.04 + (Math.random() - 0.5) * 0.2;
        vel[ix + 1] += pos[ix + 1] * 0.04 + (Math.random() - 0.5) * 0.2;
        vel[ix + 2] += 0.4 + Math.random() * 0.6;
      }
      burstCb.current();
    }
    const pull = burst.current ? 0 : 0.035;
    const damp = burst.current ? 0.97 : 0.84;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      vel[ix] += (target[i * 2] * scale - pos[ix]) * pull;
      vel[ix + 1] += (target[i * 2 + 1] * scale - pos[ix + 1]) * pull;
      vel[ix + 2] += (0 - pos[ix + 2]) * pull;
      vel[ix] *= damp;
      vel[ix + 1] *= damp;
      vel[ix + 2] *= damp;
      pos[ix] += vel[ix];
      pos[ix + 1] += vel[ix + 1];
      pos[ix + 2] += vel[ix + 2];
    }
    geom.attributes.position.needsUpdate = true;
    state.camera.position.x = state.pointer.x * 0.6;
    state.camera.position.y = state.pointer.y * 0.3;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points geometry={geom}>
      <pointsMaterial color={color} size={0.06} sizeAttenuation />
    </points>
  );
}

export default function ParticleField({ word, color, onBurst }: { word: string; color: string; onBurst: () => void }) {
  const [target, setTarget] = useState<Float32Array | null>(null);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() || "sans-serif";
      const pts = sampleWord(word, family);
      const out = new Float32Array(COUNT * 2);
      for (let i = 0; i < COUNT; i++) {
        const p = pts[(i * 7919) % pts.length];
        out[i * 2] = p[0];
        out[i * 2 + 1] = p[1];
      }
      setTarget(out);
    });
    return () => {
      alive = false;
    };
  }, [word]);

  if (!target) return null;
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={[1, 2]}>
      <Particles target={target} color={color} onBurst={onBurst} />
    </Canvas>
  );
}
