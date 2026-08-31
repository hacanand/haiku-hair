"use client";

import type { ReactNode } from "react";

/**
 * The laptop layout: instead of a side-by-side split, we now use a modern,
 * minimalistic centered layout on desktop. It acts as a full-bleed view on
 * mobile, and becomes a beautifully centered card on larger screens.
 */
export function DesktopSplit({ visual, children }: { visual?: ReactNode; children: ReactNode }) {
  return (
    // h-dvh/overflow are lg-only on purpose — below lg the page must be
    // free to grow with its content and let the browser itself scroll it
    // (see AppFrame); capping height here would silently re-impose the
    // exact fixed-viewport constraint that change is meant to remove.
    <div className="flex w-full flex-col bg-background lg:h-dvh lg:flex-row">
      {/* Left pane: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:border-r lg:border-border/60">
        {visual}
      </div>
      {/* Right pane: Interactive Form.
          This div's job is only to give StepShell a genuinely bounded
          height (lg:h-full, definite — matching the row's lg:h-dvh) to
          work with. StepShell's own header/footer are already built as
          lg:shrink-0 (pinned) with lg:flex-1 lg:overflow-y-auto on its
          `main` in between — that's the correct "back button and Continue
          always stay put, only the middle scrolls" structure, but it can
          only activate against a real bounded-height ancestor. The earlier
          version here made the *whole card* (header, content and footer
          together) the scrolling unit instead, on an auto-height box — that
          fixed the dead-space bug from before it, but cost exactly the
          pinning this one restores: the back button scrolled up out of
          view with the rest, and Continue needed a scroll to reach even
          right after tapping a selection. Centering short content so it
          doesn't look stranded is now StepShell's job, inside `main`. */}
      <div className="flex w-full flex-col lg:h-full lg:w-1/2 lg:items-center lg:overflow-hidden lg:p-10">
        <div className="flex w-full flex-col lg:h-full lg:max-w-[640px]">{children}</div>
      </div>
    </div>
  );
}
