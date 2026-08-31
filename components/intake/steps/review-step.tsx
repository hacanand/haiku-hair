"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronRight, Copy, ShieldCheck } from "lucide-react";
import { StepShell } from "@/components/intake/step-shell";
import { Button } from "@/components/ui/button";
import { ContinueButton } from "@/components/intake/continue-button";
import { cn } from "@/lib/utils";
import { useIntakeStore } from "@/lib/store";
import {
  buildOutput,
  PRODUCT_ROWS,
  PROCEDURE_ROWS,
  PRODUCT_ROW_LABELS,
  PROCEDURE_ROW_LABELS,
  PRODUCT_DURATION_LABELS,
  PROCEDURE_SESSIONS_LABELS,
} from "@/lib/schema";
import { validateFinalAnswers } from "@/lib/validation";
import type { StepId } from "@/lib/steps";

function fmt(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

function ReviewRow({ label, value, onEdit }: { label: string; value: unknown; onEdit: () => void }) {
  const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-start justify-between gap-3 border-b border-border/60 py-3 text-left last:border-b-0"
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-right text-sm font-medium">
        <span className={cn(empty && "text-muted-foreground/60 italic")}>{fmt(value)}</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
      </span>
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card px-4 py-1">
      <p className="pt-3 pb-1 text-xs font-semibold tracking-wide text-primary uppercase">{title}</p>
      {children}
    </div>
  );
}

