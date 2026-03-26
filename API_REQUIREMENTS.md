# SkillScout Frontend – API & Integration Requirements

> **Scope:** Every REST API endpoint, WebSocket channel, webhook handler, and third-party integration required to make the `skillscout-frontend` (Next.js) fully functional, catalogued page by page.
>
> **Base URL (REST):** `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`)
> **Auth:** Bearer token sent in `Authorization` header (`localStorage` key: `token`).

---

## Table of Contents

1. [Global / App-Level](#1-global--app-level)
2. [Landing Page `/`](#2-landing-page-)
3. [Login `/auth/login`](#3-login-autlogin)
4. [Sign Up `/auth/signup`](#4-sign-up-authsignup)
5. [Profile Setup `/profile-setup`](#5-profile-setup-profile-setup)
6. [User Dashboard `/dashboard`](#6-user-dashboard-dashboard)
7. [Practice Arena `/dashboard/practice`](#7-practice-arena-dashboardpractice)
8. [Pre-launch Check `/dashboard/prelaunch`](#8-pre-launch-check-dashboardprelaunch)
9. [Live Interview Room `/dashboard/interview`](#9-live-interview-room-dashboardinterview)
10. [Interview Analysis `/dashboard/analysis`](#10-interview-analysis-dashboardanalysis)
11. [Session History `/dashboard/history`](#11-session-history-dashboardhistory)
12. [Goals & Milestones `/dashboard/goals`](#12-goals--milestones-dashboardgoals)
13. [Analytics Hub `/dashboard/weak-areas`](#13-analytics-hub-dashboardweak-areas)
14. [Settings & Profile `/dashboard/settings`](#14-settings--profile-dashboardsettings)
15. [Admin Dashboard `/admin`](#15-admin-dashboard-admin)
16. [Missing / Planned Pages](#16-missing--planned-pages)
17. [Cross-Cutting Concerns](#17-cross-cutting-concerns)

---

## 1. Global / App-Level

These APIs are needed on every protected page (called inside `_app.tsx` or `DashboardLayout`).

| #   | Method | Endpoint            | Description                                                                                          | Auth     |
| --- | ------ | ------------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| 1   | `GET`  | `/api/auth/me`      | Fetch currently authenticated user. Used to populate sidebar avatar/name and guard protected routes. | Required |
| 2   | `POST` | `/api/auth/refresh` | Refresh the JWT access token before expiry.                                                          | Required |
| 3   | `POST` | `/api/auth/logout`  | Invalidate session server-side, clear token.                                                         | Required |

**Notes:**

- The `DashboardLayout` hardcodes the user name as `"Alex Chen"` – this must be replaced with data from `GET /api/auth/me`.
- Token is stored in `localStorage` under the key `"token"` by `lib/api/client.ts`.

---

## 2. Landing Page `/`

**Route file:** `pages/index.tsx`
**Components:** `Navbar`, `Hero`, `Features`, `HowItWorks`, `Testimonial`, `SpeedDemo`, `CTA`, `Footer`

Currently fully static. No API calls are wired, but the following are needed for a dynamic experience:

| #   | Method | Endpoint                   | Description                                                                                               | Auth |
| --- | ------ | -------------------------- | --------------------------------------------------------------------------------------------------------- | ---- |
| 1   | `GET`  | `/api/public/stats`        | Platform-wide stats (e.g. "12,000+ professionals" social proof counter, total mock interviews conducted). | None |
| 2   | `GET`  | `/api/public/testimonials` | Fetch user testimonials / ratings shown in `Testimonial` component.                                       | None |

**No WebSockets or webhooks required.**

---

## 3. Login `/auth/login`

**Route file:** `pages/auth/login.tsx`
**Components:** `AuthBranding`, `SignInForm`, `SocialAuthButtons`

| #   | Method | Endpoint          | Description                                                              | Auth     | Payload               |
| --- | ------ | ----------------- | ------------------------------------------------------------------------ | -------- | --------------------- |
| 1   | `POST` | `/api/auth/login` | Email + password login. Returns `{ user, token }`.                       | None     | `{ email, password }` |
| 2   | `GET`  | `/api/auth/me`    | Called on mount to redirect already-authenticated users to `/dashboard`. | Optional | —                     |

### OAuth / Social Auth

| #   | Provider | Flow                       | Endpoint (suggested)                                                      |
| --- | -------- | -------------------------- | ------------------------------------------------------------------------- |
| 1   | Google   | OAuth 2.0 redirect / popup | `GET /api/auth/google` → Google consent → `GET /api/auth/google/callback` |
| 2   | GitHub   | OAuth 2.0 redirect / popup | `GET /api/auth/github` → GitHub consent → `GET /api/auth/github/callback` |

- On success, both OAuth callbacks should return a JWT and redirect to `/dashboard`.
- On new OAuth user (first login), redirect to `/profile-setup` instead.

### Missing Pages Referenced

- `GET /auth/forgot-password` – page linked from the form but **not yet built**.
  Requires: `POST /api/auth/forgot-password` `{ email }` and `POST /api/auth/reset-password` `{ token, newPassword }`.

---

## 4. Sign Up `/auth/signup`

**Route file:** `pages/auth/signup.tsx`
**Components:** `AuthBranding`, `SignUpForm`, `SocialAuthButtons`

| #   | Method | Endpoint           | Description                                                                             | Auth     | Payload                     |
| --- | ------ | ------------------ | --------------------------------------------------------------------------------------- | -------- | --------------------------- |
| 1   | `POST` | `/api/auth/signup` | Register new user. Returns `{ user, token }`. On success, redirect to `/profile-setup`. | None     | `{ name, email, password }` |
| 2   | `GET`  | `/api/auth/me`     | Pre-flight check; redirect authenticated users away from signup.                        | Optional | —                           |

### OAuth / Social Auth

Same providers as Login (see Section 3). New OAuth users should land on `/profile-setup`.

### Additional

| #   | Method | Endpoint                              | Description                                                     |
| --- | ------ | ------------------------------------- | --------------------------------------------------------------- |
| 3   | `GET`  | `/api/auth/check-email?email=<email>` | Optional real-time email uniqueness check (debounced on input). |

---

## 5. Profile Setup `/profile-setup`

**Route file:** `pages/profile-setup/index.tsx`
**Components:** `SetupNav`, `SetupProgressBar`, `StepResume` (Step 0), `StepRole` (Step 1), `StepSkills` (Step 2), `Step4Skills` (Step 3), `Step5Review` (Step 4)

This is a 5-step wizard. The full profile payload is assembled client-side and submitted on finish, but some steps also need supporting data.

### Step 0 – Basics (`StepResume`)

| #   | Method | Endpoint                    | Description                                                   | Auth     | Payload |
| --- | ------ | --------------------------- | ------------------------------------------------------------- | -------- | ------- |
| 1   | `GET`  | `/api/profile/career-goals` | Fetch career goal options (currently hardcoded as 5 options). | Required | —       |

### Step 1 – Experience & Skills (`StepRole`)

| #   | Method | Endpoint                              | Description                                                                                         | Auth     | Payload             |
| --- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| 2   | `POST` | `/api/profile/resume`                 | Upload resume file (PDF/DOCX, ≤10 MB). Multipart form data. Returns `resumeFileId`.                 | Required | `FormData { file }` |
| 3   | `POST` | `/api/ai/parse-resume`                | Trigger AI resume parsing after upload. Returns extracted skills, target role, years of experience. | Required | `{ resumeFileId }`  |
| 4   | `GET`  | `/api/roles`                          | Fetch available target roles list (currently hardcoded as 11 roles).                                | Required | —                   |
| 5   | `GET`  | `/api/industries`                     | Fetch industries list (currently hardcoded as 8 items).                                             | Required | —                   |
| 6   | `GET`  | `/api/skills/suggestions?role=<role>` | Get suggested skills based on selected target role (currently hardcoded per-role).                  | Required | —                   |

### Step 2 – Job Level & Target Roles (`StepSkills`)

| #   | Method | Endpoint                 | Description                                             | Auth     |
| --- | ------ | ------------------------ | ------------------------------------------------------- | -------- |
| 7   | `GET`  | `/api/career-levels`     | Fetch career level options (Junior, Mid, Senior, Lead). | Required |
| 8   | `GET`  | `/api/roles/suggestions` | Autocomplete/suggested target role names.               | Required |

### Step 3 – Skills Tags (`Step4Skills`)

| #   | Method | Endpoint                     | Description                                                | Auth     |
| --- | ------ | ---------------------------- | ---------------------------------------------------------- | -------- |
| 9   | `GET`  | `/api/skills/tech?query=<q>` | Autocomplete technical skills search.                      | Required |
| 10  | `GET`  | `/api/skills/soft`           | Fetch soft skills list (currently hardcoded as 4 options). | Required |

### Step 4 – Review & Finish (`Step5Review`)

| #   | Method | Endpoint                    | Description                                                                                                                                 | Auth     | Payload                      |
| --- | ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------- |
| 11  | `POST` | `/api/profile/setup`        | Submit complete profile. `{ personalData, experienceData, jobLevelData, skillsData, publicVisible }`. Redirects to `/dashboard` on success. | Required | Full profile object          |
| 12  | `PUT`  | `/api/users/:id/visibility` | Toggle public profile visibility.                                                                                                           | Required | `{ publicVisible: boolean }` |

---

## 6. User Dashboard `/dashboard`

**Route file:** `pages/dashboard/index.tsx`
**Component:** `OverviewSection`

This is the home dashboard. Currently renders an empty-state UI with hardcoded `"Alex Chen"` and `0%` readiness.

| #   | Method | Endpoint                                              | Description                                                                                                                             | Auth     |
| --- | ------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `GET`  | `/api/auth/me`                                        | Load authenticated user name, avatar.                                                                                                   | Required |
| 2   | `GET`  | `/api/users/:id/stats`                                | User stats: `{ totalInterviews, completedInterviews, averageScore, streak, rank }`. Drives the Readiness pill and locked roadmap state. | Required |
| 3   | `GET`  | `/api/interviews?userId=:id&limit=5&status=completed` | Recent interview sessions for the "No Recent Sessions" history section.                                                                 | Required |
| 4   | `GET`  | `/api/users/:id/readiness`                            | Readiness percentage score (0–100).                                                                                                     | Required |
| 5   | `GET`  | `/api/roadmap/:userId`                                | Personalized roadmap data — determines which of the 3 locked features (Skill Report, AI Tips, Progress Tracking) are unlocked.          | Required |
| 6   | `POST` | `/api/interviews`                                     | Create a new interview session from the Quick Start card. Returns new interview `id` to redirect to `/dashboard/prelaunch?id=<id>`.     | Required |

**Quick Start card fields sent to `POST /api/interviews`:**

```json
{
  "type": "technical | behavioral",
  "focusArea": "General Coding | System Design | Data Structures | Soft Skills",
  "durationMinutes": 15 | 30 | 45
}
```

---

## 7. Practice Arena `/dashboard/practice`

**Route file:** `pages/dashboard/practice.tsx`
**Component:** `PracticeSection`

Full interview configuration screen before launching into prelaunch check.

| #   | Method | Endpoint               | Description                                                                                                      | Auth     |
| --- | ------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `GET`  | `/api/companies`       | Fetch available company presets with logos/styles (currently hardcoded: Google, Amazon, Meta, Netflix + Custom). | Required |
| 2   | `GET`  | `/api/interview-types` | Fetch all interview type options with descriptions (Technical, Behavioral, HR Screening, Full Loop).             | Required |
| 3   | `GET`  | `/api/ai/status`       | Check AI interviewer service health. Drives the "AI Services Operational" indicator.                             | Required |
| 4   | `POST` | `/api/interviews`      | Create interview session with full config. On success, redirect to `/dashboard/prelaunch?id=<id>`.               | Required |

**Full payload for `POST /api/interviews`:**

```json
{
  "type": "technical | behavioral | hr-screening | full-loop",
  "company": "google | amazon | meta | netflix | custom",
  "difficultyLevel": 1 | 2 | 3,
  "durationMinutes": 15 | 30 | 45,
  "persona": "strict | neutral | friendly",
  "customCompanyName": "string (if company=custom)"
}
```

---

## 8. Pre-launch Check `/dashboard/prelaunch`

**Route file:** `pages/dashboard/prelaunch.tsx`

This page performs all system readiness checks **client-side only** (camera, mic, device, speaker). However, it sits between Practice Arena and the Interview Room, so it needs:

| #   | Method  | Endpoint              | Description                                                                                                      | Auth     |
| --- | ------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `GET`   | `/api/interviews/:id` | Fetch the pending interview session created in Practice Arena. Used to display session title/type in the header. | Required |
| 2   | `PATCH` | `/api/interviews/:id` | Update status to `"pending"` (ready to start).                                                                   | Required |

### Browser APIs (No backend)

| Check       | Browser API                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Camera      | `navigator.mediaDevices.getUserMedia({ video: true })`                                   |
| Microphone  | `navigator.mediaDevices.getUserMedia({ audio: true })` + `AudioContext` / `AnalyserNode` |
| Device type | `navigator.userAgent` UA string parsing                                                  |
| Speaker     | `new Audio('/pl_test.opus').play()` (fallback to `/public/pl_test.wav`)                  |

**Static asset required:** `/public/pl_test.opus` (preferred) and `/public/pl_test.wav` (fallback) – a short audio test tone.

---

## 9. Live Interview Room `/dashboard/interview`

**Route file:** `pages/dashboard/interview.tsx`

This is the most complex page and the core feature of the product. It requires real-time bidirectional communication.

### REST APIs

| #   | Method  | Endpoint                  | Description                                                                                                                                 | Auth     |
| --- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `GET`   | `/api/interviews/:id`     | Fetch interview metadata (title, type, company, persona, durationMinutes). Drives the header display.                                       | Required |
| 2   | `PATCH` | `/api/interviews/:id`     | Update status to `"in-progress"` when session starts.                                                                                       | Required |
| 3   | `POST`  | `/api/interviews/:id/end` | Mark interview as `"completed"`, save total duration. Triggers AI analysis pipeline. On success, redirect to `/dashboard/analysis?id=<id>`. | Required |

### WebSocket (Primary Real-Time Channel)

| Channel           | URL Pattern                           | Direction     | Events    |
| ----------------- | ------------------------------------- | ------------- | --------- |
| Interview Session | `wss://<server>/interview/:sessionId` | Bidirectional | See below |

**Client → Server WebSocket Events:**

| Event           | Payload                                          | Description                                                                 |
| --------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| `audio_chunk`   | `{ chunk: ArrayBuffer, sequenceNumber: number }` | Raw audio chunk from candidate's microphone (captured via `MediaRecorder`). |
| `session_ready` | `{ interviewId: string }`                        | Emitted when client is ready to start.                                      |
| `session_end`   | `{ interviewId: string }`                        | User clicked "End Session".                                                 |
| `user_muted`    | `{ muted: boolean }`                             | Mic mute/unmute toggle.                                                     |

**Server → Client WebSocket Events:**

| Event              | Payload                                                       | Description                                                                                         |
| ------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `transcript_chunk` | `{ speaker: "ai" \| "user", text: string, isFinal: boolean }` | Streaming live transcript. Drives the "Live Transcript" panel.                                      |
| `ai_audio_chunk`   | `{ chunk: ArrayBuffer, sequenceNumber: number }`              | AI interviewer's audio response. Played via the Web Audio API and drives the animated orb/waveform. |
| `ai_speaking`      | `{ speaking: boolean }`                                       | Toggle AI speaking animation on/off.                                                                |
| `next_question`    | `{ questionText: string, questionIndex: number }`             | AI has moved to a new question.                                                                     |
| `session_status`   | `{ status: "connecting" \| "active" \| "paused" \| "ended" }` | Session lifecycle events.                                                                           |
| `error`            | `{ code: string, message: string }`                           | Server-side error (e.g. AI service failure).                                                        |

### Browser APIs Used

| API                                                     | Purpose                                        |
| ------------------------------------------------------- | ---------------------------------------------- |
| `navigator.mediaDevices.getUserMedia({ video, audio })` | Capture candidate video + audio                |
| `MediaRecorder`                                         | Encode and chunk audio for streaming to server |
| `HTMLVideoElement.srcObject`                            | Display local camera feed                      |
| Web Audio API (`AudioContext`)                          | Play AI audio chunks received over WebSocket   |

### AI Service Integration

The backend must integrate with an AI service for:

- **Speech-to-Text (STT):** Transcribe candidate audio in real time (e.g. Deepgram, AssemblyAI, OpenAI Whisper via streaming).
- **LLM / AI Interviewer:** Generate contextual follow-up questions and responses (e.g. OpenAI GPT-4, Anthropic Claude).
- **Text-to-Speech (TTS):** Convert AI text responses to speech audio (e.g. ElevenLabs, OpenAI TTS, Google TTS).

---

## 10. Interview Analysis `/dashboard/analysis`

**Route file:** `pages/dashboard/analysis.tsx`

All data is currently **hardcoded as static mock data**. Every piece must be replaced with live API data fetched by `interviewId` (URL query param `?id=<interviewId>`).

| #   | Method | Endpoint                                     | Description                                                                   | Auth     |
| --- | ------ | -------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| 1   | `GET`  | `/api/interviews/:id/analysis`               | Master analysis object (see schema below).                                    | Required |
| 2   | `GET`  | `/api/interviews/:id/transcript`             | Full conversation transcript array `[{ speaker, text, timestamp }]`.          | Required |
| 3   | `GET`  | `/api/users/:id/performance-history?limit=2` | Last 2 interview scores for the Performance Trend card (previous vs current). | Required |
| 4   | `POST` | `/api/interviews/:id/share`                  | Generate a shareable public link to this analysis. Returns `{ shareUrl }`.    | Required |
| 5   | `GET`  | `/api/interviews/:id/report`                 | Stream a PDF report for download.                                             | Required |

**`GET /api/interviews/:id/analysis` – Response Schema:**

```json
{
  "overallScore": 82,
  "status": "Strong Hire | Hire | No Hire",
  "confidence": "High | Medium | Low",
  "percentileRank": 15,
  "date": "ISO8601",
  "durationMinutes": 45,
  "targetRole": "Senior Frontend Engineer",
  "technicalBreakdown": [
    {
      "id": "arch",
      "title": "React Component Architecture",
      "status": "pass | warn | fail",
      "detail": "Detailed AI feedback paragraph"
    }
  ],
  "scores": {
    "technical": 85,
    "communication": 78,
    "behavioral": 72,
    "problemSolving": 90,
    "sentiment": 80,
    "pace": 75
  },
  "improvementRecommendations": [
    {
      "priority": "High | Medium | Low",
      "title": "string",
      "description": "string",
      "resourceUrl": "string | null"
    }
  ]
}
```

---

## 11. Session History `/dashboard/history`

**Route file:** `pages/dashboard/history.tsx`
**Component:** `HistorySection`

All session data is currently **hardcoded** (4 mock sessions). Full API integration required.

| #   | Method | Endpoint                         | Description                                         | Auth     | Query Params                                                               |
| --- | ------ | -------------------------------- | --------------------------------------------------- | -------- | -------------------------------------------------------------------------- | ---- |
| 1   | `GET`  | `/api/interviews`                | Paginated interview history for authenticated user. | Required | `page`, `limit`, `search`, `type`, `dateFrom`, `dateTo`, `sortBy`, `order` |
| 2   | `GET`  | `/api/interviews/:id/analysis`   | Navigate to full analysis view.                     | Required | —                                                                          |
| 3   | `GET`  | `/api/interviews/:id/transcript` | View session transcript inline or in modal.         | Required | —                                                                          |
| 4   | `GET`  | `/api/interviews/:id/report`     | Download individual session PDF report.             | Required | —                                                                          |
| 5   | `GET`  | `/api/interviews/export`         | Export all user sessions as a bulk PDF or CSV.      | Required | `format=pdf                                                                | csv` |

**Filtering parameters for `GET /api/interviews`:**

```
GET /api/interviews?page=1&limit=10&search=system+design&type=System+Design&dateFrom=2024-01-01&dateTo=2024-12-31&sortBy=score&order=desc
```

---

## 12. Goals & Milestones `/dashboard/goals`

**Route file:** `pages/dashboard/goals.tsx`
**Component:** `GoalsSection`

All data is currently **hardcoded** (active goal "Crack FAANG by April", 4 milestones, weekly schedule). Full API integration required.

| #   | Method   | Endpoint                         | Description                                                                   | Auth     | Payload                              |
| --- | -------- | -------------------------------- | ----------------------------------------------------------------------------- | -------- | ------------------------------------ |
| 1   | `GET`    | `/api/users/:id/goals`           | Fetch active goal: title, targetDate, overallProgress, daysRemaining, streak. | Required | —                                    |
| 2   | `POST`   | `/api/goals`                     | Create new goal.                                                              | Required | `{ title, targetDate, targetRoles }` |
| 3   | `PUT`    | `/api/goals/:id`                 | Edit existing goal.                                                           | Required | `{ title, targetDate }`              |
| 4   | `DELETE` | `/api/goals/:id`                 | Delete goal.                                                                  | Required | —                                    |
| 5   | `GET`    | `/api/goals/:id/milestones`      | Fetch all milestones for a goal with status and progress.                     | Required | —                                    |
| 6   | `POST`   | `/api/goals/:id/milestones`      | Create new milestone.                                                         | Required | `{ title, dueDate, icon }`           |
| 7   | `PUT`    | `/api/milestones/:id`            | Update milestone progress/status.                                             | Required | `{ progress, status }`               |
| 8   | `DELETE` | `/api/milestones/:id`            | Delete milestone.                                                             | Required | —                                    |
| 9   | `GET`    | `/api/users/:id/streak`          | Daily login/practice streak count.                                            | Required | —                                    |
| 10  | `GET`    | `/api/users/:id/weekly-schedule` | Upcoming scheduled sessions for the calendar.                                 | Required | —                                    |
| 11  | `GET`    | `/api/users/:id/readiness`       | Readiness Gate score + AI-suggested next sessions.                            | Required | —                                    |
| 12  | `GET`    | `/api/ai/readiness-gap/:userId`  | AI gap analysis: what subjects/types to practice to clear readiness gate.     | Required | —                                    |
| 13  | `GET`    | `/api/users/:id/weekly-target`   | Weekly session target (e.g. 5 sessions/week) and sessions completed so far.   | Required | —                                    |

---

## 13. Analytics Hub `/dashboard/weak-areas`

**Route file:** `pages/dashboard/weak-areas.tsx`
**Component:** `WeakAreasSection`

All chart data is currently **hardcoded** (8-week arrays, radar values, heatmap grid). Full API integration required.

| #   | Method | Endpoint                          | Description                                                                    | Auth     | Query Params   |
| --- | ------ | --------------------------------- | ------------------------------------------------------------------------------ | -------- | -------------- | -------- |
| 1   | `GET`  | `/api/users/:id/analytics`        | Master analytics object (see schema below).                                    | Required | `period=30days | alltime` |
| 2   | `GET`  | `/api/users/:id/skill-radar`      | Radar chart data: 6 skill dimensions each scored 0–100.                        | Required | —              |
| 3   | `GET`  | `/api/users/:id/focus-areas`      | Top priority focus areas with severity and recommended action.                 | Required | —              |
| 4   | `GET`  | `/api/users/:id/heatmap`          | Practice consistency calendar heatmap data (daily activity for last 3 months). | Required | —              |
| 5   | `GET`  | `/api/users/:id/analytics/report` | Download analytics report as PDF/CSV.                                          | Required | `format=pdf    | csv`     |

**`GET /api/users/:id/analytics` – Response Schema:**

```json
{
  "performanceOverTime": {
    "weeks": ["Wk 1", "Wk 2", "..."],
    "technical": [45, 52, 55, 60, 68, 72, 75, 82],
    "behavioral": [30, 40, 45, 42, 55, 60, 62, 70]
  },
  "metrics": {
    "behavioralVelocity": {
      "value": "+23%",
      "label": "High Impact",
      "progress": 78
    },
    "codingSpeed": { "value": "-12%", "label": "Faster", "progress": 65 },
    "technicalAccuracy": { "value": "94%", "label": "Top 10%", "progress": 94 },
    "consistency": { "value": "8/10", "progress": 80 }
  }
}
```

**`GET /api/users/:id/skill-radar` – Response Schema:**

```json
{
  "labels": [
    "Communication",
    "Data Struct.",
    "System Des.",
    "Behavioral",
    "Prob. Solving",
    "Code Quality"
  ],
  "current": [85, 65, 50, 78, 90, 72],
  "marketAverage": [60, 60, 55, 65, 70, 60]
}
```

---

## 14. Settings & Profile `/dashboard/settings`

**Route file:** `pages/dashboard/settings.tsx`
**Component:** `SettingsSection`

All profile data is currently **hardcoded** (name "Alex Chen", role, location, salary, links, etc.). Full API integration required.

### Profile & Career

| #   | Method | Endpoint                        | Description                                                                                    | Auth     | Payload                         |
| --- | ------ | ------------------------------- | ---------------------------------------------------------------------------------------------- | -------- | ------------------------------- |
| 1   | `GET`  | `/api/auth/me`                  | Load full user profile for display.                                                            | Required | —                               |
| 2   | `PUT`  | `/api/users/:id`                | Update core profile: name, title, location, salary, notice period.                             | Required | `Partial<User>`                 |
| 3   | `POST` | `/api/users/:id/avatar`         | Upload new avatar image (multipart).                                                           | Required | `FormData { file }`             |
| 4   | `PUT`  | `/api/users/:id/career-profile` | Update career profile: industry, department, preferred role, job type, shift, expected salary. | Required | Career fields                   |
| 5   | `PUT`  | `/api/users/:id/social-links`   | Update LinkedIn, GitHub, website URLs.                                                         | Required | `{ linkedin, github, website }` |

### Resume

| #   | Method   | Endpoint                         | Description                                          | Auth     | Payload             |
| --- | -------- | -------------------------------- | ---------------------------------------------------- | -------- | ------------------- |
| 6   | `GET`    | `/api/users/:id/resume`          | Get current resume metadata (filename, upload date). | Required | —                   |
| 7   | `POST`   | `/api/users/:id/resume`          | Upload/replace resume (multipart, PDF/DOCX).         | Required | `FormData { file }` |
| 8   | `GET`    | `/api/users/:id/resume/download` | Download current resume file.                        | Required | —                   |
| 9   | `DELETE` | `/api/users/:id/resume`          | Delete resume.                                       | Required | —                   |

### Skills, Employment, Education, Projects

| #   | Method                | Endpoints                                                   | Description                         | Auth     |
| --- | --------------------- | ----------------------------------------------------------- | ----------------------------------- | -------- |
| 10  | `GET/POST/PUT/DELETE` | `/api/users/:id/skills`                                     | Manage key skills list.             | Required |
| 11  | `GET/POST/PUT/DELETE` | `/api/users/:id/employment` / `/api/employment/:id`         | Manage employment history entries.  | Required |
| 12  | `GET/POST/PUT/DELETE` | `/api/users/:id/education` / `/api/education/:id`           | Manage education entries.           | Required |
| 13  | `GET/POST/PUT/DELETE` | `/api/users/:id/projects` / `/api/projects/:id`             | Manage portfolio projects.          | Required |
| 14  | `GET/POST/PUT/DELETE` | `/api/users/:id/certifications` / `/api/certifications/:id` | Manage certifications/publications. | Required |

### Account Settings

| #   | Method   | Endpoint                       | Description                                                          | Auth     | Payload                            |
| --- | -------- | ------------------------------ | -------------------------------------------------------------------- | -------- | ---------------------------------- |
| 15  | `PUT`    | `/api/users/:id/notifications` | Update email notification preferences (daily job alerts toggle).     | Required | `{ emailAlerts: boolean }`         |
| 16  | `POST`   | `/api/auth/change-password`    | Change password.                                                     | Required | `{ currentPassword, newPassword }` |
| 17  | `DELETE` | `/api/users/:id`               | Permanently delete account. Should require a confirmation challenge. | Required | —                                  |

---

## 15. Admin Dashboard `/admin`

**Route file:** `pages/admin/index.tsx`
**Components:** `AdminStatsOverview`, `UserTable`, `InterviewsTable`

All data is shown as empty (`stats = { 0, 0, 0, 0 }`, `users = []`, `interviews = []`).

| #   | Method   | Endpoint              | Description                                                                            | Auth  | Notes                                       |
| --- | -------- | --------------------- | -------------------------------------------------------------------------------------- | ----- | ------------------------------------------- |
| 1   | `GET`    | `/api/admin/stats`    | Platform-wide stats: `{ totalUsers, activeUsers, totalInterviews, revenueThisMonth }`. | Admin | Maps to `AdminStats` type                   |
| 2   | `GET`    | `/api/users`          | Paginated all-user list.                                                               | Admin | `page`, `limit`, `search`, `role`           |
| 3   | `DELETE` | `/api/users/:id`      | Remove/ban a user. Calls `onDelete` prop of `UserTable`.                               | Admin | —                                           |
| 4   | `POST`   | `/api/admin/invite`   | Invite a new user by email.                                                            | Admin | `{ email, role }`                           |
| 5   | `PUT`    | `/api/users/:id/role` | Promote/demote user role (`user` ↔ `admin`).                                           | Admin | `{ role }`                                  |
| 6   | `GET`    | `/api/interviews`     | Paginated all-interviews list (platform-wide).                                         | Admin | `page`, `limit`, `userId`, `status`, `type` |
| 7   | `DELETE` | `/api/interviews/:id` | Delete an interview record.                                                            | Admin | —                                           |

---

## 16. Missing / Planned Pages

These pages are referenced in navigation/links but **do not yet exist** in the `pages/` directory:

| Page                         | Link Source                                                                                         | APIs Needed                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/auth/forgot-password`      | `SignInForm` "Forgot password?" link                                                                | `POST /api/auth/forgot-password`         |
| `/auth/reset-password`       | Email link from forgot-password flow                                                                | `POST /api/auth/reset-password`          |
| `/pricing`                   | `Navbar` → "Pricing" link                                                                           | `GET /api/plans` (Razorpay/Stripe plans) |
| `/terms`                     | `SignUpForm` "Terms of Service" link                                                                | Static page                              |
| `/privacy`                   | `SignUpForm` "Privacy Policy" link                                                                  | Static page                              |
| `/dashboard/analysis?id=:id` | `HistorySection` "View Analysis" button; currently navigates to `/dashboard/analysis` without an ID | `GET /api/interviews/:id/analysis`       |

---

## 17. Cross-Cutting Concerns

### Authentication & Authorization

- All `/dashboard/*` routes must check `GET /api/auth/me` and redirect to `/auth/login` if unauthenticated.
- All `/admin/*` routes must additionally enforce `role === "admin"`.
- JWT token is stored in `localStorage["token"]` and sent as `Authorization: Bearer <token>`.
- Implement token refresh logic: call `POST /api/auth/refresh` transparently before expiry.

### Error Handling

The `apiClient` in `lib/api/client.ts` throws on non-2xx responses. A global error boundary or toast notification system is needed for:

- `401 Unauthorized` → clear token, redirect to `/auth/login`
- `403 Forbidden` → show "access denied" message
- `429 Too Many Requests` → show rate limit warning
- `5xx` → show generic error toast

### WebSocket Connection Management (Interview Room)

- Reconnect logic with exponential backoff on disconnect.
- Heartbeat / ping-pong to detect dead connections.
- Session ID must be passed as a URL parameter or in the connection handshake.
- Audio chunks must be sequenced and buffered to handle out-of-order delivery.

### File Uploads

- Resume upload (`/profile-setup` Step 1, `/dashboard/settings`): `multipart/form-data`, max 10 MB, accept `.pdf .doc .docx`.
- Avatar upload (`/dashboard/settings`): `multipart/form-data`, max 2 MB, accept `image/*`.
- Both should return a permanent URL (S3 / CDN) and a file ID for deletion.

### Pagination

All list endpoints (`/api/interviews`, `/api/users`) follow the `PaginatedResponse<T>` shape already defined in `types/index.ts`:

```ts
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

### Environment Variables Required

| Variable                       | Purpose                   |
| ------------------------------ | ------------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL`           | WebSocket server base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID    |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth client ID    |

---

_Last updated: March 2026 – reflects current state of `skillscout-frontend` codebase._
