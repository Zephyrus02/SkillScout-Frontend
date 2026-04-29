# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Production build (TypeScript errors ignored — see next.config.ts)
pnpm start        # Serve production build
pnpm lint         # ESLint (Next.js config)
pnpm doc          # Run react-doctor for component analysis
```

No test suite is configured. There is no single-test command.

## Environment Variables

Copy `.env.example` to `.env.local`. Required vars:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST origin (default `http://localhost:5001`) |
| `NEXT_PUBLIC_API_BASE_URL` | Same as above — some auth code reads this key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_APP_ENV` | `development` or `production` (proctoring/fullscreen only active in `production`) |
| `NEXT_PUBLIC_ENABLE_LIVEKIT_INTERVIEW` | Set `true` to enable the LiveKit session API on the prelaunch page |
| `INDEXNOW_KEY` | Served as `/{key}.txt` by middleware for IndexNow verification |

## Architecture

### Routing (Pages Router)

This is a **Next.js Pages Router** app (not App Router). All routes live in `pages/`.

Key route groups:
- `/` — public landing page
- `/auth/*` — login, signup, email verify, GitHub OAuth callback
- `/profile-setup` — onboarding wizard (required before `/dashboard` access)
- `/dashboard/*` — protected candidate area (overview, practice, prelaunch, interview, analysis, history, goals, weak-areas, settings)
- `/admin/*` — admin-only area
- `/pricing`, `/about`, `/contact`, `/resources`, `/legal/*` — public marketing pages

### Auth & Session Management

Auth is handled entirely client-side with a dual-storage security model:
- **Access tokens**: in-memory only (`lib/token-storage.ts`) — never persisted, cleared on page close
- **Refresh tokens**: HttpOnly cookie managed by the backend
- **Session marker**: a random UUID stored in `localStorage` (no PII) to know whether to attempt a token refresh on mount

`AuthContext` (`contexts/AuthContext.tsx`) is the single source of truth. It wraps the whole app (via `_app.tsx`) and exposes `useAuth()`. The context handles login, signup, Google OAuth, GitHub OAuth callback, logout, and the on-mount token refresh cycle.

`ProtectedRoute` (`components/auth/ProtectedRoute.tsx`) wraps every dashboard and admin page. It redirects unauthenticated users to `/auth/login?redirect=<current-path>` and redirects users with incomplete onboarding (`user.onboardingCompleted === false`) to `/profile-setup`.

Post-login routing logic lives in `navigateAfterAuth` inside `AuthContext`:
- Admin users → `/admin/dashboard`
- Candidates without a completed profile → `/profile-setup`
- Candidates OK → `/dashboard`

A module-level `_authFlowNavigating` flag prevents the login page's own `isAuthenticated` effect from racing against the auth handler's `router.replace`.

### API Client

`lib/api/client.ts` — Axios instance pointing at `NEXT_PUBLIC_API_BASE_URL`. It:
- Injects the in-memory Bearer token on every request
- Implements a refresh-token mutex: the first 401 triggers `/api/auth/refresh`; all concurrent 401s queue and retry once the refresh resolves
- Redirects to `/` on non-retryable 401s

Route-specific API functions are in `lib/api/`: `auth.ts`, `interviews.ts`, `users.ts`. The top-level `lib/api.ts` re-exports everything for backward compatibility.

### Contexts

- `AuthContext` — user identity, login/logout actions (see above)
- `ThemeContext` — dark mode toggle; adds/removes `dark` class on `<html>`

Both are provided in `_app.tsx` wrapping the whole app.

### Dashboard Layout

`components/dashboard/DashboardLayout.tsx` wraps every dashboard page with a responsive sidebar and `ProtectedRoute`. The sidebar nav items are defined as a static array in that file. Each dashboard page just renders `<DashboardLayout><SectionComponent /></DashboardLayout>`.

### Interview Flow

The mock interview feature has three sequential pages:

1. **Practice** (`/dashboard/practice`) — configure interview type, job role, skills
2. **Prelaunch** (`/dashboard/prelaunch`) — system readiness check (camera, mic, speaker, credit balance, device compatibility). Starts loading MediaPipe models in the background. Passes session config to the interview room via `sessionStorage` under key `skillscout_interview_session`.
3. **Interview Room** (`/dashboard/interview?sessionId=<id>`) — live session using LiveKit. Requires fullscreen in production. Records periodic video signals to the backend every 10 seconds.

### Proctoring System

Active during the prelaunch and interview pages. Three hooks compose together:

- `useMediaPipeProctoring` — face count, gaze direction, object detection (phone, book) via a **module-level singleton** (`lib/mediapipe-singleton.ts`) that loads WASM models once per browser session and survives client-side navigations
- `useEnvironmentProctoring` — detects tab switches (`visibilitychange`/`blur`) and fullscreen exits; only enforced when `NEXT_PUBLIC_APP_ENV === "production"`
- `useAntiDevTools` — detects DevTools open; production only
- `useMalpracticeWarnings` — aggregates violations from the above hooks and manages the warning/strike/disqualify state machine

### Payment

`lib/razorpay.ts` — dynamically loads the Razorpay script and opens the checkout modal. Amount always comes from the backend order (never client-computed).

### Styling

Tailwind CSS v4 with a custom design token layer. `cn()` from `lib/utils.ts` merges class names (`clsx` + `tailwind-merge`). Dark mode uses the `dark:` variant driven by `ThemeContext`. Material Icons are loaded globally via `<link>` in `_document.tsx` and used as `<span className="material-icons">icon_name</span>`.

### Key Libraries

- **LiveKit** (`@livekit/components-react`, `livekit-client`) — real-time audio/video for the interview room
- **MediaPipe** (`@mediapipe/tasks-vision`) — face and object detection for proctoring
- **Framer Motion** — animations
- **Recharts** — analytics charts in the dashboard
- **Zustand** — lightweight state (used in agents-ui components)
- **Sonner** — toast notifications (global `<Toaster>` in `_app.tsx`)
- **Radix UI** — headless primitives for accessible UI components

### SSR Considerations

LiveKit and MediaPipe are browser-only. Both are imported with `dynamic(..., { ssr: false })`. Any code that touches `window`, `document`, or `localStorage` must guard with `typeof window !== "undefined"` or be called inside `useEffect`.

`next.config.ts` enables the React Compiler (`reactCompiler: true`) and `reactStrictMode: true`. TypeScript build errors are intentionally ignored (`typescript.ignoreBuildErrors: true`) — rely on the editor / `tsc` manually instead.
