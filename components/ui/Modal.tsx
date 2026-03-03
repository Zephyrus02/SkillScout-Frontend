import React from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

export default function Modal({
  title,
  onClose,
  children,
  maxWidth = "md",
}: ModalProps) {
  const maxWidthCls = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full ${maxWidthCls} p-6 z-10 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
