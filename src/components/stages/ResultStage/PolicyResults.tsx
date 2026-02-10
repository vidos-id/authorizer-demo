import { BookText, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PrettyJson } from "@/components/ui/PrettyJson";
import { getPolicyDefinition } from "@/config/policyDefinitions";
import type {
	CredentialsResponse,
	PolicyError,
	PolicyResult,
} from "@/types/app";
import { CredentialPathBreadcrumb } from "./CredentialPathBreadcrumb";

// Type guard to check if error is a proper PolicyError object (not unknown/undefined)
function isPolicyError(error: unknown): error is PolicyError {
	return (
		typeof error === "object" &&
		error !== null &&
		"type" in error &&
		typeof (error as PolicyError).type === "string"
	);
}

interface PolicyResultsProps {
	results: PolicyResult[];
	credentials?: CredentialsResponse;
}

function camelToTitleCase(str: string): string {
	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (s) => s.toUpperCase())
		.trim();
}

export function PolicyResults({ results, credentials }: PolicyResultsProps) {
	// Separate presentation-level results from credential-level results
	const presentationResults = results.filter((r) => r.path.length === 0);
	const credentialResults = results.filter((r) => r.path.length > 0);

	// Group credential results by path[0] (credential UUID)
	const groupedByCredential = credentialResults.reduce(
		(acc, result) => {
			const credId = result.path[0];
			if (credId !== undefined) {
				const key = String(credId);
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(result);
			}
			return acc;
		},
		{} as Record<string, PolicyResult[]>,
	);

	// Create a map from credential UUID to format for quick lookup
	const credentialFormatMap = new Map<string, string>();
	if (credentials?.credentials) {
		for (const cred of credentials.credentials) {
			const credId = cred.path[0];
			if (credId !== undefined) {
				credentialFormatMap.set(String(credId), cred.format);
			}
		}
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Policy Evaluation Results</h3>

			{/* Presentation-level results */}
			{presentationResults.length > 0 && (
				<div className="border rounded-md p-4 md:p-6 space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<h4 className="font-medium">Authorization Results</h4>
						<div className="flex gap-2">
							{presentationResults.filter((r) => !r.error).length > 0 && (
								<Badge variant="default">
									{presentationResults.filter((r) => !r.error).length} passed
								</Badge>
							)}
							{presentationResults.filter((r) => r.error).length > 0 && (
								<Badge variant="destructive">
									{presentationResults.filter((r) => r.error).length} failed
								</Badge>
							)}
						</div>
					</div>

					<div className="space-y-2">
						{presentationResults.map((result) => (
							<PolicyResultItem
								key={`${result.path.join("-")}-${result.policy}-${result.service}`}
								result={result}
							/>
						))}
					</div>
				</div>
			)}

			{/* Credential-level results */}
			{Object.entries(groupedByCredential).map(([credId, credResults]) => {
				const passed = credResults.filter((r) => !r.error).length;
				const failed = credResults.filter((r) => r.error).length;
				const format = credentialFormatMap.get(credId);
				// Use the first result's path for breadcrumb display
				const firstResultPath = credResults[0]?.path;

				return (
					<div key={credId} className="border rounded-md p-4 md:p-6 space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<h4 className="font-medium">
								{format && firstResultPath ? (
									<CredentialPathBreadcrumb
										path={firstResultPath}
										format={format}
									/>
								) : (
									<span className="font-mono">{credId}</span>
								)}
							</h4>
							<div className="flex gap-2">
								{passed > 0 && <Badge variant="default">{passed} passed</Badge>}
								{failed > 0 && (
									<Badge variant="destructive">{failed} failed</Badge>
								)}
							</div>
						</div>

						<div className="space-y-2">
							{credResults.map((result) => (
								<PolicyResultItem
									key={`${result.path.join("-")}-${result.policy}-${result.service}`}
									result={result}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

function PolicyResultItem({ result }: { result: PolicyResult }) {
	const error = isPolicyError(result.error) ? result.error : null;
	const hasError = !!error;
	const hasData = !!result.data;
	const policyDef = getPolicyDefinition(result.policy, result.service);
	const policyPrettyName = camelToTitleCase(result.policy);

	return (
		<Collapsible>
			<div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-md">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0 ${
						hasError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
					}`}
				>
					{hasError ? "✗" : "✓"}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<div className="space-y-1 flex-1">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								{result.service.charAt(0).toUpperCase() +
									result.service.slice(1)}
							</p>
							<div className="flex items-center gap-2">
								<p className="font-medium text-sm">{policyPrettyName}</p>
								{policyDef && (
									<a
										href={policyDef.docsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-foreground transition-colors"
										aria-label="View documentation"
										title={`View documentation for "${policyPrettyName}" policy`}
									>
										<BookText className="h-3.5 w-3.5" />
									</a>
								)}
							</div>
							{policyDef && (
								<p className="text-xs text-muted-foreground">
									{policyDef.description}
								</p>
							)}
						</div>

						{(hasError || hasData) && (
							<CollapsibleTrigger className="p-2 hover:bg-muted rounded transition-colors shrink-0">
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							</CollapsibleTrigger>
						)}
					</div>

					<CollapsibleContent className="mt-3">
						{error && (
							<div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm space-y-2">
								{error.title && (
									<p className="font-medium text-red-900 dark:text-red-100">
										{error.title}
									</p>
								)}
								{error.detail && (
									<p className="text-red-800 dark:text-red-200">
										{error.detail}
									</p>
								)}
								<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-600 dark:text-red-400">
									{error.status && <span>Status: {error.status}</span>}
									{error.vidosType && (
										<span className="font-mono">Type: {error.vidosType}</span>
									)}
								</div>
								{error.errors && error.errors.length > 0 && (
									<div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800 space-y-1.5">
										<p className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wide">
											Details
										</p>
										<ul className="space-y-1">
											{error.errors.map((err, idx) => (
												<li
													key={`${err.pointer ?? idx}-${idx}`}
													className="text-xs text-red-700 dark:text-red-300"
												>
													{err.pointer && (
														<>
															<span className="font-mono text-red-600 dark:text-red-400">
																{err.pointer}
															</span>
															<span className="mx-1.5 text-red-400 dark:text-red-600">
																-
															</span>
														</>
													)}
													<span>{err.detail}</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}

						{hasData && (
							<div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded text-sm">
								<p className="font-medium text-green-900 dark:text-green-100 mb-2">
									{policyPrettyName} Result
								</p>
								<div className="text-xs md:text-sm text-green-800 dark:text-green-200 overflow-auto max-h-48 md:max-h-64 lg:max-h-80">
									<PrettyJson data={result.data} maxStringLength={50} />
								</div>
							</div>
						)}
					</CollapsibleContent>
				</div>
			</div>
		</Collapsible>
	);
}
