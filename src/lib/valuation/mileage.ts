import { VehicleCategory } from "./types";

/**
 * Expected annual usage benchmarks in India (km/year)
 */
export const EXPECTED_ANNUAL_KM: Record<VehicleCategory, number> = {
  car: 11000,
  bike: 7000,
};

/**
 * Calculates mileage adjustment based on normalized usage ratio.
 */
export function calculateMileageAdjustment(
  odometer: number,
  age: number,
  category: VehicleCategory,
  baseValue: number
): {
  expectedMileage: number;
  mileageRatio: number;
  mileageAdjustment: number;
} {
  const safeAge = Math.max(1, age);
  const annualBenchmark = EXPECTED_ANNUAL_KM[category];
  const expectedMileage = safeAge * annualBenchmark;

  // Calculate relative usage ratio
  const mileageRatio = odometer / expectedMileage;

  // Deviation from benchmark: (1 - ratio) gives positive value if actual < expected
  let adjustmentPercent = (1 - mileageRatio) * 0.12;

  // Clamp within realistic thresholds: max +12% premium for exceptionally low mileage, max -20% penalty
  adjustmentPercent = Math.max(-0.2, Math.min(0.12, adjustmentPercent));

  const mileageAdjustment = Math.round(baseValue * adjustmentPercent);

  return {
    expectedMileage,
    mileageRatio: Number(mileageRatio.toFixed(3)),
    mileageAdjustment,
  };
}
