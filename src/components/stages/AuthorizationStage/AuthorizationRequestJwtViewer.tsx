import {
	ChevronDownIcon,
	CopyIcon,
	ExternalLinkIcon,
	LoaderCircleIcon,
	RefreshCwIcon,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAuthorizationJwtQuery } from "@/queries/useAuthorizationJwtQuery";

function JwtPrettyPrint({ jwt }: { jwt: string }) {
	const parts = jwt.split(".");
	if (parts.length !== 3) {
		return <>{jwt}</>;
	}
	const [header, payload, signature] = parts;
	return (
		<>
			<span className="text-green-500 opacity-85">{header}</span>
			<span className="text-muted-foreground">.</span>
			<span className="text-purple-500 opacity-85">{payload}</span>
			<span className="text-muted-foreground">.</span>
			<span className="text-cyan-500 opacity-85">{signature}</span>
		</>
	);
}

export function AuthorizationRequestJwtViewer() {
	const [isOpen, setIsOpen] = useState(false);
	const [hasOpened, setHasOpened] = useState(false);
	const [copied, setCopied] = useState(false);

	const {
		data: jwt,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
	} = useAuthorizationJwtQuery(hasOpened);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			setHasOpened(true);
		}
	};

	const handleCopy = async () => {
		if (!jwt) return;
		try {
			await navigator.clipboard.writeText(jwt);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy JWT:", err);
		}
	};

	const jwtLink = jwt
		? `https://jwt.io/#token=${encodeURIComponent(jwt)}`
		: "https://jwt.io";

	return (
		<Collapsible open={isOpen} onOpenChange={handleOpenChange}>
			<Card>
				<CardHeader className="pb-3">
					<CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70 transition-opacity">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							Authorization Request JWT
							{isFetching && (
								<LoaderCircleIcon className="h-4 w-4 animate-spin text-muted-foreground" />
							)}
						</CardTitle>
						<ChevronDownIcon
							className={cn(
								"h-4 w-4 transition-transform",
								isOpen && "transform rotate-180",
							)}
						/>
					</CollapsibleTrigger>
				</CardHeader>
				<CollapsibleContent>
					<CardContent className="space-y-3">
						{isLoading && (
							<div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
								<LoaderCircleIcon className="h-5 w-5 animate-spin" />
								<span className="text-sm">Loading JWT...</span>
							</div>
						)}

						{isError && !isLoading && (
							<Alert variant="destructive" className="gap-3">
								<AlertDescription>
									<div className="flex items-center justify-between gap-3">
										<span>
											{error instanceof Error
												? error.message
												: "Failed to fetch authorization JWT"}
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => refetch()}
										>
											<RefreshCwIcon className="h-4 w-4" />
											Retry
										</Button>
									</div>
								</AlertDescription>
							</Alert>
						)}

						{jwt && !isLoading && !isError && (
							<>
								<div className="flex flex-wrap items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCopy}
											className="h-8"
										>
											<CopyIcon className="h-4 w-4" />
											{copied ? "Copied!" : "Copy"}
										</Button>
										<Button asChild variant="outline" size="sm" className="h-8">
											<a href={jwtLink} target="_blank" rel="noreferrer">
												<ExternalLinkIcon className="h-4 w-4" />
												View on jwt.io
											</a>
										</Button>
									</div>
								</div>
								<div className="bg-muted rounded-md p-3 overflow-auto max-h-32 md:max-h-40">
									<pre className="text-xs font-mono whitespace-pre-wrap break-all select-all">
										<JwtPrettyPrint jwt={jwt} />
									</pre>
								</div>
							</>
						)}
					</CardContent>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
}
