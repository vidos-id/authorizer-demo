import { AlertCircle, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useAppStore } from "@/stores/appStore";
import type {
	TransactionDataEntry,
	TransactionDataNode,
	TransactionDataObjectField,
} from "@/types/app";
import { generateReactKey } from "@/utils/id";
import {
	createDefaultTransactionDataField,
	createDefaultTransactionDataNode,
	TRANSACTION_DATA_HASH_ALGORITHMS,
	validateTransactionDataEntries,
} from "@/utils/transactionData";

interface TransactionDataBuilderProps {
	entry: TransactionDataEntry;
}

function formatHashAlgorithmDisplay(algorithm: string): string {
	return algorithm.toUpperCase();
}

function isPathActive(
	candidatePath: string,
	activePath: string | null,
): boolean {
	if (!activePath) return false;
	return (
		activePath === candidatePath ||
		activePath.startsWith(`${candidatePath}.`) ||
		activePath.startsWith(`${candidatePath}[`)
	);
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

	const updateEntry = (updates: Partial<TransactionDataEntry>) => {
		updateTransactionDataEntry(entry.reactKey, updates);
	};

	const handleAddCredentialId = (credentialId: string) => {
		if (entry.credentialIds.includes(credentialId)) return;
		updateEntry({ credentialIds: [...entry.credentialIds, credentialId] });
	};

	const handleRemoveCredentialId = (credentialId: string) => {
		updateEntry({
			credentialIds: entry.credentialIds.filter((id) => id !== credentialId),
		});
	};

	const toggleHashAlgorithm = (
		algorithm: (typeof TRANSACTION_DATA_HASH_ALGORITHMS)[number],
	) => {
		const next = entry.hashesAlg.includes(algorithm)
			? entry.hashesAlg.filter((value) => value !== algorithm)
			: [...entry.hashesAlg, algorithm];
		updateEntry({ hashesAlg: next });
	};

	const getAvailableCredentialRequests = () => {
		return credentialRequests.filter(
			(request) => !entry.credentialIds.includes(request.id),
		);
	};

	const updateAdditionalFields = (fields: TransactionDataObjectField[]) => {
		updateEntry({ customFields: fields });
	};

	const handleAddAdditionalField = () => {
		updateAdditionalFields([
			...entry.customFields,
			createDefaultTransactionDataField(),
		]);
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

			<div className="space-y-2">
				<Label htmlFor={`transaction-type-${entry.reactKey}`} title="type">
					Type
				</Label>
				<Input
					id={`transaction-type-${entry.reactKey}`}
					value={entry.type}
					onChange={(event) => updateEntry({ type: event.target.value })}
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
						{getAvailableCredentialRequests().length === 0 ? (
							<div className="px-2 py-1.5 text-xs text-muted-foreground">
								No credential IDs available
							</div>
						) : (
							getAvailableCredentialRequests().map((request) => (
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
							<div
								key={field.reactKey}
								className="space-y-2 border rounded p-3"
							>
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

								<RecursiveNodeEditor
									node={field.value}
									fieldLabel={field.key}
									breadcrumb={field.key || "field"}
									path={`field:${field.reactKey}`}
									hoveredPath={hoveredPath}
									focusedPath={focusedPath}
									onHoverPathChange={setHoveredPath}
									onFocusPathChange={setFocusedPath}
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
		</div>
	);
}

interface RecursiveNodeEditorProps {
	node: TransactionDataNode;
	fieldLabel?: string;
	breadcrumb: string;
	path: string;
	hoveredPath: string | null;
	focusedPath: string | null;
	onHoverPathChange: (path: string | null) => void;
	onFocusPathChange: (path: string | null) => void;
	onChange: (node: TransactionDataNode) => void;
}

function RecursiveNodeEditor({
	node,
	breadcrumb,
	path,
	hoveredPath,
	focusedPath,
	onHoverPathChange,
	onFocusPathChange,
	onChange,
}: RecursiveNodeEditorProps) {
	const isHovered = isPathActive(path, hoveredPath);
	const isFocused = isPathActive(path, focusedPath);
	const arrayItemIdsRef = useRef<string[]>([]);

	const indicatorClass = isFocused
		? "border-l-2 border-emerald-500 bg-emerald-50/40"
		: isHovered
			? "border-l-2 border-sky-500 bg-sky-50/40"
			: "border-l-2 border-transparent";

	const renderTypeSpecificEditor = () => {
		if (node.type === "string") {
			return (
				<Input
					value={node.value}
					onChange={(event) =>
						onChange({
							...node,
							value: event.target.value,
						})
					}
					placeholder="String Value"
					title="string"
				/>
			);
		}

		if (node.type === "number") {
			return (
				<Input
					type="number"
					value={node.value}
					onChange={(event) =>
						onChange({
							...node,
							value: event.target.value,
						})
					}
					placeholder="Number Value"
					title="number"
				/>
			);
		}

		if (node.type === "boolean") {
			return (
				<Select
					value={node.value ? "true" : "false"}
					onValueChange={(value) =>
						onChange({
							...node,
							value: value === "true",
						})
					}
				>
					<SelectTrigger className="w-[140px]" title="boolean">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="true" title="boolean">
							True
						</SelectItem>
						<SelectItem value="false" title="boolean">
							False
						</SelectItem>
					</SelectContent>
				</Select>
			);
		}

		if (node.type === "null") {
			return <p className="text-xs text-muted-foreground">Value is Null</p>;
		}

		if (node.type === "array") {
			while (arrayItemIdsRef.current.length < node.items.length) {
				arrayItemIdsRef.current.push(generateReactKey());
			}
			if (arrayItemIdsRef.current.length > node.items.length) {
				arrayItemIdsRef.current = arrayItemIdsRef.current.slice(
					0,
					node.items.length,
				);
			}

			const rows = node.items.map((item, index) => ({
				id: arrayItemIdsRef.current[index],
				index,
				item,
				itemLabel: `${breadcrumb}[${index + 1}]`,
			}));

			return (
				<div className="space-y-2 border rounded p-3">
					<p className="text-xs text-muted-foreground" title={breadcrumb}>
						{`${breadcrumb} items`}
					</p>

					{rows.map((row) => (
						<div key={row.id} className="space-y-2 border rounded p-2">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => {
										arrayItemIdsRef.current.splice(row.index, 1);
										onChange({
											...node,
											items: node.items.filter((_, i) => i !== row.index),
										});
									}}
									title={`remove ${row.itemLabel}`}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
								<p
									className="text-xs text-muted-foreground"
									title={row.itemLabel}
								>
									{row.itemLabel}
								</p>
							</div>

							<RecursiveNodeEditor
								node={row.item}
								breadcrumb={row.itemLabel}
								path={`${path}[${row.index}]`}
								hoveredPath={hoveredPath}
								focusedPath={focusedPath}
								onHoverPathChange={onHoverPathChange}
								onFocusPathChange={onFocusPathChange}
								onChange={(nextItem) =>
									onChange({
										...node,
										items: node.items.map((candidate, i) =>
											i === row.index ? nextItem : candidate,
										),
									})
								}
							/>
						</div>
					))}

					<div className="pt-1">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								arrayItemIdsRef.current.push(generateReactKey());
								onChange({
									...node,
									items: [...node.items, createDefaultTransactionDataNode()],
								});
							}}
							title={`add item to ${breadcrumb}`}
						>
							<Plus className="h-3 w-3 mr-1" />
							{`Add Item to ${breadcrumb}`}
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-2 border rounded p-3">
				<p className="text-xs text-muted-foreground" title={breadcrumb}>
					{`${breadcrumb} fields`}
				</p>

				{node.entries.map((field) => {
					const fieldBreadcrumb = `${breadcrumb}.${field.key || "field"}`;

					return (
						<div key={field.reactKey} className="space-y-2 border rounded p-2">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() =>
										onChange({
											...node,
											entries: node.entries.filter(
												(candidate) => candidate.reactKey !== field.reactKey,
											),
										})
									}
									title={`remove ${fieldBreadcrumb}`}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
								<Input
									value={field.key}
									onChange={(event) =>
										onChange({
											...node,
											entries: node.entries.map((candidate) =>
												candidate.reactKey === field.reactKey
													? { ...candidate, key: event.target.value }
													: candidate,
											),
										})
									}
									placeholder="Field Key"
									title="field_key"
									aria-label="Field Key"
									className="font-mono text-xs"
								/>
							</div>

							<RecursiveNodeEditor
								node={field.value}
								fieldLabel={field.key}
								breadcrumb={fieldBreadcrumb}
								path={`${path}.${field.reactKey}`}
								hoveredPath={hoveredPath}
								focusedPath={focusedPath}
								onHoverPathChange={onHoverPathChange}
								onFocusPathChange={onFocusPathChange}
								onChange={(nextValue) =>
									onChange({
										...node,
										entries: node.entries.map((candidate) =>
											candidate.reactKey === field.reactKey
												? { ...candidate, value: nextValue }
												: candidate,
										),
									})
								}
							/>
						</div>
					);
				})}

				<div className="pt-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							onChange({
								...node,
								entries: [...node.entries, createDefaultTransactionDataField()],
							})
						}
						title={`add field to ${breadcrumb}`}
					>
						<Plus className="h-3 w-3 mr-1" />
						{`Add Field to ${breadcrumb}`}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<fieldset
			data-tree-path={path}
			className={`space-y-2 pl-2 transition-colors ${indicatorClass}`}
			aria-label="transaction_data_node"
			onMouseEnter={() => onHoverPathChange(path)}
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

				const nextPath = nextContainer.dataset.treePath;
				onHoverPathChange(nextPath ?? null);
			}}
			onFocusCapture={() => onFocusPathChange(path)}
			onBlurCapture={(event) => {
				if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
					return;
				}
				onFocusPathChange(null);
			}}
		>
			<div className="flex items-center gap-2">
				<Select
					value={node.type}
					onValueChange={(value) => {
						if (value === "object") {
							onChange({ type: "object", entries: [] });
							return;
						}
						if (value === "array") {
							onChange({ type: "array", items: [] });
							return;
						}
						if (value === "string") {
							onChange({ type: "string", value: "" });
							return;
						}
						if (value === "number") {
							onChange({ type: "number", value: "" });
							return;
						}
						if (value === "boolean") {
							onChange({ type: "boolean", value: false });
							return;
						}
						onChange({ type: "null" });
					}}
				>
					<SelectTrigger className="w-[180px]" title="type">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="object" title="type">
							Object
						</SelectItem>
						<SelectItem value="array" title="type">
							Array
						</SelectItem>
						<SelectItem value="string" title="type">
							String
						</SelectItem>
						<SelectItem value="number" title="type">
							Number
						</SelectItem>
						<SelectItem value="boolean" title="type">
							Boolean
						</SelectItem>
						<SelectItem value="null" title="type">
							Null
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{renderTypeSpecificEditor()}
		</fieldset>
	);
}
