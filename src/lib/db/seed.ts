import { sqlite, db } from "./index";
import {
  brands,
  models,
  variants,
  vehiclePrices,
  rtoRules,
  marketComparables,
} from "./schema";

/**
 * Initializes the SQLite tables if they don't already exist.
 */
export function initSchema() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      country TEXT DEFAULT 'India'
    );

    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id),
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      segment TEXT
    );

    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      model_id TEXT NOT NULL REFERENCES models(id),
      name TEXT NOT NULL,
      fuel TEXT NOT NULL,
      transmission TEXT NOT NULL,
      engine_cc INTEGER
    );

    CREATE TABLE IF NOT EXISTS vehicle_prices (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL REFERENCES variants(id),
      model_year INTEGER NOT NULL,
      ex_showroom_price INTEGER NOT NULL,
      source TEXT DEFAULT 'Historical SIAM Record'
    );

    CREATE TABLE IF NOT EXISTS rto_rules (
      id TEXT PRIMARY KEY,
      state_code TEXT NOT NULL,
      state_name TEXT NOT NULL,
      rto_code TEXT NOT NULL,
      city_name TEXT NOT NULL,
      road_tax_car_percent REAL NOT NULL,
      road_tax_bike_percent REAL NOT NULL,
      registration_fee_car INTEGER DEFAULT 2500,
      registration_fee_bike INTEGER DEFAULT 950
    );

    CREATE TABLE IF NOT EXISTS market_comparables (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL REFERENCES variants(id),
      model_year INTEGER NOT NULL,
      asking_price INTEGER NOT NULL,
      odometer INTEGER NOT NULL,
      city TEXT NOT NULL,
      source TEXT DEFAULT 'Aggregated Used Portal Comp'
    );
  `);
}

/**
 * Seeds comprehensive realistic Indian vehicle data into SQLite.
 */
export function seedDatabase() {
  initSchema();

  // Check if already seeded
  const existingCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM brands")
    .get() as { count: number };

  if (existingCount && existingCount.count > 0) {
    return { success: true, message: "Database already seeded." };
  }

  // Transaction for high-speed batch insertion
  const seedTransaction = sqlite.transaction(() => {
    // 1. Brands
    const brandData = [
      { id: "hyundai", name: "Hyundai", category: "car" },
      { id: "maruti", name: "Maruti Suzuki", category: "car" },
      { id: "tata", name: "Tata Motors", category: "car" },
      { id: "mahindra", name: "Mahindra", category: "car" },
      { id: "honda-cars", name: "Honda", category: "car" },
      { id: "toyota", name: "Toyota", category: "car" },
      { id: "royal-enfield", name: "Royal Enfield", category: "bike" },
      { id: "tvs", name: "TVS", category: "bike" },
      { id: "bajaj", name: "Bajaj", category: "bike" },
      { id: "honda-2w", name: "Honda 2-Wheelers", category: "bike" },
      { id: "yamaha", name: "Yamaha", category: "bike" },
    ];

    for (const b of brandData) {
      sqlite
        .prepare(
          "INSERT OR REPLACE INTO brands (id, name, category) VALUES (?, ?, ?)"
        )
        .run(b.id, b.name, b.category);
    }

    // 2. Models
    const modelData = [
      // Cars
      { id: "hyundai-i20", brandId: "hyundai", name: "i20", category: "car", segment: "Premium Hatchback" },
      { id: "hyundai-creta", brandId: "hyundai", name: "Creta", category: "car", segment: "Midsize SUV" },
      { id: "maruti-swift", brandId: "maruti", name: "Swift", category: "car", segment: "Compact Hatchback" },
      { id: "maruti-baleno", brandId: "maruti", name: "Baleno", category: "car", segment: "Premium Hatchback" },
      { id: "maruti-brezza", brandId: "maruti", name: "Brezza", category: "car", segment: "Compact SUV" },
      { id: "tata-nexon", brandId: "tata", name: "Nexon", category: "car", segment: "Compact SUV" },
      { id: "tata-punch", brandId: "tata", name: "Punch", category: "car", segment: "Micro SUV" },
      { id: "mahindra-thar", brandId: "mahindra", name: "Thar", category: "car", segment: "Lifestyle 4x4 SUV" },
      { id: "mahindra-xuv700", brandId: "mahindra", name: "XUV700", category: "car", segment: "Fullsize SUV" },
      { id: "honda-city", brandId: "honda-cars", name: "City", category: "car", segment: "Sedan" },
      // Bikes
      { id: "re-classic-350", brandId: "royal-enfield", name: "Classic 350", category: "bike", segment: "Modern Classic" },
      { id: "re-hunter-350", brandId: "royal-enfield", name: "Hunter 350", category: "bike", segment: "Roadster" },
      { id: "tvs-apache-160", brandId: "tvs", name: "Apache RTR 160 4V", category: "bike", segment: "Naked Sport" },
      { id: "tvs-jupiter", brandId: "tvs", name: "Jupiter 125", category: "bike", segment: "Family Scooter" },
      { id: "bajaj-pulsar-ns200", brandId: "bajaj", name: "Pulsar NS200", category: "bike", segment: "Performance Sport" },
      { id: "honda-activa", brandId: "honda-2w", name: "Activa 6G", category: "bike", segment: "Scooter" },
      { id: "yamaha-r15", brandId: "yamaha", name: "YZF R15 V4", category: "bike", segment: "Track Supersport" },
    ];

    for (const m of modelData) {
      sqlite
        .prepare(
          "INSERT OR REPLACE INTO models (id, brand_id, name, category, segment) VALUES (?, ?, ?, ?, ?)"
        )
        .run(m.id, m.brandId, m.name, m.category, m.segment);
    }

    // 3. Variants
    const variantData = [
      // i20
      { id: "i20-magna-petrol-mt", modelId: "hyundai-i20", name: "Magna 1.2 Petrol MT", fuel: "Petrol", transmission: "Manual", engineCc: 1197 },
      { id: "i20-sportz-petrol-mt", modelId: "hyundai-i20", name: "Sportz 1.2 Petrol MT", fuel: "Petrol", transmission: "Manual", engineCc: 1197 },
      { id: "i20-asta-petrol-ivt", modelId: "hyundai-i20", name: "Asta (O) 1.2 Petrol IVT (Auto)", fuel: "Petrol", transmission: "Automatic", engineCc: 1197 },
      // Swift
      { id: "swift-vxi-petrol-mt", modelId: "maruti-swift", name: "VXi 1.2 Petrol MT", fuel: "Petrol", transmission: "Manual", engineCc: 1197 },
      { id: "swift-zxi-amt", modelId: "maruti-swift", name: "ZXi 1.2 Petrol AMT (Auto)", fuel: "Petrol", transmission: "Automatic", engineCc: 1197 },
      { id: "swift-vxi-cng", modelId: "maruti-swift", name: "VXi CNG Manual", fuel: "CNG", transmission: "Manual", engineCc: 1197 },
      // Nexon
      { id: "nexon-creative-petrol-mt", modelId: "tata-nexon", name: "Creative 1.2 Turbo Petrol MT", fuel: "Petrol", transmission: "Manual", engineCc: 1199 },
      { id: "nexon-fearless-diesel-amt", modelId: "tata-nexon", name: "Fearless+ 1.5 Diesel AMT", fuel: "Diesel", transmission: "Automatic", engineCc: 1497 },
      // Thar
      { id: "thar-lx-diesel-at-4x4", modelId: "mahindra-thar", name: "LX Hard Top Diesel AT 4x4", fuel: "Diesel", transmission: "Automatic", engineCc: 2184 },
      { id: "thar-lx-petrol-at-rwd", modelId: "mahindra-thar", name: "LX Hard Top Petrol AT RWD", fuel: "Petrol", transmission: "Automatic", engineCc: 1997 },
      // Honda City
      { id: "city-vx-petrol-cvt", modelId: "honda-city", name: "VX 1.5 i-VTEC CVT", fuel: "Petrol", transmission: "Automatic", engineCc: 1498 },
      // Classic 350
      { id: "re-classic-350-signals", modelId: "re-classic-350", name: "Signals Edition Dual ABS", fuel: "Petrol", transmission: "Manual", engineCc: 349 },
      { id: "re-classic-350-halcyon", modelId: "re-classic-350", name: "Halcyon Series Dual Channel", fuel: "Petrol", transmission: "Manual", engineCc: 349 },
      // TVS Apache
      { id: "apache-rtr-160-special", modelId: "tvs-apache-160", name: "Special Edition Dual Disc ABS", fuel: "Petrol", transmission: "Manual", engineCc: 159 },
      // Activa
      { id: "activa-6g-dlx", modelId: "honda-activa", name: "Deluxe Smart Key", fuel: "Petrol", transmission: "Automatic", engineCc: 109 },
    ];

    for (const v of variantData) {
      sqlite
        .prepare(
          "INSERT OR REPLACE INTO variants (id, model_id, name, fuel, transmission, engine_cc) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .run(v.id, v.modelId, v.name, v.fuel, v.transmission, v.engineCc);
    }

    // 4. Historical Ex-Showroom Prices (2017 to 2024)
    const priceRecords = [
      // i20 Sportz
      { variantId: "i20-sportz-petrol-mt", year: 2018, price: 620000 },
      { variantId: "i20-sportz-petrol-mt", year: 2019, price: 670000 },
      { variantId: "i20-sportz-petrol-mt", year: 2020, price: 730000 },
      { variantId: "i20-sportz-petrol-mt", year: 2021, price: 759000 },
      { variantId: "i20-sportz-petrol-mt", year: 2022, price: 805000 },
      { variantId: "i20-sportz-petrol-mt", year: 2023, price: 838000 },
      { variantId: "i20-sportz-petrol-mt", year: 2024, price: 872000 },
      // Swift VXi
      { variantId: "swift-vxi-petrol-mt", year: 2017, price: 535000 },
      { variantId: "swift-vxi-petrol-mt", year: 2018, price: 575000 },
      { variantId: "swift-vxi-petrol-mt", year: 2019, price: 610000 },
      { variantId: "swift-vxi-petrol-mt", year: 2020, price: 645000 },
      { variantId: "swift-vxi-petrol-mt", year: 2021, price: 675000 },
      { variantId: "swift-vxi-petrol-mt", year: 2022, price: 695000 },
      { variantId: "swift-vxi-petrol-mt", year: 2023, price: 725000 },
      { variantId: "swift-vxi-petrol-mt", year: 2024, price: 760000 },
      // Thar LX 4x4
      { variantId: "thar-lx-diesel-at-4x4", year: 2020, price: 1375000 },
      { variantId: "thar-lx-diesel-at-4x4", year: 2021, price: 1490000 },
      { variantId: "thar-lx-diesel-at-4x4", year: 2022, price: 1590000 },
      { variantId: "thar-lx-diesel-at-4x4", year: 2023, price: 1680000 },
      { variantId: "thar-lx-diesel-at-4x4", year: 2024, price: 1760000 },
      // RE Classic 350 Signals
      { variantId: "re-classic-350-signals", year: 2017, price: 142000 },
      { variantId: "re-classic-350-signals", year: 2018, price: 158000 },
      { variantId: "re-classic-350-signals", year: 2019, price: 168000 },
      { variantId: "re-classic-350-signals", year: 2020, price: 178000 },
      { variantId: "re-classic-350-signals", year: 2021, price: 198000 },
      { variantId: "re-classic-350-signals", year: 2022, price: 213000 },
      { variantId: "re-classic-350-signals", year: 2023, price: 219000 },
      { variantId: "re-classic-350-signals", year: 2024, price: 225000 },
    ];

    for (const p of priceRecords) {
      const id = `${p.variantId}-${p.year}`;
      sqlite
        .prepare(
          "INSERT OR REPLACE INTO vehicle_prices (id, variant_id, model_year, ex_showroom_price) VALUES (?, ?, ?, ?)"
        )
        .run(id, p.variantId, p.year, p.price);
    }

    // 5. State RTO Rules
    const rtoData = [
      { id: "TS-09", stateCode: "TS", stateName: "Telangana", rtoCode: "TS-09", cityName: "Hyderabad (Khairatabad)", roadTaxCar: 14.0, roadTaxBike: 9.0 },
      { id: "TS-07", stateCode: "TS", stateName: "Telangana", rtoCode: "TS-07", cityName: "Gachibowli / Ranga Reddy", roadTaxCar: 14.0, roadTaxBike: 9.0 },
      { id: "KA-01", stateCode: "KA", stateName: "Karnataka", rtoCode: "KA-01", cityName: "Bangalore Central (Koramangala)", roadTaxCar: 18.0, roadTaxBike: 12.0 },
      { id: "KA-03", stateCode: "KA", stateName: "Karnataka", rtoCode: "KA-03", cityName: "Bangalore East (Indiranagar)", roadTaxCar: 18.0, roadTaxBike: 12.0 },
      { id: "MH-01", stateCode: "MH", stateName: "Maharashtra", rtoCode: "MH-01", cityName: "Mumbai South (Tardeo)", roadTaxCar: 13.0, roadTaxBike: 10.0 },
      { id: "MH-02", stateCode: "MH", stateName: "Maharashtra", rtoCode: "MH-02", cityName: "Mumbai West (Andheri)", roadTaxCar: 13.0, roadTaxBike: 10.0 },
      { id: "MH-12", stateCode: "MH", stateName: "Maharashtra", rtoCode: "MH-12", cityName: "Pune Central", roadTaxCar: 13.0, roadTaxBike: 10.0 },
      { id: "DL-01", stateCode: "DL", stateName: "Delhi NCR", rtoCode: "DL-01", cityName: "Delhi North (Mall Road)", roadTaxCar: 10.0, roadTaxBike: 7.0 },
      { id: "DL-03", stateCode: "DL", stateName: "Delhi NCR", rtoCode: "DL-03", cityName: "Delhi South (Sheikh Sarai)", roadTaxCar: 10.0, roadTaxBike: 7.0 },
      { id: "TN-01", stateCode: "TN", stateName: "Tamil Nadu", rtoCode: "TN-01", cityName: "Chennai Central", roadTaxCar: 15.0, roadTaxBike: 9.0 },
      { id: "KL-07", stateCode: "KL", stateName: "Kerala", rtoCode: "KL-07", cityName: "Kochi / Ernakulam", roadTaxCar: 15.0, roadTaxBike: 10.0 },
      { id: "GJ-01", stateCode: "GJ", stateName: "Gujarat", rtoCode: "GJ-01", cityName: "Ahmedabad West", roadTaxCar: 8.0, roadTaxBike: 6.0 },
    ];

    for (const r of rtoData) {
      sqlite
        .prepare(
          "INSERT OR REPLACE INTO rto_rules (id, state_code, state_name, rto_code, city_name, road_tax_car_percent, road_tax_bike_percent) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .run(r.id, r.stateCode, r.stateName, r.rtoCode, r.cityName, r.roadTaxCar, r.roadTaxBike);
    }
  });

  seedTransaction();
  return { success: true, message: "SQLite database seeded successfully." };
}
