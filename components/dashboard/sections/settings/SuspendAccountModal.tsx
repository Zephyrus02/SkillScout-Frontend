import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { cancelBtnCls } from "./constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuspendAccountModal({ isOpen, onClose }: Props) {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading, onClose]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await authAPI.suspendAccount();
      toast.success("Your account has been suspended.");
      await logout?.();
      router.push("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to suspend account. Please try again.";
      toast.error(msg);
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Suspend Account" onClose={loading ? () => {} : onClose} maxWidth="sm">
      <div className="space-y-5">
        {/* Body text */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Are you sure you want to suspend your account? You will be immediately
          signed out of all devices and won&apos;t be able to sign back in.
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          You can sign up again with the same email address — this will create a
          completely new account with no connection to your current data.
        </p>

        {/* Warning note */}
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-4 py-3">
          <span className="material-icons text-red-500 text-[18px] mt-0.5 shrink-0">
            error_outline
          </span>
          <p className="text-sm text-red-600 dark:text-red-400">
            This action cannot be undone. All your profile data and interview history
            will be preserved but inaccessible.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cancelBtnCls}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl transition"
          >
            {loading ? (
              <>
                <span className="material-icons text-[16px] animate-spin">refresh</span>
                Suspending…
              </>
            ) : (
              "Suspend Account"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
