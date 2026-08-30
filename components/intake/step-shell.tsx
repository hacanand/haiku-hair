"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useIntakeStore } from "@/lib/store";
import { progressFor, STEP_CATEGORY } from "@/lib/steps";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
 *  same footer CTA position — only the middle content shape changes. Fills
 *  whatever frame it's given (the phone viewport, or AppFrame's device card
 *  on a wider screen) rather than sizing itself. */
export function StepShell({ eyebrow, title, subtitle, image, children, footer, hideBack, hideProgress, onBack }: StepShellProps) {
  const step = useIntakeStore((s) => s.step);
  const answers = useIntakeStore((s) => s.answers);
  const storeGoBack = useIntakeStore((s) => s.goBack);
  const goBack = onBack ?? storeGoBack;
  const { index, total } = progressFor(step, answers);
  const resolvedEyebrow = eyebrow ?? STEP_CATEGORY[step];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="safe-top flex shrink-0 items-center gap-3 bg-background px-4 pt-4 pb-3">
        {!hideBack ? (
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={goBack} aria-label="Go back">
            <ArrowLeft className="size-5" />
          </Button>
        ) : (
          <div className="size-9 shrink-0" />
        )}
        <div className="flex-1">
          {!hideProgress && (
            <>
              <Progress value={Math.round((index / total) * 100)} />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Step {index} of {total}
              </p>
            </>
          )}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        {image && (
          <div className="relative mx-auto mb-4 aspect-[16/10] w-full overflow-hidden rounded-3xl bg-muted">
            {/* object-contain, not object-cover: several source illustrations
                are portrait-oriented with soft glow/vignette detail right at
                their edges — cropping to fill a landscape box sliced through
                those and left stray light patches. Showing the whole
                illustration, letterboxed, can never do that. */}
            <Image src={image.src} alt={image.alt} fill className="object-contain p-2" sizes="(min-width: 1024px) 430px, 100vw" />
          </div>
        )}
        {resolvedEyebrow && <p className="text-sm font-semibold text-primary">{resolvedEyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold text-balance">{title}</h1>
        {subtitle && <p className="mt-2 text-balance text-muted-foreground">{subtitle}</p>}
        <div className="mt-5 animate-fade-up">{children}</div>
      </main>

      <footer className="safe-bottom flex shrink-0 flex-col border-t border-border/60 bg-background px-5 py-4">
        {footer}
      </footer>
    </div>
  );
}
