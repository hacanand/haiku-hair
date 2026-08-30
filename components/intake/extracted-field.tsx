"use client";

import { useState } from "react";
import { X, Plus, Check, ChevronRight } from "lucide-react";
import { MultiSelectSheet } from "@/components/intake/multi-select-sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BeatField } from "@/lib/beats";

interface ExtractedFieldProps {
  field: BeatField;
  value: unknown;
  onChange: (value: unknown) => void;
  stagger: number;
  nested?: boolean;
}

function RowField({
  label,
  value,
  missing,
  onClick,
  nested,
}: {
  label: string;
  value: React.ReactNode;
  missing: boolean;
  onClick: () => void;
  nested?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/10 active:bg-muted/20",
        nested && "bg-muted/5 pl-8 border-l-2 border-primary/20"
      )}
    >
      <span className="text-[15px] font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {missing ? (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Plus className="size-3.5" /> Add
          </span>
        ) : (
          <span className="text-[15px] text-muted-foreground truncate max-w-[150px]">
            {value}
          </span>
        )}
        <ChevronRight className="size-4 text-muted-foreground/30" />
      </div>
    </button>
  );
}

export function ExtractedField({ field, value, onChange, stagger, nested }: ExtractedFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const wrapClass = nested ? "bg-muted/5 pl-8 border-l-2 border-primary/20" : "";

  if (field.kind === "number") {
    const num = value as number | null;
    if (expanded) {
      return (
        <div className={`flex flex-col gap-3 p-5 ${wrapClass}`}>
          <p className="text-sm font-medium text-foreground">{field.label}</p>
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
      <RowField
        label={field.label}
        value={num}
        missing={num == null}
        onClick={() => setExpanded(true)}
        nested={nested}
      />
    );
  }

  if (field.kind === "yesno") {
    const yn = value as "Yes" | "No" | null;
    if (expanded) {
      return (
        <div className={`flex flex-col gap-3 p-5 ${wrapClass}`}>
          <p className="text-sm font-medium text-foreground">{field.label}</p>
          <div className="flex gap-2">
            {(["Yes", "No"] as const).map((opt) => (
              <Button
                key={opt}
                variant={opt === yn ? "default" : "outline"}
                className="rounded-full"
                onClick={() => {
                  onChange(opt);
                  setExpanded(false);
                }}
              >
                {opt === yn && <Check className="size-4" />}
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <RowField
        label={field.label}
        value={yn}
        missing={yn == null}
        onClick={() => setExpanded(true)}
        nested={nested}
      />
    );
  }

  if (field.kind === "single") {
    const val = value as string | null;
    const options = field.options ?? [];
    if (expanded) {
      return (
        <div className={`flex flex-col gap-3 p-5 ${wrapClass}`}>
          <p className="text-sm font-medium text-foreground">{field.label}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <Button
                key={opt}
                variant={opt === val ? "default" : "outline"}
                className="rounded-full"
                onClick={() => {
                  onChange(opt);
                  setExpanded(false);
                }}
              >
                {opt === val && <Check className="size-4" />}
                {opt}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <RowField
        label={field.label}
        value={val}
        missing={val == null}
        onClick={() => setExpanded(true)}
        nested={nested}
      />
    );
  }

  if (field.kind === "multi") {
    const arr = (value as string[] | null) ?? [];
    const options = field.options ?? [];
    return (
      <>
        <div className={`flex flex-col p-5 ${wrapClass}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] font-medium text-foreground">{field.label}</span>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="size-3.5" /> Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {arr.length === 0 ? (
              <span className="text-sm text-muted-foreground/60 italic">No options selected</span>
            ) : (
              arr.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium shadow-sm"
                >
                  {item}
                  <button
                    onClick={() => onChange(arr.filter((v) => v !== item))}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
        <MultiSelectSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title={field.label}
          options={options}
          optionImages={field.optionImages}
          selected={arr}
          exclusiveOption={options.find((o) => o === "None" || o === "No known family history" || o === "None of the above")}
          onConfirm={(next) => onChange(next)}
        />
      </>
    );
  }

  // text
  const text = (value as string | null) ?? null;
  if (expanded) {
    return (
      <div className={`flex flex-col gap-3 p-5 ${wrapClass}`}>
        <p className="text-sm font-medium text-foreground">{field.label}</p>
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
    <RowField
      label={field.label}
      value={text ? `“${text}”` : null}
      missing={text == null}
      onClick={() => setExpanded(true)}
      nested={nested}
    />
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
        className="h-12 w-28 rounded-full text-center text-lg"
      />
      <Button className="rounded-full h-12 px-6" onClick={() => onCommit(val ? Number(val) : null)}>
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
        className="h-12 flex-1 min-w-[200px] rounded-full text-lg px-5"
      />
      <Button className="rounded-full h-12 px-6" onClick={() => onCommit(val.trim())}>
        Save
      </Button>
    </div>
  );
}
