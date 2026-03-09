import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAllCredentialCases,
	getAvailableFormats,
	getFormatDefinitionById,
	isCustomCase,
} from "@/config/credential-cases/utils";
import { useAppStore } from "@/stores/appStore";
import type { CredentialRequestWithId } from "@/types/app";
import { AttributeSelector } from "./AttributeSelector";

interface CredentialRequestBuilderProps {
	request: CredentialRequestWithId;
	onChange: (request: CredentialRequestWithId) => void;
	onRemove: () => void;
	canRemove: boolean; // Disable remove button if it's the last one
}

export function CredentialRequestBuilder({
	request,
	onChange,
	onRemove: _onRemove,
	canRemove: _canRemove,
}: CredentialRequestBuilderProps) {
	const customCredentialCases = useAppStore(
		(state) => state.customCredentialCases,
	);
	const profile = useAppStore((state) => state.responseModeConfig.profile);
	const credentialSets = useAppStore((state) => state.credentialSets);
	const updateCredentialId = useAppStore((state) => state.updateCredentialId);
	const updateCredentialSet = useAppStore((state) => state.updateCredentialSet);
	const allCredentialCases = getAllCredentialCases(customCredentialCases);

	// Local state for credential ID to prevent re-mapping of credential sets on each keystroke
	const [localId, setLocalId] = useState(request.id);

	// Find credential sets that reference this credential
	const referencingSets = credentialSets.filter((set) =>
		set.options.some((option) => option.includes(request.id)),
	);

	const handleIdChange = (newId: string) => {
		setLocalId(newId); // Update local state immediately for smooth typing
	};

	const handleIdBlur = () => {
		// Only update global state on blur to prevent re-rendering and collapsing
		if (localId !== request.id) {
			updateCredentialId(request.id, localId);
		}
	};

	const handleScrollToSet = (setId: string) => {
		const element = document.querySelector(
			`[data-credential-set-id="${setId}"]`,
		);
		if (element) {
			// Find the parent Collapsible and check if it's closed
			const collapsible = element.parentElement;
			if (collapsible?.getAttribute("data-state") === "closed") {
				// Find and click the CollapsibleTrigger to open it
				const trigger = element.querySelector('button[data-state="closed"]');
				if (trigger instanceof HTMLElement) {
					trigger.click();
				}
			}

			// Scroll after a brief delay to allow expansion animation
			setTimeout(() => {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
				// Add highlight effect
				element.classList.add("highlight-flash");
				setTimeout(() => {
					element.classList.remove("highlight-flash");
				}, 2000);
			}, 100);
		}
	};

	const handleAddToOption = (setId: string, optionIndex: number) => {
		const set = credentialSets.find((s) => s.id === setId);
		if (!set) return;

		// Add credential to the specified option
		const updatedOptions = [...set.options];
		if (optionIndex < updatedOptions.length) {
			// Add to existing option
			if (!updatedOptions[optionIndex].includes(request.id)) {
				updatedOptions[optionIndex] = [
					...updatedOptions[optionIndex],
					request.id,
				];
			}
		}

		updateCredentialSet(setId, { options: updatedOptions });
	};

	const handleCreateNewOption = (setId: string) => {
		const set = credentialSets.find((s) => s.id === setId);
		if (!set) return;

		// Create a new option with just this credential
		const updatedOptions = [...set.options, [request.id]];
		updateCredentialSet(setId, { options: updatedOptions });
	};

	const availableFormats = request.documentType
		? getAvailableFormats(request.documentType)
		: [];

	const handleDocTypeChange = (documentType: string) => {
		const formats = getAvailableFormats(documentType);
		const format = formats[0];

		if (format) {
			// Start with no attributes selected
			onChange({
				...request,
				documentType,
				formatId: format.id,
				format: format.format,
				attributes: [],
			});
		}
	};

	const handleFormatChange = (formatId: string) => {
		const newFormatDef = getFormatDefinitionById(formatId);
		if (!newFormatDef) return;

		// Try to transfer attributes from previous format to new format on best effort basis
		const transferredAttributes: string[] = request.attributes.filter(
			(oldAttrId) => newFormatDef.attributes.some((a) => a.id === oldAttrId),
		);

		onChange({
			...request,
			formatId,
			format: newFormatDef.format,
			attributes: transferredAttributes,
		});
	};

	const handleAttributesChange = (attributes: string[]) => {
		onChange({
			...request,
			attributes,
		});
	};

	const isHAIPProfile = profile === "haip";
	const requireCryptographicHolderBinding =
		isHAIPProfile || request.requireCryptographicHolderBinding !== false;

	const handleHolderBindingToggle = (checked: boolean | "indeterminate") => {
		onChange({
			...request,
			requireCryptographicHolderBinding: checked === true,
		});
	};

	return (
		<div className="space-y-4 p-4 border rounded-md">
			{/* Credential ID Field - Task 4.1 & 4.2 */}
			<div className="space-y-2">
				<Label
					htmlFor={`credential-id-${request.reactKey}`}
					className="text-xs"
				>
					Credential ID
				</Label>
				<div className="flex gap-2">
					<Input
						id={`credential-id-${request.reactKey}`}
						value={localId}
						onChange={(e) => handleIdChange(e.target.value)}
						onBlur={handleIdBlur}
						className="font-mono text-sm"
						placeholder="e.g., mdl-id"
					/>
					{/* Task 4.11: Add to set button (visible only when sets exist) */}
					{credentialSets.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className="shrink-0"
									title="Add to credential set"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add to set
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Add to Credential Set</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{/* Task 4.12: Dropdown with sets and options */}
								{credentialSets.map((set) => (
									<DropdownMenuSub key={set.id}>
										<DropdownMenuSubTrigger>{set.id}</DropdownMenuSubTrigger>
										<DropdownMenuSubContent>
											{set.options.map((_, optionIndex) => (
												<DropdownMenuItem
													key={`${set.id}-option-${optionIndex}`}
													onClick={() => handleAddToOption(set.id, optionIndex)}
												>
													Add to Option {optionIndex + 1}
												</DropdownMenuItem>
											))}
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleCreateNewOption(set.id)}
											>
												Create new option
											</DropdownMenuItem>
										</DropdownMenuSubContent>
									</DropdownMenuSub>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				{/* Credential Set Membership - Task 4.3 */}
				{referencingSets.length > 0 && (
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
						<span className="shrink-0">Used in credential sets:</span>
						<div className="flex flex-wrap items-center gap-2">
							{referencingSets.map((set) => (
								<Badge
									key={set.id}
									variant="secondary"
									className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors break-words max-w-full"
									onClick={() => handleScrollToSet(set.id)}
									title={`Scroll to credential set: ${set.id}`}
								>
									{set.id}
								</Badge>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor={`document-type-${request.reactKey}`}>
						Document Type
					</Label>
					<Select
						value={request.documentType || ""}
						onValueChange={handleDocTypeChange}
					>
						<SelectTrigger id={`document-type-${request.reactKey}`}>
							<SelectValue placeholder="Select a document type" />
						</SelectTrigger>
						<SelectContent>
							{allCredentialCases.map((credCase) => (
								<SelectItem key={credCase.id} value={credCase.id}>
									<div className="flex items-center gap-2">
										<span>{credCase.displayName}</span>
										{isCustomCase(credCase.id) && (
											<Badge variant="secondary" className="text-xs">
												Custom
											</Badge>
										)}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{request.documentType && (
					<div className="space-y-2">
						<Label htmlFor={`format-${request.reactKey}`}>Format</Label>
						<Select
							value={request.formatId || ""}
							onValueChange={handleFormatChange}
						>
							<SelectTrigger id={`format-${request.reactKey}`}>
								<SelectValue placeholder="Select a format" />
							</SelectTrigger>
							<SelectContent>
								{availableFormats.map((formatDef) => (
									<SelectItem key={formatDef.id} value={formatDef.id}>
										{formatDef.displayName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			{request.formatId && (
				<>
					<div className="flex items-start gap-3 rounded-md border p-3">
						<Checkbox
							id={`holder-binding-${request.reactKey}`}
							checked={requireCryptographicHolderBinding}
							disabled={isHAIPProfile}
							onCheckedChange={handleHolderBindingToggle}
						/>
						<div className="space-y-0.5">
							<Label
								htmlFor={`holder-binding-${request.reactKey}`}
								className="text-sm"
							>
								Require cryptographic holder binding
							</Label>
							<p className="text-xs text-muted-foreground">
								Enabled by default for each DCQL credential query.
								{isHAIPProfile
									? " HAIP always requires this."
									: " Disable to accept credentials without holder binding proof."}
							</p>
						</div>
					</div>

					<AttributeSelector
						formatId={request.formatId}
						selectedAttributes={request.attributes}
						onChange={handleAttributesChange}
					/>
				</>
			)}
		</div>
	);
}
