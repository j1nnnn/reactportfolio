/**
 * The dive's stations, in flight order. Each owns a slice of the dive's scroll progress (0 to 1):
 * within it, its panel flies in from depth, holds while it's read, then flies past the viewer.
 * Read by both the 3D world and the panels. Adding a station is adding an entry here and its
 * section in Dive.tsx.
 */
export type StationId = "about";

export type Station = {
  /** Also the section's anchor: `#about` lands where the station's panel has arrived. */
  id: StationId;
  /** The slice of the dive's progress this station owns, [from, to]. */
  range: [number, number];
  /** Which side of the screen the panel holds on, on wide screens. */
  side: "left" | "right";
};

/** Progress spent fading the sky to deep space before the first station arrives. */
export const DIVE_INTRO = 0.12;

export const stations: Station[] = [{ id: "about", range: [DIVE_INTRO, 1], side: "left" }];

/** Where within a station's slice its panel is fully in and fully held: fly in, hold, fly out. */
export const FLY_IN = 0.3;
export const FLY_OUT = 0.7;

/** The progress at which a station's panel has just arrived and holds, its top in view. */
export function stationArrival({ range: [from, to] }: Station): number {
  return from + (to - from) * (FLY_IN + 0.001);
}
