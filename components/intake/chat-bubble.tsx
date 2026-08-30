"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** The copilot's own little avatar — reused from the welcome screen's
 *  sparkle mark so the "voice copilot" reads as one consistent persona. */
export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
        className
      )}
    >
      <Sparkles className="size-4" />
    </span>
  );
}

/** Left-aligned message bubble, copilot's side of the thread. */
export function AssistantBubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex items-end gap-2">
      <AssistantAvatar />
      <div
        className={cn(
          "elevation-1 max-w-[82%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-foreground",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Right-aligned message bubble, the patient's side of the thread. */
export function PatientBubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "elevation-1 max-w-[82%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** The "copilot is thinking" indicator — same bubble shape as an assistant
 *  message, three softly bouncing dots instead of text. */
export function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <AssistantAvatar />
      <div className="elevation-1 flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted px-4 py-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-typing-dot size-2 rounded-full bg-muted-foreground/50"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
