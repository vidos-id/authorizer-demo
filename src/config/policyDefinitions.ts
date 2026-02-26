export interface PolicyDefinition {
	description: string;
	docsUrl: string;
}

// Policy definitions map: "service.policy" or "policy" (default)
export const policyDefinitions: Record<string, PolicyDefinition> = {
	// Validator service policies
	"validator.credentialQuery": {
		description:
			"Ensures verifiable presentations contain the credentials and data required by credential queries, validating compatibility between requests and submissions across multiple standards",
		docsUrl:
			"https://vidos.id/docs/reference/services/validator/policies/credential-query/",
	},
	"validator.trustedIssuer": {
		description:
			"Validates that credential issuers are trusted by verifying their certificate chains against configured root certificates",
		docsUrl:
			"https://vidos.id/docs/reference/services/validator/policies/trusted-issuer/",
	},
	"validator.transactionData": {
		description:
			"Validates kb-jwt transaction data hashes against expected transaction_data items using OID4VP hash rules",
		docsUrl:
			"https://vidos.id/docs/reference/services/validator/policies/transaction-data/",
	},

	// Authorizer service policies
	"authorizer.validate": {
		description:
			"Validates that credentials and presentations comply with reader policies and requirements in the authorization process",
		docsUrl:
			"https://vidos.id/docs/reference/services/authorizer/policies/validate/",
	},
	"authorizer.verify": {
		description:
			"Verifies credential authenticity, issuer trustworthiness, and cryptographic validity in the authorization workflow",
		docsUrl:
			"https://vidos.id/docs/reference/services/authorizer/policies/verify/",
	},

	// Verifier service policies
	"verifier.notAfter": {
		description:
			"Validates temporal validity by ensuring credentials and presentations have not been used after their expiration date",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/not-after/",
	},
	"verifier.notBefore": {
		description:
			"Validates temporal validity by ensuring credentials and presentations are not used before their effective date",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/not-before/",
	},
	"verifier.proof": {
		description:
			"Validates cryptographic signatures and proofs to ensure credential and presentation authenticity and integrity",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/proof/",
	},
	"verifier.status": {
		description:
			"Verifies whether a credential has been revoked or suspended by checking its status against supported status mechanisms",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/status/",
	},
	"verifier.holderBinding": {
		description:
			"Verifies that a presented credential is bound to the presenting holder when holder binding data is available",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/holder-binding/",
	},

	// Default policies (no service specified)
	format: {
		description:
			"Validates that credentials and presentations conform to supported standards and data structures",
		docsUrl:
			"https://vidos.id/docs/reference/services/verifier/policies/format/",
	},
};

/**
 * Get policy definition by service and policy name.
 * Falls back to policy name only if service-specific definition doesn't exist.
 */
export function getPolicyDefinition(
	policyName: string,
	service?: string,
): PolicyDefinition | undefined {
	const keys = [...(service ? [`${service}.${policyName}`] : []), policyName];

	for (const key of keys) {
		const definition = policyDefinitions[key];
		if (definition) {
			return definition;
		}
	}
}
