"use client";

import React, { useState, useMemo } from "react";
import {
  Car,
  Bike,
  Sparkles,
  ArrowLeft,
  Share2,
  Printer,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Tag,
  Store,
  Wallet,
  ShoppingBag,
  Copy,
  Check,
  MessageSquare,
  FileCheck2,
  X,
} from "lucide-react";
import {
  POPULAR_VEHICLES,
  POPULAR_STATES,
  type WizardFormData,
} from "../../lib/mock-data";
import { formatLakhs, formatINR, formatKm } from "../../lib/utils";
import { calculateValuation } from "../../lib/valuation";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { ConfidenceGauge } from "../ui/confidence-gauge";

interface ValuationDashboardProps {
  initialData: WizardFormData;
  onBackToWizard: () => void;
}

export function ValuationDashboard({
  initialData,
  onBackToWizard,
}: ValuationDashboardProps) {
  // Allow live interactive tweaking of key parameters on the results page!
  const [liveOdometer, setLiveOdometer] = useState(initialData.odometer);
  const [liveCondition, setLiveCondition] = useState(initialData.condition);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Retrieve base vehicle info
  const vehicle = useMemo(
    () =>
      POPULAR_VEHICLES.find((v) => v.id === initialData.modelId) ||
      POPULAR_VEHICLES[0],
    [initialData.modelId]
  );

  const variant = useMemo(
    () =>
      vehicle.variants.find((v) => v.id === initialData.variantId) ||
      vehicle.variants[0],
    [vehicle, initialData.variantId]
  );

  const state = useMemo(
    () =>
      POPULAR_STATES.find((s) => s.stateCode === initialData.stateCode) ||
      POPULAR_STATES[0],
    [initialData.stateCode]
  );

  const rto = useMemo(
    () =>
      state.rtos.find((r) => r.code === initialData.rtoCode) || state.rtos[0],
    [state, initialData.rtoCode]
  );

  // Historical base ex-showroom
  const historicalExShowroom =
    variant.historicalExShowroom[initialData.modelYear] ||
    variant.baseExShowroom;

  // Invoke pure TypeScript decoupled valuation engine
  const valuationResult = useMemo(() => {
    return calculateValuation({
      category: initialData.category,
      brand: vehicle.brand,
      model: vehicle.name,
      variant: variant.name,
      modelYear: initialData.modelYear,
      historicalExShowroom,
      odometer: liveOdometer,
      owners: initialData.owners,
      condition: liveCondition,
      serviceHistory: initialData.serviceHistory,
      accidentHistory: initialData.accidentHistory,
      tyreCondition: initialData.tyreCondition,
      batteryCondition: initialData.batteryCondition,
      insuranceStatus: initialData.insuranceStatus,
      stateCode: initialData.stateCode,
      rtoCode: initialData.rtoCode,
      evaluationYear: 2026,
    });
  }, [
    initialData,
    vehicle,
    variant,
    historicalExShowroom,
    liveOdometer,
    liveCondition,
  ]);

  const valuation = {
    age: valuationResult.breakdown.ageYears,
    historicalExShowroom: valuationResult.breakdown.historicalExShowroom,
    ageDepreciatedBase: valuationResult.breakdown.ageDepreciatedBase,
    retentionFactor: valuationResult.breakdown.retentionFactor,
    mileageAdjustment: valuationResult.breakdown.mileageAdjustment,
    conditionAdjustment: valuationResult.breakdown.conditionAdjustment,
    ownerAdjustment: valuationResult.breakdown.ownerAdjustment,
    serviceAdjustment: valuationResult.breakdown.serviceAdjustment,
    accidentAdjustment: valuationResult.breakdown.accidentAdjustment,
    consumablesAdjustment: valuationResult.breakdown.consumablesAdjustment,
    marketAdjustment: valuationResult.breakdown.marketAdjustment,
    intrinsicValue: valuationResult.breakdown.intrinsicValue,
    fairMarketValue: valuationResult.fairMarketValue,
    likelySellingMin: valuationResult.ranges.likelySellingRange.min,
    likelySellingMax: valuationResult.ranges.likelySellingRange.max,
    recommendedListingMin: valuationResult.ranges.sellerListingRange.min,
    recommendedListingMax: valuationResult.ranges.sellerListingRange.max,
    dealerTradeInMin: valuationResult.ranges.dealerTradeInRange.min,
    dealerTradeInMax: valuationResult.ranges.dealerTradeInRange.max,
    targetBuyerMin: valuationResult.ranges.buyerTargetRange.min,
    targetBuyerMax: valuationResult.ranges.buyerTargetRange.max,
    confidenceScore: valuationResult.confidence.score,
    confidenceReasons: valuationResult.confidence.reasons,
    confidenceCaveats: valuationResult.confidence.caveats,
  };

  // Structured summary for WhatsApp and OLX copy
  const valuationSummaryText = useMemo(() => {
    return `*🚗 ResaleMeter India — Valuation Report*
*Vehicle:* ${initialData.modelYear} ${vehicle.brand} ${vehicle.name} (${variant.name})
*Registration:* ${rto.code} (${rto.city}, ${state.stateName})
*Usage:* ${formatKm(liveOdometer)} | ${initialData.owners === 1 ? "1st Owner" : `${initialData.owners} Owners`} | ${liveCondition.toUpperCase()} Condition

*📊 Estimated Fair Market Value:* ${formatLakhs(valuation.fairMarketValue)}
*Expected Selling Range:* ${formatLakhs(valuation.likelySellingMin)} – ${formatLakhs(valuation.likelySellingMax)}
*Recommended Listing Range:* ${formatLakhs(valuation.recommendedListingMin)} – ${formatLakhs(valuation.recommendedListingMax)}
*Dealer Trade-In Quote:* ${formatLakhs(valuation.dealerTradeInMin)} – ${formatLakhs(valuation.dealerTradeInMax)}

_Calculated with historical ex-showroom anchoring & RTO tax isolation._`;
  }, [initialData, vehicle, variant, rto, state, liveOdometer, liveCondition, valuation]);

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(
      `${valuationSummaryText}\n\nCheck live appraisal: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopySummary = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(valuationSummaryText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* PRINT-ONLY HEADER FOR VALUATION CERTIFICATE */}
      <div className="print-only border-b-2 border-zinc-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">
              ResaleMeter India
            </h1>
            <p className="text-xs text-zinc-600">
              Official Used Vehicle Resale Valuation Certificate
            </p>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
            <br />
            <span>Ref: RM-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>
      </div>

      {/* Top Action Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToWizard}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Vehicle Parameters</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsAppShare}
            className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share / Copy</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </Button>
        </div>
      </div>

      {/* Vehicle Summary Header Card */}
      <div className="p-6 rounded-2xl glass-card border border-surface-border-strong bg-gradient-to-r from-surface-card via-surface-elevated to-surface-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="accent" className="font-mono text-xs uppercase">
              {initialData.category === "car" ? "Car" : "Bike"}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {initialData.modelYear} Model
            </Badge>
            <Badge variant="default" className="text-xs">
              {rto.code} • {rto.city}
            </Badge>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
            {initialData.modelYear} {vehicle.brand} {vehicle.name}
          </h2>
          <p className="text-sm font-medium text-text-dim mt-1">
            {variant.name} • {variant.fuel} • {variant.transmission} •{" "}
            {initialData.owners === 1 ? "1st Owner" : `${initialData.owners} Owners`} •{" "}
            {formatKm(liveOdometer)}
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-text-dim block uppercase font-mono tracking-wider">
            Original Ex-Showroom ({initialData.modelYear})
          </span>
          <span className="font-display font-bold text-xl text-text-primary">
            {formatLakhs(historicalExShowroom)}
          </span>
          <span className="text-xs text-text-dim block mt-0.5">
            Vehicle Age: ~{valuation.age} Years
          </span>
        </div>
      </div>

      {/* Hero Valuation & Confidence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Valuation Card */}
        <div className="lg:col-span-2 rounded-3xl p-8 glass-card border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-surface-card to-surface-card relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Empirical Market Estimate
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-text-dim font-medium block">
                Estimated Fair Market Value
              </span>
              <div className="font-display font-black text-4xl sm:text-6xl text-text-primary tracking-tight">
                {formatLakhs(valuation.fairMarketValue)}
              </div>
              <span className="text-xs text-text-dim block mt-1">
                Raw Benchmark: {formatINR(valuation.fairMarketValue)}
              </span>
            </div>

            {/* Visual Expected Selling Range Bar */}
            <div className="mt-8 pt-6 border-t border-surface-border">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-text-dim">Likely Selling Range:</span>
                <span className="text-text-primary font-display font-bold text-sm">
                  {formatLakhs(valuation.likelySellingMin)} –{" "}
                  {formatLakhs(valuation.likelySellingMax)}
                </span>
              </div>

              {/* Progress Range Bar */}
              <div className="w-full h-3 rounded-full bg-surface-elevated border border-surface-border relative overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-text-faint font-mono mt-1.5">
                <span>Min: {formatLakhs(valuation.likelySellingMin)}</span>
                <span className="text-emerald-500 font-bold">
                  Fair: {formatLakhs(valuation.fairMarketValue)}
                </span>
                <span>Max: {formatLakhs(valuation.likelySellingMax)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Gauge */}
        <ConfidenceGauge
          score={valuation.confidenceScore}
          reasons={[
            "Exact variant & historical price matched",
            `State RTO (${initialData.stateCode}) road tax model applied`,
            `${initialData.owners === 1 ? "Single-owner" : "Multi-owner"} retention verified`,
            "Active Indian market comparables indexed",
          ]}
          caveats={
            initialData.serviceHistory === "none"
              ? ["Unverified maintenance records reduce confidence"]
              : initialData.accidentHistory === "structural-flood"
              ? ["Severe history requires physical structural inspection"]
              : []
          }
        />
      </div>

      {/* 4-Tier Pricing Breakdown Cards */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-dim mb-3">
          Market Transaction Range Perspectives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fair Market */}
          <Card className="p-5 border-emerald-500/25 bg-surface-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Fair Market
              </span>
            </div>
            <div className="font-display font-extrabold text-2xl text-text-primary">
              {formatLakhs(valuation.fairMarketValue)}
            </div>
            <p className="text-xs text-text-dim mt-1.5">
              Equilibrium value between an informed buyer and a motivated seller.
            </p>
          </Card>

          {/* Card 2: Recommended Listing */}
          <Card className="p-5 border-surface-border bg-surface-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Recommended Listing
              </span>
            </div>
            <div className="font-display font-extrabold text-2xl text-text-primary">
              {formatLakhs(valuation.recommendedListingMin)} –{" "}
              {formatLakhs(valuation.recommendedListingMax)}
            </div>
            <p className="text-xs text-text-dim mt-1.5">
              Target portal asking price allowing a 4–8% margin for Indian buyer negotiations.
            </p>
          </Card>

          {/* Card 3: Target Buyer Negotiation */}
          <Card className="p-5 border-surface-border bg-surface-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-info flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> Buyer Target
              </span>
            </div>
            <div className="font-display font-extrabold text-2xl text-text-primary">
              {formatLakhs(valuation.targetBuyerMin)} –{" "}
              {formatLakhs(valuation.targetBuyerMax)}
            </div>
            <p className="text-xs text-text-dim mt-1.5">
              Reasonable offer price to close the deal without overpaying for this spec.
            </p>
          </Card>

          {/* Card 4: Dealer Trade-In */}
          <Card className="p-5 border-surface-border bg-surface-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                <Store className="w-4 h-4" /> Dealer / Trade-In
              </span>
            </div>
            <div className="font-display font-extrabold text-2xl text-text-primary">
              {formatLakhs(valuation.dealerTradeInMin)} –{" "}
              {formatLakhs(valuation.dealerTradeInMax)}
            </div>
            <p className="text-xs text-text-dim mt-1.5">
              Immediate cash / exchange quote accounting for dealer refurbishing and margin.
            </p>
          </Card>
        </div>
      </div>

      {/* Value Drivers & Explainable Price Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value Drivers */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Key Valuation Drivers</CardTitle>
            <span className="text-xs text-text-dim">
              Specific vehicle attributes driving this price up or down
            </span>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {initialData.owners === 1 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> Single Owner Vehicle
                </span>
                <span className="font-bold text-emerald-500">+Retains Premium</span>
              </div>
            )}

            {initialData.serviceHistory === "authorized" && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> 100% Authorized Service Record
                </span>
                <span className="font-bold text-emerald-500">
                  +{formatINR(valuation.serviceAdjustment)}
                </span>
              </div>
            )}

            {valuation.mileageAdjustment > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-emerald-500">
                  <TrendingUp className="w-4 h-4" /> Below Average Kilometres Driven
                </span>
                <span className="font-bold text-emerald-500">
                  +{formatINR(valuation.mileageAdjustment)}
                </span>
              </div>
            )}

            {valuation.mileageAdjustment < 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-amber-500">
                  <TrendingDown className="w-4 h-4" /> Above Average Mileage Usage
                </span>
                <span className="font-bold text-amber-500">
                  {formatINR(valuation.mileageAdjustment)}
                </span>
              </div>
            )}

            {initialData.owners > 1 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-amber-500">
                  <AlertCircle className="w-4 h-4" /> Multiple Registered Owners ({initialData.owners})
                </span>
                <span className="font-bold text-amber-500">
                  {formatINR(valuation.ownerAdjustment)}
                </span>
              </div>
            )}

            {initialData.tyreCondition === "due" && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-rose-500">
                  <AlertCircle className="w-4 h-4" /> Tyres Worn Out / Due Replacement
                </span>
                <span className="font-bold text-rose-500">
                  -{initialData.category === "car" ? "₹16,000" : "₹4,500"}
                </span>
              </div>
            )}

            {initialData.accidentHistory !== "clean" && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-rose-500">
                  <AlertCircle className="w-4 h-4" /> History: {initialData.accidentHistory}
                </span>
                <span className="font-bold text-rose-500">
                  {formatINR(valuation.accidentAdjustment)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explainable Waterfall Breakdown */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Transparent Valuation Waterfall</CardTitle>
            <span className="text-xs text-text-dim">
              Step-by-step mathematical progression from showroom to resale
            </span>
          </CardHeader>
          <CardContent className="p-0 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Original Historical Ex-Showroom</span>
              <span className="font-mono font-bold text-text-primary">
                {formatINR(historicalExShowroom)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">
                Age Retention Base ({valuation.age} yrs • {Math.round(valuation.retentionFactor * 100)}%)
              </span>
              <span className="font-mono font-semibold text-text-primary">
                {formatINR(valuation.ageDepreciatedBase)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Mileage Normalization Adjustment</span>
              <span
                className={`font-mono font-semibold ${
                  valuation.mileageAdjustment >= 0
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {valuation.mileageAdjustment >= 0 ? "+" : ""}
                {formatINR(valuation.mileageAdjustment)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Condition Multiplier ({liveCondition})</span>
              <span
                className={`font-mono font-semibold ${
                  valuation.conditionAdjustment >= 0
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {valuation.conditionAdjustment >= 0 ? "+" : ""}
                {formatINR(valuation.conditionAdjustment)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Owner Count & Service History</span>
              <span
                className={`font-mono font-semibold ${
                  valuation.ownerAdjustment + valuation.serviceAdjustment >= 0
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {formatINR(
                  valuation.ownerAdjustment + valuation.serviceAdjustment
                )}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Consumables & Accident Deductions</span>
              <span className="font-mono font-semibold text-rose-500">
                {formatINR(
                  valuation.consumablesAdjustment + valuation.accidentAdjustment
                )}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-surface-border">
              <span className="text-text-dim">Market Observation Weighting (+2.5%)</span>
              <span className="font-mono font-semibold text-emerald-500">
                +{formatINR(valuation.marketAdjustment)}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-sm font-bold">
              <span className="text-text-primary">Final Fair Market Estimate</span>
              <span className="font-display font-extrabold text-accent text-base">
                {formatINR(valuation.fairMarketValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Scenario Tweak Sliders (Hidden in print) */}
      <Card className="no-print p-6 border-accent/30 bg-surface-card">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-accent animate-spin-slow" />
          <div>
            <h3 className="font-display font-bold text-base text-text-primary">
              Live Scenario Adjustments
            </h3>
            <span className="text-xs text-text-dim">
              Adjust parameters below to see the estimated valuation update instantaneously
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Live Odometer */}
          <div>
            <Slider
              value={liveOdometer}
              min={5000}
              max={initialData.category === "car" ? 180000 : 90000}
              step={2000}
              onChange={setLiveOdometer}
              formatValue={(val) => formatKm(val)}
              label="Simulate Different Odometer Reading"
              sublabel="Test impact of higher or lower mileage on valuation"
            />
          </div>

          {/* Live Condition */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2">
              Simulate Different Vehicle Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["excellent", "good", "fair"] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setLiveCondition(cond)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold uppercase transition-all cursor-pointer ${
                    liveCondition === cond
                      ? "bg-accent text-white border-accent shadow-xs shadow-accent-glow"
                      : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* SHARE / EXPORT MODAL */}
      {showShareModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-lg rounded-2xl glass-panel p-6 border border-surface-border-strong bg-surface-card space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-lg text-text-primary">
                  Share & Export Valuation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-text-dim hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
                Instant Messaging
              </span>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>
            </div>

            {/* OLX / Dealer Negotiation Copy */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
                Formatted for OLX / Dealer Negotiations
              </span>
              <div className="p-3 rounded-xl bg-surface-elevated border border-surface-border font-mono text-[11px] text-text-dim max-h-32 overflow-y-auto whitespace-pre-wrap select-all">
                {valuationSummaryText}
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full p-2.5 rounded-xl border border-surface-border hover:bg-surface-elevated font-semibold text-xs text-text-primary flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Text to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Web Link */}
            <div className="space-y-2 pt-2 border-t border-surface-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
                Web Link
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full p-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Valuation Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
