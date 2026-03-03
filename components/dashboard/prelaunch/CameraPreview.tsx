import type { RefObject } from "react";
import type { CheckStatus } from "./types";

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraStatus: CheckStatus;
}

export default function CameraPreview({
  videoRef,
  cameraStatus,
}: CameraPreviewProps) {
  return (
    <div className="w-full md:w-1/2 bg-slate-900 relative p-6 flex flex-col justify-between min-h-[320px] overflow-hidden">
      {/* Live video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/80 pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/10 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            {cameraStatus === "ok" ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
            )}
          </span>
          <span className="text-xs font-medium tracking-wide">
            {cameraStatus === "ok"
              ? "Camera Working"
              : cameraStatus === "error"
                ? "Camera Error"
                : "Checking..."}
          </span>
        </div>
        <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 cursor-pointer hover:bg-black/60 transition-colors text-white/80">
          <span className="material-icons text-sm">settings</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: candidate label */}
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <h3 className="text-white font-semibold text-lg">You</h3>
          <p className="text-slate-400 text-sm">Interview Candidate</p>
        </div>
      </div>
    </div>
  );
}
