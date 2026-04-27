import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { inputCls, cancelBtnCls, saveBtnCls, cardCls } from "./constants";
import type { Certification } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const BLANK: Omit<Certification, "id"> = {
  name: "",
  issuer: "",
  issueDate: "",
  doesExpire: false,
  expiryDate: "",
};

export default function CertificationsSection() {
  const { profile: apiProfile, loading } = useProfile();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [draft, setDraft] = useState<Omit<Certification, "id">>(BLANK);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [addingCert, setAddingCert] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.certifications) {
      setCertifications(
        apiProfile.certifications.map((c) => ({
          id: c.id,
          name: c.name ?? "",
          issuer: c.issuer ?? "",
          issueDate: c.issueDate ?? "",
          doesExpire: c.doesExpire ?? false,
          expiryDate: c.expiryDate ?? "",
        })),
      );
    }
  }, [apiProfile]);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingCert(null);
    setSaveError(null);
    setAddingCert(true);
  };

  const openEdit = (c: Certification) => {
    setDraft({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      doesExpire: c.doesExpire,
      expiryDate: c.expiryDate,
    });
    setEditingCert(c);
    setSaveError(null);
    setAddingCert(false);
  };

  const closeModal = () => {
    setAddingCert(false);
    setEditingCert(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editingCert) {
        const res = await profileAPI.updateCertification(editingCert.id, draft);
        setCertifications((cs) =>
          cs.map((c) =>
            c.id === editingCert.id ? { ...draft, id: res.data.id } : c,
          ),
        );
      } else {
        const res = await profileAPI.addCertification(draft);
        setCertifications((cs) => [...cs, { ...draft, id: res.data.id }]);
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
      await profileAPI.deleteCertification(id);
      setCertifications((cs) => cs.filter((c) => c.id !== id));
    } catch {
      // deletion failed silently
    }
  };

  return (
    <>
      <div className={cardCls}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Certifications
          </h2>
          <button
            onClick={openAdd}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Add
          </button>
        </div>
        {loading && !certifications.length ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={cert.id}
                className="group flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    idx % 2 === 0
                      ? "bg-orange-100 dark:bg-orange-900/20"
                      : "bg-blue-100 dark:bg-blue-900/20"
                  }`}
                >
                  <span
                    className={`material-icons text-lg ${
                      idx % 2 === 0 ? "text-orange-500" : "text-blue-500"
                    }`}
                  >
                    verified
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {cert.issuer}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Issued: {cert.issueDate}
                    {cert.doesExpire && cert.expiryDate
                      ? ` • Expires: ${cert.expiryDate}`
                      : " • No Expiry"}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={() => openEdit(cert)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="material-icons text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => remove(cert.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                  >
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(addingCert || editingCert) && (
        <Modal
          title={editingCert ? "Edit Certification" : "Add Certification"}
          onClose={closeModal}
          overflowVisible
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Certification Name
              </label>
              <input
                className={inputCls}
                value={draft.name}
                placeholder="e.g. AWS Certified Solutions Architect"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issuing Organization
              </label>
              <input
                className={inputCls}
                value={draft.issuer}
                placeholder="e.g. Amazon Web Services"
                onChange={(e) =>
                  setDraft((d) => ({ ...d, issuer: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date
              </label>
              <MonthYearPicker
                value={draft.issueDate}
                onChange={(v) => setDraft((d) => ({ ...d, issueDate: v }))}
                placeholder="Select issue month & year"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.doesExpire}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    doesExpire: e.target.checked,
                    expiryDate: e.target.checked ? d.expiryDate : "",
                  }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                This certification has an expiry date
              </span>
            </label>
            {draft.doesExpire && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <MonthYearPicker
                  value={draft.expiryDate}
                  onChange={(v) => setDraft((d) => ({ ...d, expiryDate: v }))}
                  placeholder="Select expiry month & year"
                />
              </div>
            )}
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
                  : editingCert
                    ? "Save Changes"
                    : "Add Certification"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
