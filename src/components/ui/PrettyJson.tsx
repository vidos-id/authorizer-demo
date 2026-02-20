import {
	Check,
	ChevronRight,
	Clipboard,
	Copy,
	ExternalLink,
	WrapText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type WrapMode = "auto" | "on" | "off";

interface CopyButtonProps {
	value: string;
	fieldKey?: string;
	className?: string;
}

function CopyButton({ value, fieldKey, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const title = fieldKey ? `Copy "${fieldKey}"` : "Copy value";

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={cn("transition-opacity", className)}
			title={title}
		>
			{copied ? (
				<Check className="h-3 w-3 text-green-600" />
			) : (
				<Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
			)}
		</button>
	);
}

function CopyJsonButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="opacity-0 group-hover/json:opacity-100 sticky top-0 right-0 float-right z-10 flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded shadow-sm transition-opacity"
			title="Copy entire JSON"
		>
			{copied ? (
				<>
					<Check className="h-3.5 w-3.5 text-green-600" />
					<span className="text-green-600">Copied!</span>
				</>
			) : (
				<>
					<Clipboard className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
					<span className="text-gray-600 dark:text-gray-400">Copy JSON</span>
				</>
			)}
		</button>
	);
}

const WRAP_MODE_LABELS: Record<WrapMode, string> = {
	auto: "Wrap: Auto",
	on: "Wrap: On",
	off: "Wrap: Off",
};

function WrapToggleButton({
	wrapMode,
	onToggle,
}: {
	wrapMode: WrapMode;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={cn(
				"opacity-0 group-hover/json:opacity-100 sticky top-0 right-0 float-right z-10 flex items-center gap-1.5 px-2 py-1 text-xs rounded shadow-sm transition-opacity mr-1",
				wrapMode === "on"
					? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
					: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
			)}
			title={`Text wrapping: ${wrapMode}. Click to toggle.`}
		>
			<WrapText
				className={cn(
					"h-3.5 w-3.5",
					wrapMode === "on"
						? "text-blue-600 dark:text-blue-400"
						: "text-gray-600 dark:text-gray-400",
				)}
			/>
			<span
				className={cn(
					wrapMode === "on"
						? "text-blue-600 dark:text-blue-400"
						: "text-gray-600 dark:text-gray-400",
				)}
			>
				{WRAP_MODE_LABELS[wrapMode]}
			</span>
		</button>
	);
}

/**
 * Checks if a string is a long unbreakable sequence that needs aggressive wrapping.
 */
function isLongUnbreakable(str: string): boolean {
	if (str.length < 40) return false;
	if (/\u00a0/.test(str)) return true;
	if (str.length > 60 && !/\s/.test(str)) return true;
	return false;
}

/**
 * Checks if a field key path indicates an x5c certificate value.
 */
function isX5cPath(path: string): boolean {
	return /\.x5c\[\d+\]$/.test(path) || /\.x5c$/.test(path);
}

function getX5cViewerUrl(cert: string): string {
	return `https://x509.io/?cert=${encodeURIComponent(cert)}`;
}

interface PrettyJsonProps {
	data: unknown;
	className?: string;
	maxStringLength?: number;
	/** Controls text wrapping. "auto" wraps only problematic strings. Default: "auto" */
	defaultWrapMode?: WrapMode;
}

