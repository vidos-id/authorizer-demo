import type { AttributeDefinition, CredentialCaseDefinition } from "./types";

const PAYMENT_WALLET_ATTESTATION_ATTRIBUTES: AttributeDefinition[] = [
	{
		id: "funding_source_alias_id",
		displayName: "Funding Source Alias ID",
		path: ["fundingSource", "aliasId"],
	},
	{
		id: "funding_source_currency",
		displayName: "Funding Source Currency",
		path: ["fundingSource", "currency"],
	},
	{
		id: "funding_source_iin",
		displayName: "Funding Source IIN",
		path: ["fundingSource", "iin"],
	},
	{
		id: "funding_source_pan_last_four",
		displayName: "Funding Source PAN Last Four",
		path: ["fundingSource", "panLastFour"],
	},
	{
		id: "funding_source_scheme",
		displayName: "Funding Source Scheme",
		path: ["fundingSource", "scheme"],
	},
	{
		id: "funding_source_type",
		displayName: "Funding Source Type",
		path: ["fundingSource", "type"],
	},
	{
		id: "funding_source_icon",
		displayName: "Funding Source Icon",
		path: ["fundingSource", "icon"],
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
				credentialType: "PaymentWalletAttestation",
				attributes: PAYMENT_WALLET_ATTESTATION_ATTRIBUTES,
			},
		],
	};
