import { CREDENTIAL_CASES } from "@/config/credential-cases/credential-cases";

/**
 * Converts a string to title case.
 * Handles snake_case, camelCase, and kebab-case.
 *
 * @param str - Input string
 * @returns Title cased string
 */
function toTitleCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
		.replace(/[_-]/g, " ") // snake_case/kebab-case → space separated
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Gets the display name for a claim key.
 *
 * Lookup strategy:
 * 1. Find in CREDENTIAL_CASES by credentialType
 * 2. Match attribute by last segment of path === claimKey
 * 3. Return attr.displayName if found
 * 4. Fallback: convert to title case
 *
 * @param claimKey - The claim key (e.g., "family_name", "birth_date")
 * @param credentialType - The credential type (e.g., "org.iso.18013.5.1.mDL")
 * @param format - The credential format (not used currently, but included for future use)
 * @returns Display name for the claim
 */
export function getClaimDisplayName(
	claimKey: string,
	credentialType: string,
	_format: string,
): string {
	// Search through all credential cases
	for (const credentialCase of CREDENTIAL_CASES) {
		// Search through all formats in this case
		for (const formatDef of credentialCase.formats) {
			// Check if this format matches the credential type
			if (formatDef.credentialType === credentialType) {
				// Search through all attributes
				for (const attr of formatDef.attributes) {
					// Match by last segment of path
					const lastSegment = attr.path[attr.path.length - 1];
					if (lastSegment === claimKey) {
						return attr.displayName;
					}
				}
			}
		}
	}

	// Fallback to title case
	return toTitleCase(claimKey);
}
