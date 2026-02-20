import { BUILT_IN_TEMPLATES } from "@/config/request-templates/request-templates";
import { getManagedAuthorizerUrl } from "@/utils/env";
import type { AppState } from "./types";

// Config selectors
export const configSelectors = {
	instanceType: (state: AppState) => state.instanceType,
	ownAuthorizerUrl: (state: AppState) => state.ownAuthorizerUrl,
};

// Credential requests selectors
export const credentialRequestsSelectors = {
	credentialRequests: (state: AppState) => state.credentialRequests,
	credentialSets: (state: AppState) => state.credentialSets,
};

// Response mode selectors
export const responseModeSelectors = {
	responseModeConfig: (state: AppState) => state.responseModeConfig,
};

// Custom cases selectors
export const customCasesSelectors = {
	customCredentialCases: (state: AppState) => state.customCredentialCases,
};

// JSON mode selectors
export const jsonModeSelectors = {
	useRawJsonMode: (state: AppState) => state.useRawJsonMode,
	rawJsonContent: (state: AppState) => state.rawJsonContent,
	customJsonRequests: (state: AppState) => state.customJsonRequests,
};

// Session selectors
export const sessionSelectors = {
	stage: (state: AppState) => state.stage,
	authorizationId: (state: AppState) => state.authorizationId,
	authorizeUrl: (state: AppState) => state.authorizeUrl,
	digitalCredentialGetRequest: (state: AppState) =>
		state.digitalCredentialGetRequest,
	expiresAt: (state: AppState) => state.expiresAt,
};

// UI selectors
export const uiSelectors = {
	showPreview: (state: AppState) => state.showPreview,
	error: (state: AppState) => state.error,
};

// Debug selectors
export const debugSelectors = {
	lastRequest: (state: AppState) => state.lastRequest,
	lastResponse: (state: AppState) => state.lastResponse,
	debugEvents: (state: AppState) => state.debugEvents,
};

// Template selectors
export const templateSelectors = {
	customRequestTemplates: (state: AppState) => state.customRequestTemplates,
	selectedTemplateId: (state: AppState) => state.selectedTemplateId,
};

/**
 * Selector to get all templates (built-in + custom)
 */
export const selectAllTemplates = (state: AppState) => [
	...BUILT_IN_TEMPLATES,
	...state.customRequestTemplates,
];

/**
 * Selector to get the currently selected template
 */
export const selectSelectedTemplate = (state: AppState) => {
	if (!state.selectedTemplateId) return null;
	const allTemplates = selectAllTemplates(state);
	return allTemplates.find((t) => t.id === state.selectedTemplateId) ?? null;
};

/**
 * Selector to get the current authorizer URL based on instance type
 * Returns empty string if managed instance is not configured or own URL is empty
 */
export const selectAuthorizerUrl = (state: AppState): string => {
	if (state.instanceType === "managed") {
		const managedAuthorizerUrl = getManagedAuthorizerUrl();
		if (managedAuthorizerUrl) return managedAuthorizerUrl;
		return "";
	}
	return state.ownAuthorizerUrl;
};
