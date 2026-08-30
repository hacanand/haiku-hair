"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { OptionImage } from "@/components/intake/option-image";
import { useRipple, RippleLayer } from "@/components/intake/ripple";
import { cn } from "@/lib/utils";
import { useFrameContainer } from "@/components/intake/app-frame";

interface MultiSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  options: readonly string[];
  optionImages?: Record<string, string>;
  selected: string[];
  onConfirm: (next: string[]) => void;
}

/** The bottom-sheet editor for multi-select chips with 5+ options — "add
 *  another" without cramping the confirm card. Never a full-screen modal.
 *  Renders a side-by-side image-tile grid when the options carry
 *  illustrations (so photos actually read at size), otherwise a plain
 *  checklist. */
export function MultiSelectSheet({
  open,
  onOpenChange,
  title,
  description,
  options,
  optionImages,
  selected,
  onConfirm,
}: MultiSelectSheetProps) {
  const container = useFrameContainer();
  const [draft, setDraft] = useState<string[]>(selected);
  // Reset the draft whenever the sheet transitions from closed to open —
  // adjusted during render (React's recommended pattern) rather than in an
  // effect, so it can't cause an extra render pass.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(selected);
  }

  function toggle(option: string) {
    setDraft((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
  }

  const hasImages = !!optionImages;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent
        container={container}
        className="max-h-[85%] lg:inset-x-auto lg:left-[50%] lg:right-0 lg:w-full lg:max-w-lg lg:mx-auto"
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className={cn("overflow-y-auto px-4 py-3", hasImages ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2")}>
          {options.map((option) =>
            hasImages ? (
              <ImageTile key={option} option={option} image={optionImages?.[option]} checked={draft.includes(option)} onToggle={() => toggle(option)} />
            ) : (
              <ListRow key={option} option={option} checked={draft.includes(option)} onToggle={() => toggle(option)} />
            )
          )}
        </div>
        <DrawerFooter>
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base"
            onClick={() => {
              onConfirm(draft);
              onOpenChange(false);
            }}
          >
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ImageTile({ option, image, checked, onToggle }: { option: string; image?: string; checked: boolean; onToggle: () => void }) {
  const { onPointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onClick={onToggle}
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-colors",
        checked ? "border-primary elevation-1" : "border-border hover:border-primary/40"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <OptionImage src={image} alt={option} sizes="(min-width: 1024px) 190px, 45vw" />
        <RippleLayer ripples={ripples} />
        <span
          className={cn(
            "absolute top-2 right-2 flex size-6 items-center justify-center rounded-full border-2 transition-colors",
            checked ? "border-primary bg-primary text-primary-foreground" : "border-white/80 bg-black/20 backdrop-blur-sm"
          )}
        >
          {checked && <Check className="size-3.5" />}
        </span>
      </div>
      <span className="px-2.5 py-2 text-xs font-medium">{option}</span>
    </button>
  );
}

function ListRow({ option, checked, onToggle }: { option: string; checked: boolean; onToggle: () => void }) {
  const { onPointerDown, ripples } = useRipple();
  return (
    <button
      type="button"
      onClick={onToggle}
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex min-h-12 items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        checked ? "border-primary/30 bg-secondary text-secondary-foreground" : "border-border bg-card hover:bg-muted"
      )}
    >
      <RippleLayer ripples={ripples} />
      {option}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        )}
      >
        {checked && <Check className="size-3.5" />}
      </span>
    </button>
  );
}
