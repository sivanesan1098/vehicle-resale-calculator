import { ConditionRating } from "./types";

export const CONDITION_MULTIPLIERS: Record<ConditionRating, number> = {
  excellent: 0.05,
  "very-good": 0.02,
  good: 0.0,
  fair: -0.06,
  "needs-work": -0.16,
};

export function calculateConditionAdjustment(
  condition: ConditionRating,
  baseValue: number
): { conditionMultiplier: number; conditionAdjustment: number } {
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition] ?? 0.0;
  const conditionAdjustment = Math.round(baseValue * conditionMultiplier);

  return { conditionMultiplier, conditionAdjustment };
}
