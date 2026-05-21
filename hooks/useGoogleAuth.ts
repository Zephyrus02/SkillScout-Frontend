/**
 * useGoogleAuth — Google Sign-In via GIS renderButton (OAuth popup mode).
 *
 * Uses `google.accounts.id.renderButton` with `ux_mode: "popup"` which opens
 * a standard Google OAuth popup. This works regardless of ITP/third-party
 * cookie restrictions that break the One Tap prompt flow.
 *
 * Strategy: render the official GIS button into a hidden off-screen div, then
 * programmatically click it when the user clicks our styled button. This gives
 * us full control over the visual design while delegating the auth popup to GIS.
 *
 * Reads NEXT_PUBLIC_GOOGLE_CLIENT_ID from env.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options?: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface UseGoogleAuthProps {
  onSuccess: (idToken: string) => void;
  onError?: (error: Error) => void;
}

export const useGoogleAuth = ({ onSuccess, onError }: UseGoogleAuthProps) => {
  const [gisReady, setGisReady] = useState(
    () => typeof window !== "undefined" && !!window.google,
  );
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonRenderedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Keep refs current so the GIS callback always calls the latest version
  // without needing to re-initialize the SDK on every render.
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Load the GIS script once
  useEffect(() => {
    if (window.google) {
      setGisReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener("load", () => setGisReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      toast.error(
        "Failed to load Google Sign-In. Please check your internet connection.",
      );
      onErrorRef.current?.(new Error("Failed to load Google Identity Services"));
    };
    script.onload = () => setGisReady(true);
    document.head.appendChild(script);
  }, []);

  // Once GIS is ready, create a hidden off-screen container, render the
  // official GIS button into it, then keep a ref to that container so we
  // can forward clicks from our styled button.
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!gisReady || !clientId || !window.google) return;
    if (buttonRenderedRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: "popup",
      callback: (response) => {
        if (response.credential) {
          onSuccessRef.current(response.credential);
        } else {
          onErrorRef.current?.(new Error("No credential received from Google"));
        }
      },
    });

    // Hidden container — positioned off-screen so it doesn't affect layout
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:200px;height:48px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(container);
    hiddenContainerRef.current = container;

    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 200,
    });

    // Re-enable pointer events on the container only (not visible to user)
    container.style.pointerEvents = "auto";

    buttonRenderedRef.current = true;

    return () => {
      container.remove();
      hiddenContainerRef.current = null;
      buttonRenderedRef.current = false;
    };
  }, [gisReady]);

  // Click the hidden GIS button — GIS intercepts the click and opens its popup
  const triggerGoogleSignIn = useCallback(() => {
    const container = hiddenContainerRef.current;
    if (!container) {
      toast.error("Google Sign-In is not ready yet. Please try again.");
      return;
    }
    const btn = container.querySelector<HTMLElement>("div[role=button]") ??
      container.querySelector<HTMLElement>("button") ??
      container.firstElementChild as HTMLElement | null;
    btn?.click();
  }, []);

  return { triggerGoogleSignIn, gisReady };
};
