import type {
	CredentialRequestWithId,
	CredentialSet,
	ResponseModeConfig,
	TransactionDataEntry,
} from "@/types/app";
import { buildDCQLQueryMultiple } from "@/utils/queryBuilder";
import { serializeTransactionDataEntries } from "@/utils/transactionData";

export function buildAuthorizationRequestBody(
	credentialRequests: CredentialRequestWithId[],
	responseModeConfig: ResponseModeConfig,
	credentialSets?: CredentialSet[],
	transactionDataEntries?: TransactionDataEntry[],
) {
	const query = buildDCQLQueryMultiple(
		credentialRequests,
		credentialSets,
		responseModeConfig.profile,
	);
	const transactionData =
		transactionDataEntries && transactionDataEntries.length > 0
			? serializeTransactionDataEntries(transactionDataEntries)
			: undefined;

	const isDCAPI =
		responseModeConfig.mode === "dc_api" ||
		responseModeConfig.mode === "dc_api.jwt";

	return {
		responseMode: responseModeConfig.mode,
		responseType: "vp_token",
		query,
		...(transactionData && { transaction_data: transactionData }),
		...(responseModeConfig.profile && {
			profile: responseModeConfig.profile,
		}),
		...(isDCAPI && {
			protocol: responseModeConfig.dcApiProtocol,
			...(responseModeConfig.dcApiProtocol === "openid4vp-v1-signed" && {
				expectedOrigins: [window.location.origin],
			}),
		}),
	};
}
