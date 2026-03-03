/**
 * mediapipe-singleton.ts
 *
 * Module-level singleton that:
 *   • Loads FaceDetector + ObjectDetector exactly once per browser session.
 *   • Retries up to MAX_ATTEMPTS times with exponential back-off on failure.
 *   • Keeps the detector instances alive across Next.js client-side navigations
 *     so the prelaunch page and the interview room share the same loaded models.
 *   • Exposes a simple subscribe/unsubscribe API so multiple hook instances
 *     can react to state transitions.
 */

// ── Model / WASM URLs ───────────────────────────────────────────────────────

export const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

export const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

export const OBJECT_MODEL =
  "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite";

// ── Types ───────────────────────────────────────────────────────────────────

export type SingletonState = "idle" | "loading" | "loaded" | "failed";

export interface SingletonSnapshot {
  state: SingletonState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  faceDetector: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objectDetector: any | null;
  /** How many load attempts have been made (1-based) */
  attempt: number;
  /** Total allowed attempts */
  maxAttempts: number;
}

type Listener = (snap: SingletonSnapshot) => void;

// ── Constants ───────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 3;
// Exponential back-off delays (ms) before each retry
const RETRY_DELAYS_MS = [1_000, 2_000, 4_000];

// ── Singleton state ─────────────────────────────────────────────────────────

let state: SingletonState = "idle";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let faceDetector: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let objectDetector: any | null = null;
let attempt = 0;
let loadPromise: Promise<void> | null = null;

const listeners = new Set<Listener>();

// ── Helpers ─────────────────────────────────────────────────────────────────

function snapshot(): SingletonSnapshot {
  return {
    state,
    faceDetector,
    objectDetector,
    attempt,
    maxAttempts: MAX_ATTEMPTS,
  };
}

function notify() {
  const snap = snapshot();
  listeners.forEach((cb) => cb(snap));
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// ── Core loader (single Promise, shared across callers) ─────────────────────

async function doLoad(): Promise<void> {
  state = "loading";
  attempt = 0;
  notify();

  const { FaceDetector, ObjectDetector, FilesetResolver } =
    await import("@mediapipe/tasks-vision");

  const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    attempt = i + 1;
    notify();

    try {
      const [fd, od] = await Promise.all([
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

      faceDetector = fd;
      objectDetector = od;
      state = "loaded";
      notify();
      return; // success – exit retry loop
    } catch (err) {
      console.warn(
        `[MediaPipe] Load attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        err,
      );

      if (i < MAX_ATTEMPTS - 1) {
        state = "loading"; // still "loading" during retry delay
        notify();
        await sleep(RETRY_DELAYS_MS[i]);
      }
    }
  }

  // All attempts exhausted
  state = "failed";
  faceDetector = null;
  objectDetector = null;
  notify();
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Request model loading.  Safe to call multiple times – the actual load
 * only runs once; subsequent calls all share the same in-flight Promise.
 */
export function ensureLoaded(): Promise<void> {
  if (state === "loaded") return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = doLoad().catch(() => {
    // errors are captured inside doLoad; this prevents unhandled rejection
  });
  return loadPromise;
}

/** Return a synchronous snapshot of current state. */
export function getSnapshot(): SingletonSnapshot {
  return snapshot();
}

/** Subscribe to state changes. Returns an unsubscribe function. */
export function subscribe(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/**
 * Reset the singleton so it can be re-tried (e.g. user presses "retry").
 * Also frees any loaded detector instances.
 */
export function reset(): void {
  faceDetector?.close?.();
  objectDetector?.close?.();
  faceDetector = null;
  objectDetector = null;
  state = "idle";
  attempt = 0;
  loadPromise = null;
  notify();
}
