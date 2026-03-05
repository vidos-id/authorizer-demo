import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { authorizationKeys } from "@/queries/keys";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type {
	DcApiResponse,
	DigitalCredentialGetRequest,
	DigitalCredentialJwtData,
	DigitalCredentialVpTokenData,
} from "@/types/api";
import {
	checkDCAPISupport,
	invokeDCAPI,
	isDigitalCredentialError,
	isDigitalCredentialJwtResponse,
	isDigitalCredentialVpTokenResponse,
} from "@/utils/dcapi";

export function useDCAPIMutation() {
	const authorizerUrl = useAppStore(selectAuthorizerUrl);
	const authorizationId = useAppStore((state) => state.authorizationId);
	const responseModeConfig = useAppStore((state) => state.responseModeConfig);
	const queryClient = useQueryClient();

	return useMutation({
		retry: false,
		mutationFn: async (
			digitalCredentialGetRequest: DigitalCredentialGetRequest,
		) => {
			if (!authorizationId) {
				throw new Error("Configuration error: Missing authorization ID");
			}

			// Check browser support
			const support = checkDCAPISupport(digitalCredentialGetRequest.protocol);
			if (!support.available) {
				throw new Error(
					`Browser compatibility: ${support.reason || "DC API not supported"}`,
				);
			}

			// Invoke DC API
			let credential: Awaited<ReturnType<typeof invokeDCAPI>>;
			try {
				credential = await invokeDCAPI(digitalCredentialGetRequest);
			} catch (error) {
				throw new Error(
					`DC API: ${error instanceof Error ? error.message : "Unknown error"}`,
					{ cause: error },
				);
			}

			// Check for errors in the response
			if (isDigitalCredentialError(credential)) {
				throw new Error(`DC API: Credential error - ${credential.data.error}`);
			}

			const isJwtMode = responseModeConfig.mode === "dc_api.jwt";
			let jwtPayload: DigitalCredentialJwtData | undefined;
			let vpTokenPayload: DigitalCredentialVpTokenData | undefined;
			if (isJwtMode) {
				if (!isDigitalCredentialJwtResponse(credential)) {
					throw new Error(
						'DC API: Invalid response for "dc_api.jwt" mode. Expected data.response (encrypted JWT).',
					);
				}
				jwtPayload = credential.data;
			} else {
				if (!isDigitalCredentialVpTokenResponse(credential)) {
					throw new Error(
						'DC API: Invalid response for "dc_api" mode. Expected data.vp_token.',
					);
				}
				vpTokenPayload = credential.data;
			}

			// Submit response to appropriate endpoint
			const client = createAuthorizerClient(authorizerUrl);
			let submission:
				| Awaited<ReturnType<ReturnType<typeof createAuthorizerClient>["POST"]>>
				| undefined;

			if (isJwtMode) {
				if (!jwtPayload) {
					throw new Error('DC API: Missing JWT payload for "dc_api.jwt" mode.');
				}
				submission = await client.POST(
					"/openid4/vp/v1_0/{authorizationId}/dc_api.jwt",
					{
						params: { path: { authorizationId } },
						body: {
							origin: window.location.origin,
							digitalCredentialGetResponse: jwtPayload,
						},
					},
				);
			} else {
				if (!vpTokenPayload) {
					throw new Error(
						'DC API: Missing vp_token payload for "dc_api" mode.',
					);
				}
				submission = await client.POST(
					"/openid4/vp/v1_0/{authorizationId}/dc_api",
					{
						params: { path: { authorizationId } },
						body: {
							origin: window.location.origin,
							digitalCredentialGetResponse: vpTokenPayload,
						},
					},
				);
			}

			if (submission.error) {
				// Handle Authorizer API errors
				const errorMessage =
					submission.error.message || "Unknown error occurred";
				throw new Error(`Authorizer API: ${errorMessage}`);
			}

			return submission.data as DcApiResponse;
		},
		onSuccess: (data) => {
			if (!authorizationId) return;

			// Update status in React Query cache
			if (data && "status" in data) {
				queryClient.setQueryData(authorizationKeys.status(authorizationId), {
					status: data.status,
				});
			}
		},
	});
}
