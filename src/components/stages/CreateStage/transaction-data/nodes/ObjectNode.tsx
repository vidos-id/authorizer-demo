import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TransactionDataNode } from "@/types/app";
import { createDefaultTransactionDataField } from "@/utils/transactionData";
import type { NodeEditorProps } from "./shared";

type ObjectNodeType = Extract<TransactionDataNode, { type: "object" }>;

interface ObjectNodeProps
	extends Omit<NodeEditorProps, "node" | "onChange" | "breadcrumb"> {
	node: ObjectNodeType;
	breadcrumb: string;
	onChange: (node: TransactionDataNode) => void;
	renderNodeEditor: (props: NodeEditorProps) => React.ReactNode;
}

export function ObjectNode({
	node,
	breadcrumb,
	path,
	hoveredPath,
	focusedPath,
	onHoverPathChange,
	onFocusPathChange,
	onChange,
	renderNodeEditor,
}: ObjectNodeProps) {
	return (
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground" title={breadcrumb}>
				{`${breadcrumb} fields`}
			</p>

			{node.entries.map((field) => {
				const fieldBreadcrumb = `${breadcrumb}.${field.key || "field"}`;

				return (
					<div key={field.reactKey} className="space-y-2">
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 shrink-0"
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
								<Trash2 className="h-3.5 w-3.5 text-destructive" />
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

						{renderNodeEditor({
							node: field.value,
							breadcrumb: fieldBreadcrumb,
							path: `${path}.${field.reactKey}`,
							hoveredPath,
							focusedPath,
							onHoverPathChange,
							onFocusPathChange,
							onChange: (nextValue) =>
								onChange({
									...node,
									entries: node.entries.map((candidate) =>
										candidate.reactKey === field.reactKey
											? { ...candidate, value: nextValue }
											: candidate,
									),
								}),
						})}
					</div>
				);
			})}

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
	);
}
