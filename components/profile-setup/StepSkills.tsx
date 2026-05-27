import { useRef, useState } from "react";

const CAREER_LEVELS = [
  {
    value: "junior",
    label: "Junior",
    range: "0 - 2 years experience",
    icon: "school",
  },
  {
    value: "mid",
    label: "Mid-Level",
    range: "2 - 5 years experience",
    icon: "trending_up",
  },
  {
    value: "senior",
    label: "Senior",
    range: "5 - 10 years experience",
    icon: "workspace_premium",
  },
  {
    value: "lead",
    label: "Lead",
    range: "10+ years experience",
    icon: "military_tech",
  },
];

// Bento grid: row 1 = col-span-3 + col-span-3 | row 2 = col-span-2 + col-span-2 + col-span-2
const INDUSTRY_CARDS = [
  {
    value: "technology",
    label: "Technology & Software",
    tags: ["Engineering", "Product", "Data"],
    colSpan: "md:col-span-3",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOgPASXrd_Gb_ISVfcQoqyHa0T8Lv4pgozoyjhBaivFAknAysSf9PfOn80sj-gqe-_g34rxxcQku-TEpRBoiEpE2NRcwW-sYlEnGjBlVymz3ysk5YSe39-f8c_B_JYMhXR28o7q8QOFlv8-IwUt8qqMFV984nsV9K41JLnUr2N4WFOIKZ0i7C8TLGd5Rb3C6rYG9Ey3nFVkR7DTXBVmiELGJ8ePuwaB5RNQ0AWI_GtEfx13n0QRPObrMeMNP_94M7duS5pjuAxdDn2",
  },
  {
    value: "finance",
    label: "Finance & Banking",
    tags: ["Investments", "Risk", "FinTech"],
    colSpan: "md:col-span-3",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm68xOiDN6eicHv9MORlRikmksvqYsVAzA-cJImNp-v-j-gxAgiK5vwjWs3OA8trkrUDLYqNtr3TdmRL2WcYw-n_CG22GD7s_oTKYf6wIhQgQRR6jd90TgneFE3HJSbnde3k4uvHHrdQIoNVKFGDjQ7OZrHCRPOEt7FlVZ5Q0hFzX2QIOzWei5FvW_-WlOOzd-TtwwBhz9B0j4l300qqr6-r-XbLcSs5YOgv45z42jXRrazWIyFTFJ5tf05lJMDgH4bZxFc1y0OSA9",
  },
  {
    value: "healthcare",
    label: "Healthcare & Pharma",
    tags: ["MedTech", "Research"],
    colSpan: "md:col-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA9kMmBzobGUamqybBRkzqAlUQXoQRNlot-l4Q-PHJEP_UnbDwAa6TDDTNSDq0--hO81lUFbovjHi9x_99iU5WSchhC4O2U46D8q8DqkdkiPKE1H914xHO-JFwbzT1l9lQPWfWzhDxTIsD_4cqZZYawVAUdb_TRpl7GT-j1xiaLZv9f16tD5E9WguQ20AaP-8CKFB4pzKQ-rkWG3axR50ruYWaJbtc45mjzAaR2pfkVrl0glWAqJKO6_GKaKQcSiFx6Rdy-uCNTtsm",
  },
  {
    value: "marketing",
    label: "Marketing & Media",
    tags: ["Growth", "Content", "SEO"],
    colSpan: "md:col-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVecQdmS515FdTx1TJQcN7v31l5biWVnWIY9idlxosrCejkkuCcycXNd9BovpyPHKY-R3SPj7rwAOBxo-u6gq95Vw2qXL01kem2GK7-0RXXH-jFs7GokUmYrzq_XjU8YgCT4axqdwqAH6kiHHeuJUkyKonxgyyxqY3CV6PCnMWQbiU_hksxsBjJU--cZoWF16sQMVlhvHp0gffqKKm3PFmsdYu5vu_A0ermNBKKBJaKQnv4zWsfIouZhSYZmca12SVUIoG7uZT6rjx",
  },
  {
    value: "design",
    label: "Design & Creative",
    tags: ["UX/UI", "Brand", "Motion"],
    colSpan: "md:col-span-2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBos1J9VPPHH5PkBQ00PIqjLLUfyfhmRaAg-M3DlKuJzfqP9LS78H3X4i9eKVQ7WlcNJxugZCGJ_2_r4henk020QpS8zgJ8yHt5MvYgTk5Klsg_jzTcRHElOR9mi-FJl4OmVEonDGY6CQTulSpsDQGn2noI6-6aOQS9jAfx2wWJ5jjKASsPVohKxcsR9DmVuASB-LzqXymLMVxQHRhSiFV90ZGxxv3kETtlOt64MDN1q-wqm5P0ZiEEYRtUADHlcSv-NAkh6B6C5fcD",
  },
];

