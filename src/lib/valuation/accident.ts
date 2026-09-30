import { AccidentHistory, VehicleCategory } from "./types";

const ACCIDENT_DEDUCTIONS: Record<
  VehicleCategory,
  Record<AccidentHistory, number>
> = {
  car: {
    clean: 0,
    "minor-cosmetic": -8000,
    "major-mechanical": -35000,
    "structural-flood": -95000,
  },
  bike: {
    clean: 0,
    "minor-cosmetic": -2500,
    "major-mechanical": -10000,
    "structural-flood": -25000,
  },
};

export function calculateAccidentAdjustment(
  accidentHistory: AccidentHistory,
  category: VehicleCategory
): { accidentAdjustment: number } {
  const table = ACCIDENT_DEDUCTIONS[category];
  const accidentAdjustment = table[accidentHistory] ?? 0;

  return { accidentAdjustment };
}