export function PrettyJson({
	data,
	className,
	maxStringLength,
	defaultWrapMode = "auto",
}: PrettyJsonProps) {
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
	const [wrapMode, setWrapMode] = useState<WrapMode>(defaultWrapMode);

	const cycleWrapMode = () => {
		setWrapMode((prev) => {
			if (prev === "auto") return "on";
			if (prev === "on") return "off";
			return "auto";
		});
	};

	const shouldWrapString = (str: string): boolean => {
		if (wrapMode === "on") return true;
		if (wrapMode === "off") return false;
		// auto: only wrap long unbreakable strings
		return isLongUnbreakable(str);
	};

	const truncateString = (str: string): { display: string; full: string } => {
		if (!maxStringLength || str.length <= maxStringLength) {
			return { display: str, full: str };
		}

		const halfLength = Math.floor((maxStringLength - 3) / 2);
		const start = str.slice(0, halfLength);
		const end = str.slice(-halfLength);
		return { display: `${start}...${end}`, full: str };
	};
	const toggleCollapse = (path: string) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	};

	// Check if array can be rendered compactly (primitives only, short total length)
	const canRenderCompact = (arr: unknown[]): boolean => {
		if (arr.length === 0) return true;
		if (arr.length > 5) return false;

		const allPrimitives = arr.every(
			(item) =>
				item === null ||
				typeof item === "boolean" ||
				typeof item === "number" ||
				typeof item === "string",
		);
		if (!allPrimitives) return false;

		// Check total serialized length
		const serialized = JSON.stringify(arr);
		return serialized.length <= 60;
	};

	const renderCompactArray = (
		arr: unknown[],
		path: string,
	): React.ReactNode => {
		return (
			<span>
				<span className="text-gray-500">[</span>
				<span className="px-1">
					{arr.map((item, index) => {
						const itemKey = `${path}[${index}]`;
						return (
							<span key={itemKey}>
								{renderPrimitiveInline(item)}
								{index < arr.length - 1 && (
									<span className="text-gray-500">, </span>
								)}
							</span>
						);
					})}
				</span>
				<span className="text-gray-500">]</span>
			</span>
		);
	};

	const renderPrimitiveInline = (value: unknown): React.ReactNode => {
		if (value === null) {
			return <span className="text-gray-500">null</span>;
		}
		if (typeof value === "boolean") {
			return (
				<span className="text-purple-600 dark:text-purple-400">
					{String(value)}
				</span>
			);
		}
		if (typeof value === "number") {
			return (
				<span className="text-amber-600 dark:text-amber-400">{value}</span>
			);
		}
		if (typeof value === "string") {
			return (
				<span className="text-green-600 dark:text-green-400">"{value}"</span>
			);
		}
		return <span className="text-gray-500">{String(value)}</span>;
	};

	const renderValue = (
		value: unknown,
		depth: number,
		path: string,
		fieldKey?: string,
		trailingComma?: boolean,
	): React.ReactNode => {
		const comma = trailingComma ? (
			<span className="text-gray-500">,</span>
		) : null;

		if (value === null) {
			return (
				<span>
					<span className="text-gray-500">null</span>
					{comma}
				</span>
			);
		}

		if (typeof value === "boolean") {
			return (
				<span>
					<span className="text-purple-600 dark:text-purple-400">
						{String(value)}
					</span>
					{comma}
				</span>
			);
		}

		if (typeof value === "number") {
			return (
				<span>
					<span className="text-amber-600 dark:text-amber-400">{value}</span>
					{comma}
				</span>
			);
		}

		if (typeof value === "string") {
			const { display, full } = truncateString(value);
			const isTruncated = display !== full;
			const showCopy = full.length > 10 || isTruncated;
			const wrap = shouldWrapString(display);
			const x5c = isX5cPath(path);

			return (
				<span
					className={cn(
						"inline-flex items-center gap-1 group/value relative",
						wrap && "flex-wrap [word-break:break-all]",
					)}
				>
					<span
						className={cn(
							"text-green-600 dark:text-green-400",
							wrap && "[word-break:break-all]",
						)}
						title={full}
					>
						"{display}"
					</span>
					{comma}
					{x5c && full.length > 20 && (
						<a
							href={getX5cViewerUrl(full)}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-0.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 opacity-70 hover:opacity-100"
							title="View certificate in x509.io"
						>
							<ExternalLink className="h-3 w-3" />
						</a>
					)}
					{showCopy && (
						<CopyButton
							value={full}
							fieldKey={fieldKey}
							className={cn(
								"opacity-0 group-hover/value:opacity-100",
								!x5c && "absolute -right-4",
							)}
						/>
					)}
				</span>
			);
		}

		if (Array.isArray(value)) {
			return renderArray(value, depth, path, fieldKey, trailingComma);
		}

		if (typeof value === "object") {
			return renderObject(
				value as Record<string, unknown>,
				depth,
				path,
				fieldKey,
				trailingComma,
			);
		}

		return (
			<span>
				<span className="text-gray-500">{String(value)}</span>
				{comma}
			</span>
		);
	};

	const renderArray = (
		arr: unknown[],
		depth: number,
		path: string,
		fieldKey?: string,
		trailingComma?: boolean,
	): React.ReactNode => {
		const isCollapsed = collapsed.has(path);

		const comma = trailingComma ? (
			<span className="text-gray-500">,</span>
		) : null;

		if (arr.length === 0) {
			return (
				<span>
					<span className="text-gray-500">[]</span>
					{comma}
				</span>
			);
		}

		// Render compact for short primitive arrays
		if (canRenderCompact(arr)) {
			return (
				<span className="inline-flex items-center gap-1 group/compact relative">
					{renderCompactArray(arr, path)}
					{comma}
					<CopyButton
						value={JSON.stringify(arr, null, 2)}
						fieldKey={fieldKey}
						className="opacity-0 group-hover/compact:opacity-100 absolute -right-4"
					/>
				</span>
			);
		}

		return (
			<span>
				<span className="inline-flex items-center gap-1 group/array">
					<button
						type="button"
						onClick={() => toggleCollapse(path)}
						className="inline-flex items-center gap-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-0.5 -ml-0.5"
					>
						<ChevronRight
							className={cn(
								"h-3 w-3 transition-transform text-gray-400",
								!isCollapsed && "rotate-90",
							)}
						/>
						<span className="text-gray-500">[</span>
					</button>
					<CopyButton
						value={JSON.stringify(arr, null, 2)}
						fieldKey={fieldKey}
						className="opacity-0 group-hover/array:opacity-100"
					/>
				</span>
				{isCollapsed ? (
					<span className="text-gray-400 italic">{arr.length} items</span>
				) : (
					arr.map((item, index) => {
						const itemPath = `${path}[${index}]`;
						const isLast = index === arr.length - 1;
						return (
							<div key={itemPath} style={{ marginLeft: "1rem" }}>
								{renderValue(item, depth + 1, itemPath, undefined, !isLast)}
							</div>
						);
					})
				)}
				{!isCollapsed && (
					<div>
						<span className="text-gray-500">]</span>
						{comma}
					</div>
				)}
				{isCollapsed && (
					<span>
						<span className="text-gray-500">]</span>
						{comma}
					</span>
				)}
			</span>
		);
	};

	const renderObject = (
		obj: Record<string, unknown>,
		depth: number,
		path: string,
		fieldKey?: string,
		trailingComma?: boolean,
	): React.ReactNode => {
		const keys = Object.keys(obj);
		const isCollapsed = collapsed.has(path);
		const comma = trailingComma ? (
			<span className="text-gray-500">,</span>
		) : null;

		if (keys.length === 0) {
			return (
				<span>
					<span className="text-gray-500">{"{}"}</span>
					{comma}
				</span>
			);
		}

		return (
			<span>
				<span className="inline-flex items-center gap-1 group/object">
					<button
						type="button"
						onClick={() => toggleCollapse(path)}
						className="inline-flex items-center gap-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-0.5 -ml-0.5"
					>
						<ChevronRight
							className={cn(
								"h-3 w-3 transition-transform text-gray-400",
								!isCollapsed && "rotate-90",
							)}
						/>
						<span className="text-gray-500">{"{"}</span>
					</button>
					<CopyButton
						value={JSON.stringify(obj, null, 2)}
						fieldKey={fieldKey}
						className="opacity-0 group-hover/object:opacity-100"
					/>
				</span>
				{isCollapsed ? (
					<span className="text-gray-400 italic">...</span>
				) : (
					keys.map((key, index) => {
						const keyPath = `${path}.${key}`;
						const isLast = index === keys.length - 1;
						return (
							<div key={keyPath} style={{ marginLeft: "1rem" }}>
								<span className="text-blue-600 dark:text-blue-400">
									"{key}"
								</span>
								<span className="text-gray-500">: </span>
								{renderValue(obj[key], depth + 1, keyPath, key, !isLast)}
							</div>
						);
					})
				)}
				{!isCollapsed && (
					<div>
						<span className="text-gray-500">{"}"}</span>
						{comma}
					</div>
				)}
				{isCollapsed && (
					<span>
						<span className="text-gray-500">{"}"}</span>
						{comma}
					</span>
				)}
			</span>
		);
	};

	return (
		<div className={cn("font-mono text-sm relative group/json", className)}>
			<WrapToggleButton wrapMode={wrapMode} onToggle={cycleWrapMode} />
			<CopyJsonButton value={JSON.stringify(data, null, 2)} />
			{renderValue(data, 0, "$")}
		</div>
	);
}
