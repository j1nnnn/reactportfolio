import { experience, type ExperienceId } from "@/content/personal";

/**
 * The dive's stations, in flight order. Each owns a slice of the dive's scroll progress (0 to 1):
 * within it, its panel flies in from depth, holds while it's read, then flies past the viewer.
 * Read by both the 3D world and the panels. Adding a station is adding an entry here and its
 * section in Dive.tsx.
 */
export type StationId = "about" | ExperienceId;

export type Station = {
  id: StationId;
  /** The section anchor that lands where this station's panel has arrived (`#about`), if any. */
  anchor?: string;
  /** The slice of the dive's progress this station owns, [from, to]. */
  range: [number, number];
  /** Which side of the screen the panel holds on, on wide screens. */
  side: "left" | "right";
  /** A role station's dates: the label on the ring gate the camera flies through, and its place on the year rail. */
  gate?: string;
};

/** Progress spent fading the sky to deep space before the first station arrives. */
export const DIVE_INTRO = 0.12;

const order = [
  { id: "about" as StationId, anchor: "about" },
  // Experience: one station per role, newest first; #experience lands on the first.
  ...experience.map((role, i) => ({ id: role.id, anchor: i === 0 ? "experience" : undefined, gate: role.dates })),
];

const slice = (1 - DIVE_INTRO) / order.length;

export const stations: Station[] = order.map((st, i): Station => ({
  ...st,
  range: [DIVE_INTRO + slice * i, DIVE_INTRO + slice * (i + 1)],
  side: i % 2 === 0 ? "left" : "right",
}));

/** Where within a station's slice its panel is fully in and fully held: fly in, hold, fly out. */
export const FLY_IN = 0.3;
export const FLY_OUT = 0.7;

/** The progress at which a station's panel has just arrived and holds, its top in view. */
export function stationArrival({ range: [from, to] }: Station): number {
  return from + (to - from) * (FLY_IN + 0.001);
}

/** The station whose slice holds progress p, if any. */
export function stationAt(p: number): Station | undefined {
  return stations.find(({ range: [from, to] }) => p >= from && p <= to);
}
