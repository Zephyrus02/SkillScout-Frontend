import Link from "next/link";
import { PersonalStepData } from "./StepResume";
import { ExperienceStepData } from "./StepRole";
import { JobLevelStepData } from "./StepSkills";
import { SkillsTagsData } from "./Step4Skills";

const CAREER_GOAL_LABELS: Record<string, string> = {
  placement: "Land my first job & transition into the corporate world",
  transition: "Transition into a new industry",
  promotion: "Get promoted in current role",
  freelance: "Start a freelance career",
  upskill: "Upskill for current market trends",
  leadership: "Step into a leadership position",
};

const CAREER_LEVEL_LABELS: Record<string, string> = {
  junior: "Junior (0–2 yrs)",
  mid: "Mid-Level (2–5 yrs)",
  senior: "Senior (5–10 yrs)",
  lead: "Lead (10+ yrs)",
};

const SOCIAL_META: { key: "linkedin" | "github" | "twitter" | "website"; label: string; icon: React.ReactNode }[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: (
      <span className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0" style={{ background: "#0A66C2" }}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </span>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    icon: (
      <span className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 bg-gray-900 dark:bg-gray-100">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white dark:fill-gray-900">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </span>
    ),
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    icon: (
      <span className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 bg-black dark:bg-white">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white dark:fill-black">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
    ),
  },
  {
    key: "website",
    label: "Website",
    icon: (
      <span className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0" style={{ background: "#7C3AED" }}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </span>
    ),
  },
];

interface Step5ReviewProps {
  personal: PersonalStepData;
  experience: ExperienceStepData;
  jobLevel: JobLevelStepData;
  skills: SkillsTagsData;
  onFinish: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
}

function SectionHeader({ title, step, onGoToStep }: { title: string; step: number; onGoToStep: (s: number) => void }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <h3 className="font-bold text-text-light dark:text-text-dark text-base">{title}</h3>
      <button
        type="button"
        onClick={() => onGoToStep(step)}
        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
      >
        <span className="material-icons text-sm">edit</span> Edit
      </button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm text-subtext-light dark:text-subtext-dark italic">{label}</p>;
}

