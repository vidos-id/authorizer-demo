import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Loader2,
	ShieldAlert,
	ShieldCheck,
	ShieldX,
	XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthorizationStatus } from "@/types/app";

interface StatusCardProps {
	status: AuthorizationStatus;
	className?: string;
}

const statusConfig: Record<
	AuthorizationStatus,
	{
		title: string;
		description: string;
		icon: typeof CheckCircle2;
		shieldIcon: typeof ShieldCheck;
		bgGradient: string;
		iconBg: string;
		iconColor: string;
		textColor: string;
		borderColor: string;
	}
> = {
	authorized: {
		title: "Authorized",
		description: "The credential was successfully verified and authorized",
		icon: CheckCircle2,
		shieldIcon: ShieldCheck,
		bgGradient:
			"from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
		iconBg: "bg-green-100 dark:bg-green-900/50",
		iconColor: "text-green-600 dark:text-green-400",
		textColor: "text-green-900 dark:text-green-100",
		borderColor: "border-green-200 dark:border-green-800",
	},
	rejected: {
		title: "Rejected",
		description: "The credential did not meet authorization requirements",
		icon: XCircle,
		shieldIcon: ShieldX,
		bgGradient:
			"from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
		iconBg: "bg-red-100 dark:bg-red-900/50",
		iconColor: "text-red-600 dark:text-red-400",
		textColor: "text-red-900 dark:text-red-100",
		borderColor: "border-red-200 dark:border-red-800",
	},
	error: {
		title: "Error",
		description: "An error occurred during the authorization process",
		icon: AlertTriangle,
		shieldIcon: ShieldAlert,
		bgGradient:
			"from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30",
		iconBg: "bg-red-100 dark:bg-red-900/50",
		iconColor: "text-red-600 dark:text-red-400",
		textColor: "text-red-900 dark:text-red-100",
		borderColor: "border-red-200 dark:border-red-800",
	},
	expired: {
		title: "Expired",
		description: "The authorization request has timed out",
		icon: Clock,
		shieldIcon: ShieldAlert,
		bgGradient:
			"from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
		iconBg: "bg-amber-100 dark:bg-amber-900/50",
		iconColor: "text-amber-600 dark:text-amber-400",
		textColor: "text-amber-900 dark:text-amber-100",
		borderColor: "border-amber-200 dark:border-amber-800",
	},
	pending: {
		title: "Processing",
		description: "Authorization is being processed",
		icon: Loader2,
		shieldIcon: ShieldCheck,
		bgGradient:
			"from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
		iconBg: "bg-blue-100 dark:bg-blue-900/50",
		iconColor: "text-blue-600 dark:text-blue-400",
		textColor: "text-blue-900 dark:text-blue-100",
		borderColor: "border-blue-200 dark:border-blue-800",
	},
	created: {
		title: "Created",
		description: "Authorization request was created",
		icon: Clock,
		shieldIcon: ShieldCheck,
		bgGradient:
			"from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30",
		iconBg: "bg-slate-100 dark:bg-slate-900/50",
		iconColor: "text-slate-600 dark:text-slate-400",
		textColor: "text-slate-900 dark:text-slate-100",
		borderColor: "border-slate-200 dark:border-slate-800",
	},
};

export function StatusCard({ status, className }: StatusCardProps) {
	const config = statusConfig[status];
	const Icon = config.icon;
	const ShieldIcon = config.shieldIcon;
	const isPending = status === "pending";

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border-2 p-6 md:p-8",
				`bg-gradient-to-br ${config.bgGradient}`,
				config.borderColor,
				className,
			)}
		>
			{/* Background decoration */}
			<div className="absolute -right-8 -top-8 opacity-5">
				<ShieldIcon className="h-48 w-48" />
			</div>

			<div className="relative flex flex-col items-center text-center gap-4">
				{/* Icon container */}
				<div
					className={cn(
						"flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full",
						config.iconBg,
					)}
				>
					<Icon
						className={cn(
							"h-8 w-8 md:h-10 md:w-10",
							config.iconColor,
							isPending && "animate-spin",
						)}
					/>
				</div>

				{/* Text content */}
				<div className="space-y-2">
					<h2
						className={cn(
							"text-2xl md:text-3xl font-bold tracking-tight",
							config.textColor,
						)}
					>
						{config.title}
					</h2>
					<p
						className={cn(
							"text-sm md:text-base max-w-md",
							config.textColor,
							"opacity-80",
						)}
					>
						{config.description}
					</p>
				</div>
			</div>
		</div>
	);
}
