"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { ProjectId } from "@/content/projects";
import { AgentLab, ClockOffice, Factory, GolfGreen, PatentSeal, TurfBoard } from "@/components/island/buildings";

const BUILDINGS: Record<ProjectId, (p: { reduced: boolean }) => React.JSX.Element> = {
  prolink: GolfGreen,
  factory: Factory,
  jepa: ClockOffice,
  turf: TurfBoard,
  agent: AgentLab,
  patent: PatentSeal,
};

function Turntable({ id, reduced, ground }: { id: ProjectId; reduced: boolean; ground: string }) {
  const g = useRef<THREE.Group>(null);
  useFrame((st, dt) => {
    if (!g.current || reduced) return;
    g.current.rotation.y += dt * 0.25;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, st.pointer.y * -0.08, 0.05);
  });
  const Building = BUILDINGS[id];
  return (
    <group position={[0, -0.9, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.7, 48]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      <group ref={g} rotation={[0, -0.6, 0]}>
        <Building reduced={reduced} />
      </group>
    </group>
  );
}

/** One building from the island, enlarged on a turntable, for a case-study hero. */
export default function BuildingShowcase({ id, reduced, ground }: { id: ProjectId; reduced: boolean; ground: string }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [4.4, 3.1, 4.4], fov: 38 }} frameloop={reduced ? "demand" : "always"} onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}>
      <hemisphereLight args={["#ffffff", "#9aa6b2", 1.1]} />
      <directionalLight position={[4, 7, 3]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
      <Turntable id={id} reduced={reduced} ground={ground} />
    </Canvas>
  );
}
