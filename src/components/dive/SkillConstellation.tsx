"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { proofLabel, proofs, skills, type ProofId } from "@/content/personal";
import {
  GOLD,
  groupColour,
  lit,
  setActiveNode,
  useActiveNode,
  type ActiveNode,
} from "@/components/skillConstellation";
import { FLY_IN, FLY_OUT, stations } from "./stations";

// The skill constellation (spec #13, Skills station): skills glow on an outer sphere, coloured by group;
// their proofs are gold rings on an inner ring; one line links each skill to each of its proofs. The
// Skills panel's list drives the same active node, so the cluster and the list always agree.

const OUTER = 2.5;
const INNER = 1.05;
const LABEL_H = 0.2; // world units

/** A node of the cluster as drawn: a skill or a proof, where it sits and what it activates. */
type Star = { key: string; label: string; colour: string; pos: THREE.Vector3; node: ActiveNode; proof: boolean };

/** The cluster's layout, in its own frame: Fibonacci points on the sphere, proofs evenly round the ring. */
function constellationLayout(): { nodes: Star[]; links: [Star, Star][] } {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const skillNodes = skills.map((sk, i): Star => {
    const y = 1 - ((i + 0.5) / skills.length) * 2;
    const r = Math.sqrt(1 - y * y);
    const pos = new THREE.Vector3(Math.cos(i * golden) * r, y, Math.sin(i * golden) * r).multiplyScalar(OUTER);
    const colour = groupColour(sk.group);
    return { key: `s:${sk.name}`, label: sk.name, colour, pos, node: { skill: sk.name }, proof: false };
  });
  const proofNodes = new Map<ProofId, Star>(
    proofs.map((id, i): [ProofId, Star] => {
      const a = (i / proofs.length) * Math.PI * 2;
      const pos = new THREE.Vector3(Math.cos(a) * INNER, 0, Math.sin(a) * INNER);
      return [id, { key: `p:${id}`, label: proofLabel(id)!, colour: GOLD, pos, node: { proof: id }, proof: true }];
    }),
  );
  const links = skills.flatMap((sk, i) => sk.proofs.map((id): [Star, Star] => [skillNodes[i], proofNodes.get(id)!]));
  return { nodes: [...skillNodes, ...proofNodes.values()], links };
}

/** A node's label, drawn once onto a canvas; returns the texture and its width-to-height ratio. */
function labelTexture(text: string, colour: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = "700 44px system-ui, sans-serif";
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(text).width) + 32;
  canvas.height = 64;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(6, 10, 20, 0.85)"; // a dark halo, so a label reads over lines and glow
  ctx.strokeText(text, 16, 34);
  ctx.fillStyle = colour;
  ctx.fillText(text, 16, 34);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: canvas.width / canvas.height };
}

function isOn({ node }: Star, on: ReturnType<typeof lit>) {
  if (!node) return false;
  return "skill" in node ? on.skills.includes(node.skill) : on.proofs.includes(node.proof);
}

