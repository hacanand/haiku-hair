"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Pill } from "@/components/intake/pill";
import { MultiSelectSheet } from "@/components/intake/multi-select-sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BeatField } from "@/lib/beats";

interface ExtractedFieldProps {
  field: BeatField;
  value: unknown;
  onChange: (value: unknown) => void;
  stagger: number;
  nested?: boolean;
}

/** Renders one voice-beat field as a chip, wired to the shared inline-expand
 *  / bottom-sheet interaction rules from the design spec. */
export function ExtractedField({ field, value, onChange, stagger, nested }: ExtractedFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const wrapClass = nested ? "ml-4 border-l-2 border-dashed border-border pl-3" : "";

  if (field.kind === "number") {
    const num = value as number | null;
    if (expanded) {
      return (
        <div className={wrapClass}>
          <InlineNumberEditor
            initial={num}
            onCommit={(v) => {
              onChange(v);
              setExpanded(false);
            }}
          />
        </div>
      );
    }
    return (
      <div className={wrapClass}>
        <Pill
          tone={num == null ? "missing" : "confirmed"}
          icon={num == null ? "plus" : "check"}
          stagger={stagger}
          onClick={() => setExpanded(true)}
        >
          {num == null ? `Add ${field.label.toLowerCase()}` : `${field.label}: ${num}`}
        </Pill>
      </div>
    );
  }

  if (field.kind === "yesno") {
    const yn = value as "Yes" | "No" | null;
    if (expanded) {
      return (
        <div className={`flex gap-2 ${wrapClass}`}>
          {(["Yes", "No"] as const).map((opt) => (
            <Pill
              key={opt}
              tone="neutral"
              onClick={() => {
                onChange(opt);
                setExpanded(false);
              }}
            >
              {opt}
            </Pill>
          ))}
        </div>
      );
    }
    return (
      <div className={wrapClass}>
        <Pill
          tone={yn == null ? "missing" : "confirmed"}
          icon={yn == null ? "plus" : "check"}
          stagger={stagger}
          onClick={() => setExpanded(true)}
        >
          {yn == null ? `Add ${field.label.toLowerCase()}` : `${field.label}: ${yn}`}
        </Pill>
      </div>
    );
  }

  if (field.kind === "single") {
    const val = value as string | null;
    const options = field.options ?? [];
    if (expanded) {
      return (
        <div className={`flex flex-wrap gap-2 ${wrapClass}`}>
          {options.map((opt) => (
            <Pill
              key={opt}
              tone="neutral"
              onClick={() => {
                onChange(opt);
                setExpanded(false);
              }}
            >
              {opt}
            </Pill>
          ))}
        </div>
      );
    }
    return (
      <div className={wrapClass}>
        <Pill
          tone={val == null ? "missing" : "confirmed"}
          icon={val == null ? "plus" : "check"}
          stagger={stagger}
          onClick={() => setExpanded(true)}
        >
          {val == null ? `Add ${field.label.toLowerCase()}` : val}
        </Pill>
      </div>
    );
  }

  if (field.kind === "multi") {
    const arr = (value as string[] | null) ?? [];
    const options = field.options ?? [];
    return (
      <div className={`flex flex-wrap gap-2 ${wrapClass}`}>
        {arr.length === 0 && field.allowEmpty && (
          <Pill tone="confirmed" icon="check" stagger={stagger} onClick={() => setSheetOpen(true)}>
            None of these
          </Pill>
        )}
        {arr.length === 0 && !field.allowEmpty && (
          <Pill tone="missing" icon="plus" stagger={stagger} onClick={() => setSheetOpen(true)}>
            Add {field.label.toLowerCase()}
          </Pill>
        )}
        {arr.map((item, i) => (
          <Pill
            key={item}
            tone="confirmed"
            stagger={stagger + i}
            image={field.optionImages?.[item]}
            onClick={() => onChange(arr.filter((v) => v !== item))}
          >
            {item}
            <X className="size-3.5 opacity-70" />
          </Pill>
        ))}
        {arr.length > 0 && (
          <Pill tone="missing" icon="plus" onClick={() => setSheetOpen(true)}>
            Add more
          </Pill>
        )}
        <MultiSelectSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title={field.label}
          options={options}
          optionImages={field.optionImages}
          selected={arr}
          onConfirm={(next) => onChange(next)}
        />
      </div>
    );
  }

  // text
  const text = (value as string | null) ?? null;
  if (expanded) {
    return (
      <div className={wrapClass}>
        <InlineTextEditor
          initial={text ?? ""}
          onCommit={(v) => {
            onChange(v || null);
            setExpanded(false);
          }}
        />
      </div>
    );
  }
  return (
    <div className={wrapClass}>
      <Pill
        tone={text ? "confirmed" : "missing"}
        icon={text ? "check" : "plus"}
        stagger={stagger}
        onClick={() => setExpanded(true)}
      >
        {text ? `“${text}”` : `Add ${field.label.toLowerCase()}`}
      </Pill>
    </div>
  );
}

function InlineNumberEditor({ initial, onCommit }: { initial: number | null; onCommit: (v: number | null) => void }) {
  const [val, setVal] = useState(initial != null ? String(initial) : "");
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        inputMode="numeric"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit(val ? Number(val) : null);
        }}
        className="h-10 w-24 rounded-full text-center"
      />
      <Button size="sm" className="rounded-full" onClick={() => onCommit(val ? Number(val) : null)}>
        Save
      </Button>
    </div>
  );
}

function InlineTextEditor({ initial, onCommit }: { initial: string; onCommit: (v: string) => void }) {
  const [val, setVal] = useState(initial);
  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit(val.trim());
        }}
        placeholder="Type here…"
        className="h-10 min-w-40 rounded-full"
      />
      <Button size="sm" className="rounded-full" onClick={() => onCommit(val.trim())}>
        Save
      </Button>
    </div>
  );
}
