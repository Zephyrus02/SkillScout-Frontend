/**
 * useMediaPipeProctoring
 *
 * Runs continuous face + object detection on a <video> element using
 * @mediapipe/tasks-vision.  Safe to use alongside any existing camera
 * logic – it only reads pixels from the element, never re-creates the
 * MediaStream.
 *
 * Detects:
 *   • Number of visible faces (0 = away, 1 = ok, >1 = multiple)
 *   • Face turned sideways (ear–nose–ear keypoint ratio)
 *   • Flagged objects: cell phone, book
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { RefObject } from "react";

// ── Public types ────────────────────────────────────────────────────────────

export type ViolationType =
  | "multiple_faces"
  | "no_face"
  | "looking_sideways"
  | "phone_detected"
  | "book_detected"
  | null;

export interface ProctoringResult {
  /** True while the WASM models are still downloading / initialising */
  isLoading: boolean;
  /** True once both models are ready (or when init failed – graceful) */
  isReady: boolean;
  /** True only when both models successfully loaded (false on graceful failure) */
  modelLoaded: boolean;
  faceCount: number;
  isLookingSideways: boolean;
  detectedObjects: string[];
  /** Highest-priority violation at the last detection tick */
  violation: ViolationType;
}

// ── Model URLs ──────────────────────────────────────────────────────────────

const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

const OBJECT_MODEL =
  "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite";

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
  faceCount: 0,
  isLookingSideways: false,
  detectedObjects: [],
  violation: null,
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useMediaPipeProctoring(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
): ProctoringResult {
  const [result, setResult] = useState<ProctoringResult>(() => ({
    ...DEFAULT_RESULT,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceDetRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objDetRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // MediaPipe requires strictly-increasing video timestamps
  const lastTsRef = useRef<number>(0);

  // ── Per-tick detection ────────────────────────────────────────────────────
  const runDetection = useCallback(() => {
    const video = videoRef.current as HTMLVideoElement | null;
    if (
      !video ||
      !faceDetRef.current ||
      !objDetRef.current ||
      video.readyState < 2 ||
      video.videoWidth === 0
    )
      return;

    try {
      // Strictly increasing timestamp
      const raw = performance.now();
      const ts = raw <= lastTsRef.current ? lastTsRef.current + 1 : raw;
      lastTsRef.current = ts;

      // ── Face detection ────────────────────────────────────────────────
      const faceRes = faceDetRef.current.detectForVideo(video, ts);
      const faces: Array<{
        keypoints?: Array<{ x: number; y: number }>;
      }> = faceRes?.detections ?? [];
      const faceCount = faces.length;

      // ── Gaze (sideways) via ear–nose–ear keypoint ratio ───────────────
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
          // Guard div-by-zero for very close keypoints
          const ratio = maxD > 0.01 ? minD / maxD : 1;
          isLookingSideways = ratio < SIDEWAYS_RATIO_THRESHOLD;
        }
      }

      // ── Object detection ──────────────────────────────────────────────
      // Use same timestamp (MediaPipe handles internally per detector)
      const objRes = objDetRef.current.detectForVideo(video, ts);
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

      setResult({
        isLoading: false,
        isReady: true,
        modelLoaded: true,
        faceCount,
        isLookingSideways,
        detectedObjects,
        violation,
      });
    } catch {
      // Silently ignore single-frame decode errors
    }
  }, [videoRef]);

  // ── Lifecycle: load models, start interval ────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      try {
        const { FaceDetector, ObjectDetector, FilesetResolver } =
          await import("@mediapipe/tasks-vision");

        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

        const [faceDetector, objectDetector] = await Promise.all([
          FaceDetector.createFromOptions(vision, {
            baseOptions: { modelAssetPath: FACE_MODEL },
            runningMode: "VIDEO",
            minDetectionConfidence: 0.5,
          }),
          ObjectDetector.createFromOptions(vision, {
            baseOptions: { modelAssetPath: OBJECT_MODEL },
            runningMode: "VIDEO",
            scoreThreshold: 0.5,
          }),
        ]);

        if (cancelled) {
          faceDetector.close();
          objectDetector.close();
          return;
        }

        faceDetRef.current = faceDetector;
        objDetRef.current = objectDetector;

        // Emit "ready" + modelLoaded before first tick so UI can update
        setResult((prev) => ({
          ...prev,
          isLoading: false,
          isReady: true,
          modelLoaded: true,
        }));

        // Run detection every 1 second
        intervalRef.current = setInterval(runDetection, 1000);
      } catch (err) {
        console.warn("[MediaPipe] Failed to initialise proctoring:", err);
        if (!cancelled) {
          // Graceful degradation – unblock the user; modelLoaded stays false
          setResult((prev) => ({
            ...prev,
            isLoading: false,
            isReady: true,
            modelLoaded: false,
            violation: null,
          }));
        }
      }
    })();

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      faceDetRef.current?.close();
      objDetRef.current?.close();
      faceDetRef.current = null;
      objDetRef.current = null;
      lastTsRef.current = 0;
      setResult(DEFAULT_RESULT);
    };
  }, [enabled, runDetection]);

  return result;
}

// ── Helpers (exported for use in pages) ─────────────────────────────────────

export function getViolationLabel(violation: ViolationType): string {
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
    default:
      return "Checking…";
  }
}

export function getWarningMessage(
  violation: ViolationType,
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
    default:
      return "Suspicious activity has been detected in your camera feed.";
  }
}