const ROLES_BY_INDUSTRY: Record<string, string[]> = {
  technology: [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Data Engineer",
    "Machine Learning Engineer",
    "AI Researcher",
    "Cloud Architect",
    "Software Architect",
    "Mobile Developer",
    "iOS Developer",
    "Android Developer",
    "QA Engineer",
    "Security Engineer",
    "Blockchain Developer",
    "Embedded Systems Engineer",
    "Product Manager",
    "Technical Program Manager",
    "Engineering Manager",
  ],
  finance: [
    "Financial Analyst",
    "Investment Banker",
    "Quantitative Analyst",
    "Portfolio Manager",
    "Risk Manager",
    "Compliance Officer",
    "Actuary",
    "Credit Analyst",
    "Hedge Fund Analyst",
    "Private Equity Associate",
    "FinTech Product Manager",
    "Wealth Manager",
    "Treasury Analyst",
    "Audit Manager",
    "Tax Consultant",
    "Financial Controller",
  ],
  healthcare: [
    "Clinical Data Analyst",
    "Medical Software Engineer",
    "Healthcare IT Specialist",
    "Biomedical Engineer",
    "Regulatory Affairs Specialist",
    "Clinical Research Associate",
    "Health Informatics Analyst",
    "Pharmacovigilance Specialist",
    "MedTech Product Manager",
    "Digital Health Consultant",
    "Epidemiologist",
    "Biostatistician",
  ],
  marketing: [
    "Growth Hacker",
    "Performance Marketing Manager",
    "SEO Specialist",
    "Content Strategist",
    "Social Media Manager",
    "Brand Manager",
    "Media Buyer",
    "CRM Manager",
    "Email Marketing Specialist",
    "Marketing Analyst",
    "Product Marketing Manager",
    "Campaign Manager",
    "Copywriter",
    "Influencer Marketing Manager",
  ],
  design: [
    "UX Designer",
    "UI Designer",
    "Product Designer",
    "Visual Designer",
    "Motion Designer",
    "Graphic Designer",
    "Brand Designer",
    "Design Systems Lead",
    "UX Researcher",
    "Interaction Designer",
    "3D Artist",
    "Illustrator",
    "Creative Director",
  ],
};

const ALL_ROLES = Object.values(ROLES_BY_INDUSTRY).flat();

export interface JobLevelStepData {
  careerLevel: string;
  targetIndustries: string[];
  targetRoles: string[];
}

