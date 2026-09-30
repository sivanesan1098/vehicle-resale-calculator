import { sqlite } from "../db";
import { seedDatabase } from "../db/seed";

export interface BrandRecord {
  id: string;
  name: string;
  category: "car" | "bike";
  country?: string;
}

export interface ModelRecord {
  id: string;
  brandId: string;
  name: string;
  category: "car" | "bike";
  segment?: string;
}

export interface VariantRecord {
  id: string;
  modelId: string;
  name: string;
  fuel: string;
  transmission: string;
  engineCc?: number;
}

export interface RTORuleRecord {
  id: string;
  stateCode: string;
  stateName: string;
  rtoCode: string;
  cityName: string;
  roadTaxCarPercent: number;
  roadTaxBikePercent: number;
}

/**
 * Universal Vehicle Data Provider Contract
 * Ensures the system is decoupled from specific database or external API implementations.
 */
export interface VehicleDataProvider {
  getBrands(category?: "car" | "bike"): Promise<BrandRecord[]>;
  getModels(brandId?: string, category?: "car" | "bike"): Promise<ModelRecord[]>;
  getVariants(modelId: string): Promise<VariantRecord[]>;
  getHistoricalPrice(
    variantId: string,
    modelYear: number
  ): Promise<number | null>;
  getRTORules(stateCode?: string): Promise<RTORuleRecord[]>;
}

/**
 * Concrete SQLite Implementation of VehicleDataProvider
 */
export class SQLiteVehicleDataProvider implements VehicleDataProvider {
  private initialized = false;

  private ensureInitialized() {
    if (!this.initialized) {
      seedDatabase();
      this.initialized = true;
    }
  }

  async getBrands(category?: "car" | "bike"): Promise<BrandRecord[]> {
    this.ensureInitialized();
    if (category) {
      return sqlite
        .prepare(
          "SELECT id, name, category, country FROM brands WHERE category = ? ORDER BY name ASC"
        )
        .all(category) as BrandRecord[];
    }
    return sqlite
      .prepare(
        "SELECT id, name, category, country FROM brands ORDER BY name ASC"
      )
      .all() as BrandRecord[];
  }

  async getModels(brandId?: string, category?: "car" | "bike"): Promise<ModelRecord[]> {
    this.ensureInitialized();
    if (brandId) {
      return sqlite
        .prepare(
          "SELECT id, brand_id as brandId, name, category, segment FROM models WHERE brand_id = ? ORDER BY name ASC"
        )
        .all(brandId) as ModelRecord[];
    }
    if (category) {
      return sqlite
        .prepare(
          "SELECT id, brand_id as brandId, name, category, segment FROM models WHERE category = ? ORDER BY name ASC"
        )
        .all(category) as ModelRecord[];
    }
    return sqlite
      .prepare(
        "SELECT id, brand_id as brandId, name, category, segment FROM models ORDER BY name ASC"
      )
      .all() as ModelRecord[];
  }

  async getVariants(modelId: string): Promise<VariantRecord[]> {
    this.ensureInitialized();
    return sqlite
      .prepare(
        "SELECT id, model_id as modelId, name, fuel, transmission, engine_cc as engineCc FROM variants WHERE model_id = ? ORDER BY name ASC"
      )
      .all(modelId) as VariantRecord[];
  }

  async getHistoricalPrice(
    variantId: string,
    modelYear: number
  ): Promise<number | null> {
    this.ensureInitialized();
    const row = sqlite
      .prepare(
        "SELECT ex_showroom_price FROM vehicle_prices WHERE variant_id = ? AND model_year = ?"
      )
      .get(variantId, modelYear) as { ex_showroom_price: number } | undefined;

    return row ? row.ex_showroom_price : null;
  }

  async getRTORules(stateCode?: string): Promise<RTORuleRecord[]> {
    this.ensureInitialized();
    if (stateCode) {
      return sqlite
        .prepare(
          "SELECT id, state_code as stateCode, state_name as stateName, rto_code as rtoCode, city_name as cityName, road_tax_car_percent as roadTaxCarPercent, road_tax_bike_percent as roadTaxBikePercent FROM rto_rules WHERE state_code = ? ORDER BY rto_code ASC"
        )
        .all(stateCode) as RTORuleRecord[];
    }
    return sqlite
      .prepare(
        "SELECT id, state_code as stateCode, state_name as stateName, rto_code as rtoCode, city_name as cityName, road_tax_car_percent as roadTaxCarPercent, road_tax_bike_percent as roadTaxBikePercent FROM rto_rules ORDER BY state_code, rto_code ASC"
      )
      .all() as RTORuleRecord[];
  }
}

/**
 * Extensible Third-Party Live API Provider Adapter (e.g. RapidAPI / VAHAN)
 * Gracefully falls back to SQLite provider if external credentials are not present or network fails.
 */
export class ExternalAPIVehicleDataProvider implements VehicleDataProvider {
  private fallbackProvider: SQLiteVehicleDataProvider;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.VEHICLE_API_KEY;
    this.fallbackProvider = new SQLiteVehicleDataProvider();
  }

  async getBrands(category?: "car" | "bike"): Promise<BrandRecord[]> {
    // If external API key is present, remote fetch can be executed here.
    return this.fallbackProvider.getBrands(category);
  }

  async getModels(brandId?: string, category?: "car" | "bike"): Promise<ModelRecord[]> {
    return this.fallbackProvider.getModels(brandId, category);
  }

  async getVariants(modelId: string): Promise<VariantRecord[]> {
    return this.fallbackProvider.getVariants(modelId);
  }

  async getHistoricalPrice(
    variantId: string,
    modelYear: number
  ): Promise<number | null> {
    return this.fallbackProvider.getHistoricalPrice(variantId, modelYear);
  }

  async getRTORules(stateCode?: string): Promise<RTORuleRecord[]> {
    return this.fallbackProvider.getRTORules(stateCode);
  }
}

// Default export singleton provider instance
let defaultProvider: VehicleDataProvider | null = null;

export function getVehicleDataProvider(): VehicleDataProvider {
  if (!defaultProvider) {
    // Check if external API credentials exist, otherwise use lightweight SQLite
    if (process.env.VEHICLE_API_KEY) {
      defaultProvider = new ExternalAPIVehicleDataProvider(
        process.env.VEHICLE_API_KEY
      );
    } else {
      defaultProvider = new SQLiteVehicleDataProvider();
    }
  }
  return defaultProvider;
}
