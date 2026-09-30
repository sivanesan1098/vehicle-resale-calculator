"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  label?: string;
  sublabel?: string;
  className?: string;
  accentColor?: "accent" | "success" | "warning";
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  label,
  sublabel,
  className,
  accentColor = "accent",
}: SliderProps) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const activeColorClasses = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
  };

  const thumbGlowClasses = {
    accent: "shadow-[0_0_15px_rgba(255,91,31,0.5)] border-accent",
    success: "shadow-[0_0_15px_rgba(16,185,129,0.5)] border-success",
    warning: "shadow-[0_0_15px_rgba(245,158,11,0.5)] border-warning",
  };

  return (
    <div className={cn("w-full space-y-2 select-none", className)}>
      {(label || formatValue) && (
        <div className="flex items-center justify-between text-sm">
          <div>
            {label && <span className="font-medium text-text-primary">{label}</span>}
            {sublabel && <span className="block text-xs text-text-dim">{sublabel}</span>}
          </div>
          <span className="font-display font-semibold text-text-primary text-base">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}

      <div className="relative flex items-center h-7 cursor-pointer group">
        {/* Track Background */}
        <div className="w-full h-2 rounded-full bg-surface-elevated border border-surface-border relative overflow-hidden">
          {/* Active Fill */}
          <div
            className={cn("h-full rounded-full transition-all duration-75", activeColorClasses[accentColor])}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Hidden Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Styled Visual Thumb */}
        <div
          className={cn(
            "absolute w-5 h-5 -ml-2.5 rounded-full bg-white dark:bg-zinc-900 border-2 pointer-events-none transition-transform duration-75 group-hover:scale-110",
            thumbGlowClasses[accentColor]
          )}
          style={{ left: `${percentage}%` }}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full mx-auto my-1.5", activeColorClasses[accentColor])} />
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-text-faint font-mono">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
