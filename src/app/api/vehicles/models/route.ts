import { NextRequest, NextResponse } from "next/server";
import { getVehicleDataProvider } from "@/lib/data-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId") || undefined;
    const category = (searchParams.get("category") as "car" | "bike") || undefined;

    const provider = getVehicleDataProvider();
    const models = await provider.getModels(brandId, category);

    return NextResponse.json({ success: true, count: models.length, data: models });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
