"use client";

import React from "react";
import { Disc, BatteryCharging, FileCheck, Shield, AlertTriangle, ArrowRight } from "lucide-react";
import { type WizardFormData } from "../../lib/mock-data";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface StepConsumablesProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
  onCalculate: () => void;
}

export function StepConsumables({
  data,
  updateData,
  onCalculate,
}: StepConsumablesProps) {
  const isCar = data.category === "car";
  const tyreDeduction = isCar ? "₹16,000" : "₹4,500";
  const batteryDeduction = isCar ? "₹5,000" : "₹1,800";
  const insuranceDeduction = isCar ? "₹12,000" : "₹2,500";

  return (
    <div className="space-y-6">
      {/* 1. Tyre Condition */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
            Tyre Life & Tread Depth
          </label>
          <span className="text-xs text-text-dim">
            Near-term replacement cost accounted separately
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: "new" as const,
              label: "New / 80%+ Tread",
              desc: "Replaced recently with ample rubber life remaining",
              impact: "No Deduction",
              variant: "success" as const,
            },
            {
              id: "good" as const,
              label: "Good / ~50% Tread",
              desc: "Adequate grip, safe for 15,000–25,000 km more",
              impact: "Standard",
              variant: "default" as const,
            },
            {
              id: "due" as const,
              label: "Worn Out / Due Soon",
              desc: "Bald spots or close to TWI wear indicators",
              impact: `-${tyreDeduction} Replacement`,
              variant: "danger" as const,
            },
          ].map((item) => {
            const isSelected = data.tyreCondition === item.id;
            return (
              <div
                key={item.id}
                onClick={() => updateData({ tyreCondition: item.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-surface-elevated border-accent shadow-xs ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-text-primary">
                    {item.label}
                  </span>
                  <Disc className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs text-text-dim">{item.desc}</p>
                <Badge
                  variant={item.variant}
                  className="text-[10px] mt-2.5 font-mono"
                >
                  {item.impact}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Battery Health */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Battery Health & Cranking
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              id: "good" as const,
              label: "Healthy Battery (< 2.5 Years Old)",
              desc: "Immediate crank, headlights stable on ignition, zero corrosion",
              impact: "0 Deduction",
              variant: "success" as const,
            },
            {
              id: "weak" as const,
              label: "Weak / Due for Replacement (> 3 Years Old)",
              desc: "Sluggish self-start, requires jump start or frequent charging",
              impact: `-${batteryDeduction} Replacement`,
              variant: "danger" as const,
            },
          ].map((item) => {
            const isSelected = data.batteryCondition === item.id;
            return (
              <div
                key={item.id}
                onClick={() => updateData({ batteryCondition: item.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? "bg-surface-elevated border-accent shadow-xs ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div>
                  <span className="font-bold text-sm text-text-primary block">
                    {item.label}
                  </span>
                  <p className="text-xs text-text-dim mt-0.5">{item.desc}</p>
                  <Badge
                    variant={item.variant}
                    className="text-[10px] mt-2 font-mono"
                  >
                    {item.impact}
                  </Badge>
                </div>
                <BatteryCharging className="w-5 h-5 text-accent shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Insurance Status */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Current Insurance Policy
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: "comprehensive" as const,
              label: "Active Comprehensive (Zero-Dep / 1st Party)",
              desc: "Zero-dep or bumper-to-bumper cover valid > 3 months",
              impact: "+Added Buyer Confidence",
              variant: "success" as const,
            },
            {
              id: "third-party" as const,
              label: "Active Third-Party Only",
              desc: "Legal minimum road liability; no own damage cover",
              impact: "Standard",
              variant: "default" as const,
            },
            {
              id: "expired" as const,
              label: "Expired or Lapsed Insurance",
              desc: "Buyer must purchase new policy and undergo inspection",
              impact: `-${insuranceDeduction} Deduction`,
              variant: "danger" as const,
            },
          ].map((item) => {
            const isSelected = data.insuranceStatus === item.id;
            return (
              <div
                key={item.id}
                onClick={() => updateData({ insuranceStatus: item.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-surface-elevated border-accent shadow-xs ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-text-primary">
                    {item.label}
                  </span>
                  <Shield className="w-4 h-4 text-info" />
                </div>
                <p className="text-xs text-text-dim">{item.desc}</p>
                <Badge
                  variant={item.variant}
                  className="text-[10px] mt-2 font-mono"
                >
                  {item.impact}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Ready Callout */}
      <Card className="p-5 border-accent/40 bg-gradient-to-br from-accent/15 via-surface-card to-surface-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" /> All Parameters Configured
            </span>
            <p className="text-xs text-text-dim max-w-lg">
              Our valuation algorithm will now cross-reference your {data.modelYear} {data.brand} with age retention curves, normalized mileage in {data.stateCode}, ownership depreciation, and current market listings.
            </p>
          </div>

          <button
            type="button"
            onClick={onCalculate}
            className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Generate Valuation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
