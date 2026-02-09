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

// Field name patterns grouped by render mode
const DATE_ONLY_PATTERNS = new Set([
	"birth_date",
	"birthdate",
	"issuance_date",
	"issue_date",
	"iat",
]);

const DATE_WITH_RELATIVE_PATTERNS = new Set([
	"expiry_date",
	"date_of_expiry",
	"exp",
]);

const DATE_TIME_PATTERNS = new Set(["effective_from_date", "nbf"]);

const DATE_TIME_WITH_RELATIVE_PATTERNS = new Set(["effective_until_date"]);

function matchesAnyPattern(fieldName: string, patterns: Set<string>): boolean {
	for (const pattern of patterns) {
		if (fieldName === pattern || fieldName.includes(pattern)) {
			return true;
		}
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

	if (matchesAnyPattern(lowerFieldName, DATE_ONLY_PATTERNS)) {
		return "date-only";
	}

	if (matchesAnyPattern(lowerFieldName, DATE_WITH_RELATIVE_PATTERNS)) {
		return "date-with-relative";
	}

	if (matchesAnyPattern(lowerFieldName, DATE_TIME_PATTERNS)) {
		return "date-time";
	}

	if (matchesAnyPattern(lowerFieldName, DATE_TIME_WITH_RELATIVE_PATTERNS)) {
		return "date-time-with-relative";
	}

	// Default: date-only
	return "date-only";
}
