"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
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
  kind: "single" | "yesno";
  options?: readonly string[];
}

interface TableRowsStepProps {
  eyebrow: string;
  sectionTitle: string;
  primaryQuestion: (row: string) => string;
  rows: readonly string[];
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
      title={row}
      subtitle={sectionTitle}
      image={rowImages?.[row] ? { src: rowImages[row], alt: row } : undefined}
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
      <p className="mb-4 text-lg font-medium">{primaryQuestion(row)}</p>
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
        <div className="mt-5 flex flex-col gap-4 animate-fade-up">
          {extraFields.map((field) => (
            <div key={field.key}>
              <p className="mb-2 text-sm font-medium text-muted-foreground">{field.label}</p>
              <div className="flex flex-wrap gap-2">
                {(field.kind === "yesno" ? (["Yes", "No"] as const) : field.options ?? []).map((opt) => {
                  const active = answer[field.key] === opt;
                  return (
                    <RippleButton
                      key={opt}
                      onClick={() => setRowField(row, field.key, opt)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      {opt}
                    </RippleButton>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </StepShell>
  );
}
