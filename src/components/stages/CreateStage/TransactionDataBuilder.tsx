import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/stores/appStore";
import type { TransactionDataEntry } from "@/types/app";
import { validateTransactionDataEntries } from "@/utils/transactionData";
import { TransactionDataAdditionalFields } from "./transaction-data/TransactionDataAdditionalFields";
import { TransactionDataCoreFields } from "./transaction-data/TransactionDataCoreFields";

interface TransactionDataBuilderProps {
	entry: TransactionDataEntry;
}

export function TransactionDataBuilder({ entry }: TransactionDataBuilderProps) {
	const credentialRequests = useAppStore((state) => state.credentialRequests);
	const updateTransactionDataEntry = useAppStore(
		(state) => state.updateTransactionDataEntry,
	);

	const [hoveredPath, setHoveredPath] = useState<string | null>(null);
	const [focusedPath, setFocusedPath] = useState<string | null>(null);

	const validation = validateTransactionDataEntries(
		[entry],
		new Set(credentialRequests.map((request) => request.id)),
	);

	const handleUpdateEntry = (updates: Partial<TransactionDataEntry>) => {
		updateTransactionDataEntry(entry.reactKey, updates);
	};

	return (
		<div className="space-y-4">
			{validation.errors.length > 0 && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						<ul className="list-disc list-inside space-y-1 text-sm">
							{validation.errors.map((error) => (
								<li key={error}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			<TransactionDataCoreFields
				entry={entry}
				credentialRequests={credentialRequests}
				onUpdateEntry={handleUpdateEntry}
			/>

			<TransactionDataAdditionalFields
				entry={entry}
				hoveredPath={hoveredPath}
				focusedPath={focusedPath}
				onHoverPathChange={setHoveredPath}
				onFocusPathChange={setFocusedPath}
				onUpdateEntry={handleUpdateEntry}
			/>
		</div>
	);
}
