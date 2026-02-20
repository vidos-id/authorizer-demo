import { useQuery } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import {
	logDebugError,
	logVidosRequest,
	logVidosResponse,
} from "@/utils/debugEvents";
import { authorizationKeys } from "./keys";

export function useAuthorizationJwtQuery(enabled = false) {
	const authorizationId = useAppStore((state) => state.authorizationId);
	const authorizerUrl = useAppStore(selectAuthorizerUrl);

	return useQuery({
		queryKey: authorizationKeys.jwt(authorizationId ?? undefined),
		queryFn: async () => {
			if (!authorizationId) throw new Error("No authorization ID provided");
			const client = createAuthorizerClient(authorizerUrl);
			const endpoint = `/openid4/vp/v1_0/authorizations/${authorizationId}/jwt`;
			const startedAt = Date.now();

			logVidosRequest({
				operation: "authorization_jwt",
				method: "GET",
				endpoint,
				authorizationId,
			});

			const { data, error, response } = await client.GET(
				"/openid4/vp/v1_0/authorizations/{authorizationId}/jwt",
				{
					params: {
						path: { authorizationId },
					},
					parseAs: "text",
				},
			);
			const durationMs = Date.now() - startedAt;
			const responseStatus = response?.status;

			if (error) {
				const requestError = new Error(
					error.message || "Failed to fetch authorization JWT",
				);
				logVidosResponse({
					operation: "authorization_jwt",
					method: "GET",
					endpoint,
					authorizationId,
					httpStatus: responseStatus,
					durationMs,
					ok: false,
					payload: error,
				});
				logDebugError({
					operation: "authorization_jwt",
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
				operation: "authorization_jwt",
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
		enabled: enabled && !!authorizationId,
	});
}
