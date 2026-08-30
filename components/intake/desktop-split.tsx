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
      {/* Right pane: Interactive Form */}
      <div className="flex w-full flex-col lg:min-h-0 lg:w-1/2 lg:flex-1 lg:items-center lg:justify-center">
        <div className="flex w-full flex-col relative lg:h-[800px] lg:max-h-full lg:max-w-[640px]">
          {children}
        </div>
      </div>
    </div>
  );
}