export function ReviewStep() {
  const [view, setView] = useState<"form" | "data">("form");
  const answers = useIntakeStore((s) => s.answers);
  const goTo = useIntakeStore((s) => s.goTo);
  const goNext = useIntakeStore((s) => s.goNext);

  const edit = (step: StepId) => () => goTo(step, { forReview: true });

  const output = buildOutput(answers);
  const validation = validateFinalAnswers(answers);
  const jsonText = JSON.stringify(output, null, 2);

  return (
    <StepShell
      eyebrow="Almost done"
      title="Check your answers"
      subtitle="Tap anything to fix it. This is exactly what your doctor will see."
      image={{ src: "https://ucarecdn.com/078dd1af-8812-40e4-920d-f86917482540/-/preview/", alt: "Review answers" }}
      hideMobileImage={true}
      footer={
        <ContinueButton
          incomplete={answers.consent !== "Yes"}
          label="Submit intake"
          nudgeMessage="Consent is still needed — tap the Sample & consent section above to fix it."
          onContinue={() => {
            toast.success("Intake submitted — see you at the clinic!");
            goNext();
          }}
        />
      }
    >
      <div className="mb-4 flex gap-1 rounded-full bg-muted p-1">
        {(["form", "data"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium capitalize transition-colors",
              view === v ? "bg-card shadow-sm" : "text-muted-foreground"
            )}
          >
            {v === "form" ? "Form view" : "Data view"}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-secondary/60 px-3.5 py-2.5 text-xs font-medium text-secondary-foreground">
        {validation.success ? (
          <>
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            Validated against the clinic&apos;s 16-question schema
          </>
        ) : (
          <>Some answers need a second look before submitting.</>
        )}
      </div>

      {view === "form" ? (
        <div className="flex flex-col gap-3">
          <SectionCard title="Hair loss history">
            <ReviewRow label="Age it began" value={answers.age_hair_loss_began} onEdit={edit("beatA")} />
            <ReviewRow label="Duration" value={answers.duration} onEdit={edit("beatA")} />
            <ReviewRow label="Family history" value={answers.family_history} onEdit={edit("beatA")} />
            <ReviewRow label="Pattern" value={answers.pattern} onEdit={edit("beatA")} />
          </SectionCard>

          <SectionCard title="Hormonal & health">
            <ReviewRow label="Diagnosed conditions" value={answers.diagnosed_conditions} onEdit={edit("conditions")} />
            {answers.sex === "female" && (
              <>
                <ReviewRow label="Menstrual cycle" value={answers.menstrual_cycle} onEdit={edit("menstrual")} />
                <ReviewRow label="Pregnancy related" value={answers.pregnancy_related} onEdit={edit("pregnancy")} />
              </>
            )}
            <ReviewRow label="Adult acne / oily skin" value={answers.adult_acne_oily_skin} onEdit={edit("acne")} />
            <ReviewRow label="Excess body/facial hair" value={answers.excess_body_facial_hair} onEdit={edit("facialHair")} />
          </SectionCard>

          <SectionCard title="Lifestyle & triggers">
            <ReviewRow label="Past 6 months" value={answers.past_6_months} onEdit={edit("beatB")} />
            <ReviewRow label="Smoking" value={answers.habits.smoking === "Yes" ? `Yes (${answers.habits.smoking_severity ?? "—"})` : answers.habits.smoking} onEdit={edit("beatC")} />
            <ReviewRow label="Alcohol" value={answers.habits.alcohol} onEdit={edit("beatC")} />
            <ReviewRow label="Hard water" value={answers.habits.hard_water} onEdit={edit("beatC")} />
            <ReviewRow label="Hair wash frequency" value={answers.habits.hair_wash_frequency} onEdit={edit("beatC")} />
            <ReviewRow label="Heating tools / chemicals" value={answers.habits.heating_tools_styling_chemicals} onEdit={edit("beatC")} />
            <ReviewRow
              label="Salon treatments"
              value={answers.habits.salon_treatments === "Yes" ? `Yes (${answers.habits.salon_treatment_detail ?? "unspecified"})` : answers.habits.salon_treatments}
              onEdit={edit("beatC")}
            />
          </SectionCard>

          <SectionCard title="Hair care & treatments">
            {PRODUCT_ROWS.map((row) => {
              const a = answers.products[row];
              const duration = a.duration ? (PRODUCT_DURATION_LABELS[a.duration] ?? a.duration) : "?";
              return (
                <ReviewRow
                  key={row}
                  label={PRODUCT_ROW_LABELS[row] ?? row}
                  value={a.used ? `Used · ${duration} · helped: ${a.helped ?? "?"}` : a.used === false ? "Not used" : null}
                  onEdit={edit("products")}
                />
              );
            })}
            {PROCEDURE_ROWS.map((row) => {
              const a = answers.procedures[row];
              const sessions = a.sessions ? (PROCEDURE_SESSIONS_LABELS[a.sessions] ?? a.sessions) : "?";
              return (
                <ReviewRow
                  key={row}
                  label={PROCEDURE_ROW_LABELS[row] ?? row}
                  value={a.done ? `Done · ${sessions} · helped: ${a.helped ?? "?"}` : a.done === false ? "Not done" : null}
                  onEdit={edit("procedures")}
                />
              );
            })}
            <ReviewRow
              label="Past treatment response"
              value={answers.past_treatment_side_effects ? `${answers.past_treatment_side_effects}${answers.describe ? ` — “${answers.describe}”` : ""}` : null}
              onEdit={edit("beatD")}
            />
          </SectionCard>

          <SectionCard title="Sample & consent">
            <ReviewRow label="Sample type" value={answers.sample_type} onEdit={edit("sampleType")} />
            <ReviewRow label="Consent given" value={answers.consent} onEdit={edit("consent")} />
          </SectionCard>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Exactly what gets submitted, as structured JSON.</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await navigator.clipboard.writeText(jsonText);
                toast.success("Copied JSON");
              }}
            >
              <Copy className="size-3.5" /> Copy
            </Button>
          </div>
          <pre className="max-h-[60vh] overflow-auto rounded-3xl bg-foreground p-4 text-xs leading-relaxed text-background">
            {jsonText}
          </pre>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3.5" /> Everything here is saved on this device until you submit.
      </div>
    </StepShell>
  );
}
