import type {
	TransactionDataEntry,
	TransactionDataHashAlgorithm,
	TransactionDataNode,
	TransactionDataObjectField,
} from "@/types/app";
import { generateReactKey } from "@/utils/id";

export const TRANSACTION_DATA_HASH_ALGORITHMS: TransactionDataHashAlgorithm[] =
	["sha-256", "sha-384", "sha-512"];

export function createDefaultTransactionDataNode(): TransactionDataNode {
	return {
		type: "string",
		value: "",
	};
}

export function createDefaultTransactionDataField(
	key = "",
): TransactionDataObjectField {
	return {
		key,
		value: createDefaultTransactionDataNode(),
		reactKey: generateReactKey(),
	};
}

export function createDefaultTransactionDataEntry(): TransactionDataEntry {
	return {
		reactKey: generateReactKey(),
		type: "",
		credentialIds: [],
		hashesAlg: ["sha-256"],
		customFields: [],
	};
}

interface TransactionDataValidationResult {
	valid: boolean;
	errors: string[];
}

function validateTransactionDataNode(
	node: TransactionDataNode,
	path: string,
	errors: string[],
): void {
	if (node.type === "number") {
		if (node.value.trim().length === 0) {
			errors.push(`${path} has an empty number value`);
			return;
		}

		const parsed = Number(node.value);
		if (!Number.isFinite(parsed)) {
			errors.push(`${path} has an invalid number value`);
		}
		return;
	}

	if (node.type === "object") {
		const keys = new Set<string>();
		for (const field of node.entries) {
			const key = field.key.trim();
			if (key.length === 0) {
				errors.push(`${path} contains a custom field with empty key`);
				continue;
			}
			if (keys.has(key)) {
				errors.push(`${path} contains duplicate custom field key "${key}"`);
				continue;
			}
			keys.add(key);
			validateTransactionDataNode(field.value, `${path}.${key}`, errors);
		}
		return;
	}

	if (node.type === "array") {
		for (const [index, item] of node.items.entries()) {
			validateTransactionDataNode(item, `${path}[${index}]`, errors);
		}
	}
}

export function validateTransactionDataEntries(
	entries: TransactionDataEntry[],
	validCredentialIds: Set<string>,
): TransactionDataValidationResult {
	const errors: string[] = [];

	for (const [index, entry] of entries.entries()) {
		const entryLabel = `Transaction data entry ${index + 1}`;

		if (entry.type.trim().length === 0) {
			errors.push(`${entryLabel}: type is required`);
		}

		if (entry.credentialIds.length === 0) {
			errors.push(`${entryLabel}: at least one credential ID is required`);
		}

		for (const credentialId of entry.credentialIds) {
			if (!validCredentialIds.has(credentialId)) {
				errors.push(
					`${entryLabel}: credential ID "${credentialId}" does not exist in credential requests`,
				);
			}
		}

		for (const algorithm of entry.hashesAlg) {
			if (!TRANSACTION_DATA_HASH_ALGORITHMS.includes(algorithm)) {
				errors.push(
					`${entryLabel}: unsupported transaction_data_hashes_alg "${algorithm}"`,
				);
			}
		}

		const keys = new Set<string>();
		for (const field of entry.customFields) {
			const key = field.key.trim();
			if (key.length === 0) {
				errors.push(`${entryLabel}: custom field key is required`);
				continue;
			}
			if (keys.has(key)) {
				errors.push(`${entryLabel}: duplicate custom field key "${key}"`);
				continue;
			}
			keys.add(key);
			validateTransactionDataNode(field.value, `${entryLabel}.${key}`, errors);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

function mapTransactionDataNodeToJson(node: TransactionDataNode): unknown {
	if (node.type === "string") {
		return node.value;
	}

	if (node.type === "number") {
		return Number(node.value);
	}

	if (node.type === "boolean") {
		return node.value;
	}

	if (node.type === "null") {
		return null;
	}

	if (node.type === "array") {
		return node.items.map((item) => mapTransactionDataNodeToJson(item));
	}

	return node.entries.reduce<Record<string, unknown>>((acc, field) => {
		acc[field.key] = mapTransactionDataNodeToJson(field.value);
		return acc;
	}, {});
}

function encodeBase64UrlFromJson(value: unknown): string {
	const json = JSON.stringify(value);
	const bytes = new TextEncoder().encode(json);
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

export function serializeTransactionDataEntries(
	entries: TransactionDataEntry[],
): string[] {
	return entries.map((entry) => {
		const objectValue = entry.customFields.reduce<Record<string, unknown>>(
			(acc, field) => {
				acc[field.key] = mapTransactionDataNodeToJson(field.value);
				return acc;
			},
			{
				type: entry.type,
				credential_ids: entry.credentialIds,
				...(entry.hashesAlg.length > 0 && {
					transaction_data_hashes_alg: entry.hashesAlg,
				}),
			},
		);

		return encodeBase64UrlFromJson(objectValue);
	});
}
