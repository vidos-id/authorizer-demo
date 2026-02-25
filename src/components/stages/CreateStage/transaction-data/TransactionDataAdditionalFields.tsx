import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
	TransactionDataEntry,
	TransactionDataObjectField,
} from "@/types/app";
import { createDefaultTransactionDataField } from "@/utils/transactionData";
import { getIndicatorClass, isPathActive } from "./nodes";
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

	const typeLabel = entry.type || "entry";

	return (
		<div className="space-y-3">
			<Label title="additional_fields">Additional Fields</Label>

			{entry.customFields.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No additional fields yet.
				</p>
			) : (
				<div className="space-y-3">
					{entry.customFields.map((field) => {
						const fieldPath = `field:${field.reactKey}`;
						const indicatorClass = getIndicatorClass(
							isPathActive(fieldPath, hoveredPath),
							isPathActive(fieldPath, focusedPath),
						);

						return (
							<fieldset
								key={field.reactKey}
								data-tree-path={fieldPath}
								aria-label="additional_field"
								className={`space-y-2 pl-2 transition-colors ${indicatorClass}`}
								onMouseEnter={() => onHoverPathChange(fieldPath)}
								onMouseLeave={(event) => {
									const nextTarget = event.relatedTarget as HTMLElement | null;
									if (!nextTarget) {
										onHoverPathChange(null);
										return;
									}
									const nextContainer = nextTarget.closest("[data-tree-path]");
									if (!(nextContainer instanceof HTMLElement)) {
										onHoverPathChange(null);
										return;
									}
									onHoverPathChange(nextContainer.dataset.treePath ?? null);
								}}
								onFocusCapture={() => onFocusPathChange(fieldPath)}
								onBlurCapture={(event) => {
									if (
										event.currentTarget.contains(
											event.relatedTarget as Node | null,
										)
									) {
										return;
									}
									onFocusPathChange(null);
								}}
							>
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-7 w-7 shrink-0"
										onClick={() =>
											updateAdditionalFields(
												entry.customFields.filter(
													(candidate) => candidate.reactKey !== field.reactKey,
												),
											)
										}
										title={`remove ${field.key || "field"}`}
									>
										<Trash2 className="h-3.5 w-3.5 text-destructive" />
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
									path={`${fieldPath}.value`}
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
							</fieldset>
						);
					})}
				</div>
			)}

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={handleAddAdditionalField}
				title="additional_fields"
			>
				<Plus className="h-3 w-3 mr-1" />
				{`Add additional field to ${typeLabel}`}
			</Button>
		</div>
	);
}
