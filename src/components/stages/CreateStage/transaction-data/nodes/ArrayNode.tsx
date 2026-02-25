import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { TransactionDataNode } from "@/types/app";
import { generateReactKey } from "@/utils/id";
import { createDefaultTransactionDataNode } from "@/utils/transactionData";
import type { NodeEditorProps } from "./shared";

type ArrayNodeType = Extract<TransactionDataNode, { type: "array" }>;

interface ArrayNodeProps
	extends Omit<NodeEditorProps, "node" | "onChange" | "breadcrumb"> {
	node: ArrayNodeType;
	breadcrumb: string;
	onChange: (node: TransactionDataNode) => void;
	renderNodeEditor: (props: NodeEditorProps) => React.ReactNode;
}

export function ArrayNode({
	node,
	breadcrumb,
	path,
	hoveredPath,
	focusedPath,
	onHoverPathChange,
	onFocusPathChange,
	onChange,
	renderNodeEditor,
}: ArrayNodeProps) {
	const arrayItemIdsRef = useRef<string[]>([]);

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
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground" title={breadcrumb}>
				{`${breadcrumb} items`}
			</p>

			{rows.map((row) => (
				<div key={row.id} className="space-y-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7 shrink-0"
							onClick={() => {
								arrayItemIdsRef.current.splice(row.index, 1);
								onChange({
									...node,
									items: node.items.filter((_, i) => i !== row.index),
								});
							}}
							title={`remove ${row.itemLabel}`}
						>
							<Trash2 className="h-3.5 w-3.5 text-destructive" />
						</Button>
						<p className="text-xs text-muted-foreground" title={row.itemLabel}>
							{row.itemLabel}
						</p>
					</div>

					{renderNodeEditor({
						node: row.item,
						breadcrumb: row.itemLabel,
						path: `${path}[${row.index}]`,
						hoveredPath,
						focusedPath,
						onHoverPathChange,
						onFocusPathChange,
						onChange: (nextItem) =>
							onChange({
								...node,
								items: node.items.map((candidate, i) =>
									i === row.index ? nextItem : candidate,
								),
							}),
					})}
				</div>
			))}

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
	);
}
