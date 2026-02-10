import { toTitleCase } from "@/utils/claimDisplayName";
import { ClaimValueRenderer } from "./index";

interface ObjectValueProps {
	value: Record<string, unknown>;
	credentialType: string;
	format: string;
}

export function ObjectValue({
	value,
	credentialType,
	format,
}: ObjectValueProps) {
	const entries = Object.entries(value);
	return (
		<div className="border-l-[3px] border-gray-300 dark:border-gray-600 pl-4 mt-1 divide-y divide-border">
			{entries.map(([key, val], index) => {
				const displayName = toTitleCase(key);
				return (
					<div
						key={key}
						className={`grid grid-cols-[auto_1fr] gap-2 items-start py-1.5 ${
							index % 2 === 1 ? "bg-muted/30" : ""
						}`}
					>
						<div className="text-sm font-medium text-muted-foreground">
							<div className="font-medium text-muted-foreground">
								{displayName}:
							</div>
							<div className="text-xs text-muted-foreground">({key})</div>
						</div>
						<div className="text-sm">
							<ClaimValueRenderer
								value={val}
								fieldName={key}
								credentialType={credentialType}
								format={format}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
