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
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: { src: string; alt: string };
  /** Content pinned right below the title, above the scrollable area — for
   *  controls the patient must keep seeing (e.g. a Yes/No they already
   *  tapped) while a longer revealed detail below them scrolls. Without
   *  this, tapping Yes on a tall card could scroll the very buttons they
   *  just used — and the question itself — out of view entirely. */
  pinned?: ReactNode;
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
export function StepShell({ eyebrow, title, subtitle, image, pinned, children, footer, hideBack, hideProgress, onBack }: StepShellProps) {
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
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        {!hideProgress && progress && (
          <div className="absolute left-0 top-0 z-50 h-[3px] w-full bg-primary/10 lg:hidden">
            <div
              className="h-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${(progress.index / progress.total) * 100}%` }}
            />
          </div>
        )}
        <header className="safe-top flex shrink-0 items-center justify-between bg-background px-4 pt-4 pb-3 lg:px-8 lg:pt-8">
          {!hideBack ? (
            <Button
              variant="ghost"
              size="icon"
              // Same treatment as the theme toggle: a real 44px target with
              // a visible border/shadow instead of a bare ghost icon that
              // has no boundary until hover — for the same reason (older
              // eyes, a thumb that isn't always precise) that mattered there.
              className="size-10 mt-2.5 shrink-0 rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur active:scale-90"
              onClick={goBack}
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <div className="size-11 shrink-0" />
          )}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 lg:px-8 lg:pt-2">
          {image && (
            <div className="relative mx-auto mb-4 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-muted lg:hidden">
              <SkeletonImage preload src={image.src} alt={image.alt} fill className="object-cover" sizes="100vw" />
            </div>
          )}
          <div className="sticky top-0 z-10 -mx-5 bg-background px-5 pb-3 pt-2 lg:hidden">
            <p className="text-sm font-semibold text-primary">{resolvedEyebrow}</p>
            <h1 className="mt-1 text-2xl font-semibold text-balance">{title}</h1>
            {subtitle && <p className="mt-2 text-balance text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="mt-5 animate-fade-up lg:mt-0">{children}</div>
        </main>

        <footer className="safe-bottom flex shrink-0 flex-col border-t border-border/60 bg-background px-5 py-4 lg:px-8 lg:py-6">
          {footer}
        </footer>
      </div>
    </DesktopSplit>
  );
}
