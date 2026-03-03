import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Publication } from "./types";

const DEFAULT_PUBLICATIONS: Publication[] = [
  {
    id: 1,
    title: "Optimizing Microservices Architecture for High-Load Systems",
    publisher: "IEEE Software",
    date: "Nov 2023",
    url: "#",
    desc: "Presents a novel framework for decomposing monolithic systems into resilient microservices with adaptive load balancing, reducing infrastructure costs by 28%.",
  },
  {
    id: 2,
    title: "AI-Driven Code Review: A Comparative Study",
    publisher: "ACM Digital Library",
    date: "Jun 2022",
    url: "#",
    desc: "Benchmarks five LLM-based code-review tools against human reviewers across bug detection, style enforcement, and security auditing metrics.",
  },
];

const BLANK: Omit<Publication, "id"> = {
  title: "",
  publisher: "",
  date: "",
  url: "",
  desc: "",
};

export default function PublicationsSection() {
  const [publications, setPublications] =
    useState<Publication[]>(DEFAULT_PUBLICATIONS);
  const [draft, setDraft] = useState<Omit<Publication, "id">>(BLANK);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [addingPub, setAddingPub] = useState(false);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingPub(null);
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
    setAddingPub(false);
  };

  const closeModal = () => {
    setAddingPub(false);
    setEditingPub(null);
  };

  const save = () => {
    if (editingPub) {
      setPublications((ps) =>
        ps.map((p) => (p.id === editingPub.id ? { ...draft, id: p.id } : p)),
      );
    } else {
      setPublications((ps) => [...ps, { ...draft, id: Date.now() }]);
    }
    closeModal();
  };

  const remove = (id: number) =>
    setPublications((ps) => ps.filter((p) => p.id !== id));

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
      </div>

      {/* Add / Edit Modal */}
      {(addingPub || editingPub) && (
        <Modal
          title={editingPub ? "Edit Publication" : "Add Publication"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            {(
              [
                {
                  label: "Publication Title",
                  key: "title",
                  placeholder: "e.g. Optimizing Microservices for Scale",
                },
                {
                  label: "Publisher / Journal",
                  key: "publisher",
                  placeholder: "e.g. IEEE Software",
                },
                {
                  label: "Publication Date (e.g. Nov 2023)",
                  key: "date",
                  placeholder: "e.g. Nov 2023",
                },
                {
                  label: "Publication URL",
                  key: "url",
                  placeholder: "https://...",
                },
              ] as {
                label: string;
                key: keyof typeof draft;
                placeholder: string;
              }[]
            ).map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  className={inputCls}
                  value={draft[key]}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
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
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={save} className={saveBtnCls}>
                {editingPub ? "Save Changes" : "Add Publication"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
