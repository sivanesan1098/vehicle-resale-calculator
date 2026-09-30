"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ConfidenceGaugeProps {
  score: number; // 0 to 1
  label?: string;
  reasons?: string[];
  caveats?: string[];
  className?: string;
}

export function ConfidenceGauge({
  score,
  label = "Valuation Confidence",
  reasons = [],
  caveats = [],
  className,
}: ConfidenceGaugeProps) {
  const percentage = Math.round(score * 100);

  // Confidence Tier
  const tier =
    percentage >= 80 ? "High" : percentage >= 55 ? "Medium" : "Moderate";

  const colorConfig = {
    High: {
      text: "text-emerald-500",
      stroke: "#10b981",
      glow: "rgba(16, 185, 129, 0.3)",
      badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    },
    Medium: {
      text: "text-amber-500",
      stroke: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.3)",
      badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    },
    Moderate: {
      text: "text-orange-500",
      stroke: "#ff5b1f",
      glow: "rgba(255, 91, 31, 0.3)",
      badgeBg: "bg-orange-500/10 text-orange-500 border-orange-500/25",
    },
  }[tier];

  // Circle Geometry
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-5 border border-surface-border flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
            {label}
          </span>
          <span className="text-sm font-medium text-text-primary">
            Statistical Reliability
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full border",
            colorConfig.badgeBg
          )}
        >
          {tier} ({percentage}%)
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Animated Radial Meter */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-surface-border"
            />
            {/* Glowing Active Arc */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={colorConfig.stroke}
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0 0 6px ${colorConfig.glow})`,
              }}
            />
          </svg>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
              {percentage}%
            </span>
            <span className="text-[10px] text-text-dim font-medium uppercase">
              Score
            </span>
          </div>
        </div>

        {/* Explainability factors */}
        <div className="flex-1 space-y-1.5 text-xs">
          {reasons.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 text-text-dim">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="line-clamp-1">{r}</span>
            </div>
          ))}
          {caveats.slice(0, 2).map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-amber-500">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
