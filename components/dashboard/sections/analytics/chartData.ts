/** Shared constants and helpers for SVG chart rendering */

// ── Performance line chart ─────────────────────────────────────────────────
export const TECHNICAL_DATA = [45, 52, 55, 60, 68, 72, 75, 82];
export const BEHAVIORAL_DATA = [30, 40, 45, 42, 55, 60, 62, 70];
export const WEEKS = [
  "Wk 1",
  "Wk 2",
  "Wk 3",
  "Wk 4",
  "Wk 5",
  "Wk 6",
  "Wk 7",
  "Wk 8",
];

// SVG viewport settings
export const CW = 560,
  CH = 180,
  PL = 32,
  PR = 8,
  PT = 10,
  PB = 28;
export const AW = CW - PL - PR;
export const AH = CH - PT - PB;

export function sx(i: number) {
  return PL + (i / (WEEKS.length - 1)) * AW;
}
export function sy(score: number) {
  return PT + (1 - score / 100) * AH;
}

export const techPts = TECHNICAL_DATA.map(
  (s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`,
).join(" ");

export const behavPts = BEHAVIORAL_DATA.map(
  (s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`,
).join(" ");

export function technicalFill() {
  return `M ${TECHNICAL_DATA.map((s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`).join(" L ")} L ${sx(7).toFixed(1)},${CH - PB} L ${sx(0).toFixed(1)},${CH - PB} Z`;
}

export function behavioralFill() {
  return `M ${BEHAVIORAL_DATA.map((s, i) => `${sx(i).toFixed(1)},${sy(s).toFixed(1)}`).join(" L ")} L ${sx(7).toFixed(1)},${CH - PB} L ${sx(0).toFixed(1)},${CH - PB} Z`;
}

// ── Radar chart ────────────────────────────────────────────────────────────
export const RCX = 110,
  RCY = 110,
  RR = 80;
export const RADAR_LABELS = [
  "Communication",
  "Data Struct.",
  "System Des.",
  "Behavioral",
  "Prob. Solving",
  "Code Quality",
];
export const CURRENT_VALS = [85, 65, 50, 78, 90, 72];
export const MARKET_VALS = [60, 60, 55, 65, 70, 60];

export function rPt(val: number, idx: number) {
  const a = (idx * 60 - 90) * (Math.PI / 180);
  return {
    x: RCX + (val / 100) * RR * Math.cos(a),
    y: RCY + (val / 100) * RR * Math.sin(a),
  };
}

export function hexPts(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * (Math.PI / 180);
    return `${(RCX + r * Math.cos(a)).toFixed(1)},${(RCY + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// ── Heatmap ───────────────────────────────────────────────────────────────
export type HeatVal = "gray" | "b2" | "b4" | "b6";

export const HEATMAP: HeatVal[][] = [
  ["gray", "b2", "gray", "b4", "gray", "gray", "gray"],
  ["gray", "gray", "b6", "b2", "gray", "gray", "b2"],
  ["b4", "b2", "gray", "gray", "gray", "b6", "gray"],
  ["gray", "gray", "gray", "gray", "b2", "b4", "gray"],
  ["b6", "b6", "b4", "b2", "gray", "gray", "gray"],
  ["gray", "gray", "gray", "b2", "b4", "gray", "gray"],
  ["b2", "gray", "gray", "gray", "gray", "gray", "b6"],
  ["gray", "b4", "b4", "gray", "gray", "gray", "gray"],
  ["b6", "b2", "gray", "gray", "gray", "gray", "b2"],
  ["gray", "gray", "gray", "b6", "b6", "b4", "gray"],
  ["b2", "gray", "gray", "gray", "gray", "gray", "gray"],
  ["gray", "gray", "gray", "gray", "b2", "b4", "b6"],
  ["gray", "gray", "b4", "gray", "gray", "gray", "gray"],
];

export const HEAT_CLS: Record<HeatVal, string> = {
  gray: "bg-gray-100 dark:bg-gray-800",
  b2: "bg-blue-200",
  b4: "bg-blue-400",
  b6: "bg-blue-600",
};
