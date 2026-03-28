import type { InterviewTypeId } from "./data";
import {
  INTERVIEW_TYPES,
  DIFFICULTY_LABELS,
  DIFFICULTY_BADGE,
  DURATIONS,
  PERSONAS,
} from "./data";
import { AmazonLogo, MetaLogo, NetflixLogo } from "./CompanyLogos";

// Google logo SVG helper
function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-8 h-8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        fill="#EA4335"
      />
      <path
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        fill="#4285F4"
      />
      <path
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        fill="#FBBC05"
      />
      <path
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        fill="#34A853"
      />
      <path d="M0 0h48v48H0z" fill="none" />
    </svg>
  );
}

interface Props {
  interviewType: InterviewTypeId;
  setInterviewType: (t: InterviewTypeId) => void;
  company: string;
  setCompany: (c: string) => void;
  difficulty: number;
  setDifficulty: (d: number) => void;
  duration: number;
  setDuration: (d: number) => void;
  persona: string;
  setPersona: (p: string) => void;
}

export default function InterviewConfig({
  interviewType,
  setInterviewType,
  company,
  setCompany,
  difficulty,
  setDifficulty,
  duration,
  setDuration,
  persona,
  setPersona,
}: Props) {
  const diffLabel = DIFFICULTY_LABELS[difficulty - 1];
  const diffBadge = DIFFICULTY_BADGE[difficulty - 1];

  return (
    <div className="col-span-12 lg:col-span-8 space-y-6">
      {/* Interview Type */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-icons text-primary">category</span>
          Interview Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INTERVIEW_TYPES.map((t) => {
            const active = interviewType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setInterviewType(t.id)}
                className={`relative group p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all ${
                  active
                    ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {active && (
                  <div className="absolute top-2 right-2 text-primary">
                    <span className="material-icons text-[18px]">
                      check_circle
                    </span>
                  </div>
                )}
                <span
                  className={`material-icons text-3xl ${active ? "text-primary" : "text-gray-400 group-hover:text-primary"}`}
                >
                  {t.icon}
                </span>
                <span
                  className={`font-bold text-sm ${active ? "text-primary" : "text-gray-600 dark:text-gray-300 group-hover:text-primary"}`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Company Presets */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons text-primary">business</span>
            Company Presets
          </h2>
          <button className="text-xs font-semibold text-primary hover:underline">
            View all companies
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            {
              id: "google",
              label: "Google",
              logo: <GoogleLogo />,
              border: "border-blue-400",
            },
            {
              id: "amazon",
              label: "Amazon",
              logo: <AmazonLogo />,
              border: "border-yellow-400",
            },
            {
              id: "meta",
              label: "Meta",
              logo: <MetaLogo />,
              border: "border-blue-600",
            },
            {
              id: "netflix",
              label: "Netflix",
              logo: <NetflixLogo />,
              border: "border-red-600",
            },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCompany(c.id)}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 bg-white dark:bg-gray-800 hover:shadow-sm ${
                company === c.id
                  ? `${c.border} shadow-sm`
                  : `border-gray-200 dark:border-gray-700 hover:${c.border}`
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {c.logo ?? c.custom ?? (
                  <span className={`material-icons text-3xl ${c.iconCls}`}>
                    {c.icon}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {c.label}
              </span>
            </button>
          ))}
          <button
            onClick={() => setCompany("custom")}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${
              company === "custom"
                ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                : "border-dashed border-gray-300 dark:border-gray-600 hover:border-primary"
            }`}
          >
            <span className="material-icons text-2xl text-gray-400">add</span>
            <span className="text-xs font-medium text-gray-500">Custom</span>
          </button>
        </div>
      </section>

      {/* Parameters + Persona side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-icons text-primary">tune</span>
            Parameters
          </h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Difficulty Level
                </label>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${diffBadge}`}
                >
                  {diffLabel}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Junior</span>
                <span>Mid-Level</span>
                <span>Senior/Staff</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                      duration === d
                        ? "border-primary bg-primary text-white font-bold"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-icons text-primary">face</span>
            Interviewer Persona
          </h2>
          <div className="space-y-3">
            {PERSONAS.map((p) => {
              const active = persona === p.id;
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    active
                      ? "border-2 border-primary bg-blue-50/50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="persona"
                    checked={active}
                    onChange={() => setPersona(p.id)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                      {p.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {p.desc}
                    </div>
                  </div>
                  <span className="text-xl">{p.emoji}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
