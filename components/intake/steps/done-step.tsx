"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeaker } from "@/hooks/use-speaker";
import { useIntakeStore } from "@/lib/store";

const DONE_TEXT = "Bahut badhiya! Aapki saari details doctor ke paas pahunch gayi hain. Consultation mein milte hain!";

export function DoneStep() {
  const reset = useIntakeStore((s) => s.reset);
  const speaker = useSpeaker("/audio/done.wav", DONE_TEXT);

  useEffect(() => {
    speaker.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-success text-success-foreground">
        <PartyPopper className="size-9" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-balance">Aapka intake ho gaya!</h1>
      <p className="mt-3 max-w-sm text-balance text-muted-foreground">
        Your doctor will have your complete history before you sit down — no repeating yourself in the room.
      </p>
      <Button variant="outline" className="mt-8 h-11 rounded-full" onClick={reset}>
        Start a new patient
      </Button>
    </div>
  );
}
