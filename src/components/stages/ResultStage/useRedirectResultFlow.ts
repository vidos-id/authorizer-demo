import { useCallback, useEffect } from "react";
import {
	type ResolveResponseCodeFailure,
	useResolveResponseCodeMutation,
} from "@/queries/useResolveResponseCodeMutation";
import { useAppStore } from "@/stores/appStore";

export function useRedirectResultFlow() {
	const authorizationId = useAppStore((state) => state.authorizationId);
	const redirectFlowSource = useAppStore((state) => state.redirectFlowSource);
	const redirectResponseCode = useAppStore(
		(state) => state.redirectResponseCode,
	);
	const redirectResolveStatus = useAppStore(
		(state) => state.redirectResolveStatus,
	);
	const redirectResolveFailureKind = useAppStore(
		(state) => state.redirectResolveFailureKind,
	);
	const setAuthorizationId = useAppStore((state) => state.setAuthorizationId);
	const setError = useAppStore((state) => state.setError);
	const setRedirectResolveStatus = useAppStore(
		(state) => state.setRedirectResolveStatus,
	);
	const resolveResponseCode = useResolveResponseCodeMutation();

	const isRedirectFlow = redirectFlowSource === "redirect_uri";
	const canFetchResultData =
		!!authorizationId &&
		(!isRedirectFlow || redirectResolveStatus === "resolved");

	const handleResolveError = useCallback(
		(resolveError: ResolveResponseCodeFailure) => {
			setRedirectResolveStatus("failed", resolveError.kind);

			if (resolveError.kind === "invalid_or_expired_or_used") {
				setError({
					message:
						"This response code could not be resolved. It may be expired, already used, or invalid.",
					details:
						"Response codes are one-time and short-lived. Start a new authorization flow in the verifier and retry from the wallet redirect. If this happened across devices, verify both devices use the same Authorizer URL.",
				});
				return;
			}

			setError({
				message:
					resolveError.message ||
					"Could not resolve the response code due to a transient issue.",
				details:
					"Check network/server availability and retry. If using multiple devices, verify the same Authorizer URL is configured on both.",
			});
		},
		[setError, setRedirectResolveStatus],
	);

	const resolveResponseCodeFromRedirect = useCallback(() => {
		if (!redirectResponseCode) {
			return;
		}

		setError(null);
		setRedirectResolveStatus("resolving");
		resolveResponseCode.mutate(redirectResponseCode, {
			onSuccess: (data) => {
				setAuthorizationId(data.authorization_id);
				setRedirectResolveStatus("resolved");
				setError(null);
			},
			onError: handleResolveError,
		});
	}, [
		handleResolveError,
		redirectResponseCode,
		resolveResponseCode,
		setAuthorizationId,
		setError,
		setRedirectResolveStatus,
	]);

	useEffect(() => {
		if (!isRedirectFlow || redirectResolveStatus !== "idle") {
			return;
		}

		resolveResponseCodeFromRedirect();
	}, [isRedirectFlow, redirectResolveStatus, resolveResponseCodeFromRedirect]);

	return {
		isRedirectFlow,
		canFetchResultData,
		redirectResolveStatus,
		redirectResolveFailureKind,
		resolveResponseCodeFromRedirect,
		isResolvePending: resolveResponseCode.isPending,
	};
}
