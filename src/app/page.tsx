"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { LandingPage } from "../components/landing/landing-page";
import { WizardStepper } from "../components/ui/wizard-stepper";
import { Button } from "../components/ui/button";
import { StepVehicle } from "../components/wizard/step-vehicle";
import { StepLocation } from "../components/wizard/step-location";
import { StepUsage } from "../components/wizard/step-usage";
import { StepConsumables } from "../components/wizard/step-consumables";
import { ValuationDashboard } from "../components/dashboard/valuation-dashboard";
import { INITIAL_FORM_DATA, type WizardFormData } from "../lib/mock-data";

const WIZARD_STEPS = [
  { id: 1, label: "Select Vehicle", shortLabel: "Vehicle" },
  { id: 2, label: "Registration & RTO", shortLabel: "Location" },
  { id: 3, label: "Usage & Condition", shortLabel: "Usage" },
  { id: 4, label: "Consumables & Docs", shortLabel: "Consumables" },
];

export default function Home() {
  const [activeView, setActiveView] = useState<"landing" | "wizard" | "results">(
    "landing"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);

  const updateFormData = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const startWizard = () => {
    setActiveView("wizard");
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } else {
      setActiveView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Top Navbar */}
      <Navbar
        currentView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {/* VIEW 1: OVERLOADED FANCY LANDING PAGE */}
          {activeView === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onStartWizard={startWizard} />
            </motion.div>
          )}

          {/* VIEW 2: 4-STEP WIZARD CALCULATOR */}
          {activeView === "wizard" && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8"
            >
              {/* Wizard Title Header */}
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step-by-Step Indian Automotive Valuation</span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-text-primary">
                  Vehicle Valuation Intake
                </h1>

                <p className="text-xs sm:text-sm text-text-dim max-w-xl mx-auto">
                  Configure your vehicle specs, state registration, and health parameters to calculate exact fair market value.
                </p>
              </div>

              {/* Stepper Progress */}
              <div className="max-w-3xl mx-auto">
                <WizardStepper
                  steps={WIZARD_STEPS}
                  currentStep={currentStep}
                  onStepClick={(step) => setCurrentStep(step)}
                />
              </div>

              {/* Wizard Form Card */}
              <div className="max-w-3xl mx-auto rounded-3xl glass-card border border-surface-border p-6 sm:p-8 relative overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    {currentStep === 1 && (
                      <StepVehicle
                        data={formData}
                        updateData={updateFormData}
                      />
                    )}
                    {currentStep === 2 && (
                      <StepLocation
                        data={formData}
                        updateData={updateFormData}
                      />
                    )}
                    {currentStep === 3 && (
                      <StepUsage
                        data={formData}
                        updateData={updateFormData}
                      />
                    )}
                    {currentStep === 4 && (
                      <StepConsumables
                        data={formData}
                        updateData={updateFormData}
                        onCalculate={() => {
                          setActiveView("results");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-surface-border">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveView("landing")}
                      className="text-xs text-text-dim hover:text-text-primary transition-colors cursor-pointer"
                    >
                      ← Back to Showcase
                    </button>
                  )}

                  {currentStep < 4 ? (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="gap-2"
                    >
                      <span>
                        Next: {WIZARD_STEPS[currentStep].shortLabel}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: VALUATION RESULTS DASHBOARD */}
          {activeView === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <ValuationDashboard
                initialData={formData}
                onBackToWizard={() => setActiveView("wizard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-elevated/40 mt-16 py-8 text-center text-xs text-text-dim">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-text-primary">
            <button
              onClick={() => {
                setActiveView("landing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Showcase
            </button>
            <span>•</span>
            <button
              onClick={startWizard}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Valuation Wizard
            </button>
          </div>
          <p className="font-semibold text-text-primary mt-1">
            ResaleMeter India • Empirical Used Vehicle Valuation Intelligence
          </p>
          <p className="max-w-2xl mx-auto text-text-faint">
            Valuations are algorithmic market estimates based on historical ex-showroom prices, age retention curves, and Indian used vehicle sales data. Not an official appraisal or guaranteed transaction price.
          </p>
        </div>
      </footer>
    </div>
  );
}
