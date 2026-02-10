/**
 * Sex codes as per ISO/IEC 5218 and EUDI PID Rulebook
 * https://eudi.dev/2.4.0/annexes/annex-3/annex-3.01-pid-rulebook/
 */
const SEX_CODES: Record<number, string> = {
	0: "Not known",
	1: "Male",
	2: "Female",
	3: "Other",
	4: "Inter",
	5: "Diverse",
	6: "Open",
	9: "Not applicable",
};

interface CodedValueProps {
	value: number;
	fieldName: string;
}

/**
 * Renders coded numeric values with their human-readable labels.
 * Returns null if no mapping exists for the field/value combination.
 */
export function CodedValue({
	value,
	fieldName,
}: CodedValueProps): React.ReactElement | null {
	const lowerFieldName = fieldName.toLowerCase();

	// Sex field mapping
	if (lowerFieldName === "sex" || lowerFieldName.endsWith(".sex")) {
		const label = SEX_CODES[value];
		if (label) {
			return (
				<span>
					{label}{" "}
					<span className="text-muted-foreground text-xs">({value})</span>
				</span>
			);
		}
	}

	return null;
}

/**
 * Checks if a field name and value should be rendered as a coded value
 */
export function isCodedValue(fieldName: string, value: unknown): boolean {
	if (typeof value !== "number") return false;

	const lowerFieldName = fieldName.toLowerCase();

	// Sex field with valid code
	if (lowerFieldName === "sex" || lowerFieldName.endsWith(".sex")) {
		return value in SEX_CODES;
	}

	return false;
}
