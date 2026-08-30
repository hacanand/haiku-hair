"use client";

import { SkeletonImage } from "@/components/ui/skeleton-image";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeaker } from "@/hooks/use-speaker";
import { useIntakeStore } from "@/lib/store";
import { DesktopSplit } from "@/components/intake/desktop-split";
import { StepVisualRail } from "@/components/intake/step-visual-rail";

const WELCOME_TEXT =
  "Namaste! Main aapki thodi si madad karungi is intake form ko bharne mein, kabhi bol kar, kabhi bas tap karke. Bas do minute lagenge. Shuru karein?";

const TITLE = "Let's get you ready for your consultation.";
const SUBTITLE = "A few questions, mostly by talking — some just a tap. Your doctor will see everything before you walk in.";
const IMAGE = { src: "https://ucarecdn.com/3cf6bd0c-014a-499f-9987-d3006fb0732d/-/preview/", alt: "GenoRoot hair & scalp intake" };

export function WelcomeStep() {
  const goNext = useIntakeStore((s) => s.goNext);
  const speaker = useSpeaker("https://ucarecdn.com/a6922858-060e-41aa-b36b-c75b7fa54cd1/welcome.wav", WELCOME_TEXT);

  return (
    <DesktopSplit visual={<StepVisualRail title={TITLE} subtitle={SUBTITLE} image={IMAGE} />}>
      <div className="flex h-full w-full flex-col overflow-y-auto px-6 pt-8 pb-6 lg:justify-center lg:px-16 lg:py-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary lg:hidden">
          <Sparkles className="size-4" />
          GenoRoot Hair &amp; Scalp Clinic
        </div>

        <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-xs shrink-0 overflow-hidden rounded-[2rem] bg-muted lg:hidden">
          <SkeletonImage src={IMAGE.src} alt={IMAGE.alt} fill className="object-cover" sizes="90vw" preload />
        </div>

        <h1 className="mt-8 text-3xl font-semibold text-pretty lg:mt-0 lg:text-4xl">{TITLE}</h1>
        <p className="mt-3 text-pretty text-muted-foreground lg:mt-4 lg:text-lg">{SUBTITLE}</p>

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

        <div className="mt-auto pt-8 lg:mt-10 lg:max-w-sm lg:pt-0">
          <Button size="lg" className="h-14 w-full rounded-full text-base" onClick={goNext}>
            Start intake
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Takes about 2 minutes · No login needed</p>
        </div>
      </div>
    </DesktopSplit>
  );
}
