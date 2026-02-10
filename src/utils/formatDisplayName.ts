/**
 * Maps technical credential format strings to human-readable display names.
 *
 * @param format - The technical format string (e.g., "dc+sd-jwt", "mso_mdoc")
 * @returns Human-readable format name
 */
export function getFormatDisplayName(format: string): string {
	const formatMap: Record<string, string> = {
		"dc+sd-jwt": "SD-JWT (DC)",
		"ietf.dc-sd-jwt": "SD-JWT (DC)",
		mso_mdoc: "Mobile Document (mdoc)",
		mdoc: "Mobile Document (mdoc)",
	};

	return formatMap[format] || format;
}
