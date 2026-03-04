import { useRef, useState } from "react";
import type React from "react";
import MonthYearPicker from "@/components/ui/MonthYearPicker";

// ── Entry types (mirror settings/types.ts) ───────────────────────────────────
type EduEntry = {
  id: number;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  current: boolean;
};
type EmpEntry = {
  id: number;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  desc: string;
  salary: string;
  noticePeriod: string;
};
type ProjEntry = {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  desc: string;
};
type PubEntry = {
  id: number;
  title: string;
  publisher: string;
  date: string;
  url: string;
  desc: string;
};
type CertEntry = {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  doesExpire: boolean;
  expiryDate: string;
};

export interface ExperienceStepData {
  resumeFile: File | null;
  profileHeadline: string;
  education: EduEntry[];
  employment: EmpEntry[];
  projects: ProjEntry[];
  publications: PubEntry[];
  certifications: CertEntry[];
  currentLocation: string;
  preferredLocation: string;
  preferredShift: string;
  expectedSalary: string;
  desiredWorkType: string;
}

interface StepRoleProps {
  data: ExperienceStepData;
  onChange: (d: ExperienceStepData) => void;
  onContinue: () => void;
  onBack: () => void;
}

// ── Shared micro-styles ───────────────────────────────────────────────────────
const iCls =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400";
const lCls =
  "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1";
const saveBtnCls =
  "px-4 py-2 text-xs font-semibold bg-primary text-white rounded-xl hover:bg-primary-hover transition";
const cancelBtnCls =
  "px-4 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition";

// ── OptionalSection ──────────────────────────────────────────────────────────
interface OptionalSectionProps<T extends { id: number }> {
  title: string;
  icon: string;
  adding: boolean;
  onAdd: () => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onRemove: (id: number) => void;
  form: React.ReactNode;
}

