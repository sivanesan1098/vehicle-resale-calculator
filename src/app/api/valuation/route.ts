import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateValuation } from "@/lib/valuation";

const ValuationSchema = z.object({
  category: z.enum(["car", "bike"]),
  brand: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().min(1),
  modelYear: z.number().int().min(2000).max(2026),
  historicalExShowroom: z.number().positive(),
  odometer: z.number().nonnegative(),
  owners: z.number().int().min(1).max(10),
  condition: z.enum(["excellent", "very-good", "good", "fair", "needs-work"]),
  serviceHistory: z.enum(["authorized", "partial", "none"]),
  accidentHistory: z.enum([
    "clean",
    "minor-cosmetic",
    "major-mechanical",
    "structural-flood",
  ]),
  tyreCondition: z.enum(["new", "good", "due"]),
  batteryCondition: z.enum(["good", "weak"]),
  insuranceStatus: z.enum(["comprehensive", "third-party", "expired"]),
  stateCode: z.string().min(2),
  rtoCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedInput = ValuationSchema.parse(body);

    const result = calculateValuation(validatedInput);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
