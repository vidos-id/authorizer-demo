import { useQueryClient } from "@tanstack/react-query";
import {
	ChevronDown,
	CreditCard,
	Download,
	ExternalLink,
	MessageCircle,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PrettyJson } from "@/components/ui/PrettyJson";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUPPORT_CONFIG } from "@/config/support";
import { useAuthorizationStatusQuery } from "@/queries/useAuthorizationStatusQuery";
import { useCredentialsQuery } from "@/queries/useCredentialsQuery";
import { usePolicyResponseQuery } from "@/queries/usePolicyResponseQuery";
import { useAppStore } from "@/stores/appStore";
import type { PolicyResult } from "@/types/app";
import { downloadDebugInfo, generateDebugInfo } from "@/utils/debugExport";
import { CredentialsDisplay } from "./CredentialsDisplay";
import { PolicyResults } from "./PolicyResults";
import { StatusCard } from "./StatusCard";

export function ResultStage() {
	const backToCreateStage = useAppStore((state) => state.backToCreateStage);
	const startFresh = useAppStore((state) => state.startFresh);
	const flowStore = useAppStore();
	const queryClient = useQueryClient();

	// Tab state management
	const [activeTab, setActiveTab] = useState<"policy-results" | "credentials">(
		"policy-results",
	);

	// Get status and policy from React Query
	const { data: statusData } = useAuthorizationStatusQuery();
	const { data: policyResponse, error: policyError } = usePolicyResponseQuery({
		enabled: activeTab === "policy-results",
	});
	const { data: credentialsData } = useCredentialsQuery({
		enabled: activeTab === "policy-results",
	});

	const handleGoBack = () => {
		backToCreateStage();
		queryClient.clear(); // Clear all React Query cache
	};

	const handleStartFresh = () => {
		startFresh();
		queryClient.clear(); // Clear all React Query cache
	};

	const handleDownloadDebugInfo = () => {
		const debugInfo = generateDebugInfo({
			authorizationId: flowStore.authorizationId,
			authorizationRequest: flowStore.lastRequest,
			authorizationResponse: flowStore.lastResponse,
			debugEvents: flowStore.debugEvents,
			statusData: statusData || null,
			policyResponse: policyResponse || null,
			flowState: {
				stage: flowStore.stage,
				instanceType: flowStore.instanceType,
				ownAuthorizerUrl: flowStore.ownAuthorizerUrl,
				credentialRequests: flowStore.credentialRequests,
				responseModeConfig: flowStore.responseModeConfig,
				customCredentialCases: flowStore.customCredentialCases,
				useRawJsonMode: flowStore.useRawJsonMode,
				rawJsonContent: flowStore.rawJsonContent,
				customJsonRequests: flowStore.customJsonRequests,
				authorizeUrl: flowStore.authorizeUrl,
				digitalCredentialGetRequest: flowStore.digitalCredentialGetRequest,
				expiresAt: flowStore.expiresAt,
				showPreview: flowStore.showPreview,
				error: flowStore.error,
			},
		});
		downloadDebugInfo(debugInfo);
	};

	const error = flowStore.error;

	const status = statusData?.status;
	const hasPolicyResults = policyResponse && policyResponse.data.length > 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Authorization Result</CardTitle>
				<CardDescription>
					Review the result of your authorization request
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 md:space-y-8">
				{status && <StatusCard status={status} />}

				{(error || policyError) && (
					<Alert variant="destructive">
						<AlertDescription>
							{error?.message || policyError?.message}
							{error?.details && (
								<span className="block mt-1 text-xs opacity-70">
									{error.details}
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}

				{/* Support contact and debug export section */}
				<div className="rounded-lg border bg-muted/50 p-4 space-y-3">
					<div className="text-sm font-medium">Need Help?</div>
					<p className="text-xs text-muted-foreground">
						Contact us via the support options below. Download debugging
						information to help diagnose issues.
					</p>
					<div className="flex flex-col sm:flex-row gap-2">
						<Button
							variant="outline"
							size="sm"
							className="w-full sm:w-auto"
							asChild
						>
							<a
								href={SUPPORT_CONFIG.contactFormUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<MessageCircle className="h-4 w-4 mr-2" />
								Vidos Contact Form
								<ExternalLink className="h-3 w-3 ml-1" />
							</a>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="w-full sm:w-auto"
							asChild
						>
							<a
								href={SUPPORT_CONFIG.githubIssuesUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<MessageCircle className="h-4 w-4 mr-2" />
								GitHub Issues
								<ExternalLink className="h-3 w-3 ml-1" />
							</a>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="w-full sm:w-auto"
							onClick={handleDownloadDebugInfo}
						>
							<Download className="h-4 w-4 mr-2" />
							Download Debug Info
						</Button>
					</div>
				</div>

				<Separator />

				{hasPolicyResults && policyResponse && (
					<Tabs
						defaultValue="policy-results"
						value={activeTab}
						onValueChange={(v) =>
							setActiveTab(v as "policy-results" | "credentials")
						}
					>
						<div className="flex justify-center">
							<TabsList className="grid w-full max-w-md grid-cols-2">
								<TabsTrigger value="policy-results" className="gap-1.5">
									<ShieldCheck className="h-4 w-4" />
									<span className="hidden sm:inline">Policy Results</span>
								</TabsTrigger>
								<TabsTrigger value="credentials" className="gap-1.5">
									<CreditCard className="h-4 w-4" />
									<span className="hidden sm:inline">Credentials</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent
							value="policy-results"
							className="space-y-6 md:space-y-8"
						>
							<PolicyResults
								results={policyResponse.data as PolicyResult[]}
								credentials={credentialsData}
							/>

							<Collapsible>
								<CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
									<ChevronDown className="h-4 w-4" />
									Raw Policy Response Data
								</CollapsibleTrigger>
								<CollapsibleContent className="mt-2">
									<div className="p-4 bg-muted rounded-md text-xs md:text-sm overflow-auto max-h-96 md:max-h-[32rem] lg:max-h-[48rem]">
										<PrettyJson data={policyResponse} />
									</div>
								</CollapsibleContent>
							</Collapsible>
						</TabsContent>

						<TabsContent value="credentials" className="space-y-6 md:space-y-8">
							<CredentialsDisplay
								authorizationId={flowStore.authorizationId || ""}
								enabled={activeTab === "credentials"}
							/>
						</TabsContent>
					</Tabs>
				)}

				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
					<Button
						onClick={handleGoBack}
						variant="default"
						className="w-full sm:w-auto sm:min-w-48"
					>
						Try Again
					</Button>
					<Button
						onClick={handleStartFresh}
						variant="outline"
						className="w-full sm:w-auto sm:min-w-48"
					>
						New Request
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
