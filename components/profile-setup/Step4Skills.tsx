import { useState, useRef, useEffect } from "react";
import SKILLS from "@/data/skills";
import type { SocialLinks } from "@/components/dashboard/sections/settings/types";
import type { JobLevelStepData } from "./StepSkills";

const SKILLS_BY_INDUSTRY: Record<string, string[]> = {
  "Software & Technology": [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Docker",
    "PostgreSQL",
    "GraphQL",
    "Kubernetes",
    "AWS",
    "Git",
  ],
  "Design & Creative": [
    "Figma",
    "Adobe XD",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "UI/UX Design",
    "Sketch",
    "Prototyping",
    "CSS",
    "HTML",
  ],
  "Finance & Banking": [
    "Excel",
    "SQL",
    "Python",
    "Financial Modeling",
    "Bloomberg",
    "Risk Management",
    "Data Analysis",
    "Tableau",
  ],
  Healthcare: [
    "Electronic Health Records",
    "HIPAA Compliance",
    "Clinical Research",
    "Medical Coding",
    "Patient Care",
    "Data Analysis",
  ],
  Education: [
    "Curriculum Development",
    "E-Learning",
    "LMS",
    "Public Speaking",
    "Content Creation",
    "Python",
    "Data Analysis",
  ],
  "Marketing & Advertising": [
    "SEO",
    "Google Analytics",
    "Content Marketing",
    "Social Media Marketing",
    "Copywriting",
    "HubSpot",
    "Salesforce",
  ],
  "Sales & Business Development": [
    "CRM",
    "Salesforce",
    "Negotiation",
    "Lead Generation",
    "Sales Forecasting",
    "HubSpot",
  ],
  "Operations & Supply Chain": [
    "SAP",
    "Lean Six Sigma",
    "Supply Chain Management",
    "Project Management",
    "Excel",
    "ERP Systems",
  ],
  "Legal & Compliance": [
    "Contract Law",
    "Regulatory Compliance",
    "Legal Research",
    "Due Diligence",
    "GDPR",
    "Risk Assessment",
  ],
  "Human Resources": [
    "HRIS",
    "Recruiting",
    "Talent Acquisition",
    "Employee Relations",
    "Workday",
    "BambooHR",
    "Onboarding",
  ],
};

const SKILLS_BY_ROLE: Record<string, string[]> = {
  "Software Engineer": [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Docker",
    "PostgreSQL",
    "Git",
    "REST APIs",
  ],
  "Frontend Developer": [
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "Tailwind CSS",
    "Next.js",
    "Figma",
    "Webpack",
  ],
  "Backend Developer": [
    "Node.js",
    "Python",
    "PostgreSQL",
    "Redis",
    "Docker",
    "REST APIs",
    "GraphQL",
    "AWS",
  ],
  "Full Stack Developer": [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL",
    "Git",
  ],
  "Data Scientist": [
    "Python",
    "Machine Learning",
    "SQL",
    "TensorFlow",
    "Pandas",
    "Numpy",
    "Data Visualization",
    "R",
  ],
  "Product Manager": [
    "Product Roadmap",
    "Agile",
    "Jira",
    "User Research",
    "Data Analysis",
    "SQL",
    "A/B Testing",
  ],
  "UX Designer": [
    "Figma",
    "User Research",
    "Prototyping",
    "Wireframing",
    "Adobe XD",
    "Usability Testing",
    "Sketch",
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD",
    "Terraform",
    "Jenkins",
    "Linux",
    "Monitoring",
  ],
  "Data Analyst": [
    "SQL",
    "Python",
    "Excel",
    "Tableau",
    "Power BI",
    "Data Visualization",
    "Statistics",
    "R",
  ],
  "Marketing Specialist": [
    "SEO",
    "Google Analytics",
    "Content Marketing",
    "Social Media",
    "HubSpot",
    "Copywriting",
  ],
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
};

const SOCIAL_FIELDS: {
  label: string;
  placeholder: string;
  key: keyof SocialLinks;
  icon: React.ReactNode;
}[] = [
  {
    label: "LinkedIn",
    placeholder: "linkedin.com/in/yourprofile",
    key: "linkedin",
    icon: (
      <span
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: "#0A66C2" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </span>
    ),
  },
  {
    label: "GitHub",
    placeholder: "github.com/yourusername",
    key: "github",
    icon: (
      <span className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 bg-gray-900 dark:bg-gray-100">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-white dark:fill-gray-900"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </span>
    ),
  },
  {
    label: "X (Twitter)",
    placeholder: "x.com/yourhandle",
    key: "twitter",
    icon: (
      <span className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 bg-black dark:bg-white">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white dark:fill-black">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
    ),
  },
  {
    label: "Personal Website",
    placeholder: "yourwebsite.com",
    key: "website",
    icon: (
      <span
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: "#7C3AED" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </span>
    ),
  },
];

