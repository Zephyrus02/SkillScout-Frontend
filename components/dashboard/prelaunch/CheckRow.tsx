import React from "react";
import type { CheckStatus, BadgeColor } from "./types";

const iconBg: Record<CheckStatus, string> = {
  ok: "bg-emerald-50 border-emerald-200",
  error: "bg-red-50 border-red-200",
  checking: "bg-slate-50 border-slate-200",
  pending: "bg-slate-50 border-slate-200",
};
const iconColor: Record<CheckStatus, string> = {
  ok: "text-emerald-500",
  error: "text-red-500",
  checking: "text-slate-400",
  pending: "text-slate-400",
};
const badgeCls: Record<BadgeColor, string> = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  blue: "text-blue-600 bg-blue-50 border-blue-200",
  red: "text-red-600 bg-red-50 border-red-200",
  slate: "text-slate-500 bg-slate-100 border-slate-200",
};

interface CheckRowProps {
  status: CheckStatus;
  icon: string;
  title: string;
  badge: { label: string; color: BadgeColor };
  borderBottom?: boolean;
  spinnerIcon?: boolean;
  children?: React.ReactNode;
}

export default function CheckRow({
  status,
  icon,
  title,
  badge,
  borderBottom,
  spinnerIcon,
  children,
}: CheckRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${iconBg[status]}`}
      >
        {spinnerIcon && status === "ok" ? (
          <div className="flex gap-[2px] items-center h-3">
            {[0.5, 0.7, 0.4].map((d, i) => (
              <div
                key={i}
                className="w-0.5 bg-blue-500 rounded-full"
                style={{
                  height: "40%",
                  animation: `mic-bounce ${d}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        ) : (
          <span className={`material-icons text-lg ${iconColor[status]}`}>
            {status === "checking" ? "hourglass_top" : icon}
          </span>
        )}
      </div>
      <div
        className={`flex-1 ${borderBottom ? "border-b border-gray-100 pb-5" : ""}`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded border ${badgeCls[badge.color]}`}
          >
            {badge.label}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
