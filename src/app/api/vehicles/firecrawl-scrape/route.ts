import { NextRequest, NextResponse } from "next/server";
import { getFirecrawlStatus } from "@/lib/firecrawl";
import { runFirecrawlScraper } from "@/scripts/scrape-vehicles-firecrawl";

export async function GET() {
  try {
    const status = await getFirecrawlStatus();
    return NextResponse.json({
      success: true,
      firecrawl: status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const category = body.category as "all" | "car" | "bike" | undefined;
    const limit = body.limit ? parseInt(body.limit, 10) : undefined;

    const result = await runFirecrawlScraper({ category, limit });

    return NextResponse.json({
      success: true,
      stats: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
