"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TERM_DEFINITIONS: Record<string, string> = {
  "topical minoxidil": "A medication applied directly to the scalp to stimulate hair follicles.",
  "oral minoxidil": "A prescription pill originally for blood pressure, now used at low doses for hair loss.",
  "finasteride or dutasteride": "Prescription medications that block DHT, a hormone linked to male pattern hair loss.",
  "spironolactone": "A medication often prescribed to women to treat hormonal hair loss.",
  "prp, gfc, or iprf therapy": "Advanced treatments that use growth factors from your own blood to stimulate hair follicles.",
  "stem cell or exosome therapy": "Cutting-edge treatments that use regenerative cells or their signals to repair and grow hair.",
  "low-level laser therapy": "A non-invasive treatment using red light to stimulate hair follicles.",
  "hair transplant": "A surgical procedure moving hair follicles from a donor site to a bald or thinning area.",
  "pcos (polycystic ovary syndrome)": "A hormonal disorder that can increase androgen levels, often leading to hair thinning.",
  "thyroid issues": "Underactive or overactive thyroid glands can disrupt the hair growth cycle and cause shedding.",
  "anemia or iron deficiency": "A lack of iron limits oxygen delivery to cells, which can weaken hair follicles.",
  "vitamin b12 or d deficiency": "Low levels of these essential vitamins can slow down cell turnover and hair growth.",
  "autoimmune disorder": "Conditions where the immune system attacks healthy cells, sometimes affecting hair follicles (e.g. alopecia areata)."
};

export function TermTooltip({ term }: { term: string }) {
  const definition = TERM_DEFINITIONS[term.toLowerCase()];
  // Hover alone (the library's default trigger) doesn't exist on a
  // touchscreen, so on mobile these never opened at all. Controlling
  // open/onOpenChange lets a tap toggle it too — the library still handles
  // outside-tap/hover/escape dismissal on top of that.
  // (Hook must run before the early return below — rules of hooks.)
  const [open, setOpen] = useState(false);
  if (!definition) return <>{term}</>;

  return (
    <TooltipProvider delay={200}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          className="cursor-help font-semibold text-primary underline decoration-primary/40 decoration-dashed underline-offset-4 transition-colors hover:decoration-primary"
          onClick={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
          }}
        >
          {term}
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-[250px] text-pretty bg-foreground text-background p-3 rounded-xl shadow-lg">
          <p className="text-sm font-medium">{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function highlightTerms(text: string) {
  // A simple function that searches for known terms and wraps them in TermTooltip.
  // We sort by length descending to match longest phrases first
  const terms = Object.keys(TERM_DEFINITIONS).sort((a, b) => b.length - a.length);
  
  let parts: React.ReactNode[] = [text];
  
  terms.forEach(term => {
    const newParts: React.ReactNode[] = [];
    const regex = new RegExp(`(${term})`, "gi");
    
    parts.forEach(part => {
      if (typeof part === "string") {
        const split = part.split(regex);
        split.forEach((segment, i) => {
          if (segment.toLowerCase() === term) {
            newParts.push(<TermTooltip key={`${term}-${i}`} term={segment} />);
          } else if (segment) {
            newParts.push(segment);
          }
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });
  
  return <>{parts}</>;
}
