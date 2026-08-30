"use client";

import { Check, X } from "lucide-react";
import { StepShell } from "@/components/intake/step-shell";
import { Button } from "@/components/ui/button";
import { useRipple, RippleLayer } from "@/components/intake/ripple";
import { cn } from "@/lib/utils";
import type { YesNo } from "@/lib/schema";

interface YesNoStepProps {
  /** Overrides the auto category label — leave unset to use the step's default. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: { src: string; alt: string };
  value: YesNo | null;
  onChange: (value: YesNo) => void;
  onContinue: () => void;
  continueDisabled?: boolean;
}

export function YesNoStep({ eyebrow, title, subtitle, heroImage, value, onChange, onContinue, continueDisabled }: YesNoStepProps) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      image={heroImage}
      footer={
        <Button size="lg" disabled={continueDisabled} className="h-14 w-full rounded-full text-base" onClick={onContinue}>
          Continue
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <YesNoOption label="Yes" icon={<Check className="size-6" />} active={value === "Yes"} onClick={() => onChange("Yes")} />
        <YesNoOption label="No" icon={<X className="size-6" />} active={value === "No"} onClick={() => onChange("No")} />
      </div>
    </StepShell>
  );
}

function YesNoOption({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  const { onPointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex h-24 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-3xl border text-lg font-semibold transition-colors",
        active ? "border-primary bg-secondary text-secondary-foreground elevation-1" : "border-border bg-card hover:border-primary/40"
      )}
    >
      <RippleLayer ripples={ripples} />
      {icon}
      {label}
    </button>
  );
}
