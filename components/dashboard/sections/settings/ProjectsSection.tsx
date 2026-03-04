import { useState } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Project } from "./types";

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Ascendancy Esports Website",
    type: "(Offsite)",
    startDate: "Feb 2025",
    endDate: "Feb 2025",
    desc: "An full stack web application for end-to-end management of eSports tournaments for Valorant. The website is built using React.js and Node.js and uses MongoDB as the database.",
  },
  {
    id: 2,
    title:
      "Collaborative Vehicle Localization using LSTM based Federated Learning for Trajectory Prediction",
    type: "(Offsite)",
    startDate: "Jan 2025",
    endDate: "Apr 2025",
    desc: "Built a privacy-preserving trajectory prediction system using federated learning, improving the average displacement error by 29.2% when compared to traditional approaches.",
  },
  {
    id: 3,
    title: "SkillScout",
    type: "(Offsite)",
    startDate: "Nov 2024",
    endDate: "Jan 2025",
    desc: "A smart resume parser which recommends active jobs based on the skills, projects, experiences and educational qualification of the candidates",
  },
  {
    id: 4,
    title: "Light Weight Computational Offloading using Deep Learning",
    type: "(Offsite)",
    startDate: "Aug 2024",
    endDate: "Nov 2024",
    desc: "Analyzed operational metrics and identified key bottlenecks within existing systems, resulting in targeted adjustments that improved system efficiency by more than 30%.",
  },
];

const BLANK: Omit<Project, "id"> = {
  title: "",
  type: "(Offsite)",
  startDate: "",
  endDate: "",
  desc: "",
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [draft, setDraft] = useState<Omit<Project, "id">>(BLANK);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addingProject, setAddingProject] = useState(false);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingProject(null);
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
    setAddingProject(false);
  };

  const closeModal = () => {
    setAddingProject(false);
    setEditingProject(null);
  };

  const save = () => {
    if (editingProject) {
      setProjects((ps) =>
        ps.map((p) =>
          p.id === editingProject.id ? { ...draft, id: p.id } : p,
        ),
      );
    } else {
      setProjects((ps) => [...ps, { ...draft, id: Date.now() }]);
    }
    closeModal();
  };

  const remove = (id: number) =>
    setProjects((ps) => ps.filter((p) => p.id !== id));

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
                    className="p-1 text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
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
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={save} className={saveBtnCls}>
                {editingProject ? "Save Changes" : "Add Project"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
