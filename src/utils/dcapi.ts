import { z } from "zod";
import type {
	DigitalCredentialGetRequest,
	DigitalCredentialGetResponse,
	DigitalCredentialJwtData,
	DigitalCredentialVpTokenData,
} from "@/types/api";

export interface DCAPISupport {
	available: boolean;
	reason?: string;
}

export function checkDCAPISupport(protocol?: string): DCAPISupport {
	if (typeof navigator === "undefined") {
		return { available: false, reason: "Not in browser environment" };
	}

	// https://www.w3.org/TR/digital-credentials/#feature-detection
	if (typeof DigitalCredential === "undefined") {
		return {
			available: false,
			reason: "DigitalCredential interface not available",
		};
	}

	// https://www.w3.org/TR/digital-credentials/#checking-if-protocol-is-allowed
	if (protocol && !DigitalCredential.userAgentAllowsProtocol(protocol)) {
		return {
			available: false,
			reason: `Protocol "${protocol}" not supported by user agent`,
		};
	}

	if (!navigator.credentials) {
		return {
			available: false,
			reason: "Credentials API not available in this browser",
		};
	}

	if (typeof navigator.credentials.get !== "function") {
		return { available: false, reason: "credentials.get() not available" };
	}

	return { available: true };
}

/**
 * Zod schema for Digital Credential response validation
 * Spec: https://www.w3.org/TR/digital-credentials/#the-digitalcredential-interface
 * Spec: https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#appendix-A.4
 */
const digitalCredentialResponseSchema = z.union([
	// Success response with VP token
	z.object({
		protocol: z.string().min(1),
		data: z.object({
			vp_token: z.record(z.string(), z.unknown()),
		}),
	}),
	// Success response with encrypted JWT for dc_api.jwt
	z.object({
		protocol: z.string().min(1),
		data: z.object({
			response: z.string().min(1),
		}),
	}),
	// Error response
	z.object({
		protocol: z.string().min(1),
		data: z.object({
			error: z.string(),
		}),
	}),
]);

export async function invokeDCAPI(
	request: DigitalCredentialGetRequest,
): Promise<DigitalCredentialGetResponse> {
	const support = checkDCAPISupport();
	if (!support.available) {
		throw new Error(support.reason || "DC API not supported");
	}

	const credential = await navigator.credentials.get({
		digital: { requests: [request] },
	} as CredentialRequestOptions);

	if (!credential) {
		throw new Error("Digital credential request returned null");
	}

	// Validate the response structure with Zod
	const result = digitalCredentialResponseSchema.safeParse(credential);

	if (!result.success) {
		throw new Error(`Invalid credential response: ${result.error.message}`, {
			cause: result.error,
		});
	}

	return result.data as DigitalCredentialGetResponse;
}

export function isDigitalCredentialError(
	response: DigitalCredentialGetResponse,
): response is { protocol: string; data: { error: string } } {
	return "error" in response.data;
}

export function isDigitalCredentialJwtResponse(
	response: DigitalCredentialGetResponse,
): response is { protocol: string; data: DigitalCredentialJwtData } {
	return "response" in response.data;
}

export function isDigitalCredentialVpTokenResponse(
	response: DigitalCredentialGetResponse,
): response is {
	protocol: string;
	data: DigitalCredentialVpTokenData;
} {
	return "vp_token" in response.data;
}
