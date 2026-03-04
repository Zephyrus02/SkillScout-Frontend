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
  currentIndustry: "",
  department: "",
  roleCategory: "",
  jobRole: "",
  desiredJobType: "",
  desiredEmploymentType: "",
  preferredShift: "",
  preferredWorkLocation: "",
  expectedSalary: "",
};

const CAREER_LABELS: Record<keyof CareerProfile, string> = {
  primaryCareerGoal: "Primary Career Goal",
  currentIndustry: "Current Industry",
  department: "Department",
  roleCategory: "Role Category",
  jobRole: "Job Role",
  desiredJobType: "Desired Job Type",
  desiredEmploymentType: "Desired Employment Type",
  preferredShift: "Preferred Shift",
  preferredWorkLocation: "Preferred Work Location",
  expectedSalary: "Expected Salary",
};

export default function CareerProfileSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [careerProfile, setCareerProfile] =
    useState<CareerProfile>(EMPTY_CAREER);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CareerProfile>(EMPTY_CAREER);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.career) {
      const c = apiProfile.career;
      setCareerProfile({
        primaryCareerGoal: c.primaryCareerGoal ?? "",
        currentIndustry: c.currentIndustry ?? "",
        department: c.department ?? "",
        roleCategory: c.roleCategory ?? "",
        jobRole: c.jobRole ?? "",
        desiredJobType: c.desiredJobType ?? "",
        desiredEmploymentType: c.desiredEmploymentType ?? "",
        preferredShift: c.preferredShift ?? "",
        preferredWorkLocation: c.preferredWorkLocation ?? "",
        expectedSalary: c.expectedSalary ?? "",
      });
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
    try {
      await profileAPI.updateCareer(draft);
      setCareerProfile(draft);
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

  if (loading && !careerProfile.currentIndustry) {
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
              Career profile
            </h2>
            <button
              onClick={openEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="material-icons text-lg">edit</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          {(
            Object.entries(CAREER_LABELS) as [keyof CareerProfile, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {label}
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {key === "primaryCareerGoal"
                  ? (CAREER_GOAL_OPTIONS.find(
                      (o) => o.value === careerProfile[key],
                    )?.label ?? careerProfile[key])
                  : careerProfile[key] || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit Career Profile" onClose={() => setEditing(false)}>
          <div className="space-y-4">
            {(Object.keys(CAREER_LABELS) as (keyof CareerProfile)[]).map(
              (key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {CAREER_LABELS[key]}
                  </label>
                  {key === "primaryCareerGoal" ? (
                    <select
                      className={`${inputCls} appearance-none`}
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [key]: e.target.value }))
                      }
                    >
                      <option value="">Select a career goal…</option>
                      {CAREER_GOAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={inputCls}
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [key]: e.target.value }))
                      }
                    />
                  )}
                </div>
              ),
            )}
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
