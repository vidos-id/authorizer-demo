import { useQuery } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type { AuthorizationStatus } from "@/types/app";
import {
	logDebugError,
	logVidosRequest,
	logVidosResponse,
} from "@/utils/debugEvents";
import { authorizationKeys } from "./keys";

const TERMINAL_STATES: AuthorizationStatus[] = [
	"authorized",
	"rejected",
	"error",
	"expired",
];

const lastLoggedStatusByAuthorizationId = new Map<string, string>();

export function useAuthorizationStatusQuery() {
	const authorizationId = useAppStore((state) => state.authorizationId);
	const authorizerUrl = useAppStore(selectAuthorizerUrl);
	const stage = useAppStore((state) => state.stage);
	const shouldFetchStatus =
		!!authorizationId && (stage === "authorization" || stage === "result");

	return useQuery({
		queryKey: authorizationKeys.status(authorizationId ?? undefined),
		queryFn: async () => {
			if (!authorizationId) throw new Error("No authorization ID provided");
			const client = createAuthorizerClient(authorizerUrl);
			const endpoint = `/openid4/vp/v1_0/authorizations/${authorizationId}/status`;
			const startedAt = Date.now();
			const { data, error, response } = await client.GET(
				"/openid4/vp/v1_0/authorizations/{authorizationId}/status",
				{
					params: {
						path: { authorizationId: authorizationId },
					},
				},
			);
			const durationMs = Date.now() - startedAt;
			const responseStatus = response?.status;

			if (error) {
				const requestError = new Error(
					error.message || "Failed to fetch status",
				);
				logDebugError({
					operation: "authorization_status",
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

			const previousStatus =
				lastLoggedStatusByAuthorizationId.get(authorizationId);
			if (data?.status && data.status !== previousStatus) {
				lastLoggedStatusByAuthorizationId.set(authorizationId, data.status);
				logVidosRequest({
					operation: "authorization_status",
					method: "GET",
					endpoint,
					authorizationId,
				});
				logVidosResponse({
					operation: "authorization_status",
					method: "GET",
					endpoint,
					authorizationId,
					httpStatus: responseStatus,
					durationMs,
					ok: true,
					payload: data,
				});
			}

			return data;
		},
		enabled: shouldFetchStatus,
		refetchInterval: (query) => {
			// Poll only during active authorization. RESULT stage should read once.
			if (stage !== "authorization") return false;

			const status = query.state.data?.status;
			if (!status) return 2500;

			const isTerminal = TERMINAL_STATES.includes(status);
			return isTerminal ? false : 2500; // Stop polling on terminal
		},
		refetchIntervalInBackground: false,
	});
}
