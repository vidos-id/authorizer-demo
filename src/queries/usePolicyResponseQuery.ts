import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type { AuthorizationStatusResponse } from "@/types/api";
import {
	logDebugError,
	logVidosRequest,
	logVidosResponse,
} from "@/utils/debugEvents";
import { authorizationKeys } from "./keys";

interface UsePolicyResponseQueryOptions {
	enabled?: boolean;
}

export function usePolicyResponseQuery(
	options: UsePolicyResponseQueryOptions = {},
) {
	const authorizationId = useAppStore((state) => state.authorizationId);
	const authorizerUrl = useAppStore(selectAuthorizerUrl);
	const stage = useAppStore((state) => state.stage);

	// Get current status from React Query cache
	const queryClient = useQueryClient();
	const statusData = queryClient.getQueryData<AuthorizationStatusResponse>(
		authorizationKeys.status(authorizationId ?? undefined),
	);

	const defaultEnabled =
		stage === "result" &&
		(statusData?.status === "authorized" ||
			statusData?.status === "rejected" ||
			statusData?.status === "error") &&
		!!authorizationId;

	return useQuery({
		queryKey: authorizationId ? authorizationKeys.policy(authorizationId) : [],
		queryFn: async () => {
			if (!authorizationId) throw new Error("No authorization ID provided");
			const client = createAuthorizerClient(authorizerUrl);
			const endpoint = `/openid4/vp/v1_0/authorizations/${authorizationId}/policy-response`;
			const startedAt = Date.now();

			logVidosRequest({
				operation: "policy_response",
				method: "GET",
				endpoint,
				authorizationId,
			});

			const { data, error, response } = await client.GET(
				"/openid4/vp/v1_0/authorizations/{authorizationId}/policy-response",
				{ params: { path: { authorizationId } } },
			);
			const durationMs = Date.now() - startedAt;
			const responseStatus = response?.status;

			if (error) {
				const requestError = new Error(
					error.message || "Failed to fetch policy response",
				);
				logVidosResponse({
					operation: "policy_response",
					method: "GET",
					endpoint,
					authorizationId,
					httpStatus: responseStatus,
					durationMs,
					ok: false,
					payload: error,
				});
				logDebugError({
					operation: "policy_response",
					method: "GET",
					endpoint,
					authorizationId,
					error: requestError,
					httpStatus: responseStatus,
					durationMs,
					payload: error,
				});
				throw requestError;
			}

			logVidosResponse({
				operation: "policy_response",
				method: "GET",
				endpoint,
				authorizationId,
				httpStatus: responseStatus,
				durationMs,
				ok: response?.ok,
				payload: data,
			});

			return data;
		},
		enabled: options.enabled !== undefined ? options.enabled : defaultEnabled,
		staleTime: Number.POSITIVE_INFINITY, // Never refetch, it's final
	});
}
