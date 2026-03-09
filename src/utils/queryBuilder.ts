import {
	getFormatDefinitionById,
	hasSelectivelyDisclosableAttributes,
} from "@/config/credential-cases/utils";
import type {
	CredentialRequestWithId,
	CredentialSet,
	Profile,
} from "@/types/app";

interface DCQLClaim {
	path: (string | null)[];
}

interface DCQLCredential {
	id: string;
	format: string;
	meta?: Record<string, unknown>;
	claims?: DCQLClaim[]; // Optional: undefined when no selectively disclosable attributes
	require_cryptographic_holder_binding: boolean;
}

interface DCQLCredentialSet {
	options: string[][]; // Each option is array of credential IDs
	required?: boolean; // Only include if false (true is default per spec)
}

interface DCQLQuery {
	type: "DCQL";
	dcql: {
		credentials: DCQLCredential[];
		credential_sets?: DCQLCredentialSet[]; // Optional credential sets
	};
}

export function buildDCQLQueryMultiple(
	requests: CredentialRequestWithId[],
	credentialSets?: CredentialSet[],
	profile?: Profile,
): DCQLQuery {
	if (requests.length === 0) {
		throw new Error("At least one credential request is required");
	}

	const credentials: DCQLCredential[] = requests.map((request) => {
		const formatDef = getFormatDefinitionById(request.formatId);
		if (!formatDef) {
			throw new Error(`Unknown format with id ${request.formatId}`);
		}

		const hasSelectiveDisclosure =
			hasSelectivelyDisclosableAttributes(formatDef);

		// Only validate attribute selection for credentials with selectively disclosable attributes
		if (hasSelectiveDisclosure && request.attributes.length === 0) {
			throw new Error(
				"At least one selectively disclosable attribute must be selected",
			);
		}

		const meta: Record<string, unknown> =
			request.format === "dc+sd-jwt"
				? { vct_values: [formatDef.credentialType] }
				: { doctype_value: formatDef.credentialType };

		// Only build claims array for selectively disclosable attributes
		const selectivelyDisclosableAttrs = formatDef.attributes.filter(
			(attr) => !attr.nonSelectivelyDisclosable,
		);
		const claims: DCQLClaim[] = selectivelyDisclosableAttrs
			.filter((attr) => request.attributes.includes(attr.id))
			.map((attr) => ({ path: attr.path }));

		const credential: DCQLCredential = {
			id: request.id, // Use user-provided UUID from CredentialRequestWithId
			format: request.format,
			meta,
			claims: claims.length > 0 ? claims : undefined,
			require_cryptographic_holder_binding:
				profile === "haip"
					? true
					: request.requireCryptographicHolderBinding !== false,
		};

		return credential;
	});

	// Build credential_sets array if sets are configured
	const credential_sets: DCQLCredentialSet[] | undefined =
		credentialSets && credentialSets.length > 0
			? credentialSets.map((set) => {
					const dcqlSet: DCQLCredentialSet = {
						options: set.options,
					};
					// Only include required if false (true is default per spec)
					if (!set.required) {
						dcqlSet.required = false;
					}
					return dcqlSet;
				})
			: undefined;

	return {
		type: "DCQL",
		dcql: {
			credentials,
			...(credential_sets && { credential_sets }),
		},
	};
}
