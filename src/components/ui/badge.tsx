import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-elevated text-text-dim border border-surface-border",
    accent: "bg-accent-soft text-accent border border-accent/25",
    success: "bg-success-soft text-success border border-success/25",
    warning: "bg-warning-soft text-warning border border-warning/25",
    danger: "bg-danger-soft text-danger border border-danger/25",
    info: "bg-info-soft text-info border border-info/25",
    outline: "bg-transparent text-text-primary border border-surface-border-strong",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
