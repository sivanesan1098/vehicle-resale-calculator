import { NextRequest, NextResponse } from "next/server";
import { lookupVehicleWithAI } from "@/lib/gemini";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "resalemeter.db");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    const category = (body?.category === "bike" ? "bike" : "car") as "car" | "bike";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Step 1: Check if already exists in SQLite
    const sqlite = new Database(dbPath);
    const existing = sqlite
      .prepare(
        `SELECT m.id as modelId, m.name as modelName, m.brand_id as brandId, b.name as brandName, m.segment
         FROM models m
         JOIN brands b ON m.brand_id = b.id
         WHERE (LOWER(m.name) LIKE ? OR LOWER(b.name || ' ' || m.name) LIKE ?)
           AND m.category = ?
         LIMIT 1`
      )
      .get(`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, category) as any;

    if (existing && !body.forceAI) {
      const variants = sqlite
        .prepare(
          `SELECT v.id, v.name, v.fuel, v.transmission, v.engine_cc as engineCc,
                  (SELECT ex_showroom_price FROM vehicle_prices vp WHERE vp.variant_id = v.id ORDER BY model_year DESC LIMIT 1) as exShowroomPrice
           FROM variants v
           WHERE v.model_id = ?`
        )
        .all(existing.modelId) as any[];

      sqlite.close();

      return NextResponse.json({
        success: true,
        source: "database",
        brand: {
          id: existing.brandId,
          name: existing.brandName,
          category,
        },
        model: {
          id: existing.modelId,
          brandId: existing.brandId,
          name: existing.modelName,
          category,
          segment: existing.segment,
        },
        variants,
      });
    }

    sqlite.close();

    // Step 2: Not in database -> Invoke Gemini AI live lookup & save to DB!
    console.log(`[AI Lookup API] Invoking Gemini AI for query: "${query}" (${category})`);
    const aiResult = await lookupVehicleWithAI(query, category);

    return NextResponse.json({
      success: true,
      ...aiResult,
    });
  } catch (error: any) {
    console.error("[AI Lookup API] Error:", error);
    return NextResponse.json(
      { error: "Failed to perform AI vehicle lookup", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const category = (searchParams.get("category") === "bike" ? "bike" : "car") as "car" | "bike";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const aiResult = await lookupVehicleWithAI(query, category);
  return NextResponse.json({
    success: true,
    ...aiResult,
  });
}
