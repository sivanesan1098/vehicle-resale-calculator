"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car,
  Bike,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Gauge,
  MapPin,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sliders,
  DollarSign,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { formatLakhs, formatINR } from "../../lib/utils";

interface LandingPageProps {
  onStartWizard: () => void;
}

export function LandingPage({ onStartWizard }: LandingPageProps) {
  // Live quick teaser interactive slider state
  const [teaserVehicle, setTeaserVehicle] = useState<"car" | "bike">("car");
  const [teaserAge, setTeaserAge] = useState(3);
  const [teaserBasePrice, setTeaserBasePrice] = useState(900000);

  // Retention formula for teaser
  const carRetention: Record<number, number> = {
    1: 0.82,
    2: 0.73,
    3: 0.64,
    4: 0.54,
    5: 0.46,
    6: 0.4,
    7: 0.35,
    8: 0.3,
  };
  const bikeRetention: Record<number, number> = {
    1: 0.8,
    2: 0.7,
    3: 0.6,
    4: 0.5,
    5: 0.42,
    6: 0.35,
    7: 0.29,
    8: 0.24,
  };

  const currentRetention =
    teaserVehicle === "car"
      ? carRetention[teaserAge] || 0.4
      : bikeRetention[teaserAge] || 0.35;
  const estimatedTeaserValue = Math.round(teaserBasePrice * currentRetention);

  // Live Marquee items
  const recentValuations = [
    {
      vehicle: "2022 Hyundai i20 Sportz 1.2 MT",
      loc: "Hyderabad (TS-09)",
      val: "₹6.95 Lakh",
      tag: "Single Owner",
    },
    {
      vehicle: "2021 Royal Enfield Classic 350",
      loc: "Bengaluru (KA-01)",
      val: "₹1.88 Lakh",
      tag: "High Demand",
    },
    {
      vehicle: "2023 Mahindra Thar LX 4x4 AT",
      loc: "Mumbai (MH-02)",
      val: "₹15.75 Lakh",
      tag: "Low Mileage",
    },
    {
      vehicle: "2020 Maruti Swift ZXi AMT",
      loc: "Delhi NCR (DL-03)",
      val: "₹6.20 Lakh",
      tag: "Verified Comp",
    },
    {
      vehicle: "2022 Tata Nexon Fearless+ Diesel",
      loc: "Pune (MH-12)",
      val: "₹11.85 Lakh",
      tag: "Full Service",
    },
    {
      vehicle: "2021 TVS Apache RTR 160 4V",
      loc: "Chennai (TN-01)",
      val: "₹92,000",
      tag: "Clean Record",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. TOP LIVE TICKER / MARQUEE */}
      <div className="w-full overflow-hidden bg-surface-elevated/70 border-y border-surface-border py-2.5">
        <div className="flex items-center gap-2 max-w-7xl mx-auto px-4 mb-1">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-dim">
            Live Used Market Valuations Across India
          </span>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex gap-6 shrink-0 whitespace-nowrap py-1">
            {[...recentValuations, ...recentValuations].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs"
              >
                <Badge variant="accent" className="text-[10px] py-0">
                  {item.loc}
                </Badge>
                <span className="font-semibold text-text-primary">
                  {item.vehicle}
                </span>
                <span className="font-display font-extrabold text-emerald-500">
                  {item.val}
                </span>
                <span className="text-[10px] text-text-dim font-mono bg-surface-elevated px-1.5 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empirical Intelligence for Indian Cars & Two-Wheelers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-text-primary leading-[1.1]"
          >
            Stop Guessing. Know What Your Vehicle Is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-amber-300">
              Actually Worth.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-text-dim max-w-2xl mx-auto leading-relaxed"
          >
            Traditional calculators apply a lazy 10% flat depreciation. ResaleMeter reconstructs exact historical ex-showroom prices, isolates state RTO road taxes, and synthesizes active Indian used car market evidence.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              variant="shimmer"
              size="lg"
              onClick={onStartWizard}
              className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-accent-glow"
            >
              <span>Calculate Resale Value Now</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>

            <a
              href="#interactive-teaser"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated font-semibold text-sm text-text-primary transition-all flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4 text-accent" />
              <span>Try Interactive Simulator</span>
            </a>
          </motion.div>
        </div>

        {/* HERO SHOWCASE GRAPHIC WITH FLOATING TELEMETRY CARDS */}
        <div className="relative mt-12 max-w-5xl mx-auto">
          {/* Glowing Ambient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/25 via-emerald-500/20 to-transparent blur-3xl -z-10 rounded-3xl opacity-75" />

          {/* Main Visual Frame */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-surface-border-strong shadow-2xl glass-card">
            <Image
              src="/images/hero-showcase.jpg"
              alt="Futuristic Indian Automotive Resale Intelligence Showcase"
              width={1920}
              height={1080}
              priority
              className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Dark gradient overlay for bottom text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

            {/* In-Frame Hero Badge */}
            <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/80 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-sm text-text-primary block">
                    Empirical Indian Automotive Engine
                  </span>
                  <span className="text-xs text-text-dim">
                    Covering Maruti, Tata, Mahindra, Hyundai, Royal Enfield & more
                  </span>
                </div>
              </div>

              <button
                onClick={onStartWizard}
                className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Calculator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Telemetry Card 1 (Top Left) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-6 -left-4 sm:-left-8 p-4 rounded-2xl glass-card border border-emerald-500/30 bg-surface-elevated/90 backdrop-blur-xl shadow-xl hidden sm:flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim block">
                Algorithm Confidence
              </span>
              <span className="font-display font-black text-lg text-emerald-500">
                94.8% High Accuracy
              </span>
              <span className="text-[11px] text-text-faint block">
                Verified with 45k+ listings
              </span>
            </div>
          </motion.div>

          {/* Floating Telemetry Card 2 (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 -right-4 sm:-right-8 p-4 rounded-2xl glass-card border border-accent/30 bg-surface-elevated/90 backdrop-blur-xl shadow-xl hidden sm:flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim block">
                Average Seller Realization
              </span>
              <span className="font-display font-black text-lg text-accent">
                +₹42,000 More
              </span>
              <span className="text-[11px] text-text-faint block">
                Over generic dealer exchange
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR TEASER (LIVE SLIDER) */}
      <section
        id="interactive-teaser"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="rounded-3xl p-6 sm:p-10 glass-card border border-surface-border-strong bg-gradient-to-br from-surface-elevated via-surface-card to-surface-card space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div>
              <Badge variant="accent" className="mb-2">
                Live Interactive Teaser
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
                Simulate Instant Age Depreciation
              </h2>
              <p className="text-xs sm:text-sm text-text-dim mt-1">
                See how Indian automotive retention curves compare across years
                before running the full 4-step wizard.
              </p>
            </div>

            {/* Car / Bike Pill Switcher */}
            <div className="flex p-1 rounded-xl bg-surface-elevated border border-surface-border self-start">
              <button
                type="button"
                onClick={() => {
                  setTeaserVehicle("car");
                  setTeaserBasePrice(950000);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  teaserVehicle === "car"
                    ? "bg-accent text-white shadow-xs"
                    : "text-text-dim hover:text-text-primary"
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Car (4-Wheeler)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTeaserVehicle("bike");
                  setTeaserBasePrice(190000);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  teaserVehicle === "bike"
                    ? "bg-accent text-white shadow-xs"
                    : "text-text-dim hover:text-text-primary"
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Bike (2-Wheeler)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Age Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-text-primary">
                    Vehicle Age: {teaserAge} Years
                  </span>
                  <Badge variant="default" className="font-mono">
                    Retention Factor: {Math.round(currentRetention * 100)}%
                  </Badge>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={teaserAge}
                  onChange={(e) => setTeaserAge(Number(e.target.value))}
                  className="w-full accent-accent h-2 bg-surface-elevated rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-text-faint font-mono">
                  <span>1 Year (82%)</span>
                  <span>3 Years (64%)</span>
                  <span>5 Years (46%)</span>
                  <span>8 Years (30%)</span>
                </div>
              </div>

              {/* Base Price Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim block">
                  Original Ex-Showroom Baseline
                </span>
                <div className="flex flex-wrap gap-2">
                  {(teaserVehicle === "car"
                    ? [650000, 950000, 1400000, 2000000]
                    : [95000, 150000, 220000, 350000]
                  ).map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setTeaserBasePrice(price)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        teaserBasePrice === price
                          ? "bg-text-primary text-background"
                          : "bg-surface-elevated border border-surface-border text-text-dim hover:text-text-primary"
                      }`}
                    >
                      {formatLakhs(price)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Result Teaser Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500/15 via-surface-elevated to-surface-card border border-emerald-500/30 text-center space-y-3 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Estimated Retained Value
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl text-text-primary">
                {formatLakhs(estimatedTeaserValue)}
              </div>
              <p className="text-xs text-text-dim">
                Based on {teaserAge}-year empirical retention curve ({Math.round(currentRetention * 100)}% of {formatLakhs(teaserBasePrice)} ex-showroom).
              </p>

              <button
                type="button"
                onClick={onStartWizard}
                className="w-full mt-3 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent-glow cursor-pointer"
              >
                <span>Add Mileage, RTO & Condition</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENTO GRID OF CORE INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline">Unmatched Depth</Badge>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary">
            Why Generic Calculators Fail in India
          </h2>
          <p className="text-sm text-text-dim">
            The Indian pre-owned vehicle market is fragmented. Here is how ResaleMeter solves the four fatal flaws of second-hand car pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Ex-Showroom Reconstruction */}
          <Card className="p-7 space-y-4 md:col-span-2 bg-gradient-to-br from-surface-card to-surface-elevated">
            <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent/30 flex items-center justify-center text-accent">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                Exact Historical Ex-Showroom Anchoring
              </h3>
              <p className="text-sm text-text-dim mt-1.5 leading-relaxed">
                A 2021 Hyundai i20 Sportz cost ₹7.59 Lakh when purchased, but sells for ₹8.72 Lakh in showrooms today. We store versioned historical ex-showroom prices by model year and variant so your depreciation is never measured against an inflated current sticker price.
              </p>
            </div>

            {/* Visual Mini Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-elevated border border-surface-border">
                <span className="text-[11px] text-text-dim block">2021 Purchase Price</span>
                <span className="font-display font-extrabold text-base text-accent">
                  ₹7.59 Lakh (Accurate Base)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-surface-border">
                <span className="text-[11px] text-text-dim block">2024 New Car Showroom</span>
                <span className="font-display font-extrabold text-base text-text-faint line-through">
                  ₹8.72 Lakh (Sticker Trap)
                </span>
              </div>
            </div>
          </Card>

          {/* Bento Card 2: State RTO Tax Engine */}
          <Card className="p-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-info-soft border border-info/30 flex items-center justify-center text-info">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                State RTO Tax Isolation
              </h3>
              <p className="text-sm text-text-dim mt-1.5 leading-relaxed">
                Karnataka levies 18% road tax, whereas Gujarat levies 8%. Taxes paid to the government do not retain value on the second-hand market. We isolate taxes so you don&apos;t overpay.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <Badge variant="info">KA: 18%</Badge>
              <Badge variant="info">TS: 14%</Badge>
              <Badge variant="info">MH: 13%</Badge>
              <Badge variant="info">DL: 10%</Badge>
              <Badge variant="info">GJ: 8%</Badge>
            </div>
          </Card>

          {/* Bento Card 3: Cockpit Telemetry Asset */}
          <div className="relative rounded-3xl overflow-hidden border border-surface-border md:col-span-1 glass-card group">
            <Image
              src="/images/cockpit-telemetry.jpg"
              alt="Automotive Digital Telemetry HUD"
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-6 flex flex-col justify-end">
              <Badge variant="accent" className="self-start mb-2">
                Cockpit Telemetry
              </Badge>
              <h3 className="font-display font-bold text-lg text-white">
                Live Dynamic Scenario Playground
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                Tweak mileage, tyre condition, and owners on the results dashboard with zero-lag isomorphic calculations.
              </p>
            </div>
          </div>

          {/* Bento Card 4: 4-Way Transaction Ranges */}
          <Card className="p-7 space-y-4 md:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                4-Tier Transaction Perspective (Not Just One Number)
              </h3>
              <p className="text-sm text-text-dim mt-1.5 leading-relaxed">
                A single price number is useless in India because every deal involves negotiation. ResaleMeter gives you the exact Fair Market Value, the Likely Closing Range, the Seller Listing Buffer (to cushion negotiations), and the Dealer Trade-In Baseline.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-surface-elevated border border-emerald-500/20 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-500 block">Fair Market</span>
                <span className="text-xs font-semibold text-text-primary">Benchmark</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated border border-accent/20 text-center">
                <span className="text-[10px] uppercase font-bold text-accent block">Listing Buffer</span>
                <span className="text-xs font-semibold text-text-primary">+4% to +8%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated border border-info/20 text-center">
                <span className="text-[10px] uppercase font-bold text-info block">Buyer Target</span>
                <span className="text-xs font-semibold text-text-primary">-2% to -5%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated border border-surface-border text-center">
                <span className="text-[10px] uppercase font-bold text-text-dim block">Dealer Instant</span>
                <span className="text-xs font-semibold text-text-primary">-12% Trade</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. COMPARISON TABLE: BASIC CALCULATORS VS RESALEMETER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="outline">Clear Superiority</Badge>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
            Generic Portals vs. ResaleMeter India
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-surface-border glass-card">
          <div className="grid grid-cols-3 p-4 bg-surface-elevated font-semibold text-xs text-text-dim border-b border-surface-border">
            <span>Capability</span>
            <span className="text-rose-500">Generic Auto Portals</span>
            <span className="text-emerald-500 font-bold">ResaleMeter India</span>
          </div>

          {[
            {
              feature: "Historical Ex-Showroom Price",
              generic: "Uses today's inflated price or vague average",
              ours: "Exact model year & variant ex-showroom price",
            },
            {
              feature: "State Road Tax Handling",
              generic: "Blindly depreciates total on-road price",
              ours: "Isolates state taxes from actual metal value",
            },
            {
              feature: "Price Output Format",
              generic: "Single misleading arbitrary number",
              ours: "4-tier transparent range + confidence score",
            },
            {
              feature: "Consumables (Tyres, Battery)",
              generic: "Ignored completely",
              ours: "Explicit replacement deduction accounting",
            },
            {
              feature: "Live Interactive Playground",
              generic: "Must refill entire form again",
              ours: "Instant slider tweaks directly on results page",
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 p-4 text-xs items-center border-b border-surface-border last:border-b-0 hover:bg-surface-elevated/40 transition-colors"
            >
              <span className="font-semibold text-text-primary">{row.feature}</span>
              <span className="flex items-center gap-1.5 text-text-dim">
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                {row.generic}
              </span>
              <span className="flex items-center gap-1.5 text-text-primary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {row.ours}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL-TO-ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 glass-panel border-2 border-accent/40 bg-gradient-to-r from-accent/20 via-surface-card to-surface-card relative overflow-hidden shadow-2xl text-center space-y-6">
          <div className="space-y-2 max-w-xl mx-auto">
            <Badge variant="accent">Ready in 60 Seconds</Badge>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight">
              Ready to Discover Your Vehicle&apos;s True Worth?
            </h2>
            <p className="text-sm text-text-dim">
              No signups, no spam calls, zero dealer commissions. Just transparent, mathematical valuation intelligence.
            </p>
          </div>

          <Button
            variant="shimmer"
            size="lg"
            onClick={onStartWizard}
            className="text-base px-10 py-4 shadow-xl shadow-accent-glow"
          >
            <span>Start Valuation Wizard</span>
            <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
