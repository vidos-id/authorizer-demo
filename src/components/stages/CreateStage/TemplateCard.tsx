import { Hammer, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RequestTemplate } from "@/types/app";

interface TemplateCardProps {
	template: RequestTemplate;
	isSelected: boolean;
	onUseTemplate: () => void;
	onLoadToBuilder: () => void;
	onDelete?: () => void;
}

export function TemplateCard({
	template,
	isSelected,
	onUseTemplate,
	onLoadToBuilder,
	onDelete,
}: TemplateCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleCardClick = () => {
		if (!isSelected) {
			onUseTemplate();
		}
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDeleteDialog(true);
	};

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onLoadToBuilder();
	};

	const handleDeleteConfirm = () => {
		setShowDeleteDialog(false);
		onDelete?.();
	};

	return (
		<>
			<Card
				onClick={handleCardClick}
				className={cn(
					"group relative flex flex-col h-full transition-all cursor-pointer hover:shadow-md hover:border-primary/50",
					isSelected &&
						"border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10",
				)}
			>
				{/* Animated border glow for selected state */}
				{isSelected && (
					<div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse pointer-events-none" />
				)}
				<CardHeader className="flex-1 pb-3">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<CardTitle className="text-base">{template.name}</CardTitle>
							<CardDescription className="mt-1">
								{template.description}
							</CardDescription>
						</div>
						<div
							className={cn(
								"flex items-center gap-1 shrink-0 transition-opacity",
								isSelected
									? "opacity-100"
									: "opacity-0 group-hover:opacity-100",
							)}
						>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleEditClick}
								title="Edit in Builder"
								className="cursor-pointer"
							>
								<Hammer className="h-4 w-4" />
							</Button>
							{!template.isBuiltIn && onDelete && (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={handleDeleteClick}
									title="Delete template"
									className="cursor-pointer"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={(open) => !open && setShowDeleteDialog(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Template?</AlertDialogTitle>
						<AlertDialogDescription>
							<p>Are you sure you want to delete "{template.name}"?</p>
							<p className="mt-2">This action cannot be undone.</p>
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
