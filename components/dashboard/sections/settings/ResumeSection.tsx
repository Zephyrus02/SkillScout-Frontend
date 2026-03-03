import { useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";

export default function ResumeSection() {
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFileName, setResumeFileName] = useState(
    "alex_chen_resume_v4.pdf",
  );
  const [resumeUploadDate, setResumeUploadDate] = useState("Feb 24, 2024");

  const [resumeHeadline, setResumeHeadline] = useState(
    "Senior Full Stack Engineer with 5+ years of experience in building scalable web applications using React, Node.js, and AWS. Proven track record of optimizing system performance by 40% and leading cross-functional teams. Passionate about AI-driven development tools and cloud architecture.",
  );
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState(resumeHeadline);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      const d = new Date();
      setResumeUploadDate(
        d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
    }
  };

  return (
    <>
      <input
        ref={resumeFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleResumeChange}
      />

      {/* Resume Upload */}
      <div id="resume" className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Resume
          </h2>
          <button
            onClick={() => resumeFileInputRef.current?.click()}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Update
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {resumeFileName}
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-xs">check</span>
              </span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Uploaded on {resumeUploadDate}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 transition shadow-sm">
              <span className="material-icons text-lg">download</span>
            </button>
            <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 transition shadow-sm">
              <span className="material-icons text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Headline */}
      <div className={cardCls}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Profile Headline
          </h2>
          <button
            onClick={() => {
              setHeadlineDraft(resumeHeadline);
              setEditingHeadline(true);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="material-icons text-lg">edit</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {resumeHeadline}
        </p>
      </div>

      {/* Edit Headline Modal */}
      {editingHeadline && (
        <Modal
          title="Edit Profile Headline"
          onClose={() => setEditingHeadline(false)}
        >
          <div className="space-y-4">
            <textarea
              className={`${inputCls} min-h-[120px] resize-none`}
              value={headlineDraft}
              onChange={(e) => setHeadlineDraft(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingHeadline(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResumeHeadline(headlineDraft);
                  setEditingHeadline(false);
                }}
                className={saveBtnCls}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
