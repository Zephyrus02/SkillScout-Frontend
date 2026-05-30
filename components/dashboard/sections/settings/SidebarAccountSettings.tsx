import { useState, useEffect } from "react";
import { useProfile, invalidateProfileCache } from "@/hooks/useProfile";
import { profileAPI, authAPI } from "@/lib/api";
import { toast } from "sonner";
import SuspendAccountModal from "./SuspendAccountModal";

export default function SidebarAccountSettings() {
  const { profile, refresh } = useProfile();
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [publicToggling, setPublicToggling] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsPublic(profile.isPublicProfile ?? false);
    }
  }, [profile]);

  const handleTogglePublic = async () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    setPublicToggling(true);
    try {
      await profileAPI.toggleVisibility(newValue);
      invalidateProfileCache();
      await refresh();
    } catch {
      setIsPublic(!newValue);
    } finally {
      setPublicToggling(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    try {
      await authAPI.requestPasswordReset();
      toast.success(
        "Password reset link sent! Check your email — the link expires in 1 hour.",
        { duration: 6000 },
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        "Failed to send reset link. Please try again.";
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-icons text-gray-900 dark:text-white">
            settings
          </span>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Account Settings
          </h3>
        </div>
        <div className="space-y-4">
          {/* Public Profile toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Public Profile
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Make your profile public
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center gap-3 text-gray-900">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isPublic}
                onChange={handleTogglePublic}
                disabled={publicToggling}
                aria-label="Toggle public profile"
              />
              <div className="peer h-7 w-12 rounded-full bg-gray-200 dark:bg-gray-700 ring-offset-1 transition-colors duration-200 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 peer-disabled:opacity-50"></div>
              <span className="dot absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
            </label>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            {/* Email Preferences toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Preferences
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive daily job alerts
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center gap-3 text-gray-900">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  aria-label="Toggle email alerts"
                />
                <div className="peer h-7 w-12 rounded-full bg-gray-200 dark:bg-gray-700 ring-offset-1 transition-colors duration-200 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500"></div>
                <span className="dot absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
              </label>
            </div>
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition flex justify-between items-center py-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Send password change link to email"
            >
              <span>Change Password</span>
              {passwordLoading ? (
                <span className="material-icons text-base text-gray-400 animate-spin">
                  refresh
                </span>
              ) : (
                <span className="material-icons text-base text-gray-400">
                  history
                </span>
              )}
            </button>
          </div>

          {/* Suspend Account */}
          <div className="pt-2">
            <button
              onClick={() => setSuspendModalOpen(true)}
              className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition flex justify-between items-center py-2"
              aria-label="Suspend account"
            >
              <span>Suspend Account</span>
              <span className="material-icons text-base">pause_circle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suspend Account confirmation modal */}
      <SuspendAccountModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
      />
    </>
  );
}
