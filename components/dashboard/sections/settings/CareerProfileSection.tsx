import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { CareerProfile } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const CAREER_GOAL_OPTIONS = [
  {
    value: "placement",
    label: "Land my first job & transition into the corporate world",
  },
  { value: "transition", label: "Transition into a new industry" },
  { value: "promotion", label: "Get promoted in current role" },
  { value: "freelance", label: "Start a freelance career" },
  { value: "upskill", label: "Upskill for current market trends" },
  { value: "leadership", label: "Step into a leadership position" },
];

const EMPTY_CAREER: CareerProfile = {
  primaryCareerGoal: "",
  jobRole: "",
  desiredEmploymentType: "",
  preferredShift: "",
  preferredWorkLocation: "",
  expectedSalary: "",
};

export default function CareerProfileSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [careerProfile, setCareerProfile] =
    useState<CareerProfile>(EMPTY_CAREER);
  const [targetIndustries, setTargetIndustries] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CareerProfile>(EMPTY_CAREER);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.career) {
      const c = apiProfile.career;
      setCareerProfile({
        primaryCareerGoal: c.primaryCareerGoal ?? "",
        jobRole: c.jobRole ?? "",
        desiredEmploymentType: c.desiredEmploymentType ?? "",
        preferredShift: c.preferredShift ?? "",
        preferredWorkLocation: c.preferredWorkLocation ?? "",
        expectedSalary: c.expectedSalary ?? "",
      });
    }
    if (apiProfile?.careerDirection) {
      setTargetIndustries(apiProfile.careerDirection.targetIndustries ?? []);
      setTargetRoles(apiProfile.careerDirection.targetRoles ?? []);
    }
  }, [apiProfile]);

  const openEdit = () => {
    setDraft(careerProfile);
    setSaveError(null);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    const salaryVal = draft.expectedSalary;
    const normalized =
      salaryVal && !salaryVal.trim().endsWith("LPA")
        ? `${salaryVal.trim()} LPA`
        : salaryVal;
    const submitDraft = { ...draft, expectedSalary: normalized };
    try {
      await profileAPI.updateCareer(submitDraft);
      setCareerProfile(submitDraft);
      setEditing(false);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };
      setSaveError(
        err?.response?.data?.error?.message ??
          err?.message ??
          "Failed to save.",
      );
    } finally {
      setSaving(false);
    }
  };

  const displaySalary = (s: string) => {
    if (!s) return "—";
    return s.endsWith("LPA") ? s : `${s} LPA`;
  };

  if (loading && !careerProfile.primaryCareerGoal) {
    return (
      <div className={`${cardCls} animate-pulse space-y-4`}>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Career Profile
            </h2>
            <button
              onClick={openEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="material-icons text-lg">edit</span>
            </button>
          </div>
        </div>

        {/* ── Career overview ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-6">
          {/* Primary Career Goal — full width, value can be long */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
              Primary Career Goal
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {CAREER_GOAL_OPTIONS.find(
                (o) => o.value === careerProfile.primaryCareerGoal,
              )?.label ||
                careerProfile.primaryCareerGoal ||
                "—"}
            </p>
          </div>

          {/* Current Job Role */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
              Current Job Role
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {careerProfile.jobRole || "—"}
            </p>
          </div>
        </div>

        {/* ── Target industries & roles ────────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mb-6">
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Targets
            </p>
            <span className="text-xs text-gray-300 dark:text-gray-600 italic">
              — set in Profile Setup · Step 3
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Desired Industry */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                Desired Industry
              </p>
              {targetIndustries.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {targetIndustries.map((ind) => (
                    <span
                      key={ind}
                      className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/40"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">—</p>
              )}
            </div>

            {/* Desired Job Roles */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                Desired Job Roles
              </p>
              {targetRoles.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {targetRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full border border-green-100 dark:border-green-800/40"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">—</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Preferences ─────────────────────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-4">
            Preferences
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Employment Type
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {careerProfile.desiredEmploymentType || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Preferred Shift
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {careerProfile.preferredShift || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Work Location
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {careerProfile.preferredWorkLocation || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Expected Salary
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {displaySalary(careerProfile.expectedSalary)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit Career Profile" onClose={() => setEditing(false)}>
          <div className="space-y-4">
            {/* Primary Career Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Career Goal
              </label>
              <select
                className={`${inputCls} appearance-none`}
                value={draft.primaryCareerGoal}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    primaryCareerGoal: e.target.value,
                  }))
                }
              >
                <option value="">Select a career goal…</option>
                {CAREER_GOAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Job Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Job Role
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Software Engineer"
                value={draft.jobRole}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, jobRole: e.target.value }))
                }
              />
            </div>

            {/* Desired Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Desired Employment Type
              </label>
              <select
                className={`${inputCls} appearance-none`}
                value={draft.desiredEmploymentType}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    desiredEmploymentType: e.target.value,
                  }))
                }
              >
                <option value="">Select type…</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Preferred Shift */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Shift
              </label>
              <select
                className={`${inputCls} appearance-none`}
                value={draft.preferredShift}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, preferredShift: e.target.value }))
                }
              >
                <option value="">Select shift…</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Any">Any</option>
              </select>
            </div>

            {/* Preferred Work Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Work Location
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Bangalore"
                value={draft.preferredWorkLocation}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    preferredWorkLocation: e.target.value,
                  }))
                }
              />
            </div>

            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Salary
              </label>
              <div className="relative">
                <input
                  type="number"
                  className={`${inputCls} pr-14`}
                  placeholder="e.g. 12"
                  value={draft.expectedSalary.replace(/\s*LPA$/i, "")}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      expectedSalary: e.target.value,
                    }))
                  }
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                  LPA
                </span>
              </div>
            </div>

            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={save} disabled={saving} className={saveBtnCls}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
