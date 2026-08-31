"use client";

import { Check, X } from "lucide-react";
import { StepShell } from "@/components/intake/step-shell";
import { ContinueButton } from "@/components/intake/continue-button";
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
        <ContinueButton incomplete={continueDisabled} onContinue={onContinue} nudgeMessage="Please tap Yes or No to continue." />
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
        "relative flex h-24 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[2rem] text-lg font-semibold transition-all duration-300",
        active 
          ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 scale-[1.02]" 
          : "bg-muted/50 text-foreground hover:bg-muted"
      )}
    >
      <RippleLayer ripples={ripples} />
      {icon}
      {label}
    </button>
  );
}
