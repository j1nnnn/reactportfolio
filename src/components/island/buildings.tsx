"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Procedural low-poly buildings, one per featured project (ADR 0002). Shared by the island and
// the case-study heroes. `reduced` freezes every idle animation.

export const WALL = "#fbfbf8";

export function M({ color, ...rest }: { color: string } & Record<string, unknown>) {
  return <meshStandardMaterial color={color} flatShading roughness={0.85} {...rest} />;
}

export function Box({ size, pos, color, rot }: { size: [number, number, number]; pos: [number, number, number]; color: string; rot?: [number, number, number] }) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <M color={color} />
    </mesh>
  );
}

export function GolfGreen({ reduced }: { reduced: boolean }) {
  const flag = useRef<THREE.Mesh>(null);
  const flagGeom = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.55, -0.16);
    s.lineTo(0, -0.32);
    return new THREE.ShapeGeometry(s);
  }, []);
  useFrame((st) => {
    if (flag.current && !reduced) flag.current.rotation.y = Math.sin(st.clock.elapsedTime * 3) * 0.35;
  });
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.35, 0.12, 24]} />
        <M color="#5fb85a" />
      </mesh>
      <mesh position={[0.3, 0.17, -0.2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <M color="#1f3320" />
      </mesh>
      <Box size={[0.04, 1.3, 0.04]} pos={[0.3, 0.8, -0.2]} color="#e8e8e8" />
      <mesh ref={flag} position={[0.32, 1.42, -0.2]} geometry={flagGeom} castShadow>
        <meshStandardMaterial color="#ff5a4e" side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh position={[-0.5, 0.22, 0.45]} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
        <M color="#ffffff" />
      </mesh>
    </group>
  );
}

export function Factory({ reduced }: { reduced: boolean }) {
  const crates = useRef<THREE.Group>(null);
  useFrame((st) => {
    if (!crates.current || reduced) return;
    crates.current.children.forEach((c, i) => {
      c.position.x = 1.4 - ((st.clock.elapsedTime * 0.45 + i * 0.6) % 1.8);
    });
  });
  return (
    <group>
      <Box size={[1.6, 0.9, 1.3]} pos={[-0.35, 0.51, -0.1]} color={WALL} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.88 + i * 0.53, 1.12, -0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.31, 0.31, 1.3, 3]} />
          <M color="#3d5afe" />
        </mesh>
      ))}
      <Box size={[0.22, 0.7, 0.22]} pos={[-0.95, 1.4, -0.55]} color="#c9ced6" />
      <Box size={[1.8, 0.12, 0.42]} pos={[0.65, 0.2, 0.75]} color="#4a5563" />
      <group ref={crates} position={[0, 0.34, 0.75]}>
        {[0, 1, 2].map((i) => (
          <Box key={i} size={[0.22, 0.18, 0.22]} pos={[1.4 - i * 0.6, 0, 0]} color="#ffb547" />
        ))}
      </group>
    </group>
  );
}

export function AgentLab({ reduced }: { reduced: boolean }) {
  const dish = useRef<THREE.Group>(null);
  useFrame((st, dt) => {
    if (dish.current && !reduced) dish.current.rotation.y += dt * 0.8;
  });
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} size={[1.1, 0.42, 1.1]} pos={[0, 0.27 + i * 0.46, 0]} color={i % 2 ? "#ece8ff" : WALL} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Box key={`w${i}`} size={[1.12, 0.12, 1.12]} pos={[0, 0.38 + i * 0.46, 0]} color="#7c5cff" />
      ))}
      <group ref={dish} position={[0, 2.1, 0]}>
        <Box size={[0.06, 0.4, 0.06]} pos={[0, 0, 0]} color="#c9ced6" />
        <mesh position={[0.12, 0.22, 0]} rotation={[0, 0, -0.9]} castShadow>
          <coneGeometry args={[0.24, 0.14, 16, 1, true]} />
          <meshStandardMaterial color="#e9e6ff" side={THREE.DoubleSide} flatShading />
        </mesh>
      </group>
    </group>
  );
}

