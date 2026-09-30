import {
  BatteryCondition,
  InsuranceStatus,
  TyreCondition,
  VehicleCategory,
} from "./types";

export function calculateConsumablesAdjustment(
  tyreCondition: TyreCondition,
  batteryCondition: BatteryCondition,
  insuranceStatus: InsuranceStatus,
  category: VehicleCategory
): {
  tyreDeduction: number;
  batteryDeduction: number;
  insuranceDeduction: number;
  consumablesAdjustment: number;
} {
  const isCar = category === "car";

  let tyreDeduction = 0;
  if (tyreCondition === "due") {
    tyreDeduction = isCar ? -16000 : -4500;
  }

  let batteryDeduction = 0;
  if (batteryCondition === "weak") {
    batteryDeduction = isCar ? -5000 : -1800;
  }

  let insuranceDeduction = 0;
  if (insuranceStatus === "expired") {
    insuranceDeduction = isCar ? -12000 : -2500;
  }

  const consumablesAdjustment =
    tyreDeduction + batteryDeduction + insuranceDeduction;

  return {
    tyreDeduction,
    batteryDeduction,
    insuranceDeduction,
    consumablesAdjustment,
  };
}
