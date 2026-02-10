import { CREDENTIAL_CASES } from "@/config/credential-cases/credential-cases";

/**
 * Claim display information with origin annotation.
 */
export interface ClaimDisplayInfo {
	/** Human-readable display name */
	displayName: string;
	/** Original claim key */
	originalKey: string;
	/** Origin of the claim (e.g., "JWT" for standard JWT claims) */
	origin?: string;
}

/**
 * Standard JWT claim mappings.
 */
const JWT_CLAIMS: Record<string, string> = {
	iat: "Issued At",
	exp: "Expires",
	nbf: "Not Before",
	iss: "Issuer",
	sub: "Subject",
	aud: "Audience",
	jti: "JWT ID",
	vct: "Verifiable Credential Type",
};

/**
 * Converts a string to title case.
 * Handles snake_case, camelCase, and kebab-case.
 *
 * @param str - Input string
 * @returns Title cased string
 */
export function toTitleCase(str: string): string {
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
 * 1. Check if it's a standard JWT claim
 * 2. Find in CREDENTIAL_CASES by credentialType
 * 3. Match attribute by last segment of path === claimKey
 * 4. Return attr.displayName if found
 * 5. Fallback: convert to title case
 *
 * @param claimKey - The claim key (e.g., "family_name", "birth_date")
 * @param credentialType - The credential type (e.g., "org.iso.18013.5.1.mDL")
 * @param format - The credential format (not used currently, but included for future use)
 * @returns Claim display information with origin annotation
 */
export function getClaimDisplayName(
	claimKey: string,
	credentialType: string,
	_format: string,
): ClaimDisplayInfo {
	// Check for standard JWT claims
	if (claimKey in JWT_CLAIMS) {
		return {
			displayName: JWT_CLAIMS[claimKey],
			originalKey: claimKey,
			origin: "JWT",
		};
	}

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
						return {
							displayName: attr.displayName,
							originalKey: claimKey,
							origin: "Credential",
						};
					}
				}
			}
		}
	}

	// Fallback to title case
	return {
		displayName: toTitleCase(claimKey),
		originalKey: claimKey,
	};
}
