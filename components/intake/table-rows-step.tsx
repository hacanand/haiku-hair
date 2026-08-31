"use client";

import { useState } from "react";
import { Check, X, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { StepShell } from "@/components/intake/step-shell";
import { Button } from "@/components/ui/button";
import { RippleButton } from "@/components/intake/ripple";
import { highlightTerms } from "@/components/ui/term-tooltip";
import { cn } from "@/lib/utils";
import { useIntakeStore } from "@/lib/store";
import type { YesNo } from "@/lib/schema";

type FieldValue = boolean | string | YesNo | null;

interface ExtraField {
  key: string;
  label: string;
  icon: LucideIcon;
  kind: "single" | "yesno";
  options?: readonly string[];
  /** Full-text display for each option — falls back to the raw stored value. */
  optionLabels?: Record<string, string>;
}

interface TableRowsStepProps {
  eyebrow: string;
  sectionTitle: string;
  primaryQuestion: (rowLabel: string) => string;
  rows: readonly string[];
  /** Full-text display name for each row — falls back to the raw stored value. */
  rowLabels?: Record<string, string>;
  rowImages?: Record<string, string>;
  primaryKey: string;
  extraFields: ExtraField[];
  getRowAnswer: (row: string) => Record<string, FieldValue>;
  setRowField: (row: string, field: string, value: FieldValue) => void;
  onFinish: () => void;
}

/** One row at a time: "used it?" first, extra detail fields reveal only on
 *  Yes — quicker for a long product/procedure table on a phone than one
 *  giant scrolling grid. */
export function TableRowsStep({
  eyebrow,
  sectionTitle,
  primaryQuestion,
  rows,
  rowLabels,
  rowImages,
  primaryKey,
  extraFields,
  getRowAnswer,
  setRowField,
  onFinish,
}: TableRowsStepProps) {
  const [index, setIndex] = useState(0);
  // First Next/Continue tap on a row that isn't fully answered just nudges
  // — tracked per row index so moving on doesn't carry a stale warning, and
  // a second tap on the same row goes through rather than trapping them.
  const [warnedIndex, setWarnedIndex] = useState<number | null>(null);
  const storeGoBack = useIntakeStore((s) => s.goBack);
  const row = rows[index];
  const displayRow = rowLabels?.[row] ?? row;
  const answer = getRowAnswer(row);
  const primaryVal = answer[primaryKey] as boolean | null;
  const isLast = index === rows.length - 1;

  function goToRow(next: number) {
    if (next < 0) return;
    if (next >= rows.length) {
      onFinish();
      return;
    }
    setIndex(next);
  }

  function handleNext() {
    if (primaryVal == null) {
      if (warnedIndex !== index) {
        setWarnedIndex(index);
        toast.warning(`Please answer: have you used ${displayRow.toLowerCase()}?`, {
          description: "Tap Yes or No above — or tap this button again to skip it.",
        });
        return;
      }
      goToRow(index + 1);
      return;
    }
    if (primaryVal === true) {
      const missing = extraFields.filter((f) => answer[f.key] == null).map((f) => f.label);
      if (missing.length > 0 && warnedIndex !== index) {
        setWarnedIndex(index);
        toast.warning(`Kuch details baaki hain: ${missing.join(", ")}`, {
          description: "Tap this button again to move on anyway.",
        });
        return;
      }
    }
    goToRow(index + 1);
  }

  return (
    <StepShell
      eyebrow={`${eyebrow} · ${index + 1} of ${rows.length}`}
      title={
        <span>
          Have you ever used {highlightTerms(displayRow.toLowerCase())}?
        </span>
      }
      image={rowImages?.[row] ? { src: rowImages[row], alt: displayRow } : undefined}
      onBack={() => (index > 0 ? setIndex(index - 1) : storeGoBack())}
      footer={
        <Button size="lg" className="h-14 w-full rounded-full text-base" onClick={handleNext}>
          {isLast ? "Continue" : "Next"}
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <RippleButton
          onClick={() => {
            const wasNull = primaryVal == null;
            setRowField(row, primaryKey, true);
          }}
          className={cn(
            "flex h-20 flex-col items-center justify-center gap-1.5 rounded-[2rem] text-lg font-semibold transition-all duration-300",
            primaryVal === true 
              ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 scale-[1.02]" 
              : "bg-muted/50 text-foreground hover:bg-muted"
          )}
        >
          <Check className="size-5" /> Yes
        </RippleButton>
        <RippleButton
          onClick={() => setRowField(row, primaryKey, false)}
          className={cn(
            "flex h-20 flex-col items-center justify-center gap-1.5 rounded-[2rem] text-lg font-semibold transition-all duration-300",
            primaryVal === false 
              ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 scale-[1.02]" 
              : "bg-muted/50 text-foreground hover:bg-muted"
          )}
        >
          <X className="size-5" /> No
        </RippleButton>
      </div>

      {primaryVal === true && (
        <div
          key={`extra-fields-${row}`}
          ref={(el) => {
            if (!el || el.dataset.scrolled) return;
            el.dataset.scrolled = "true";
            // Wait for the fade-up entrance animation to finish (it's
            // 380ms) before scrolling — smooth-scrolling toward an element
            // that's still animating its own position is what produced the
            // half-cut-off-pill glitch the last attempt at this ran into.
            // block:"nearest" only scrolls the minimum needed to bring the
            // card fully into view, so if it's already visible (a short
            // Yes/No-only field set on a tall screen) this is a no-op
            // rather than an unnecessary jump.
            window.setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 400);
          }}
          className="mt-6 flex flex-col gap-6 rounded-[2rem] bg-card/60 p-6 backdrop-blur-xl animate-fade-up shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20"
        >
          {extraFields.map((field) => {
            const Icon = field.icon;
            const options = field.kind === "yesno" ? (["Yes", "No"] as const) : (field.options ?? []);
            return (
              <div key={field.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{field.label}</p>
                </div>
                <div className="flex flex-wrap gap-2 pl-9">
                  {options.map((opt) => {
                    const active = answer[field.key] === opt;
                    const optLabel = field.optionLabels?.[opt] ?? opt;
                    return (
                      <RippleButton
                        key={opt}
                        onClick={() => setRowField(row, field.key, opt)}
                        className={cn(
                          "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                          active 
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                            : "bg-background/80 hover:bg-background text-foreground shadow-sm"
                        )}
                      >
                        {optLabel}
                      </RippleButton>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StepShell>
  );
}
