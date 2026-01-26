import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CredentialCaseDefinition } from "@/config/credential-cases/types";
import { useAppStore } from "@/stores/appStore";
import { validateCredentialCase } from "@/utils/credentialCaseValidation";

interface CustomCredentialCaseDialogProps {
	mode: "create" | "edit" | "clone";
	existingCase?: CredentialCaseDefinition | null;
	onClose: () => void;
}

export function CustomCredentialCaseDialog({
	mode,
	existingCase,
	onClose,
}: CustomCredentialCaseDialogProps) {
	const [jsonInput, setJsonInput] = useState("");
	const [customId, setCustomId] = useState("");
	const [errors, setErrors] = useState<string[]>([]);
	const [isValidating, setIsValidating] = useState(false);

	const customCases = useAppStore((state) => state.customCredentialCases);
	const addCustomCase = useAppStore((state) => state.addCustomCredentialCase);
	const updateCustomCase = useAppStore(
		(state) => state.updateCustomCredentialCase,
	);

	// Initialize the form based on mode
	useEffect(() => {
		if (mode === "edit" && existingCase) {
			setJsonInput(JSON.stringify(existingCase, null, 2));
			setCustomId(existingCase.id);
		} else if (mode === "clone" && existingCase) {
			const clonedCase = { ...existingCase, id: `${existingCase.id}_custom` };
			setJsonInput(JSON.stringify(clonedCase, null, 2));
			setCustomId(clonedCase.id);
		} else {
			// Create mode - provide a template
			const template: CredentialCaseDefinition = {
				id: "my_custom_case",
				displayName: "My Custom Credential Case",
				formats: [
					{
						id: "my_custom_format",
						format: "dc+sd-jwt",
						displayName: "Custom SD-JWT",
						credentialType: "urn:custom:credential:1",
						attributes: [
							{
								id: "example_attr",
								displayName: "Example Attribute",
								path: ["example_attr"],
								requiredForIssuance: false,
								nonSelectivelyDisclosable: false,
							},
						],
					},
				],
			};
			setJsonInput(JSON.stringify(template, null, 2));
			setCustomId("my_custom_case");
		}
	}, [mode, existingCase]);

	// Validate JSON in real-time (with debounce)
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsValidating(true);
			try {
				// Parse to update the ID if it changed in JSON
				const parsed = JSON.parse(jsonInput);
				if (parsed && typeof parsed === "object" && "id" in parsed) {
					setCustomId(parsed.id as string);
				}

				// Validate
				const excludeId = mode === "edit" ? existingCase?.id : undefined;
				const result = validateCredentialCase(
					jsonInput,
					customCases,
					excludeId,
				);
				setErrors(result.errors);
			} catch (_e) {
				// JSON parse error will be caught by validation
			} finally {
				setIsValidating(false);
			}
		}, 500); // Debounce validation

		return () => clearTimeout(timer);
	}, [jsonInput, customCases, mode, existingCase]);

	// Handle ID change in clone mode
	const handleIdChange = (newId: string) => {
		setCustomId(newId);
		try {
			const parsed = JSON.parse(jsonInput);
			if (parsed && typeof parsed === "object") {
				parsed.id = newId;
				setJsonInput(JSON.stringify(parsed, null, 2));
			}
		} catch (_e) {
			// Ignore if JSON is invalid
		}
	};

	const handleSubmit = () => {
		// Final validation
		const excludeId = mode === "edit" ? existingCase?.id : undefined;
		const result = validateCredentialCase(jsonInput, customCases, excludeId);

		if (!result.valid) {
			setErrors(result.errors);
			return;
		}

		try {
			const credCase = JSON.parse(jsonInput) as CredentialCaseDefinition;

			if (mode === "edit" && existingCase) {
				updateCustomCase(existingCase.id, credCase);
			} else {
				// create or clone
				addCustomCase(credCase);
			}

			onClose();
		} catch (e) {
			setErrors([
				`Failed to parse JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
			]);
		}
	};

	const dialogTitle =
		mode === "create"
			? "Add New Custom Credential Case"
			: mode === "edit"
				? "Edit Custom Credential Case"
				: "Clone Credential Case";

	const dialogDescription =
		mode === "create"
			? "Define a custom credential case using JSON. See the documentation for the required structure."
			: mode === "edit"
				? "Edit the JSON definition of your custom credential case."
				: "Create a new custom case based on an existing one. Change the ID to avoid conflicts.";

	const hasErrors = errors.length > 0;

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{mode === "clone" && (
						<div className="space-y-2">
							<Label htmlFor="custom-id">Credential Case ID</Label>
							<Input
								id="custom-id"
								value={customId}
								onChange={(e) => handleIdChange(e.target.value)}
								placeholder="my_custom_case"
								className="font-mono"
							/>
							<p className="text-sm text-muted-foreground">
								The unique identifier for this credential case. Must be unique
								across all cases.
							</p>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="json-input">JSON Definition</Label>
						<Textarea
							id="json-input"
							value={jsonInput}
							onChange={(e) => setJsonInput(e.target.value)}
							className="font-mono text-sm min-h-[400px]"
							placeholder="Paste your credential case JSON here..."
						/>
						<p className="text-sm text-muted-foreground">
							See{" "}
							<code className="bg-muted px-1 py-0.5 rounded">
								<a
									href="https://github.com/vidos-id/authorizer-demo/blob/main/CUSTOM_CREDENTIAL_CASE.md"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									custom credential case documentation
								</a>
							</code>{" "}
							for definition and examples.
						</p>
					</div>

					{hasErrors && (
						<Alert variant="destructive">
							<AlertDescription>
								<div className="space-y-1">
									<p className="font-medium">Validation Errors:</p>
									<ul className="list-disc list-inside space-y-1">
										{errors.map((error) => (
											<li key={error} className="text-sm">
												{error}
											</li>
										))}
									</ul>
								</div>
							</AlertDescription>
						</Alert>
					)}

					{!hasErrors && !isValidating && jsonInput.trim().length > 0 && (
						<Alert>
							<AlertDescription className="text-sm text-green-600 dark:text-green-400">
								✓ JSON is valid
							</AlertDescription>
						</Alert>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={hasErrors || isValidating}>
						{mode === "edit" ? "Update" : "Add"} Custom Case
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
