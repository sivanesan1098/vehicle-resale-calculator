export const OWNERSHIP_ADJUSTMENTS: Record<number, number> = {
  1: 0.0,
  2: -0.035,
  3: -0.075,
  4: -0.12,
};

export function calculateOwnershipAdjustment(
  owners: number,
  baseValue: number
): { ownerMultiplier: number; ownerAdjustment: number } {
  const safeOwners = Math.max(1, Math.min(4, Math.floor(owners)));
  const ownerMultiplier = OWNERSHIP_ADJUSTMENTS[safeOwners] ?? -0.12;
  const ownerAdjustment = Math.round(baseValue * ownerMultiplier);

  return { ownerMultiplier, ownerAdjustment };
}
