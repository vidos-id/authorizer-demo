import type { DateRenderMode } from "@/utils/dateDetection";
import { getDateRenderMode, parseDate } from "@/utils/dateDetection";

interface DateValueProps {
	value: unknown;
	fieldName: string;
}

/**
 * Formats a relative time with better precision.
 * Shows compound units (e.g., "2 years, 3 months") for more exact representation.
 */
function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const isFuture = diffMs > 0;

	// Calculate total days
	const totalDays = Math.abs(Math.round(diffMs / (1000 * 60 * 60 * 24)));

	// Calculate years, remaining months, and remaining days
	const years = Math.floor(totalDays / 365);
	const remainingDaysAfterYears = totalDays % 365;
	const months = Math.floor(remainingDaysAfterYears / 30);
	const days = remainingDaysAfterYears % 30;

	// Build parts array for compound display
	const parts: string[] = [];

	if (years > 0) {
		parts.push(`${years} ${years === 1 ? "year" : "years"}`);
	}

	if (months > 0) {
		parts.push(`${months} ${months === 1 ? "month" : "months"}`);
	}

	// Only show days if no years (to avoid excessive precision like "2 years, 3 months, 15 days")
	if (years === 0 && days > 0) {
		parts.push(`${days} ${days === 1 ? "day" : "days"}`);
	}

	// Handle edge case: less than a day
	if (parts.length === 0) {
		return isFuture ? "in less than a day" : "less than a day ago";
	}

	const timeString = parts.join(", ");
	return isFuture ? `in ${timeString}` : `${timeString} ago`;
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
