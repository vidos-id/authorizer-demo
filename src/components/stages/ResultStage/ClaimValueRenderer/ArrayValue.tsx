import { ClaimValueRenderer } from "./index";

interface ArrayValueProps {
	value: unknown[];
	credentialType: string;
	format: string;
}

export function ArrayValue({ value, credentialType, format }: ArrayValueProps) {
	const isObjectArray = value.some(
		(item) => typeof item === "object" && item !== null && !Array.isArray(item),
	);

	// For arrays of objects: show indexed items with dividers
	if (isObjectArray) {
		return (
			<div className="border-l-[3px] border-gray-300 dark:border-gray-600 pl-4 mt-1 divide-y divide-border">
				{value.map((item, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Array items may not have stable keys
						key={index}
						className={`py-2 first:pt-0 last:pb-0 ${
							index % 2 === 1 ? "bg-muted/30" : ""
						}`}
					>
						<div className="text-xs font-medium text-muted-foreground mb-2">
							[{index + 1}]
						</div>
						<ClaimValueRenderer
							value={item}
							fieldName={`item-${index}`}
							credentialType={credentialType}
							format={format}
						/>
					</div>
				))}
			</div>
		);
	}

	// For arrays of primitives: show as striped rows
	return (
		<div className="border-l-[3px] border-gray-300 dark:border-gray-600 pl-4 mt-1 divide-y divide-border">
			{value.map((item, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: Array items may not have stable keys
					key={index}
					className={`py-1.5 first:pt-0 last:pb-0 text-sm ${
						index % 2 === 1 ? "bg-muted/30" : ""
					}`}
				>
					<ClaimValueRenderer
						value={item}
						fieldName={`item-${index}`}
						credentialType={credentialType}
						format={format}
					/>
				</div>
			))}
		</div>
	);
}
