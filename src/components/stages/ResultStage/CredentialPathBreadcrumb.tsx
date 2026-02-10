import { interpretCredentialPath } from "@/utils/credentialPath";

interface CredentialPathBreadcrumbProps {
	path: (string | number)[];
	format: string;
	/** Use title styling (larger, bolder first segment) */
	asTitle?: boolean;
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
		<span className="inline-flex items-center flex-wrap gap-x-1">
			{segments.map((segment, index) => (
				<span
					key={`${segment.label}-${segment.value}`}
					className="inline-flex items-center"
				>
					{index > 0 && <span className="text-muted-foreground mx-1">›</span>}
					{index === 0 ? (
						<span className="font-semibold">
							{segment.label
								? `${segment.label}: ${segment.value}`
								: segment.value}
						</span>
					) : (
						<span className="text-muted-foreground text-sm font-normal">
							{segment.label
								? `${segment.label}: ${segment.value}`
								: segment.value}
						</span>
					)}
				</span>
			))}
		</span>
	);
}
