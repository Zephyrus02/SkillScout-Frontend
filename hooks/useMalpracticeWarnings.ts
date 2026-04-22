import { useState, useRef, useEffect, useCallback } from "react";
import type { ActiveWarning } from "@/components/ui/MalpracticeWarningToast";
import { type CombinedViolationType, getWarningMessage } from "./useMediaPipeProctoring";

const MAX_WARNINGS = 3;
const WARNING_COOLDOWN_MS = 11_000;

export interface MalpracticeWarningsOptions {
  violation: CombinedViolationType;
  detectedObjects?: string[];
  onTerminate: () => void;
}

export function useMalpracticeWarnings({
  violation,
  detectedObjects = [],
  onTerminate,
}: MalpracticeWarningsOptions) {
  const [activeWarning, setActiveWarning] = useState<ActiveWarning | null>(null);
  const warningCountRef = useRef(0);
  const [warningCountDisplay, setWarningCountDisplay] = useState(0);
  const lastWarningAtRef = useRef<number>(0);
  const terminatingRef = useRef(false);

  useEffect(() => {
    if (violation === null) return;
    if (terminatingRef.current) return;

    const now = Date.now();
    if (now - lastWarningAtRef.current < WARNING_COOLDOWN_MS) return;

    lastWarningAtRef.current = now;

    // Already gave MAX_WARNINGS warnings → this violation terminates the session
    if (warningCountRef.current >= MAX_WARNINGS) {
      terminatingRef.current = true;
      onTerminate();
      return;
    }

    const newCount = warningCountRef.current + 1;
    warningCountRef.current = newCount;
    setWarningCountDisplay(newCount);

    setActiveWarning({
      id: now,
      type: violation,
      message: getWarningMessage(violation, detectedObjects),
      warningNumber: newCount,
      totalWarnings: MAX_WARNINGS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violation, onTerminate]);

  const clearWarning = useCallback(() => setActiveWarning(null), []);

  return {
    activeWarning,
    warningCountDisplay,
    clearWarning,
    maxWarnings: MAX_WARNINGS,
  };
}
