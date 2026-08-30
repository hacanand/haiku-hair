"use client";

import { useState } from "react";
import { Pill } from "@/components/intake/pill";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { YesNo } from "@/lib/schema";

interface PastTreatmentChipProps {
  status: YesNo | null;
  describe: string | null;
  onChange: (status: YesNo | null, describe: string | null) => void;
  stagger?: number;
}

/** Beat D stays one quoted chip — yes/no plus the patient's own words —
 *  never split into separate fields. */
export function PastTreatmentChip({ status, describe, onChange, stagger = 0 }: PastTreatmentChipProps) {
  const [expanded, setExpanded] = useState(false);
  const [draftStatus, setDraftStatus] = useState<YesNo | null>(status);
  const [draftText, setDraftText] = useState(describe ?? "");

  if (!expanded) {
    const hasAnswer = status != null;
    return (
      <Pill
        tone={hasAnswer ? "confirmed" : "missing"}
        icon={hasAnswer ? "check" : "plus"}
        stagger={stagger}
        className="max-w-full text-left whitespace-normal"
        onClick={() => {
          setDraftStatus(status);
          setDraftText(describe ?? "");
          setExpanded(true);
        }}
      >
        {hasAnswer ? (describe ? `“${describe}”` : status === "Yes" ? "Had an issue" : "No issues") : "Add response"}
      </Pill>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      <div className="flex gap-2">
        {(["Yes", "No"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setDraftStatus(opt)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              draftStatus === opt ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-transparent"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <Textarea
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
        placeholder="Apne shabdon mein…"
        rows={3}
        className="rounded-2xl"
        autoFocus
      />
      <Button
        size="sm"
        className="ml-auto rounded-full"
        onClick={() => {
          onChange(draftStatus, draftText.trim() || null);
          setExpanded(false);
        }}
      >
        Save
      </Button>
    </div>
  );
}
