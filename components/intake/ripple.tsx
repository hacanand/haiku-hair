"use client";

import { useCallback, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

/** Material's signature tap feedback — a ring that expands from the exact
 *  point pressed and fades out. Pair with `<RippleLayer>` inside a
 *  `relative overflow-hidden` element. */
export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const id = Date.now() + Math.random();
    const item: RippleItem = {
      id,
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples((prev) => [...prev, item]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 550);
  }, []);

  return { onPointerDown, ripples };
}

/** A plain `<button>` with ripple wired in and `relative overflow-hidden`
 *  already applied — drop-in for one-off option buttons. */
export function RippleButton({ className, children, onPointerDown, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onPointerDown: ripplePointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        ripplePointerDown(e);
        onPointerDown?.(e);
      }}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <RippleLayer ripples={ripples} />
      {children}
    </button>
  );
}

export function RippleLayer({ ripples }: { ripples: RippleItem[] }) {
  if (ripples.length === 0) return null;
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="animate-ripple absolute rounded-full bg-current"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </span>
  );
}
