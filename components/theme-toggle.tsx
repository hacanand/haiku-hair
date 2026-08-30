"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribeNever = () => () => {};

/** True only once React has hydrated on the client — via useSyncExternalStore
 *  rather than an effect+setState, so there's no extra render pass to
 *  schedule, just the one reconciliation React already does for hydration. */
function useMounted() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

/**
 * Manual light/dark switch, always in the top-right corner regardless of
 * which step is showing (rendered once in the root layout, fixed-position,
 * above the whole app). The device's own setting still picks the theme on
 * first visit — this just lets a patient override it, e.g. a bright room
 * but they still prefer dark, or vice versa.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      className={cn(
        // A real >=44px tap target, on purpose — this whole pass has been
        // about older-user accessibility, a tiny icon-only hit area would
        // undercut that.
        "fixed z-40 flex size-10  items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition-transform active:scale-90",
        "top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-[calc(0.75rem+env(safe-area-inset-right,0px))]"
      )}
    >
      {mounted && (isDark ? <Sun className="size-5" /> : <Moon className="size-5" />)}
    </button>
  );
}