function getRecommended(jobLevel?: JobLevelStepData): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const add = (skills: string[]) => {
    for (const s of skills) {
      if (!seen.has(s)) {
        seen.add(s);
        result.push(s);
      }
    }
  };
  for (const ind of jobLevel?.targetIndustries ?? [])
    add(SKILLS_BY_INDUSTRY[ind] ?? []);
  for (const role of jobLevel?.targetRoles ?? [])
    add(SKILLS_BY_ROLE[role] ?? []);
  if (result.length < 8)
    add([
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Docker",
      "PostgreSQL",
      "GraphQL",
      "Git",
    ]);
  return result.slice(0, 16);
}

export interface SkillsTagsData {
  techSkills: string[];
  socialLinks: SocialLinks;
}

interface Step4SkillsProps {
  data: SkillsTagsData;
  onChange: (d: SkillsTagsData) => void;
  onContinue: () => void;
  onBack: () => void;
  jobLevel?: JobLevelStepData;
}

export default function Step4Skills({
  data,
  onChange,
  onContinue,
  onBack,
  jobLevel,
}: Step4SkillsProps) {
  const [techSearch, setTechSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const socialLinks = data.socialLinks ?? DEFAULT_SOCIAL_LINKS;
  const recommended = getRecommended(jobLevel);

  const hasSkill = (s: string) =>
    data.techSkills.some((x) => x.toLowerCase() === s.toLowerCase());

  // Filter full SKILLS list for dropdown
  const dropdownOptions =
    techSearch.trim().length > 0
      ? SKILLS.filter(
          (s) =>
            !hasSkill(s) && s.toLowerCase().includes(techSearch.toLowerCase()),
        ).slice(0, 30)
      : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addTech = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !hasSkill(trimmed)) {
      onChange({ ...data, techSkills: [...data.techSkills, trimmed] });
    }
    setTechSearch("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeTech = (s: string) =>
    onChange({ ...data, techSkills: data.techSkills.filter((x) => x !== s) });

  const setSocialLink = (key: keyof SocialLinks, value: string) =>
    onChange({ ...data, socialLinks: { ...socialLinks, [key]: value } });

  const validate = () => {
    const e: typeof errors = {};
    if (!data.techSkills.length)
      e.techSkills = "Please add at least one technical skill.";
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
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
          Technical Skills
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          Add the core technical tools, languages, and frameworks you work with.
        </p>

        {/* Added skills chips */}
        {data.techSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.techSkills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeTech(s)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <span className="material-icons text-[14px]">close</span>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Autocomplete input */}
        <div className="relative mb-4">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light text-[18px] pointer-events-none">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 800+ skills (e.g. Python, Docker, Figma)"
            value={techSearch}
            onChange={(e) => {
              setTechSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => techSearch.trim() && setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (dropdownOptions.length > 0) addTech(dropdownOptions[0]);
                else if (techSearch.trim()) addTech(techSearch);
              }
              if (e.key === "Escape") setShowDropdown(false);
            }}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext-light"
          />
          {showDropdown && dropdownOptions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto"
            >
              {dropdownOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTech(s);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-text-light dark:text-text-dark hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-subtext-light dark:text-subtext-dark mb-2">
            {jobLevel?.targetIndustries?.length || jobLevel?.targetRoles?.length
              ? "Recommended for your industry & role"
              : "Suggested skills"}
          </p>
          <div className="flex flex-wrap gap-2">
            {recommended
              .filter((s) => !hasSkill(s))
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addTech(s)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-xs font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-icons text-[13px]">add</span>
                  {s}
                </button>
              ))}
          </div>
        </div>
        {errors.techSkills && (
          <p className="text-xs text-red-500 mt-2">{errors.techSkills}</p>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
          Social Links
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          Add your professional profiles and website so employers can learn more
          about you.
        </p>
        <div className="space-y-4">
          {SOCIAL_FIELDS.map(({ label, placeholder, key, icon }) => (
            <div key={key} className="flex items-center gap-3">
              {icon}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-subtext-light dark:text-subtext-dark mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={socialLinks[key]}
                  onChange={(e) => setSocialLink(key, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext-light"
                />
              </div>
            </div>
          ))}
        </div>
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
        <button
          type="button"
          onClick={handleContinue}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm"
        >
          Review Profile{" "}
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
