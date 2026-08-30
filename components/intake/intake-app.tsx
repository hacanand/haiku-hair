"use client";

import { useIntakeStore } from "@/lib/store";
import { BEATS } from "@/lib/beats";
import { AppFrame } from "@/components/intake/app-frame";
import { WelcomeStep } from "@/components/intake/steps/welcome-step";
import { VoiceBeatStep } from "@/components/intake/steps/voice-beat-step";
import {
  SexGateStep,
  ConditionsStep,
  MenstrualStep,
  PregnancyStep,
  AcneStep,
  FacialHairStep,
  SampleTypeStep,
  ConsentStep,
} from "@/components/intake/steps/tap-screens";
import { ProductsStep, ProceduresStep } from "@/components/intake/steps/table-screens";
import { ReviewStep } from "@/components/intake/steps/review-step";
import { DoneStep } from "@/components/intake/steps/done-step";
import type { StepId } from "@/lib/steps";

function CurrentStep({ step }: { step: StepId }) {
  switch (step) {
    case "welcome":
      return <WelcomeStep />;
    case "beatA":
      return <VoiceBeatStep key="beatA" beat={BEATS.A} />;
    case "sexGate":
      return <SexGateStep />;
    case "conditions":
      return <ConditionsStep />;
    case "menstrual":
      return <MenstrualStep />;
    case "pregnancy":
      return <PregnancyStep />;
    case "acne":
      return <AcneStep />;
    case "facialHair":
      return <FacialHairStep />;
    case "beatB":
      return <VoiceBeatStep key="beatB" beat={BEATS.B} />;
    case "beatC":
      return <VoiceBeatStep key="beatC" beat={BEATS.C} />;
    case "products":
      return <ProductsStep />;
    case "procedures":
      return <ProceduresStep />;
    case "beatD":
      return <VoiceBeatStep key="beatD" beat={BEATS.D} />;
    case "sampleType":
      return <SampleTypeStep />;
    case "consent":
      return <ConsentStep />;
    case "review":
      return <ReviewStep />;
    case "done":
      return <DoneStep />;
    default:
      return null;
  }
}

/** Single continuous flow — the patient never picks a mode; the screen
 *  shape just changes per step while progress bar, back button and footer
 *  CTA stay in the same place throughout. Wrapped in AppFrame so a laptop
 *  gets a deliberate "device" presentation instead of a mobile layout
 *  stranded in a sea of whitespace. */
export function IntakeApp() {
  const step = useIntakeStore((s) => s.step);
  const hasHydrated = useIntakeStore((s) => s.hasHydrated);

  return (
    <AppFrame>
      {!hasHydrated ? (
        <div className="flex h-full items-center justify-center">
          <span className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <CurrentStep step={step} />
      )}
    </AppFrame>
  );
}
