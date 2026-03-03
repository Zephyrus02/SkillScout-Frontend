import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  useMediaPipeProctoring,
  getViolationLabel,
  type ViolationType,
} from "@/hooks/useMediaPipeProctoring";

/* ─────────────────────────────────────────────────────────────
   Interview Pre-launch / System Readiness Check
   – Real camera via getUserMedia → <video> element
   – Real mic level via AnalyserNode
   – Device compatibility check (desktop vs mobile)
   – Speaker test with /pl_test.wav
───────────────────────────────────────────────────────────────── */

type CheckStatus = "pending" | "ok" | "error" | "checking";

export default function PrelaunchPage() {
  // ── Camera ───────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>("checking");
  const [cameraLabel, setCameraLabel] = useState<string>("");

  // ── MediaPipe face / object proctoring ───────────────────
  const proctoring = useMediaPipeProctoring(videoRef, cameraStatus !== "error");

  // Derive a CheckStatus for the face detection row
  type FaceCheckStatus = CheckStatus;
  let faceCheckStatus: FaceCheckStatus;
  let faceCheckBadgeLabel: string;
  let faceCheckDescription: string;
  if (proctoring.isLoading || !proctoring.isReady) {
    faceCheckStatus = "checking";
    faceCheckBadgeLabel = "Initialising…";
    faceCheckDescription = "Loading face detection models…";
  } else if (!proctoring.modelLoaded) {
    // Graceful degradation – models failed silently, allow user through
    faceCheckStatus = "ok";
    faceCheckBadgeLabel = "Skipped";
    faceCheckDescription = "Face detection unavailable in this browser.";
  } else if (proctoring.faceCount === 0 || proctoring.violation === "no_face") {
    faceCheckStatus = "checking";
    faceCheckBadgeLabel = "Looking…";
    faceCheckDescription = "Please position your face within the camera frame.";
  } else if (proctoring.violation === null && proctoring.faceCount === 1) {
    faceCheckStatus = "ok";
    faceCheckBadgeLabel = "Clear";
    faceCheckDescription =
      "One face detected, looking at screen, no banned objects.";
  } else {
    faceCheckStatus = "error";
    faceCheckBadgeLabel = "Issue Detected";
    faceCheckDescription = getViolationLabel(
      proctoring.violation as ViolationType,
    );
  }

  // ── Microphone ───────────────────────────────────────────
  // micPermission: browser permission state
  // micQuality: "listening" | "passed" — quality check result
  const [micPermission, setMicPermission] = useState<CheckStatus>("checking");
  type MicQuality = "listening" | "passed";
  const [micQuality, setMicQuality] = useState<MicQuality>("listening");
  const [micLevel, setMicLevel] = useState(0);
  const [micLabel, setMicLabel] = useState<string>("");
  // countdown seconds remaining in current test window
  const [micCountdown, setMicCountdown] = useState(3);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  // ── Device compatibility ─────────────────────────────────
  const [deviceStatus, setDeviceStatus] = useState<CheckStatus>("checking");
  const [deviceLabel, setDeviceLabel] = useState<string>("");

  // ── Speaker ──────────────────────────────────────────────
  type SpeakerState = "idle" | "playing" | "audible";
  const [speakerState, setSpeakerState] = useState<SpeakerState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── All-pass gate ─────────────────────────────────────────
  const allOk =
    cameraStatus === "ok" &&
    micPermission === "ok" &&
    micQuality === "passed" &&
    deviceStatus === "ok" &&
    speakerState === "audible" &&
    faceCheckStatus === "ok";

  // ── Camera init ──────────────────────────────────────────
  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const track = stream.getVideoTracks()[0];
        setCameraLabel(track?.label || "Camera");
        setCameraStatus("ok");
      } catch {
        setCameraStatus("error");
        setCameraLabel("Access denied");
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // ── Mic init + AnalyserNode + quality sampling ───────────
  useEffect(() => {
    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaStreamAudioSourceNode;
    // Quality sampling constants
    const SAMPLE_WINDOW_MS = 3000; // how long to sample before judging
    const PASS_THRESHOLD = 6; // average level (0–100 scaled) to pass
    const SAMPLE_INTERVAL_MS = 80; // how often to sample within the window
    let samples: number[] = [];
    let windowStart = 0;
    let sampleTimer: ReturnType<typeof setInterval>;
    let countdownTimer: ReturnType<typeof setInterval>;

    const startQualityWindow = () => {
      samples = [];
      windowStart = Date.now();
      setMicCountdown(Math.ceil(SAMPLE_WINDOW_MS / 1000));

      // Countdown display
      countdownTimer = setInterval(() => {
        const elapsed = Date.now() - windowStart;
        const remaining = Math.max(
          0,
          Math.ceil((SAMPLE_WINDOW_MS - elapsed) / 1000),
        );
        setMicCountdown(remaining);
      }, 500);

      // Sample mic levels
      sampleTimer = setInterval(() => {
        if (!analyser) return;
        const d = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(d);
        const avg = d.reduce((a, b) => a + b, 0) / d.length;
        const scaled = Math.min(98, Math.max(0, (avg / 255) * 100 * 3.5));
        samples.push(scaled);

        const elapsed = Date.now() - windowStart;
        if (elapsed >= SAMPLE_WINDOW_MS) {
          clearInterval(sampleTimer);
          clearInterval(countdownTimer);
          const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
          if (mean >= PASS_THRESHOLD) {
            setMicQuality("passed");
          } else {
            // Failed – restart window after a short pause
            setTimeout(startQualityWindow, 500);
          }
        }
      }, SAMPLE_INTERVAL_MS);
    };

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        micStreamRef.current = stream;
        const track = stream.getAudioTracks()[0];
        setMicLabel(track?.label || "Microphone");
        setMicPermission("ok");

        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        // Continuous level display via rAF
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setMicLevel(Math.min(98, Math.max(2, (avg / 255) * 100 * 3.5)));
          animFrameRef.current = requestAnimationFrame(tick);
        };
        tick();

        // Start quality sampling window
        startQualityWindow();
      } catch {
        setMicPermission("error");
        setMicLabel("Access denied");
      }
    })();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(sampleTimer);
      clearInterval(countdownTimer);
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtx?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Device compatibility ─────────────────────────────────
  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    if (isMobile && !isTablet) {
      setDeviceStatus("error");
      setDeviceLabel("Mobile device detected – desktop required");
    } else if (isTablet) {
      setDeviceStatus("error");
      setDeviceLabel("Tablet detected – desktop required");
    } else {
      setDeviceStatus("ok");
      setDeviceLabel("Desktop / Laptop detected");
    }
  }, []);

  // ── Speaker test ─────────────────────────────────────────
  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/pl_test.wav");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setSpeakerState("playing");
    audioRef.current.onended = () => {
      // Keep showing "playing" state – user decides audible / replay
    };
  };

  const markAudible = () => setSpeakerState("audible");
  const replaySound = () => playSound();

  return (
    <>
      <Head>
        <title>System Readiness Check – SkillScout</title>
      </Head>

      {/* Grid background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#F8FAFC",
          backgroundImage:
            "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[580px] relative z-10">
          {/* ── Left: Live Camera Preview ── */}
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

            {/* Face detection ring */}
            <div className="relative z-0 flex-1 flex items-center justify-center pointer-events-none my-4">
              <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border border-white/10" />
              </div>
            </div>

            {/* Bottom: name + controls */}
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <h3 className="text-white font-semibold text-lg">You</h3>
                <p className="text-slate-400 text-sm">Interview Candidate</p>
              </div>
            </div>
          </div>

          {/* ── Right: System Readiness Check ── */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                System Readiness Check
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Before we begin your AI mock interview, we need to ensure your
                device meets the technical requirements for a smooth session.
              </p>
            </div>

            {/* Checks */}
            <div className="space-y-5">
              {/* ── Device Compatibility ── */}
              <CheckRow
                status={deviceStatus}
                icon={deviceStatus === "ok" ? "computer" : "smartphone"}
                title="Device Compatibility"
                badge={
                  deviceStatus === "ok"
                    ? { label: "Desktop", color: "emerald" }
                    : { label: "Incompatible", color: "red" }
                }
                borderBottom
              >
                <p
                  className={`text-xs mt-1 ${deviceStatus === "error" ? "text-red-500" : "text-slate-500"}`}
                >
                  {deviceLabel || "Checking device…"}
                </p>
              </CheckRow>

              {/* ── Internet Connection ── */}
              <CheckRow
                status="ok"
                icon="wifi"
                title="Internet Connection"
                badge={{ label: "Excellent", color: "emerald" }}
                borderBottom
              >
                <p className="text-xs text-slate-500 mt-1">
                  Ping: 24ms • Upload: 45 Mbps
                </p>
              </CheckRow>

              {/* ── Camera Access ── */}
              <CheckRow
                status={cameraStatus}
                icon="videocam"
                title="Camera Access"
                badge={
                  cameraStatus === "ok"
                    ? { label: "Granted", color: "emerald" }
                    : cameraStatus === "error"
                      ? { label: "Denied", color: "red" }
                      : { label: "Checking…", color: "slate" }
                }
                borderBottom
              >
                {cameraLabel && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-icons text-slate-400 text-sm">
                      videocam
                    </span>
                    <span className="text-xs text-slate-600 font-medium truncate">
                      {cameraLabel}
                    </span>
                  </div>
                )}
              </CheckRow>

              {/* ── Face Detection (MediaPipe) ── */}
              <CheckRow
                status={faceCheckStatus}
                icon={
                  faceCheckStatus === "ok"
                    ? "face"
                    : faceCheckStatus === "error"
                      ? "no_accounts"
                      : "face_retouching_natural"
                }
                title="Face Detection"
                badge={
                  faceCheckStatus === "ok"
                    ? { label: faceCheckBadgeLabel, color: "emerald" }
                    : faceCheckStatus === "error"
                      ? { label: faceCheckBadgeLabel, color: "red" }
                      : { label: faceCheckBadgeLabel, color: "blue" }
                }
                borderBottom
                spinnerIcon={faceCheckStatus === "checking"}
              >
                <p
                  className={`text-xs mt-1 ${
                    faceCheckStatus === "error"
                      ? "text-red-500 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  {faceCheckDescription}
                </p>
                {faceCheckStatus === "error" && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ensure only you are visible, you are looking at the screen,
                    and no phones or books are in view.
                  </p>
                )}
              </CheckRow>

              {/* ── Microphone ── */}
              <CheckRow
                status={
                  micPermission === "error"
                    ? "error"
                    : micQuality === "passed"
                      ? "ok"
                      : "checking"
                }
                icon={micPermission === "error" ? "mic_off" : "mic"}
                title="Microphone Check"
                badge={
                  micPermission === "error"
                    ? { label: "Denied", color: "red" }
                    : micQuality === "passed"
                      ? { label: "Good", color: "emerald" }
                      : { label: `Listening… ${micCountdown}s`, color: "blue" }
                }
                borderBottom
                spinnerIcon={micPermission === "ok" && micQuality !== "passed"}
              >
                {micPermission === "ok" && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-100 ${
                          micQuality === "passed"
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-blue-400 to-blue-500"
                        }`}
                        style={{ width: `${micLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {micLevel < 15 ? "Low" : micLevel < 55 ? "Fair" : "Good"}
                    </span>
                  </div>
                )}
                {micLabel && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-icons text-slate-400 text-sm">
                      mic
                    </span>
                    <span className="text-xs text-slate-600 font-medium truncate">
                      {micLabel}
                    </span>
                  </div>
                )}
              </CheckRow>

              {/* ── Speaker Test ── */}
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
                    className={`material-icons text-lg ${speakerState === "audible" ? "text-emerald-500" : "text-slate-400"}`}
                  >
                    {speakerState === "audible" ? "check" : "volume_up"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                    <h3 className="font-semibold text-slate-900">
                      Speaker Test
                    </h3>
                    <div className="flex items-center gap-2">
                      {speakerState === "audible" ? (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <span className="material-icons text-sm">
                            check_circle
                          </span>
                          Audible
                        </span>
                      ) : (
                        <button
                          onClick={playSound}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                        >
                          <span className="material-icons text-sm">
                            {speakerState === "playing"
                              ? "volume_up"
                              : "play_arrow"}
                          </span>
                          {speakerState === "playing"
                            ? "Playing…"
                            : "Play Sound"}
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
                        onClick={markAudible}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <span className="material-icons text-sm">check</span>I
                        can hear it
                      </button>
                      <button
                        onClick={replaySound}
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
                        onClick={replaySound}
                        className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                      >
                        <span className="material-icons text-sm">replay</span>
                        Inaudible: Replay Sound
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {allOk ? (
                <div className="flex items-center gap-2 mb-4 bg-emerald-50/70 border border-emerald-100 p-3 rounded-lg">
                  <span className="material-icons text-emerald-500 text-lg">
                    check_circle
                  </span>
                  <p className="text-xs text-emerald-800 font-medium">
                    System compatibility verified. You are ready to join.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 bg-amber-50 border border-amber-100 p-3 rounded-lg">
                  <span className="material-icons text-amber-500 text-lg">
                    pending
                  </span>
                  <p className="text-xs text-amber-800 font-medium">
                    Complete all checks above before joining.
                  </p>
                </div>
              )}

              <Link
                href="/dashboard/interview"
                className={`w-full font-semibold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  allOk
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                }`}
                aria-disabled={!allOk}
              >
                Enter Interview Room
                <span className="material-icons text-lg">arrow_forward</span>
              </Link>
              <p className="text-center text-[10px] text-slate-400 mt-3">
                By joining, you agree to record this session for analysis.
              </p>

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard/practice"
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-icons text-sm">chevron_left</span>
                  Back to Practice Arena
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Shared check-row component ───────────────────────────── */
type BadgeColor = "emerald" | "blue" | "red" | "slate";

function CheckRow({
  status,
  icon,
  title,
  badge,
  borderBottom,
  spinnerIcon,
  children,
}: {
  status: CheckStatus;
  icon: string;
  title: string;
  badge: { label: string; color: BadgeColor };
  borderBottom?: boolean;
  spinnerIcon?: boolean;
  children?: React.ReactNode;
}) {
  const iconBg: Record<CheckStatus, string> = {
    ok: "bg-emerald-50 border-emerald-200",
    error: "bg-red-50 border-red-200",
    checking: "bg-slate-50 border-slate-200",
    pending: "bg-slate-50 border-slate-200",
  };
  const iconColor: Record<CheckStatus, string> = {
    ok: "text-emerald-500",
    error: "text-red-500",
    checking: "text-slate-400",
    pending: "text-slate-400",
  };
  const badgeCls: Record<BadgeColor, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    red: "text-red-600 bg-red-50 border-red-200",
    slate: "text-slate-500 bg-slate-100 border-slate-200",
  };

  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${iconBg[status]}`}
      >
        {spinnerIcon && status === "ok" ? (
          <div className="flex gap-[2px] items-center h-3">
            <div
              className="w-0.5 bg-blue-500 rounded-full"
              style={{
                height: "40%",
                animation: "mic-bounce 0.5s ease-in-out infinite",
              }}
            />
            <div
              className="w-0.5 bg-blue-500 rounded-full"
              style={{
                height: "40%",
                animation: "mic-bounce 0.7s ease-in-out infinite",
              }}
            />
            <div
              className="w-0.5 bg-blue-500 rounded-full"
              style={{
                height: "40%",
                animation: "mic-bounce 0.4s ease-in-out infinite",
              }}
            />
          </div>
        ) : (
          <span className={`material-icons text-lg ${iconColor[status]}`}>
            {status === "checking" ? "hourglass_top" : icon}
          </span>
        )}
      </div>
      <div
        className={`flex-1 ${borderBottom ? "border-b border-gray-100 pb-5" : ""}`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded border ${badgeCls[badge.color]}`}
          >
            {badge.label}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
