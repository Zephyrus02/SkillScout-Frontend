import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Employment } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const BLANK: Omit<Employment, "id"> = {
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  current: false,
  desc: "",
  salary: "",
  noticePeriod: "",
};

export default function EmploymentSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [draft, setDraft] = useState<Omit<Employment, "id">>(BLANK);
  const [editingEmp, setEditingEmp] = useState<Employment | null>(null);
  const [addingEmp, setAddingEmp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.employment) {
      setEmployment(
        apiProfile.employment.map((e) => ({
          id: e.id,
          role: e.role ?? "",
          company: e.company ?? "",
          startDate: e.startDate ?? "",
          endDate: e.endDate ?? "",
          current: e.current ?? false,
          desc: e.desc ?? "",
          salary:
            (e as unknown as { salary?: string | null }).salary?.toString() ??
            "",
          noticePeriod:
            (e as unknown as { noticePeriod?: string | null }).noticePeriod ??
            "",
        })),
      );
    }
  }, [apiProfile]);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingEmp(null);
    setSaveError(null);
    setAddingEmp(true);
  };

  const openEdit = (e: Employment) => {
    setDraft({
      role: e.role,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      desc: e.desc,
      salary: e.salary ? e.salary.replace(/\s*LPA$/i, "").trim() : "",
      noticePeriod: e.noticePeriod,
    });
    setEditingEmp(e);
    setSaveError(null);
    setAddingEmp(false);
  };

  const closeModal = () => {
    setAddingEmp(false);
    setEditingEmp(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    const submitDraft = {
      ...draft,
      salary:
        draft.salary && !draft.salary.endsWith("LPA")
          ? `${draft.salary} LPA`
          : draft.salary,
    };
    try {
      if (editingEmp) {
        const res = await profileAPI.updateEmployment(
          editingEmp.id,
          submitDraft,
        );
        setEmployment((es) =>
          es.map((e) =>
            e.id === editingEmp.id ? { ...submitDraft, id: res.data.id } : e,
          ),
        );
      } else {
        const res = await profileAPI.addEmployment(submitDraft);
        setEmployment((es) => [...es, { ...submitDraft, id: res.data.id }]);
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
      await profileAPI.deleteEmployment(id);
      setEmployment((es) => es.filter((e) => e.id !== id));
    } catch {
      // deletion failed silently
    }
  };

  return (
    <>
      <div id="employment" className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Employment
          </h2>
          <button
            onClick={openAdd}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Add
          </button>
        </div>
        {loading && !employment.length ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {employment.map((e) => (
              <div
                key={e.id}
                className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700"
              >
                <div
                  className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface-dark ${
                    e.current ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {e.role}
                    </h4>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {e.company}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {e.startDate} – {e.current ? "Present" : e.endDate}
                    </p>
                    {(e.salary || e.noticePeriod) && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {e.salary &&
                          (e.salary.endsWith("LPA")
                            ? e.salary
                            : `${e.salary} LPA`)}
                        {e.salary && e.noticePeriod && " · "}
                        {e.noticePeriod && `Notice: ${e.noticePeriod}`}
                      </p>
                    )}
                    {e.desc && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {e.desc}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(e)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
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
      {(addingEmp || editingEmp) && (
        <Modal
          title={editingEmp ? "Edit Employment" : "Add Employment"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Role / Title
              </label>
              <input
                className={inputCls}
                value={draft.role}
                placeholder="e.g. Senior Software Engineer"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, role: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                className={inputCls}
                value={draft.company}
                placeholder="e.g. TechCorp Inc."
                onChange={(e) =>
                  setDraft((d) => ({ ...d, company: e.target.value }))
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
                Currently working here
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[90px] resize-none`}
                value={draft.desc}
                placeholder="Brief description of your role and key achievements..."
                onChange={(e) =>
                  setDraft((d) => ({ ...d, desc: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    className={`${inputCls} pr-14`}
                    value={draft.salary}
                    placeholder="e.g. 12"
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, salary: e.target.value }))
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                    LPA
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notice Period
                </label>
                <select
                  className={`${inputCls} appearance-none`}
                  value={draft.noticePeriod}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, noticePeriod: e.target.value }))
                  }
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
            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} className={saveBtnCls}>
                {saving
                  ? "Saving…"
                  : editingEmp
                    ? "Save Changes"
                    : "Add Employment"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
