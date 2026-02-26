import { useMutation } from "@tanstack/react-query";
import { createAuthorizerClient } from "@/api/client";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import type {
	ResolveResponseCodeRequest,
	ResolveResponseCodeResponse,
} from "@/types/api";
import type { RedirectResolveFailureKind } from "@/types/app";
import {
	logDebugError,
	logVidosRequest,
	logVidosResponse,
} from "@/utils/debugEvents";

export interface ResolveResponseCodeFailure {
	kind: RedirectResolveFailureKind;
	message: string;
	details?: string;
	httpStatus?: number;
}

function classifyResolveFailure(status?: number): RedirectResolveFailureKind {
	if (status === 404) {
		return "invalid_or_expired_or_used";
	}
	return "transient";
}

export function useResolveResponseCodeMutation() {
	const authorizerUrl = useAppStore(selectAuthorizerUrl);

	return useMutation<
		ResolveResponseCodeResponse,
		ResolveResponseCodeFailure,
		string
	>({
		mutationKey: ["authorization", "resolve-response-code", authorizerUrl],
		retry: (failureCount, error) =>
			error.kind === "transient" && failureCount < 3,
		retryDelay: 500,
		mutationFn: async (responseCode: string) => {
			if (!authorizerUrl) {
				throw {
					kind: "transient",
					message: "Authorizer URL is required",
				} satisfies ResolveResponseCodeFailure;
			}

			const client = createAuthorizerClient(authorizerUrl);
			const endpoint = "/openid4/vp/v1_0/response-code/resolve";
			const body: ResolveResponseCodeRequest = {
				response_code: responseCode,
			};
			const startedAt = Date.now();

			logVidosRequest({
				operation: "resolve_response_code",
				method: "POST",
				endpoint,
				payload: body,
			});

			const { data, error, response } = await client.POST(
				"/openid4/vp/v1_0/response-code/resolve",
				{ body },
			);
			const durationMs = Date.now() - startedAt;
			const responseStatus = response?.status;

			if (error || !data) {
				const kind = classifyResolveFailure(responseStatus);
				const message = error?.message ?? "Failed to resolve response code";
				const details = error?.action;

				logVidosResponse({
					operation: "resolve_response_code",
					method: "POST",
					endpoint,
					httpStatus: responseStatus,
					durationMs,
					ok: false,
					payload: error ?? null,
				});

				const errorForDebug = new Error(message);
				logDebugError({
					operation: "resolve_response_code",
					method: "POST",
					endpoint,
					error: errorForDebug,
					httpStatus: responseStatus,
					durationMs,
					payload: error ?? data,
					errorCode: kind,
				});

				throw {
					kind,
					message,
					details,
					httpStatus: responseStatus,
				} satisfies ResolveResponseCodeFailure;
			}

			logVidosResponse({
				operation: "resolve_response_code",
				method: "POST",
				endpoint,
				httpStatus: responseStatus,
				durationMs,
				ok: response?.ok,
				payload: data,
			});

			return data;
		},
	});
}
