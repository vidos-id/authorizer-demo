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
			<div className="flex items-center justify-center py-12">
				<div className="text-sm text-muted-foreground">
					Loading credentials...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="border border-destructive/50 rounded-md p-4 bg-destructive/10">
				<p className="text-sm text-destructive font-medium">
					Error loading credentials
				</p>
				<p className="text-xs text-destructive/80 mt-1">{error.message}</p>
			</div>
		);
	}

	if (!data?.credentials || data.credentials.length === 0) {
		return (
			<div className="border rounded-md p-6 text-center">
				<p className="text-sm text-muted-foreground">
					No credentials submitted
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
