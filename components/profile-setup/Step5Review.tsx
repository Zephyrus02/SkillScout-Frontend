import Link from "next/link";
import { PersonalStepData } from "./StepResume";
import { ExperienceStepData } from "./StepRole";
import { JobLevelStepData } from "./StepSkills";
import { SkillsTagsData } from "./Step4Skills";
import { useState } from "react";

interface Step5ReviewProps {
  personal: PersonalStepData;
  experience: ExperienceStepData;
  jobLevel: JobLevelStepData;
  skills: SkillsTagsData;
  onFinish: () => void;
  onBack: () => void;
}

export default function Step5Review({ personal, experience, jobLevel, skills, onFinish, onBack }: Step5ReviewProps) {
  const [publicVisible, setPublicVisible] = useState(true);
  const allSkills = [...skills.techSkills, ...experience.topSkills];
  const careerLevelLabel: Record<string, string> = {
    junior: "Junior", mid: "Mid-Level", senior: "Senior", lead: "Lead",
  };

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-center text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            You&apos;re all set!
          </span>
          <h2 className="text-3xl font-extrabold mb-3 drop-shadow-lg">
            Ready for <span className="text-blue-200">Launch!</span>
          </h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto mb-6">
            Your profile is complete. Our AI is already finding the best matches for you.
          </p>
          <span className="material-icons text-5xl opacity-80">rocket_launch</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <span className="material-icons text-primary text-2xl">work</span>
          <p className="text-xs text-subtext-light dark:text-subtext-dark font-semibold uppercase tracking-wider">Target Role</p>
          <p className="font-bold text-text-light dark:text-text-dark text-sm">{experience.targetRole || personal.preferredTitle || "—"}</p>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[11px] font-medium">Remote</span>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[11px] font-medium">Full-time</span>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <span className="material-icons text-primary text-2xl">history_edu</span>
          <p className="text-xs text-subtext-light dark:text-subtext-dark font-semibold uppercase tracking-wider">Experience</p>
          <p className="font-bold text-text-light dark:text-text-dark text-sm">{careerLevelLabel[jobLevel.careerLevel] ?? "—"}</p>
          <p className="text-xs text-subtext-light dark:text-subtext-dark mt-auto pt-2">{experience.industry || "Technology"}</p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-2 shadow-sm">
          <span className="material-icons text-primary text-2xl">verified</span>
          <p className="text-xs text-subtext-light dark:text-subtext-dark font-semibold uppercase tracking-wider">Skills Added</p>
          <p className="font-bold text-text-light dark:text-text-dark text-sm">{allSkills.length} Core Skills</p>
          <div className="flex items-center gap-1 mt-auto pt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Profile complete</span>
          </div>
        </div>
      </div>

      {/* Key skills */}
      {allSkills.length > 0 && (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-text-light dark:text-text-dark">Key Skills Highlights</h3>
            <button type="button" onClick={onBack}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <span className="material-icons text-sm">edit</span> Edit Skills
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(s => (
              <span key={s} className="px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-full text-xs font-semibold">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Visibility toggle */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="material-icons text-primary text-2xl mt-0.5">visibility</span>
            <div>
              <h3 className="font-bold text-text-light dark:text-text-dark">Public Profile Visibility</h3>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
                Allow recruiters and companies to discover your profile.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setPublicVisible(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-1 ${publicVisible ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${publicVisible ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <button type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm font-semibold hover:border-primary transition-colors">
            <span className="material-icons text-sm">lock</span> Privacy Settings
          </button>
          <button type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors">
            <span className="material-icons text-sm">open_in_new</span> View Public Profile
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm">
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <Link href="/dashboard" onClick={onFinish}
          className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95 text-base">
          <span className="material-icons">rocket_launch</span> Complete Setup &amp; Go to Dashboard
        </Link>
      </div>
    </div>
  );
}