import { AlertCircle, FileX2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCredentialsQuery } from "@/queries/useCredentialsQuery";
import { CredentialCard } from "./CredentialCard";

interface CredentialsDisplayProps {
	authorizationId: string;
	enabled: boolean;
}

export function CredentialsDisplay({ enabled }: CredentialsDisplayProps) {
	const { data, isLoading, error } = useCredentialsQuery({ enabled });

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span className="text-sm">Loading credentials...</span>
				</div>
				{/* Skeleton cards */}
				<div className="space-y-4">
					<div className="border rounded-lg p-4 space-y-3">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
						<div className="grid grid-cols-2 gap-2 pt-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4 border border-destructive/30 rounded-xl bg-destructive/5">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
					<AlertCircle className="h-6 w-6 text-destructive" />
				</div>
				<p className="text-sm font-medium text-destructive mb-1">
					Error loading credentials
				</p>
				<p className="text-xs text-destructive/70 text-center max-w-sm">
					{error.message}
				</p>
			</div>
		);
	}

	if (!data?.credentials || data.credentials.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-xl bg-muted/30">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
					<FileX2 className="h-6 w-6 text-muted-foreground" />
				</div>
				<p className="text-sm font-medium text-foreground mb-1">
					No credentials submitted
				</p>
				<p className="text-xs text-muted-foreground text-center max-w-sm">
					The wallet did not submit any credentials for this authorization
					request
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{data.credentials.map((credential) => (
				<CredentialCard
					key={credential.path.join("-")}
					credential={credential}
				/>
			))}
		</div>
	);
}
