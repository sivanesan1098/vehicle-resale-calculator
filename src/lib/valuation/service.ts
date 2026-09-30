import { ServiceHistory } from "./types";

export const SERVICE_ADJUSTMENTS: Record<ServiceHistory, number> = {
  authorized: 0.03,
  partial: 0.0,
  none: -0.045,
};

export function calculateServiceAdjustment(
  serviceHistory: ServiceHistory,
  baseValue: number
): { serviceMultiplier: number; serviceAdjustment: number } {
  const serviceMultiplier = SERVICE_ADJUSTMENTS[serviceHistory] ?? 0.0;
  const serviceAdjustment = Math.round(baseValue * serviceMultiplier);

  return { serviceMultiplier, serviceAdjustment };
}
