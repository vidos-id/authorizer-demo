import type { DateRenderMode } from "@/utils/dateDetection";
import { getDateRenderMode, parseDate } from "@/utils/dateDetection";

interface DateValueProps {
	value: unknown;
	fieldName: string;
}

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
	const diffMonths = Math.round(diffDays / 30);
	const diffYears = Math.round(diffDays / 365);

	const isFuture = diffMs > 0;
	const absDays = Math.abs(diffDays);
	const absMonths = Math.abs(diffMonths);
	const absYears = Math.abs(diffYears);

	if (absYears >= 1) {
		const unit = absYears === 1 ? "year" : "years";
		return isFuture ? `in ${absYears} ${unit}` : `${absYears} ${unit} ago`;
	}

	if (absMonths >= 1) {
		const unit = absMonths === 1 ? "month" : "months";
		return isFuture ? `in ${absMonths} ${unit}` : `${absMonths} ${unit} ago`;
	}

	const unit = absDays === 1 ? "day" : "days";
	return isFuture ? `in ${absDays} ${unit}` : `${absDays} ${unit} ago`;
}

function formatDateByMode(date: Date, mode: DateRenderMode): string {
	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	switch (mode) {
		case "date-only":
			return dateFormatter.format(date);
		case "date-time":
			return dateTimeFormatter.format(date);
		case "date-with-relative":
			return `${dateFormatter.format(date)} (${formatRelativeTime(date)})`;
		case "date-time-with-relative":
			return `${dateTimeFormatter.format(date)} (${formatRelativeTime(date)})`;
	}
}

export function DateValue({ value, fieldName }: DateValueProps) {
	const date = parseDate(value);

	if (!date) {
		return <span className="text-muted-foreground">-</span>;
	}

	const mode = getDateRenderMode(fieldName);
	const formatted = formatDateByMode(date, mode);

	return <span>{formatted}</span>;
}
