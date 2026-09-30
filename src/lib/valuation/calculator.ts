import { ValuationBreakdown, ValuationInput, ValuationResult } from "./types";
import { calculateAgeDepreciatedBase } from "./depreciation";
import { calculateMileageAdjustment } from "./mileage";
import { calculateConditionAdjustment } from "./condition";
import { calculateOwnershipAdjustment } from "./ownership";
import { calculateServiceAdjustment } from "./service";
import { calculateAccidentAdjustment } from "./accident";
import { calculateConsumablesAdjustment } from "./consumables";
import { calculateMarketSynthesis } from "./market";

/**
 * Master Valuation Calculation Function
 * Decoupled, pure TypeScript with zero web or database dependencies.
 * Can execute isomorphically on both client and server.
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const currentYear = input.evaluationYear || 2026;
  const ageYears = Math.max(1, currentYear - input.modelYear);

  // 1. Age Depreciation Retention Base
  const { ageDepreciatedBase, retentionFactor } = calculateAgeDepreciatedBase(
    input.historicalExShowroom,
    ageYears,
    input.category
  );

  // 2. Normalized Mileage Adjustment
  const { expectedMileage, mileageRatio, mileageAdjustment } =
    calculateMileageAdjustment(
      input.odometer,
      ageYears,
      input.category,
      ageDepreciatedBase
    );

  // 3. Overall Physical/Mechanical Condition Multiplier
  const { conditionAdjustment } = calculateConditionAdjustment(
    input.condition,
    ageDepreciatedBase
  );

  // 4. Ownership Transfer Adjustment
  const { ownerAdjustment } = calculateOwnershipAdjustment(
    input.owners,
    ageDepreciatedBase
  );

  // 5. Service Records Adjustment
  const { serviceAdjustment } = calculateServiceAdjustment(
    input.serviceHistory,
    ageDepreciatedBase
  );

  // 6. Accident & Structural Deductions
  const { accidentAdjustment } = calculateAccidentAdjustment(
    input.accidentHistory,
    input.category
  );

  // 7. Consumables & Wear Deductions
  const { consumablesAdjustment } = calculateConsumablesAdjustment(
    input.tyreCondition,
    input.batteryCondition,
    input.insuranceStatus,
    input.category
  );

  // 8. Intrinsic Calculated Value (guaranteed positive minimum scrap/utility floor)
  const intrinsicValue = Math.max(
    input.category === "car" ? 45000 : 15000,
    ageDepreciatedBase +
      mileageAdjustment +
      conditionAdjustment +
      ownerAdjustment +
      serviceAdjustment +
      accidentAdjustment +
      consumablesAdjustment
  );

  // 9. Market Observation Synthesis & Pricing Perspective
  const { marketAdjustment, fairMarketValue, ranges, confidence } =
    calculateMarketSynthesis(intrinsicValue, input);

  // 10. Assemble Detailed Breakdown
  const breakdown: ValuationBreakdown = {
    ageYears,
    historicalExShowroom: input.historicalExShowroom,
    retentionFactor,
    ageDepreciatedBase,
    expectedMileage,
    mileageRatio,
    mileageAdjustment,
    conditionAdjustment,
    ownerAdjustment,
    serviceAdjustment,
    accidentAdjustment,
    consumablesAdjustment,
    intrinsicValue,
    marketAdjustment,
    fairMarketValue,
  };

  return {
    fairMarketValue,
    ranges,
    confidence,
    breakdown,
    currency: "INR",
    calculatedAt: new Date().toISOString(),
  };
}
