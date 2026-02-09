import { interpretCredentialPath } from "@/utils/credentialPath";

interface CredentialPathBreadcrumbProps {
	path: (string | number)[];
	format: string;
}

export function CredentialPathBreadcrumb({
	path,
	format,
}: CredentialPathBreadcrumbProps) {
	const segments = interpretCredentialPath(path, format);

	if (segments.length === 0) {
		return null;
	}

	return (
		<p className="text-xs text-muted-foreground">
			{segments.map((segment, index) => (
				<span key={`${segment.label}-${segment.value}`}>
					{index > 0 && <span className="mx-1">›</span>}
					{segment.label}: {segment.value}
				</span>
			))}
		</p>
	);
}