/** `depth`: how far the dive's camera travels across the whole dive, to place the cluster at its station. */
export function SkillConstellation({ depth }: { depth: number }) {
  const { camera, size } = useThree();
  const spin = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Object3D | null)[]>([]);
  const labels = useRef<(THREE.Sprite | null)[]>([]);
  const active = useActiveNode();
  const on = useMemo(() => lit(active), [active]);
  const { nodes, links } = useMemo(constellationLayout, []);
  const textures = useMemo(() => nodes.map((n) => labelTexture(n.label, n.proof ? GOLD : "#eef3f7")), [nodes]);
  useEffect(() => () => textures.forEach((t) => t.texture.dispose()), [textures]);

  const station = stations.find((st) => st.id === "skills")!;
  const [from, to] = station.range;
  // Held in front of the camera while the panel holds, on the side the panel leaves free.
  const z = -(from + (to - from) * ((FLY_IN + FLY_OUT) / 2)) * depth - 1;
  const wide = size.width / size.height > 1.1;
  const x = wide ? (station.side === "right" ? -3.4 : 3.4) : 0;

  const all = useMemo(() => lineGeometry(links), [links]);
  const litLinks = useMemo(
    () => lineGeometry(links.filter(([sk, pr]) => isOn(sk, on) && isOn(pr, on))),
    [links, on],
  );
  useEffect(() => () => all.dispose(), [all]);
  useEffect(() => () => litLinks.dispose(), [litLinks]);
  const litMaterial = useRef<THREE.LineBasicMaterial>(null);

  const point = (node: ActiveNode) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setActiveNode(node);
    },
    // A tap's pointer leaves as it lifts: only a mouse leaving lets go, so a tap does what hover does.
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      if (e.pointerType === "mouse") setActiveNode(null);
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setActiveNode(node);
    },
  });

  // Reused each frame by the label culling.
  const tmp = useMemo(() => ({ c: new THREE.Vector3(), e: new THREE.Vector3(), right: new THREE.Vector3() }), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (spin.current && !active) spin.current.rotation.y += dt * 0.12; // still while a node is active
    const pulse = 1 + Math.sin(t * 5) * 0.18;
    if (litMaterial.current) litMaterial.current.opacity = 0.65 + Math.sin(t * 5) * 0.3;
    nodes.forEach((n, i) => {
      const m = meshes.current[i];
      if (m) m.scale.setScalar(active && isOn(n, on) ? pulse * 1.25 : 1);
    });
    cullLabels();
  });

  /**
   * Labels must stay legible: the lit ones, then the proofs, then the nearer ones, claim their screen
   * space first; a label overlapping one already placed is hidden. Dimmed labels shrink.
   */
  function cullLabels() {
    tmp.right.setFromMatrixColumn(camera.matrixWorld, 0);
    const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const order = nodes
      .map((n, i) => {
        const s = labels.current[i];
        if (!s) return null;
        s.getWorldPosition(tmp.c);
        const depth = tmp.c.distanceTo(camera.position);
        const rank = (active && isOn(n, on) ? 0 : n.proof ? 1 : 2) * 1000 + depth;
        return { i, s, rank };
      })
      .filter((o): o is NonNullable<typeof o> => o !== null)
      .sort((a, b) => a.rank - b.rank);
    for (const { i, s } of order) {
      const dim = !!active && !isOn(nodes[i], on);
      const h = LABEL_H * (dim ? 0.7 : 1);
      s.scale.set(h * textures[i].aspect, h, 1);
      s.getWorldPosition(tmp.c);
      tmp.e.copy(tmp.c).addScaledVector(tmp.right, (h * textures[i].aspect) / 2);
      tmp.c.project(camera);
      tmp.e.project(camera);
      const hw = Math.abs(tmp.e.x - tmp.c.x) * (size.width / 2);
      const hh = (hw / textures[i].aspect) * 1.1;
      const px = (tmp.c.x * size.width) / 2;
      const py = (tmp.c.y * size.height) / 2;
      const box = { x0: px - hw, x1: px + hw, y0: py - hh, y1: py + hh };
      const behind = tmp.c.z > 1;
      const clash = placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0);
      s.visible = !behind && !clash;
      if (s.visible) placed.push(box);
      (s.material as THREE.SpriteMaterial).opacity = dim ? 0.35 : 1;
    }
  }

  return (
    <group position={[x, 0.3, z]} rotation={[0.28, 0, 0]}>
      <group ref={spin}>
        <lineSegments geometry={all}>
          <lineBasicMaterial color="#9fb4ff" transparent opacity={active ? 0.05 : 0.2} depthWrite={false} />
        </lineSegments>
        <lineSegments geometry={litLinks}>
          <lineBasicMaterial ref={litMaterial} color="#fff1c2" transparent toneMapped={false} depthWrite={false} />
        </lineSegments>
        {nodes.map((n, i) => {
          const dim = !!active && !isOn(n, on);
          return (
            <group key={n.key} position={n.pos}>
              <group
                ref={(el) => {
                  meshes.current[i] = el;
                }}
                {...point(n.node)}
              >
                {n.proof ? (
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.13, 0.035, 10, 36]} />
                    <meshBasicMaterial color={GOLD} transparent opacity={dim ? 0.25 : 1} toneMapped={false} />
                  </mesh>
                ) : (
                  <mesh>
                    <icosahedronGeometry args={[0.08, 1]} />
                    <meshBasicMaterial color={n.colour} transparent opacity={dim ? 0.25 : 1} toneMapped={false} />
                  </mesh>
                )}
                {/* The glow, and a larger target for the pointer. */}
                <mesh>
                  <sphereGeometry args={[0.22, 12, 12]} />
                  <meshBasicMaterial
                    color={n.colour}
                    transparent
                    opacity={dim ? 0.04 : 0.22}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              </group>
              <sprite
                ref={(el) => {
                  labels.current[i] = el;
                }}
                position={[0, n.proof ? -0.3 : 0.26, 0]}
                raycast={() => null}
              >
                <spriteMaterial map={textures[i].texture} transparent depthWrite={false} toneMapped={false} />
              </sprite>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function lineGeometry(links: [Star, Star][]) {
  const pos = new Float32Array(links.length * 6);
  links.forEach(([a, b], i) => {
    a.pos.toArray(pos, i * 6);
    b.pos.toArray(pos, i * 6 + 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}
