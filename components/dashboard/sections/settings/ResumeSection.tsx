import { useRef, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

function fmtDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ResumeSection() {
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const { profile: apiProfile, refresh } = useProfile();

  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [resumeUploadDate, setResumeUploadDate] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const [resumeHeadline, setResumeHeadline] = useState("");
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState("");
  const [savingHeadline, setSavingHeadline] = useState(false);
  const [headlineError, setHeadlineError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile) {
      setResumeFileName(apiProfile.resumeFileName ?? null);
      setResumeUrl(apiProfile.resumeUrl ?? null);
      setResumeUploadDate(fmtDate(apiProfile.updatedAt));
      setResumeHeadline(apiProfile.header?.title ?? "");
    }
  }, [apiProfile]);

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    try {
      const res = await profileAPI.uploadResume(file);
      setResumeFileName(res.data.resumeFileName ?? file.name);
      setResumeUrl(res.data.resumeUrl ?? null);
      setResumeUploadDate(fmtDate(new Date().toISOString()));
    } catch {
      // ignore upload failure silently
    } finally {
      setResumeUploading(false);
      if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
    }
  };

  const handleResumeDelete = async () => {
    try {
      await profileAPI.deleteResume();
      setResumeFileName(null);
      setResumeUrl(null);
      setResumeUploadDate("");
    } catch {
      // ignore silently
    }
  };

  const saveHeadline = async () => {
    setSavingHeadline(true);
    setHeadlineError(null);
    try {
      await profileAPI.updateHeader({ title: headlineDraft });
      setResumeHeadline(headlineDraft);
      await refresh();
      setEditingHeadline(false);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };
      setHeadlineError(
        err?.response?.data?.error?.message ??
          err?.message ??
          "Failed to save.",
      );
    } finally {
      setSavingHeadline(false);
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
            disabled={resumeUploading}
            className="text-blue-600 text-sm font-medium hover:underline disabled:opacity-50"
          >
            {resumeUploading ? "Uploading…" : "Update"}
          </button>
        </div>
        {resumeFileName ? (
          <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {resumeFileName}
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="material-icons text-white text-xs">
                    check
                  </span>
                </span>
              </h4>
              {resumeUploadDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploaded on {resumeUploadDate}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {resumeUrl && (
                <button
                  onClick={async () => {
                    try {
                      const res = await profileAPI.getResumeDownloadUrl();
                      window.open(res.data.url, "_blank", "noopener,noreferrer");
                    } catch {
                      // ignore silently
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 transition shadow-sm"
                  title="Download resume"
                >
                  <span className="material-icons text-lg">download</span>
                </button>
              )}
              <button
                onClick={handleResumeDelete}
                className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-red-500 transition shadow-sm"
                title="Delete resume"
              >
                <span className="material-icons text-lg">delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => resumeFileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-400 transition"
          >
            <span className="material-icons text-3xl text-gray-300 mb-2">
              upload_file
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to upload your resume (.pdf, .doc, .docx)
            </p>
          </div>
        )}
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
              setHeadlineError(null);
              setEditingHeadline(true);
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="material-icons text-lg">edit</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {resumeHeadline || (
            <span className="text-gray-400 italic">No headline set yet.</span>
          )}
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
              placeholder="Describe your professional background in 2-3 sentences…"
            />
            {headlineError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {headlineError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingHeadline(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button
                onClick={saveHeadline}
                disabled={savingHeadline}
                className={saveBtnCls}
              >
                {savingHeadline ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
