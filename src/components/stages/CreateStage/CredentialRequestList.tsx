import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CustomCredentialCaseManagerDialog } from "@/components/CustomCredentialCaseManagerDialog";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	getCredentialCase,
	getFormatDefinitionById,
} from "@/config/credential-cases/utils";
import { useAppStore } from "@/stores/appStore";
import type { CredentialRequestWithId } from "@/types/app";
import { generateCredentialId, generateReactKey } from "@/utils/id";
import { CredentialRequestBuilder } from "./CredentialRequestBuilder";

export function CredentialRequestList() {
	const requests = useAppStore((state) => state.credentialRequests);
	const [isCustomCasesDialogOpen, setIsCustomCasesDialogOpen] = useState(false);
	const addCredentialRequest = useAppStore(
		(state) => state.addCredentialRequest,
	);
	const updateCredentialRequest = useAppStore(
		(state) => state.updateCredentialRequest,
	);
	const removeCredentialRequest = useAppStore(
		(state) => state.removeCredentialRequest,
	);

	const handleAdd = () => {
		const newRequest: CredentialRequestWithId = {
			reactKey: generateReactKey(),
			id: generateCredentialId(),
			documentType: "pid",
			formatId: "pid_sd_jwt",
			format: "dc+sd-jwt",
			attributes: [], // Will be auto-filled when format is selected
			requireCryptographicHolderBinding: true,
		};

		addCredentialRequest(newRequest);
	};

	const handleUpdate = (id: string, request: CredentialRequestWithId) => {
		updateCredentialRequest(id, request);
	};

	const handleRemove = (id: string) => {
		removeCredentialRequest(id);
	};

	return (
		<div className="space-y-4 md:space-y-6">
			<div className="flex items-center justify-between">
				<Label>Credential Requests</Label>
				<button
					type="button"
					className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
					onClick={() => setIsCustomCasesDialogOpen(true)}
				>
					Manage custom credential types
				</button>
			</div>

			<CustomCredentialCaseManagerDialog
				open={isCustomCasesDialogOpen}
				onOpenChange={setIsCustomCasesDialogOpen}
			/>

			{requests.length === 0 ? (
				<div className="p-6 border rounded-md border-dashed text-center">
					<p className="text-sm text-muted-foreground mb-4">
						No credential requests yet. Add at least one to continue.
					</p>
					<Button type="button" onClick={handleAdd}>
						<Plus className="h-4 w-4 mr-2" />
						Add First Credential Request
					</Button>
				</div>
			) : (
				<>
					<div className="space-y-2">
						{requests.map((request, index) => (
							<CredentialRequestItem
								key={request.reactKey}
								request={request}
								canRemove={requests.length > 1}
								defaultOpen={index === 0}
								onUpdate={handleUpdate}
								onRemove={handleRemove}
							/>
						))}
					</div>
					<Separator className="my-4" />
					<Button type="button" variant="outline" size="sm" onClick={handleAdd}>
						<Plus className="h-4 w-4 mr-2" />
						Add Credential Request
					</Button>
				</>
			)}
		</div>
	);
}

// Individual credential request item with its own open state
interface CredentialRequestItemProps {
	request: CredentialRequestWithId;
	canRemove: boolean;
	defaultOpen: boolean;
	onUpdate: (id: string, request: CredentialRequestWithId) => void;
	onRemove: (id: string) => void;
}

function CredentialRequestItem({
	request,
	canRemove,
	defaultOpen,
	onUpdate,
	onRemove,
}: CredentialRequestItemProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const getDocumentTypeAbbrev = (displayName: string): string => {
		const match = displayName.match(/\(([^)]+)\)$/);
		return match ? match[1] : displayName;
	};

	const getRequestLabel = (
		req: CredentialRequestWithId,
	): { mainLabel: string; id: string } => {
		if (!req.documentType || !req.formatId) {
			return { mainLabel: "New Credential Request", id: req.id };
		}

		const formatDef = getFormatDefinitionById(req.formatId);
		if (!formatDef) {
			return { mainLabel: "Credential Request", id: req.id };
		}

		const credCase = getCredentialCase(req.documentType);
		const docTypeLabel = credCase
			? getDocumentTypeAbbrev(credCase.displayName)
			: req.documentType.toUpperCase();

		const nonDisclosableCount = formatDef.attributes.filter(
			(attr) => attr.nonSelectivelyDisclosable,
		).length;
		const totalCount = req.attributes.length + nonDisclosableCount;

		return {
			mainLabel: `${docTypeLabel} - ${formatDef.displayName} (${totalCount} attributes)`,
			id: req.id,
		};
	};

	const label = getRequestLabel(request);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className="border rounded-md">
				<div className="flex items-center gap-2 p-2">
					{canRemove && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 shrink-0"
							onClick={(e) => {
								e.stopPropagation();
								onRemove(request.id);
							}}
						>
							<Trash2 className="h-4 w-4 text-destructive" />
						</Button>
					)}
					<CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:bg-accent/50 rounded px-2 py-2 transition-colors">
						<ChevronRight
							className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
						/>
						<div className="flex flex-col items-start gap-0.5 flex-1">
							<span className="text-sm font-medium">{label.mainLabel}</span>
							<span className="text-xs font-mono text-muted-foreground">
								{label.id}
							</span>
						</div>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<div className="px-4 pb-4 pt-2 border-t">
						<CredentialRequestBuilder
							request={request}
							onChange={(updated) => onUpdate(request.id, updated)}
							onRemove={() => onRemove(request.id)}
							canRemove={canRemove}
						/>
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
