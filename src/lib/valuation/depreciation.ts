import { VehicleCategory } from "./types";

/**
 * Calibrated Indian Automotive Retention Factor Table
 * Keyed by vehicle age in completed years (1 to 8+).
 */
const CAR_RETENTION_CURVE: Record<number, number> = {
  0: 1.0,
  1: 0.82,
  2: 0.73,
  3: 0.64,
  4: 0.54,
  5: 0.46,
  6: 0.4,
  7: 0.35,
  8: 0.3,
};

const BIKE_RETENTION_CURVE: Record<number, number> = {
  0: 1.0,
  1: 0.8,
  2: 0.7,
  3: 0.6,
  4: 0.5,
  5: 0.42,
  6: 0.35,
  7: 0.29,
  8: 0.24,
};

/**
 * Calculates the age retention factor for a vehicle.
 * @param age Vehicle age in completed years
 * @param category Car or Bike
 */
export function getRetentionFactor(
  age: number,
  category: VehicleCategory
): number {
  const curve = category === "car" ? CAR_RETENTION_CURVE : BIKE_RETENTION_CURVE;
  const clampedAge = Math.max(0, Math.floor(age));

  if (clampedAge <= 8) {
    return curve[clampedAge];
  }

  // Extrapolate beyond 8 years with diminishing annual decay down to a scrap/utility floor of 15%
  const base8 = curve[8];
  const extraYears = clampedAge - 8;
  const decayed = base8 - extraYears * 0.025;
  return Math.max(0.15, decayed);
}

/**
 * Calculates the age-depreciated base value before vehicle-specific adjustments.
 */
export function calculateAgeDepreciatedBase(
  historicalExShowroom: number,
  age: number,
  category: VehicleCategory
): { ageDepreciatedBase: number; retentionFactor: number } {
  const retentionFactor = getRetentionFactor(age, category);
  const ageDepreciatedBase = Math.round(historicalExShowroom * retentionFactor);
  return { ageDepreciatedBase, retentionFactor };
}
