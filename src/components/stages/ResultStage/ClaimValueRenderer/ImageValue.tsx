import { useState } from "react";

interface ImageValueProps {
	value: string;
}

export function ImageValue({ value }: ImageValueProps) {
	const [hasError, setHasError] = useState(false);

	if (hasError) {
		return <span className="text-muted-foreground">[Image data]</span>;
	}

	return (
		<img
			src={value}
			alt="Credential"
			loading="lazy"
			onError={() => setHasError(true)}
			className="max-h-[200px] max-w-full"
		/>
	);
}
