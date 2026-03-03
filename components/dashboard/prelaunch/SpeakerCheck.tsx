import type { SpeakerState } from "./types";

interface SpeakerCheckProps {
  speakerState: SpeakerState;
  onPlay: () => void;
  onMarkAudible: () => void;
  onReplay: () => void;
}

export default function SpeakerCheck({
  speakerState,
  onPlay,
  onMarkAudible,
  onReplay,
}: SpeakerCheckProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
          speakerState === "audible"
            ? "bg-emerald-50 border-emerald-200"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <span
          className={`material-icons text-lg ${
            speakerState === "audible" ? "text-emerald-500" : "text-slate-400"
          }`}
        >
          {speakerState === "audible" ? "check" : "volume_up"}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
          <h3 className="font-semibold text-slate-900">Speaker Test</h3>
          <div className="flex items-center gap-2">
            {speakerState === "audible" ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="material-icons text-sm">check_circle</span>
                Audible
              </span>
            ) : (
              <button
                onClick={onPlay}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                <span className="material-icons text-sm">
                  {speakerState === "playing" ? "volume_up" : "play_arrow"}
                </span>
                {speakerState === "playing" ? "Playing…" : "Play Sound"}
              </button>
            )}
          </div>
        </div>

        {speakerState === "idle" && (
          <p className="text-xs text-slate-500">
            Click to ensure you can hear the AI interviewer clearly.
          </p>
        )}

        {speakerState === "playing" && (
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button
              onClick={onMarkAudible}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-sm">check</span>I can hear it
            </button>
            <button
              onClick={onReplay}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-sm">replay</span>
              Inaudible: Replay Sound
            </button>
          </div>
        )}

        {speakerState === "audible" && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={onReplay}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <span className="material-icons text-sm">replay</span>
              Inaudible: Replay Sound
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
