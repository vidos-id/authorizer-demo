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

	return <span>{String(value)}</span>;
}
