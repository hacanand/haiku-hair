"use client";

import { TapChoiceStep } from "@/components/intake/tap-choice-step";
import { YesNoStep } from "@/components/intake/yes-no-step";
import { StepShell } from "@/components/intake/step-shell";
import { ContinueButton } from "@/components/intake/continue-button";
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
import { ShieldCheck, Sparkles } from "lucide-react";

export function SexGateStep() {
  const sex = useIntakeStore((s) => s.answers.sex);
  const sexSource = useIntakeStore((s) => s.sexSource);
  const setSex = useIntakeStore((s) => s.setSex);
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
      image={{ src: "https://ucarecdn.com/03c77f39-0dec-4bfb-a661-b672b2375e6a/-/preview/", alt: "Patient profile" }}
      subtitle="A couple of the next questions only apply to female patients — this just makes sure we don't ask you anything that doesn't apply."
      footer={<ContinueButton incomplete={!sex} onContinue={goNext} nudgeMessage="Please pick one to continue." />}
    >
      {/* Only shown for a not-yet-confirmed speech pre-fill (setDetectedSex) —
          tapping any card below switches to setSex, which clears sexSource
          to "manual" and this banner disappears for good, whether or not
          they kept the same option. Never presented as a done deal. */}
      {sexSource === "detected" && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-primary/25 bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>Based on what you told us just now, we&apos;ve pre-selected one below — please confirm it&apos;s right, or pick another.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {options.map((opt) => (
          <RippleButton
            key={opt.value}
            onClick={() => setSex(opt.value)}
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
      heroImage={{ src: "https://ucarecdn.com/5148a4b0-9dad-404a-8e4b-be31cfd09fd0/-/preview/", alt: "Sample preference" }}
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
      image={{ src: "https://ucarecdn.com/885cc3ab-4ba3-4405-9e56-f0e91a2b05fe/-/preview/", alt: "Consent" }}
      footer={
        <ContinueButton
          incomplete={consent !== "Yes"}
          onContinue={goNext}
          label={consent === "Yes" ? "Confirm & continue" : "Please confirm to continue"}
          nudgeMessage="Please check the box above to give consent before continuing."
        />
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
