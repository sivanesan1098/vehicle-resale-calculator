import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(), // e.g. 'hyundai', 'maruti', 'royal-enfield'
  name: text("name").notNull(),
  category: text("category").notNull(), // 'car' | 'bike'
  country: text("country").default("India"),
});

export const models = sqliteTable("models", {
  id: text("id").primaryKey(), // e.g. 'hyundai-i20'
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'car' | 'bike'
  segment: text("segment"), // 'Hatchback', 'SUV', 'Cruiser', etc.
});

export const variants = sqliteTable("variants", {
  id: text("id").primaryKey(), // e.g. 'i20-sportz-petrol-mt'
  modelId: text("model_id")
    .notNull()
    .references(() => models.id),
  name: text("name").notNull(),
  fuel: text("fuel").notNull(), // 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
  transmission: text("transmission").notNull(), // 'Manual' | 'Automatic'
  engineCc: integer("engine_cc"),
});

export const vehiclePrices = sqliteTable("vehicle_prices", {
  id: text("id").primaryKey(), // e.g. 'i20-sportz-2022'
  variantId: text("variant_id")
    .notNull()
    .references(() => variants.id),
  modelYear: integer("model_year").notNull(),
  exShowroomPrice: integer("ex_showroom_price").notNull(),
  source: text("source").default("Historical SIAM OEM Record"),
});

export const rtoRules = sqliteTable("rto_rules", {
  id: text("id").primaryKey(), // e.g. 'TS-09'
  stateCode: text("state_code").notNull(), // 'TS'
  stateName: text("state_name").notNull(), // 'Telangana'
  rtoCode: text("rto_code").notNull(), // 'TS-09'
  cityName: text("city_name").notNull(), // 'Hyderabad (Khairatabad)'
  roadTaxCarPercent: real("road_tax_car_percent").notNull(), // 14.0
  roadTaxBikePercent: real("road_tax_bike_percent").notNull(), // 9.0
  registrationFeeCar: integer("registration_fee_car").default(2500),
  registrationFeeBike: integer("registration_fee_bike").default(950),
});

export const marketComparables = sqliteTable("market_comparables", {
  id: text("id").primaryKey(),
  variantId: text("variant_id")
    .notNull()
    .references(() => variants.id),
  modelYear: integer("model_year").notNull(),
  askingPrice: integer("asking_price").notNull(),
  odometer: integer("odometer").notNull(),
  city: text("city").notNull(),
  source: text("source").default("Aggregated Used Portal Comp"),
});
