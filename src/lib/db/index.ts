import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Ensure data folder exists
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "resalemeter.db");

// Global singleton for Next.js HMR
const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

export const sqlite =
  globalForDb.sqlite ??
  new Database(dbPath, {
    // verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
  });

// Enable SQLite WAL mode for concurrency and speed
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
