import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	CredentialRequestWithId,
	TransactionDataEntry,
} from "@/types/app";
import { TRANSACTION_DATA_HASH_ALGORITHMS } from "@/utils/transactionData";

interface TransactionDataCoreFieldsProps {
	entry: TransactionDataEntry;
	credentialRequests: CredentialRequestWithId[];
	onUpdateEntry: (updates: Partial<TransactionDataEntry>) => void;
}

function formatHashAlgorithmDisplay(algorithm: string): string {
	return algorithm.toUpperCase();
}

export function TransactionDataCoreFields({
	entry,
	credentialRequests,
	onUpdateEntry,
}: TransactionDataCoreFieldsProps) {
	const handleAddCredentialId = (credentialId: string) => {
		if (entry.credentialIds.includes(credentialId)) return;
		onUpdateEntry({ credentialIds: [...entry.credentialIds, credentialId] });
	};

	const handleRemoveCredentialId = (credentialId: string) => {
		onUpdateEntry({
			credentialIds: entry.credentialIds.filter((id) => id !== credentialId),
		});
	};

	const toggleHashAlgorithm = (
		algorithm: (typeof TRANSACTION_DATA_HASH_ALGORITHMS)[number],
	) => {
		const next = entry.hashesAlg.includes(algorithm)
			? entry.hashesAlg.filter((value) => value !== algorithm)
			: [...entry.hashesAlg, algorithm];
		onUpdateEntry({ hashesAlg: next });
	};

	const availableCredentialRequests = credentialRequests.filter(
		(request) => !entry.credentialIds.includes(request.id),
	);

	return (
		<>
			<div className="space-y-2">
				<Label htmlFor={`transaction-type-${entry.reactKey}`} title="type">
					Type
				</Label>
				<Input
					id={`transaction-type-${entry.reactKey}`}
					value={entry.type}
					onChange={(event) => onUpdateEntry({ type: event.target.value })}
					placeholder="e.g., payment_data"
				/>
			</div>

			<div className="space-y-2">
				<Label title="credential_ids">Credential IDs</Label>
				{entry.credentialIds.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{entry.credentialIds.map((credentialId) => (
							<Badge
								key={credentialId}
								variant="secondary"
								className="text-xs font-mono flex items-center gap-1.5 pr-1"
							>
								<span>{credentialId}</span>
								<button
									type="button"
									onClick={() => handleRemoveCredentialId(credentialId)}
									className="hover:bg-muted-foreground/20 rounded p-0.5 transition-colors"
									title={`remove credential_ids.${credentialId}`}
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				)}

				<Select value="" onValueChange={handleAddCredentialId}>
					<SelectTrigger size="sm" className="w-auto" title="credential_ids">
						<Plus className="h-3 w-3 mr-1" />
						<SelectValue placeholder="Add Credential ID" />
					</SelectTrigger>
					<SelectContent>
						{availableCredentialRequests.length === 0 ? (
							<div className="px-2 py-1.5 text-xs text-muted-foreground">
								No credential IDs available
							</div>
						) : (
							availableCredentialRequests.map((request) => (
								<SelectItem
									key={request.id}
									value={request.id}
									title="credential_ids"
								>
									<span className="font-mono text-xs">{request.id}</span>
									{request.documentType && (
										<span className="text-muted-foreground text-xs">
											{" "}
											({request.documentType})
										</span>
									)}
								</SelectItem>
							))
						)}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label title="transaction_data_hashes_alg">
					Transaction Data Hash Algorithms
				</Label>
				<div className="space-y-2">
					{TRANSACTION_DATA_HASH_ALGORITHMS.map((algorithm) => (
						<div key={algorithm} className="flex items-center gap-2">
							<Checkbox
								id={`${entry.reactKey}-${algorithm}`}
								checked={entry.hashesAlg.includes(algorithm)}
								onCheckedChange={() => toggleHashAlgorithm(algorithm)}
							/>
							<Label
								htmlFor={`${entry.reactKey}-${algorithm}`}
								className="text-sm font-normal"
								title="transaction_data_hashes_alg"
							>
								{formatHashAlgorithmDisplay(algorithm)}
							</Label>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
