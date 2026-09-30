import { describe, it } from "node:test";
import assert from "node:assert";
import Database from "better-sqlite3";
import path from "path";
import { getFirecrawlStatus } from "../index";

describe("Firecrawl CLI Integration Tests", () => {
  it("detects local Firecrawl CLI installation", async () => {
    const status = await getFirecrawlStatus();
    assert.strictEqual(status.isInstalled, true);
    assert.ok(typeof status.rawOutput === "string");
  });

  it("verifies SQLite contains both car and bike data ingested via Firecrawl", () => {
    const dbPath = path.join(process.cwd(), "data", "resalemeter.db");
    const sqlite = new Database(dbPath);

    // Verify brands
    const carBrands = sqlite
      .prepare("SELECT count(*) as count FROM brands WHERE category = 'car'")
      .get() as { count: number };
    const bikeBrands = sqlite
      .prepare("SELECT count(*) as count FROM brands WHERE category = 'bike'")
      .get() as { count: number };

    assert.ok(carBrands.count >= 4, "Should have multiple car brands");
    assert.ok(bikeBrands.count >= 5, "Should have multiple bike brands");

    // Verify bike models
    const bikeModels = sqlite
      .prepare("SELECT name FROM models WHERE category = 'bike'")
      .all() as Array<{ name: string }>;
    const modelNames = bikeModels.map((m) => m.name);

    assert.ok(
      modelNames.includes("Classic 350"),
      "Should include Royal Enfield Classic 350"
    );
    assert.ok(
      modelNames.includes("Apache RTR 160 4V"),
      "Should include TVS Apache RTR 160 4V"
    );
    assert.ok(
      modelNames.includes("Pulsar NS200"),
      "Should include Bajaj Pulsar NS200"
    );
    assert.ok(
      modelNames.includes("Activa 6G"),
      "Should include Honda Activa 6G"
    );

    // Verify historical prices seeded
    const pricesCount = sqlite
      .prepare("SELECT count(*) as count FROM vehicle_prices")
      .get() as { count: number };
    assert.ok(
      pricesCount.count > 1000,
      "Should have over 1,000 historical price records"
    );
  });
});
