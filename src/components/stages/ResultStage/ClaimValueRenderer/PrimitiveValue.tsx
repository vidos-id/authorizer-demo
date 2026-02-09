interface PrimitiveValueProps {
	value: string | number | boolean | null | undefined;
}

export function PrimitiveValue({ value }: PrimitiveValueProps) {
	if (value === null || value === undefined) {
		return <span className="text-muted-foreground">-</span>;
	}

	if (typeof value === "boolean") {
		return <span>{value ? "Yes" : "No"}</span>;
	}

	if (typeof value === "number") {
		return <span>{value.toLocaleString()}</span>;
	}

	return <span>{String(value)}</span>;
}
