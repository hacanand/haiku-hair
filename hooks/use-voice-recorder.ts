"use client";

import { useCallback, useRef, useState } from "react";

export type RecorderStatus = "idle" | "requesting" | "recording" | "denied" | "unsupported";

const MAX_RECORDING_MS = 60_000;
const BAR_COUNT = 5;
const IDLE_LEVELS = Array(BAR_COUNT).fill(0.08);

function pickMimeType(): string | undefined {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported?.(type)) return type;
  }
  return undefined;
}

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  // Per-bar amplitude (0..1) sampled from the live mic input — drives the
  // waveform visualization while recording.
  const [levels, setLevels] = useState<number[]>(IDLE_LEVELS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const resolveRef = useRef<((blob: Blob) => void) | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopLevelMeter = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevels(IDLE_LEVELS);
  }, []);

  const startLevelMeter = useCallback((stream: MediaStream) => {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctx.resume().catch(() => {});
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    audioCtxRef.current = ctx;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const binsPerBar = Math.max(1, Math.floor(data.length / BAR_COUNT));
    let lastSample = 0;

    const tick = (now: number) => {
      // ~20fps is plenty smooth for a handful of bars (the CSS transition
      // does the rest) and cuts render pressure vs. sampling every frame.
      if (now - lastSample >= 50) {
        lastSample = now;
        analyser.getByteFrequencyData(data);
        const next: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < binsPerBar; j++) sum += data[i * binsPerBar + j] ?? 0;
          const avg = sum / binsPerBar / 255;
          next.push(Math.max(0.08, Math.min(1, avg * 1.7)));
        }
        setLevels(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopLevelMeter();
  }, [stopLevelMeter]);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType ?? "audio/webm" });
        cleanupStream();
        resolveRef.current?.(blob);
        resolveRef.current = null;
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      startLevelMeter(stream);
      startedAtRef.current = Date.now();
      setElapsedMs(0);
      setStatus("recording");
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAtRef.current;
        setElapsedMs(elapsed);
        if (elapsed >= MAX_RECORDING_MS) {
          mediaRecorderRef.current?.stop();
        }
      }, 200);
    } catch {
      setStatus("denied");
    }
  }, [cleanupStream, startLevelMeter]);

  const stop = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(new Blob());
        return;
      }
      resolveRef.current = resolve;
      recorder.stop();
      setStatus("idle");
    });
  }, []);

  const cancel = useCallback(() => {
    mediaRecorderRef.current?.stop();
    cleanupStream();
    setStatus("idle");
  }, [cleanupStream]);

  return { status, elapsedMs, levels, start, stop, cancel };
}
