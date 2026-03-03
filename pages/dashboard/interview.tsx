import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useMediaPipeProctoring,
  getWarningMessage,
} from "@/hooks/useMediaPipeProctoring";
import {
  MalpracticeWarningToast,
  type ActiveWarning,
} from "@/components/ui/MalpracticeWarningToast";

export default function InterviewRoom() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Live timer state (seconds elapsed)
  const [elapsed, setElapsed] = useState(0);

  // ── Malpractice / proctoring state ──────────────────────────────────────
  // 3 visible warnings; 4th violation → immediate termination
  const MAX_WARNINGS = 3;
  const WARNING_COOLDOWN_MS = 11_000; // slightly > 10 s so the toast finishes

  const [activeWarning, setActiveWarning] = useState<ActiveWarning | null>(
    null,
  );
  const warningCountRef = useRef(0);
  const [warningCountDisplay, setWarningCountDisplay] = useState(0);
  const lastWarningAtRef = useRef<number>(0);
  const terminatingRef = useRef(false);

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

  // ── Start webcam ────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Camera permission denied or unavailable — fail silently
    }
  }, []);

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
  const endSession = useCallback(() => {
    stopCamera();
    router.push("/dashboard/practice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ── Proctoring (MediaPipe) ─────────────────────────────────
  const proctoring = useMediaPipeProctoring(videoRef, true);

  // Fire a warning toast on each violation (with cooldown).
  // Warnings 1–3 show a toast. The 4th violation terminates immediately.
  useEffect(() => {
    if (!proctoring.isReady || !proctoring.modelLoaded) return;
    if (proctoring.violation === null) return;
    if (terminatingRef.current) return;

    const now = Date.now();
    if (now - lastWarningAtRef.current < WARNING_COOLDOWN_MS) return;

    lastWarningAtRef.current = now;

    // Already gave 3 warnings → this 4th violation terminates the session
    if (warningCountRef.current >= MAX_WARNINGS) {
      terminatingRef.current = true;
      endSession();
      return;
    }

    const newCount = warningCountRef.current + 1;
    warningCountRef.current = newCount;
    setWarningCountDisplay(newCount);

    setActiveWarning({
      id: now,
      type: proctoring.violation,
      message: getWarningMessage(
        proctoring.violation,
        proctoring.detectedObjects,
      ),
      warningNumber: newCount,
      totalWarnings: MAX_WARNINGS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proctoring.violation, proctoring.isReady, proctoring.modelLoaded]);

  // ── Boot camera ────────────────────────────────────────────────────────
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCamera]);

  return (
    <>
      {/* ── Malpractice warning overlay (fixed, above all content) ── */}
      <MalpracticeWarningToast
        warning={activeWarning}
        onDismiss={() => setActiveWarning(null)}
      />

      <Head>
        <title>AI Live Interview Room – SkillScout</title>
        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50%       { transform: scale(1.05); opacity: 1; }
          }
          @keyframes wave {
            0%, 100% { height: 10px; }
            50%       { height: 24px; }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.5; }
          }
          .animate-orb-breathe { animation: breathe 3s ease-in-out infinite; }
          .animate-pulse-slow  { animation: pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite; }
          .orb-glow {
            box-shadow: 0 0 60px 20px rgba(59, 130, 246, 0.3);
          }
          .bar {
            width: 6px;
            background: linear-gradient(to top, #3B82F6, #60A5FA);
            border-radius: 9999px;
            animation: wave 1s ease-in-out infinite;
          }
          .bar:nth-child(2) { animation-delay: 0.1s; }
          .bar:nth-child(3) { animation-delay: 0.2s; }
          .bar:nth-child(4) { animation-delay: 0.3s; }
          .bar:nth-child(5) { animation-delay: 0.4s; }
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
              onClick={endSession}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-base">call_end</span>
              End Session
            </button>
          </div>
        </header>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

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

                {/* Orb + waveform */}
                <div className="relative z-10 flex flex-col items-center justify-center scale-90">
                  <div className="w-56 h-56 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute inset-4 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg orb-glow animate-orb-breathe flex items-center justify-center relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-bl from-blue-400 to-indigo-500 opacity-90 blur-sm absolute" />
                      <div className="w-full h-full rounded-full border border-white/20 absolute" />
                    </div>
                  </div>

                  {/* Waveform bars */}
                  <div className="mt-4 h-8 flex items-center justify-center gap-1">
                    <div className="bar" style={{ height: 10 }} />
                    <div className="bar" style={{ height: 16 }} />
                    <div className="bar" style={{ height: 24 }} />
                    <div className="bar" style={{ height: 12 }} />
                    <div className="bar" style={{ height: 20 }} />
                  </div>

                  <p className="mt-2 text-slate-400 text-xs font-medium">
                    AI Speaking...
                  </p>
                </div>
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
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
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
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
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
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-30 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent" />
      </div>
    </>
  );
}
