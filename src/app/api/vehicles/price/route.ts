import { NextRequest, NextResponse } from "next/server";
import { getVehicleDataProvider } from "@/lib/data-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get("variantId");
    const yearStr = searchParams.get("year");

    if (!variantId || !yearStr) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: variantId, year" },
        { status: 400 }
      );
    }

    const year = parseInt(yearStr, 10);
    const provider = getVehicleDataProvider();
    const price = await provider.getHistoricalPrice(variantId, year);

    return NextResponse.json({
      success: true,
      variantId,
      modelYear: year,
      exShowroomPrice: price,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
