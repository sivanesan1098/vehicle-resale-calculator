export type VehicleCategory = "car" | "bike";

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";

export type Transmission = "Manual" | "Automatic";

export type ConditionRating =
  | "excellent"
  | "very-good"
  | "good"
  | "fair"
  | "needs-work";

export type ServiceHistory = "authorized" | "partial" | "none";

export type AccidentHistory =
  | "clean"
  | "minor-cosmetic"
  | "major-mechanical"
  | "structural-flood";

export type TyreCondition = "new" | "good" | "due";

export type BatteryCondition = "good" | "weak";

export type InsuranceStatus = "comprehensive" | "third-party" | "expired";

export interface ValuationInput {
  category: VehicleCategory;
  brand: string;
  model: string;
  variant: string;
  modelYear: number;
  historicalExShowroom: number;
  odometer: number;
  owners: number;
  condition: ConditionRating;
  serviceHistory: ServiceHistory;
  accidentHistory: AccidentHistory;
  tyreCondition: TyreCondition;
  batteryCondition: BatteryCondition;
  insuranceStatus: InsuranceStatus;
  stateCode: string;
  rtoCode?: string;
  evaluationYear?: number; // Defaults to current year (2026)
}

export interface ValuationBreakdown {
  ageYears: number;
  historicalExShowroom: number;
  retentionFactor: number;
  ageDepreciatedBase: number;
  expectedMileage: number;
  mileageRatio: number;
  mileageAdjustment: number;
  conditionAdjustment: number;
  ownerAdjustment: number;
  serviceAdjustment: number;
  accidentAdjustment: number;
  consumablesAdjustment: number;
  intrinsicValue: number;
  marketAdjustment: number;
  fairMarketValue: number;
}

export interface PriceRanges {
  likelySellingRange: { min: number; max: number };
  sellerListingRange: { min: number; max: number };
  dealerTradeInRange: { min: number; max: number };
  buyerTargetRange: { min: number; max: number };
}

export interface ConfidenceAssessment {
  score: number; // 0 to 1
  tier: "High" | "Medium" | "Moderate";
  reasons: string[];
  caveats: string[];
}

export interface ValuationResult {
  fairMarketValue: number;
  ranges: PriceRanges;
  confidence: ConfidenceAssessment;
  breakdown: ValuationBreakdown;
  currency: "INR";
  calculatedAt: string;
}
