"use client";

import { useState } from "react";
import { Check, X, type LucideIcon } from "lucide-react";
import { StepShell } from "@/components/intake/step-shell";
import { Button } from "@/components/ui/button";
import { RippleButton } from "@/components/intake/ripple";
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

  return (
    <StepShell
      eyebrow={`${eyebrow} · ${index + 1} of ${rows.length}`}
      title={displayRow}
      subtitle={sectionTitle}
      image={rowImages?.[row] ? { src: rowImages[row], alt: displayRow } : undefined}
      onBack={() => (index > 0 ? setIndex(index - 1) : storeGoBack())}
      footer={
        <Button
          size="lg"
          disabled={primaryVal == null}
          className="h-14 w-full rounded-full text-base"
          onClick={() => goToRow(index + 1)}
        >
          {isLast ? "Continue" : "Next"}
        </Button>
      }
    >
      <p className="mb-4 text-xl leading-snug font-semibold text-balance">{primaryQuestion(displayRow)}</p>
      <div className="grid grid-cols-2 gap-3">
        <RippleButton
          onClick={() => setRowField(row, primaryKey, true)}
          className={cn(
            "flex h-20 flex-col items-center justify-center gap-1 rounded-3xl border text-base font-semibold transition-colors",
            primaryVal === true ? "border-primary bg-secondary elevation-1" : "border-border bg-card hover:border-primary/40"
          )}
        >
          <Check className="size-5" /> Yes
        </RippleButton>
        <RippleButton
          onClick={() => setRowField(row, primaryKey, false)}
          className={cn(
            "flex h-20 flex-col items-center justify-center gap-1 rounded-3xl border text-base font-semibold transition-colors",
            primaryVal === false ? "border-primary bg-secondary elevation-1" : "border-border bg-card hover:border-primary/40"
          )}
        >
          <X className="size-5" /> No
        </RippleButton>
      </div>

      {primaryVal === true && (
        <div 
          ref={(el) => {
            if (el && !el.dataset.scrolled) {
              el.dataset.scrolled = "true";
              setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
            }
          }}
          key={`extra-fields-${row}`}
          className="elevation-1 mt-5 flex flex-col divide-y divide-border/70 rounded-3xl border border-border bg-card animate-fade-up"
        >
          {extraFields.map((field) => {
            const Icon = field.icon;
            const options = field.kind === "yesno" ? (["Yes", "No"] as const) : (field.options ?? []);
            return (
              <div key={field.key} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="size-3.5" />
                  </span>
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
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
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          active ? "border-primary bg-secondary" : "border-border bg-background hover:border-primary/30"
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
