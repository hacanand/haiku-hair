"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const FrameContainerContext = createContext<HTMLDivElement | null>(null);

/** The element every sheet/drawer should portal into — see the `[contain:layout]`
 *  note below for why that matters. */
export function useFrameContainer() {
  return useContext(FrameContainerContext);
}

/**
 * Full-bleed at every size — a phone gets the whole viewport; a laptop gets
 * the whole viewport too, laid out as a real two-pane screen by
 * DesktopSplit/StepShell rather than a shrunk mobile card floating in
 * whitespace.
 *
 * Below `lg`, this is deliberately *not* height-capped or `overflow-hidden`
 * — the page grows with its content and the browser itself scrolls it.
 * That's what lets the mobile browser's own chrome (address bar) collapse
 * on scroll, which it never does for scrolling confined to an inner div —
 * StepShell's header/footer switch to `position: fixed` on mobile to stay
 * pinned without that wrapper. `[contain:layout]` (desktop only) is the
 * portal containment trick: it makes this the containing block for any
 * `position: fixed` descendant portalled into it (a bottom sheet's backdrop
 * and popup), which the sheet's own lg: width rules use to center itself
 * instead of spanning the full browser width on a wide screen — mobile
 * doesn't need it since a full-width sheet there is already correct.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setNode} className="relative isolate w-full min-h-dvh bg-background lg:h-dvh lg:overflow-hidden lg:[contain:layout]">
      <FrameContainerContext.Provider value={node}>{children}</FrameContainerContext.Provider>
    </div>
  );
}
