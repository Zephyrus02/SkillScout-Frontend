import { useEffect, useState, useCallback } from "react";

export type EnvViolationType = "tab_switch" | "left_fullscreen" | null;

export interface EnvProctoringResult {
  violation: EnvViolationType;
  clearViolation: () => void;
}

export function useEnvironmentProctoring(enabled: boolean): EnvProctoringResult {
  const [violation, setViolation] = useState<EnvViolationType>(null);

  useEffect(() => {
    // Only enforce environment proctoring if enabled and in production.
    if (!enabled || process.env.NEXT_PUBLIC_APP_ENV !== "production") {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolation("tab_switch");
      }
    };

    const handleBlur = () => {
      setViolation("tab_switch");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolation("left_fullscreen");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enabled]);

  const clearViolation = useCallback(() => setViolation(null), []);

  return { violation, clearViolation };
}
