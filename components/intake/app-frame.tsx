"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const FrameContainerContext = createContext<HTMLDivElement | null>(null);

/** The "device" element every sheet/drawer should portal into, so a bottom
 *  sheet clips to the same width as the chat column instead of spanning the
 *  full browser viewport on a wide screen. */
export function useFrameContainer() {
  return useContext(FrameContainerContext);
}

/**
 * Below `lg` (1024px) — every phone, in portrait or landscape, and every
 * tablet — this is invisible and fully fluid: the frame just *is* the
 * viewport, full-bleed, no fixed width or height. Only at genuine
 * laptop/desktop widths does the intake render as a deliberate,
 * self-contained "device" panel on an ambient background, instead of either
 * stretching a phone layout edge-to-edge or stranding it in whitespace.
 *
 * `[contain:layout]` on the card is what makes this work for overlays: it
 * makes the card the containing block for any `position: fixed` descendant
 * portalled into it (see useFrameContainer), so a bottom sheet's backdrop
 * and popup clip to the card's bounds instead of the whole browser window.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  return (
    <div className="min-h-dvh w-full bg-background lg:flex lg:items-center lg:justify-center lg:bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_10%,var(--background)),var(--background)_60%)] lg:p-8">
      <div
        ref={setNode}
        className="relative isolate mx-auto flex h-dvh w-full flex-col overflow-hidden bg-background [contain:layout] lg:h-[min(880px,calc(100dvh-4rem))] lg:max-w-[430px] lg:rounded-[2.75rem] lg:border lg:border-border lg:shadow-2xl lg:shadow-black/10"
      >
        <FrameContainerContext.Provider value={node}>{children}</FrameContainerContext.Provider>
      </div>
    </div>
  );
}
