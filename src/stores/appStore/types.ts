import type { StateCreator } from "zustand";
import type { CredentialCaseDefinition } from "@/config/credential-cases/types";
import type { DigitalCredentialGetRequest } from "@/types/api";
import type {
	AppStage,
	CredentialRequestWithId,
	CredentialSet,
	InstanceType,
	RequestTemplate,
	ResponseModeConfig,
	SavedJsonRequest,
} from "@/types/app";
import type { ConfigExport } from "@/utils/configExport";

// Error type
export type StoreError = { message: string; details?: string } | null;

// Individual slice interfaces
export interface ConfigSlice {
	instanceType: InstanceType;
	ownAuthorizerUrl: string;
	setInstanceType: (type: InstanceType) => void;
	setOwnAuthorizerUrl: (url: string) => void;
}

export interface CredentialRequestsSlice {
	credentialRequests: CredentialRequestWithId[];
	credentialSets: CredentialSet[];
	setCredentialRequests: (requests: CredentialRequestWithId[]) => void;
	addCredentialRequest: (request: CredentialRequestWithId) => void;
	updateCredentialRequest: (
		id: string,
		request: Partial<CredentialRequestWithId>,
	) => void;
	removeCredentialRequest: (id: string) => void;
	addCredentialSet: () => void;
	updateCredentialSet: (id: string, updates: Partial<CredentialSet>) => void;
	removeCredentialSet: (id: string) => void;
	updateCredentialId: (oldId: string, newId: string) => void;
}

export interface ResponseModeSlice {
	responseModeConfig: ResponseModeConfig;
	setResponseModeConfig: (config: ResponseModeConfig) => void;
}

export interface CustomCasesSlice {
	customCredentialCases: CredentialCaseDefinition[];
	addCustomCredentialCase: (credCase: CredentialCaseDefinition) => void;
	updateCustomCredentialCase: (
		id: string,
		credCase: CredentialCaseDefinition,
	) => void;
	deleteCustomCredentialCase: (id: string) => void;
}

export interface CustomTemplatesSlice {
	customRequestTemplates: RequestTemplate[];
	addCustomTemplate: (template: RequestTemplate) => void;
	updateCustomTemplate: (id: string, template: RequestTemplate) => void;
	deleteCustomTemplate: (id: string) => void;
	setCustomTemplates: (templates: RequestTemplate[]) => void;
}

export interface TemplateSelectionSlice {
	selectedTemplateId: string | null;
	setSelectedTemplateId: (id: string | null) => void;
	applyTemplate: (templateId: string) => void;
	clearSelectedTemplate: () => void;
}

export interface JsonModeSlice {
	useRawJsonMode: boolean;
	rawJsonContent: string;
	customJsonRequests: SavedJsonRequest[];
	setUseRawJsonMode: (use: boolean) => void;
	setRawJsonContent: (content: string) => void;
	addCustomJsonRequest: (request: SavedJsonRequest) => void;
	updateCustomJsonRequest: (id: string, request: SavedJsonRequest) => void;
	deleteCustomJsonRequest: (id: string) => void;
}

export interface SessionSlice {
	stage: AppStage;
	authorizationId: string | null;
	authorizeUrl: string | null;
	digitalCredentialGetRequest: DigitalCredentialGetRequest | null;
	expiresAt: string | null;
	setStage: (stage: AppStage) => void;
	setAuthorizationId: (id: string | null) => void;
	setAuthorizeUrl: (url: string | null) => void;
	setDigitalCredentialGetRequest: (
		request: DigitalCredentialGetRequest | null,
	) => void;
	setExpiresAt: (expiresAt: string | null) => void;
	startFresh: () => void;
	backToCreateStage: () => void;
	importConfig: (config: ConfigExport) => void;
}

export interface UiSlice {
	showPreview: boolean;
	error: StoreError;
	createViewMode: "templates" | "builder" | "json";
	setShowPreview: (show: boolean) => void;
	setError: (error: StoreError) => void;
	resetError: () => void;
	setCreateViewMode: (viewMode: "templates" | "builder" | "json") => void;
}

export interface DebugSlice {
	lastRequest: object | null;
	lastResponse: object | null;
	setLastRequest: (request: object | null) => void;
	setLastResponse: (response: object | null) => void;
}

// Combined state type
export type AppState = ConfigSlice &
	CredentialRequestsSlice &
	ResponseModeSlice &
	CustomCasesSlice &
	CustomTemplatesSlice &
	TemplateSelectionSlice &
	JsonModeSlice &
	SessionSlice &
	UiSlice &
	DebugSlice;

// Helper type for slice creators (Zustand slices pattern)
export type SliceCreator<T> = StateCreator<AppState, [], [], T>;
