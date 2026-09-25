/**
 * Number Utility Functions
 * 
 * Architectural Intent:
 * Provides safe, robust parsing of numeric values, particularly for financial or form data 
 * where inputs might accidentally contain string formatting (e.g., "$5,000").
 */
export function parseAmount(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  
  // Remove all non-numeric characters except the decimal point
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
