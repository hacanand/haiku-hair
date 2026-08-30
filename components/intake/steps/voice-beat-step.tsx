"use client";

import { useEffect, useState } from "react";
import { Mic, Square, Volume2, VolumeX, Keyboard, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { StepShell } from "@/components/intake/step-shell";
import { AssistantBubble, PatientBubble, TypingBubble } from "@/components/intake/chat-bubble";
import { ExtractedField } from "@/components/intake/extracted-field";
import { PastTreatmentChip } from "@/components/intake/past-treatment-chip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useSpeaker } from "@/hooks/use-speaker";
import { useIntakeStore } from "@/lib/store";
import type { Beat } from "@/lib/beats";
import type { HabitsAnswers, IntakeState } from "@/lib/schema";

// Recording itself isn't tracked here — it's derived from recorder.status,
// which is the actual source of truth for the mic's async permission/record
// lifecycle. Keeping a second "recording" phase in sync with that by hand
// was the bug: the mic button only ever updated recorder.status, so the UI
// (gated on `phase`) never moved off "prompt".
type Phase = "prompt" | "processing" | "confirm";

/** Scrolls a newly-mounted element into view once, the first time it
 *  appears — same pattern as the products/procedures reveal card. Without
 *  it, the copilot's reply (or even the "thinking" indicator) can land
 *  below the fold and the patient never notices it arrived. */
function scrollIntoViewOnce(el: HTMLElement | null) {
  if (el && !el.dataset.scrolled) {
    el.dataset.scrolled = "true";
    setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }
}

function formatElapsed(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const HABIT_KEYS = new Set<keyof HabitsAnswers>([
  "smoking",
  "smoking_severity",
  "alcohol",
  "hard_water",
  "hair_wash_frequency",
  "heating_tools_styling_chemicals",
  "salon_treatments",
  "salon_treatment_detail",
]);

export function VoiceBeatStep({ beat }: { beat: Beat }) {
  const alreadyVisited = useIntakeStore((s) => s.visitedBeats[beat.id]);
  const [phase, setPhase] = useState<Phase>(alreadyVisited ? "confirm" : "prompt");
  const [transcript, setTranscript] = useState("");
  const [manualTypedMode, setManualTypedMode] = useState(false);
  const [typedText, setTypedText] = useState("");
  // First Continue tap with something unfilled just nudges — it doesn't
  // trap the patient if a field genuinely can't be answered.
  const [continueWarned, setContinueWarned] = useState(false);

  const recorder = useVoiceRecorder();
  const micUnavailable = recorder.status === "unsupported" || recorder.status === "denied";
  const typedMode = manualTypedMode || micUnavailable;
  const speaker = useSpeaker(beat.audioSrc, beat.promptText);
  const answers = useIntakeStore((s) => s.answers);
  const applyBeatResult = useIntakeStore((s) => s.applyBeatResult);
  const setField = useIntakeStore((s) => s.setField);
  const setHabitField = useIntakeStore((s) => s.setHabitField);
  const goNext = useIntakeStore((s) => s.goNext);

  // Best-effort autoplay of the prompt on mount; browsers that block it just
  // leave the speaker button ready to tap.
  useEffect(() => {
    if (!alreadyVisited) speaker.play();
    return () => speaker.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat.id]);

  function getValue(key: string): unknown {
    if (HABIT_KEYS.has(key as keyof HabitsAnswers)) return answers.habits[key as keyof HabitsAnswers];
    return answers[key as keyof IntakeState];
  }
  function setValue(key: string, value: unknown) {
    if (HABIT_KEYS.has(key as keyof HabitsAnswers)) {
      setHabitField(key as keyof HabitsAnswers, value as HabitsAnswers[keyof HabitsAnswers]);
    } else {
      setField(key as keyof IntakeState, value as never);
    }
  }

  async function runExtraction(text: string) {
    setTranscript(text);
    setPhase("processing");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId: beat.id, transcript: text }),
      });
      if (!res.ok) throw new Error("extract failed");
      const { result } = await res.json();
      applyBeatResult(beat, result);
      setPhase("confirm");
    } catch {
      toast.error("Samajh nahi paaye — please try again ya type kar dein.");
      setPhase("prompt");
    }
  }

  async function handleStopRecording() {
    setPhase("processing");
    const blob = await recorder.stop();
    if (blob.size === 0) {
      setPhase("prompt");
      return;
    }
    try {
      const form = new FormData();
      form.append("audio", blob, "answer.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) throw new Error("transcribe failed");
      const { text } = await res.json();
      if (!text?.trim()) {
        toast.error("Kuch sunai nahi diya, dobara try karein.");
        setPhase("prompt");
        return;
      }
      await runExtraction(text);
    } catch {
      toast.error("Kuch gadbad ho gayi, please try again.");
      setPhase("prompt");
    }
  }

  function tryAgain() {
    setPhase("prompt");
    setTypedText("");
    setTranscript("");
  }

  const isBeatD = beat.id === "D";
  const visibleFields = beat.fields.filter((f) => !f.followupOf || getValue(f.followupOf.key) === f.followupOf.equals);
  const canContinue = phase === "confirm";

  function missingLabels(): string[] {
    if (isBeatD) return answers.past_treatment_side_effects == null ? ["Past treatment response"] : [];
    return visibleFields
      .filter((f) => {
        const v = getValue(f.key);
        if (f.kind === "multi") return !f.allowEmpty && ((v as string[] | null) ?? []).length === 0;
        return v == null;
      })
      .map((f) => f.label);
  }

  function handleContinue() {
    const missing = missingLabels();
    if (missing.length > 0 && !continueWarned) {
      setContinueWarned(true);
      toast.warning(`Kuch details baaki hain: ${missing.join(", ")}`, {
        description: "Tap the dashed chip above to fill it in — or tap Continue again to move on anyway.",
      });
      return;
    }
    goNext();
  }

  return (
    <StepShell
      title={beat.title}
      image={beat.heroImage ? { src: beat.heroImage, alt: beat.title } : undefined}
      footer={
        <Button size="lg" disabled={!canContinue} className="h-14 w-full rounded-full text-base" onClick={handleContinue}>
          Continue
        </Button>
      }
    >
      {/* The thread: copilot asks, patient answers, chips confirm — reads as
          one conversation instead of a form with a mic bolted on. */}
      <div className="flex flex-col gap-3">
        <AssistantBubble>
          <p className="text-balance">{beat.promptText}</p>
          <button
            type="button"
            onClick={() => (speaker.isPlaying ? speaker.stop() : speaker.play())}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary"
          >
            {speaker.isPlaying ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
            {speaker.isPlaying ? "Playing…" : "Play again"}
          </button>
        </AssistantBubble>

        {phase === "processing" && (
          <div ref={scrollIntoViewOnce}>
            <TypingBubble />
          </div>
        )}

        {phase === "confirm" && (
          <>
            {transcript && <PatientBubble>{transcript}</PatientBubble>}
            <div
              ref={scrollIntoViewOnce}
              className="ml-10 mt-2 flex flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl animate-fade-up"
            >
              <div className="bg-primary/5 px-5 py-4">
                <p className="text-sm font-semibold text-primary">Here is what I gathered:</p>
              </div>
              <div className="flex flex-col divide-y divide-border/50">
                {isBeatD ? (
                  <PastTreatmentChip
                    status={answers.past_treatment_side_effects}
                    describe={answers.describe}
                    onChange={(status, describe) => {
                      setField("past_treatment_side_effects", status);
                      setField("describe", describe);
                    }}
                  />
                ) : (
                  visibleFields.map((field, i) => (
                    <ExtractedField
                      key={field.key}
                      field={field}
                      value={getValue(field.key)}
                      onChange={(v) => setValue(field.key, v)}
                      stagger={i}
                      nested={!!field.followupOf}
                    />
                  ))
                )}
              </div>
            </div>
            <button
              className="ml-10 mt-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              onClick={tryAgain}
            >
              <RotateCcw className="size-3.5" /> Didn&apos;t sound right? Try again
            </button>
          </>
        )}
      </div>

      {/* Input area — mic composer or typed fallback. Hidden once answered
          (and once processing — the typing bubble above covers that beat). */}
      {phase === "prompt" && (
        <div className="mt-4">
          {!typedMode ? (
            <div className="flex flex-col items-center gap-3 py-4">
              {recorder.status === "recording" ? (
                <>
                  <div className="flex h-14 items-end gap-2" aria-hidden="true">
                    {recorder.levels.map((level, i) => (
                      <span
                        key={i}
                        className="w-2.5 rounded-full bg-destructive transition-[height] duration-100 ease-out"
                        style={{ height: `${12 + level * 44}px` }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleStopRecording}
                    className="animate-mic-pulse relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-destructive text-white shadow-lg transition-transform active:scale-95"
                    aria-label="Stop recording"
                  >
                    <Square className="size-7" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (speaker.isPlaying) speaker.stop();
                    recorder.start();
                  }}
                  disabled={recorder.status === "requesting"}
                  className="elevation-3 flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
                  aria-label="Start recording"
                >
                  {recorder.status === "requesting" ? (
                    <span className="size-6 animate-spin rounded-full border-[3px] border-primary-foreground border-t-transparent" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </button>
              )}
              <p className="text-sm text-muted-foreground tabular-nums">
                {recorder.status === "requesting" && "Mic ki permission dijiye…"}
                {recorder.status === "recording" && `Sun rahe hain… ${formatElapsed(recorder.elapsedMs)} · tap to stop`}
                {recorder.status === "idle" && "Tap to speak"}
              </p>
              {recorder.status === "idle" && (
                <button
                  className="flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4"
                  onClick={() => setManualTypedMode(true)}
                >
                  <Keyboard className="size-4" /> Type instead
                </button>
              )}
            </div>
          ) : (
            <div className="elevation-1 flex flex-col gap-2 rounded-3xl border border-border bg-card p-2">
              <Textarea
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Yahan type kijiye…"
                rows={3}
                className="resize-none rounded-2xl border-0 bg-transparent shadow-none focus-visible:ring-0"
                autoFocus
              />
              <div className="flex items-center justify-between px-1.5 pb-1">
                {!micUnavailable ? (
                  <button
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline underline-offset-4"
                    onClick={() => setManualTypedMode(false)}
                  >
                    <Mic className="size-3.5" /> Mic try karein
                  </button>
                ) : (
                  <span />
                )}
                <Button
                  size="icon"
                  className="rounded-full"
                  disabled={!typedText.trim()}
                  onClick={() => runExtraction(typedText)}
                  aria-label="Send"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </StepShell>
  );
}
