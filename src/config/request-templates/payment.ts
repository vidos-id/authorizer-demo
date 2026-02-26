import { generateReactKey } from "@/utils/id";
import type { RequestTemplate } from "./types";

export const PAYMENT_TEMPLATES: RequestTemplate[] = [
	{
		id: "payment-high-value-laptop-purchase",
		name: "Payment Laptop Purchase (iGrant)",
		description:
			"Request payment wallet attestation with DCQL and OID4VP transaction data for a high-value online laptop purchase. Uses the iGran's Payment Authenticator credential.",
		category: "payment",
		credentialRequests: [
			{
				id: "43bccd4e-22fa-4bf7-a088-ee6a7b9a071f",
				documentType: "payment_wallet_attestation",
				formatId: "payment_wallet_attestation_sd_jwt",
				format: "dc+sd-jwt",
				attributes: [
					"funding_source_alias_id",
					"funding_source_currency",
					"funding_source_iin",
					"funding_source_pan_last_four",
					"funding_source_scheme",
					"funding_source_type",
					"funding_source_icon",
				],
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
													value: "1299",
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
										value: "TechZone Online Store",
									},
								},
								{
									key: "description",
									reactKey: generateReactKey(),
									value: {
										type: "string",
										value: "Online purchase: Laptop",
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
