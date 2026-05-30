import { useState, useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { inputCls, cancelBtnCls, saveBtnCls } from "./constants";
import type { SocialLinks } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

const EMPTY_LINKS: SocialLinks = {
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
};

const SOCIAL_FIELDS: { label: string; key: keyof SocialLinks }[] = [
  { label: "LinkedIn Profile URL", key: "linkedin" },
  { label: "GitHub Profile URL", key: "github" },
  { label: "X (Twitter) Profile URL", key: "twitter" },
  { label: "Personal Website URL", key: "website" },
];

const SOCIAL_ICONS: {
  key: keyof SocialLinks;
  icon: React.ReactNode;
}[] = [
    {
      key: "linkedin",
      icon: (
        <span
          className="w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: "#0A66C2" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </span>
      ),
    },
    {
      key: "github",
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-white dark:fill-gray-900"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </span>
      ),
    },
    {
      key: "twitter",
      icon: (
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-black dark:bg-white">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white dark:fill-black">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
      ),
    },
    {
      key: "website",
      icon: (
        <span
          className="w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: "#7C3AED" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </span>
      ),
    },
  ];

const validateUrl = (url: string, keyword?: string) => {
  if (!url.trim()) return true;
  try {
    const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.includes(".")) return false;
    if (keyword && !parsed.hostname.toLowerCase().includes(keyword))
      return false;
    return true;
  } catch {
    return false;
  }
};

const getFieldError = (key: keyof SocialLinks, value: string) => {
  if (!value.trim()) return null;
  if (key === "linkedin" && !validateUrl(value, "linkedin")) {
    return "Please enter a valid LinkedIn URL.";
  }
  if (key === "github" && !validateUrl(value, "github")) {
    return "Please enter a valid GitHub URL.";
  }
  if (
    key === "twitter" &&
    !validateUrl(value, "twitter") &&
    !validateUrl(value, "x.com")
  ) {
    return "Please enter a valid X (Twitter) URL.";
  }
  if (key === "website" && !validateUrl(value)) {
    return "Please enter a valid Website URL.";
  }
  return null;
};

const isFieldValid = (key: keyof SocialLinks, value: string) => {
  return getFieldError(key, value) === null;
};

const getFieldClassName = (key: keyof SocialLinks, value: string) => {
  const base =
    "w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2";
  if (!value.trim()) {
    return `${base} border-blue-500 focus:ring-blue-500 dark:border-blue-500`;
  }
  if (isFieldValid(key, value)) {
    return `${base} border-green-500 focus:ring-green-500 dark:border-green-500`;
  }
  return `${base} border-red-500 focus:ring-red-500 dark:border-red-500`;
};

export default function SidebarSocialLinks() {
  const { profile: apiProfile } = useProfile();
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(EMPTY_LINKS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SocialLinks>(EMPTY_LINKS);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (apiProfile?.socialLinks) {
      setSocialLinks({
        linkedin: apiProfile.socialLinks.linkedin ?? "",
        github: apiProfile.socialLinks.github ?? "",
        twitter: apiProfile.socialLinks.twitter ?? "",
        website: apiProfile.socialLinks.website ?? "",
      });
    }
  }, [apiProfile]);

  const openEdit = () => {
    setDraft(socialLinks);
    setSaveError(null);
    setEditing(true);
  };

  const hasInvalidLinks = SOCIAL_FIELDS.some(
    ({ key }) => !isFieldValid(key, draft[key])
  );

  const save = async () => {
    if (hasInvalidLinks) return;
    setSaving(true);
    setSaveError(null);
    try {
      await profileAPI.updateSocialLinks(draft);
      setSocialLinks(draft);
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

  return (
    <>
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Social Links
          </h3>
          <button
            onClick={openEdit}
            className="text-blue-600 text-xs font-bold hover:underline"
          >
            Edit
          </button>
        </div>
        <ul className="space-y-3">
          {SOCIAL_ICONS.filter(
            ({ key }) => !!(socialLinks[key] ?? "").trim(),
          ).map(({ key, icon }) => {
            const raw = socialLinks[key];
            const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
            return (
              <li
                key={key}
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
              >
                {icon}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-blue-600 hover:underline"
                >
                  {raw}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit Social Links" onClose={() => setEditing(false)} overflowVisible>
          <div className="space-y-4">
            {SOCIAL_FIELDS.map(({ label, key }) => {
              const error = getFieldError(key, draft[key]);
              return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <div className="relative flex items-center">
                  <input
                    className={`${getFieldClassName(key, draft[key])} ${error ? 'pr-10' : ''}`}
                    value={draft[key]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                  />
                  {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center">
                      <div className="relative group cursor-pointer flex items-center justify-center">
                        <TriangleAlert className="w-5 h-5 text-red-500" />
                        <div className="absolute bottom-full left-1/2 -ml-4 mb-2 whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-800 text-red-500 border border-black text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {error}
                          {/* Outer Black Triangle */}
                          <div className="absolute top-full left-[9px] -mt-[1px] border-[7px] border-transparent border-t-black"></div>
                          {/* Inner White Triangle */}
                          <div className="absolute top-full left-[10px] -mt-[2px] border-[6px] border-transparent border-t-white dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )})}
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
              <button
                onClick={save}
                disabled={saving || hasInvalidLinks}
                className={`${saveBtnCls} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
