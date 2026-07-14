import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: string; // Material Icons name
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-blue-500/25",
  secondary:
    "bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800",
  ghost:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light dark:text-subtext-dark",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-md",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "right",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="material-icons text-[16px] animate-spin">
          autorenew
        </span>
      )}
      {icon && iconPosition === "left" && !loading && (
        <span className="material-icons text-[16px]">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <span className="material-icons text-[16px]">{icon}</span>
      )}
    </button>
  );
}
