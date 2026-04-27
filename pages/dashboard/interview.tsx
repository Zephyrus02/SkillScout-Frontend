import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useMediaPipeProctoring } from "@/hooks/useMediaPipeProctoring";
import { useEnvironmentProctoring } from "@/hooks/useEnvironmentProctoring";
import { useAntiDevTools } from "@/hooks/useAntiDevTools";
import { useMalpracticeWarnings } from "@/hooks/useMalpracticeWarnings";
import { MalpracticeWarningToast } from "@/components/ui/MalpracticeWarningToast";
import {
  interviewSessionsApi,
  type VideoSignalItem,
} from "@/lib/api/interviews";

const LiveKitRoom = dynamic(
  () => import("@livekit/components-react").then((m) => m.LiveKitRoom),
  { ssr: false },
);

const InterviewAudioOutputAura = dynamic(
  () => import("@/components/interview/InterviewAudioOutputAura"),
  { ssr: false },
);

const SESSION_STORAGE_KEY = "skillscout_interview_session";
const VIDEO_SIGNALS_INTERVAL_MS = 10_000;

function firstQueryParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function InterviewRoom() {
  const router = useRouter();
  const sessionId = firstQueryParam(router.query.sessionId) ?? null;
  const skipLiveKit = firstQueryParam(router.query.skipLiveKit) === "true";
  const [token, setToken] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [needsFullscreen, setNeedsFullscreen] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== "production") return;
    requestAnimationFrame(() => {
      if (!document.fullscreenElement) {
        setNeedsFullscreen(true);
      }
    });
  }, []);

  // Exit fullscreen on any navigation away from the interview room.
  // Intentionally NOT in the fullscreen check's cleanup — React Strict Mode
  // runs cleanup immediately on mount, which would exit fullscreen on arrival.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== "production") return;
    const exitFs = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    router.events.on("routeChangeStart", exitFs);
    return () => router.events.off("routeChangeStart", exitFs);
  }, [router.events]);

  const handleEnterFullscreen = useCallback(() => {
    document.documentElement
      .requestFullscreen()
      .then(() => {
        setNeedsFullscreen(false);
      })
      .catch((err) => {
        console.warn("Interview fullscreen request failed:", err);
        toast.info(
          "Fullscreen mode unavailable. Interview will continue in windowed mode.",
          { duration: 5000 },
        );
        setNeedsFullscreen(false);
      });
  }, []);

  useEffect(() => {
    if (!sessionId || skipLiveKit) return;
    let cancelled = false;
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem(SESSION_STORAGE_KEY)
        : null;
    if (stored) {
      try {
        const { token: t, livekitUrl: u } = JSON.parse(stored) as {
          token?: string;
          livekitUrl?: string;
        };
        if (t && u) {
          queueMicrotask(() => {
            if (!cancelled) {
              setToken(t);
              setLivekitUrl(u);
            }
          });
          return () => {
            cancelled = true;
          };
        }
      } catch {
        // ignore invalid JSON; fall through to join
      }
    }
    interviewSessionsApi
      .joinSession(sessionId)
      .then((res) => {
        if (cancelled || !res.success || !res.data) return;
        setToken(res.data.token);
        setLivekitUrl(res.data.livekitUrl);
      })
      .catch((err) => {
        if (!cancelled)
          setConnectError(
            err instanceof Error ? err.message : "Failed to join",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, skipLiveKit]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Live timer state (seconds elapsed)
  const [elapsed, setElapsed] = useState(0);

  // ── Malpractice / proctoring state ──────────────────────────────────────
  // 3 visible warnings; 4th violation → immediate termination

  // ── Format elapsed seconds → "14m 02s" / "00:14" style ─────────────────
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${String(s).padStart(2, "0")}s`;
  };

  // ── Timer interval ──────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Stop camera completely (stop tracks + release srcObject) ─────────
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ── End session ──────────────────────────────────────────
  const endSession = useCallback(
    (options?: { malpractice?: boolean }) => {
      stopCamera();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
      if (options?.malpractice) {
        toast.error(
          "Interview terminated due to malpractice. You have been returned to Practice.",
          { duration: 8000 },
        );
        void router.push("/dashboard/practice");
      } else {
        void router.push("/dashboard/analysis");
      }
    },
    [router],
  );

  /** Only open camera/mic when actually in the interview room UI (not empty / error / connecting). */
  const shouldAcquireLocalMedia = Boolean(
    (sessionId || skipLiveKit) &&
    !connectError &&
    (skipLiveKit || (!!token && !!livekitUrl)),
  );

  // ── Proctoring (MediaPipe & Env) ─────────────────────────
  useAntiDevTools(true);
  const proctoring = useMediaPipeProctoring(videoRef, shouldAcquireLocalMedia);
  const envProctoring = useEnvironmentProctoring(shouldAcquireLocalMedia);

  // ── Video signals: batch every 10s and POST ─────────────────
  const signalsBatchRef = useRef<VideoSignalItem[]>([]);
  useEffect(() => {
    if (!sessionId || !token || skipLiveKit) return;
    const interval = setInterval(() => {
      if (signalsBatchRef.current.length === 0) return;
      const batch = [...signalsBatchRef.current];
      signalsBatchRef.current = [];
      interviewSessionsApi
        .postVideoSignals(sessionId, { signals: batch })
        .catch(() => {});
    }, VIDEO_SIGNALS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [sessionId, token, skipLiveKit]);
  // Sample at ~1 fps and push to batch (use proctoring state)
  useEffect(() => {
    if (!sessionId || !token || skipLiveKit || !proctoring.isReady) return;
    const t = setInterval(() => {
      const faceVisiblePct = proctoring.faceCount >= 1 ? 100 : 0;
      const avgGazeScore = proctoring.isLookingSideways ? 0.3 : 0.9;
      signalsBatchRef.current.push({
        windowStart: new Date().toISOString(),
        faceVisiblePct,
        avgGazeScore,
        avgHeadPitch: null,
        lookingDownPct: null,
        avgEyeBlink: null,
        avgBrowFurrow: null,
        avgMouthSmile: null,
        avgJawOpen: null,
        shoulderAlign: null,
        forwardLean: null,
      });
    }, 1000);
    return () => clearInterval(t);
  }, [
    sessionId,
    token,
    proctoring.isReady,
    proctoring.faceCount,
    proctoring.isLookingSideways,
    skipLiveKit,
  ]);

  // Fire a warning toast on each violation (with cooldown).
  // Warnings 1–3 show a toast. The 4th violation terminates immediately.
  const combinedViolation =
    envProctoring.violation ||
    (proctoring.isReady && proctoring.modelLoaded
      ? proctoring.violation
      : null);

  const {
    activeWarning,
    warningCountDisplay,
    clearWarning,
    maxWarnings: MAX_WARNINGS,
  } = useMalpracticeWarnings({
    violation: combinedViolation,
    detectedObjects: proctoring.detectedObjects,
    onTerminate: () => endSession({ malpractice: true }),
  });

  // ── Boot camera / mic (gated + cancel-safe async getUserMedia) ───────────
  useEffect(() => {
    if (!shouldAcquireLocalMedia) {
      return () => {
        stopCamera();
      };
    }

    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        // Camera permission denied or unavailable — fail silently
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [shouldAcquireLocalMedia]);

  if (!router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!sessionId && !skipLiveKit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No interview session.</p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/practice")}
            className="text-blue-600 hover:underline"
          >
            Go to Practice Arena
          </button>
        </div>
      </div>
    );
  }

  if (connectError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{connectError}</p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/practice")}
            className="text-blue-600 hover:underline"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  const pageContent = (
    <>
      {/* ── Malpractice warning overlay (fixed, above all content) ── */}
      <MalpracticeWarningToast
        warning={activeWarning}
        onDismiss={() => {
          clearWarning();
          envProctoring.clearViolation();
        }}
      />

      {/* ── Fullscreen entry overlay ── */}
      {needsFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <span className="material-icons text-5xl mb-4 block text-blue-400">
              fullscreen
            </span>
            <h2 className="text-xl font-semibold mb-2">Fullscreen Required</h2>
            <p className="text-slate-300 mb-6 text-sm">
              This interview must be conducted in fullscreen mode to continue.
            </p>
            <button
              type="button"
              onClick={handleEnterFullscreen}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      <Head>
        <meta name="robots" content="noindex, nofollow" />

        <title>AI Live Interview Room – SkillScout</title>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
          }
        `}</style>
      </Head>

      <div className="bg-slate-50 text-slate-800 font-sans h-screen flex flex-col overflow-hidden">
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0">
          {/* Left: logo + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-lg">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">
                Mock Interview #429
              </span>
              <span className="text-xs text-slate-500">
                System Design: Distributed Cache
              </span>
            </div>
          </div>

          {/* Right: recording pill, settings, end */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                Recording
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">
                {formatTime(elapsed)}
              </span>
            </div>

            {/* Malpractice warning indicator – only shown after ≥1 warning */}
            {warningCountDisplay > 0 && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  warningCountDisplay >= MAX_WARNINGS
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-orange-100 text-orange-700 border border-orange-200"
                }`}
              >
                <span className="material-icons text-sm">warning_amber</span>
                {warningCountDisplay}/{MAX_WARNINGS} Warnings
              </div>
            )}

            <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <span className="material-icons text-xl">settings</span>
            </button>

            <button
              type="button"
              onClick={() => endSession()}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-base">call_end</span>
              End Session
            </button>
          </div>
        </header>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        {skipLiveKit && (
          <div className="px-6 mb-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-2xl p-3 text-center shadow-sm">
              LiveKit is disabled in this demo flow, so the room is for UI
              preview only.
            </div>
          </div>
        )}

        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* ── LEFT COLUMN (col 1-6) ──────────────────────────────────── */}
            <div className="col-span-6 flex flex-col gap-6 h-full">
              {/* Candidate Video Feed (60%) */}
              <div className="h-[60%] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium text-white/90 uppercase tracking-wide">
                    Candidate Feed
                  </span>
                </div>

                {/* Video area */}
                <div className="relative w-full h-full bg-slate-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom overlay: name + status */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-medium text-sm">You</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <span className="material-icons text-[12px]">mic</span>
                        On
                      </span>
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <span className="material-icons text-[12px]">
                          videocam
                        </span>
                        On
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Audio Output (40%) */}
              <div className="h-[40%] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Dot-grid background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grid-small"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-small)" />
                  </svg>
                </div>

                {/* Label */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Audio Output
                  </span>
                </div>

                <InterviewAudioOutputAura demo={skipLiveKit} />
              </div>
            </div>

            {/* ── MIDDLE COLUMN — Live Transcript (col 7-9) ─────────────── */}
            <div className="col-span-3 h-full flex flex-col">
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="h-14 border-b border-slate-100 flex justify-between items-center px-4 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-slate-400 text-lg">
                      subtitles
                    </span>
                    <h3 className="font-semibold text-sm text-slate-700">
                      Live Transcript
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors">
                      <span className="material-icons text-lg">search</span>
                    </button>
                    <button className="text-xs text-emerald-600 font-medium hover:underline bg-emerald-50 px-2 py-1.5 rounded-md">
                      Export
                    </button>
                  </div>
                </div>

                {/* Scrollable transcript */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-white/50 pb-16">
                  {/* AI message */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
                        <span
                          className="material-icons text-white"
                          style={{ fontSize: 10 }}
                        >
                          smart_toy
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        AI Interviewer
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTime(Math.max(0, elapsed - 120))}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl rounded-tl-none shadow-sm border border-slate-100 text-slate-600 text-xs leading-relaxed">
                      Let&apos;s dive deeper into the scaling strategy. If we
                      suddenly experience a 10x spike in traffic, how would your
                      proposed caching layer handle the increased load on the
                      database?
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300 ring-2 ring-white overflow-hidden">
                        <span
                          className="material-icons text-slate-500"
                          style={{ fontSize: 14 }}
                        >
                          person
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        You
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTime(Math.max(0, elapsed - 60))}
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl rounded-tr-none shadow-sm border border-emerald-100 text-slate-800 text-xs leading-relaxed text-right">
                      That&apos;s a great question. In a write-heavy scenario
                      like that, I would rely on a write-through cache strategy.{" "}
                      <span className="bg-yellow-100 px-1 rounded text-yellow-800 border border-yellow-200">
                        Umm
                      </span>
                      , basically ensuring that data is written to the cache and
                      the DB simultaneously.
                    </div>
                  </div>

                  {/* AI typing indicator */}
                  <div className="flex flex-col gap-2 opacity-60">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                        <span
                          className="material-icons text-white"
                          style={{ fontSize: 10 }}
                        >
                          smart_toy
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900">
                        AI Interviewer
                      </span>
                    </div>
                    <div className="pl-2">
                      <div className="flex space-x-1 p-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <div
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "75ms" }}
                        />
                        <div
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating action bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200 z-10">
                  <button
                    onClick={() => {
                      stopCamera();
                      router.push("/dashboard/analysis");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1"
                  >
                    Next
                    <span className="material-icons text-xs">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (col 10-12) ───────────────────────────────── */}
            <div className="col-span-3 flex flex-col gap-6 h-full">
              {/* Session Details card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Session Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">
                      CURRENT QUESTION
                    </p>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      Scaling Database Architecture
                    </p>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Duration</span>
                    <span className="text-xs font-mono font-medium text-slate-700">
                      {formatDuration(elapsed)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Connection</span>
                    <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Excellent
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Analysis card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Real-time Analysis
                </h4>

                {/* Pace */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                    <span className="material-icons text-lg">speed</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-500">
                      Pace
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-slate-800">
                        145
                      </span>
                      <span className="text-[10px] text-slate-500">wpm</span>
                    </div>
                  </div>
                  {/* Mini bar chart */}
                  <div className="h-6 w-8 flex items-end gap-0.5 opacity-50">
                    <div
                      className="w-1.5 bg-slate-300 rounded-t-sm"
                      style={{ height: "40%" }}
                    />
                    <div
                      className="w-1.5 bg-slate-300 rounded-t-sm"
                      style={{ height: "60%" }}
                    />
                    <div
                      className="w-1.5 bg-emerald-500 rounded-t-sm"
                      style={{ height: "80%" }}
                    />
                    <div
                      className="w-1.5 bg-slate-300 rounded-t-sm"
                      style={{ height: "50%" }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                    <span className="material-icons text-lg">psychology</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-500">
                      Confidence
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-emerald-500">
                        High
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">
                      8.2
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      /10
                    </span>
                  </div>
                </div>

                {/* Filler Words */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                    <span className="material-icons text-lg">graphic_eq</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-500">
                      Filler Words
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-amber-500">
                        4
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md font-medium">
                    Alert
                  </div>
                </div>

                {/* Live Tip */}
                <div className="mt-1 bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-blue-100 rounded-full shrink-0">
                      <span className="material-icons text-blue-600 text-xs">
                        lightbulb
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-blue-900 mb-0.5 uppercase tracking-wide">
                        Live Tip
                      </h4>
                      <p className="text-[10px] text-blue-800 leading-relaxed">
                        You&apos;re using &quot;umm&quot; frequently. Try
                        pausing to think instead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Subtle background gradient */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-30 bg-linear-to-b from-blue-50/50 via-transparent to-transparent" />
      </div>
    </>
  );

  if (!token || !livekitUrl) {
    if (!skipLiveKit) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-slate-600">Connecting to interview room…</p>
        </div>
      );
    }
  }

  if (skipLiveKit) {
    return pageContent;
  }

  return (
    <LiveKitRoom
      token={token!}
      serverUrl={livekitUrl!}
      connect
      audio
      video={false}
      onDisconnected={() => {
        try {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } catch {
          // ignore
        }
        router.push("/dashboard/analysis");
      }}
      onError={(e) => {
        setConnectError((e as Error)?.message ?? "Connection error");
      }}
    >
      {pageContent}
    </LiveKitRoom>
  );
}
