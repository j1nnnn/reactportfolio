"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ProjectId } from "@/content/projects";
import { AgentLab, Box, ClockOffice, Factory, GolfGreen, M, PatentSeal, TurfBoard } from "./buildings";

// The home page's island (ADR 0002): one building per featured project. Hover lifts a building,
// selecting it zooms the camera in. Loaded in the browser only; the page's chip row is its HTML twin.

export type IslandSceneProps = {
  animate: boolean;
  hovered: ProjectId | null;
  selected: ProjectId | null;
  onHover: (id: ProjectId | null) => void;
  onSelect: (id: ProjectId) => void;
};
type Props = Omit<IslandSceneProps, "animate"> & { reduced: boolean };

const PLOTS: Record<ProjectId, [number, number]> = {
  factory: [-4, -2],
  agent: [0, -2.4],
  patent: [4, -2],
  prolink: [-4, 2.2],
  turf: [0, 2.4],
  jepa: [4, 2.2],
};

const RIGHT = new THREE.Vector3(1, 0, -1).normalize();
const OFFSET = new THREE.Vector3(10, 10, 10);

/** Wraps a building: lifts on hover, reports pointer events. */
function Plot({ id, hovered, selected, onHover, onSelect, children }: { id: ProjectId; children: ReactNode } & Omit<Props, "reduced">) {
  const g = useRef<THREE.Group>(null);
  const [x, z] = PLOTS[id];
  useFrame((_, dt) => {
    if (!g.current) return;
    const up = hovered === id || selected === id ? 0.28 : 0;
    g.current.position.y += (up - g.current.position.y) * Math.min(1, dt * 10);
  });
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    onHover(null);
    document.body.style.cursor = "";
  };
  return (
    <group position={[x, 0, z]}>
      {/* plot pad */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.06, 3.2]} />
        <M color={hovered === id || selected === id ? "#f3eee4" : "#e6dfd2"} />
      </mesh>
      <group
        ref={g}
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        {children}
      </group>
    </group>
  );
}

function Rig({ selected, reduced }: { selected: ProjectId | null; reduced: boolean }) {
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const wide = size.width > 820;
    const base = wide ? Math.min(size.width / 22, size.height / 13) : size.width / 15;
    const want = new THREE.Vector3();
    let zoom = base;
    if (selected) {
      const [x, z] = PLOTS[selected];
      want.set(x, 0.6, z).addScaledVector(RIGHT, wide ? 2.2 : 0);
      zoom = base * 1.7;
    } else if (wide) {
      want.addScaledVector(RIGHT, -3.2);
    }
    const k = reduced ? 1 : Math.min(1, dt * 3.5);
    target.current.lerp(want, k);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom += (zoom - cam.zoom) * k;
    cam.position.copy(target.current).add(OFFSET);
    cam.lookAt(target.current);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Island(props: Props) {
  const { reduced, ...plot } = props;
  return (
    <group>
      <mesh position={[0, -0.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.7, 10]} />
        <M color="#b98f68" />
      </mesh>
      <mesh position={[0, 0.0, 0]} receiveShadow>
        <boxGeometry args={[14.02, 0.05, 10.02]} />
        <M color="#9dcf8c" />
      </mesh>
      <Box size={[13, 0.04, 0.5]} pos={[0, 0.03, 0.1]} color="#e6dfd2" />
      {[-2, 2].map((x) => (
        <Box key={x} size={[0.5, 0.04, 9]} pos={[x, 0.03, 0]} color="#e6dfd2" />
      ))}
      {[[-6.2, -4.1], [6.3, 3.9], [-6.3, 4], [6.2, -4.2], [-1.9, 4.4], [2.1, -4.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Box size={[0.12, 0.4, 0.12]} pos={[0, 0.2, 0]} color="#8a6a4c" />
          <mesh position={[0, 0.65, 0]} castShadow>
            <coneGeometry args={[0.32, 0.7, 6]} />
            <M color="#4f9a55" />
          </mesh>
        </group>
      ))}
      <Plot id="prolink" {...plot}>
        <GolfGreen reduced={reduced} />
      </Plot>
      <Plot id="factory" {...plot}>
        <Factory reduced={reduced} />
      </Plot>
      <Plot id="jepa" {...plot}>
        <ClockOffice reduced={reduced} />
      </Plot>
      <Plot id="turf" {...plot}>
        <TurfBoard reduced={reduced} />
      </Plot>
      <Plot id="agent" {...plot}>
        <AgentLab reduced={reduced} />
      </Plot>
      <Plot id="patent" {...plot}>
        <PatentSeal reduced={reduced} />
      </Plot>
    </group>
  );
}

export default function IslandScene({ animate, ...rest }: IslandSceneProps) {
  const props: Props = { ...rest, reduced: !animate };
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      camera={{ position: [10, 10, 10], zoom: 50, near: -100, far: 200 }}
      frameloop={props.reduced ? "demand" : "always"}
      onPointerMissed={() => props.onHover(null)}
    >
      <hemisphereLight args={["#ffffff", "#b9c7d4", 1.1]} />
      <directionalLight
        position={[6, 12, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Rig selected={props.selected} reduced={props.reduced} />
      <Island {...props} />
    </Canvas>
  );
}
