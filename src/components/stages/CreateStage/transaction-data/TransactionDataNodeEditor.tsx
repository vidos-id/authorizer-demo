import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ArrayNode,
	BooleanNode,
	getIndicatorClass,
	isPathActive,
	type NodeEditorProps,
	NullNode,
	NumberNode,
	ObjectNode,
	StringNode,
} from "./nodes";

export type { NodeEditorProps } from "./nodes";
export { isPathActive } from "./nodes";

export function TransactionDataNodeEditor({
	node,
	breadcrumb,
	path,
	hoveredPath,
	focusedPath,
	onHoverPathChange,
	onFocusPathChange,
	onChange,
}: NodeEditorProps) {
	const isHovered = isPathActive(path, hoveredPath);
	const isFocused = isPathActive(path, focusedPath);
	const indicatorClass = getIndicatorClass(isHovered, isFocused);

	const renderNodeEditor = (props: NodeEditorProps) => (
		<TransactionDataNodeEditor {...props} />
	);

	const renderTypeSpecificEditor = () => {
		switch (node.type) {
			case "string":
				return <StringNode node={node} onChange={onChange} />;
			case "number":
				return <NumberNode node={node} onChange={onChange} />;
			case "boolean":
				return <BooleanNode node={node} onChange={onChange} />;
			case "null":
				return <NullNode />;
			case "array":
				return (
					<ArrayNode
						node={node}
						breadcrumb={breadcrumb}
						path={path}
						hoveredPath={hoveredPath}
						focusedPath={focusedPath}
						onHoverPathChange={onHoverPathChange}
						onFocusPathChange={onFocusPathChange}
						onChange={onChange}
						renderNodeEditor={renderNodeEditor}
					/>
				);
			case "object":
				return (
					<ObjectNode
						node={node}
						breadcrumb={breadcrumb}
						path={path}
						hoveredPath={hoveredPath}
						focusedPath={focusedPath}
						onHoverPathChange={onHoverPathChange}
						onFocusPathChange={onFocusPathChange}
						onChange={onChange}
						renderNodeEditor={renderNodeEditor}
					/>
				);
		}
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
