import { useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls } from "./constants";
import type { ProfileHeader } from "./types";

const DEFAULT_PROFILE: ProfileHeader = {
  name: "Alex Chen",
  title: "Senior Software Engineer at TechCorp",
  location: "San Francisco, CA",
  experience: "5 Years 2 Months",
  salary: "$165,000",
  noticePeriod: "1 Month",
  avatarUrl: null,
  avatarInitials: "AC",
};

const PROFILE_FIELDS: { label: string; key: keyof ProfileHeader }[] = [
  { label: "Full Name", key: "name" },
  { label: "Title / Position", key: "title" },
  { label: "Location", key: "location" },
  { label: "Experience (e.g. 5 Years 2 Months)", key: "experience" },
  { label: "Current Salary", key: "salary" },
  { label: "Notice Period", key: "noticePeriod" },
];

export default function ProfileHeaderSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileHeader>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileHeader>(DEFAULT_PROFILE);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((p) => ({ ...p, avatarUrl: url }));
    }
  };

  const openEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const save = () => {
    setProfile(draft);
    setEditing(false);
  };

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
                    {profile.avatarInitials}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-md whitespace-nowrap">
              100%
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile picture"
              className="absolute bottom-1 right-0 z-20 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 text-gray-500 hover:text-blue-600 transition"
            >
              <span className="material-icons text-sm">edit</span>
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {profile.title}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">update</span>
                  Profile last updated - Today
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={openEdit}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition whitespace-nowrap"
                >
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm font-medium transition whitespace-nowrap">
                  View Public Profile
                </button>
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
                  value: profile.salary,
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
                      {s.value}
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
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <div className="space-y-4">
            {PROFILE_FIELDS.map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  className={inputCls}
                  value={draft[key] as string}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={save} className={saveBtnCls}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
