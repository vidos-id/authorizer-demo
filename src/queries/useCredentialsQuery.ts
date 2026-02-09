import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type { AuthorizationStatusResponse } from "@/types/api";
import type { CredentialsResponse } from "@/types/app";
import { authorizationKeys } from "./keys";

interface UseCredentialsQueryOptions {
	enabled?: boolean;
}

export function useCredentialsQuery(options: UseCredentialsQueryOptions = {}) {
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
		queryKey: authorizationId
			? authorizationKeys.credentials(authorizationId)
			: [],
		queryFn: async (): Promise<CredentialsResponse> => {
			if (!authorizationId) throw new Error("No authorization ID provided");
			const client = createAuthorizerClient(authorizerUrl);
			const { data, error, response } = await client.GET(
				"/openid4/vp/v1_0/authorizations/{authorizationId}/credentials",
				{ params: { path: { authorizationId } } },
			);

			// Handle 404 as empty state (not an error)
			if (response.status === 404) {
				return {
					authorizationId,
					credentials: [],
				};
			}

			if (error || !data) {
				throw new Error(error?.message || "Failed to fetch credentials");
			}

			return data;
		},
		enabled: options.enabled !== undefined ? options.enabled : defaultEnabled,
		staleTime: Number.POSITIVE_INFINITY, // Never refetch, it's final
	});
}
