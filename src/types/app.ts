import type {
	CredentialsResponseData,
	DigitalCredentialGetRequest,
	PolicyResponseData,
} from "./api";

export type AppStage = "create" | "authorization" | "result";

export type RedirectFlowSource = "redirect_uri";

export type RedirectResolveStatus =
	| "idle"
	| "resolving"
	| "resolved"
	| "failed";

export type RedirectResolveFailureKind =
	| "invalid_or_expired_or_used"
	| "transient";

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

export type TransactionDataHashAlgorithm = "sha-256" | "sha-384" | "sha-512";

export type TransactionDataNode =
	| {
			type: "object";
			entries: TransactionDataObjectField[];
	  }
	| {
			type: "array";
			items: TransactionDataNode[];
	  }
	| {
			type: "string";
			value: string;
	  }
	| {
			type: "number";
			value: string;
	  }
	| {
			type: "boolean";
			value: boolean;
	  }
	| {
			type: "null";
	  };

export interface TransactionDataObjectField {
	key: string;
	value: TransactionDataNode;
	reactKey: string;
}

export interface TransactionDataEntry {
	reactKey: string;
	type: string;
	credentialIds: string[];
	hashesAlg: TransactionDataHashAlgorithm[];
	customFields: TransactionDataObjectField[];
}

// Response mode configuration
export interface ResponseModeConfig {
	mode: ResponseMode;
	profile?: Profile; // Authorization profile (e.g., HAIP)
	dcApiProtocol?: DCAPIProtocol; // Required for dc_api modes
	expectedOrigins?: string[]; // Required for signed protocol
}

// Policy response types - extracted from generated API types
// The API returns a union type for policy results (error case | success case)
// We extract the error structure from the error case variant
type PolicyResultFromApi = PolicyResponseData["data"][number];

// Extract the error variant (has required 'error' field)
type PolicyResultWithError = Extract<PolicyResultFromApi, { error: object }>;

// Re-export the error type from the API
export type PolicyError = PolicyResultWithError["error"];

// Re-export the error detail type (nested errors array)
export type PolicyErrorDetail = NonNullable<PolicyError["errors"]>[number];

// Unified PolicyResult type that handles both API variants
export type PolicyResult = PolicyResultFromApi;

export interface PolicyDefinition {
	description: string;
	docsUrl: string;
}

// Credentials response - re-exported from generated API types
export type CredentialsResponse = CredentialsResponseData;
export type SubmittedCredential = CredentialsResponse["credentials"][number];

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
	transactionDataEntries: TransactionDataEntry[];

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
	| "payment"
	| "address"
	| "kyc"
	| "driving"
	| "flexible"
	| "eudiw-unfold";

export interface RequestTemplate {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	credentialRequests: CredentialRequestWithId[];
	credentialSets: CredentialSet[];
	transactionDataEntries?: TransactionDataEntry[];
	isBuiltIn: boolean;
}
