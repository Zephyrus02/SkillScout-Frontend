import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  interviewSessionsApi,
  type CreditsBalance,
} from "@/lib/api/interviews";
import { INTERVIEW_TYPES, type InterviewType } from "@/lib/credits";
import { useAntiDevTools } from "@/hooks/useAntiDevTools";
import {
  useMediaPipeProctoring,
  getViolationLabel,
  type CombinedViolationType,
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
   – Interview type selection with credit check
───────────────────────────────────────────────────────────────── */

const SESSION_STORAGE_KEY = "skillscout_interview_session";

/** LiveKit session API + token flow. Off by default — prelaunch opens static room UI only. */
const LIVEKIT_INTERVIEW_API_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_LIVEKIT_INTERVIEW === "true";

async function requestProductionFullscreen(context: string) {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "production") return;
  try {
    if (
      !document.fullscreenElement &&
      document.documentElement.requestFullscreen
    ) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    console.warn(`${context} fullscreen request failed:`, err);
  }
}

/** Interview type selector card */
function InterviewTypeCard({
  typeInfo,
  selected,
  creditsRemaining,
  onClick,
}: {
  typeInfo: (typeof INTERVIEW_TYPES)[number];
  selected: boolean;
  creditsRemaining: number | null;
  onClick: () => void;
}) {
  const canAfford =
    creditsRemaining === null || creditsRemaining >= typeInfo.cost;

  return (
    <button
      type="button"
      onClick={canAfford ? onClick : undefined}
      className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
        selected
          ? "border-blue-500 bg-blue-50"
          : canAfford
            ? "border-gray-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer"
            : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selected ? (
            <span className="material-icons text-blue-500 text-base">
              radio_button_checked
            </span>
          ) : (
            <span className="material-icons text-gray-300 text-base">
              radio_button_unchecked
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {typeInfo.label}
            </p>
            <p className="text-xs text-slate-500">{typeInfo.description}</p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-sm font-bold text-slate-700">
            {typeInfo.cost}{" "}
            <span className="text-xs font-normal text-slate-500">credits</span>
          </p>
          <p className="text-[10px] text-slate-400">{typeInfo.duration}</p>
          {!canAfford && (
            <p className="text-[10px] text-red-500 font-medium">Insufficient</p>
          )}
        </div>
      </div>
    </button>
  );
}

function StartInterviewButton({
  allOk,
  canAfford,
  onStarted,
  useLiveKitSessionApi,
  onEnterStaticRoom,
  selectedType,
}: {
  allOk: boolean;
  canAfford: boolean;
  onStarted: (sessionId: string, token: string, livekitUrl: string) => void;
  useLiveKitSessionApi?: boolean;
  onEnterStaticRoom?: () => void;
  selectedType: InterviewType;
}) {
  const [loading, setLoading] = useState(false);

  /** LiveKit API path must pass all readiness checks AND have credits; static room can always enter. */
  const mayEnter = useLiveKitSessionApi ? allOk && canAfford : true;

  const handleClick = async () => {
    if (!mayEnter || loading) return;

    await requestProductionFullscreen("Prelaunch");

    if (!useLiveKitSessionApi) {
      onEnterStaticRoom?.();
      return;
    }
    setLoading(true);
    try {
      const res = await interviewSessionsApi.createSession({
        interviewType: selectedType,
        jobRole: "Software Engineer",
        jobDescription: "Mock interview session",
        experienceLevel: "mid-level",
      });
      if (!res.success || !res.data?.token || !res.data?.livekitUrl) {
        throw new Error("Invalid response from server");
      }
      onStarted(
        res.data.sessionId ?? res.data.id,
        res.data.token,
        res.data.livekitUrl,
      );
    } catch (e) {
      if (
        e instanceof Error &&
        (e as Error & { status?: number }).status === 402
      ) {
        toast.error(
          "Not enough credits. Upgrade your plan or wait for your credits to reset next month.",
        );
      } else if (e instanceof Error && e.message.includes("402")) {
        toast.error(
          "Not enough credits. Upgrade your plan or wait for your credits to reset next month.",
        );
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to start session");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!mayEnter || loading}
      className={`w-full font-semibold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
        mayEnter && !loading
          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0"
          : "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
      }`}
      aria-disabled={!mayEnter || loading}
    >
      {loading ? (
        "Starting…"
      ) : (
        <>
          Enter Interview Room
          <span className="material-icons text-lg">arrow_forward</span>
        </>
      )}
    </button>
  );
}

export default function PrelaunchPage() {
  const router = useRouter();

  // ── Interview type + credits ─────────────────────────────
  const [selectedType, setSelectedType] = useState<InterviewType>("TECHNICAL");
  const [creditsData, setCreditsData] = useState<CreditsBalance | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    interviewSessionsApi
      .getCredits()
      .then((res) => {
        if (res?.success && res.data) setCreditsData(res.data);
      })
      .catch(() => {
        /* non-fatal: credit check still enforced server-side */
      })
      .finally(() => setCreditsLoading(false));
  }, []);

  const selectedTypeInfo = INTERVIEW_TYPES.find(
    (t) => t.type === selectedType,
  )!;
  const creditsRemaining = creditsData?.creditsRemaining ?? null;
  const canAfford =
    creditsRemaining === null || creditsRemaining >= selectedTypeInfo.cost;
  const canAffordAny =
    creditsRemaining === null ||
    INTERVIEW_TYPES.some((t) => creditsRemaining >= t.cost);

  // ── Camera ───────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>("checking");
  const [cameraLabel, setCameraLabel] = useState<string>("");

  useAntiDevTools(true);

  // ── MediaPipe face / object proctoring ───────────────────
  const proctoring = useMediaPipeProctoring(videoRef, cameraStatus !== "error");

  /** Once the user has a valid clear reading on prelaunch, keep the row "Clear"
   *  so brief movement / dropout does not flip back to error or "Looking…". */
  const [facePrelaunchCleared, setFacePrelaunchCleared] = useState(false);

  // ── Fullscreen enforcement (no warnings — just prompt to re-enter) ────────
  const [needsFullscreen, setNeedsFullscreen] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== "production") return;
    requestAnimationFrame(() => {
      if (!document.fullscreenElement) setNeedsFullscreen(true);
    });
    const onFsChange = () => {
      setNeedsFullscreen(!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleEnterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn("Prelaunch fullscreen request failed:", err);
      setNeedsFullscreen(false);
    });
  }, []);

  useEffect(() => {
    if (facePrelaunchCleared) return;
    if (proctoring.isLoading || !proctoring.isReady || !proctoring.modelLoaded)
      return;
    if (proctoring.violation === null && proctoring.faceCount === 1) {
      queueMicrotask(() => setFacePrelaunchCleared(true));
    }
  }, [
    facePrelaunchCleared,
    proctoring.isLoading,
    proctoring.isReady,
    proctoring.modelLoaded,
    proctoring.violation,
    proctoring.faceCount,
  ]);

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
  } else if (
    facePrelaunchCleared ||
    (proctoring.violation === null && proctoring.faceCount === 1)
  ) {
    faceCheckStatus = "ok";
    faceCheckBadgeLabel = "Clear";
    faceCheckDescription =
      "One face detected, looking at screen, no banned objects.";
  } else if (proctoring.faceCount === 0 || proctoring.violation === "no_face") {
    faceCheckStatus = "checking";
    faceCheckBadgeLabel = "Looking…";
    faceCheckDescription = "Please position your face within the camera frame.";
  } else {
    faceCheckStatus = "error";
    faceCheckBadgeLabel = "Issue Detected";
    faceCheckDescription = getViolationLabel(
      proctoring.violation as CombinedViolationType,
    );
  }

  // true when all retry attempts failed (distinct from a detection-violation error)
  const faceModelFailed = proctoring.isReady && !proctoring.modelLoaded;

  // ── Microphone ───────────────────────────────────────────
  const [micPermission, setMicPermission] = useState<CheckStatus>("checking");
  const [micQuality, setMicQuality] = useState<MicQuality>("listening");
  const [micLevel, setMicLevel] = useState(0);
  const [micLabel, setMicLabel] = useState<string>("");
  const [micCountdown, setMicCountdown] = useState(3);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  // ── Device compatibility ─────────────────────────────────
  const [deviceStatus, setDeviceStatus] = useState<CheckStatus>("checking");
  const [deviceLabel, setDeviceLabel] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const ua = navigator.userAgent;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          ua,
        );
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
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    let cancelled = false;
    let acquiredStream: MediaStream | null = null;
    const videoEl = videoRef.current;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        acquiredStream = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
        const track = stream.getVideoTracks()[0];
        setCameraLabel(track?.label || "Camera");
        setCameraStatus("ok");
      } catch {
        if (!cancelled) {
          setCameraStatus("error");
          setCameraLabel("Access denied");
        }
      }
    })();

    return () => {
      cancelled = true;
      acquiredStream?.getTracks().forEach((t) => t.stop());
      if (videoEl) {
        videoEl.srcObject = null;
      }
    };
  }, []);

  // ── Mic init + AnalyserNode + quality sampling ───────────
  useEffect(() => {
    let cancelled = false;
    let acquiredStream: MediaStream | null = null;
    let audioCtx: AudioContext | undefined;
    let analyser: AnalyserNode | undefined;
    let source: MediaStreamAudioSourceNode | undefined;
    const SAMPLE_WINDOW_MS = 3000;
    const PASS_THRESHOLD = 6;
    const SAMPLE_INTERVAL_MS = 80;
    let samples: number[] = [];
    let windowStart = 0;
    let sampleTimer: ReturnType<typeof setInterval> | undefined;
    let countdownTimer: ReturnType<typeof setInterval> | undefined;
    let restartTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const clearQualityTimers = () => {
      if (sampleTimer !== undefined) {
        clearInterval(sampleTimer);
        sampleTimer = undefined;
      }
      if (countdownTimer !== undefined) {
        clearInterval(countdownTimer);
        countdownTimer = undefined;
      }
      if (restartTimeoutId !== undefined) {
        clearTimeout(restartTimeoutId);
        restartTimeoutId = undefined;
      }
    };

    const startQualityWindow = () => {
      if (cancelled) return;
      clearQualityTimers();
      samples = [];
      windowStart = Date.now();
      setMicCountdown(Math.ceil(SAMPLE_WINDOW_MS / 1000));

      countdownTimer = setInterval(() => {
        if (cancelled) return;
        const elapsed = Date.now() - windowStart;
        const remaining = Math.max(
          0,
          Math.ceil((SAMPLE_WINDOW_MS - elapsed) / 1000),
        );
        setMicCountdown(remaining);
      }, 500);

      sampleTimer = setInterval(() => {
        if (cancelled || !analyser) return;
        const d = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(d);
        const avg = d.reduce((a, b) => a + b, 0) / d.length;
        const scaled = Math.min(98, Math.max(0, (avg / 255) * 100 * 3.5));
        samples.push(scaled);

        const elapsed = Date.now() - windowStart;
        if (elapsed >= SAMPLE_WINDOW_MS) {
          clearQualityTimers();
          const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
          if (mean >= PASS_THRESHOLD) {
            if (!cancelled) setMicQuality("passed");
          } else {
            restartTimeoutId = setTimeout(() => {
              if (!cancelled) startQualityWindow();
            }, 500);
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
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        acquiredStream = stream;
        micStreamRef.current = stream;
        const track = stream.getAudioTracks()[0];
        setMicLabel(track?.label || "Microphone");
        setMicPermission("ok");

        const ctx = new AudioContext();
        audioCtx = ctx;
        const an = ctx.createAnalyser();
        analyser = an;
        an.fftSize = 256;
        const src = ctx.createMediaStreamSource(stream);
        source = src;
        src.connect(an);

        const data = new Uint8Array(an.frequencyBinCount);
        const tick = () => {
          if (cancelled) return;
          an.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setMicLevel(Math.min(98, Math.max(2, (avg / 255) * 100 * 3.5)));
          animFrameRef.current = requestAnimationFrame(tick);
        };
        tick();

        startQualityWindow();
      } catch {
        if (!cancelled) {
          setMicPermission("error");
          setMicLabel("Access denied");
        }
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      clearQualityTimers();
      acquiredStream?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      try {
        source?.disconnect();
      } catch {
        /* ignore */
      }
      void audioCtx?.close();
    };
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
        await fetch("https://www.gstatic.com/generate_204", {
          method: "HEAD",
          cache: "no-store",
          mode: "no-cors",
        });
        const ping = Math.round(performance.now() - pingStart);
        interface NetworkConnection {
          downlink?: number;
          effectiveType?: string;
        }
        interface NetworkNavigator {
          connection?: NetworkConnection;
          mozConnection?: NetworkConnection;
          webkitConnection?: NetworkConnection;
        }
        const netNav = navigator as unknown as NetworkNavigator;
        const conn =
          netNav.connection ?? netNav.mozConnection ?? netNav.webkitConnection;
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

  // ── Speaker test ─────────────────────────────────────────
  const playSound = () => {
    const ensureAudio = () => {
      if (audioRef.current) return audioRef.current;
      audioRef.current = new Audio("/pl_test.opus");
      audioRef.current.onerror = () => {
        audioRef.current = new Audio("/pl_test.wav");
      };
      return audioRef.current;
    };

    const audio = ensureAudio();
    audio.currentTime = 0;
    void audio.play();
    setSpeakerState("playing");
    audio.onended = () => {
      // Keep showing "playing" state – user decides audible / replay
    };
  };

  const markAudible = () => setSpeakerState("audible");
  const replaySound = () => playSound();

  return (
    <>
      {needsFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <span className="material-icons text-5xl mb-4 block text-blue-400">
              fullscreen
            </span>
            <h2 className="text-xl font-semibold mb-2">Fullscreen Required</h2>
            <p className="text-slate-300 mb-6 text-sm">
              Your interview session must run in fullscreen mode. Please enter
              fullscreen to continue.
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
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-5xl overflow-hidden flex flex-col relative z-10">
          {/* ── System Checks + Camera ── */}
          <div className="flex flex-col md:flex-row min-h-[580px]">
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
                      : deviceStatus === "error"
                        ? { label: "Incompatible", color: "red" }
                        : { label: "Checking…", color: "slate" }
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
                  {faceModelFailed && (
                    <button
                      onClick={proctoring.retry}
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span className="material-icons text-sm">refresh</span>
                      Retry Loading Models
                    </button>
                  )}
                  {faceCheckStatus === "error" && !faceModelFailed && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Ensure only you are visible, you are looking at the
                      screen, and no phones or books are in view.
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
                        : {
                            label: `Listening… ${micCountdown}s`,
                            color: "blue",
                          }
                  }
                  borderBottom
                  spinnerIcon={
                    micPermission === "ok" && micQuality !== "passed"
                  }
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
                        {micLevel < 15
                          ? "Low"
                          : micLevel < 55
                            ? "Fair"
                            : "Good"}
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
                {allOk && canAfford ? (
                  <div className="flex items-center gap-2 mb-4 bg-emerald-50/70 border border-emerald-100 p-3 rounded-lg">
                    <span className="material-icons text-emerald-500 text-lg">
                      check_circle
                    </span>
                    <p className="text-xs text-emerald-800 font-medium">
                      System compatibility verified. You are ready to join.
                    </p>
                  </div>
                ) : !canAfford && !creditsLoading ? (
                  <div className="flex items-center gap-2 mb-4 bg-red-50 border border-red-100 p-3 rounded-lg">
                    <span className="material-icons text-red-500 text-lg">
                      credit_card_off
                    </span>
                    <p className="text-xs text-red-800 font-medium">
                      Not enough credits for this interview type.
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

                <StartInterviewButton
                  allOk={allOk}
                  canAfford={canAfford}
                  selectedType={selectedType}
                  useLiveKitSessionApi={LIVEKIT_INTERVIEW_API_ENABLED}
                  onEnterStaticRoom={() =>
                    router.push("/dashboard/interview?skipLiveKit=true")
                  }
                  onStarted={(sessionId, token, livekitUrl) => {
                    try {
                      sessionStorage.setItem(
                        SESSION_STORAGE_KEY,
                        JSON.stringify({ sessionId, token, livekitUrl }),
                      );
                    } catch {
                      // ignore
                    }
                    router.push(
                      `/dashboard/interview?sessionId=${encodeURIComponent(sessionId)}`,
                    );
                  }}
                />
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
      </div>
    </>
  );
}
