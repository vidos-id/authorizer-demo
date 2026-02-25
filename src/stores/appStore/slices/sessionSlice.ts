import type { ResponseModeConfig } from "@/types/app";
import type { SessionSlice, SliceCreator } from "../types";

// Initial state values needed for startFresh
const initialSessionState = {
	stage: "create" as const,
	authorizationId: null,
	authorizeUrl: null,
	digitalCredentialGetRequest: null,
	expiresAt: null,
};

// Additional reset values for startFresh
const resetStateForFresh = {
	credentialRequests: [],
	credentialSets: [],
	transactionDataEntries: [],
	responseModeConfig: { mode: "direct_post.jwt" } as ResponseModeConfig,
	useRawJsonMode: false,
	rawJsonContent: "",
	showPreview: false,
	lastRequest: null,
	lastResponse: null,
	error: null,
};

export const createSessionSlice: SliceCreator<SessionSlice> = (set) => ({
	...initialSessionState,

	setStage: (stage) => set({ stage }),
	setAuthorizationId: (authorizationId) => set({ authorizationId }),
	setAuthorizeUrl: (authorizeUrl) => set({ authorizeUrl }),
	setDigitalCredentialGetRequest: (digitalCredentialGetRequest) =>
		set({ digitalCredentialGetRequest }),
	setExpiresAt: (expiresAt) => set({ expiresAt }),

	startFresh: () =>
		set((state) => ({
			...initialSessionState,
			...resetStateForFresh,
			// Keep these values from current state
			ownAuthorizerUrl: state.ownAuthorizerUrl,
			instanceType: state.instanceType,
			customCredentialCases: state.customCredentialCases,
			customRequestTemplates: state.customRequestTemplates,
			customJsonRequests: state.customJsonRequests,
		})),

	backToCreateStage: () =>
		set({
			stage: "create",
			authorizationId: null,
			authorizeUrl: null,
			digitalCredentialGetRequest: null,
			expiresAt: null,
			showPreview: false,
			error: null,
		}),

	importConfig: (config) =>
		set((state) => ({
			instanceType: config.instanceType,
			ownAuthorizerUrl:
				config.instanceType === "own"
					? (config.ownAuthorizerUrl ?? "")
					: state.ownAuthorizerUrl,
			customCredentialCases: config.customCredentialCases,
			customRequestTemplates: config.customRequestTemplates || [],
			error: null,
		})),
});
