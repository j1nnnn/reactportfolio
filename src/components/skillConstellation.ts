"use client";

import { useSyncExternalStore } from "react";
import { skillGroups, skills, type ProofId, type SkillGroup } from "@/content/personal";

/** One colour per skill group, in the order the panel lists the groups; proofs are gold. */
const GROUP_COLOURS = ["#7aa2ff", "#b18cff", "#5fe0d0", "#ffb38a", "#8fe07a", "#ff8fb8", "#f3f6ff"];
export const GOLD = "#ffcf5a";
export const groupColour = (group: SkillGroup) => GROUP_COLOURS[skillGroups.indexOf(group) % GROUP_COLOURS.length];

// The skill constellation's active node, shared by the 3D cluster and the Skills panel's list so the
// two always agree. Nothing is active until the visitor hovers, taps or focuses a node.

export type ActiveNode = { skill: string } | { proof: ProofId } | null;

let active: ActiveNode = null;
const listeners = new Set<() => void>();

export function setActiveNode(node: ActiveNode) {
  active = node;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActiveNode() {
  return useSyncExternalStore(subscribe, () => active, () => null);
}

/** What an active node lights: the skill and its proofs, or the proof and the skills it shows. */
export function lit(node: ActiveNode): { skills: string[]; proofs: ProofId[] } {
  if (!node) return { skills: [], proofs: [] };
  if ("skill" in node) {
    return { skills: [node.skill], proofs: skills.find((sk) => sk.name === node.skill)?.proofs ?? [] };
  }
  return { skills: skills.filter((sk) => sk.proofs.includes(node.proof)).map((sk) => sk.name), proofs: [node.proof] };
}
