import { useAppStore } from "@/stores/appStore";
import type { DebugOperation } from "@/types/debug";

interface BaseDebugParams {
	operation: DebugOperation;
	method: "GET" | "POST";
	endpoint: string;
	authorizationId?: string | null;
}

interface DebugResponseParams extends BaseDebugParams {
	payload?: unknown;
	httpStatus?: number;
	durationMs?: number;
	ok?: boolean;
}

interface DebugErrorParams extends BaseDebugParams {
	error: Error;
	payload?: unknown;
	httpStatus?: number;
	durationMs?: number;
	errorCode?: string;
}

export function logVidosRequest(
	params: BaseDebugParams & { payload?: unknown },
) {
	useAppStore.getState().addDebugEvent({
		eventType: "vidos_request",
		level: "info",
		message: `Request ${params.method} ${params.endpoint}`,
		operation: params.operation,
		method: params.method,
		endpoint: params.endpoint,
		authorizationId: params.authorizationId ?? undefined,
		payload: params.payload,
	});
}

export function logVidosResponse(params: DebugResponseParams) {
	useAppStore.getState().addDebugEvent({
		eventType: "vidos_response",
		level: params.ok === false ? "error" : "info",
		message: `Response ${params.method} ${params.endpoint}`,
		operation: params.operation,
		method: params.method,
		endpoint: params.endpoint,
		authorizationId: params.authorizationId ?? undefined,
		httpStatus: params.httpStatus,
		durationMs: params.durationMs,
		ok: params.ok,
		payload: params.payload,
	});
}

export function logDebugError(params: DebugErrorParams) {
	useAppStore.getState().addDebugEvent({
		eventType: "error",
		level: "error",
		message: params.error.message,
		operation: params.operation,
		method: params.method,
		endpoint: params.endpoint,
		authorizationId: params.authorizationId ?? undefined,
		httpStatus: params.httpStatus,
		durationMs: params.durationMs,
		payload: params.payload,
		errorCode: params.errorCode,
	});
}
