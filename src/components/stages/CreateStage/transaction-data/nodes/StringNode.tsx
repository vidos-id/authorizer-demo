import { Input } from "@/components/ui/input";
import type { TransactionDataNode } from "@/types/app";

interface StringNodeProps {
	node: Extract<TransactionDataNode, { type: "string" }>;
	onChange: (node: TransactionDataNode) => void;
}

export function StringNode({ node, onChange }: StringNodeProps) {
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
