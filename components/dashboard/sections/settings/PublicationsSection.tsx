import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Publication } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const BLANK: Omit<Publication, "id"> = {
  title: "",
  publisher: "",
  date: "",
  url: "",
  desc: "",
};

export default function PublicationsSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [draft, setDraft] = useState<Omit<Publication, "id">>(BLANK);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [addingPub, setAddingPub] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.publications) {
      setPublications(
        apiProfile.publications.map((p) => ({
          id: p.id,
          title: p.title ?? "",
          publisher: p.publisher ?? "",
          date: p.date ?? "",
          url: p.url ?? "",
          desc: p.desc ?? "",
        })),
      );
    }
  }, [apiProfile]);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingPub(null);
    setSaveError(null);
    setAddingPub(true);
  };

  const openEdit = (p: Publication) => {
    setDraft({
      title: p.title,
      publisher: p.publisher,
      date: p.date,
      url: p.url,
      desc: p.desc,
    });
    setEditingPub(p);
    setSaveError(null);
    setAddingPub(false);
  };

  const closeModal = () => {
    setAddingPub(false);
    setEditingPub(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editingPub) {
        const res = await profileAPI.updatePublication(editingPub.id, draft);
        setPublications((ps) =>
          ps.map((p) =>
            p.id === editingPub.id ? { ...draft, id: res.data.id } : p,
          ),
        );
      } else {
        const res = await profileAPI.addPublication(draft);
        setPublications((ps) => [...ps, { ...draft, id: res.data.id }]);
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
      await profileAPI.deletePublication(id);
      setPublications((ps) => ps.filter((p) => p.id !== id));
    } catch {
      // deletion failed silently
    }
  };

  return (
    <>
      <div className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Research Publications
          </h2>
          <button
            onClick={openAdd}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Add
          </button>
        </div>
        {loading && !publications.length ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="group border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight pr-2">
                    {pub.title}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => openEdit(pub)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
                    >
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => remove(pub.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {pub.publisher} • {pub.date}
                </p>
                {pub.desc && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-2">
                    {pub.desc}
                  </p>
                )}
                <a
                  href={pub.url}
                  className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <span className="material-icons text-sm">open_in_new</span>
                  View Publication
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(addingPub || editingPub) && (
        <Modal
          title={editingPub ? "Edit Publication" : "Add Publication"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Title
              </label>
              <input
                className={inputCls}
                value={draft.title}
                placeholder="e.g. Optimizing Microservices for Scale"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publisher / Journal
              </label>
              <input
                className={inputCls}
                value={draft.publisher}
                placeholder="e.g. IEEE Software"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, publisher: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Date
              </label>
              <MonthYearPicker
                value={draft.date}
                onChange={(v) => setDraft((d) => ({ ...d, date: v }))}
                placeholder="Select month & year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication URL
              </label>
              <input
                className={inputCls}
                value={draft.url}
                placeholder="https://..."
                onChange={(e) =>
                  setDraft((d) => ({ ...d, url: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[80px] resize-none`}
                value={draft.desc}
                placeholder="Brief summary of the publication..."
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
                  : editingPub
                    ? "Save Changes"
                    : "Add Publication"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
