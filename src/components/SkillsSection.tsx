"use client";

import { useEffect } from "react";
import { proofLabel, proofs, skillGroups, skills, skillsHeading } from "@/content/personal";
import { GOLD, groupColour, lit, setActiveNode, useActiveNode, type ActiveNode } from "./skillConstellation";
import panel from "./AboutSection.module.css";
import s from "./SkillsSection.module.css";

/** Hover, tap or focus makes a node active, as the 3D cluster's pointer does. */
const activates = (node: ActiveNode) => ({
  onPointerEnter: () => setActiveNode(node),
  onFocus: () => setActiveNode(node),
  onClick: () => setActiveNode(node),
});

/**
 * The calm version's skill constellation: still, in its final state, flattened to a disc. Skills round
 * the edge, proofs on the inner ring, one line per link; it lights with the list as the 3D cluster does.
 */
function StillConstellation({ active }: { active: ActiveNode }) {
  const on = lit(active);
  const at = (i: number, n: number, r: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [160 + Math.cos(a) * r, 160 + Math.sin(a) * r];
  };
  const skillAt = new Map(skills.map((sk, i) => [sk.name, at(i, skills.length, 140)]));
  const proofAt = new Map(proofs.map((id, i) => [id, at(i, proofs.length, 62)]));
  const dim = (yes: boolean) => (active && !yes ? 0.15 : 1);
  return (
    <svg viewBox="0 0 320 320" className={s.still} aria-hidden="true">
      {skills.flatMap((sk) =>
        sk.proofs.map((id) => {
          const [x1, y1] = skillAt.get(sk.name)!;
          const [x2, y2] = proofAt.get(id)!;
          const yes = on.skills.includes(sk.name) && on.proofs.includes(id);
          return (
            <line
              key={`${sk.name}-${id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={yes && active ? "#fff1c2" : "#9fb4ff"}
              strokeOpacity={active ? (yes ? 0.9 : 0.06) : 0.22}
            />
          );
        }),
      )}
      {skills.map((sk) => {
        const [cx, cy] = skillAt.get(sk.name)!;
        return <circle key={sk.name} cx={cx} cy={cy} r={4} fill={groupColour(sk.group)} opacity={dim(on.skills.includes(sk.name))} />;
      })}
      {proofs.map((id) => {
        const [cx, cy] = proofAt.get(id)!;
        return (
          <circle key={id} cx={cx} cy={cy} r={5} fill="none" stroke={GOLD} strokeWidth={2} opacity={dim(on.proofs.includes(id))} />
        );
      })}
    </svg>
  );
}

/**
 * Jin's skills, each linked to its proofs. In the dive the skill constellation sits beside this panel;
 * the grouped list here is its keyboard and screen-reader twin, driving the same active node.
 */
export function SkillsSection({ still = false }: { still?: boolean }) {
  const active = useActiveNode();
  const on = lit(active);
  useEffect(() => () => setActiveNode(null), []);

  return (
    <section
      id="skills"
      className={`${panel.panel} ${s.section}`}
      aria-label="Skills"
      // Let go when the mouse or focus leaves, so the cluster turns again. A tap's pointer leaves as it
      // lifts, so a tap keeps its node active, as hover does.
      onPointerLeave={(e) => e.pointerType === "mouse" && setActiveNode(null)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setActiveNode(null)}
    >
      <h2 className={panel.title}>{skillsHeading}</h2>
      {still && <StillConstellation active={active} />}
      <div role="status" aria-label="Readout" className={s.readout}>
        {!active ? (
          <p className={s.hint}>Hover, tap or focus a skill to see the work that proves it.</p>
        ) : "skill" in active ? (
          <>
            <h3 className={s.active}>{active.skill}</h3>
            <ul aria-label="Proven by" className={s.links}>
              {on.proofs.map((id) => (
                <li key={id}>{proofLabel(id)}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h3 className={s.active}>{proofLabel(active.proof)}</h3>
            <ul aria-label="Proves" className={s.links}>
              {on.skills.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div role="group" aria-label="Skills by group" className={s.groups}>
        {skillGroups.map((group) => (
          <div key={group} className={s.group}>
            <h3 className={s.groupName}>{group}</h3>
            <ul aria-label={group} className={s.chips}>
              {skills
                .filter((sk) => sk.group === group)
                .map((sk) => (
                  <li key={sk.name}>
                    <button
                      type="button"
                      className={s.chip}
                      data-group={skillGroups.indexOf(group)}
                      data-lit={on.skills.includes(sk.name) ? "" : undefined}
                      data-dim={active && !on.skills.includes(sk.name) ? "" : undefined}
                      {...activates({ skill: sk.name })}
                    >
                      {sk.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <h3 className={s.groupName}>Proofs</h3>
      <ul aria-label="Proofs" className={s.chips}>
        {proofs.map((id) => (
          <li key={id}>
            <button
              type="button"
              className={`${s.chip} ${s.proof}`}
              // Named apart from the island's chip of the same project, which opens its card.
              aria-label={`${proofLabel(id)}, proof`}
              data-lit={on.proofs.includes(id) ? "" : undefined}
              data-dim={active && !on.proofs.includes(id) ? "" : undefined}
              {...activates({ proof: id })}
            >
              {proofLabel(id)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
