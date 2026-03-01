/**
 * SocialAuthButtons — Google + GitHub sign-in buttons.
 *
 * Google strategy (same as the Vite frontend):
 *   - Renders a custom-styled pill button matching the site design.
 *   - Overlays the invisible official GIS button on top (opacity-0, absolute).
 *   - Clicks on the visual button fall through (pointer-events-none) and land
 *     on the GIS iframe, which fires the credential callback in useGoogleAuth.
 *
 * GitHub strategy:
 *   - Calls onGitHubClick if provided, otherwise shows a "coming soon" toast.
 */

import { toast } from "sonner";

/** Google "G" logo SVG — official four-colour palette */
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 shrink-0"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/** GitHub mark SVG */
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

interface SocialAuthButtonsProps {
  /** Callback ref for the div into which the GIS SDK renders its invisible button */
  googleButtonRef?: (el: HTMLDivElement | null) => void;
  /** Optional handler for GitHub. If omitted, a "coming soon" toast is shown. */
  onGitHubClick?: () => void;
  /** Show a spinner overlay while any auth operation is in progress */
  loading?: boolean;
}

export default function SocialAuthButtons({
  googleButtonRef,
  onGitHubClick,
  loading,
}: SocialAuthButtonsProps) {
  const handleGitHub = () => {
    if (onGitHubClick) {
      onGitHubClick();
    } else {
      toast.info("GitHub sign-in coming soon!");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Google button ──────────────────────────────────────────────── */}
      {googleButtonRef ? (
        <div className="relative w-full min-h-[48px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          {/*
            Visual layer — in NORMAL FLOW so the container gets height from it.
            pointer-events-none so clicks fall through onto the GIS iframe below.
          */}
          <div
            className="flex items-center justify-center gap-3 py-3 px-4 min-h-[48px] pointer-events-none select-none"
            aria-hidden
          >
            <GoogleIcon />
            <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
              Continue with Google
            </span>
          </div>

          {/*
            Invisible GIS iframe (absolutely covers the visual layer, z-10).
            The GIS SDK renders its iframe here; clicks on the visual button
            above fall through (pointer-events-none) and land on this iframe.
          */}
          <div
            ref={googleButtonRef}
            className="absolute inset-0 z-10 opacity-0 [&>div]:!w-full [&>div]:!h-full [&>div]:!min-h-[48px] [&>div]:!flex [&>div]:!items-center [&>div]:!justify-center [&_iframe]:!w-full [&_iframe]:!min-h-[48px]"
          />

          {/* Spinner while auth is in-flight */}
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-slate-800/70">
              <span className="material-icons animate-spin text-[20px] text-slate-500">
                autorenew
              </span>
            </div>
          )}
        </div>
      ) : (
        /* GIS script not yet loaded — show a styled but non-interactive placeholder */
        <div className="flex items-center justify-center gap-3 h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60 cursor-not-allowed select-none">
          <GoogleIcon />
          <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
            Continue with Google
          </span>
        </div>
      )}

      {/* ── GitHub button ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleGitHub}
        disabled={loading}
        className="flex items-center justify-center gap-3 h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <GitHubIcon />
        <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
          Continue with GitHub
        </span>
      </button>
    </div>
  );
}
