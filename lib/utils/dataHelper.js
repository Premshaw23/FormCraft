// lib/utils/dateHelpers.js
import { format } from "date-fns";

/**
 * Safely formats a date from Firebase timestamp or string
 * @param {*} date - Firebase timestamp, Date object, or string
 * @param {string} formatStr - Format string for date-fns
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date or fallback
 */
export function formatDate(
  date,
  formatStr = "MMM d, yyyy",
  fallback = "recently"
) {
  if (!date) return fallback;

  try {
    let dateObj;

    // Firebase Timestamp object (has toDate method)
    if (date && typeof date.toDate === "function") {
      dateObj = date.toDate();
    }
    // String or number
    else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    }
    // Already a Date object
    else if (date instanceof Date) {
      dateObj = date;
    }
    // Unknown format
    else {
      return fallback;
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return fallback;
    }

    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallback;
  }
}

/**
 * Formats a relative time (e.g., "2 hours ago", "3 days ago")
 * @param {*} date - Firebase timestamp, Date object, or string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return "recently";

  try {
    let dateObj;

    if (date && typeof date.toDate === "function") {
      dateObj = date.toDate();
    } else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return "recently";
    }

    if (isNaN(dateObj.getTime())) {
      return "recently";
    }

    const now = new Date();
    const diffMs = now - dateObj;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) {
      return "just now";
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "recently";
  }
}

/**
 * Checks if a date is valid
 * @param {*} date - Any date value
 * @returns {boolean} True if valid date
 */
export function isValidDate(date) {
  try {
    let dateObj;

    if (date && typeof date.toDate === "function") {
      dateObj = date.toDate();
    } else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return false;
    }

    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}
