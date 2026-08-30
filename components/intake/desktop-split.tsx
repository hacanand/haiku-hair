"use client";

import type { ReactNode } from "react";

/**
 * The laptop layout: instead of a side-by-side split, we now use a modern,
 * minimalistic centered layout on desktop. It acts as a full-bleed view on
 * mobile, and becomes a beautifully centered card on larger screens.
 */
export function DesktopSplit({ visual, children }: { visual?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col lg:flex-row bg-background">
      {/* Left pane: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:border-r lg:border-border/60">
        {visual}
      </div>
      {/* Right pane: Interactive Form */}
      <div className="flex min-h-0 w-full flex-1 flex-col lg:w-1/2 lg:items-center lg:justify-center">
        <div className="flex h-full w-full max-w-[640px] flex-col relative lg:h-[800px] lg:max-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
