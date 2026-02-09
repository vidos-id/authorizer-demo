import { ClaimValueRenderer } from "./index";

interface ArrayValueProps {
	value: unknown[];
	credentialType: string;
	format: string;
}

export function ArrayValue({ value, credentialType, format }: ArrayValueProps) {
	return (
		<div className="border border-border rounded-md p-3">
			<ul className="list-disc list-inside space-y-1">
				{value.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Array items may not have stable keys
					<li key={index} className="text-sm">
						<ClaimValueRenderer
							value={item}
							fieldName={`item-${index}`}
							credentialType={credentialType}
							format={format}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
