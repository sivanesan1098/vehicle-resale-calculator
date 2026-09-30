import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn / 21st class name combiner
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into full Indian Rupee currency string
 * e.g. 425000 -> "₹4,25,000"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number into Indian Lakhs / Crores string
 * e.g. 425000 -> "₹4.25 Lakh", 12000000 -> "₹1.20 Cr"
 */
export function formatLakhs(amount: number, digits: number = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(digits)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk.toFixed(digits)} Lakh`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k.toFixed(1)}k`;
  }
  return formatINR(amount);
}

/**
 * Formats compact Indian currency representation
 * e.g. 425000 -> "₹4.25L", 12000000 -> "₹1.20Cr"
 */
export function formatCompactINR(amount: number, digits: number = 2): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(digits)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(digits)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
}

/**
 * Formats kilometers with Indian commas
 * e.g. 42000 -> "42,000 km"
 */
export function formatKm(km: number): string {
  if (isNaN(km) || km === null || km === undefined) return "0 km";
  return `${new Intl.NumberFormat("en-IN").format(km)} km`;
}

/**
 * Clamp helper for sliders and ranges
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
