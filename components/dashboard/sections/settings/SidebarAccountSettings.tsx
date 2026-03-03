import { useState } from "react";

export default function SidebarAccountSettings() {
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Email Preferences
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive daily job alerts
            </p>
          </div>
          <button
            onClick={() => setEmailAlerts(!emailAlerts)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              emailAlerts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
            aria-label="Toggle email alerts"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                emailAlerts ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <button className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition flex justify-between items-center py-2">
            <span>Change Password</span>
            <span className="material-icons text-base text-gray-400">
              history
            </span>
          </button>
        </div>
        <div className="pt-2">
          <button className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition flex justify-between items-center py-2">
            <span>Delete Account</span>
            <span className="material-icons text-base">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