interface StepSkillsProps {
  data: JobLevelStepData;
  onChange: (d: JobLevelStepData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepSkills({
  data,
  onChange,
  onContinue,
  onBack,
}: StepSkillsProps) {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [roleQuery, setRoleQuery] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof JobLevelStepData>(
    k: K,
    v: JobLevelStepData[K],
  ) => onChange({ ...data, [k]: v });

  const toggleIndustry = (v: string) => {
    const next = industries.includes(v)
      ? industries.filter((i) => i !== v)
      : [...industries, v];
    set("targetIndustries", next);
  };

  // Suggestions: roles from selected industries; fall back to all roles
  const industries = data.targetIndustries ?? [];
  const roles = data.targetRoles ?? [];

  const rolePool = industries.length
    ? industries.flatMap((ind) => ROLES_BY_INDUSTRY[ind] ?? [])
    : ALL_ROLES;

  const filteredRoles = roleQuery.trim()
    ? rolePool
        .filter((r) => r.toLowerCase().includes(roleQuery.toLowerCase()))
        .filter((r, i, arr) => arr.indexOf(r) === i) // deduplicate
        .slice(0, 10)
    : [];

  const addRole = (r: string) => {
    const trimmed = r.trim();
    if (trimmed && !roles.includes(trimmed)) {
      set("targetRoles", [...roles, trimmed]);
    }
    setRoleQuery("");
    setShowRoleDropdown(false);
  };

  const removeRole = (r: string) =>
    set(
      "targetRoles",
      roles.filter((x) => x !== r),
    );

  const validate = () => {
    const e: typeof errors = {};
    if (!data.careerLevel) e.careerLevel = "Please select a career level.";
    if (!industries.length)
      e.targetIndustries = "Please select at least one industry.";
    if (!roles.length) e.targetRoles = "Please add at least one target role.";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div>
      {/* ── Career level ─────────────────────────────── */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
          What is your career level?
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5">
          This helps us tailor job recommendations and salary expectations to
          your experience.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CAREER_LEVELS.map((l) => {
            const active = data.careerLevel === l.value;
            return (
              <button
                key={l.value}
                type="button"
                onClick={() => set("careerLevel", l.value)}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/5 dark:bg-primary/15 shadow-lg shadow-blue-500/10"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:border-primary/50"
                }`}
              >
                {active && (
                  <span className="absolute top-3 right-3 material-icons text-primary text-[18px]">
                    check_circle
                  </span>
                )}
                <span
                  className={`material-icons text-3xl ${active ? "text-primary" : "text-subtext-light dark:text-subtext-dark"}`}
                >
                  {l.icon}
                </span>
                <div>
                  <p
                    className={`font-bold text-sm ${active ? "text-primary" : "text-text-light dark:text-text-dark"}`}
                  >
                    {l.label}
                  </p>
                  <p className="text-xs text-subtext-light dark:text-subtext-dark mt-0.5">
                    {l.range}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.careerLevel && (
          <p className="text-xs text-red-500 mt-2">{errors.careerLevel}</p>
        )}
      </section>

      {/* ── Target industry – bento grid ─────────────────── */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
          Which industry are you targeting?
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5">
          Select all that apply to your current career search.
        </p>

        {/* Bento grid: 6 columns on md+, fixed 400px height on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[400px]">
          {INDUSTRY_CARDS.map((r) => {
            const active = industries.includes(r.value);
            const isLarge = r.colSpan === "md:col-span-3";
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => toggleIndustry(r.value)}
                className={`${r.colSpan} md:row-span-1 relative overflow-hidden group rounded-xl bg-slate-800 text-left transition-all focus:outline-none ${
                  active ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                {/* Photo background with gradient overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('${r.img}')`,
                  }}
                />

                {/* Checkbox indicator – top-right */}
                <div
                  className={`absolute top-4 right-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLarge ? "size-6" : "size-5"
                  } ${
                    active
                      ? "bg-primary border-primary"
                      : "border-white/50 bg-transparent"
                  }`}
                >
                  {active && (
                    <span
                      className={`material-icons text-white leading-none ${isLarge ? "text-[14px]" : "text-[12px]"}`}
                    >
                      check
                    </span>
                  )}
                </div>

                {/* Text content – bottom */}
                <div className="relative h-full w-full p-6 flex flex-col justify-end">
                  <h3
                    className={`text-white font-bold leading-tight ${isLarge ? "text-xl" : "text-lg"}`}
                  >
                    {r.label}
                  </h3>
                  {isLarge && r.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="text-slate-300 text-xs bg-white/10 px-2 py-1 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {errors.targetIndustries && (
          <p className="text-xs text-red-500 mt-2">{errors.targetIndustries}</p>
        )}
      </section>

      {/* ── Target roles – autocomplete input ─────────────────── */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
          What roles are you targeting?
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5">
          {data.targetIndustries?.length
            ? "Showing suggestions based on your selected industries."
            : "Add roles you're looking for. Select industries above for personalised suggestions."}
        </p>

        {/* Input + autocomplete */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={roleInputRef}
                className="w-full pl-4 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext-light"
                placeholder="Search or type a role (e.g. DevOps Engineer, Product Manager…)"
                value={roleQuery}
                onChange={(e) => {
                  setRoleQuery(e.target.value);
                  setShowRoleDropdown(true);
                }}
                onFocus={() => setShowRoleDropdown(true)}
                onBlur={() => setTimeout(() => setShowRoleDropdown(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (filteredRoles.length) addRole(filteredRoles[0]);
                    else if (roleQuery.trim()) addRole(roleQuery);
                  }
                }}
              />
              {roleQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext-light hover:text-text-light"
                  onClick={() => {
                    setRoleQuery("");
                    setShowRoleDropdown(false);
                  }}
                >
                  <span className="material-icons text-sm">close</span>
                </button>
              )}

              {/* Autocomplete dropdown */}
              {showRoleDropdown && filteredRoles.length > 0 && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 w-full min-w-full max-w-full box-border bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  {filteredRoles.map((r) => {
                    const alreadyAdded = roles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        disabled={alreadyAdded}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                          alreadyAdded
                            ? "text-subtext-light dark:text-subtext-dark cursor-default bg-gray-50 dark:bg-gray-800/50"
                            : "text-text-light dark:text-text-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary"
                        }`}
                        onMouseDown={(e) => {
                          if (alreadyAdded) return;
                          e.preventDefault();
                          addRole(r);
                        }}
                      >
                        <span>{r}</span>
                        {alreadyAdded && (
                          <span className="material-icons text-sm text-green-500">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (roleQuery.trim()) addRole(roleQuery);
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>

        {/* Role chips */}
        {roles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1.5 bg-primary/5 dark:bg-primary/15 border border-primary/20 rounded-full text-xs font-medium text-primary flex items-center gap-1"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-0.5 text-primary/60 hover:text-red-500 transition leading-none"
                >
                  <span className="material-icons text-xs">close</span>
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.targetRoles && (
          <p className="text-xs text-red-500 mt-2">{errors.targetRoles}</p>
        )}
      </section>

      {/* ── Navigation ───────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm"
        >
          Continue <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
