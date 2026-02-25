import type { TransactionDataNode } from "@/types/app";

export interface TreePathProps {
	path: string;
	hoveredPath: string | null;
	focusedPath: string | null;
	onHoverPathChange: (path: string | null) => void;
	onFocusPathChange: (path: string | null) => void;
}

export interface NodeEditorProps extends TreePathProps {
	node: TransactionDataNode;
	breadcrumb: string;
	onChange: (node: TransactionDataNode) => void;
}

export function isPathActive(
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

export function getIndicatorClass(
	isHovered: boolean,
	isFocused: boolean,
): string {
	if (isFocused) {
		return "border-l-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40";
	}
	if (isHovered) {
		return "border-l-2 border-sky-500 bg-sky-50/40 dark:bg-sky-950/40";
	}
	return "border-l-2 border-border";
}
