/**
 * useMediaPipeProctoring
 *
 * Runs continuous face + object detection on a <video> element using the
 * module-level singleton from lib/mediapipe-singleton.ts.
 *
 * Key properties:
 *   • Models are loaded ONCE per browser session and reused across page
 *     navigations (prelaunch → interview room).
 *   • On failure the singleton retries up to 3 times with exponential back-off
 *     (1 s → 2 s → 4 s).  If all attempts fail, modelLoaded is false.
 *   • This hook only attaches / detaches the detection interval; it never
 *     closes the underlying detectors.
 *
 * Detects:
 *   • Number of visible faces (0 = away, 1 = ok, >1 = multiple)
 *   • Face turned sideways (ear–nose–ear keypoint ratio)
 *   • Flagged objects: cell phone, book
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { RefObject } from "react";
import {
  ensureLoaded,
  subscribe,
  getSnapshot,
  reset,
} from "@/lib/mediapipe-singleton";

// ── Public types ────────────────────────────────────────────────────────────

export type ViolationType =
  | "multiple_faces"
  | "no_face"
  | "looking_sideways"
  | "phone_detected"
  | "book_detected"
  | null;

import type { EnvViolationType } from "./useEnvironmentProctoring";
export type CombinedViolationType = ViolationType | EnvViolationType;

export interface ProctoringResult {
  /** True while the WASM models are still downloading / initialising */
  isLoading: boolean;
  /** True once both models are ready OR all retries have failed */
  isReady: boolean;
  /** True only when both models loaded successfully */
  modelLoaded: boolean;
  /** Which retry attempt is currently in progress (1-based) */
  retryAttempt: number;
  /** Maximum number of attempts that will be made */
  maxRetries: number;
  faceCount: number;
  isLookingSideways: boolean;
  detectedObjects: string[];
  /** Highest-priority violation at the last detection tick */
  violation: ViolationType;
}

// ── Constants ───────────────────────────────────────────────────────────────

// COCO class names to flag (lowercase, substring match)
const FLAGGED_OBJECT_KEYWORDS = ["cell phone", "book"];

/**
 * Ratio threshold for sideways-gaze detection.
 * We compare (min ear-to-nose dist) / (max ear-to-nose dist).
 * A frontal face gives ~1.0; a strongly turned face gives <0.3.
 */
const SIDEWAYS_RATIO_THRESHOLD = 0.28;

// ── Default / no-op result ──────────────────────────────────────────────────

