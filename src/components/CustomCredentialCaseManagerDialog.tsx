import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CREDENTIAL_CASES } from "@/config/credential-cases/credential-cases";
import type { CredentialCaseDefinition } from "@/config/credential-cases/types";
import { useAppStore } from "@/stores/appStore";
import { CustomCredentialCaseDialog } from "./CustomCredentialCaseDialog";

type CustomCredentialCaseManagerDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function CustomCredentialCaseManagerDialog({
	open,
	onOpenChange,
}: CustomCredentialCaseManagerDialogProps) {
	const [dialogMode, setDialogMode] = useState<
		"create" | "edit" | "clone" | null
	>(null);
	const [selectedCase, setSelectedCase] =
		useState<CredentialCaseDefinition | null>(null);
	const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

	const customCases = useAppStore((state) => state.customCredentialCases);
	const deleteCustomCase = useAppStore(
		(state) => state.deleteCustomCredentialCase,
	);
	const credentialRequests = useAppStore((state) => state.credentialRequests);

	const handleAddNew = () => {
		setDialogMode("create");
		setSelectedCase(null);
	};

	const handleEdit = (credCase: CredentialCaseDefinition) => {
		setDialogMode("edit");
		setSelectedCase(credCase);
	};

	const handleClone = (credCase: CredentialCaseDefinition) => {
		setDialogMode("clone");
		setSelectedCase(credCase);
	};

	const handleDeleteClick = (id: string) => {
		setCaseToDelete(id);
	};

	const handleDeleteConfirm = () => {
		if (caseToDelete) {
			deleteCustomCase(caseToDelete);
			setCaseToDelete(null);
		}
	};

	const handleCloseDialog = () => {
		setDialogMode(null);
		setSelectedCase(null);
	};

	// Check if a case is in use
	const isCaseInUse = (caseId: string) => {
		return credentialRequests.some((req) => req.documentType === caseId);
	};

	// Get the case being deleted for the warning
	const caseBeingDeleted = customCases.find((c) => c.id === caseToDelete);
	const caseInUse = caseToDelete ? isCaseInUse(caseToDelete) : false;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Custom Credential Cases</DialogTitle>
						<DialogDescription>
							Manage your custom credential case definitions. These are stored
							locally in your browser.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{/* Built-in Cases Section */}
						<div className="space-y-2">
							<h3 className="text-sm font-medium">Built-in Credential Cases</h3>
							<p className="text-sm text-muted-foreground">
								Clone a built-in case to create a custom variant.
							</p>
							<div className="space-y-2">
								{CREDENTIAL_CASES.map((credCase) => (
									<div
										key={credCase.id}
										className="flex items-center justify-between p-4 border rounded-lg bg-muted/50"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h4 className="font-medium">{credCase.displayName}</h4>
												<Badge variant="outline">Built-in</Badge>
											</div>
											<p className="text-sm text-muted-foreground mt-1">
												ID: {credCase.id} · {credCase.formats.length} format
												{credCase.formats.length === 1 ? "" : "s"}
											</p>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleClone(credCase)}
										>
											<Copy className="w-4 h-4 mr-2" />
											Clone
										</Button>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Custom Cases Section */}
						<div className="space-y-2">
							<h3 className="text-sm font-medium">Your Custom Cases</h3>
							{customCases.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<p>No custom credential cases yet.</p>
									<p className="text-sm mt-2">
										Click "Add New" to create from scratch, or clone a built-in
										case above.
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{customCases.map((credCase) => (
										<div
											key={credCase.id}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h4 className="font-medium">
														{credCase.displayName}
													</h4>
													<Badge variant="secondary">Custom</Badge>
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													ID: {credCase.id} · {credCase.formats.length} format
													{credCase.formats.length === 1 ? "" : "s"}
												</p>
												{isCaseInUse(credCase.id) && (
													<Badge variant="outline" className="mt-2">
														In use
													</Badge>
												)}
											</div>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEdit(credCase)}
												>
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDeleteClick(credCase.id)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<Button onClick={handleAddNew} className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add New Custom Case
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{dialogMode && (
				<CustomCredentialCaseDialog
					mode={dialogMode}
					existingCase={selectedCase}
					onClose={handleCloseDialog}
				/>
			)}

			<AlertDialog
				open={caseToDelete !== null}
				onOpenChange={(close) => !close && setCaseToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Custom Credential Case?</AlertDialogTitle>
						<AlertDialogDescription>
							{caseBeingDeleted && (
								<>
									<p>
										Are you sure you want to delete "
										{caseBeingDeleted.displayName}"?
									</p>
									{caseInUse && (
										<p className="mt-2 font-medium text-destructive">
											Warning: This credential case is currently in use by one
											or more credential requests. Deleting it may cause issues.
										</p>
									)}
									<p className="mt-2">This action cannot be undone.</p>
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
