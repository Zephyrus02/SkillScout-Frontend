import { useState, useEffect, useRef, useCallback } from "react";

export function useReadAloud(blocks: string[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  const [highlight, setHighlight] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Pre-load voices to ensure they are available when play is clicked
  useEffect(() => {
    if (synth) {
      synth.getVoices();
    }
  }, [synth]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentBlockIndex(-1);
    setHighlight(null);
  }, [synth]);

  const play = useCallback(() => {
    if (!synth) return;

    // reset
    synth.cancel();
    setIsPlaying(true);
    setIsPaused(false);

    const utterances = blocks.map((text, i) => {
      // Strip markdown/html tags or just rely on TTS being smart
      const cleanText = text.replace(/<[^>]*>?/gm, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Try to find a natural sounding voice
      const voices = synth.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.name.includes("Google US English") ||
            v.name.includes("Google UK English Female"),
        ) ||
        voices.find(
          (v) => v.name.includes("Natural") || v.name.includes("Premium"),
        ) ||
        voices.find(
          (v) =>
            v.name === "Samantha" || v.name === "Karen" || v.name === "Daniel",
        ) ||
        voices.find((v) => v.lang.startsWith("en-US")) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.95; // Slightly slower sounds more natural
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setCurrentBlockIndex(i);
        setHighlight(null);
      };

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const start = event.charIndex;
          let end = start + (event.charLength || 0);

          if (!event.charLength) {
            const nextSpace = text.indexOf(" ", start);
            end = nextSpace !== -1 ? nextSpace : text.length;
          }

          setHighlight({ start, end });
        }
      };

      utterance.onend = () => {
        if (i === blocks.length - 1) {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentBlockIndex(-1);
          setHighlight(null);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled") {
          console.error("SpeechSynthesis error:", e);
        }
      };

      return utterance;
    });

    utterancesRef.current = utterances;

    setTimeout(() => {
      utterances.forEach((u) => synth.speak(u));
    }, 50);
  }, [blocks, synth]);

  const toggle = useCallback(() => {
    if (!synth) return;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      play();
    }
  }, [isPlaying, isPaused, synth, play]);

  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  return { isPlaying, isPaused, currentBlockIndex, highlight, toggle, stop };
}