export function PatentSeal({ reduced }: { reduced: boolean }) {
  const seal = useRef<THREE.Group>(null);
  useFrame((st, dt) => {
    if (seal.current && !reduced) seal.current.rotation.y += dt * 0.6;
  });
  return (
    <group>
      <Box size={[1.4, 0.3, 1.4]} pos={[0, 0.2, 0]} color={WALL} />
      <Box size={[1.0, 0.5, 1.0]} pos={[0, 0.6, 0]} color="#f1ece0" />
      <group ref={seal} position={[0, 1.45, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <M color="#e3b341" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.05, 8, 32]} />
          <M color="#c99520" />
        </mesh>
      </group>
    </group>
  );
}

export function ClockOffice({ reduced }: { reduced: boolean }) {
  const hand = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (hand.current && !reduced) hand.current.rotation.z -= dt * 1.2;
  });
  return (
    <group>
      <Box size={[1.5, 0.9, 1.2]} pos={[0, 0.5, 0]} color={WALL} />
      <Box size={[1.55, 0.12, 1.25]} pos={[0, 0.98, 0]} color="#12a39a" />
      <Box size={[0.6, 0.9, 0.6]} pos={[0, 1.45, 0]} color={WALL} />
      <Box size={[0.66, 0.12, 0.66]} pos={[0, 1.95, 0]} color="#12a39a" />
      <group position={[0, 1.5, 0.31]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <M color="#ffffff" />
        </mesh>
        <mesh ref={hand} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.03, 0.34, 0.02]} />
          <M color="#1d2a35" />
        </mesh>
      </group>
    </group>
  );
}

/** Security Sweep: a lighthouse whose beam keeps sweeping. */
export function Lighthouse({ reduced }: { reduced: boolean }) {
  const beam = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (beam.current && !reduced) beam.current.rotation.y += dt * 1.1;
  });
  return (
    <group>
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, 0.22, 8]} />
        <M color="#9aa3ad" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.42 + i * 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.4 - (i + 1) * 0.04, 0.4 - i * 0.04, 0.34, 16]} />
          <M color={i % 2 ? "#d9480f" : WALL} />
        </mesh>
      ))}
      <Box size={[0.5, 0.06, 0.5]} pos={[0, 1.79, 0]} color="#2a1d10" />
      <mesh position={[0, 1.98, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.32, 12]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffc94a" emissiveIntensity={0.8} flatShading />
      </mesh>
      <mesh position={[0, 2.26, 0]} castShadow>
        <coneGeometry args={[0.24, 0.24, 12]} />
        <M color="#d9480f" />
      </mesh>
      <group ref={beam} position={[0, 1.98, 0]}>
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.3, 1.6, 16, 1, true]} />
          <meshBasicMaterial color="#fff3b0" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Fantasy Forecast: a basketball half court, with a ball that keeps bouncing. */
