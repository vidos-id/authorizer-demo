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
import { useAppStore } from "@/stores/appStore";
import { generateReactKey } from "@/utils/id";

interface SaveTemplateDialogProps {
	onClose: (saved: boolean) => void;
}

export function SaveTemplateDialog({ onClose }: SaveTemplateDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<string[]>([]);

	const credentialRequests = useAppStore((state) => state.credentialRequests);
	const credentialSets = useAppStore((state) => state.credentialSets);
	const transactionDataEntries = useAppStore(
		(state) => state.transactionDataEntries,
	);
	const customRequestTemplates = useAppStore(
		(state) => state.customRequestTemplates,
	);
	const addCustomTemplate = useAppStore((state) => state.addCustomTemplate);

	// Validate in real-time
	useEffect(() => {
		const validationErrors: string[] = [];

		// Name validation
		if (name.trim().length === 0) {
			validationErrors.push("Template name is required");
		} else if (name.trim().length > 50) {
			validationErrors.push("Template name must be 50 characters or less");
		}

		// Check for duplicate name
		if (
			name.trim().length > 0 &&
			customRequestTemplates.some(
				(t) => t.name.toLowerCase() === name.trim().toLowerCase(),
			)
		) {
			validationErrors.push(
				"A template with this name already exists. Please choose a different name.",
			);
		}

		// Description validation
		if (description.trim().length > 200) {
			validationErrors.push(
				"Template description must be 200 characters or less",
			);
		}

		// Credential requests validation
		if (credentialRequests.length === 0) {
			validationErrors.push(
				"At least one credential request must be configured to save a template",
			);
		}

		setErrors(validationErrors);
	}, [name, description, credentialRequests, customRequestTemplates]);

	const handleSubmit = () => {
		// Final validation
		if (errors.length > 0) {
			return;
		}

		// Create the template
		const templateId = generateReactKey();

		addCustomTemplate({
			id: templateId,
			name: name.trim(),
			description: description.trim(),
			category: "flexible",
			credentialRequests: [...credentialRequests],
			credentialSets: [...credentialSets],
			transactionDataEntries: [...transactionDataEntries],
			isBuiltIn: false,
		});

		onClose(true);
	};

	const hasErrors = errors.length > 0;
	const canSave = name.trim().length > 0 && !hasErrors;

	return (
		<Dialog open onOpenChange={() => onClose(false)}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Save as Template</DialogTitle>
					<DialogDescription>
						Save your current credential request configuration as a reusable
						template.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="template-name">
							Template Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="template-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Custom Identity Verification"
							maxLength={50}
						/>
						<p className="text-sm text-muted-foreground">
							A descriptive name to identify this template (max 50 characters)
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="template-description">Description (Optional)</Label>
						<Textarea
							id="template-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Brief description of what this template requests..."
							maxLength={200}
							rows={3}
						/>
						<p className="text-sm text-muted-foreground">
							Optional description of the template's purpose (max 200
							characters)
						</p>
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium">Template Contents</p>
						<div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
							<p>
								<span className="font-medium">Credential Requests:</span>{" "}
								{credentialRequests.length}
							</p>
							{credentialSets.length > 0 && (
								<p className="mt-1">
									<span className="font-medium">Credential Sets:</span>{" "}
									{credentialSets.length}
								</p>
							)}
							{transactionDataEntries.length > 0 && (
								<p className="mt-1">
									<span className="font-medium">Transaction Data:</span>{" "}
									{transactionDataEntries.length}
								</p>
							)}
						</div>
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

					{canSave && (
						<Alert>
							<AlertDescription className="text-sm text-green-600 dark:text-green-400">
								✓ Ready to save template
							</AlertDescription>
						</Alert>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onClose(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!canSave}>
						Save Template
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
