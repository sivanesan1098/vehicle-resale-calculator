import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateValuation } from "../calculator";
import { getRetentionFactor } from "../depreciation";
import { calculateMileageAdjustment } from "../mileage";
import { calculateConsumablesAdjustment } from "../consumables";
import { ValuationInput } from "../types";

describe("Decoupled Valuation Engine Unit Tests", () => {
  describe("Depreciation Curves", () => {
    it("returns correct retention factors for cars across years", () => {
      assert.equal(getRetentionFactor(1, "car"), 0.82);
      assert.equal(getRetentionFactor(2, "car"), 0.73);
      assert.equal(getRetentionFactor(3, "car"), 0.64);
      assert.equal(getRetentionFactor(4, "car"), 0.54);
      assert.equal(getRetentionFactor(5, "car"), 0.46);
      assert.equal(getRetentionFactor(8, "car"), 0.3);
    });

    it("returns correct retention factors for bikes across years", () => {
      assert.equal(getRetentionFactor(1, "bike"), 0.8);
      assert.equal(getRetentionFactor(3, "bike"), 0.6);
      assert.equal(getRetentionFactor(5, "bike"), 0.42);
      assert.equal(getRetentionFactor(8, "bike"), 0.24);
    });

    it("respects scrap floor for vintage vehicles (> 8 years)", () => {
      const vintageCarFactor = getRetentionFactor(12, "car");
      assert.ok(vintageCarFactor >= 0.15, "Car retention should never drop below scrap floor 15%");
    });
  });

  describe("Mileage Normalization", () => {
    it("rewards below-average mileage with positive adjustment", () => {
      // 4-year car: expected is 44,000 km. Actual is 25,000 km.
      const result = calculateMileageAdjustment(25000, 4, "car", 400000);
      assert.ok(result.mileageAdjustment > 0, "Lower mileage must increase valuation");
      assert.ok(result.mileageRatio < 1.0);
    });

    it("penalizes excessive mileage with negative adjustment", () => {
      // 4-year car: expected is 44,000 km. Actual is 90,000 km.
      const result = calculateMileageAdjustment(90000, 4, "car", 400000);
      assert.ok(result.mileageAdjustment < 0, "Excessive mileage must reduce valuation");
      assert.ok(result.mileageRatio > 1.0);
    });
  });

  describe("Consumables Deductions", () => {
    it("deducts exact rupee amounts for tyres, battery, and expired insurance", () => {
      const result = calculateConsumablesAdjustment("due", "weak", "expired", "car");
      assert.equal(result.tyreDeduction, -16000);
      assert.equal(result.batteryDeduction, -5000);
      assert.equal(result.insuranceDeduction, -12000);
      assert.equal(result.consumablesAdjustment, -33000);
    });

    it("applies 0 deductions when consumables are healthy and insurance is active", () => {
      const result = calculateConsumablesAdjustment("new", "good", "comprehensive", "car");
      assert.equal(result.consumablesAdjustment, 0);
    });
  });

  describe("Benchmark End-to-End Test 1: 2022 Hyundai i20 Sportz", () => {
    const input: ValuationInput = {
      category: "car",
      brand: "Hyundai",
      model: "i20",
      variant: "Sportz 1.2 Petrol MT",
      modelYear: 2022,
      historicalExShowroom: 805000,
      odometer: 42000,
      owners: 1,
      condition: "good",
      serviceHistory: "authorized",
      accidentHistory: "clean",
      tyreCondition: "good",
      batteryCondition: "good",
      insuranceStatus: "comprehensive",
      stateCode: "TS",
      rtoCode: "TS-09",
      evaluationYear: 2026, // 4-year old vehicle
    };

    it("calculates realistic valuation and ranges for 2022 i20", () => {
      const result = calculateValuation(input);

      assert.equal(result.currency, "INR");
      assert.equal(result.breakdown.ageYears, 4);
      assert.equal(result.breakdown.retentionFactor, 0.54);

      // 4-year 805,000 * 0.54 = ~434,700 base
      assert.equal(result.breakdown.ageDepreciatedBase, 434700);

      // Positive bonus for single owner and authorized service
      assert.ok(result.breakdown.serviceAdjustment > 0);
      assert.equal(result.breakdown.ownerAdjustment, 0);

      // Fair market value should be around ~4.4L - ~4.6L
      assert.ok(
        result.fairMarketValue >= 420000 && result.fairMarketValue <= 470000,
        `Expected fair market value between 4.2L and 4.7L, got ${result.fairMarketValue}`
      );

      // Ranges must preserve hierarchy: Dealer Min < Buyer Target < Fair Value < Seller Listing Max
      assert.ok(result.ranges.dealerTradeInRange.min < result.ranges.likelySellingRange.min);
      assert.ok(result.ranges.likelySellingRange.min < result.fairMarketValue);
      assert.ok(result.fairMarketValue < result.ranges.sellerListingRange.max);

      // High confidence for clean single owner
      assert.equal(result.confidence.tier, "High");
      assert.ok(result.confidence.score >= 0.85);
    });
  });

  describe("Benchmark End-to-End Test 2: 2021 Royal Enfield Classic 350", () => {
    const input: ValuationInput = {
      category: "bike",
      brand: "Royal Enfield",
      model: "Classic 350",
      variant: "Signals Edition Dual Channel ABS",
      modelYear: 2021,
      historicalExShowroom: 198000,
      odometer: 18000,
      owners: 2,
      condition: "excellent",
      serviceHistory: "authorized",
      accidentHistory: "clean",
      tyreCondition: "new",
      batteryCondition: "good",
      insuranceStatus: "comprehensive",
      stateCode: "KA",
      rtoCode: "KA-01",
      evaluationYear: 2026, // 5-year old bike
    };

    it("calculates realistic valuation for 2021 Royal Enfield Classic 350", () => {
      const result = calculateValuation(input);

      assert.equal(result.breakdown.ageYears, 5);
      assert.equal(result.breakdown.retentionFactor, 0.42);

      // Excellent condition (+5%) balances out 2nd owner (-3.5%)
      assert.ok(result.breakdown.conditionAdjustment > 0);
      assert.ok(result.breakdown.ownerAdjustment < 0);

      // Fair value in expected range
      assert.ok(
        result.fairMarketValue >= 80000 && result.fairMarketValue <= 110000,
        `Expected bike fair market value between 80k and 110k, got ${result.fairMarketValue}`
      );
    });
  });

  describe("Edge Case Test 3: Flood damage vehicle", () => {
    const input: ValuationInput = {
      category: "car",
      brand: "Maruti",
      model: "Swift",
      variant: "VXi",
      modelYear: 2020,
      historicalExShowroom: 645000,
      odometer: 60000,
      owners: 3,
      condition: "needs-work",
      serviceHistory: "none",
      accidentHistory: "structural-flood",
      tyreCondition: "due",
      batteryCondition: "weak",
      insuranceStatus: "expired",
      stateCode: "DL",
      evaluationYear: 2026,
    };

    it("applies structural deduction and flags caveats in confidence score", () => {
      const result = calculateValuation(input);

      // Structural deduction applied
      assert.equal(result.breakdown.accidentAdjustment, -95000);
      assert.ok(result.breakdown.consumablesAdjustment < -20000);

      // Confidence score must reflect high risk
      assert.ok(result.confidence.score <= 0.7);
      assert.ok(result.confidence.caveats.length >= 2);
      assert.ok(result.confidence.caveats.some((c) => c.includes("flood")));
    });
  });
});