const DEFAULT_RESULT: ProctoringResult = {
  isLoading: true,
  isReady: false,
  modelLoaded: false,
  retryAttempt: 0,
  maxRetries: 3,
  faceCount: 0,
  isLookingSideways: false,
  detectedObjects: [],
  violation: null,
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useMediaPipeProctoring(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
): ProctoringResult & { retry: () => void } {
  const [result, setResult] = useState<ProctoringResult>(() => {
    // Hydrate immediately from singleton if models are already cached
    const snap = getSnapshot();
    if (snap.state === "loaded") {
      return {
        ...DEFAULT_RESULT,
        isLoading: false,
        isReady: true,
        modelLoaded: true,
        retryAttempt: snap.attempt,
        maxRetries: snap.maxAttempts,
      };
    }
    if (snap.state === "failed") {
      return {
        ...DEFAULT_RESULT,
        isLoading: false,
        isReady: true,
        modelLoaded: false,
        retryAttempt: snap.attempt,
        maxRetries: snap.maxAttempts,
      };
    }
    return {
      ...DEFAULT_RESULT,
      retryAttempt: snap.attempt,
      maxRetries: snap.maxAttempts,
    };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTsRef = useRef<number>(0);

  // ── Per-tick detection ────────────────────────────────────────────────────
  const runDetection = useCallback(() => {
    const snap = getSnapshot();
    const video = videoRef.current as HTMLVideoElement | null;
    if (
      !video ||
      !snap.faceDetector ||
      !snap.objectDetector ||
      video.readyState < 2 ||
      video.videoWidth === 0
    )
      return;

    try {
      const raw = performance.now();
      const ts = raw <= lastTsRef.current ? lastTsRef.current + 1 : raw;
      lastTsRef.current = ts;

      // ── Face detection ────────────────────────────────────────────────
      const faceRes = snap.faceDetector.detectForVideo(video, ts);
      const faces: Array<{
        keypoints?: Array<{ x: number; y: number }>;
      }> = faceRes?.detections ?? [];
      const faceCount = faces.length;

      // ── Gaze via ear–nose–ear keypoint ratio ──────────────────────────
      // blaze_face_short_range keypoints:
      //   0: right eye  1: left eye  2: nose tip
      //   3: mouth      4: right ear 5: left ear
      let isLookingSideways = false;
      if (faceCount === 1) {
        const kp = faces[0].keypoints ?? [];
        if (kp.length >= 6) {
          const nose = kp[2];
          const rEar = kp[4];
          const lEar = kp[5];
          const leftDist = Math.abs(nose.x - lEar.x);
          const rightDist = Math.abs(nose.x - rEar.x);
          const maxD = Math.max(leftDist, rightDist);
          const minD = Math.min(leftDist, rightDist);
          const ratio = maxD > 0.01 ? minD / maxD : 1;
          isLookingSideways = ratio < SIDEWAYS_RATIO_THRESHOLD;
        }
      }

      // ── Object detection ──────────────────────────────────────────────
      const objRes = snap.objectDetector.detectForVideo(video, ts);
      const detectedObjects: string[] = [];
      for (const det of objRes?.detections ?? []) {
        for (const cat of det.categories ?? []) {
          const name: string = (cat.categoryName ?? "").toLowerCase();
          if (
            FLAGGED_OBJECT_KEYWORDS.some((kw) => name.includes(kw)) &&
            cat.score >= 0.5
          ) {
            if (!detectedObjects.includes(cat.categoryName)) {
              detectedObjects.push(cat.categoryName);
            }
          }
        }
      }

      // ── Primary violation (priority order) ───────────────────────────
      let violation: ViolationType = null;
      if (faceCount > 1) {
        violation = "multiple_faces";
      } else if (faceCount === 0) {
        violation = "no_face";
      } else if (isLookingSideways) {
        violation = "looking_sideways";
      } else if (detectedObjects.length > 0) {
        const n = detectedObjects[0].toLowerCase();
        violation = n.includes("phone") ? "phone_detected" : "book_detected";
      }

      setResult((prev) => ({
        ...prev,
        isLoading: false,
        isReady: true,
        modelLoaded: true,
        faceCount,
        isLookingSideways,
        detectedObjects,
        violation,
      }));
    } catch {
      // Silently ignore single-frame decode errors
    }
  }, [videoRef]);

  // ── Start / stop detection interval ──────────────────────────────────────
  const startInterval = useCallback(() => {
    if (intervalRef.current) return;
    lastTsRef.current = 0;
    intervalRef.current = setInterval(runDetection, 1000);
  }, [runDetection]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Retry helper exposed to UI ────────────────────────────────────────────
  const retry = useCallback(() => {
    reset();
    setResult({ ...DEFAULT_RESULT });
    ensureLoaded();
  }, []);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribe((snap) => {
      if (snap.state === "loaded") {
        setResult((prev) => ({
          ...prev,
          isLoading: false,
          isReady: true,
          modelLoaded: true,
          retryAttempt: snap.attempt,
          maxRetries: snap.maxAttempts,
        }));
        startInterval();
      } else if (snap.state === "failed") {
        setResult((prev) => ({
          ...prev,
          isLoading: false,
          isReady: true,
          modelLoaded: false,
          retryAttempt: snap.attempt,
          maxRetries: snap.maxAttempts,
        }));
        stopInterval();
      } else {
        // "loading" – show attempt progress
        setResult((prev) => ({
          ...prev,
          isLoading: true,
          isReady: false,
          retryAttempt: snap.attempt,
          maxRetries: snap.maxAttempts,
        }));
      }
    });

    // Already loaded? Start immediately without waiting for subscribe.
    // State is already hydrated by the useState initializer, so just kick
    // off the detection interval without triggering a redundant setState.
    const snap = getSnapshot();
    if (snap.state === "loaded") {
      startInterval();
    } else {
      ensureLoaded(); // no-op if already loading
    }

    return () => {
      unsubscribe();
      stopInterval();
      lastTsRef.current = 0;
    };
  }, [enabled, startInterval, stopInterval]);

  return { ...result, retry };
}

// ── Helpers (exported for use in pages) ─────────────────────────────────────

export function getViolationLabel(violation: CombinedViolationType): string {
  switch (violation) {
    case "multiple_faces":
      return "Multiple faces detected";
    case "no_face":
      return "No face detected – please stay in frame";
    case "looking_sideways":
      return "Please face the camera directly";
    case "phone_detected":
      return "Mobile phone detected";
    case "book_detected":
      return "Reference material (book) detected";
    case "tab_switch":
      return "Tab or window switch detected";
    case "left_fullscreen":
      return "Exited full screen mode";
    default:
      return "Checking…";
  }
}

export function getWarningMessage(
  violation: CombinedViolationType,
  objects: string[],
): string {
  switch (violation) {
    case "multiple_faces":
      return "Multiple faces have been detected in your camera feed. Please ensure you are alone in the room during the interview.";
    case "no_face":
      return "Your face is no longer visible. Please remain in front of the camera throughout the interview.";
    case "looking_sideways":
      return "You appear to be looking away from the screen. Please maintain eye contact with the camera and focus on the interview.";
    case "phone_detected":
      return `A mobile phone has been detected in your camera feed (${objects.join(", ")}). Please remove all devices from view.`;
    case "book_detected":
      return `Reference material has been detected in your camera feed (${objects.join(", ")}). Please remove all books and notes from view.`;
    case "tab_switch":
      return "You have switched tabs or windows. This is considered malpractice. Please remain on the interview screen.";
    case "left_fullscreen":
      return "You have exited full screen mode. This is considered malpractice. Please remain in full screen for the duration of the interview.";
    default:
      return "Suspicious activity has been detected in your camera feed.";
  }
}
