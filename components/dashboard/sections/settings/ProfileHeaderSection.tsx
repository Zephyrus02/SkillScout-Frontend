import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls } from "./constants";
import type { ProfileHeader } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const EMPTY: ProfileHeader = {
  name: "",
  title: "",
  location: "",
  experience: "",
  salary: "",
  noticePeriod: "",
  avatarUrl: null,
  avatarInitials: "",
};

const PROFILE_FIELDS: {
  label: string;
  key: keyof Omit<ProfileHeader, "avatarUrl" | "avatarInitials">;
}[] = [
  { label: "Full Name", key: "name" },
  { label: "Bio", key: "title" },
  { label: "Current Location", key: "location" },
  { label: "Current Salary", key: "salary" },
  { label: "Notice Period", key: "noticePeriod" },
];

function toInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileHeaderSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { profile: apiProfile, loading, refresh } = useProfile();
  const completionPct = apiProfile?.completionPercentage ?? 0;
  const isPublic = apiProfile?.isPublicProfile ?? false;
  const profileUserId = apiProfile?.userId;

  const [profile, setProfile] = useState<ProfileHeader>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileHeader>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [noticePeriodOpen, setNoticePeriodOpen] = useState(false);

  // Seed local state whenever the API profile loads / refreshes
  useEffect(() => {
    if (apiProfile?.header) {
      const h = apiProfile.header;
      setProfile({
        name: h.name ?? "",
        title: h.title ?? "",
        location: h.location ?? "",
        experience: h.experience ?? "",
        salary: h.salary ?? "",
        noticePeriod: h.noticePeriod ?? "",
        avatarUrl: h.avatarUrl ?? null,
        avatarInitials: toInitials(h.name ?? ""),
      });
    }
  }, [apiProfile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await profileAPI.uploadAvatar(file);
      await refresh();
    } catch {
      // silently ignore - avatar is non-critical
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openEdit = () => {
    setDraft(profile);
    setSaveError(null);
    setNoticePeriodOpen(false);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);

    const salaryVal = draft.salary;
    const normalizedSalary =
      salaryVal && !salaryVal.trim().endsWith("LPA")
        ? `${salaryVal.trim()} LPA`
        : salaryVal;

    try {
      await profileAPI.updateHeader({
        name: draft.name,
        title: draft.title,
        location: draft.location,
        experience: draft.experience,
        salary: normalizedSalary,
        noticePeriod: draft.noticePeriod,
      });
      setProfile({
        ...draft,
        salary: normalizedSalary,
        avatarInitials: toInitials(draft.name),
      });
      setEditing(false);
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

  // Loading skeleton
  if (loading && !profile.name) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
        <div className="flex gap-6 items-end pt-8">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-48" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-72" />
            <div className="grid grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end pt-8 md:pt-0 -mt-4 md:mt-4">
          {/* Avatar */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="w-28 h-28 rounded-full p-1 bg-white dark:bg-surface-dark shadow-sm z-10">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {profile.avatarInitials || "?"}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-md whitespace-nowrap">
              {completionPct}%
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title="Upload profile picture"
              className="absolute bottom-1 right-0 z-20 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 text-gray-500 hover:text-blue-600 transition disabled:opacity-50"
            >
              <span className="material-icons text-sm">
                {avatarUploading ? "hourglass_empty" : "edit"}
              </span>
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.name || "—"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {profile.title}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={openEdit}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition whitespace-nowrap"
                >
                  Edit Profile
                </button>
                {isPublic && profileUserId && (
                  <button
                    onClick={() => router.push(`/profile/${profileUserId}`)}
                    className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm font-medium transition whitespace-nowrap"
                  >
                    View Public Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {[
                {
                  icon: "location_on",
                  label: "Location",
                  value: profile.location,
                },
                {
                  icon: "work",
                  label: "Experience",
                  value: profile.experience,
                },
                {
                  icon: "attach_money",
                  label: "Current Salary",
                  value: profile.salary
                    ? profile.salary.endsWith("LPA")
                      ? profile.salary
                      : `${profile.salary} LPA`
                    : "",
                },
                {
                  icon: "calendar_month",
                  label: "Notice Period",
                  value: profile.noticePeriod,
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-xl">
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {s.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {s.value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal
          title="Edit Profile"
          onClose={() => setEditing(false)}
          overflowVisible
        >
          <div className="space-y-4">
            {PROFILE_FIELDS.map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                {key === "salary" ? (
                  <div className="relative">
                    <input
                      type="number"
                      className={`${inputCls} pr-14`}
                      placeholder="e.g. 12"
                      value={(draft[key] as string).replace(/\s*LPA$/i, "")}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [key]: e.target.value }))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                      LPA
                    </span>
                  </div>
                ) : key === "noticePeriod" ? (
                  <div className="relative">
                    <div
                      className={`${inputCls} flex items-center justify-between cursor-pointer`}
                      onClick={() => setNoticePeriodOpen(!noticePeriodOpen)}
                    >
                      <span
                        className={
                          draft[key]
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500"
                        }
                      >
                        {draft[key] || "Select notice period..."}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${noticePeriodOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {noticePeriodOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setNoticePeriodOpen(false)}
                        />
                        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                          <div
                            className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setDraft((d) => ({ ...d, [key]: "" }));
                              setNoticePeriodOpen(false);
                            }}
                          >
                            Select notice period...
                          </div>
                          {[
                            "Available to join immediately",
                            "1 month",
                            "2 months",
                            "3 months",
                            ">3 months",
                          ].map((option) => (
                            <div
                              key={option}
                              className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                                draft[key] === option
                                  ? "bg-blue-600 text-white font-medium"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => {
                                setDraft((d) => ({ ...d, [key]: option }));
                                setNoticePeriodOpen(false);
                              }}
                            >
                              {option}
                              {draft[key] === option && (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : key === "title" ? (
                  <div>
                    <input
                      className={inputCls}
                      maxLength={100}
                      value={draft[key] as string}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [key]: e.target.value }))
                      }
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {((draft[key] as string) || "").length}/100
                    </div>
                  </div>
                ) : (
                  <input
                    className={inputCls}
                    value={draft[key] as string}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={save} disabled={saving} className={saveBtnCls}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
