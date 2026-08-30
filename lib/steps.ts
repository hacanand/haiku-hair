import type { IntakeState } from "@/lib/schema";

export type StepId =
  | "welcome"
  | "beatA"
  | "sexGate"
  | "conditions"
  | "menstrual"
  | "pregnancy"
  | "acne"
  | "facialHair"
  | "beatB"
  | "beatC"
  | "products"
  | "procedures"
  | "beatD"
  | "sampleType"
  | "consent"
  | "review"
  | "done";

export const STEP_ORDER: StepId[] = [
  "welcome",
  "beatA",
  "sexGate",
  "conditions",
  "menstrual",
  "pregnancy",
  "acne",
  "facialHair",
  "beatB",
  "beatC",
  "products",
  "procedures",
  "beatD",
  "sampleType",
  "consent",
  "review",
  "done",
];

// Steps that count toward the progress bar (bookends excluded).
export const COUNTED_STEPS: StepId[] = STEP_ORDER.filter((s) => s !== "welcome" && s !== "done");

/** Plain-language category shown above the question — never the internal
 *  step id or the source form's section letter (a patient has no reason to
 *  know either exists). Single source of truth so every screen agrees. */
export const STEP_CATEGORY: Record<StepId, string> = {
  welcome: "",
  beatA: "Hair loss history",
  sexGate: "Quick check",
  conditions: "Health background",
  menstrual: "Health background",
  pregnancy: "Health background",
  acne: "Health background",
  facialHair: "Health background",
  beatB: "Lifestyle",
  beatC: "Daily routine",
  products: "Current treatments",
  procedures: "Current treatments",
  beatD: "Current treatments",
  sampleType: "Sample & consent",
  consent: "Sample & consent",
  review: "Review",
  done: "",
};

export function isStepVisible(id: StepId, state: IntakeState): boolean {
  if (id === "menstrual" || id === "pregnancy") return state.sex === "female";
  return true;
}

export function getVisibleSteps(state: IntakeState): StepId[] {
  return STEP_ORDER.filter((id) => isStepVisible(id, state));
}

export function nextStep(current: StepId, state: IntakeState): StepId {
  const visible = getVisibleSteps(state);
  const idx = visible.indexOf(current);
  return visible[Math.min(idx + 1, visible.length - 1)];
}

export function prevStep(current: StepId, state: IntakeState): StepId {
  const visible = getVisibleSteps(state);
  const idx = visible.indexOf(current);
  return visible[Math.max(idx - 1, 0)];
}

export function progressFor(current: StepId, state: IntakeState): { index: number; total: number } {
  const visible = getVisibleSteps(state).filter((s) => COUNTED_STEPS.includes(s));
  const idx = visible.indexOf(current);
  return { index: Math.max(idx, 0) + 1, total: visible.length };
}
