"use client";

import React from "react";
import { Gauge, Users, Wrench, ShieldAlert, Sparkles, Award } from "lucide-react";
import { type WizardFormData } from "../../lib/mock-data";
import { formatKm } from "../../lib/utils";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";

interface StepUsageProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
}

export function StepUsage({ data, updateData }: StepUsageProps) {
  // Odometer quick presets
  const presets =
    data.category === "car"
      ? [15000, 30000, 45000, 65000, 90000, 120000]
      : [8000, 18000, 30000, 45000, 60000];

  const maxOdometer = data.category === "car" ? 180000 : 90000;

  // Condition options
  const conditions = [
    {
      id: "excellent" as const,
      label: "Excellent",
      desc: "Immaculate bodywork, spotless interior, flawless engine",
      multiplier: "+5%",
    },
    {
      id: "very-good" as const,
      label: "Very Good",
      desc: "Minor hairline scratches, mechanicals running crisp",
      multiplier: "+2%",
    },
    {
      id: "good" as const,
      label: "Good (Average)",
      desc: "Normal road wear for its age, timely oil changes",
      multiplier: "0%",
    },
    {
      id: "fair" as const,
      label: "Fair",
      desc: "Visible dings, interior wear, suspension squeaks",
      multiplier: "-5%",
    },
    {
      id: "needs-work" as const,
      label: "Needs Work",
      desc: "Check engine light, clutch or AC repair required",
      multiplier: "-15%+",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Odometer Reading */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
            Current Odometer Reading
          </label>
          <span className="font-display font-extrabold text-lg text-accent">
            {formatKm(data.odometer)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
          <Slider
            value={data.odometer}
            min={1000}
            max={maxOdometer}
            step={1000}
            onChange={(val) => updateData({ odometer: val })}
            formatValue={(val) => formatKm(val)}
            accentColor="accent"
          />

          {/* Quick Presets */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-text-faint font-medium shrink-0">
              Presets:
            </span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateData({ odometer: preset })}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  data.odometer === preset
                    ? "bg-accent text-white font-bold shadow-xs"
                    : "bg-surface-elevated text-text-dim border border-surface-border hover:text-text-primary"
                }`}
              >
                {formatKm(preset)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Number of Owners */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Number of Registered Owners in RC
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((num) => {
            const isSelected = data.owners === num;
            const label = num === 1 ? "1st Owner" : num === 2 ? "2nd Owner" : num === 3 ? "3rd Owner" : "4th+ Owner";
            const benefit =
              num === 1 ? "Highest Value" : num === 2 ? "-3% Market" : num === 3 ? "-7% Market" : "-12% Market";

            return (
              <button
                key={num}
                type="button"
                onClick={() => updateData({ owners: num })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-accent-soft border-accent text-accent shadow-xs shadow-accent-glow ring-1 ring-accent"
                    : "bg-surface-elevated border-surface-border text-text-primary hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm">
                    {label}
                  </span>
                  <Users className="w-3.5 h-3.5 text-text-dim" />
                </div>
                <span className="text-[11px] text-text-dim mt-1 block">
                  {benefit}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Overall Physical & Mechanical Condition */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Overall Physical & Mechanical Condition
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {conditions.map((c) => {
            const isSelected = data.condition === c.id;
            return (
              <div
                key={c.id}
                onClick={() => updateData({ condition: c.id })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-surface-elevated border-accent shadow-xs ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {c.label}
                    </span>
                    <Badge
                      variant={
                        c.multiplier.startsWith("+")
                          ? "success"
                          : c.multiplier.startsWith("-")
                          ? "danger"
                          : "default"
                      }
                      className="text-[10px]"
                    >
                      {c.multiplier}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-dim leading-snug">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Service Records & Maintenance */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Service Record History
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: "authorized" as const,
              label: "Authorized OEM Records",
              desc: "100% serviced at authorized showroom with bills",
              tag: "+3% Premium",
            },
            {
              id: "partial" as const,
              label: "Partial Service Records",
              desc: "Periodic multi-brand garage records or self-maintained",
              tag: "Standard",
            },
            {
              id: "none" as const,
              label: "No Records Available",
              desc: "No verifiable maintenance records or bills",
              tag: "-4% Penalty",
            },
          ].map((item) => {
            const isSelected = data.serviceHistory === item.id;
            return (
              <div
                key={item.id}
                onClick={() => updateData({ serviceHistory: item.id })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-accent-soft border-accent shadow-xs ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-text-primary">
                    {item.label}
                  </span>
                  <Award className="w-3.5 h-3.5 text-accent" />
                </div>
                <p className="text-xs text-text-dim mt-0.5">{item.desc}</p>
                <span className="text-[10px] font-semibold text-accent mt-2 inline-block">
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Accident History */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Accident & Claim History
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              id: "clean" as const,
              label: "Clean / No Accidents",
              desc: "Never been in any collision, original panels intact",
              variant: "success" as const,
            },
            {
              id: "minor-cosmetic" as const,
              label: "Minor Scratches / Bumper Repaint",
              desc: "Normal city parking scratches or bumper repainted",
              variant: "warning" as const,
            },
            {
              id: "major-mechanical" as const,
              label: "Major Mechanical Component Replaced",
              desc: "Radiator, suspension arm, or axle repair from an impact",
              variant: "danger" as const,
            },
            {
              id: "structural-flood" as const,
              label: "Chassis / Structural or Flood Damage",
              desc: "Pillar damage, airbag deployment, or waterlogged engine",
              variant: "danger" as const,
            },
          ].map((item) => {
            const isSelected = data.accidentHistory === item.id;
            return (
              <div
                key={item.id}
                onClick={() => updateData({ accidentHistory: item.id })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-surface-elevated border-accent ring-1 ring-accent shadow-xs"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <ShieldAlert
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    item.variant === "success"
                      ? "text-emerald-500"
                      : item.variant === "warning"
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                />
                <div>
                  <span className="font-bold text-sm text-text-primary block">
                    {item.label}
                  </span>
                  <p className="text-xs text-text-dim mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
