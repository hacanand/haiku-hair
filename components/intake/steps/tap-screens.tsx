"use client";

import { TapChoiceStep } from "@/components/intake/tap-choice-step";
import { YesNoStep } from "@/components/intake/yes-no-step";
import { StepShell } from "@/components/intake/step-shell";
import { Button } from "@/components/ui/button";
import { RippleButton } from "@/components/intake/ripple";
import { cn } from "@/lib/utils";
import { useIntakeStore } from "@/lib/store";
import {
  CONDITION_OPTIONS,
  CONDITION_IMAGES,
  MENSTRUAL_OPTIONS,
  PREGNANCY_OPTIONS,
  SAMPLE_OPTIONS,
  SAMPLE_IMAGES,
  MISC_IMAGES,
} from "@/lib/schema";
import type { Sex } from "@/lib/schema";
import { ShieldCheck } from "lucide-react";

export function SexGateStep() {
  const sex = useIntakeStore((s) => s.answers.sex);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  const options: { value: Sex; label: string }[] = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "unspecified", label: "Prefer not to say" },
  ];

  return (
    <StepShell
      eyebrow="Quick check"
      title="Which best describes you?"
      image={{ src: "/images/patient_profile_check.png", alt: "Patient profile" }}
      subtitle="A couple of the next questions only apply to female patients — this just makes sure we don't ask you anything that doesn't apply."
      footer={
        <Button size="lg" disabled={!sex} className="h-14 w-full rounded-full text-base" onClick={goNext}>
          Continue
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {options.map((opt) => (
          <RippleButton
            key={opt.value}
            onClick={() => setField("sex", opt.value)}
            className={cn(
              "flex min-h-14 items-center rounded-2xl border px-4 py-3 text-left text-base font-medium transition-colors",
              sex === opt.value ? "border-primary bg-secondary elevation-1" : "border-border bg-card hover:border-primary/30"
            )}
          >
            {opt.label}
          </RippleButton>
        ))}
      </div>
    </StepShell>
  );
}

export function ConditionsStep() {
  const value = useIntakeStore((s) => s.answers.diagnosed_conditions);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TapChoiceStep
      title="Any diagnosed conditions?"
      subtitle="Tap all that apply."
      heroImage={{ src: MISC_IMAGES.healthIntro, alt: "General health check" }}
      options={CONDITION_OPTIONS}
      optionImages={CONDITION_IMAGES}
      multi
      exclusiveOption="None"
      value={value}
      onChange={(v) => setField("diagnosed_conditions", (v as string[]) ?? [])}
      onContinue={goNext}
      continueDisabled={value.length === 0}
    />
  );
}

export function MenstrualStep() {
  const value = useIntakeStore((s) => s.answers.menstrual_cycle);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TapChoiceStep
      title="Your menstrual cycle?"
      heroImage={{ src: MISC_IMAGES.menstrual, alt: "Menstrual pattern" }}
      options={MENSTRUAL_OPTIONS}
      value={value}
      onChange={(v) => setField("menstrual_cycle", v as string)}
      onContinue={goNext}
      continueDisabled={!value}
    />
  );
}

export function PregnancyStep() {
  const value = useIntakeStore((s) => s.answers.pregnancy_related);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TapChoiceStep
      title="Any pregnancy-related hair loss?"
      heroImage={{ src: MISC_IMAGES.pregnancy, alt: "Pregnancy or postpartum" }}
      options={PREGNANCY_OPTIONS}
      value={value}
      onChange={(v) => setField("pregnancy_related", v as string)}
      onContinue={goNext}
      continueDisabled={!value}
    />
  );
}

export function AcneStep() {
  const value = useIntakeStore((s) => s.answers.adult_acne_oily_skin);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <YesNoStep
      title="Acne or oily skin as an adult?"
      heroImage={{ src: MISC_IMAGES.acne, alt: "Adult acne or oily scalp" }}
      value={value}
      onChange={(v) => setField("adult_acne_oily_skin", v)}
      onContinue={goNext}
      continueDisabled={!value}
    />
  );
}

export function FacialHairStep() {
  const value = useIntakeStore((s) => s.answers.excess_body_facial_hair);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <YesNoStep
      title="Excess body or facial hair growth?"
      heroImage={{ src: MISC_IMAGES.facialHair, alt: "Excess facial or body hair" }}
      value={value}
      onChange={(v) => setField("excess_body_facial_hair", v)}
      onContinue={goNext}
      continueDisabled={!value}
    />
  );
}

export function SampleTypeStep() {
  const value = useIntakeStore((s) => s.answers.sample_type);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <TapChoiceStep
      title="Which sample would you prefer?"
      heroImage={{ src: "/images/sample_preference.png", alt: "Sample preference" }}
      subtitle="The test kit can be sent for either one."
      options={SAMPLE_OPTIONS}
      optionImages={SAMPLE_IMAGES}
      value={value}
      onChange={(v) => setField("sample_type", v as string)}
      onContinue={goNext}
      continueDisabled={!value}
    />
  );
}

export function ConsentStep() {
  const consent = useIntakeStore((s) => s.answers.consent);
  const setField = useIntakeStore((s) => s.setField);
  const goNext = useIntakeStore((s) => s.goNext);

  return (
    <StepShell
      title="One last thing"
      image={{ src: "/images/sample_consent.png", alt: "Consent" }}
      footer={
        <Button size="lg" disabled={consent !== "Yes"} className="h-14 w-full rounded-full text-base" onClick={goNext}>
          {consent === "Yes" ? "Confirm & continue" : "Please confirm to continue"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
        <ShieldCheck className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">
          We&apos;d like to collect a saliva or blood sample and run a genetic analysis alongside your consultation. Your
          sample and results stay within the clinic and are used only for your hair &amp; scalp care.
        </p>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
          <input
            type="checkbox"
            checked={consent === "Yes"}
            onChange={(e) => setField("consent", e.target.checked ? "Yes" : "No")}
            className="size-5 accent-primary"
          />
          <span className="text-sm font-medium">I consent to sample collection and genetic analysis.</span>
        </label>
      </div>
    </StepShell>
  );
}