export function Court({ reduced }: { reduced: boolean }) {
  const ball = useRef<THREE.Mesh>(null);
  useFrame((st) => {
    if (ball.current && !reduced) ball.current.position.y = 0.3 + Math.abs(Math.sin(st.clock.elapsedTime * 3)) * 0.7;
  });
  return (
    <group>
      <Box size={[2.3, 0.12, 1.9]} pos={[0, 0.1, 0]} color="#d9a066" />
      <Box size={[2.3, 0.01, 0.04]} pos={[0, 0.17, 0.6]} color="#ffffff" />
      <Box size={[0.7, 0.01, 0.9]} pos={[-0.8, 0.17, 0]} color="#18224a" />
      <Box size={[0.06, 1.3, 0.06]} pos={[-1.05, 0.8, 0]} color="#c9ced6" />
      <Box size={[0.06, 0.5, 0.7]} pos={[-0.98, 1.4, 0]} color={WALL} />
      <mesh position={[-0.78, 1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.025, 8, 20]} />
        <M color="#ff5a4e" />
      </mesh>
      <mesh ref={ball} position={[0.35, 0.3, 0.1]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <M color="#ff8a3d" />
      </mesh>
    </group>
  );
}

/** Human In Tech Agent: the business's office, its security camera panning and a mailbox for the drafts. */
export function CamOffice({ reduced }: { reduced: boolean }) {
  const cam = useRef<THREE.Group>(null);
  const flag = useRef<THREE.Mesh>(null);
  useFrame((st) => {
    if (reduced) return;
    const t = st.clock.elapsedTime;
    if (cam.current) cam.current.rotation.y = 0.6 + Math.sin(t * 0.9) * 0.7;
    if (flag.current) flag.current.rotation.z = Math.max(0, Math.sin(t * 0.8)) * -1.4;
  });
  return (
    <group>
      <Box size={[1.5, 0.95, 1.2]} pos={[-0.15, 0.52, -0.1]} color={WALL} />
      <Box size={[1.6, 0.12, 1.3]} pos={[-0.15, 1.05, -0.1]} color="#3ddc84" />
      <Box size={[0.5, 0.06, 0.02]} pos={[-0.15, 0.75, 0.51]} color="#17231e" />
      <Box size={[0.3, 0.55, 0.02]} pos={[0.3, 0.33, 0.51]} color="#17231e" />
      <Box size={[0.05, 0.3, 0.05]} pos={[0.55, 1.22, 0.45]} color="#c9ced6" />
      <group ref={cam} position={[0.55, 1.38, 0.45]}>
        <Box size={[0.34, 0.14, 0.14]} pos={[0.14, 0, 0]} color="#ffffff" />
        <mesh position={[0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          <M color="#17231e" />
        </mesh>
      </group>
      <Box size={[0.05, 0.5, 0.05]} pos={[0.95, 0.28, 0.75]} color="#4a5563" />
      <Box size={[0.32, 0.2, 0.2]} pos={[0.95, 0.6, 0.75]} color="#3d5afe" />
      <mesh ref={flag} position={[1.12, 0.64, 0.75]}>
        <boxGeometry args={[0.03, 0.2, 0.06]} />
        <M color="#ff5a4e" />
      </mesh>
    </group>
  );
}

/** Citi Bike research: H3 hexagon towers whose heights rise and fall like demand through the day. */
export function DemandHexes({ reduced }: { reduced: boolean }) {
  const towers = useRef<THREE.Group>(null);
  const cells = useMemo(() => {
    const out: { x: number; z: number; base: number; phase: number }[] = [];
    for (let q = -2; q <= 2; q++)
      for (let r = -2; r <= 2; r++) {
        if (Math.abs(q + r) > 2) continue;
        const d = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
        out.push({ x: (q + r / 2) * 0.44, z: r * 0.38, base: 1.1 - d * 0.32, phase: q * 0.9 + r * 0.5 });
      }
    return out;
  }, []);
  useFrame((st) => {
    if (!towers.current || reduced) return;
    const t = st.clock.elapsedTime;
    towers.current.children.forEach((m, i) => {
      const c = cells[i];
      const h = Math.max(0.12, c.base + Math.sin(t * 1.2 + c.phase) * 0.25);
      m.scale.y = h;
      m.position.y = 0.32 + h / 2;
    });
  });
  return (
    <group>
      <Box size={[2.3, 0.26, 2.0]} pos={[0, 0.18, 0]} color={WALL} />
      <group ref={towers}>
        {cells.map((c, i) => (
          <mesh key={i} position={[c.x, 0.32 + c.base / 2, c.z]} scale={[1, c.base, 1]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 1, 6]} />
            <M color={c.base > 0.9 ? "#14213d" : c.base > 0.6 ? "#2a6df4" : "#8fb3ff"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
