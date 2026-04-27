import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Project } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const BLANK: Omit<Project, "id"> = {
  title: "",
  type: "(Offsite)",
  startDate: "",
  endDate: "",
  desc: "",
};

export default function ProjectsSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Omit<Project, "id">>(BLANK);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addingProject, setAddingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.projects) {
      setProjects(
        apiProfile.projects.map((p) => ({
          id: p.id,
          title: p.title ?? "",
          type: p.type ?? "(Offsite)",
          startDate: p.startDate ?? "",
          endDate: p.endDate ?? "",
          desc: p.desc ?? "",
        })),
      );
    }
  }, [apiProfile]);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingProject(null);
    setSaveError(null);
    setAddingProject(true);
  };

  const openEdit = (p: Project) => {
    setDraft({
      title: p.title,
      type: p.type,
      startDate: p.startDate,
      endDate: p.endDate,
      desc: p.desc,
    });
    setEditingProject(p);
    setSaveError(null);
    setAddingProject(false);
  };

  const closeModal = () => {
    setAddingProject(false);
    setEditingProject(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editingProject) {
        const res = await profileAPI.updateProject(editingProject.id, draft);
        setProjects((ps) =>
          ps.map((p) =>
            p.id === editingProject.id ? { ...draft, id: res.data.id } : p,
          ),
        );
      } else {
        const res = await profileAPI.addProject(draft);
        setProjects((ps) => [...ps, { ...draft, id: res.data.id }]);
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
      await profileAPI.deleteProject(id);
      setProjects((ps) => ps.filter((p) => p.id !== id));
    } catch {
      // deletion failed silently
    }
  };

  return (
    <>
      <div id="projects" className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Projects
          </h2>
          <button
            onClick={openAdd}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Add project
          </button>
        </div>
        {loading && !projects.length ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {projects.map((p) => (
              <div key={p.id} className="group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pr-2">
                    {p.title}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="material-icons text-base">edit</span>
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="material-icons text-base">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {p.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {p.startDate} – {p.endDate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(addingProject || editingProject) && (
        <Modal
          title={editingProject ? "Edit Project" : "Add Project"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Title
              </label>
              <input
                className={inputCls}
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type (e.g. Offsite)
              </label>
              <input
                className={inputCls}
                value={draft.type}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, type: e.target.value }))
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
                <MonthYearPicker
                  value={draft.endDate}
                  onChange={(v) => setDraft((d) => ({ ...d, endDate: v }))}
                  placeholder="End month & year"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[100px] resize-none`}
                value={draft.desc}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, desc: e.target.value }))
                }
              />
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
                  : editingProject
                    ? "Save Changes"
                    : "Add Project"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
