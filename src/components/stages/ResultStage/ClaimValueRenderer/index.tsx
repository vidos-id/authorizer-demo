import { isDateValue } from "@/utils/dateDetection";
import { ArrayValue } from "./ArrayValue";
import { DateValue } from "./DateValue";
import { ImageValue } from "./ImageValue";
import { ObjectValue } from "./ObjectValue";
import { PrimitiveValue } from "./PrimitiveValue";

export interface ClaimValueRendererProps {
	value: unknown;
	fieldName: string;
	credentialType: string;
	format: string;
}

export function ClaimValueRenderer({
	value,
	fieldName,
	credentialType,
	format,
}: ClaimValueRendererProps) {
	// 1. Image detection
	if (typeof value === "string" && value.startsWith("data:image/")) {
		return <ImageValue value={value} />;
	}

	// 2. Date detection
	if (isDateValue(value, fieldName)) {
		return <DateValue value={value} fieldName={fieldName} />;
	}

	// 3. Array detection
	if (Array.isArray(value)) {
		return (
			<ArrayValue
				value={value}
				credentialType={credentialType}
				format={format}
			/>
		);
	}

	// 4. Object detection (non-null, typeof === 'object')
	if (value !== null && typeof value === "object") {
		return (
			<ObjectValue
				value={value as Record<string, unknown>}
				credentialType={credentialType}
				format={format}
			/>
		);
	}

	// 5. Primitive values (string, number, boolean, null, undefined)
	return (
		<PrimitiveValue
			value={value as string | number | boolean | null | undefined}
		/>
	);
}

export default ClaimValueRenderer;
