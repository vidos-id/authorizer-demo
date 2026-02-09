import type { DigitalCredentialGetRequest, PolicyResponseData } from "./api";

export type AppStage = "create" | "authorization" | "result";

export type AuthorizationStatus =
	| "created"
	| "pending"
	| "authorized"
	| "rejected"
	| "error"
	| "expired";

export type CredentialFormat = "dc+sd-jwt" | "mso_mdoc";

// Response mode types
export type ResponseMode =
	| "direct_post"
	| "direct_post.jwt"
	| "dc_api"
	| "dc_api.jwt";

export type DCAPIProtocol = "openid4vp-v1-unsigned" | "openid4vp-v1-signed";

export type Profile = "haip" | undefined;

export type InstanceType = "managed" | "own";

export interface CredentialRequest {
	id: string;
	documentType: string;
	formatId: string;
	format: CredentialFormat;
	attributes: string[];
}

// Credential request with ID for UI management
export interface CredentialRequestWithId extends CredentialRequest {
	reactKey: string; // UUID for tracking
}

// Credential set types for DCQL
export type CredentialSetOption = string[]; // Array of credential IDs for AND logic

export interface CredentialSet {
	id: string; // User-editable ID, pre-filled with UUID
	options: CredentialSetOption[]; // Array of alternatives (OR), each option is AND of credential IDs
	required: boolean; // Maps to spec's 'required' field (default: true)
	reactKey: string; // UUID for tracking
}

// Response mode configuration
export interface ResponseModeConfig {
	mode: ResponseMode;
	profile?: Profile; // Authorization profile (e.g., HAIP)
	dcApiProtocol?: DCAPIProtocol; // Required for dc_api modes
	expectedOrigins?: string[]; // Required for signed protocol
}

// Policy response structures (from API)
export interface PolicyError {
	type: string;
	title?: string;
	detail?: string;
	status?: number;
	vidosType?: string;
}

export interface PolicyDefinition {
	description: string;
	docsUrl: string;
}

export interface PolicyResult {
	path: (string | number)[];
	policy: string;
	service: string;
	error?: PolicyError;
	data?: unknown; // Credential attributes when successful
}

export interface PolicyResponse {
	data: PolicyResult[];
	authorizationId: string;
}

// Credentials response structures (from API)
export interface SubmittedCredential {
	path: (string | number)[]; // e.g., ["cred1", 0, 0, "org.iso.18013.5.1"]
	format: string; // "mdoc", "ietf.dc-sd-jwt"
	credentialType: string; // "org.iso.18013.5.1.mDL", "eu.europa.ec.eudi.pid.1"
	claims: Record<string, unknown>;
}

export interface CredentialsResponse {
	authorizationId: string;
	credentials: SubmittedCredential[];
}

// Saved JSON request for custom authorization requests
export interface SavedJsonRequest {
	id: string; // UUID
	name: string; // User-provided name
	content: string; // JSON string of request body
	createdAt: string; // ISO timestamp
	updatedAt: string; // ISO timestamp
}

export interface AppState {
	stage: AppStage;
	authorizerUrl: string;

	// Multiple credential requests
	credentialRequests: CredentialRequestWithId[];

	// Credential sets for DCQL
	credentialSets: CredentialSet[];

	// Response mode configuration
	responseModeConfig: ResponseModeConfig;

	authorizationId: string | null;
	authorizeUrl: string | null; // Can be null for dc_api modes

	// DC API request object (alternative to authorizeUrl)
	digitalCredentialGetRequest: DigitalCredentialGetRequest | null;

	expiresAt: string | null;
	error: { message: string; details?: string } | null;

	// Policy response data
	policyResponse: PolicyResponseData | null;

	lastRequest: object | null;
	lastResponse: object | null;
	showPreview: boolean;
}

export type TemplateCategory =
	| "age-verification"
	| "identity"
	| "address"
	| "kyc"
	| "driving"
	| "flexible";

export interface RequestTemplate {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	credentialRequests: CredentialRequestWithId[];
	credentialSets: CredentialSet[];
	isBuiltIn: boolean;
}
