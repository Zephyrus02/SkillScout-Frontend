/**
 * useGoogleAuth — Google Sign-In via the official GIS button flow.
 *
 * Renders the official Google button into a ref'd <div>. When the user
 * completes sign-in, `onSuccess` is called with the raw idToken (credential).
 * Pass that token to `authAPI.googleLogin` (AuthContext.googleAuth).
 *
 * Reads NEXT_PUBLIC_GOOGLE_CLIENT_ID from env.
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
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
  const [gisReady, setGisReady] = useState(false);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const buttonRenderedRef = useRef(false);

  // Load the Google Identity Services script once
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      if (window.google) setGisReady(true);
      else existing.addEventListener("load", () => setGisReady(true));
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
      onError?.(new Error("Failed to load Google Identity Services"));
    };
    script.onload = () => setGisReady(true);
    document.head.appendChild(script);
  }, [onError]);

  // Render the button once both GIS is ready and the container is mounted
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!gisReady || !containerEl || !clientId || !window.google) return;
    if (buttonRenderedRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError?.(new Error("No credential received from Google"));
        }
      },
    });

    window.google.accounts.id.renderButton(containerEl, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      width: Math.max(containerEl.offsetWidth || 0, 320),
    });

    buttonRenderedRef.current = true;
  }, [gisReady, containerEl, onSuccess, onError]);

  const googleButtonRef = useCallback((el: HTMLDivElement | null) => {
    if (el) setContainerEl(el);
  }, []);

  return { googleButtonRef };
};
