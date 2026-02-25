import { Input } from "@/components/ui/input";
import type { TransactionDataNode } from "@/types/app";

interface NumberNodeProps {
	node: Extract<TransactionDataNode, { type: "number" }>;
	onChange: (node: TransactionDataNode) => void;
}

export function NumberNode({ node, onChange }: NumberNodeProps) {
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
