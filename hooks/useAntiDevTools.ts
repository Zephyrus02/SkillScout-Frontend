import { useEffect } from "react";

export function useAntiDevTools(enabled: boolean) {
  useEffect(() => {
    if (!enabled || process.env.NEXT_PUBLIC_APP_ENV !== "production") return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const k = e.keyCode;

      if (
        k === 123 || // F12
        (ctrl && shift && k === 73) || // Ctrl/Cmd+Shift+I — DevTools
        (ctrl && shift && k === 74) || // Ctrl/Cmd+Shift+J — Console
        (ctrl && shift && k === 67) || // Ctrl/Cmd+Shift+C — Inspect Element
        (ctrl && k === 85) || // Ctrl/Cmd+U — View Source
        (e.metaKey && alt && k === 73) || // Cmd+Option+I (Mac)
        (e.metaKey && alt && k === 74) || // Cmd+Option+J (Mac)
        (e.metaKey && alt && k === 67) // Cmd+Option+C (Mac)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
}
