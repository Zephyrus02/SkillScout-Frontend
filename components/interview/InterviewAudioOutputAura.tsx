"use client";

import { useVoiceAssistant } from "@livekit/components-react";
import { AgentAudioVisualizerAura } from "@/components/agents-ui/agent-audio-visualizer-aura";

const ACCENT = "#3B82F6" as const;

function statusLabel(state: string) {
  switch (state) {
    case "speaking":
      return "AI Speaking...";
    case "listening":
    case "pre-connect-buffering":
      return "Listening...";
    case "thinking":
      return "Thinking...";
    case "connecting":
    case "initializing":
      return "Connecting...";
    case "idle":
      return "Ready";
    case "failed":
    case "disconnected":
      return "Disconnected";
    default:
      return "AI assistant";
  }
}

export function InterviewAudioOutputAura({ demo }: { demo: boolean }) {
  if (demo) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-0 py-2 px-4">
        <AgentAudioVisualizerAura
          size="lg"
          state="speaking"
          color={ACCENT}
          colorShift={0.3}
          themeMode="light"
          className="aspect-square size-auto w-full max-w-[min(100%,240px)] max-h-[min(50vh,240px)]"
        />
        <p className="mt-2 text-slate-400 text-xs font-medium">
          {statusLabel("speaking")}
        </p>
      </div>
    );
  }
  return <InterviewAudioOutputAuraLive />;
}

function InterviewAudioOutputAuraLive() {
  const { state, audioTrack } = useVoiceAssistant();
  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-0 py-2 px-4">
      <AgentAudioVisualizerAura
        size="lg"
        state={state}
        audioTrack={audioTrack}
        color={ACCENT}
        colorShift={0.3}
        themeMode="light"
        className="aspect-square size-auto w-full max-w-[min(100%,240px)] max-h-[min(50vh,240px)]"
      />
      <p className="mt-2 text-slate-400 text-xs font-medium">
        {statusLabel(state)}
      </p>
    </div>
  );
}

export default InterviewAudioOutputAura;
