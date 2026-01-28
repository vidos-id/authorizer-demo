import { useQuery } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import { authorizationKeys } from "./keys";

export function useAuthorizationJwtQuery(enabled = false) {
	const authorizationId = useAppStore((state) => state.authorizationId);
	const authorizerUrl = useAppStore(selectAuthorizerUrl);

	return useQuery({
		queryKey: authorizationKeys.jwt(authorizationId ?? undefined),
		queryFn: async () => {
			if (!authorizationId) throw new Error("No authorization ID provided");
			const client = createAuthorizerClient(authorizerUrl);
			const { data, error } = await client.GET(
				"/openid4/vp/v1_0/authorizations/{authorizationId}/jwt",
				{
					params: {
						path: { authorizationId },
					},
					parseAs: "text",
				},
			);

			if (error) {
				throw new Error(error.message || "Failed to fetch authorization JWT");
			}

			return data;
		},
		enabled: enabled && !!authorizationId,
	});
}
