import { useRef, useState } from "react";

const TARGET_ROLES = [
  "Product Manager", "Software Engineer", "Data Scientist", "UX Designer",
  "Frontend Engineer", "Backend Engineer", "Full-Stack Engineer",
  "Mobile Engineer", "DevOps Engineer", "ML Engineer", "Engineering Manager",
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Retail", "Education",
  "Media & Entertainment", "Government", "Non-profit",
];

const EXP_LEVELS = [
  { label: "Entry (0-2)", value: "entry" },
  { label: "Mid (3-5)",   value: "mid" },
  { label: "Senior (6-9)",value: "senior" },
  { label: "Lead (10+)",  value: "lead" },
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
  "Product Manager":    ["Product Strategy", "Roadmapping", "Agile", "Stakeholder Management", "User Research"],
  "Software Engineer":  ["TypeScript", "Node.js", "GraphQL", "Docker", "PostgreSQL"],
  "Data Scientist":     ["Python", "Pandas", "TensorFlow", "SQL", "Spark"],
  "UX Designer":        ["Figma", "User Research", "Prototyping", "UI/UX Design", "Responsive Design"],
  "default":            ["TypeScript", "Node.js", "GraphQL", "Docker", "Communication"],
};

export interface ExperienceStepData {
  resumeFile: File | null;
  targetRole: string;
  industry: string;
  yearsOfExp: string;
  topSkills: string[];
}

interface StepRoleProps {
  data: ExperienceStepData;
  onChange: (d: ExperienceStepData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepRole({ data, onChange, onContinue, onBack }: StepRoleProps) {
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ExperienceStepData>(k: K, v: ExperienceStepData[K]) => onChange({ ...data, [k]: v });

  const suggested = SUGGESTED_SKILLS[data.targetRole] ?? SUGGESTED_SKILLS["default"];
  const filtered = suggested.filter(s => !data.topSkills.includes(s) && s.toLowerCase().includes(search.toLowerCase()));

  const addSkill = (s: string) => { if (!data.topSkills.includes(s)) set("topSkills", [...data.topSkills, s]); setSearch(""); };
  const removeSkill = (s: string) => set("topSkills", data.topSkills.filter(x => x !== s));

  const handleFile = (f?: File) => { if (f) set("resumeFile", f); };

  const validate = () => {
    const e: typeof errors = {};
    if (!data.targetRole) e.targetRole = "Please select a target role.";
    if (!data.industry) e.industry = "Please select an industry.";
    if (!data.yearsOfExp) e.yearsOfExp = "Please select your experience level.";
    if (data.topSkills.length < 1) e.topSkills = "Please add at least one skill.";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  const selectCls = (err?: string) =>
    `w-full appearance-none pl-12 pr-10 py-4 rounded-xl border ${err ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm cursor-pointer`;

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-8 md:p-10 space-y-8">

        {/* Resume upload */}
        <div>
          <label className="text-sm font-semibold text-text-light dark:text-text-dark block mb-3">
            Upload Resume <span className="text-subtext-light dark:text-subtext-dark font-normal">(Optional)</span>
          </label>
          <div
            className={`relative rounded-xl p-6 border-2 border-dashed text-center cursor-pointer transition-colors ${
              dragging ? "border-primary bg-blue-50 dark:bg-blue-900/20"
              : data.resumeFile ? "border-green-400 bg-green-50 dark:bg-green-900/10"
              : "border-gray-300 dark:border-gray-600 hover:border-primary bg-slate-50 dark:bg-gray-800/50"
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={e => handleFile(e.target.files?.[0])} />
            <span className="material-icons text-primary text-3xl mb-2 block">cloud_upload</span>
            {data.resumeFile
              ? <p className="text-sm font-medium text-green-700 dark:text-green-400">{data.resumeFile.name}</p>
              : <>
                  <p className="text-sm font-medium text-text-light dark:text-text-dark">Click to upload or drag and drop</p>
                  <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">PDF, DOCX up to 10MB</p>
                </>
            }
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2 w-fit">
            <span className="material-icons text-sm">auto_awesome</span>
            We&apos;ll auto-fill your skills based on your resume.
          </div>
        </div>

        {/* Target Role + Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark">
              Target Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light group-focus-within:text-primary transition-colors text-[20px] pointer-events-none">work</span>
              <select value={data.targetRole} onChange={e => set("targetRole", e.target.value)} className={selectCls(errors.targetRole)}>
                <option value="">Select your target role</option>
                {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light pointer-events-none text-[20px]">expand_more</span>
            </div>
            {errors.targetRole && <p className="text-xs text-red-500">{errors.targetRole}</p>}
          </div>

          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark">
              Industry <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light group-focus-within:text-primary transition-colors text-[20px] pointer-events-none">business</span>
              <select value={data.industry} onChange={e => set("industry", e.target.value)} className={selectCls(errors.industry)}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light pointer-events-none text-[20px]">expand_more</span>
            </div>
            {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
          </div>
        </div>

        {/* Years of experience */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <span className="text-sm font-bold text-primary">
              {EXP_LEVELS.find(l => l.value === data.yearsOfExp)?.label ?? "Select"}
            </span>
          </div>
          <div className="flex gap-3">
            {EXP_LEVELS.map(l => (
              <button key={l.value} type="button"
                onClick={() => set("yearsOfExp", l.value)}
                className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  data.yearsOfExp === l.value
                    ? "bg-primary text-white border-primary shadow-lg shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-subtext-light dark:text-subtext-dark hover:border-primary"
                }`}>
                {l.label}
              </button>
            ))}
          </div>
          {errors.yearsOfExp && <p className="text-xs text-red-500 mt-1">{errors.yearsOfExp}</p>}
        </div>

        {/* Top Skills */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark">
              Top Skills <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-subtext-light dark:text-subtext-dark">Select at least 1</span>
          </div>
          <div className="relative mb-3">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light text-[18px]">search</span>
            <input type="text" placeholder="Search skills (e.g. Python, Leadership, Agile)"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext-light" />
          </div>
          {data.topSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {data.topSkills.map(s => (
                <span key={s} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:opacity-70 transition-opacity">
                    <span className="material-icons text-[14px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">Suggested for your role</p>
            <div className="flex flex-wrap gap-2">
              {(search ? filtered : suggested.filter(s => !data.topSkills.includes(s))).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-xs font-semibold hover:border-primary hover:text-primary transition-all">
                  <span className="material-icons text-[13px]">add</span>{s}
                </button>
              ))}
            </div>
          </div>
          {errors.topSkills && <p className="text-xs text-red-500 mt-1">{errors.topSkills}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-5 flex justify-between items-center border-t border-gray-200 dark:border-gray-800">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm">
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <button type="button" onClick={handleContinue}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm">
          Next Step <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}