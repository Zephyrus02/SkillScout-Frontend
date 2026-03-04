import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { CareerProfile } from "./types";

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

const DEFAULT_CAREER: CareerProfile = {
  primaryCareerGoal: "upskill",
  currentIndustry: "Software Product",
  department: "Engineering - Software & QA",
  roleCategory: "Software Development",
  jobRole: "Full Stack Developer",
  desiredJobType: "permanent",
  desiredEmploymentType: "Full Time",
  preferredShift: "Day",
  preferredWorkLocation: "Pune",
  expectedSalary: "₹8,00,000",
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
  const [careerProfile, setCareerProfile] =
    useState<CareerProfile>(DEFAULT_CAREER);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CareerProfile>(DEFAULT_CAREER);

  const openEdit = () => {
    setDraft(careerProfile);
    setEditing(true);
  };

  const save = () => {
    setCareerProfile(draft);
    setEditing(false);
  };

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
                  : careerProfile[key]}
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
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={save} className={saveBtnCls}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
