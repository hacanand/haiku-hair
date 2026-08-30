"use client";

import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
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
      <button
        type="button"
        onClick={() => {
          setDraftStatus(status);
          setDraftText(describe ?? "");
          setExpanded(true);
        }}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/10 active:bg-muted/20"
      >
        <span className="text-[15px] font-medium text-foreground">Treatment experience</span>
        <div className="flex items-center gap-2">
          {!hasAnswer ? (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Plus className="size-3.5" /> Add
            </span>
          ) : (
            <span className="text-[15px] text-muted-foreground truncate max-w-[150px]">
              {describe ? `“${describe}”` : status === "Yes" ? "Had an issue" : "No issues"}
            </span>
          )}
          <ChevronRight className="size-4 text-muted-foreground/30" />
        </div>
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-5">
      <p className="text-[15px] font-medium text-foreground">Treatment experience</p>
      <div className="flex gap-2">
        {(["Yes", "No"] as const).map((opt) => (
          <Button
            key={opt}
            variant={draftStatus === opt ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setDraftStatus(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
      <Textarea
        autoFocus
        placeholder="What happened?"
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
        className="min-h-20 resize-none rounded-2xl bg-background/50"
      />
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" className="rounded-full" onClick={() => setExpanded(false)}>
          Cancel
        </Button>
        <Button
          className="rounded-full"
          onClick={() => {
            onChange(draftStatus, draftText.trim() || null);
            setExpanded(false);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
