import { NextRequest, NextResponse } from "next/server";
import { getVehicleDataProvider } from "@/lib/data-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as "car" | "bike" | null;

    const provider = getVehicleDataProvider();
    const brands = await provider.getBrands(category || undefined);

    return NextResponse.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
