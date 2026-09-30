"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Car,
  Bike,
  Sparkles,
  Fuel,
  Settings2,
  Calendar,
  Search,
  X,
  Loader2,
  CheckCircle2,
  Database as DatabaseIcon,
  Bot,
} from "lucide-react";
import { POPULAR_VEHICLES, type WizardFormData } from "../../lib/mock-data";
import { formatLakhs } from "../../lib/utils";
import {
  fetchHistoricalPrice,
  fetchAllModels,
  fetchVariants,
  lookupVehicleAI,
} from "../../lib/data-service";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface StepVehicleProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
}

interface UnifiedModel {
  id: string;
  brand: string;
  brandId: string;
  name: string;
  category: "car" | "bike";
  segment?: string;
  years?: number[];
  variants?: Array<{
    id: string;
    name: string;
    fuel: "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid" | string;
    transmission: "Manual" | "Automatic" | string;
    baseExShowroom?: number;
    historicalExShowroom?: Record<number, number>;
  }>;
}

export function StepVehicle({ data, updateData }: StepVehicleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [dbModels, setDbModels] = useState<UnifiedModel[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [modelVariants, setModelVariants] = useState<any[]>([]);

  // 1. Fetch live models from SQLite database on mount / category change
  useEffect(() => {
    let isMounted = true;
    fetchAllModels(data.category).then((records) => {
      if (!isMounted) return;
      if (records && records.length > 0) {
        const unified = records.map((r) => {
          const brandName =
            r.brandId.charAt(0).toUpperCase() +
            r.brandId.slice(1).replace(/-/g, " ");
          return {
            id: r.id,
            brand: brandName,
            brandId: r.brandId,
            name: r.name,
            category: r.category,
            segment: r.segment || "Standard",
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
          };
        });
        setDbModels(unified);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [data.category]);

  // 2. Combine SQLite models with curated popular showcase vehicles (deduplicated)
  const combinedModels = useMemo<UnifiedModel[]>(() => {
    const popular = POPULAR_VEHICLES.filter((v) => v.category === data.category).map(
      (v) => ({
        id: v.id,
        brand: v.brand,
        brandId: v.brand.toLowerCase().replace(/\s+/g, "-"),
        name: v.name,
        category: v.category,
        segment: v.segment,
        years: v.years,
        variants: v.variants,
      })
    );

    const map = new Map<string, UnifiedModel>();
    // Add DB models first
    dbModels.forEach((m) => map.set(m.id, m));
    // Overlay popular models with their detailed variants
    popular.forEach((m) => map.set(m.id, { ...map.get(m.id), ...m }));

    return Array.from(map.values());
  }, [data.category, dbModels]);

  // 3. Search filter across brand, model, segment
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return combinedModels;
    const q = searchQuery.toLowerCase().trim();
    return combinedModels.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        (m.segment && m.segment.toLowerCase().includes(q))
    );
  }, [combinedModels, searchQuery]);

  // 4. Extract top brands for fast pill filter
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(combinedModels.map((m) => m.brand)));
    // Put top market brands first
    const priority = [
      "Maruti",
      "Maruti suzuki",
      "Hyundai",
      "Tata",
      "Mahindra",
      "Toyota",
      "Kia",
      "Honda",
      "Royal enfield",
      "Tvs",
      "Bajaj",
    ];
    return brands.sort((a, b) => {
      const idxA = priority.findIndex((p) =>
        a.toLowerCase().includes(p.toLowerCase())
      );
      const idxB = priority.findIndex((p) =>
        b.toLowerCase().includes(p.toLowerCase())
      );
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [combinedModels]);

  // 5. Current selected model
  const selectedModel = useMemo(() => {
    return (
      combinedModels.find((m) => m.id === data.modelId) ||
      combinedModels[0] || {
        id: "default",
        brand: data.brand || "Maruti",
        brandId: "maruti",
        name: "Swift",
        category: data.category,
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      }
    );
  }, [combinedModels, data.modelId, data.brand, data.category]);

  // 6. Fetch live variants for selected model from SQLite API
  useEffect(() => {
    let isMounted = true;
    if (selectedModel?.id) {
      fetchVariants(selectedModel.id).then((vars) => {
        if (!isMounted) return;
        if (vars && vars.length > 0) {
          setModelVariants(vars);
        } else {
          setModelVariants(selectedModel.variants || []);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedModel?.id]);

  const availableVariants = useMemo(() => {
    if (modelVariants.length > 0) return modelVariants;
    if (selectedModel.variants && selectedModel.variants.length > 0) {
      return selectedModel.variants;
    }
    // Fallback default trims if not yet populated
    return [
      {
        id: `${selectedModel.id}-base-mt`,
        name: "Standard Manual",
        fuel: data.fuel || "Petrol",
        transmission: "Manual",
      },
      {
        id: `${selectedModel.id}-top-at`,
        name: "Top Option Automatic",
        fuel: data.fuel || "Petrol",
        transmission: "Automatic",
      },
    ];
  }, [modelVariants, selectedModel, data.fuel]);

  // 7. Current selected variant
  const selectedVariant = useMemo(() => {
    return (
      availableVariants.find((v) => v.id === data.variantId) ||
      availableVariants[0]
    );
  }, [availableVariants, data.variantId]);

  // 8. Available years
  const availableYears = selectedModel?.years || [
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  ];

  // 9. Fetch live historical ex-showroom price
  useEffect(() => {
    let isMounted = true;
    if (selectedVariant?.id) {
      fetchHistoricalPrice(selectedVariant.id, data.modelYear).then((p) => {
        if (isMounted) setLivePrice(p);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedVariant?.id, data.modelYear]);

  const historicalPrice =
    livePrice ||
    selectedVariant?.historicalExShowroom?.[data.modelYear] ||
    selectedVariant?.baseExShowroom ||
    800000;

  // Handlers
  const handleCategoryChange = (category: "car" | "bike") => {
    setSearchQuery("");
    setAiMessage(null);
    const newModels = combinedModels.filter((v) => v.category === category);
    const firstModel = newModels[0];
    const firstVariant = firstModel?.variants?.[0];

    updateData({
      category,
      brand: firstModel?.brand || (category === "car" ? "Maruti" : "Royal Enfield"),
      modelId: firstModel?.id || (category === "car" ? "maruti-swift" : "re-classic-350"),
      variantId: firstVariant?.id || (category === "car" ? "swift-vxi-petrol" : "classic-350-signals"),
      modelYear: 2022,
      fuel: firstVariant?.fuel || "Petrol",
      transmission: firstVariant?.transmission || "Manual",
    });
  };

  const handleBrandChange = (brand: string) => {
    const modelsForBrand = combinedModels.filter(
      (m) => m.brand.toLowerCase() === brand.toLowerCase()
    );
    const firstModel = modelsForBrand[0] || combinedModels[0];
    const firstVariant = firstModel?.variants?.[0];

    updateData({
      brand,
      modelId: firstModel.id,
      variantId: firstVariant?.id || `${firstModel.id}-base-mt`,
      modelYear: 2022,
      fuel: firstVariant?.fuel || "Petrol",
      transmission: firstVariant?.transmission || "Manual",
    });
  };

  const handleModelSelect = (model: UnifiedModel) => {
    const firstVariant = model.variants?.[0];
    updateData({
      modelId: model.id,
      brand: model.brand,
      variantId: firstVariant?.id || `${model.id}-base-mt`,
      modelYear: data.modelYear || 2022,
      fuel: firstVariant?.fuel || "Petrol",
      transmission: firstVariant?.transmission || "Manual",
    });
  };

  const handleVariantChange = (variantId: string) => {
    const variant = availableVariants.find((v) => v.id === variantId);
    if (!variant) return;

    updateData({
      variantId: variant.id,
      fuel: variant.fuel,
      transmission: variant.transmission,
    });
  };

  // 10. Gemini AI Vehicle Sourcing Trigger
  const handleAILookup = async () => {
    if (!searchQuery.trim() || isSearchingAI) return;

    setIsSearchingAI(true);
    setAiMessage({
      text: `Asking Gemini AI to retrieve specifications & historical pricing for "${searchQuery}"...`,
      type: "info",
    });

    try {
      const res = await lookupVehicleAI(searchQuery.trim(), data.category);

      if (res.success && res.brand && res.model) {
        // Add to local list
        const newModel: UnifiedModel = {
          id: res.model.id,
          brand: res.brand.name,
          brandId: res.brand.id,
          name: res.model.name,
          category: res.model.category,
          segment: res.model.segment || "AI Sourced",
          years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
          variants: (res.variants || []).map((v) => ({
            id: v.id,
            name: v.name,
            fuel: v.fuel as any,
            transmission: v.transmission as any,
          })),
        };

        setDbModels((prev) => [newModel, ...prev]);

        // Auto-select this vehicle
        const firstVar = res.variants?.[0];
        updateData({
          brand: res.brand.name,
          modelId: res.model.id,
          variantId: firstVar?.id || `${res.model.id}-standard`,
          modelYear: 2022,
          fuel: firstVar?.fuel || "Petrol",
          transmission: firstVar?.transmission || "Manual",
        });

        setSearchQuery("");
        setAiMessage({
          text: `✨ Successfully imported ${res.brand.name} ${res.model.name} via Gemini AI and saved to SQLite database!`,
          type: "success",
        });
      } else {
        setAiMessage({
          text: "Could not find vehicle details. Please try with make and model (e.g. 'Force Gurkha' or 'BYD Atto 3').",
          type: "error",
        });
      }
    } catch (err: any) {
      setAiMessage({
        text: `AI lookup error: ${err?.message || "Unknown error"}`,
        type: "error",
      });
    } finally {
      setIsSearchingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Category Switcher */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2.5">
          Select Vehicle Category
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => handleCategoryChange("car")}
            className={`flex items-center justify-center gap-3 p-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 cursor-pointer ${
              data.category === "car"
                ? "bg-accent/10 border-accent text-accent shadow-xs shadow-accent-glow"
                : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong"
            }`}
          >
            <Car className="w-5 h-5" />
            <span>Four-Wheeler / Car</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange("bike")}
            className={`flex items-center justify-center gap-3 p-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 cursor-pointer ${
              data.category === "bike"
                ? "bg-accent/10 border-accent text-accent shadow-xs shadow-accent-glow"
                : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong"
            }`}
          >
            <Bike className="w-5 h-5" />
            <span>Two-Wheeler / Bike</span>
          </button>
        </div>
      </div>

      {/* 2. Fast Vehicle Search Bar & Gemini AI Fallback */}
      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim">
            Search Model or Brand ({combinedModels.length} in Database)
          </label>
          <button
            type="button"
            onClick={handleAILookup}
            disabled={!searchQuery.trim() || isSearchingAI}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
              searchQuery.trim()
                ? "bg-accent/10 text-accent hover:bg-accent/20 cursor-pointer"
                : "text-text-dim/60 cursor-not-allowed"
            }`}
            title="Search or import missing car with Google Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Gemini AI Auto-Fetch</span>
          </button>
        </div>

        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-text-dim absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (aiMessage) setAiMessage(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredModels.length === 0 && searchQuery.trim()) {
                handleAILookup();
              }
            }}
            placeholder={`Search across CarWale catalogue e.g. ${
              data.category === "car"
                ? "Punch, Creta, Brezza, Gurkha, Atto 3, Virtus..."
                : "Classic 350, Apache, Activa, Hunter..."
            }`}
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setAiMessage(null);
                }}
                className="p-1 rounded-full text-text-dim hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Gemini AI Status Message */}
        {aiMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition-all ${
              aiMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : aiMessage.type === "info"
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {aiMessage.type === "info" ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : aiMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0" />
            )}
            <span>{aiMessage.text}</span>
          </div>
        )}

        {/* Gemini AI Callout When 0 Search Results Found */}
        {filteredModels.length === 0 && searchQuery.trim() && !isSearchingAI && (
          <div className="p-4 rounded-xl border border-dashed border-accent/40 bg-accent/5 space-y-2.5">
            <div className="flex items-center gap-2 text-accent font-semibold text-sm">
              <Bot className="w-4 h-4" />
              <span>"{searchQuery}" not found in current database</span>
            </div>
            <p className="text-xs text-text-dim">
              ResaleMeter can use Google Gemini AI to search official Indian ex-showroom
              pricing, variants, and specs, then save it directly to the database.
            </p>
            <button
              type="button"
              onClick={handleAILookup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium text-xs shadow-md shadow-accent/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Gemini AI to Add "{searchQuery}"</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Brand Selector Pills */}
      {!searchQuery && availableBrands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-dim">
              Manufacturer / Brand ({availableBrands.length})
            </label>
            <span className="text-[11px] text-text-faint flex items-center gap-1">
              <DatabaseIcon className="w-3 h-3" /> Live CarWale DB
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {availableBrands.slice(0, 15).map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleBrandChange(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  data.brand.toLowerCase() === brand.toLowerCase()
                    ? "bg-text-primary text-background border-text-primary shadow-xs font-semibold"
                    : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Model Selection Grid */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2">
          Model {searchQuery ? `(Search Results: ${filteredModels.length})` : `(${data.brand})`}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {(searchQuery
            ? filteredModels
            : combinedModels.filter(
                (m) => m.brand.toLowerCase() === data.brand.toLowerCase()
              )
          ).map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => handleModelSelect(model)}
              className={`p-3 rounded-xl border text-left font-display text-sm transition-all cursor-pointer ${
                data.modelId === model.id
                  ? "bg-accent-soft border-accent text-accent shadow-xs shadow-accent-glow font-bold"
                  : "bg-surface-elevated border-surface-border text-text-primary hover:border-surface-border-strong"
              }`}
            >
              <div className="truncate font-semibold">{model.name}</div>
              <div className="flex items-center justify-between text-[11px] text-text-dim mt-0.5">
                <span className="truncate">{model.brand}</span>
                {model.segment && (
                  <span className="text-[10px] text-text-faint truncate ml-1">
                    {model.segment}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Variant & Year Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Variant */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2">
            Variant ({availableVariants.length} Trims)
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {availableVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => handleVariantChange(variant.id)}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                  data.variantId === variant.id
                    ? "bg-accent/10 border-accent text-text-primary font-semibold"
                    : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong"
                }`}
              >
                <div className="truncate pr-2">
                  <span className="block truncate text-text-primary font-medium">
                    {variant.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-dim">
                    <span className="inline-flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-text-faint" />
                      {variant.fuel}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Settings2 className="w-3 h-3 text-text-faint" />
                      {variant.transmission}
                    </span>
                  </div>
                </div>
                {data.variantId === variant.id && (
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0 shadow-xs shadow-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Year */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-dim block mb-2">
            Registration / Model Year
          </label>
          <div className="grid grid-cols-4 gap-2">
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => updateData({ modelYear: year })}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                  data.modelYear === year
                    ? "bg-accent text-white border-accent shadow-xs shadow-accent"
                    : "bg-surface-elevated border-surface-border text-text-dim hover:text-text-primary hover:border-surface-border-strong"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Historical Ex-Showroom Price Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-surface-elevated/60 border border-surface-border space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-dim flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span>Original {data.modelYear} Ex-Showroom:</span>
              </span>
              <span className="font-display font-bold text-accent text-sm">
                {formatLakhs(historicalPrice)}
              </span>
            </div>
            <p className="text-[11px] text-text-faint leading-relaxed">
              Base metal valuation anchor sourced from official CarWale & OEM archives. State road tax and RTO charges are isolated in Step 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
