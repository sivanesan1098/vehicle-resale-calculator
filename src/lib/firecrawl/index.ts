/**
 * Firecrawl CLI Wrapper for Vehicle Data Scraping
 * Documentation: https://docs.firecrawl.dev/sdks/cli
 */

import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// Helper to ensure .env is parsed if process.env hasn't loaded it yet
function getApiKey(): string | undefined {
  if (process.env.FIRECRAWL_API_KEY) {
    return process.env.FIRECRAWL_API_KEY;
  }

  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^\s*FIRECRAWL_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match && match[1]) {
        const val = match[1].trim().replace(/^['"]|['"]$/g, "");
        if (val && !val.includes("YOUR_FIRECRAWL_API_KEY_HERE")) {
          return val;
        }
      }
    }
  } catch {
    // Ignore error
  }

  return undefined;
}

export interface FirecrawlStatus {
  isInstalled: boolean;
  isAuthenticated: boolean;
  version?: string;
  creditsRemaining?: number;
  concurrencyLimit?: number;
  rawOutput: string;
  error?: string;
}

export interface FirecrawlScrapeOptions {
  format?: "markdown" | "html" | "rawHtml" | "links" | "json" | "summary";
  onlyMainContent?: boolean;
  waitFor?: number; // ms
  schema?: object;
  schemaFile?: string;
  proxy?: "auto" | "basic";
  timeout?: number; // ms
}

export interface ScrapedVehicleItem {
  name: string;
  category: "car" | "bike";
  brand: string;
  segment?: string;
  priceMin?: number;
  priceMax?: number;
  fuel?: string;
  transmission?: string;
  engineCc?: number;
  variants?: Array<{
    name: string;
    exShowroomPrice: number;
    fuel?: string;
    transmission?: string;
    engineCc?: number;
  }>;
}

/**
 * Checks the status of the local Firecrawl CLI and API key authentication
 * Equivalent to `firecrawl --status`
 */
export async function getFirecrawlStatus(): Promise<FirecrawlStatus> {
  const apiKey = getApiKey();
  const env = { ...process.env };
  if (apiKey) {
    env.FIRECRAWL_API_KEY = apiKey;
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      "npx",
      ["firecrawl", "--status"],
      {
        cwd: process.cwd(),
        env,
        timeout: 15000,
      }
    );

    const out = (stdout || stderr || "").trim();
    const versionMatch = out.match(/firecrawl cli v([0-9.]+)/i);
    const creditsMatch = out.match(/Credits:\s*([\d,]+)/i);
    const concurrencyMatch = out.match(/Concurrency:\s*\d+\/(\d+)/i);
    const isAuthenticated =
      out.includes("Authenticated via") ||
      (creditsMatch !== null && parseInt(creditsMatch[1].replace(/,/g, ""), 10) > 0);

    return {
      isInstalled: true,
      isAuthenticated,
      version: versionMatch ? versionMatch[1] : undefined,
      creditsRemaining: creditsMatch
        ? parseInt(creditsMatch[1].replace(/,/g, ""), 10)
        : undefined,
      concurrencyLimit: concurrencyMatch
        ? parseInt(concurrencyMatch[1], 10)
        : undefined,
      rawOutput: out,
    };
  } catch (error: any) {
    const errText = error?.stdout || error?.stderr || error?.message || "";
    return {
      isInstalled: true,
      isAuthenticated: false,
      rawOutput: errText,
      error: errText.includes("suspicious")
        ? "API key required: Your IP requires a Firecrawl API key. Add it in .env"
        : errText,
    };
  }
}

/**
 * Scrapes a URL using Firecrawl CLI
 * Command: `firecrawl scrape <url> [options]`
 */
export async function scrapeWithFirecrawl(
  url: string,
  options: FirecrawlScrapeOptions = {}
): Promise<{ success: boolean; data?: string; json?: any; error?: string }> {
  const apiKey = getApiKey();
  const env = { ...process.env };
  if (apiKey) {
    env.FIRECRAWL_API_KEY = apiKey;
  }

  const args: string[] = ["firecrawl", "scrape", url];

  if (options.onlyMainContent) {
    args.push("--only-main-content");
  }

  if (options.waitFor) {
    args.push("--wait-for", options.waitFor.toString());
  }

  if (options.proxy) {
    args.push("--proxy", options.proxy);
  }

  if (options.schema) {
    args.push("--format", "json");
    args.push("--schema", JSON.stringify(options.schema));
  } else if (options.format) {
    args.push("--format", options.format);
  }

  if (apiKey) {
    args.push("--api-key", apiKey);
  }

  try {
    const { stdout } = await execFileAsync("npx", args, {
      cwd: process.cwd(),
      env,
      timeout: options.timeout || 60000,
      maxBuffer: 20 * 1024 * 1024, // 20 MB buffer
    });

    if (options.schema || options.format === "json") {
      try {
        const parsed = JSON.parse(stdout);
        return { success: true, json: parsed, data: stdout };
      } catch {
        return { success: true, data: stdout };
      }
    }

    return { success: true, data: stdout };
  } catch (error: any) {
    const message = error?.stderr || error?.stdout || error?.message || "Firecrawl execution error";
    return { success: false, error: message };
  }
}

/**
 * Discovers URLs on a site using Firecrawl Map CLI
 * Command: `firecrawl map <url> --search <term>`
 */
export async function mapWithFirecrawl(
  url: string,
  search?: string,
  limit = 100
): Promise<{ success: boolean; urls: string[]; error?: string }> {
  const apiKey = getApiKey();
  const env = { ...process.env };
  if (apiKey) {
    env.FIRECRAWL_API_KEY = apiKey;
  }

  const args: string[] = ["firecrawl", "map", url, "--limit", limit.toString(), "--json"];
  if (search) {
    args.push("--search", search);
  }
  if (apiKey) {
    args.push("--api-key", apiKey);
  }

  try {
    const { stdout } = await execFileAsync("npx", args, {
      cwd: process.cwd(),
      env,
      timeout: 45000,
    });

    const parsed = JSON.parse(stdout);
    const urls: string[] = Array.isArray(parsed)
      ? parsed
      : parsed?.urls || parsed?.data || [];
    return { success: true, urls };
  } catch (error: any) {
    return {
      success: false,
      urls: [],
      error: error?.stderr || error?.message || "Firecrawl map failed",
    };
  }
}
