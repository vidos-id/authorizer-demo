import { CREDENTIAL_CASES } from "@/config/credential-cases/credential-cases";
import { BUILT_IN_TEMPLATES } from "@/config/request-templates/request-templates";
import { validateTemplate } from "@/utils/templateValidation";
import type { SliceCreator, TemplateSelectionSlice } from "../types";

export const createTemplateSelectionSlice: SliceCreator<
	TemplateSelectionSlice
> = (set, get) => ({
	selectedTemplateId: null,

	setSelectedTemplateId: (id) =>
		set({
			selectedTemplateId: id,
			error: null,
		}),

	applyTemplate: (templateId) => {
		const state = get();
		const allTemplates = [
			...BUILT_IN_TEMPLATES,
			...state.customRequestTemplates,
		];
		const template = allTemplates.find((t) => t.id === templateId);

		if (!template) {
			set({
				error: {
					message: "Template not found",
					details: `Template with ID "${templateId}" does not exist`,
				},
			});
			return;
		}

		// Validate template against all available credential cases (built-in + custom)
		const allCredentialCases = [
			...CREDENTIAL_CASES,
			...state.customCredentialCases,
		];
		const validation = validateTemplate(template, allCredentialCases);

		if (!validation.valid) {
			set({
				error: {
					message: "Invalid template",
					details: validation.errors.join(". "),
				},
			});
			return;
		}

		set({
			credentialRequests: template.credentialRequests,
			credentialSets: template.credentialSets,
			transactionDataEntries: template.transactionDataEntries ?? [],
			selectedTemplateId: templateId,
			error: null,
		});
	},

	clearSelectedTemplate: () =>
		set({
			selectedTemplateId: null,
		}),
});
