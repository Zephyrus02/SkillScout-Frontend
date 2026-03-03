/**
 * MalpracticeWarningToast
 *
 * A persistent top-of-screen notification that slides in when a proctoring
 * violation is detected during the interview.  Auto-dismisses after 10 s
 * and shows a shrinking progress bar.  Rendered outside the main layout via
 * a fixed-position container so it never displaces existing UI.
 */

import { useEffect, useRef, useState } from "react";
import type { ViolationType } from "@/hooks/useMediaPipeProctoring";

// ── Public interface ─────────────────────────────────────────────────────────

export interface ActiveWarning {
  /** Unique key so React re-mounts the component on each new warning */
  id: number;
  type: ViolationType;
  message: string;
  warningNumber: number;
  totalWarnings: number;
}

interface Props {
  warning: ActiveWarning | null;
  onDismiss: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

const DISPLAY_MS = 10_000; // 10 seconds

export function MalpracticeWarningToast({ warning, onDismiss }: Props) {
  const [progress, setProgress] = useState(100); // 100 → 0 over DISPLAY_MS
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const callbackRef = useRef(onDismiss);
  callbackRef.current = onDismiss;

  useEffect(() => {
    if (!warning) return;

    setProgress(100);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / DISPLAY_MS) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        callbackRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [warning]);

  if (!warning) return null;

  const isFinal = warning.warningNumber >= warning.totalWarnings;

  const bgClass = isFinal
    ? "bg-red-600 border-red-700"
    : "bg-orange-500 border-orange-600";

  const iconName = isFinal ? "gpp_bad" : "warning_amber";

  return (
    <>
      <style>{`
        @keyframes mp-slide-down {
          from { transform: translateY(-110%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .mp-warning-enter {
          animation: mp-slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Fixed overlay – does NOT affect any layout */}
      <div className="fixed top-4 inset-x-0 flex justify-center z-[9999] pointer-events-none px-4">
        <div
          className={`mp-warning-enter w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden pointer-events-auto ${bgClass}`}
        >
          {/* Content row */}
          <div className="flex items-start gap-3 p-4">
            {/* Icon */}
            <div className="shrink-0 p-1.5 bg-white/20 rounded-xl">
              <span className="material-icons text-white text-xl">
                {iconName}
              </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-bold text-sm leading-tight">
                  {isFinal
                    ? "Final Warning – Interview will be Terminated"
                    : "Malpractice Warning Detected"}
                </span>
                <span className="text-[10px] font-semibold text-white/80 bg-white/20 rounded-full px-2 py-0.5 shrink-0">
                  {warning.warningNumber} / {warning.totalWarnings}
                </span>
              </div>

              <p className="text-white/90 text-xs leading-relaxed">
                {warning.message}
              </p>

              {!isFinal && (
                <p className="text-white/60 text-[10px] mt-1">
                  The interview will be automatically terminated after{" "}
                  {warning.totalWarnings} warnings.
                </p>
              )}

              {isFinal && (
                <p className="text-white/80 text-[10px] mt-1 font-medium">
                  Redirecting you to the dashboard in a moment…
                </p>
              )}
            </div>

            {/* Dismiss button */}
            <button
              onClick={onDismiss}
              aria-label="Dismiss warning"
              className="shrink-0 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <span className="material-icons text-base">close</span>
            </button>
          </div>

          {/* Shrinking progress bar */}
          <div className="h-1 bg-black/20">
            <div
              className="h-full bg-white/60 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
