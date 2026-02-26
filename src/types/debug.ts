export type DebugLevel = "info" | "warn" | "error" | "debug";

export type DebugEventType = "vidos_request" | "vidos_response" | "error";

export type DebugOperation =
	| "create_authorization"
	| "authorization_status"
	| "authorization_jwt"
	| "policy_response"
	| "credentials"
	| "resolve_response_code";

export interface DebugEvent {
	id: string;
	timestamp: string;
	level: DebugLevel;
	eventType: DebugEventType;
	message: string;
	operation?: DebugOperation;
	method?: "GET" | "POST";
	endpoint?: string;
	authorizationId?: string;
	httpStatus?: number;
	durationMs?: number;
	ok?: boolean;
	payload?: unknown;
	errorCode?: string;
}

export const DEBUG_EVENT_META: Record<
	DebugEventType,
	{ label: string; description: string }
> = {
	vidos_request: {
		label: "Vidos Request",
		description: "Outgoing API request from client to Vidos Authorizer.",
	},
	vidos_response: {
		label: "Vidos Response",
		description: "Response received from Vidos Authorizer.",
	},
	error: {
		label: "Client Error",
		description: "Client-side request/response handling error.",
	},
};

export const DEBUG_OPERATION_LABELS: Record<DebugOperation, string> = {
	create_authorization: "Create Authorization",
	authorization_status: "Authorization Status",
	authorization_jwt: "Authorization JWT",
	policy_response: "Policy Response",
	credentials: "Credentials",
	resolve_response_code: "Resolve Response Code",
};
