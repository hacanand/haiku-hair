"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays a pre-rendered Groq TTS clip (instant, zero runtime API latency).
 * Falls back to the browser's built-in SpeechSynthesis if the audio file
 * can't load, so the copilot still speaks even offline-ish or on a stale
 * deploy missing an asset.
 */
export function useSpeaker(src: string, text: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("pause", onEnd);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("pause", onEnd);
    };
  }, [src]);

  const speakFallback = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("hi"));
    if (hindiVoice) utterance.voice = hindiVoice;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, [text]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setIsPlaying(true);
      await audio.play();
    } catch {
      speakFallback();
    }
  }, [speakFallback]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  return { play, stop, isPlaying };
}
