import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  useMediaPipeProctoring,
  getViolationLabel,
  type ViolationType,
} from "@/hooks/useMediaPipeProctoring";
import CheckRow from "@/components/dashboard/prelaunch/CheckRow";
import SpeakerCheck from "@/components/dashboard/prelaunch/SpeakerCheck";
import CameraPreview from "@/components/dashboard/prelaunch/CameraPreview";
import type {
  CheckStatus,
  MicQuality,
  SpeakerState,
} from "@/components/dashboard/prelaunch/types";

/* ─────────────────────────────────────────────────────────────
   Interview Pre-launch / System Readiness Check
   – Real camera via getUserMedia → <video> element
   – Real mic level via AnalyserNode
   – Device compatibility check (desktop vs mobile)
   – Speaker test with /pl_test.wav
───────────────────────────────────────────────────────────────── */

export default function PrelaunchPage() {
  // ── Camera ───────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>("checking");
  const [cameraLabel, setCameraLabel] = useState<string>("");

  // ── MediaPipe face / object proctoring ───────────────────
  const proctoring = useMediaPipeProctoring(videoRef, cameraStatus !== "error");

  // Derive a CheckStatus for the face detection row
  let faceCheckStatus: CheckStatus;
  let faceCheckBadgeLabel: string;
  let faceCheckDescription: string;
  if (proctoring.isLoading || !proctoring.isReady) {
    faceCheckStatus = "checking";
    faceCheckBadgeLabel = "Initialising…";
    faceCheckDescription = "Loading face detection models…";
  } else if (!proctoring.modelLoaded) {
    // All attempts exhausted – block the user; proctoring is required
    faceCheckStatus = "error";
    faceCheckBadgeLabel = "Failed";
    faceCheckDescription =
      "Face detection could not be loaded after 3 attempts. Please use Chrome or refresh the page.";
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

  // true when all retry attempts failed (distinct from a detection-violation error)
  const faceModelFailed = proctoring.isReady && !proctoring.modelLoaded;

  // ── Microphone ───────────────────────────────────────────
  // micPermission: browser permission state
  // micQuality: "listening" | "passed" — quality check result
  const [micPermission, setMicPermission] = useState<CheckStatus>("checking");
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

  const [speakerState, setSpeakerState] = useState<SpeakerState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Internet connection ──────────────────────────────────
  const [internetStatus, setInternetStatus] = useState<CheckStatus>("checking");
  const [internetLabel, setInternetLabel] = useState<string>("");

  // ── All-pass gate ─────────────────────────────────────────
  const allOk =
    cameraStatus === "ok" &&
    micPermission === "ok" &&
    micQuality === "passed" &&
    deviceStatus === "ok" &&
    speakerState === "audible" &&
    faceCheckStatus === "ok" &&
    internetStatus === "ok";

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

  // ── Internet connection check ─────────────────────────────
  useEffect(() => {
    const check = async () => {
      if (!navigator.onLine) {
        setInternetStatus("error");
        setInternetLabel("No internet connection detected");
        return;
      }
      const pingStart = performance.now();
      try {
        // Fetch a tiny no-cors resource to measure round-trip
        await fetch("https://www.gstatic.com/generate_204", {
          method: "HEAD",
          cache: "no-store",
          mode: "no-cors",
        });
        const ping = Math.round(performance.now() - pingStart);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const conn =
          (navigator as any).connection ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).mozConnection ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any).webkitConnection;
        const downlink: number | undefined = conn?.downlink;
        const effectiveType: string | undefined = conn?.effectiveType;

        if (
          effectiveType === "slow-2g" ||
          effectiveType === "2g" ||
          ping > 800
        ) {
          setInternetStatus("error");
          setInternetLabel(
            `Connection too slow (${ping}ms ping${effectiveType ? ` · ${effectiveType}` : ""})`,
          );
          return;
        }

        let label = `Ping: ${ping}ms`;
        if (downlink) label += ` · ${downlink} Mbps`;
        else if (effectiveType) label += ` · ${effectiveType.toUpperCase()}`;
        setInternetStatus("ok");
        setInternetLabel(label);
      } catch {
        // fetch throws on network error even with no-cors
        setInternetStatus("error");
        setInternetLabel("Connection check failed – please check your network");
      }
    };

    check();

    const handleOnline = () => check();
    const handleOffline = () => {
      setInternetStatus("error");
      setInternetLabel("No internet connection detected");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
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
          <CameraPreview videoRef={videoRef} cameraStatus={cameraStatus} />

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
                status={internetStatus}
                icon={internetStatus === "error" ? "wifi_off" : "wifi"}
                title="Internet Connection"
                badge={
                  internetStatus === "ok"
                    ? { label: "Connected", color: "emerald" }
                    : internetStatus === "error"
                      ? { label: "Issue", color: "red" }
                      : { label: "Checking…", color: "slate" }
                }
                borderBottom
              >
                <p
                  className={`text-xs mt-1 ${
                    internetStatus === "error"
                      ? "text-red-500"
                      : "text-slate-500"
                  }`}
                >
                  {internetLabel || "Measuring connection…"}
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
                {/* Model failed to load – show retry button */}
                {faceModelFailed && (
                  <button
                    onClick={proctoring.retry}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-sm">refresh</span>
                    Retry Loading Models
                  </button>
                )}
                {/* Detection violation hint */}
                {faceCheckStatus === "error" && !faceModelFailed && (
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
              <SpeakerCheck
                speakerState={speakerState}
                onPlay={playSound}
                onMarkAudible={markAudible}
                onReplay={replaySound}
              />
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
