"use client";

import type { ReactNode } from "react";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import { ArrowLeft } from "lucide-react";
import { useIntakeStore } from "@/lib/store";
import { progressFor, STEP_CATEGORY } from "@/lib/steps";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";
import { DesktopSplit } from "@/components/intake/desktop-split";
import { StepVisualRail } from "@/components/intake/step-visual-rail";

interface StepShellProps {
  /** Plain-language category shown above the title. Defaults to the current
   *  step's entry in STEP_CATEGORY — pass this only to override that (e.g.
   *  a per-row progress label), never to surface an internal id. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  children: ReactNode;
  footer: ReactNode;
  hideBack?: boolean;
  hideProgress?: boolean;
  /** Override the default "go to previous step" back action (e.g. a
   *  multi-row step wants Back to mean "previous row" first). */
  onBack?: () => void;
}

/** Consistent chrome for every step — same progress bar, same back button,
 *  same footer CTA position — only the middle content shape changes. On a
 *  phone this is the whole screen; on a laptop it's the right-hand column
 *  of a real two-pane layout (DesktopSplit), not a scaled-down mobile view. */
export function StepShell({ eyebrow, title, subtitle, image, children, footer, hideBack, hideProgress, onBack }: StepShellProps) {
  const step = useIntakeStore((s) => s.step);
  const answers = useIntakeStore((s) => s.answers);
  const storeGoBack = useIntakeStore((s) => s.goBack);
  const goBack = onBack ?? storeGoBack;
  const progress = progressFor(step, answers);
  const resolvedEyebrow = eyebrow ?? STEP_CATEGORY[step];

  return (
    <DesktopSplit
      visual={
        <StepVisualRail
          eyebrow={resolvedEyebrow}
          title={title}
          subtitle={subtitle}
          image={image}
          progress={hideProgress ? undefined : progress}
        />
      }
    >
      <div className="flex h-full w-full flex-col overflow-hidden">
        <header className="safe-top flex shrink-0 items-center gap-3 bg-background px-4 pt-4 pb-3 lg:px-8 lg:pt-8">
          {!hideBack ? (
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={goBack} aria-label="Go back">
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <div className="size-9 shrink-0" />
          )}
          <div className="flex-1 lg:hidden">
            {!hideProgress && (
              <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 elevation-1">
                <CircularProgress value={Math.round((progress.index / progress.total) * 100)} size={16} strokeWidth={2.5} />
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  {String(progress.index).padStart(2, '0')} / {String(progress.total).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 lg:px-8 lg:pt-2">
          {image && (
            <div className="relative mx-auto mb-4 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-muted lg:hidden">
              <SkeletonImage preload src={image.src} alt={image.alt} fill className="object-cover" sizes="100vw" />
            </div>
          )}
          <p className="text-sm font-semibold text-primary lg:hidden">{resolvedEyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold text-balance lg:hidden">{title}</h1>
          {subtitle && <p className="mt-2 text-balance text-muted-foreground lg:hidden">{subtitle}</p>}
          <div className="mt-5 animate-fade-up lg:mt-0">{children}</div>
        </main>

        <footer className="safe-bottom flex shrink-0 flex-col border-t border-border/60 bg-background px-5 py-4 lg:px-8 lg:py-6">
          {footer}
        </footer>
      </div>
    </DesktopSplit>
  );
}
