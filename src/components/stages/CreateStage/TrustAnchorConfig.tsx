import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Check,
	ChevronRight,
	Copy,
	Download,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { createAuthorizerClient } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";

type TrustAnchorResponse = {
	anchorType: "root" | "account" | "instance";
	certificate: string;
};

const isValidUrl = (url: string) => {
	if (!url) return false;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

export function TrustAnchorConfig() {
	const authorizerUrl = useAppStore(selectAuthorizerUrl);
	const [isOpen, setIsOpen] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const hasValidUrl = isValidUrl(authorizerUrl);

	const { data, error, isLoading, isFetching, refetch } =
		useQuery<TrustAnchorResponse>({
			queryKey: ["trust-anchor", authorizerUrl],
			queryFn: async () => {
				const client = createAuthorizerClient(authorizerUrl);
				const { data, error } = await client.GET(
					"/instances/oid4vp-trust-anchor",
				);

				if (error) {
					throw new Error(
						error.message || "Failed to fetch trust anchor certificate",
					);
				}

				if (!data) {
					throw new Error("No trust anchor certificate returned");
				}

				return data;
			},
			enabled: isOpen && hasValidUrl,
		});

	const handleCopy = async () => {
		if (!data?.certificate) return;
		await navigator.clipboard.writeText(data.certificate);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	const handleDownload = () => {
		if (!data?.certificate || !data?.anchorType) return;
		const blob = new Blob([data.certificate], {
			type: "application/x-pem-file",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `vidos-${data.anchorType}.pem`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const errorMessage =
		error instanceof Error ? error.message : "Failed to load certificate";

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
				<ChevronRight className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-90" />
				<div className="flex flex-col items-start gap-0.5">
					<span className="font-medium">Trust Anchor Certificate</span>
					<span className="text-xs">
						View and export the certificate used to sign authorization requests
					</span>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-4">
				<div className="rounded-lg border bg-card/50 p-4 space-y-4">
					<p className="text-sm text-muted-foreground">
						This X.509 certificate is used by the authorizer to sign
						authorization requests. Wallets must have this certificate
						configured as a trust anchor to verify and accept requests. This is
						particularly required for EUDI wallets.
					</p>

					{!hasValidUrl && (
						<div className="flex items-start gap-2 text-sm text-destructive">
							<AlertCircle className="h-4 w-4 mt-0.5" />
							<span>
								Please configure a valid authorizer URL in App Configuration
								above.
							</span>
						</div>
					)}

					{hasValidUrl && isLoading && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span>Loading certificate...</span>
						</div>
					)}

					{hasValidUrl && error && (
						<div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 space-y-2">
							<div className="flex items-start gap-2 text-sm text-destructive">
								<AlertCircle className="h-4 w-4 mt-0.5" />
								<span>Failed to load certificate.</span>
							</div>
							<p className="text-xs text-muted-foreground">{errorMessage}</p>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								Retry
							</Button>
						</div>
					)}

					{hasValidUrl && data && (
						<div className="space-y-3">
							<Badge variant="secondary">Anchor Type: {data.anchorType}</Badge>
							<Textarea
								readOnly
								className="font-mono h-48"
								value={data.certificate}
							/>
							<div className="flex flex-wrap gap-2">
								<Button variant="outline" size="sm" onClick={handleCopy}>
									{isCopied ? (
										<Check className="h-4 w-4 mr-2" />
									) : (
										<Copy className="h-4 w-4 mr-2" />
									)}
									{isCopied ? "Copied" : "Copy"}
								</Button>
								<Button variant="outline" size="sm" onClick={handleDownload}>
									<Download className="h-4 w-4 mr-2" />
									Download
								</Button>
								<Button variant="outline" size="sm" onClick={() => refetch()}>
									<RefreshCw
										className={`h-4 w-4 mr-2 ${
											isFetching ? "animate-spin" : ""
										}`}
									/>
									Refresh
								</Button>
							</div>
						</div>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
