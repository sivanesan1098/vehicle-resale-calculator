"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface StepItem {
  id: number;
  label: string;
  shortLabel?: string;
  description?: string;
}

interface WizardStepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function WizardStepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: WizardStepperProps) {
  return (
    <div className={cn("w-full py-2", className)}>
      <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
        {/* Continuous Connecting Line Background */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-surface-border -z-0" />

        {/* Animated Active Progress Fill */}
        <motion.div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-accent -z-0"
          initial={false}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = Boolean(onStepClick && isCompleted);

          return (
            <div
              key={step.id}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={cn(
                "relative z-10 flex flex-col items-center group select-none",
                isClickable && "cursor-pointer"
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.12 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-accent border-accent text-white shadow-xs"
                    : isCurrent
                    ? "bg-background border-accent text-accent shadow-md shadow-accent-glow"
                    : "bg-surface-elevated border-surface-border text-text-faint"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span>0{step.id}</span>
                )}
              </motion.div>

              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors hidden sm:block",
                  isCurrent
                    ? "text-text-primary font-semibold"
                    : isCompleted
                    ? "text-text-dim"
                    : "text-text-faint"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
