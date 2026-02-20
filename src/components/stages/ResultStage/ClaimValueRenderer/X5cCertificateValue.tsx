import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface X5cCertificateValueProps {
	certificates: string[];
}

const CERT_LABELS = ["Leaf (end-entity)", "Intermediate", "Root"] as const;

function getCertLabel(index: number, total: number): string {
	if (total === 1) return "Certificate";
	if (index === 0) return CERT_LABELS[0];
	if (index === total - 1 && total > 1) return CERT_LABELS[2];
	return `${CERT_LABELS[1]} ${total > 3 ? index : ""}`.trim();
}

function CertCopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-7 px-2 text-xs"
			onClick={handleCopy}
		>
			{copied ? (
				<>
					<Check className="h-3 w-3 mr-1 text-green-600" />
					Copied
				</>
			) : (
				<>
					<Copy className="h-3 w-3 mr-1" />
					Copy
				</>
			)}
		</Button>
	);
}

function getX509ViewerUrl(cert: string): string {
	return `https://x509.io/?cert=${encodeURIComponent(cert)}`;
}

export function X5cCertificateValue({
	certificates,
}: X5cCertificateValueProps) {
	return (
		<div className="border-l-[3px] border-gray-300 dark:border-gray-600 pl-4 mt-1 space-y-3">
			{certificates.map((cert, index) => {
				const label = getCertLabel(index, certificates.length);
				const truncated =
					cert.length > 40 ? `${cert.slice(0, 20)}...${cert.slice(-20)}` : cert;

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: certificates are positional
						key={index}
						className="space-y-1"
					>
						<div className="text-xs font-medium text-muted-foreground">
							{label}
						</div>
						<div className="text-xs font-mono text-muted-foreground break-all">
							{truncated}
						</div>
						<div className="flex gap-1.5 flex-wrap">
							<Button
								variant="outline"
								size="sm"
								className="h-7 px-2 text-xs"
								asChild
							>
								<a
									href={getX509ViewerUrl(cert)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="h-3 w-3 mr-1" />
									View Certificate
								</a>
							</Button>
							<CertCopyButton value={cert} />
						</div>
					</div>
				);
			})}
		</div>
	);
}

/**
 * Checks if a field name + value looks like an x5c certificate chain.
 * x5c is an array of base64-encoded DER certificates.
 */
export function isX5cCertificateArray(
	fieldName: string,
	value: unknown,
): value is string[] {
	if (fieldName.toLowerCase() !== "x5c") return false;
	if (!Array.isArray(value)) return false;
	if (value.length === 0) return false;
	return value.every((item) => typeof item === "string" && item.length > 20);
}