export default function Step5Review({
  personal,
  experience,
  jobLevel,
  skills,
  onFinish,
  onBack,
  onGoToStep,
}: Step5ReviewProps) {
  const socialLinks = skills.socialLinks ?? {};
  const filledSocials = SOCIAL_META.filter(({ key }) => !!(socialLinks[key] ?? "").trim());

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-center text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative flex flex-col items-center">
          {personal.profilePictureUrl ? (
            <img
              src={personal.profilePictureUrl}
              alt={personal.fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/40 shadow-xl mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mb-4">
              <span className="material-icons text-white text-4xl">person</span>
            </div>
          )}
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            You&apos;re all set!
          </span>
          <h2 className="text-3xl font-extrabold mb-1 drop-shadow-lg">
            {personal.fullName || "Ready for"} <span className="text-blue-200">{personal.fullName ? "👋" : "Launch!"}</span>
          </h2>
          {experience.profileHeadline && (
            <p className="text-blue-100 text-sm mt-1 mb-2">{experience.profileHeadline}</p>
          )}
          <p className="text-blue-100/80 text-xs max-w-md mx-auto">
            Your profile is complete. Our AI is already finding the best matches for you.
          </p>
        </div>
      </div>

      {/* ── Step 1: Personal Info ── */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <SectionHeader title="Personal Info" step={0} onGoToStep={onGoToStep} />
        <div className="flex items-center gap-4">
          {personal.profilePictureUrl ? (
            <img
              src={personal.profilePictureUrl}
              alt={personal.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-subtext-light text-2xl">person</span>
            </div>
          )}
          <div>
            <p className="font-bold text-text-light dark:text-text-dark">
              {personal.fullName || <span className="text-subtext-light">Not set</span>}
            </p>
            <p className="text-xs text-subtext-light dark:text-subtext-dark mt-0.5">
              {CAREER_GOAL_LABELS[personal.careerGoal] ?? "No career goal selected"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Step 2: Experience ── */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-5">
        <SectionHeader title="Experience & Background" step={1} onGoToStep={onGoToStep} />

        {/* Profile headline */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-1">Profile Headline</p>
          {experience.profileHeadline
            ? <p className="text-sm font-semibold text-text-light dark:text-text-dark">{experience.profileHeadline}</p>
            : <EmptyState label="No headline added" />}
        </div>

        {/* Education */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Education</p>
          {experience.education.length === 0
            ? <EmptyState label="No education added" />
            : (
              <div className="space-y-2">
                {experience.education.map(edu => (
                  <div key={edu.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800/60">
                    <span className="material-icons text-primary text-[18px] mt-0.5">school</span>
                    <div>
                      <p className="text-sm font-semibold text-text-light dark:text-text-dark">{edu.degree}</p>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark">{edu.institution} · {edu.startDate}{edu.current ? " – Present" : edu.endDate ? ` – ${edu.endDate}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Employment */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Work Experience</p>
          {experience.employment.length === 0
            ? <EmptyState label="No work experience added" />
            : (
              <div className="space-y-2">
                {experience.employment.map(emp => (
                  <div key={emp.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800/60">
                    <span className="material-icons text-primary text-[18px] mt-0.5">work</span>
                    <div>
                      <p className="text-sm font-semibold text-text-light dark:text-text-dark">{emp.role}</p>
                      <p className="text-xs text-subtext-light dark:text-subtext-dark">{emp.company} · {emp.startDate}{emp.current ? " – Present" : emp.endDate ? ` – ${emp.endDate}` : ""}</p>
                      {emp.desc && <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1 line-clamp-2">{emp.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Projects */}
        {experience.projects.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Projects</p>
            <div className="space-y-2">
              {experience.projects.map(proj => (
                <div key={proj.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800/60">
                  <span className="material-icons text-primary text-[18px] mt-0.5">code</span>
                  <div>
                    <p className="text-sm font-semibold text-text-light dark:text-text-dark">{proj.title}</p>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark">{proj.type}{proj.startDate ? ` · ${proj.startDate}` : ""}{proj.endDate ? ` – ${proj.endDate}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {experience.certifications.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {experience.certifications.map(cert => (
                <span key={cert.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-300">
                  <span className="material-icons text-[13px]">verified</span>
                  {cert.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {experience.publications.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Publications</p>
            <div className="space-y-1">
              {experience.publications.map(pub => (
                <div key={pub.id} className="flex items-center gap-2 text-sm">
                  <span className="material-icons text-primary text-[15px]">menu_book</span>
                  <span className="text-text-light dark:text-text-dark font-medium">{pub.title}</span>
                  {pub.publisher && <span className="text-subtext-light dark:text-subtext-dark text-xs">— {pub.publisher}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 3: Career Direction ── */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
        <SectionHeader title="Career Direction" step={2} onGoToStep={onGoToStep} />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Career Level</p>
          {jobLevel.careerLevel
            ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{CAREER_LEVEL_LABELS[jobLevel.careerLevel] ?? jobLevel.careerLevel}</span>
            : <EmptyState label="Not selected" />}
        </div>

        {(jobLevel.targetIndustries ?? []).length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Target Industries</p>
            <div className="flex flex-wrap gap-2">
              {(jobLevel.targetIndustries ?? []).map(ind => (
                <span key={ind} className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-xs font-semibold text-text-light dark:text-text-dark">{ind}</span>
              ))}
            </div>
          </div>
        )}

        {(jobLevel.targetRoles ?? []).length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Target Roles</p>
            <div className="flex flex-wrap gap-2">
              {(jobLevel.targetRoles ?? []).map(role => (
                <span key={role} className="px-3 py-1.5 rounded-full border border-primary/40 bg-primary/5 text-primary text-xs font-semibold">{role}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 4: Skills & Social Links ── */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-5">
        <SectionHeader title="Skills & Social Links" step={3} onGoToStep={onGoToStep} />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Technical Skills</p>
          {skills.techSkills.length === 0
            ? <EmptyState label="No skills added" />
            : (
              <div className="flex flex-wrap gap-2">
                {skills.techSkills.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-full text-xs font-semibold">{s}</span>
                ))}
              </div>
            )}
        </div>

        {filledSocials.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Social Links</p>
            <div className="space-y-2">
              {filledSocials.map(({ key, label, icon }) => {
                const raw = socialLinks[key]!;
                const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
                return (
                  <div key={key} className="flex items-center gap-3">
                    {icon}
                    <div>
                      <p className="text-[10px] font-bold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">{label}</p>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block max-w-xs">{raw}</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <Link
          href="/dashboard"
          onClick={onFinish}
          className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 text-base"
        >
          <span className="material-icons">rocket_launch</span> Complete Setup &amp; Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
