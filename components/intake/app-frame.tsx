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
 * whitespace. This component's only job now is the portal containment
 * trick: `[contain:layout]` makes it the containing block for any
 * `position: fixed` descendant portalled into it (a bottom sheet's backdrop
 * and popup), which the sheet's own lg: width rules use to center itself
 * instead of spanning the full browser width on a wide screen.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setNode} className="relative isolate h-dvh w-full overflow-hidden bg-background [contain:layout]">
      <FrameContainerContext.Provider value={node}>{children}</FrameContainerContext.Provider>
    </div>
  );
}
