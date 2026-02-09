import { getClaimDisplayName } from "@/utils/claimDisplayName";
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
	return (
		<div className="border border-border rounded-md p-3 space-y-2">
			{Object.entries(value).map(([key, val]) => (
				<div key={key} className="grid grid-cols-[auto_1fr] gap-2 items-start">
					<span className="text-sm font-medium text-muted-foreground">
						{getClaimDisplayName(key, credentialType, format)}:
					</span>
					<div className="text-sm">
						<ClaimValueRenderer
							value={val}
							fieldName={key}
							credentialType={credentialType}
							format={format}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
