"use client";

import Image from "next/image";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeaker } from "@/hooks/use-speaker";
import { useIntakeStore } from "@/lib/store";

const WELCOME_TEXT =
  "Namaste! Main aapki thodi si madad karungi is intake form ko bharne mein, kabhi bol kar, kabhi bas tap karke. Bas do minute lagenge. Shuru karein?";

export function WelcomeStep() {
  const goNext = useIntakeStore((s) => s.goNext);
  const speaker = useSpeaker("/audio/welcome.wav", WELCOME_TEXT);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-6 pt-8 pb-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="size-4" />
        GenoRoot Hair &amp; Scalp Clinic
      </div>

      <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-xs shrink-0 overflow-hidden rounded-[2rem] bg-muted">
        <Image
          src="/images/receding-hairline.png"
          alt="GenoRoot hair & scalp intake"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 380px, 90vw"
          priority
        />
      </div>

      <h1 className="mt-8 text-3xl font-semibold text-balance">Let&apos;s get you ready for your consultation.</h1>
      <p className="mt-3 text-balance text-muted-foreground">
        A few questions, mostly by talking — some just a tap. Your doctor will see everything before you walk in.
      </p>

      <button
        type="button"
        onClick={() => (speaker.isPlaying ? speaker.stop() : speaker.play())}
        className="mt-6 flex items-center gap-3 self-start rounded-full border border-border bg-card py-2 pr-4 pl-2.5 text-sm font-medium"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          {speaker.isPlaying ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </span>
        {speaker.isPlaying ? "Playing…" : "Hear how it works"}
      </button>

      <div className="mt-auto pt-8">
        <Button size="lg" className="h-14 w-full rounded-full text-base" onClick={goNext}>
          Start intake
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Takes about 2 minutes · No login needed</p>
      </div>
    </div>
  );
}
