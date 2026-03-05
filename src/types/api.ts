import type { operations } from "@/api/authorizer";

// Extract request body type for creating authorization
export type CreateAuthorizationRequest = NonNullable<
	operations["createAuthorization"]["requestBody"]
>["content"]["application/json"];

// Extract response type for creating authorization
export type CreateAuthorizationResponse =
	operations["createAuthorization"]["responses"][201]["content"]["application/json"];

// Extract DC API endpoint request body types
export type DcApiRequest = NonNullable<
	operations["dcApi"]["requestBody"]
>["content"]["application/json"];

export type DcApiJwtRequest = NonNullable<
	operations["dcApiJwt"]["requestBody"]
>["content"]["application/json"];

// Extract DC API response types
export type DcApiResponse =
	operations["dcApi"]["responses"][200]["content"]["application/json"];

export type DcApiJwtResponse =
	operations["dcApiJwt"]["responses"][200]["content"]["application/json"];

// Extract authorization status response type
export type AuthorizationStatusResponse =
	operations["getAuthorizationStatus"]["responses"][200]["content"]["application/json"];

// Extract policy response type
export type PolicyResponseData =
	operations["getPolicyResponse"]["responses"][200]["content"]["application/json"];

// Extract credentials response type
export type CredentialsResponseData =
	operations["getCredentials"]["responses"][200]["content"]["application/json"];

export type ResolveResponseCodeRequest = NonNullable<
	operations["resolveResponseCode"]["requestBody"]
>["content"]["application/json"];

export type ResolveResponseCodeResponse =
	operations["resolveResponseCode"]["responses"][200]["content"]["application/json"];

type ResolveResponseCodeErrorResponse =
	operations["resolveResponseCode"]["responses"][400 | 401 | 404 | 500];

export type ResolveResponseCodeError =
	ResolveResponseCodeErrorResponse["content"]["application/json"];

// Extract digitalCredentialGetRequest type from DC API response
type DcApiCreateResponse = Extract<
	CreateAuthorizationResponse,
	{ digitalCredentialGetRequest: unknown }
>;
export type DigitalCredentialGetRequest =
	DcApiCreateResponse["digitalCredentialGetRequest"];

// Digital Credential Get Response (from navigator.credentials.get())
// Spec: https://www.w3.org/TR/digital-credentials/#the-digitalcredential-interface
// Spec: https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#appendix-A.4
export type DigitalCredentialVpTokenData =
	DcApiRequest["digitalCredentialGetResponse"];
export type DigitalCredentialJwtData =
	DcApiJwtRequest["digitalCredentialGetResponse"];

type DigitalCredentialSuccessData =
	| DigitalCredentialVpTokenData
	| DigitalCredentialJwtData;

type DigitalCredentialErrorData = {
	error: string; // Error code as defined in OpenID4VP spec
};

export type DigitalCredentialGetResponse =
	| {
			// Success response with VP token or encrypted JWT response
			protocol: string; // e.g., "openid4vp-v1-unsigned" | "openid4vp-v1-signed" | "openid4vp-v1-multisigned"
			data: DigitalCredentialSuccessData;
	  }
	| {
			// Error response
			protocol: string;
			data: DigitalCredentialErrorData;
	  };

// Type-safe endpoint paths for DC API
export type DcApiEndpoint =
	| "/openid4/vp/v1_0/{authorizationId}/dc_api"
	| "/openid4/vp/v1_0/{authorizationId}/dc_api.jwt";
