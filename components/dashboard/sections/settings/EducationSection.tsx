import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Education } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const BLANK: Omit<Education, "id"> = {
  degree: "",
  institution: "",
  startDate: "",
  endDate: "",
  current: false,
};

export default function EducationSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [education, setEducation] = useState<Education[]>([]);
  const [draft, setDraft] = useState<Omit<Education, "id">>(BLANK);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [addingEdu, setAddingEdu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.education) {
      setEducation(
        apiProfile.education.map((e) => ({
          id: e.id,
          degree: e.degree ?? "",
          institution: e.institution ?? "",
          startDate: e.startDate ?? "",
          endDate: e.endDate ?? "",
          current: e.current ?? false,
        })),
      );
    }
  }, [apiProfile]);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingEdu(null);
    setSaveError(null);
    setAddingEdu(true);
  };

  const openEdit = (e: Education) => {
    setDraft({
      degree: e.degree,
      institution: e.institution,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
    });
    setEditingEdu(e);
    setSaveError(null);
    setAddingEdu(false);
  };

  const closeModal = () => {
    setAddingEdu(false);
    setEditingEdu(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editingEdu) {
        const res = await profileAPI.updateEducation(editingEdu.id, draft);
        setEducation((eds) =>
          eds.map((e) =>
            e.id === editingEdu.id ? { ...draft, id: res.data.id } : e,
          ),
        );
      } else {
        const res = await profileAPI.addEducation(draft);
        setEducation((eds) => [...eds, { ...draft, id: res.data.id }]);
      }
      closeModal();
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

  const remove = async (id: string) => {
    try {
      await profileAPI.deleteEducation(id);
      setEducation((eds) => eds.filter((e) => e.id !== id));
    } catch {
      // deletion failed silently
    }
  };

  return (
    <>
      <div id="education" className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Education
          </h2>
          <button
            onClick={openAdd}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Add
          </button>
        </div>
        {loading && !education.length ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((e) => (
              <div
                key={e.id}
                className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700"
              >
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-surface-dark" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {e.degree}
                    </h4>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {e.institution}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {e.startDate} – {e.current ? "Present" : e.endDate}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(e)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => remove(e.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(addingEdu || editingEdu) && (
        <Modal
          title={editingEdu ? "Edit Education" : "Add Education"}
          onClose={closeModal}
          overflowVisible
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Degree / Qualification
              </label>
              <input
                className={inputCls}
                value={draft.degree}
                placeholder="e.g. M.S. Computer Science"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, degree: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Institution / University
              </label>
              <input
                className={inputCls}
                value={draft.institution}
                placeholder="e.g. Stanford University"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, institution: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <MonthYearPicker
                  value={draft.startDate}
                  onChange={(v) => setDraft((d) => ({ ...d, startDate: v }))}
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                {draft.current ? (
                  <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-400 italic">
                    Present
                  </div>
                ) : (
                  <MonthYearPicker
                    value={draft.endDate}
                    onChange={(v) => setDraft((d) => ({ ...d, endDate: v }))}
                    placeholder="End month & year"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.current}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    current: e.target.checked,
                    endDate: e.target.checked ? "Present" : "",
                  }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Currently pursuing
              </span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} className={saveBtnCls}>
                {saving
                  ? "Saving…"
                  : editingEdu
                    ? "Save Changes"
                    : "Add Education"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