function OptionalSection<T extends { id: number }>({
  title,
  icon,
  adding,
  onAdd,
  items,
  renderItem,
  onRemove,
  form,
}: OptionalSectionProps<T>) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-400 text-[20px]">
            {icon}
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-[11px] text-gray-400">Optional</p>
          </div>
        </div>
        {!adding && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span className="material-icons text-sm">add</span> Add
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <span className="material-icons text-[18px]">
                  delete_outline
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {!adding && items.length === 0 && (
        <button
          onClick={onAdd}
          className="w-full py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons text-[18px]">add_circle_outline</span>{" "}
          Add {title}
        </button>
      )}

      {adding && (
        <div className="border border-primary/30 rounded-xl p-4 bg-blue-50/30 dark:bg-blue-900/10">
          {form}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StepRole({
  data,
  onChange,
  onContinue,
  onBack,
}: StepRoleProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [addingEdu, setAddingEdu] = useState(false);
  const [addingEmp, setAddingEmp] = useState(false);
  const [addingProj, setAddingProj] = useState(false);
  const [addingPub, setAddingPub] = useState(false);
  const [addingCert, setAddingCert] = useState(false);

  const [eduDraft, setEduDraft] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [empDraft, setEmpDraft] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    desc: "",
    salary: "",
    noticePeriod: "",
  });
  const [projDraft, setProjDraft] = useState({
    title: "",
    type: "(Offsite)",
    startDate: "",
    endDate: "",
    desc: "",
  });
  const [pubDraft, setPubDraft] = useState({
    title: "",
    publisher: "",
    date: "",
    url: "",
    desc: "",
  });
  const [certDraft, setCertDraft] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    doesExpire: false,
    expiryDate: "",
  });

  const set = <K extends keyof ExperienceStepData>(
    k: K,
    v: ExperienceStepData[K],
  ) => onChange({ ...data, [k]: v });

  const handleFile = (f?: File) => {
    if (f) set("resumeFile", f);
  };

  // ── Savers ──────────────────────────────────────────────────────────────────
  const saveEdu = () => {
    if (!eduDraft.degree.trim() || !eduDraft.institution.trim()) return;
    set("education", [...data.education, { ...eduDraft, id: Date.now() }]);
    setEduDraft({
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setAddingEdu(false);
  };
  const saveEmp = () => {
    if (!empDraft.role.trim() || !empDraft.company.trim()) return;
    set("employment", [...data.employment, { ...empDraft, id: Date.now() }]);
    setEmpDraft({
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      desc: "",
      salary: "",
      noticePeriod: "",
    });
    setAddingEmp(false);
  };
  const saveProj = () => {
    if (!projDraft.title.trim()) return;
    set("projects", [...data.projects, { ...projDraft, id: Date.now() }]);
    setProjDraft({
      title: "",
      type: "(Offsite)",
      startDate: "",
      endDate: "",
      desc: "",
    });
    setAddingProj(false);
  };
  const savePub = () => {
    if (!pubDraft.title.trim() || !pubDraft.publisher.trim()) return;
    set("publications", [
      ...data.publications,
      { ...pubDraft, id: Date.now() },
    ]);
    setPubDraft({ title: "", publisher: "", date: "", url: "", desc: "" });
    setAddingPub(false);
  };
  const saveCert = () => {
    if (!certDraft.name.trim() || !certDraft.issuer.trim()) return;
    set("certifications", [
      ...data.certifications,
      { ...certDraft, id: Date.now() },
    ]);
    setCertDraft({
      name: "",
      issuer: "",
      issueDate: "",
      doesExpire: false,
      expiryDate: "",
    });
    setAddingCert(false);
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.resumeFile) e.resume = "Please upload your resume.";
    if (!data.profileHeadline.trim())
      e.profileHeadline = "Profile headline is required.";
    if (data.education.length === 0)
      e.education = "Please add at least one education entry.";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  return (
    <div className="space-y-5">
      {/* ── Resume Upload ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Upload Resume <span className="text-red-500">*</span>
        </h3>
        <div
          className={`rounded-xl p-6 border-2 border-dashed text-center cursor-pointer transition-colors ${
            dragging
              ? "border-primary bg-blue-50 dark:bg-blue-900/20"
              : data.resumeFile
                ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                : "border-gray-300 dark:border-gray-600 hover:border-primary bg-slate-50 dark:bg-gray-800/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <span className="material-icons text-primary text-3xl mb-2 block">
            cloud_upload
          </span>
          {data.resumeFile ? (
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {data.resumeFile.name}
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
            </>
          )}
        </div>
        {errors.resume && (
          <p className="text-xs text-red-500 mt-2">{errors.resume}</p>
        )}
      </div>

      {/* ── Profile Headline ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
        <label className="text-sm font-bold text-gray-900 dark:text-white block mb-1">
          Profile Headline <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">
          A short, impactful summary shown at the top of your public profile.
        </p>
        <input
          type="text"
          placeholder="e.g. Senior Full-Stack Engineer · React · Node.js · AWS"
          value={data.profileHeadline}
          onChange={(e) => set("profileHeadline", e.target.value)}
          className={`w-full px-4 py-3 border ${errors.profileHeadline ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl bg-slate-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400`}
        />
        {errors.profileHeadline && (
          <p className="text-xs text-red-500 mt-1.5">
            {errors.profileHeadline}
          </p>
        )}
      </div>

      {/* ── Education (required) ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Education <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Add at least one qualification.
            </p>
          </div>
          {!addingEdu && (
            <button
              onClick={() => setAddingEdu(true)}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline flex-shrink-0"
            >
              <span className="material-icons text-sm">add</span> Add
            </button>
          )}
        </div>

        {data.education.length > 0 && (
          <div className="space-y-3 mb-4">
            {data.education.map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between gap-3 p-3 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {e.degree}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {e.institution}
                  </p>
                  {(e.startDate || e.endDate) && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {e.startDate}
                      {e.startDate && e.endDate ? " – " : ""}
                      {e.endDate}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    set(
                      "education",
                      data.education.filter((x) => x.id !== e.id),
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <span className="material-icons text-[18px]">
                    delete_outline
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {!addingEdu && data.education.length === 0 && (
          <button
            onClick={() => setAddingEdu(true)}
            className="w-full py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons text-[18px]">
              add_circle_outline
            </span>{" "}
            Add Education
          </button>
        )}

        {addingEdu && (
          <div className="border border-primary/30 rounded-xl p-4 bg-blue-50/30 dark:bg-blue-900/10 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Degree / Qualification *</label>
                <input
                  placeholder="e.g. B.Tech Computer Science"
                  value={eduDraft.degree}
                  onChange={(e) =>
                    setEduDraft((d) => ({ ...d, degree: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Institution *</label>
                <input
                  placeholder="e.g. IIT Bombay"
                  value={eduDraft.institution}
                  onChange={(e) =>
                    setEduDraft((d) => ({ ...d, institution: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Start Date</label>
                <MonthYearPicker
                  value={eduDraft.startDate}
                  onChange={(v) => setEduDraft((d) => ({ ...d, startDate: v }))}
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className={lCls}>End Date</label>
                {eduDraft.current ? (
                  <div className={`${iCls} text-gray-400 italic`}>Present</div>
                ) : (
                  <MonthYearPicker
                    value={eduDraft.endDate}
                    onChange={(v) => setEduDraft((d) => ({ ...d, endDate: v }))}
                    placeholder="End month & year"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={eduDraft.current}
                onChange={(e) =>
                  setEduDraft((d) => ({
                    ...d,
                    current: e.target.checked,
                    endDate: e.target.checked ? "Present" : "",
                  }))
                }
                className="rounded"
              />
              Currently pursuing
            </label>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => {
                  setAddingEdu(false);
                  setEduDraft({
                    degree: "",
                    institution: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                  });
                }}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveEdu} className={saveBtnCls}>
                Save
              </button>
            </div>
          </div>
        )}

        {errors.education && (
          <p className="text-xs text-red-500 mt-2">{errors.education}</p>
        )}
      </div>

      {/* ── Employment (optional) ────────────────────────────────────────────── */}
      <OptionalSection
        title="Employment"
        icon="work"
        adding={addingEmp}
        onAdd={() => setAddingEmp(true)}
        items={data.employment}
        renderItem={(e: EmpEntry) => (
          <>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {e.role}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {e.company}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {e.startDate} – {e.current ? "Present" : e.endDate}
            </p>
            {(e.salary || e.noticePeriod) && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {e.salary && `${e.salary} LPA`}
                {e.salary && e.noticePeriod && " · "}
                {e.noticePeriod && `Notice: ${e.noticePeriod}`}
              </p>
            )}
          </>
        )}
        onRemove={(id: number) =>
          set(
            "employment",
            data.employment.filter((x) => x.id !== id),
          )
        }
        form={
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Job Title *</label>
                <input
                  placeholder="e.g. Software Engineer"
                  value={empDraft.role}
                  onChange={(e) =>
                    setEmpDraft((d) => ({ ...d, role: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Company *</label>
                <input
                  placeholder="e.g. Google"
                  value={empDraft.company}
                  onChange={(e) =>
                    setEmpDraft((d) => ({ ...d, company: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Start Date</label>
                <MonthYearPicker
                  value={empDraft.startDate}
                  onChange={(v) => setEmpDraft((d) => ({ ...d, startDate: v }))}
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className={lCls}>End Date</label>
                {empDraft.current ? (
                  <div className={`${iCls} text-gray-400 italic`}>Present</div>
                ) : (
                  <MonthYearPicker
                    value={empDraft.endDate}
                    onChange={(v) => setEmpDraft((d) => ({ ...d, endDate: v }))}
                    placeholder="End month & year"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={empDraft.current}
                onChange={(e) =>
                  setEmpDraft((d) => ({
                    ...d,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : d.endDate,
                  }))
                }
                className="rounded"
              />
              Currently working here
            </label>
            <div>
              <label className={lCls}>Description</label>
              <textarea
                rows={2}
                placeholder="Brief description of your role and key achievements…"
                value={empDraft.desc}
                onChange={(e) =>
                  setEmpDraft((d) => ({ ...d, desc: e.target.value }))
                }
                className={`${iCls} resize-none`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Salary (at this job)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12"
                    value={empDraft.salary}
                    onChange={(e) =>
                      setEmpDraft((d) => ({ ...d, salary: e.target.value }))
                    }
                    className={`${iCls} pr-14`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                    LPA
                  </span>
                </div>
              </div>
              <div>
                <label className={lCls}>Notice Period</label>
                <select
                  value={empDraft.noticePeriod}
                  onChange={(e) =>
                    setEmpDraft((d) => ({ ...d, noticePeriod: e.target.value }))
                  }
                  className={`${iCls} appearance-none`}
                >
                  <option value="">Select notice period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => {
                  setAddingEmp(false);
                  setEmpDraft({
                    role: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    desc: "",
                    salary: "",
                    noticePeriod: "",
                  });
                }}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveEmp} className={saveBtnCls}>
                Save
              </button>
            </div>
          </div>
        }
      />

      {/* ── Projects (optional) ──────────────────────────────────────────────── */}
      <OptionalSection
        title="Projects"
        icon="code"
        adding={addingProj}
        onAdd={() => setAddingProj(true)}
        items={data.projects}
        renderItem={(p: ProjEntry) => (
          <>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {p.title}
            </p>
            {(p.startDate || p.endDate) && (
              <p className="text-[11px] text-gray-400">
                {p.startDate}
                {p.startDate && p.endDate ? " – " : ""}
                {p.endDate}
              </p>
            )}
          </>
        )}
        onRemove={(id: number) =>
          set(
            "projects",
            data.projects.filter((x) => x.id !== id),
          )
        }
        form={
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className={lCls}>Project Title *</label>
                <input
                  placeholder="e.g. AI-powered Resume Parser"
                  value={projDraft.title}
                  onChange={(e) =>
                    setProjDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Start Date</label>
                <MonthYearPicker
                  value={projDraft.startDate}
                  onChange={(v) =>
                    setProjDraft((d) => ({ ...d, startDate: v }))
                  }
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className={lCls}>End Date</label>
                <MonthYearPicker
                  value={projDraft.endDate}
                  onChange={(v) => setProjDraft((d) => ({ ...d, endDate: v }))}
                  placeholder="End month & year"
                />
              </div>
              <div>
                <label className={lCls}>Type</label>
                <select
                  value={projDraft.type}
                  onChange={(e) =>
                    setProjDraft((d) => ({ ...d, type: e.target.value }))
                  }
                  className={`${iCls} appearance-none`}
                >
                  <option value="(Offsite)">(Offsite)</option>
                  <option value="(Onsite)">(Onsite)</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lCls}>Description</label>
              <textarea
                rows={2}
                placeholder="What did you build and what impact did it have?"
                value={projDraft.desc}
                onChange={(e) =>
                  setProjDraft((d) => ({ ...d, desc: e.target.value }))
                }
                className={`${iCls} resize-none`}
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => {
                  setAddingProj(false);
                  setProjDraft({
                    title: "",
                    type: "(Offsite)",
                    startDate: "",
                    endDate: "",
                    desc: "",
                  });
                }}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveProj} className={saveBtnCls}>
                Save
              </button>
            </div>
          </div>
        }
      />

      {/* ── Research Publications (optional) ─────────────────────────────────── */}
      <OptionalSection
        title="Research Publications"
        icon="menu_book"
        adding={addingPub}
        onAdd={() => setAddingPub(true)}
        items={data.publications}
        renderItem={(p: PubEntry) => (
          <>
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {p.title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {p.publisher}
              {p.date ? ` · ${p.date}` : ""}
            </p>
          </>
        )}
        onRemove={(id: number) =>
          set(
            "publications",
            data.publications.filter((x) => x.id !== id),
          )
        }
        form={
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className={lCls}>Title *</label>
                <input
                  placeholder="e.g. Federated Learning for Edge Devices"
                  value={pubDraft.title}
                  onChange={(e) =>
                    setPubDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Publisher / Journal *</label>
                <input
                  placeholder="e.g. IEEE Software"
                  value={pubDraft.publisher}
                  onChange={(e) =>
                    setPubDraft((d) => ({ ...d, publisher: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Publication Date</label>
                <MonthYearPicker
                  value={pubDraft.date}
                  onChange={(v) => setPubDraft((d) => ({ ...d, date: v }))}
                  placeholder="Select month & year"
                />
              </div>
              <div className="md:col-span-2">
                <label className={lCls}>URL / DOI</label>
                <input
                  placeholder="https://doi.org/..."
                  value={pubDraft.url}
                  onChange={(e) =>
                    setPubDraft((d) => ({ ...d, url: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
            </div>
            <div>
              <label className={lCls}>Abstract / Summary</label>
              <textarea
                rows={2}
                placeholder="Brief description of the publication…"
                value={pubDraft.desc}
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, desc: e.target.value }))
                }
                className={`${iCls} resize-none`}
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => {
                  setAddingPub(false);
                  setPubDraft({
                    title: "",
                    publisher: "",
                    date: "",
                    url: "",
                    desc: "",
                  });
                }}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={savePub} className={saveBtnCls}>
                Save
              </button>
            </div>
          </div>
        }
      />

      {/* ── Certifications (optional) ─────────────────────────────────────────── */}
      <OptionalSection
        title="Certifications"
        icon="verified"
        adding={addingCert}
        onAdd={() => setAddingCert(true)}
        items={data.certifications}
        renderItem={(c: CertEntry) => (
          <>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {c.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {c.issuer}
              {c.issueDate ? ` · Issued ${c.issueDate}` : ""}
              {c.doesExpire && c.expiryDate ? ` · Expires ${c.expiryDate}` : ""}
            </p>
          </>
        )}
        onRemove={(id: number) =>
          set(
            "certifications",
            data.certifications.filter((x) => x.id !== id),
          )
        }
        form={
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Certificate Name *</label>
                <input
                  placeholder="e.g. AWS Solutions Architect"
                  value={certDraft.name}
                  onChange={(e) =>
                    setCertDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Issuing Organisation *</label>
                <input
                  placeholder="e.g. Amazon Web Services"
                  value={certDraft.issuer}
                  onChange={(e) =>
                    setCertDraft((d) => ({ ...d, issuer: e.target.value }))
                  }
                  className={iCls}
                />
              </div>
              <div>
                <label className={lCls}>Issue Date</label>
                <MonthYearPicker
                  value={certDraft.issueDate}
                  onChange={(v) =>
                    setCertDraft((d) => ({ ...d, issueDate: v }))
                  }
                  placeholder="Select month & year"
                />
              </div>
              {certDraft.doesExpire && (
                <div>
                  <label className={lCls}>Expiry Date</label>
                  <MonthYearPicker
                    value={certDraft.expiryDate}
                    onChange={(v) =>
                      setCertDraft((d) => ({ ...d, expiryDate: v }))
                    }
                    placeholder="Select month & year"
                  />
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={certDraft.doesExpire}
                onChange={(e) =>
                  setCertDraft((d) => ({ ...d, doesExpire: e.target.checked }))
                }
                className="rounded"
              />
              This certificate expires
            </label>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => {
                  setAddingCert(false);
                  setCertDraft({
                    name: "",
                    issuer: "",
                    issueDate: "",
                    doesExpire: false,
                    expiryDate: "",
                  });
                }}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveCert} className={saveBtnCls}>
                Save
              </button>
            </div>
          </div>
        }
      />

      {/* ── Location & Job Preferences (separate section) ─────────────────── */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-icons text-primary text-[22px]">
            location_on
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Location &amp; Job Preferences
            </h3>
            <p className="text-[11px] text-gray-400">
              Helps us match you with the right opportunities.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lCls}>Current Location</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, India"
              value={data.currentLocation}
              onChange={(e) => set("currentLocation", e.target.value)}
              className={iCls}
            />
          </div>
          <div>
            <label className={lCls}>Preferred Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Remote"
              value={data.preferredLocation}
              onChange={(e) => set("preferredLocation", e.target.value)}
              className={iCls}
            />
          </div>
          <div>
            <label className={lCls}>Preferred Shift</label>
            <select
              value={data.preferredShift}
              onChange={(e) => set("preferredShift", e.target.value)}
              className={`${iCls} appearance-none`}
            >
              <option value="">Select shift preference</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Any">Any / Flexible</option>
            </select>
          </div>
          <div>
            <label className={lCls}>Desired Employment Type</label>
            <select
              value={data.desiredWorkType}
              onChange={(e) => set("desiredWorkType", e.target.value)}
              className={`${iCls} appearance-none`}
            >
              <option value="">Select work mode</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={lCls}>Expected Salary</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="e.g. 15"
                value={data.expectedSalary}
                onChange={(e) => set("expectedSalary", e.target.value)}
                className={`${iCls} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                LPA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
        >
          <span className="material-icons text-sm">arrow_back</span> Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 text-sm"
        >
          Next Step{" "}
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
