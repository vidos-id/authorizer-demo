import { Code, Eye, LayoutTemplate, Send, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
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

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateAuthorizationMutation } from "@/queries/useCreateAuthorizationMutation";
import { selectAuthorizerUrl, useAppStore } from "@/stores/appStore";
import {
	type JsonValidationResult,
	validateJsonRequest,
} from "@/utils/jsonRequestValidation";
import { buildAuthorizationRequestBody } from "@/utils/requestBuilder";
import { validateAuthorizationRequest } from "@/utils/validation";
import { AppConfiguration } from "./AppConfiguration";
import { CredentialRequestList } from "./CredentialRequestList";
import { CredentialSetList } from "./CredentialSetList";
import { DCApiJwtSdJwtWarning } from "./DCApiJwtSdJwtWarning";
import { JsonEditor } from "./JsonEditor";
import { ProfileSelector } from "./ProfileSelector";
import { ResponseModeSelector } from "./ResponseModeSelector";
import { SavedJsonRequestsManager } from "./SavedJsonRequestsManager";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { TemplatesTab } from "./TemplatesTab";
import { TransactionDataList } from "./TransactionDataList";
import { TrustAnchorConfig } from "./TrustAnchorConfig";

export function CreateStage() {
	const authorizerUrl = useAppStore(selectAuthorizerUrl);
	const credentialRequests = useAppStore((state) => state.credentialRequests);
	const credentialSets = useAppStore((state) => state.credentialSets);
	const transactionDataEntries = useAppStore(
		(state) => state.transactionDataEntries,
	);
	const responseModeConfig = useAppStore((state) => state.responseModeConfig);
	const showPreview = useAppStore((state) => state.showPreview);
	const lastRequest = useAppStore((state) => state.lastRequest);
	const error = useAppStore((state) => state.error);
	const setShowPreview = useAppStore((state) => state.setShowPreview);
	const setLastRequest = useAppStore((state) => state.setLastRequest);
	const selectedTemplateId = useAppStore((state) => state.selectedTemplateId);
	const viewMode = useAppStore((state) => state.createViewMode);
	const setViewMode = useAppStore((state) => state.setCreateViewMode);

	const [showSaveDialog, setShowSaveDialog] = useState(false);

	// JSON mode state
	const rawJsonContent = useAppStore((state) => state.rawJsonContent);

	const [jsonValidation, setJsonValidation] = useState<JsonValidationResult>({
		valid: false,
		errors: [],
	});

	const mutation = useCreateAuthorizationMutation();
	const hasSdJwtRequest = credentialRequests.some(
		(request) => request.format === "dc+sd-jwt",
	);
	const showDcApiJwtSdJwtWarning =
		viewMode === "builder" &&
		responseModeConfig.mode === "dc_api.jwt" &&
		hasSdJwtRequest;

	// Builder mode validation
	const builderValidation = validateAuthorizationRequest(
		authorizerUrl,
		credentialRequests,
		responseModeConfig,
		credentialSets, // Task 5: Include credential sets in validation
		transactionDataEntries,
	);

	// JSON mode validation (debounced)
	useEffect(() => {
		if (viewMode !== "json") return;

		const timer = setTimeout(() => {
			const result = validateJsonRequest(rawJsonContent);
			setJsonValidation(result);
		}, 500);

		return () => clearTimeout(timer);
	}, [rawJsonContent, viewMode]);

	// Determine which validation to use
	const isValid =
		viewMode === "json"
			? jsonValidation.valid
			: viewMode === "templates"
				? selectedTemplateId !== null
				: builderValidation.valid;

	const handleShowPreview = () => {
		if (credentialRequests.length === 0) return;
		const requestBody = buildAuthorizationRequestBody(
			credentialRequests,
			responseModeConfig,
			credentialSets,
			transactionDataEntries,
		);
		setLastRequest(requestBody);
		setShowPreview(true);
	};

	const handleConfirmAndSend = () => {
		if (viewMode === "json") {
			// Raw JSON mode - send parsed JSON directly
			const parsed = JSON.parse(rawJsonContent);
			mutation.mutate({ rawRequestBody: parsed });
		} else {
			// Builder or Templates mode
			mutation.mutate({
				credentialRequests,
				responseModeConfig,
				credentialSets,
				transactionDataEntries,
			});
		}
		setShowPreview(false);
	};

	const handleCreateDirect = () => {
		if (viewMode === "json") {
			// Raw JSON mode - send parsed JSON directly
			const parsed = JSON.parse(rawJsonContent);
			mutation.mutate({ rawRequestBody: parsed });
		} else {
			// Builder or Templates mode
			mutation.mutate({
				credentialRequests,
				responseModeConfig,
				credentialSets,
				transactionDataEntries,
			});
		}
	};

	const handleTransferToJson = () => {
		try {
			const requestBody = buildAuthorizationRequestBody(
				credentialRequests,
				responseModeConfig,
				credentialSets,
				transactionDataEntries,
			);
			const prettyJson = JSON.stringify(requestBody, null, 2);
			useAppStore.getState().setRawJsonContent(prettyJson);
			setViewMode("json");
		} catch (error) {
			console.error("Failed to transfer to JSON:", error);
		}
	};

	if (showPreview) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Request Preview</CardTitle>
					<CardDescription>
						Review the request before sending it to the Vidos Authorizer
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6 md:space-y-8">
					<JsonCollapsible
						title="Authorization Request"
						data={lastRequest}
						defaultOpen={true}
					/>

					{(error || mutation.error) && (
						<Alert variant="destructive">
							<AlertDescription>
								{error?.message || mutation.error?.message}
								{error?.details && (
									<span className="block mt-1 text-xs opacity-70">
										{error.details}
									</span>
								)}
							</AlertDescription>
						</Alert>
					)}

					<div className="flex flex-col sm:flex-row gap-3">
						<Button
							variant="outline"
							onClick={() => setShowPreview(false)}
							disabled={mutation.isPending}
							className="flex-1"
						>
							Go Back
						</Button>
						<Button
							onClick={handleConfirmAndSend}
							disabled={mutation.isPending}
							className="flex-1"
						>
							{mutation.isPending ? "Sending..." : "Confirm & Send"}
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="space-y-1.5">
				<CardTitle className="text-xl">Create Authorization Request</CardTitle>
				<CardDescription>
					Build and send credential verification requests using templates, the
					visual builder, or raw JSON. Your request will generate a shareable
					link for credential verification.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 md:space-y-8">
				<AppConfiguration />
				<TrustAnchorConfig />

				{/* Tab Navigation */}
				<Tabs
					value={viewMode}
					onValueChange={(v) => setViewMode(v as typeof viewMode)}
				>
					<div className="flex justify-center">
						<TabsList className="grid w-full max-w-md grid-cols-3">
							<TabsTrigger value="templates" className="gap-1.5">
								<LayoutTemplate className="h-4 w-4" />
								<span className="hidden sm:inline">Templates</span>
							</TabsTrigger>
							<TabsTrigger value="builder" className="gap-1.5">
								<Wrench className="h-4 w-4" />
								<span className="hidden sm:inline">Builder</span>
							</TabsTrigger>
							<TabsTrigger value="json" className="gap-1.5">
								<Code className="h-4 w-4" />
								<span className="hidden sm:inline">Raw JSON</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<Separator />

					{/* Templates Tab Content */}
					<TabsContent value="templates" className="space-y-6 md:space-y-8">
						<TemplatesTab onLoadToBuilder={() => setViewMode("builder")} />
					</TabsContent>

					{/* Builder Tab Content */}
					<TabsContent value="builder" className="space-y-6 md:space-y-8">
						{/* Header */}
						<div>
							<h2 className="text-2xl font-bold">Request Builder</h2>
							<p className="text-muted-foreground">
								Manually configure your authorization request with granular
								control
							</p>
						</div>

						<CredentialRequestList />

						<Separator />

						{/* Credential Sets Section */}
						<CredentialSetList />

						<Separator />

						<TransactionDataList />

						<Separator />

						<ProfileSelector />

						<Separator />

						<ResponseModeSelector />

						{showDcApiJwtSdJwtWarning && <DCApiJwtSdJwtWarning />}

						<Separator />

						{/* Builder hints */}
						<div className="text-sm text-muted-foreground text-center space-y-1">
							<p>
								Use this request often?{" "}
								<button
									type="button"
									onClick={() => setShowSaveDialog(true)}
									disabled={credentialRequests.length === 0}
									className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								>
									Save as template
								</button>
							</p>
							<p>
								Need more control?{" "}
								<button
									type="button"
									onClick={handleTransferToJson}
									disabled={!builderValidation.valid}
									className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								>
									Edit as raw JSON
								</button>
							</p>
						</div>
					</TabsContent>

					{/* JSON Tab Content */}
					<TabsContent value="json" className="space-y-6 md:space-y-8">
						{/* Header */}
						<div>
							<h2 className="text-2xl font-bold">Raw JSON</h2>
							<p className="text-muted-foreground">
								Edit the authorization request as JSON or load a previously
								saved request
							</p>
						</div>

						<JsonEditor
							value={rawJsonContent}
							onChange={useAppStore.getState().setRawJsonContent}
							validation={jsonValidation}
						/>

						<SavedJsonRequestsManager />
					</TabsContent>
				</Tabs>

				{!isValid && (
					<Alert variant="destructive">
						<AlertDescription>
							<p className="font-medium mb-2">
								Please fix the following errors:
							</p>
							<ul className="list-disc list-inside space-y-1">
								{viewMode === "json"
									? jsonValidation.errors.map((error) => (
											<li key={error} className="text-sm">
												{error}
											</li>
										))
									: viewMode === "builder"
										? builderValidation.errors.map((error) => (
												<li key={error} className="text-sm">
													{error}
												</li>
											))
										: [
												<li key="no-template" className="text-sm">
													Please select a template
												</li>,
											]}
							</ul>
						</AlertDescription>
					</Alert>
				)}

				{/* Task 5.6: Display warnings (e.g., duplicate credential IDs) */}
				{viewMode === "builder" &&
					builderValidation.warnings &&
					builderValidation.warnings.length > 0 && (
						<Alert variant="default" className="border-yellow-500 bg-yellow-50">
							<AlertDescription>
								<p className="font-medium mb-2 text-yellow-800">Warnings:</p>
								<ul className="list-disc list-inside space-y-1">
									{builderValidation.warnings.map((warning) => (
										<li key={warning} className="text-sm text-yellow-700">
											{warning}
										</li>
									))}
								</ul>
							</AlertDescription>
						</Alert>
					)}

				{(error || mutation.error) && (
					<Alert variant="destructive">
						<AlertDescription>
							{error?.message || mutation.error?.message}
							{error?.details && (
								<span className="block mt-1 text-xs opacity-70">
									{error.details}
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}

				{/* Action Buttons */}
				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-muted/30 rounded-xl -z-10" />
					<div className="flex flex-col sm:flex-row items-stretch gap-3 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
						<Button
							onClick={handleCreateDirect}
							disabled={!isValid || mutation.isPending}
							className="group relative flex-1 overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
						>
							<span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<Send className="h-4 w-4 mr-2 transition-transform group-hover:scale-110 group-hover:rotate-12" />
							<span className="relative">
								{mutation.isPending
									? "Creating..."
									: "Create Authorization Request"}
							</span>
						</Button>
						{viewMode !== "json" && (
							<Button
								variant="outline"
								onClick={handleShowPreview}
								disabled={!isValid || mutation.isPending}
								className="group relative flex-1 overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
							>
								<span className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<Eye className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
								<span className="relative">Preview Authorization Request</span>
							</Button>
						)}
					</div>
				</div>

				{/* Save Template Dialog */}
				{showSaveDialog && (
					<SaveTemplateDialog onClose={() => setShowSaveDialog(false)} />
				)}
			</CardContent>
		</Card>
	);
}
