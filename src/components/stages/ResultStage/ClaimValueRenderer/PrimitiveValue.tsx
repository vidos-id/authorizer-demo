interface PrimitiveValueProps {
	value: string | number | boolean | null | undefined;
	fieldName?: string;
}

/**
 * Field names that represent years and should not have locale formatting (no commas)
 */
const YEAR_FIELD_PATTERNS = new Set([
	"age_birth_year",
	"birth_year",
	"year",
	"issuance_year",
	"expiry_year",
]);

/**
 * Checks if a field represents a year value based on field name
 */
function isYearField(fieldName: string | undefined): boolean {
	if (!fieldName) return false;
	const lowerFieldName = fieldName.toLowerCase();
	return YEAR_FIELD_PATTERNS.has(lowerFieldName);
}

/**
 * Checks if a number looks like a plausible year (e.g., 1900-2100)
 */
function looksLikeYear(value: number): boolean {
	return Number.isInteger(value) && value >= 1900 && value <= 2100;
}

/**
 * Checks if a string contains long unbreakable sequences (base64, non-breaking spaces, etc.)
 * that need aggressive word-breaking to prevent overflow.
 */
function hasLongUnbreakableContent(value: string): boolean {
	if (value.length < 40) return false;
	// Contains non-breaking spaces
	if (/\u00a0/.test(value)) return true;
	// Looks like base64 or other long encoded content (no regular spaces)
	if (value.length > 60 && !/\s/.test(value)) return true;
	return false;
}

export function PrimitiveValue({ value, fieldName }: PrimitiveValueProps) {
	if (value === null || value === undefined) {
		return <span className="text-muted-foreground">-</span>;
	}

	if (typeof value === "boolean") {
		return <span>{value ? "Yes" : "No"}</span>;
	}

	if (typeof value === "number") {
		// Don't use locale formatting for year fields to avoid "1,971" for 1971
		if (isYearField(fieldName) || looksLikeYear(value)) {
			return <span>{value}</span>;
		}
		return <span>{value.toLocaleString()}</span>;
	}

	const str = String(value);
	if (hasLongUnbreakableContent(str)) {
		return <span className="break-all [word-break:break-all]">{str}</span>;
	}

	return <span>{str}</span>;
}
