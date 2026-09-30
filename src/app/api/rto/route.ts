import { NextRequest, NextResponse } from "next/server";
import { getVehicleDataProvider } from "@/lib/data-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get("stateCode");

    const provider = getVehicleDataProvider();
    const rules = await provider.getRTORules(stateCode || undefined);

    return NextResponse.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
