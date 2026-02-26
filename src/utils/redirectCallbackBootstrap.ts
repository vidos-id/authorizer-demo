import { useAppStore } from "@/stores/appStore";

const RESPONSE_CODE_PARAM = "response_code";

export function bootstrapRedirectCallbackFlow() {
	if (typeof window === "undefined") {
		return;
	}

	const url = new URL(window.location.href);
	const responseCode = url.searchParams.get(RESPONSE_CODE_PARAM);
	if (!responseCode) {
		return;
	}

	const store = useAppStore.getState();
	store.setRedirectCallbackContext(responseCode);
	store.setAuthorizationId(null);
	store.setError(null);
	store.setStage("result");

	url.searchParams.delete(RESPONSE_CODE_PARAM);
	const nextQuery = url.searchParams.toString();
	const nextUrl = `${url.pathname}${nextQuery ? `?${nextQuery}` : ""}${url.hash}`;
	window.history.replaceState(window.history.state, "", nextUrl);
}
