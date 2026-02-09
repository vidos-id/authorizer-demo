import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SubmittedCredential } from "@/types/app";
import { getClaimDisplayName } from "@/utils/claimDisplayName";
import { ClaimValueRenderer } from "./ClaimValueRenderer";
import { CredentialPathBreadcrumb } from "./CredentialPathBreadcrumb";

interface CredentialCardProps {
	credential: SubmittedCredential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
	const { credentialType, format, path, claims } = credential;

	return (
		<Card>
			<CardHeader>
				<div className="space-y-1">
					<p className="font-medium">{credentialType}</p>
					<p className="text-xs text-muted-foreground">{format}</p>
					<CredentialPathBreadcrumb path={path} format={format} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{Object.entries(claims).map(([key, value]) => {
						const displayName = getClaimDisplayName(
							key,
							credentialType,
							format,
						);
						return (
							<div
								key={key}
								className="grid grid-cols-[minmax(120px,1fr)_2fr] gap-4 text-sm"
							>
								<div className="font-medium">{displayName}</div>
								<div>
									<ClaimValueRenderer
										value={value}
										fieldName={key}
										credentialType={credentialType}
										format={format}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
