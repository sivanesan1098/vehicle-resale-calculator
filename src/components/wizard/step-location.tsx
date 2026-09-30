"use client";

import React, { useMemo } from "react";
import { MapPin, Landmark, FileText, ShieldAlert } from "lucide-react";
import { POPULAR_STATES, POPULAR_VEHICLES, type WizardFormData } from "../../lib/mock-data";
import { formatINR } from "../../lib/utils";
import { fetchRTORules } from "../../lib/data-service";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface StepLocationProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
}

export function StepLocation({ data, updateData }: StepLocationProps) {
  // Current state
  const currentState = useMemo(
    () => POPULAR_STATES.find((s) => s.stateCode === data.stateCode) || POPULAR_STATES[0],
    [data.stateCode]
  );

  // Available RTOs
  const availableRTOs = currentState.rtos;

  // Selected RTO
  const selectedRTO =
    availableRTOs.find((r) => r.code === data.rtoCode) || availableRTOs[0];

  // Optional background fetch of live RTO rules from SQLite API
  React.useEffect(() => {
    fetchRTORules(data.stateCode).catch(() => {});
  }, [data.stateCode]);

  // Selected vehicle price for on-road reconstruction preview
  const vehicle = POPULAR_VEHICLES.find((v) => v.id === data.modelId);
  const variant = vehicle?.variants.find((v) => v.id === data.variantId);
  const exShowroom =
    variant?.historicalExShowroom[data.modelYear] || variant?.baseExShowroom || 800000;

  // Road tax rate
  const taxRatePercent =
    data.category === "car"
      ? currentState.roadTaxPercentCar
      : currentState.roadTaxPercentBike;

  const estimatedRoadTax = Math.round((exShowroom * taxRatePercent) / 100);
  const registrationCharges = data.category === "car" ? 2500 : 950;
  const initialInsurance = Math.round(exShowroom * 0.038); // ~3.8% for 1st year comprehensive
  const estimatedOnRoad =
    exShowroom + estimatedRoadTax + registrationCharges + initialInsurance;

  const handleStateChange = (stateCode: string) => {
    const state = POPULAR_STATES.find((s) => s.stateCode === stateCode);
    if (!state) return;
    updateData({
      stateCode,
      rtoCode: state.rtos[0].code,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. State Selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Registration State (RTO Jurisdiction)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {POPULAR_STATES.map((s) => {
            const isSelected = data.stateCode === s.stateCode;
            return (
              <button
                key={s.stateCode}
                type="button"
                onClick={() => handleStateChange(s.stateCode)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-accent-soft border-accent text-accent shadow-xs shadow-accent-glow"
                    : "bg-surface-elevated border-surface-border text-text-primary hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm">
                    {s.stateName}
                  </span>
                  <Badge
                    variant={isSelected ? "accent" : "default"}
                    className="text-[10px] uppercase font-mono"
                  >
                    {s.stateCode}
                  </Badge>
                </div>
                <span className="text-[11px] text-text-dim mt-1 block">
                  ~{data.category === "car" ? s.roadTaxPercentCar : s.roadTaxPercentBike}% Road Tax
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. RTO / City Selection */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Select RTO Office / City for {currentState.stateName}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {availableRTOs.map((rto) => {
            const isSelected = data.rtoCode === rto.code;
            return (
              <button
                key={rto.code}
                type="button"
                onClick={() => updateData({ rtoCode: rto.code })}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated border-accent shadow-sm ring-1 ring-accent"
                    : "bg-surface-card border-surface-border hover:border-surface-border-strong"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-surface-elevated text-text-dim border border-surface-border"
                    }`}
                  >
                    {rto.code}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary block">
                      {rto.city}
                    </span>
                    <span className="text-xs text-text-dim">
                      Registered in {currentState.stateName}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <Badge variant="accent" className="text-[10px]">
                    Active RTO
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Original On-Road Price Breakdown Card */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
            Estimated Original On-Road Cost ({data.modelYear} • {selectedRTO.city})
          </label>
          <span className="text-xs font-mono text-text-dim">
            RTO: {selectedRTO.code}
          </span>
        </div>

        <Card className="p-5 border-surface-border-strong space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <span className="text-xs text-text-dim">Reconstructed Original On-Road Price</span>
              <div className="font-display font-black text-2xl text-text-primary tracking-tight">
                {formatINR(estimatedOnRoad)}
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex gap-2">
              <Badge variant="info">
                <MapPin className="w-3 h-3" />
                {selectedRTO.code}
              </Badge>
              <Badge variant="default">
                {taxRatePercent}% State Tax
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
              <span className="text-text-dim block text-[11px]">Ex-Showroom</span>
              <span className="font-semibold text-text-primary mt-0.5 block">
                {formatINR(exShowroom)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
              <span className="text-text-dim block text-[11px]">State Road Tax</span>
              <span className="font-semibold text-text-primary mt-0.5 block">
                {formatINR(estimatedRoadTax)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
              <span className="text-text-dim block text-[11px]">1st Yr Insurance</span>
              <span className="font-semibold text-text-primary mt-0.5 block">
                {formatINR(initialInsurance)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-elevated border border-surface-border">
              <span className="text-text-dim block text-[11px]">RTO & Fees</span>
              <span className="font-semibold text-text-primary mt-0.5 block">
                {formatINR(registrationCharges)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Educational Note */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-card border border-surface-border text-xs text-text-dim">
        <Landmark className="w-4 h-4 text-info shrink-0 mt-0.5" />
        <p>
          <strong className="text-text-primary">Important Valuation Principle:</strong>{" "}
          Second-hand buyers pay for vehicle condition and utility, not for taxes paid to the government. ResaleMeter models registration fees and road taxes separately to avoid over-valuing cars from high-tax states.
        </p>
      </div>
    </div>
  );
}
