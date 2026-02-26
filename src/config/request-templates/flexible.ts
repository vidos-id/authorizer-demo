import { generateReactKey } from "@/utils/id";
import type { RequestTemplate } from "./types";

export const FLEXIBLE_TEMPLATES: RequestTemplate[] = [
	{
		id: "basic-identity-pid-or-mdl",
		name: "Basic Identity via PID or mDL",
		description:
			"Request basic identity using either PID or mDL as alternatives",
		category: "flexible",
		credentialRequests: [
			{
				id: "basic-identity-pid-cred",
				documentType: "pid",
				formatId: "pid_sd_jwt",
				format: "dc+sd-jwt",
				attributes: ["family_name", "given_name", "birth_date"],
				reactKey: generateReactKey(),
			},
			{
				id: "basic-identity-mdl-cred",
				documentType: "mdl",
				formatId: "mdl_mdoc",
				format: "mso_mdoc",
				attributes: ["family_name", "given_name", "birth_date"],
				reactKey: generateReactKey(),
			},
		],
		credentialSets: [
			{
				id: "basic-identity-set",
				options: [["basic-identity-pid-cred"], ["basic-identity-mdl-cred"]],
				required: true,
				reactKey: generateReactKey(),
			},
		],
		isBuiltIn: true,
	},
];
