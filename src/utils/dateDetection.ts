export type DateRenderMode =
	| "date-only"
	| "date-time"
	| "date-with-relative"
	| "date-time-with-relative";

const DATE_PATTERNS = [
	/^\d{4}-\d{2}-\d{2}$/, // ISO date: 2026-01-01
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO datetime: 2026-01-01T13:20:12Z
];

/**
 * Parses a value into a Date object.
 * Handles ISO date strings, ISO datetime strings, and Unix timestamps.
 *
 * @param value - The value to parse
 * @returns Date object if parseable, null otherwise
 */
export function parseDate(value: unknown): Date | null {
	if (value == null) {
		return null;
	}

	// Handle string dates
	if (typeof value === "string") {
		for (const pattern of DATE_PATTERNS) {
			if (pattern.test(value)) {
				const date = new Date(value);
				return Number.isNaN(date.getTime()) ? null : date;
			}
		}
		return null;
	}

	// Handle Unix timestamps (numeric values)
	if (typeof value === "number") {
		const date = new Date(value * 1000); // Convert seconds to milliseconds
		return Number.isNaN(date.getTime()) ? null : date;
	}

	return null;
}

/**
 * Determines if a value is a date value.
 * Checks ISO date patterns and Unix timestamps for specific field names.
 *
 * @param value - The value to check
 * @param fieldName - Optional field name for Unix timestamp detection
 * @returns True if the value is a date
 */
export function isDateValue(value: unknown, fieldName?: string): boolean {
	if (value == null) {
		return false;
	}

	// Check string patterns
	if (typeof value === "string") {
		return DATE_PATTERNS.some((pattern) => pattern.test(value));
	}

	// Check Unix timestamps for known date fields
	if (typeof value === "number" && fieldName) {
		const lowerFieldName = fieldName.toLowerCase();
		const unixTimestampFields = ["iat", "exp", "nbf"];
		return unixTimestampFields.some((field) => lowerFieldName.includes(field));
	}

	return false;
}

/**
 * Determines the render mode for a date field based on its name.
 *
 * @param fieldName - The field name
 * @returns The appropriate render mode for the field
 */
export function getDateRenderMode(fieldName: string): DateRenderMode {
	const lowerFieldName = fieldName.toLowerCase();

	// date-only fields
	if (
		lowerFieldName.includes("birth_date") ||
		lowerFieldName.includes("birthdate") ||
		lowerFieldName.includes("issuance_date") ||
		lowerFieldName.includes("issue_date") ||
		lowerFieldName === "iat"
	) {
		return "date-only";
	}

	// date-with-relative fields
	if (
		lowerFieldName.includes("expiry_date") ||
		lowerFieldName.includes("date_of_expiry") ||
		lowerFieldName === "exp"
	) {
		return "date-with-relative";
	}

	// date-time fields
	if (
		lowerFieldName.includes("effective_from_date") ||
		lowerFieldName === "nbf"
	) {
		return "date-time";
	}

	// date-time-with-relative fields
	if (lowerFieldName.includes("effective_until_date")) {
		return "date-time-with-relative";
	}

	// Default: date-only
	return "date-only";
}
