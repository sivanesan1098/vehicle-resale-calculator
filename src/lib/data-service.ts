import { BrandRecord, ModelRecord, VariantRecord, RTORuleRecord } from "./data-provider";
import { POPULAR_VEHICLES, POPULAR_STATES } from "./mock-data";

/**
 * Client-Side Data Service with Caching and Graceful Fallback
 * Provides instant cached data while querying SQLite REST APIs in the background.
 */

// Memory Cache
const brandCache: Record<string, BrandRecord[]> = {};
const modelCache: Record<string, ModelRecord[]> = {};
const variantCache: Record<string, VariantRecord[]> = {};
const priceCache: Record<string, number> = {};
const rtoCache: Record<string, RTORuleRecord[]> = {};

export async function fetchBrands(category?: "car" | "bike"): Promise<BrandRecord[]> {
  const cacheKey = category || "all";
  if (brandCache[cacheKey]) return brandCache[cacheKey];

  try {
    const url = category ? `/api/vehicles/brands?category=${category}` : `/api/vehicles/brands`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        brandCache[cacheKey] = json.data;
        return json.data;
      }
    }
  } catch (_) {}

  // Fallback to local catalog
  const filtered = POPULAR_VEHICLES.filter((v) => !category || v.category === category);
  const brands: BrandRecord[] = Array.from(new Set(filtered.map((v) => v.brand))).map((brand) => ({
    id: brand.toLowerCase().replace(/\s+/g, "-"),
    name: brand,
    category: category || "car",
  }));
  brandCache[cacheKey] = brands;
  return brands;
}

export async function fetchModels(brandName: string): Promise<ModelRecord[]> {
  if (modelCache[brandName]) return modelCache[brandName];

  try {
    const brandId = brandName.toLowerCase().replace(/\s+/g, "-");
    const res = await fetch(`/api/vehicles/models?brandId=${encodeURIComponent(brandId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        modelCache[brandName] = json.data;
        return json.data;
      }
    }
  } catch (_) {}

  // Fallback
  const models: ModelRecord[] = POPULAR_VEHICLES.filter(
    (v) => v.brand.toLowerCase() === brandName.toLowerCase()
  ).map((v) => ({
    id: v.id,
    brandId: brandName,
    name: v.name,
    category: v.category,
  }));
  modelCache[brandName] = models;
  return models;
}

export async function fetchVariants(modelId: string): Promise<VariantRecord[]> {
  if (variantCache[modelId]) return variantCache[modelId];

  try {
    const res = await fetch(`/api/vehicles/variants?modelId=${encodeURIComponent(modelId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        variantCache[modelId] = json.data;
        return json.data;
      }
    }
  } catch (_) {}

  // Fallback
  const vehicle = POPULAR_VEHICLES.find((v) => v.id === modelId);
  const variants: VariantRecord[] = (vehicle?.variants || []).map((v) => ({
    id: v.id,
    modelId,
    name: v.name,
    fuel: v.fuel,
    transmission: v.transmission,
  }));
  variantCache[modelId] = variants;
  return variants;
}

export async function fetchHistoricalPrice(variantId: string, year: number): Promise<number> {
  const cacheKey = `${variantId}-${year}`;
  if (priceCache[cacheKey] !== undefined) return priceCache[cacheKey];

  try {
    const res = await fetch(`/api/vehicles/price?variantId=${encodeURIComponent(variantId)}&year=${year}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.exShowroomPrice) {
        priceCache[cacheKey] = json.exShowroomPrice;
        return json.exShowroomPrice;
      }
    }
  } catch (_) {}

  // Fallback
  for (const v of POPULAR_VEHICLES) {
    const variant = v.variants.find((vr) => vr.id === variantId);
    if (variant) {
      const price = variant.historicalExShowroom[year] || variant.baseExShowroom;
      priceCache[cacheKey] = price;
      return price;
    }
  }

  return 750000;
}

export async function fetchRTORules(stateCode?: string): Promise<RTORuleRecord[]> {
  const cacheKey = stateCode || "all";
  if (rtoCache[cacheKey]) return rtoCache[cacheKey];

  try {
    const url = stateCode ? `/api/rto?stateCode=${stateCode}` : `/api/rto`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        rtoCache[cacheKey] = json.data;
        return json.data;
      }
    }
  } catch (_) {}

  // Fallback
  const state = POPULAR_STATES.find((s) => s.stateCode === stateCode) || POPULAR_STATES[0];
  const list: RTORuleRecord[] = state.rtos.map((r) => ({
    id: r.code,
    stateCode: state.stateCode,
    stateName: state.stateName,
    rtoCode: r.code,
    cityName: r.city,
    roadTaxCarPercent: state.roadTaxPercentCar,
    roadTaxBikePercent: state.roadTaxPercentBike,
  }));
  rtoCache[cacheKey] = list;
  return list;
}

export async function fetchAllModels(category?: "car" | "bike"): Promise<ModelRecord[]> {
  const cacheKey = `all-models-${category || "all"}`;
  if (modelCache[cacheKey]) return modelCache[cacheKey];

  try {
    const url = category ? `/api/vehicles/models?category=${category}` : `/api/vehicles/models`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        modelCache[cacheKey] = json.data;
        return json.data;
      }
    }
  } catch (_) {}

  // Fallback to local catalog
  const filtered = POPULAR_VEHICLES.filter((v) => !category || v.category === category).map((v) => ({
    id: v.id,
    brandId: v.brand.toLowerCase().replace(/\s+/g, "-"),
    name: v.name,
    category: v.category,
    segment: v.segment,
  }));
  modelCache[cacheKey] = filtered;
  return filtered;
}

export async function lookupVehicleAI(
  query: string,
  category: "car" | "bike" = "car"
): Promise<{
  success: boolean;
  source?: "database" | "gemini" | "heuristic";
  brand?: BrandRecord;
  model?: ModelRecord;
  variants?: VariantRecord[];
  error?: string;
}> {
  try {
    const res = await fetch("/api/vehicles/ai-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, category }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Clear caches so the newly added vehicle shows up everywhere
        delete brandCache[category];
        delete brandCache["all"];
        delete modelCache[`all-models-${category}`];
        delete modelCache["all-models-all"];
        if (data.brand?.name) delete modelCache[data.brand.name];
        if (data.model?.id) delete variantCache[data.model.id];

        return data;
      }
    }
    return { success: false, error: "AI lookup response was not successful" };
  } catch (err: any) {
    console.error("[DataService] AI Lookup error:", err);
    return { success: false, error: err?.message || "Network error" };
  }
}

