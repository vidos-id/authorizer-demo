import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type {
	CreateAuthorizationRequest,
	DigitalCredentialGetRequest,
} from "@/types/api";
import type {
	CredentialRequestWithId,
	CredentialSet,
	ResponseModeConfig,
	TransactionDataEntry,
} from "@/types/app";
import {
	logDebugError,
	logVidosRequest,
	logVidosResponse,
} from "@/utils/debugEvents";
import { buildAuthorizationRequestBody } from "@/utils/requestBuilder";

interface CreateAuthorizationParams {
	// Either builder params OR raw JSON
	credentialRequests?: CredentialRequestWithId[];
	responseModeConfig?: ResponseModeConfig;
	credentialSets?: CredentialSet[];
	transactionDataEntries?: TransactionDataEntry[];
	rawRequestBody?: unknown; // For JSON mode
}

// Zod schemas for API response validation
const baseResponseSchema = z.object({
	authorizationId: z.string(),
	expiresAt: z.string(),
});

const standardResponseSchema = baseResponseSchema.extend({
	authorizeUrl: z.string().url(),
});

const dcApiResponseSchema = baseResponseSchema.extend({
	digitalCredentialGetRequest: z.custom<DigitalCredentialGetRequest>(),
});

export function useCreateAuthorizationMutation() {
	const authorizationUrl = useAppStore(selectAuthorizerUrl);
	return useMutation({
		mutationKey: ["authorization", "create", authorizationUrl],
		mutationFn: async (params: CreateAuthorizationParams) => {
			if (!authorizationUrl) {
				throw new Error("Authorizer URL is required");
			}

			let body: unknown;
			let responseMode: string | undefined;

			if (params.rawRequestBody) {
				// Raw JSON mode - use directly
				body = params.rawRequestBody;

				// Extract responseMode from raw body for response validation
				if (
					typeof body === "object" &&
					body !== null &&
					"responseMode" in body
				) {
					responseMode = (body as { responseMode: string }).responseMode;
				}
			} else {
				// Builder mode - build from config
				if (
					!params.credentialRequests ||
					params.credentialRequests.length === 0
				) {
					throw new Error("No credential requests configured");
				}
				if (!params.responseModeConfig) {
					throw new Error("Response mode configuration is required");
				}

				body = buildAuthorizationRequestBody(
					params.credentialRequests,
					params.responseModeConfig,
					params.credentialSets,
					params.transactionDataEntries,
				);
				responseMode = params.responseModeConfig.mode;
			}

			const client = createAuthorizerClient(authorizationUrl);
			const endpoint = "/openid4/vp/v1_0/authorizations";
			const startedAt = Date.now();

			logVidosRequest({
				operation: "create_authorization",
				method: "POST",
				endpoint,
				payload: body,
			});

			const { data, error, response } = await client.POST(
				"/openid4/vp/v1_0/authorizations",
				{
					body: body as CreateAuthorizationRequest,
				},
			);

			const durationMs = Date.now() - startedAt;
			const responseStatus = response?.status;
			const responseOk = response?.ok;

			if (error) {
				const requestError = new Error(
					error.message || "Failed to create authorization",
				);
				logVidosResponse({
					operation: "create_authorization",
					method: "POST",
					endpoint,
					httpStatus: responseStatus,
					durationMs,
					ok: false,
					payload: error,
				});
				logDebugError({
					operation: "create_authorization",
					method: "POST",
					endpoint,
					error: requestError,
					httpStatus: responseStatus,
					durationMs,
					payload: error,
				});

				throw requestError;
			}

			logVidosResponse({
				operation: "create_authorization",
				method: "POST",
				endpoint,
				httpStatus: responseStatus,
				durationMs,
				ok: responseOk,
				payload: data,
			});

			if (!data) {
				const noDataError = new Error("No data returned");
				logDebugError({
					operation: "create_authorization",
					method: "POST",
					endpoint,
					error: noDataError,
					httpStatus: responseStatus,
					durationMs,
				});
				throw noDataError;
			}

			// Validate response structure with Zod based on mode
			const isDCAPI =
				responseMode === "dc_api" || responseMode === "dc_api.jwt";

			const schema = isDCAPI ? dcApiResponseSchema : standardResponseSchema;
			const result = schema.safeParse(data);

			if (!result.success) {
				const errors = result.error.issues.map((i) => i.message).join(", ");
				const validationError = new Error(
					`Invalid response structure: ${errors}`,
				);
				logDebugError({
					operation: "create_authorization",
					method: "POST",
					endpoint,
					error: validationError,
					httpStatus: responseStatus,
					durationMs,
					payload: data,
					errorCode: "invalid_response_structure",
				});
				throw validationError;
			}

			return data;
		},
		onMutate: (variables) => {
			// Debug: save request body
			let body: unknown;

			if (variables.rawRequestBody) {
				body = variables.rawRequestBody;
			} else if (variables.credentialRequests && variables.responseModeConfig) {
				body = buildAuthorizationRequestBody(
					variables.credentialRequests,
					variables.responseModeConfig,
					variables.credentialSets,
					variables.transactionDataEntries,
				);
			}

			if (body) {
				useAppStore.getState().setLastRequest(body);
			}
		},
		onSuccess: (data) => {
			const store = useAppStore.getState();

			// Save response data to store
			store.setAuthorizationId(data.authorizationId);
			store.setExpiresAt(data.expiresAt);
			store.setLastResponse(data);

			// Set flow-specific data
			if ("authorizeUrl" in data) {
				store.setAuthorizeUrl(data.authorizeUrl as string);
				store.setDigitalCredentialGetRequest(null);
			} else if ("digitalCredentialGetRequest" in data) {
				store.setDigitalCredentialGetRequest(data.digitalCredentialGetRequest);
				store.setAuthorizeUrl(null);
			}

			// Transition stage: create → authorization
			store.setStage("authorization");
		},
	});
}
