"use client";

import React from "react";
import { Gauge, Sparkles, Calculator, Home } from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";

interface NavbarProps {
  currentView?: "landing" | "wizard" | "results";
  onNavigate?: (view: "landing" | "wizard") => void;
}

export function Navbar({
  currentView = "landing",
  onNavigate,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate?.("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-orange-400 flex items-center justify-center text-white shadow-md shadow-accent-glow group-hover:scale-105 transition-transform">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-text-primary">
                Resale<span className="text-accent">Meter</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 hidden sm:inline-block">
                India
              </span>
            </div>
            <p className="text-[11px] text-text-dim leading-none mt-0.5 hidden sm:block">
              Intelligent Car & Bike Valuation
            </p>
          </div>
        </div>

        {/* Center Navigation Pills */}
        <div className="hidden sm:flex items-center p-1 rounded-xl bg-surface-elevated border border-surface-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => onNavigate?.("landing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === "landing"
                ? "bg-accent text-white shadow-xs"
                : "text-text-dim hover:text-text-primary"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Showcase</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.("wizard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentView === "wizard" || currentView === "results"
                ? "bg-accent text-white shadow-xs"
                : "text-text-dim hover:text-text-primary"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculator</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {currentView === "landing" ? (
            <button
              type="button"
              onClick={() => onNavigate?.("wizard")}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-md shadow-accent-glow transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Valuation Wizard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate?.("landing")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-surface-border text-xs text-text-dim hover:text-text-primary transition-all cursor-pointer"
            >
              <span>Back to Showcase</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
