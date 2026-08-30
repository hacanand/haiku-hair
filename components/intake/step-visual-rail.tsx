"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StepVisualRailProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  progress?: { index: number; total: number };
}

/** Left-pane content on a laptop: brand mark, the step's own illustration
 *  shown large instead of cropped into a thumbnail, the editorial framing
 *  (category + title + subtitle), and a slim progress readout. */
export function StepVisualRail({ eyebrow, title, subtitle, image, progress }: StepVisualRailProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklch,var(--primary)_12%,var(--background)),var(--background)_65%)] p-10 xl:p-14">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="size-4" />
        GenoRoot Hair &amp; Scalp Clinic
      </div>

      <div className="flex flex-col gap-8 py-10">
        <div className="elevation-2 relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-muted">
          {image ? (
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 1280px) 460px, 380px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Sparkles className="size-16 text-primary/20" />
            </div>
          )}
        </div>
        <div>
          {eyebrow && <p className="text-sm font-semibold text-primary">{eyebrow}</p>}
          <h2 className="mt-2 text-3xl font-semibold text-balance xl:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 max-w-md text-balance text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {progress && (
        <div className="flex items-center gap-3">
          <Progress value={Math.round((progress.index / progress.total) * 100)} className="max-w-[220px]" />
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {progress.index} / {progress.total}
          </span>
        </div>
      )}
    </div>
  );
}
