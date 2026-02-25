import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/stores/appStore";
import { TransactionDataBuilder } from "./TransactionDataBuilder";

export function TransactionDataList() {
	const transactionDataEntries = useAppStore(
		(state) => state.transactionDataEntries,
	);
	const addTransactionDataEntry = useAppStore(
		(state) => state.addTransactionDataEntry,
	);
	const removeTransactionDataEntry = useAppStore(
		(state) => state.removeTransactionDataEntry,
	);

	return (
		<div className="space-y-4 md:space-y-6">
			<Label>Transaction Data</Label>
			<p className="text-sm text-muted-foreground">
				Configure OID4VP <code>transaction_data</code> entries. Each entry is
				serialized as base64url encoded JSON in request payloads.
			</p>

			{transactionDataEntries.length === 0 ? (
				<div className="p-6 border rounded-md border-dashed text-center">
					<p className="text-sm text-muted-foreground mb-4">
						(optional)
						<br />
						Add transaction data for OID4VP transaction authorization use cases.
					</p>
					<Button
						type="button"
						variant="outline"
						onClick={addTransactionDataEntry}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Transaction Data Entry
					</Button>
				</div>
			) : (
				<>
					<div className="space-y-2">
						{transactionDataEntries.map((entry, index) => (
							<TransactionDataItem
								key={entry.reactKey}
								entryKey={entry.reactKey}
								defaultOpen={index === 0}
								label={`Entry ${index + 1}`}
								onRemove={removeTransactionDataEntry}
							/>
						))}
					</div>
					<Separator className="my-4" />
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addTransactionDataEntry}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Transaction Data Entry
					</Button>
				</>
			)}
		</div>
	);
}

interface TransactionDataItemProps {
	entryKey: string;
	defaultOpen: boolean;
	label: string;
	onRemove: (reactKey: string) => void;
}

function TransactionDataItem({
	entryKey,
	defaultOpen,
	label,
	onRemove,
}: TransactionDataItemProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const transactionDataEntries = useAppStore(
		(state) => state.transactionDataEntries,
	);
	const entry = transactionDataEntries.find(
		(candidate) => candidate.reactKey === entryKey,
	);

	if (!entry) return null;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div
				className="border rounded-md"
				data-transaction-data-id={entry.reactKey}
			>
				<div className="flex items-center gap-2 p-2">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						onClick={(event) => {
							event.stopPropagation();
							onRemove(entry.reactKey);
						}}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
					<CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:bg-accent/50 rounded px-2 py-2 transition-colors">
						<ChevronRight
							className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
						/>
						<div className="flex flex-col items-start gap-0.5 flex-1">
							<span className="text-sm font-medium">{label}</span>
							<span className="text-xs font-mono text-muted-foreground">
								{entry.type.trim().length > 0 ? entry.type : "type not set"}
							</span>
						</div>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<div className="px-4 pb-4 pt-2 border-t">
						<TransactionDataBuilder entry={entry} />
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
