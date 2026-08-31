"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createInitialState,
  type IntakeState,
  type ProductAnswer,
  type ProcedureAnswer,
  type Sex,
} from "@/lib/schema";
import { STEP_ORDER, nextStep, prevStep, type StepId } from "@/lib/steps";
import type { Beat } from "@/lib/beats";

interface IntakeStore {
  step: StepId;
  hasHydrated: boolean;
  answers: IntakeState;
  visitedBeats: Record<string, boolean>;
  /** "detected": pre-filled from Beat A's speech, not yet confirmed by a tap
   *  on the sex-gate screen — that's the only state that shows the "please
   *  confirm" hint. "manual": the patient has tapped a card themselves
   *  (whether or not it matches what was detected), which is the only thing
   *  that actually counts as a real answer for anything gender-gated. */
  sexSource: "detected" | "manual" | null;
  /** When true, the next goNext() returns to the review screen instead of
   *  advancing linearly — set when a review-screen edit jumps back into the flow. */
  returnToReview: boolean;

  setField: <K extends keyof IntakeState>(key: K, value: IntakeState[K]) => void;
  setHabitField: <K extends keyof IntakeState["habits"]>(key: K, value: IntakeState["habits"][K]) => void;
  setProductField: (row: string, field: keyof ProductAnswer, value: ProductAnswer[keyof ProductAnswer]) => void;
  setProcedureField: (row: string, field: keyof ProcedureAnswer, value: ProcedureAnswer[keyof ProcedureAnswer]) => void;

  /** The patient tapping a card on the sex-gate screen — the only path that
   *  counts as a confirmed answer. */
  setSex: (value: Sex) => void;
  /** Beat A's speech-derived pre-fill. Never overrides a value the patient
   *  already confirmed themselves (setSex), so re-running/editing Beat A
   *  after the sex-gate step can't quietly change a real answer. */
  setDetectedSex: (value: "female" | "male") => void;

  /** Merges a voice beat's extracted JSON into answers, keyed by field.key. */
  applyBeatResult: (beat: Beat, result: Record<string, unknown>) => void;

  goNext: () => void;
  goBack: () => void;
  goTo: (step: StepId, opts?: { forReview?: boolean }) => void;
  reset: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useIntakeStore = create<IntakeStore>()(
  persist(
    (set) => ({
      step: STEP_ORDER[0],
      hasHydrated: false,
      answers: createInitialState(),
      visitedBeats: {},
      sexSource: null,
      returnToReview: false,

      setField: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),

      setHabitField: (key, value) =>
        set((s) => ({ answers: { ...s.answers, habits: { ...s.answers.habits, [key]: value } } })),

      setProductField: (row, field, value) =>
        set((s) => ({
          answers: {
            ...s.answers,
            products: { ...s.answers.products, [row]: { ...s.answers.products[row], [field]: value } },
          },
        })),

      setProcedureField: (row, field, value) =>
        set((s) => ({
          answers: {
            ...s.answers,
            procedures: { ...s.answers.procedures, [row]: { ...s.answers.procedures[row], [field]: value } },
          },
        })),

      setSex: (value) =>
        set((s) => ({ answers: { ...s.answers, sex: value }, sexSource: "manual" })),

      setDetectedSex: (value) =>
        set((s) => (s.answers.sex != null ? s : { answers: { ...s.answers, sex: value }, sexSource: "detected" })),

      applyBeatResult: (beat, result) =>
        set((s) => {
          const answers = { ...s.answers } as IntakeState;
          const habits = { ...answers.habits };
          for (const field of beat.fields) {
            if (!(field.key in result)) continue;
            const value = result[field.key];
            if (field.key in habits) {
              // @ts-expect-error -- habit keys are validated against HabitsAnswers above
              habits[field.key] = value ?? null;
            } else if (field.key in answers) {
              // @ts-expect-error -- top-level keys are validated against IntakeState above
              answers[field.key] = value ?? (field.kind === "multi" ? [] : null);
            }
          }
          answers.habits = habits;
          return { answers, visitedBeats: { ...s.visitedBeats, [beat.id]: true } };
        }),

      // Both exits from a review-triggered edit detour — Continue *and* Back
      // — return to the review screen rather than resuming the linear walk,
      // since either way the patient is done with that one fix.
      goNext: () =>
        set((s) =>
          s.returnToReview
            ? { step: "review" as StepId, returnToReview: false }
            : { step: nextStep(s.step, s.answers) }
        ),
      goBack: () =>
        set((s) =>
          s.returnToReview
            ? { step: "review" as StepId, returnToReview: false }
            : { step: prevStep(s.step, s.answers) }
        ),
      goTo: (step, opts) => set({ step, returnToReview: !!opts?.forReview }),
      reset: () => set({ step: STEP_ORDER[0], answers: createInitialState(), visitedBeats: {}, sexSource: null, returnToReview: false }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "genoroot-intake",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ step: s.step, answers: s.answers, visitedBeats: s.visitedBeats, sexSource: s.sexSource }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
