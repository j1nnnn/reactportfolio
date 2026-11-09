"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { BONES, poseAt } from "./swingPoses";

function Figure({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const joints = useRef<THREE.InstancedMesh>(null);
  const shown = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bones = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(BONES.length * 6), 3));
    return g;
  }, []);
  const club = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);
  const trail = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(64 * 3), 3));
    return g;
  }, []);
  const trailLine = useMemo(
    () => new THREE.Line(trail, new THREE.LineBasicMaterial({ color: "#ff5d8f", transparent: true, opacity: 0.35 })),
    [trail],
  );

  useFrame((state, dt) => {
    const target = reduced ? 0.66 : progress.current ?? 0;
    shown.current += (target - shown.current) * Math.min(1, dt * 6);
    const { points, club: head } = poseAt(shown.current);

    points.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.setScalar(i < 11 ? 0.6 : 1);
      dummy.updateMatrix();
      joints.current?.setMatrixAt(i, dummy.matrix);
    });
    if (joints.current) joints.current.instanceMatrix.needsUpdate = true;

    const bp = bones.attributes.position as THREE.BufferAttribute;
    BONES.forEach(([a, b], i) => {
      bp.setXYZ(i * 2, ...points[a]);
      bp.setXYZ(i * 2 + 1, ...points[b]);
    });
    bp.needsUpdate = true;

    const cp = club.attributes.position as THREE.BufferAttribute;
    const grip = points[15];
    cp.setXYZ(0, grip[0], grip[1], grip[2]);
    cp.setXYZ(1, ...head);
    cp.needsUpdate = true;

    // clubhead path: sample the swing up to the current progress
    const tp = trail.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 64; i++) {
      const h = poseAt((shown.current * i) / 63).club;
      tp.setXYZ(i, h[0], h[1], h[2]);
    }
    tp.needsUpdate = true;
    trail.setDrawRange(0, shown.current > 0.01 ? 64 : 0);

    if (group.current && !reduced) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = -0.35 + Math.sin(t * 0.3) * 0.12 + state.pointer.x * 0.35;
      group.current.rotation.x = state.pointer.y * -0.08;
    }
  });

  return (
    <group ref={group} position={[0, -0.95, 0]} rotation={[0, -0.35, 0]}>
      <instancedMesh ref={joints} args={[undefined, undefined, 33]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color="#3fe0c5" />
      </instancedMesh>
      <lineSegments geometry={bones}>
        <lineBasicMaterial color="#ece9e2" transparent opacity={0.7} />
      </lineSegments>
      <lineSegments geometry={club}>
        <lineBasicMaterial color="#ff5d8f" />
      </lineSegments>
      <primitive object={trailLine} />
      <gridHelper args={[3, 12, "#2b4255", "#1d3042"]} />
    </group>
  );
}

export default function SwingFigure({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.05, 3.5], fov: 40 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true }}
    >
      <Figure progress={progress} reduced={reduced} />
    </Canvas>
  );
}
