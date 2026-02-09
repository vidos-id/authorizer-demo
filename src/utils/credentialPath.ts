export interface PathSegment {
	label: string;
	value: string;
}

/**
 * Interprets a credential path and returns semantic breadcrumb segments.
 *
 * Format detection rules:
 * - If format contains "mdoc" → mdoc pattern
 * - If format contains "sd-jwt" or "dc" → SD-JWT pattern
 * - Else → fallback pattern
 *
 * @param path - Array of path components [dcqlId, vpIndex, ...]
 * @param format - Credential format string
 * @returns Array of breadcrumb segments with label and value
 */
export function interpretCredentialPath(
	path: (string | number)[],
	format: string,
): PathSegment[] {
	if (path.length < 2) {
		return [];
	}

	const [dcqlId, vpIndex, ...rest] = path;
	const segments: PathSegment[] = [
		{ label: "Credential", value: String(dcqlId) },
		{ label: "VP Token", value: String(Number(vpIndex) + 1) },
	];

	const formatLower = format.toLowerCase();

	// mdoc pattern: [dcqlId, vpIndex, docIndex, namespace]
	if (formatLower.includes("mdoc")) {
		if (rest.length >= 1) {
			const docIndex = rest[0];
			segments.push({
				label: "Document",
				value: String(Number(docIndex) + 1),
			});
		}
		if (rest.length >= 2) {
			const namespace = rest[1];
			segments.push({
				label: String(namespace),
				value: String(namespace),
			});
		}
		return segments;
	}

	// SD-JWT pattern: [dcqlId, vpIndex]
	if (formatLower.includes("sd-jwt") || formatLower.includes("dc")) {
		return segments;
	}

	// Fallback pattern: [dcqlId, vpIndex, ...rest]
	for (let i = 0; i < rest.length; i++) {
		segments.push({
			label: `Segment ${i + 3}`,
			value: String(rest[i]),
		});
	}

	return segments;
}
