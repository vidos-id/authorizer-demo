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
	{
		id: "sca-payment-ferry-ticket",
		name: "SCA Payment Ferry Ticket",
		description:
			"Request payment wallet attestation with DCQL and OID4VP transaction data",
		category: "flexible",
		credentialRequests: [
			{
				id: "43bccd4e-22fa-4bf7-a088-ee6a7b9a071f",
				documentType: "payment_wallet_attestation",
				formatId: "payment_wallet_attestation_sd_jwt",
				format: "dc+sd-jwt",
				attributes: ["payment_currency", "payment_value", "payee"],
				reactKey: generateReactKey(),
			},
		],
		credentialSets: [],
		transactionDataEntries: [
			{
				reactKey: generateReactKey(),
				type: "payment_data",
				credentialIds: ["43bccd4e-22fa-4bf7-a088-ee6a7b9a071f"],
				hashesAlg: ["sha-256"],
				customFields: [
					{
						key: "payment_data",
						reactKey: generateReactKey(),
						value: {
							type: "object",
							entries: [
								{
									key: "currency_amount",
									reactKey: generateReactKey(),
									value: {
										type: "object",
										entries: [
											{
												key: "currency",
												reactKey: generateReactKey(),
												value: {
													type: "string",
													value: "EUR",
												},
											},
											{
												key: "value",
												reactKey: generateReactKey(),
												value: {
													type: "number",
													value: "25",
												},
											},
										],
									},
								},
								{
									key: "payee",
									reactKey: generateReactKey(),
									value: {
										type: "string",
										value: "Fast Ferries",
									},
								},
							],
						},
					},
				],
			},
		],
		isBuiltIn: true,
	},
];
