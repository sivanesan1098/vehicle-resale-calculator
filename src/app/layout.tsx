import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ResaleMeter India | Used Car & Bike Resale Value Calculator",
  description:
    "Accurately estimate fair resale market value for used cars and two-wheelers in India using ex-showroom history, age depreciation, mileage, condition, ownership, and local RTO taxes.",
  keywords: [
    "car resale value calculator",
    "bike resale value India",
    "used car valuation",
    "vehicle depreciation India",
    "second hand bike price estimate",
    "ex-showroom price history",
    "RTO road tax resale calculator",
  ],
  authors: [{ name: "ResaleMeter" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem("vr-theme");
                const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
                const theme = stored ? stored : (prefersLight ? "light" : "dark");
                document.documentElement.setAttribute("data-theme", theme);
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                  document.documentElement.classList.remove("light");
                } else {
                  document.documentElement.classList.add("light");
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
