import { CREDENTIAL_CASES } from "@/config/credential-cases/credential-cases";
import { validateTemplate } from "@/utils/templateValidation";
import { ADDRESS_TEMPLATES } from "./address";
import { AGE_VERIFICATION_TEMPLATES } from "./age-verification";
import { DRIVING_TEMPLATES } from "./driving";
import { FLEXIBLE_TEMPLATES } from "./flexible";
import { IDENTITY_TEMPLATES } from "./identity";
import { KYC_TEMPLATES } from "./kyc";
import { PAYMENT_TEMPLATES } from "./payment";
import type { RequestTemplate, TemplateCategory } from "./types";

const ALL_TEMPLATES_UNVALIDATED: RequestTemplate[] = [
	...AGE_VERIFICATION_TEMPLATES,
	...IDENTITY_TEMPLATES,
	...PAYMENT_TEMPLATES,
	...ADDRESS_TEMPLATES,
	...KYC_TEMPLATES,
	...DRIVING_TEMPLATES,
	...FLEXIBLE_TEMPLATES,
];

// Validate built-in templates at startup
const validatedTemplates: RequestTemplate[] = [];
for (const template of ALL_TEMPLATES_UNVALIDATED) {
	const validation = validateTemplate(template, CREDENTIAL_CASES);
	if (validation.valid) {
		validatedTemplates.push(template);
	} else {
		console.warn(
			`Built-in template "${template.name}" (${template.id}) failed validation:`,
			validation.errors,
		);
	}
}

export const BUILT_IN_TEMPLATES: RequestTemplate[] = validatedTemplates;

export function getTemplatesByCategory(
	category: TemplateCategory,
): RequestTemplate[] {
	return BUILT_IN_TEMPLATES.filter(
		(template) => template.category === category,
	);
}
