import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
	TransactionDataEntry,
	TransactionDataObjectField,
} from "@/types/app";
import { createDefaultTransactionDataField } from "@/utils/transactionData";
import { TransactionDataNodeEditor } from "./TransactionDataNodeEditor";

interface TransactionDataAdditionalFieldsProps {
	entry: TransactionDataEntry;
	hoveredPath: string | null;
	focusedPath: string | null;
	onHoverPathChange: (path: string | null) => void;
	onFocusPathChange: (path: string | null) => void;
	onUpdateEntry: (updates: Partial<TransactionDataEntry>) => void;
}

export function TransactionDataAdditionalFields({
	entry,
	hoveredPath,
	focusedPath,
	onHoverPathChange,
	onFocusPathChange,
	onUpdateEntry,
}: TransactionDataAdditionalFieldsProps) {
	const updateAdditionalFields = (fields: TransactionDataObjectField[]) => {
		onUpdateEntry({ customFields: fields });
	};

	const handleAddAdditionalField = () => {
		updateAdditionalFields([
			...entry.customFields,
			createDefaultTransactionDataField(),
		]);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddAdditionalField}
					title="additional_fields"
				>
					<Plus className="h-3 w-3 mr-1" />
					Add Field to Additional Fields
				</Button>
				<Label title="additional_fields">Additional Fields</Label>
			</div>

			{entry.customFields.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No additional fields yet.
				</p>
			) : (
				<div className="space-y-3">
					{entry.customFields.map((field) => (
						<div key={field.reactKey} className="space-y-2 border rounded p-3">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() =>
										updateAdditionalFields(
											entry.customFields.filter(
												(candidate) => candidate.reactKey !== field.reactKey,
											),
										)
									}
									title={`remove ${field.key || "field"}`}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
								<Input
									value={field.key}
									onChange={(event) => {
										updateAdditionalFields(
											entry.customFields.map((candidate) =>
												candidate.reactKey === field.reactKey
													? { ...candidate, key: event.target.value }
													: candidate,
											),
										);
									}}
									placeholder="Field Key"
									title="field_key"
									aria-label="Field Key"
									className="font-mono text-xs"
								/>
							</div>

							<TransactionDataNodeEditor
								node={field.value}
								breadcrumb={field.key || "field"}
								path={`field:${field.reactKey}`}
								hoveredPath={hoveredPath}
								focusedPath={focusedPath}
								onHoverPathChange={onHoverPathChange}
								onFocusPathChange={onFocusPathChange}
								onChange={(nextValue) =>
									updateAdditionalFields(
										entry.customFields.map((candidate) =>
											candidate.reactKey === field.reactKey
												? { ...candidate, value: nextValue }
												: candidate,
										),
									)
								}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
