import { z } from "zod";
import type {
	CredentialRequestWithId,
	CredentialSet,
	ResponseModeConfig,
	TransactionDataEntry,
} from "@/types/app";
import { validateTransactionDataEntries } from "@/utils/transactionData";

export interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings?: string[];
}

// Zod schema for credential request validation
const credentialRequestSchema = z.object({
	id: z.string(),
	documentType: z.string().min(1, "Document type is required"),
	formatId: z.string().min(1, "Format is required"),
	attributes: z.array(z.string()),
});

// Zod schema for DC API response mode config
const dcApiResponseModeSchema = z.union([
	z.literal("dc_api"),
	z.literal("dc_api.jwt"),
]);

/**
 * Validate credential sets according to DCQL requirements
 * Task 5: Validation for credential set DCQL feature
 */
export function validateCredentialSets(
	credentialRequests: CredentialRequestWithId[],
	credentialSets: CredentialSet[],
): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Task 5.1: Validate credential ID uniqueness (warn on duplicate, don't block)
	const idCounts = new Map<string, number>();
	for (const req of credentialRequests) {
		idCounts.set(req.id, (idCounts.get(req.id) || 0) + 1);
	}
	for (const [id, count] of idCounts.entries()) {
		if (count > 1) {
			warnings.push(`Duplicate credential ID "${id}" found ${count} times`);
		}
	}

	// Get set of all valid credential IDs for reference checking
	const validCredentialIds = new Set(credentialRequests.map((req) => req.id));

	// Validate each credential set
	for (const set of credentialSets) {
		// Task 5.3 & 5.5: Validate at least one option per credential set (if sets defined)
		if (set.options.length === 0) {
			errors.push(
				`Credential set "${set.id}" has no options. Add at least one option or remove the set.`,
			);
			continue; // Skip further validation for this set
		}

		// Validate each option
		for (const [optionIndex, option] of set.options.entries()) {
			// Task 5.4: Validate each option has at least one credential selected
			if (option.length === 0) {
				errors.push(
					`Credential set "${set.id}", option ${optionIndex + 1} is empty. Select at least one credential or remove the option.`,
				);
			}

			// Task 5.2: Validate all option references in credential sets exist in credential requests
			for (const credId of option) {
				if (!validCredentialIds.has(credId)) {
					errors.push(
						`Credential set "${set.id}", option ${optionIndex + 1} references non-existent credential ID "${credId}"`,
					);
				}
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

export function validateAuthorizationRequest(
	authorizerUrl: string,
	credentialRequests: CredentialRequestWithId[],
	responseModeConfig: ResponseModeConfig,
	credentialSets?: CredentialSet[],
	transactionDataEntries?: TransactionDataEntry[],
): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Validate authorizer URL
	const validUrl = z.url().safeParse(authorizerUrl);
	if (!validUrl.success) {
		errors.push(
			`Authorizer URL is required to be valid URL. ${validUrl.error.message}`,
		);
	}

	// Validate at least one credential request
	if (credentialRequests.length === 0) {
		errors.push("At least one credential request is required");
	}

	// Validate each credential request with Zod
	for (const [index, request] of credentialRequests.entries()) {
		const result = credentialRequestSchema.safeParse(request);
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors.push(`Credential ${index + 1}: ${issue.message}`);
			}
		}
	}

	// Validate DC API configuration
	const isDCAPIMode = dcApiResponseModeSchema.safeParse(
		responseModeConfig.mode,
	);
	if (isDCAPIMode.success && !responseModeConfig.dcApiProtocol) {
		errors.push("DC API protocol must be selected");
	}

	// Validate HAIP profile constraints
	if (responseModeConfig.profile === "haip") {
		const haipAllowedModes: string[] = ["direct_post.jwt", "dc_api.jwt"];
		if (!haipAllowedModes.includes(responseModeConfig.mode)) {
			errors.push(
				"HAIP profile requires signed response mode (direct_post.jwt or dc_api.jwt)",
			);
		}
	}

	// Validate credential sets if provided
	if (credentialSets && credentialSets.length > 0) {
		const setsValidation = validateCredentialSets(
			credentialRequests,
			credentialSets,
		);
		errors.push(...setsValidation.errors);
		if (setsValidation.warnings) {
			warnings.push(...setsValidation.warnings);
		}
	}

	if (transactionDataEntries && transactionDataEntries.length > 0) {
		const transactionDataValidation = validateTransactionDataEntries(
			transactionDataEntries,
			new Set(credentialRequests.map((request) => request.id)),
		);
		errors.push(...transactionDataValidation.errors);
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}
