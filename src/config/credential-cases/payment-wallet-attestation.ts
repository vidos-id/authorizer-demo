import type { AttributeDefinition, CredentialCaseDefinition } from "./types";

const PAYMENT_WALLET_ATTESTATION_ATTRIBUTES: AttributeDefinition[] = [
	{
		id: "payment_currency",
		displayName: "Payment Currency",
		path: ["payment_data", "currency_amount", "currency"],
	},
	{
		id: "payment_value",
		displayName: "Payment Value",
		path: ["payment_data", "currency_amount", "value"],
	},
	{
		id: "payee",
		displayName: "Payee",
		path: ["payment_data", "payee"],
	},
];

export const PAYMENT_WALLET_ATTESTATION_CREDENTIAL_CASE_DEFINITION: CredentialCaseDefinition =
	{
		id: "payment_wallet_attestation",
		displayName: "Payment Wallet Attestation",
		formats: [
			{
				id: "payment_wallet_attestation_sd_jwt",
				format: "dc+sd-jwt",
				displayName: "SD-JWT VC",
				credentialType: "urn:eudi:wallet:pwa:1",
				attributes: PAYMENT_WALLET_ATTESTATION_ATTRIBUTES,
			},
		],
	};
