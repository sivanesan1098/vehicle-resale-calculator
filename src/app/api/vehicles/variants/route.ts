import { NextRequest, NextResponse } from "next/server";
import { getVehicleDataProvider } from "@/lib/data-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get("modelId");

    if (!modelId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: modelId" },
        { status: 400 }
      );
    }

    const provider = getVehicleDataProvider();
    const variants = await provider.getVariants(modelId);

    return NextResponse.json({ success: true, count: variants.length, data: variants });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
