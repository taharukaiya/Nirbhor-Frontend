/**
 * Filter Options Dictionary
 * 
 * Architectural Intent:
 * Provides static enumerations for filtering forms across the application.
 * Centralizing these constants ensures consistency between the job posting forms, 
 * search filters, and backend validation logic.
 */
export const SERVICE_CATEGORIES = [
  "All",
  "Electrician",
  "Plumber",
  "Cleaner",
  "Driver",
  "Carpenter",
  "Mechanic",
  "Painter",
  "Cook",
  "Tutor",
];
export const LOCATIONS = [
  "All",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
];
export const JOB_CATEGORIES = SERVICE_CATEGORIES;
export const JOB_LOCATIONS = LOCATIONS;
