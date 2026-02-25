import {
	Car,
	type LucideIcon,
	MapPin,
	ScanFace,
	ShieldCheck,
	Shuffle,
	UserCheck,
} from "lucide-react";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BUILT_IN_TEMPLATES } from "@/config/request-templates/request-templates";
import { useAppStore } from "@/stores/appStore";
import type { RequestTemplate, TemplateCategory } from "@/types/app";
import { TemplateCard } from "./TemplateCard";

const CATEGORY_ORDER: TemplateCategory[] = [
	"age-verification",
	"identity",
	"address",
	"kyc",
	"driving",
	"flexible",
];

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
	"age-verification": "Age Verification",
	identity: "Identity",
	address: "Address",
	kyc: "KYC",
	driving: "Driving",
	flexible: "Flexible",
};

interface CategoryConfig {
	icon: LucideIcon;
	bgColor: string;
	iconColor: string;
}

export const CATEGORY_CONFIG: Record<TemplateCategory, CategoryConfig> = {
	"age-verification": {
		icon: ShieldCheck,
		bgColor: "bg-blue-100 dark:bg-blue-950/40",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	identity: {
		icon: UserCheck,
		bgColor: "bg-violet-100 dark:bg-violet-950/40",
		iconColor: "text-violet-600 dark:text-violet-400",
	},
	address: {
		icon: MapPin,
		bgColor: "bg-green-100 dark:bg-green-950/40",
		iconColor: "text-green-600 dark:text-green-400",
	},
	kyc: {
		icon: ScanFace,
		bgColor: "bg-amber-100 dark:bg-amber-950/40",
		iconColor: "text-amber-600 dark:text-amber-400",
	},
	driving: {
		icon: Car,
		bgColor: "bg-sky-100 dark:bg-sky-950/40",
		iconColor: "text-sky-600 dark:text-sky-400",
	},
	flexible: {
		icon: Shuffle,
		bgColor: "bg-pink-100 dark:bg-pink-950/40",
		iconColor: "text-pink-600 dark:text-pink-400",
	},
};

interface TemplatesTabProps {
	onLoadToBuilder?: (templateId: string) => void;
}

export function TemplatesTab({ onLoadToBuilder }: TemplatesTabProps) {
	const customRequestTemplates = useAppStore(
		(state) => state.customRequestTemplates,
	);
	const selectedTemplateId = useAppStore((state) => state.selectedTemplateId);
	const error = useAppStore((state) => state.error);
	const resetError = useAppStore((state) => state.resetError);
	const applyTemplate = useAppStore((state) => state.applyTemplate);
	const deleteCustomTemplate = useAppStore(
		(state) => state.deleteCustomTemplate,
	);

	// Memoize allTemplates to prevent infinite re-renders
	const allTemplates = useMemo(
		() => [...BUILT_IN_TEMPLATES, ...customRequestTemplates],
		[customRequestTemplates],
	);

	// Group templates by category
	const builtInTemplates = allTemplates.filter((t) => t.isBuiltIn);
	const customTemplates = allTemplates.filter((t) => !t.isBuiltIn);

	const templatesByCategory = CATEGORY_ORDER.reduce(
		(acc, category) => {
			acc[category] = builtInTemplates.filter((t) => t.category === category);
			return acc;
		},
		{} as Record<TemplateCategory, RequestTemplate[]>,
	);

	const handleUseTemplate = (templateId: string) => {
		resetError(); // Clear any previous errors
		applyTemplate(templateId);
	};

	const handleLoadToBuilder = (templateId: string) => {
		resetError(); // Clear any previous errors
		applyTemplate(templateId);
		onLoadToBuilder?.(templateId);
	};

	const handleDelete = (templateId: string) => {
		deleteCustomTemplate(templateId);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-bold">Request Templates</h2>
				<p className="text-muted-foreground">
					Select a template to quickly configure your authorization request
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertTitle>{error.message}</AlertTitle>
					{error.details && (
						<AlertDescription>{error.details}</AlertDescription>
					)}
				</Alert>
			)}

			{/* Built-in templates by category */}
			{CATEGORY_ORDER.map((category) => {
				const templates = templatesByCategory[category];
				if (templates.length === 0) return null;

				const CategoryIcon = CATEGORY_CONFIG[category].icon;

				return (
					<div key={category} className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<CategoryIcon className="h-4 w-4" />
							{CATEGORY_LABELS[category]}
						</h3>
						<div className="grid grid-rows-[auto] gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{templates.map((template) => (
								<TemplateCard
									key={template.id}
									template={template}
									isSelected={selectedTemplateId === template.id}
									onUseTemplate={() => handleUseTemplate(template.id)}
									onLoadToBuilder={() => handleLoadToBuilder(template.id)}
								/>
							))}
						</div>
					</div>
				);
			})}

			{/* Custom templates section */}
			{customTemplates.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground">
						Custom Templates
					</h3>
					<div className="grid grid-rows-[auto] gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{customTemplates.map((template) => (
							<TemplateCard
								key={template.id}
								template={template}
								isSelected={selectedTemplateId === template.id}
								onUseTemplate={() => handleUseTemplate(template.id)}
								onLoadToBuilder={() => handleLoadToBuilder(template.id)}
								onDelete={() => handleDelete(template.id)}
							/>
						))}
					</div>
				</div>
			)}

			{/* Empty state */}
			{allTemplates.length === 0 && (
				<div className="text-center text-muted-foreground py-12">
					<p>No templates available</p>
				</div>
			)}
		</div>
	);
}
