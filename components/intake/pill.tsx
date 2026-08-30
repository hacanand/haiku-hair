"use client";

import type { ButtonHTMLAttributes, CSSProperties } from "react";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRipple, RippleLayer } from "@/components/intake/ripple";

type Tone = "confirmed" | "missing" | "neutral";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  stagger?: number;
  icon?: "check" | "plus" | "none";
  /** Small round thumbnail shown before the label, e.g. a pattern illustration. */
  image?: string;
}

/** The visual chip capsule — confirmed (green fill), missing (dashed, muted),
 *  or neutral (plain, used while a chip is expanded for editing). Material
 *  "assist/filter chip" styling: full-round, tonal fill, ripple feedback. */
export function Pill({ tone = "neutral", stagger = 0, icon = "none", image, className, children, onPointerDown, ...props }: PillProps) {
  const { onPointerDown: ripplePointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      style={{ "--stagger": `${stagger * 150}ms` } as CSSProperties}
      onPointerDown={(e) => {
        ripplePointerDown(e);
        onPointerDown?.(e);
      }}
      className={cn(
        "animate-chip-in relative inline-flex min-h-9 items-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors select-none",
        image && "py-1 pl-1",
        tone === "confirmed" &&
          "border-transparent bg-success text-success-foreground hover:bg-success/90",
        tone === "missing" &&
          "border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground hover:border-muted-foreground/70 hover:text-foreground",
        tone === "neutral" &&
          "border-border bg-card text-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      <RippleLayer ripples={ripples} />
      {image && (
        <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-black/10">
          <Image src={image} alt="" fill className="object-cover" sizes="24px" />
        </span>
      )}
      {icon === "check" && <Check className="size-3.5 shrink-0" />}
      {icon === "plus" && <Plus className="size-3.5 shrink-0" />}
      {children}
    </button>
  );
}
