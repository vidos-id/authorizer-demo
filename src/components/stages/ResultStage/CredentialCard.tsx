import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PrettyJson } from "@/components/ui/PrettyJson";
import type { SubmittedCredential } from "@/types/app";
import { getClaimDisplayName } from "@/utils/claimDisplayName";
import { getFormatDisplayName } from "@/utils/formatDisplayName";
import { ClaimValueRenderer } from "./ClaimValueRenderer";
import { CredentialPathBreadcrumb } from "./CredentialPathBreadcrumb";

interface CredentialCardProps {
	credential: SubmittedCredential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
	const { credentialType, format, path, claims } = credential;
	const formatDisplayName = getFormatDisplayName(format);

	return (
		<Card>
			<CardHeader className="space-y-3">
				{/* Breadcrumb - path context */}
				<CredentialPathBreadcrumb path={path} format={format} />

				{/* Credential metadata - visually separated */}
				<div className="pt-2 border-t border-border space-y-0.5">
					<p className="text-sm">
						<span className="text-muted-foreground">Type: </span>
						<span className="font-medium">{credentialType}</span>
					</p>
					<p className="text-sm">
						<span className="text-muted-foreground">Format: </span>
						<span>{formatDisplayName}</span>
					</p>
				</div>
			</CardHeader>
			<CardContent>
				<div className="divide-y divide-border">
					{Object.entries(claims).map(([key, value], index) => {
						const claimInfo = getClaimDisplayName(key, credentialType, format);
						return (
							<div
								key={key}
								className={`grid grid-cols-[minmax(120px,1fr)_2fr] gap-4 text-sm py-2.5 px-2 -mx-2 ${
									index % 2 === 0 ? "bg-muted/30" : ""
								}`}
							>
								<div>
									<div className="font-medium">{claimInfo.displayName}</div>
									<div className="text-xs text-muted-foreground">
										({claimInfo.originalKey}
										{claimInfo.origin && ` - ${claimInfo.origin}`})
									</div>
								</div>
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

				<div className="mt-6">
					<Collapsible>
						<CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
							<ChevronDown className="h-4 w-4" />
							Raw Credential
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<div className="p-4 bg-muted rounded-md text-xs md:text-sm overflow-auto max-h-96 md:max-h-[32rem] lg:max-h-[48rem]">
								<PrettyJson data={credential} />
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>
			</CardContent>
		</Card>
	);
}
