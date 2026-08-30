"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeaker } from "@/hooks/use-speaker";
import { useIntakeStore } from "@/lib/store";

const DONE_TEXT = "Bahut badhiya! Aapki saari details doctor ke paas pahunch gayi hain. Consultation mein milte hain!";

export function DoneStep() {
  const reset = useIntakeStore((s) => s.reset);
  const speaker = useSpeaker("https://ucarecdn.com/00266f11-ad55-472b-b793-0446fb53e5fd/done.wav", DONE_TEXT);

  useEffect(() => {
    speaker.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--success)_10%,var(--background)),var(--background)_65%)] px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-success text-success-foreground lg:size-24">
        <PartyPopper className="size-9 lg:size-11" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-balance lg:mt-8 lg:text-5xl">Aapka intake ho gaya!</h1>
      <p className="mt-3 max-w-sm text-balance text-muted-foreground lg:mt-4 lg:max-w-lg lg:text-lg">
        Your doctor will have your complete history before you sit down — no repeating yourself in the room.
      </p>
      <Button variant="outline" className="mt-8 h-11 rounded-full lg:h-12 lg:px-6 lg:text-base" onClick={reset}>
        Start a new patient
      </Button>
    </div>
  );
}
