import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TransactionDataNode } from "@/types/app";

interface BooleanNodeProps {
	node: Extract<TransactionDataNode, { type: "boolean" }>;
	onChange: (node: TransactionDataNode) => void;
}

export function BooleanNode({ node, onChange }: BooleanNodeProps) {
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
