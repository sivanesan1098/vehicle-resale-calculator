"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isDark
          ? "bg-surface-elevated/80 border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong hover:bg-surface-card"
          : "bg-surface-elevated/90 border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong shadow-xs"
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-amber-400"
        >
          <Moon className="w-4 h-4" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-orange-500"
        >
          <Sun className="w-4 h-4" />
        </motion.div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
