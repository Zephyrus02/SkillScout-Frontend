import { useState } from "react";

const SOFT_SKILLS = [
  { value: "communication",   label: "Communication",   desc: "Public speaking & writing" },
  { value: "leadership",      label: "Leadership",      desc: "Mentoring & team management" },
  { value: "problem-solving", label: "Problem Solving", desc: "Analytical & creative thinking" },
  { value: "time-management", label: "Time Management", desc: "Prioritization & efficiency" },
];

const TECH_SUGGESTIONS = ["TypeScript", "Node.js", "GraphQL", "Docker", "React", "PostgreSQL", "Kubernetes", "Python"];

export interface SkillsTagsData {
  techSkills: string[];
  softSkills: string[];
}

interface Step4SkillsProps {
  data: SkillsTagsData;
  onChange: (d: SkillsTagsData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function Step4Skills({ data, onChange, onContinue, onBack }: Step4SkillsProps) {
  const [techSearch, setTechSearch] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const set = <K extends keyof SkillsTagsData>(k: K, v: SkillsTagsData[K]) => onChange({ ...data, [k]: v });

  const addTech = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !data.techSkills.includes(trimmed)) set("techSkills", [...data.techSkills, trimmed]);
    setTechSearch("");
  };
  const removeTech = (s: string) => set("techSkills", data.techSkills.filter(x => x !== s));
  const toggleSoft = (v: string) => {
    const next = data.softSkills.includes(v)
      ? data.softSkills.filter(x => x !== v)
      : [...data.softSkills, v];
    set("softSkills", next);
  };

  const filteredSuggestions = TECH_SUGGESTIONS.filter(
    s => !data.techSkills.includes(s) && s.toLowerCase().includes(techSearch.toLowerCase())
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!data.techSkills.length) e.techSkills = "Please add at least one technical skill.";
    if (!data.softSkills.length) e.softSkills = "Please select at least one soft skill.";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div className="space-y-8">
      {/* Technical skills */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">Technical Skills</h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          Add the core technical tools, languages, and frameworks you work with.
        </p>

        <div className="relative mb-4">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search skills (e.g. Python, Docker, Figma)"
            value={techSearch}
            onChange={e => setTechSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && techSearch.trim()) { e.preventDefault(); addTech(techSearch); }
            }}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext-light"
          />
        </div>

        {data.techSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.techSkills.map(s => (
              <span key={s} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {s}
                <button type="button" onClick={() => removeTech(s)} className="hover:opacity-70 transition-opacity">
                  <span className="material-icons text-[14px]">close</span>
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Suggested for your role</p>
          <div className="flex flex-wrap gap-2">
            {(techSearch ? filteredSuggestions : TECH_SUGGESTIONS.filter(s => !data.techSkills.includes(s))).map(s => (
              <button key={s} type="button" onClick={() => addTech(s)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-xs font-semibold hover:border-primary hover:text-primary transition-all">
                <span className="material-icons text-[13px]">add</span>{s}
              </button>
            ))}
          </div>
        </div>
        {errors.techSkills && <p className="text-xs text-red-500 mt-2">{errors.techSkills}</p>}
      </div>

      {/* Soft skills */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">Soft Skills</h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          These help employers assess your adaptability and team fit.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOFT_SKILLS.map(s => {
            const checked = data.softSkills.includes(s.value);
            return (
              <button key={s.value} type="button" onClick={() => toggleSoft(s.value)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  checked
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 hover:border-primary/50"
                }`}>
                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  checked ? "bg-primary border-primary" : "border-gray-300 dark:border-gray-600"
                }`}>
                  {checked && <span className="material-icons text-white text-[14px]">check</span>}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${checked ? "text-primary" : "text-text-light dark:text-text-dark"}`}>{s.label}</p>
                  <p className="text-xs text-subtext-light dark:text-subtext-dark mt-0.5">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.softSkills && <p className="text-xs text-red-500 mt-2">{errors.softSkills}</p>}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm">
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <button type="button" onClick={handleContinue}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm">
          Review Profile <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}