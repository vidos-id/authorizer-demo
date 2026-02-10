import { useState } from "react";

interface ImageValueProps {
	/** The data URL to display (e.g., "data:image/jpeg;base64,...") */
	dataUrl: string;
}

export function ImageValue({ dataUrl }: ImageValueProps) {
	const [hasError, setHasError] = useState(false);

	if (hasError) {
		return <span className="text-muted-foreground">[Image data]</span>;
	}

	return (
		<img
			src={dataUrl}
			alt="Credential"
			loading="lazy"
			onError={() => setHasError(true)}
			className="max-h-[200px] max-w-full"
		/>
	);
}
