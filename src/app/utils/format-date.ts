import { format, parseISO } from "date-fns";

/**
 * Converts an ISO date string (e.g., "2025-04-16") to a human-readable US format (e.g., "April 16, 2025")
 * @param isoDate - Date string in ISO format (YYYY-MM-DD)
 * @returns Formatted date string
 */
export function formatToUSDate(isoDate: string): string {
  try {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "MMMM d, yyyy");
  } catch {
    return isoDate; // fallback in case of bad input
  }
}
