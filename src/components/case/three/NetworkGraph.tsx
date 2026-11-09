"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODES = 150;
const PULSES = 48;

function Graph({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { nodeGeom, edgeGeom, edges, nodes } = useMemo(() => {
    // nodes on a flattened shell, so the centre stays clear for the name
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 3.2 + Math.random() * 1.6;
      nodes.push(new THREE.Vector3(r * Math.sin(v) * Math.cos(u) * 1.5, r * Math.cos(v) * 0.8, r * Math.sin(v) * Math.sin(u)));
    }
    const edges: [number, number][] = [];
    nodes.forEach((a, i) => {
      const nearest = nodes
        .map((b, j) => [j, a.distanceToSquared(b)] as const)
        .filter(([j]) => j !== i)
        .sort((x, y) => x[1] - y[1])
        .slice(0, 3);
      nearest.forEach(([j]) => i < j && edges.push([i, j]));
    });
    const nodeGeom = new THREE.BufferGeometry().setFromPoints(nodes);
    const edgeGeom = new THREE.BufferGeometry().setFromPoints(edges.flatMap(([a, b]) => [nodes[a], nodes[b]]));
    return { nodeGeom, edgeGeom, edges, nodes };
  }, []);

  const pulses = useMemo(
    () => Array.from({ length: PULSES }, () => ({ edge: Math.floor(Math.random() * edges.length), t: Math.random(), speed: 0.25 + Math.random() * 0.5 })),
    [edges],
  );
  const pulseGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    const attr = pulseGeom.attributes.position as THREE.BufferAttribute;
    pulses.forEach((p, i) => {
      if (!reduced) {
        p.t += dt * p.speed;
        if (p.t > 1) {
          // hop to an edge that starts where this one ended, so pulses travel the network
          const end = edges[p.edge][1];
          const next = edges.findIndex(([a]) => a === end);
          p.edge = next >= 0 ? next : Math.floor(Math.random() * edges.length);
          p.t = 0;
        }
      }
      const [a, b] = edges[p.edge];
      const v = new THREE.Vector3().lerpVectors(nodes[a], nodes[b], p.t);
      attr.setXYZ(i, v.x, v.y, v.z);
    });
    attr.needsUpdate = true;
    if (group.current && !reduced) {
      group.current.rotation.y += dt * 0.05;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.15, 0.05);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.4, 0.05);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeom}>
        <lineBasicMaterial color="#9f8cff" transparent opacity={0.22} />
      </lineSegments>
      <points geometry={nodeGeom}>
        <pointsMaterial color="#9f8cff" size={0.07} sizeAttenuation transparent opacity={0.85} />
      </points>
      <points geometry={pulseGeom}>
        <pointsMaterial color="#ffb547" size={0.14} sizeAttenuation />
      </points>
    </group>
  );
}

export default function NetworkGraph({ reduced }: { reduced: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]} frameloop={reduced ? "demand" : "always"}>
      <Graph reduced={reduced} />
    </Canvas>
  );
}
