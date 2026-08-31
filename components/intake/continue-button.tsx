"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContinueButtonProps {
  incomplete?: boolean;
  onContinue: () => void;
  label?: string;
  /** Shown as a gentle toast when tapped before the question is answered. */
  nudgeMessage: string;
}

/**
 * The footer CTA every step ends with. Deliberately never uses the native
 * `disabled` attribute for the "not answered yet" state — a truly disabled
 * button swallows the click entirely, so tapping it does *nothing visible*,
 * which for a patient who doesn't realize they've missed a tap reads as the
 * app being broken. Staying tappable and nudging with a toast instead (the
 * pattern the product/procedure table already used) turns a silent dead end
 * into a clear "here's what's left" — same fix as the auto-scroll-into-view
 * one, just for the moment *before* an answer instead of after it.
 */
export function ContinueButton({ incomplete, onContinue, label = "Continue", nudgeMessage }: ContinueButtonProps) {
  return (
    <Button
      size="lg"
      className={cn("h-14 w-full rounded-full text-base transition-opacity", incomplete && "opacity-50")}
      onClick={() => {
        if (incomplete) {
          toast.warning(nudgeMessage);
          return;
        }
        onContinue();
      }}
    >
      {label}
    </Button>
  );
}
