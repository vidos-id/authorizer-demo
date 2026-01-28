import { JsonCollapsible } from "@/components/JsonCollapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthorizationStatusQuery } from "@/queries/useAuthorizationStatusQuery";
import { useAppStore } from "@/stores/appStore";
import { AuthorizationRequestJwtViewer } from "./AuthorizationRequestJwtViewer";
import { AuthorizeLink } from "./AuthorizeLink";
import { DCAPIButton } from "./DCAPIButton";
import { QRCodeDisplay } from "./QRCodeDisplay";

export function AuthorizationStage() {
	const digitalCredentialGetRequest = useAppStore(
		(state) => state.digitalCredentialGetRequest,
	);
	const authorizeUrl = useAppStore((state) => state.authorizeUrl);
	const lastResponse = useAppStore((state) => state.lastResponse);
	const expiresAt = useAppStore((state) => state.expiresAt);
	const backToCreateStage = useAppStore((state) => state.backToCreateStage);

	const { data: statusData, error: statusError } =
		useAuthorizationStatusQuery();

	const statusLabels: Record<string, string> = {
		created: "Waiting for wallet...",
		pending: "Processing...",
		authorized: "Authorized!",
		rejected: "Rejected",
		error: "Error occurred",
		expired: "Request expired",
	};

	const isDCAPI = digitalCredentialGetRequest !== null;
	const isDirectPost = authorizeUrl !== null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Authorize Request</CardTitle>
				<CardDescription>
					{isDCAPI
						? "Use your browser to authorize the credential request"
						: "Scan the QR code with your wallet to authorize the credential request"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 md:space-y-8">
				{isDCAPI ? (
					<DCAPIButton />
				) : isDirectPost && authorizeUrl ? (
					<>
						<QRCodeDisplay url={authorizeUrl} />
						<AuthorizeLink url={authorizeUrl} />
					</>
				) : (
					<div className="flex justify-center">
						<Skeleton className="w-64 h-64" />
					</div>
				)}

				{lastResponse && (
					<JsonCollapsible
						title={`Created "Authorization Request" Response`}
						data={lastResponse}
						defaultOpen={false}
					/>
				)}

				{isDirectPost && <AuthorizationRequestJwtViewer />}

				<div className="flex items-center justify-center gap-2">
					<div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
					<span className="text-sm text-muted-foreground">
						{statusData?.status
							? statusLabels[statusData.status] || statusData.status
							: "Checking status..."}
					</span>
				</div>

				{statusError && (
					<Alert variant="destructive">
						<AlertDescription>{statusError.message}</AlertDescription>
					</Alert>
				)}

				{expiresAt && (
					<p className="text-xs text-center text-muted-foreground">
						Request expires at {new Date(expiresAt).toLocaleTimeString()}
					</p>
				)}

				<Button
					variant="outline"
					onClick={backToCreateStage}
					className="w-full sm:w-auto sm:min-w-40 sm:mx-auto sm:block"
				>
					Cancel
				</Button>
			</CardContent>
		</Card>
	);
}
