"use client";

import { Check } from "lucide-react";
import { StepShell } from "@/components/intake/step-shell";
import { OptionImage } from "@/components/intake/option-image";
import { useRipple, RippleLayer } from "@/components/intake/ripple";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TapChoiceStepProps {
  /** Overrides the auto category label — leave unset to use the step's default. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: { src: string; alt: string };
  options: readonly string[];
  optionImages?: Record<string, string>;
  multi?: boolean;
  /** Selecting this option clears every other selection, and vice versa (e.g. "None"). */
  exclusiveOption?: string;
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

/** One reusable full-screen tap step: image-card grid when options carry
 *  illustrations, otherwise a plain big-target option list. Grid columns
 *  flex with viewport width so it holds up from a small phone to the
 *  desktop device frame. */
export function TapChoiceStep({
  eyebrow,
  title,
  subtitle,
  heroImage,
  options,
  optionImages,
  multi,
  exclusiveOption,
  value,
  onChange,
  onContinue,
  continueLabel = "Continue",
  continueDisabled,
}: TapChoiceStepProps) {
  const selected = multi ? ((value as string[] | null) ?? []) : value;

  function isSelected(option: string) {
    return multi ? (selected as string[]).includes(option) : selected === option;
  }

  function toggle(option: string) {
    if (!multi) {
      onChange(option);
      return;
    }
    const arr = selected as string[];
    if (option === exclusiveOption) {
      onChange(arr.includes(option) ? [] : [option]);
      return;
    }
    const withoutExclusive = exclusiveOption ? arr.filter((o) => o !== exclusiveOption) : arr;
    onChange(withoutExclusive.includes(option) ? withoutExclusive.filter((o) => o !== option) : [...withoutExclusive, option]);
  }

  const hasImages = !!optionImages;

  return (
    <StepShell
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      image={heroImage}
      footer={
        <Button size="lg" disabled={continueDisabled} className="h-14 w-full rounded-full text-base" onClick={onContinue}>
          {continueLabel}
        </Button>
      }
    >
      {hasImages ? (
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <ImageOptionTile
              key={option}
              option={option}
              image={optionImages?.[option]}
              active={isSelected(option)}
              onClick={() => toggle(option)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {options.map((option) => (
            <TextOptionRow key={option} option={option} active={isSelected(option)} onClick={() => toggle(option)} />
          ))}
        </div>
      )}
    </StepShell>
  );
}

function ImageOptionTile({
  option,
  image,
  active,
  onClick,
}: {
  option: string;
  image?: string;
  active: boolean;
  onClick: () => void;
}) {
  const { onPointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card text-left transition-colors",
        active ? "border-primary elevation-2" : "border-border elevation-1 hover:border-primary/40"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <OptionImage src={image} alt={option} sizes="(min-width: 1024px) 190px, 45vw" />
        <RippleLayer ripples={ripples} />
        {active && (
          <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" />
          </span>
        )}
      </div>
      <span className="px-3 py-2.5 text-sm font-medium">{option}</span>
    </button>
  );
}

function TextOptionRow({ option, active, onClick }: { option: string; active: boolean; onClick: () => void }) {
  const { onPointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex min-h-14 items-center justify-between gap-3 overflow-hidden rounded-2xl border bg-card px-4 py-3 text-left text-base font-medium transition-colors",
        active ? "border-primary bg-secondary elevation-1" : "border-border hover:border-primary/30"
      )}
    >
      <RippleLayer ripples={ripples} />
      {option}
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        )}
      >
        {active && <Check className="size-4" />}
      </span>
    </button>
  );
}
