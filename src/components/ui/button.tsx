"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "shimmer";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    const variantStyles = {
      primary:
        "bg-accent hover:bg-accent-hover text-white shadow-md hover:shadow-accent-glow hover:shadow-lg",
      secondary:
        "bg-surface-elevated hover:bg-surface-card-hover text-text-primary border border-surface-border hover:border-surface-border-strong",
      outline:
        "bg-transparent hover:bg-surface-card-hover text-text-primary border border-surface-border hover:border-surface-border-strong",
      ghost:
        "bg-transparent hover:bg-surface-card-hover text-text-dim hover:text-text-primary",
      success:
        "bg-success hover:bg-emerald-600 text-white shadow-md hover:shadow-success-glow",
      shimmer:
        "relative overflow-hidden bg-accent text-white border border-white/20 shadow-lg hover:shadow-accent-glow before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer-sweep_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
