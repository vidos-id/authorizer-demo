import { z } from "zod";
import { useAppStore } from "@/stores/appStore";

const authorizerUrlSchema = z.string().url();

export function getAuthorizerUrlOverride(): string | null {
	if (typeof window === "undefined") return null;
	const url = new URL(window.location.href);
	const params = url.searchParams;
	const rawValue = params.get("authorizerUrl");
	if (!rawValue) return null;
	const candidate = rawValue.trim();
	if (!candidate) return null;
	const parsed = authorizerUrlSchema.safeParse(candidate);
	if (!parsed.success) return null;
	params.delete("authorizerUrl");
	if (window.history.replaceState) {
		window.history.replaceState(null, "", url.toString());
	}
	return candidate;
}

export function applyAuthorizerUrlOverride(): void {
	const overrideUrl = getAuthorizerUrlOverride();
	if (!overrideUrl) return;
	const {
		instanceType,
		ownAuthorizerUrl,
		setInstanceType,
		setOwnAuthorizerUrl,
	} = useAppStore.getState();
	if (instanceType !== "own") {
		setInstanceType("own");
	}
	if (ownAuthorizerUrl !== overrideUrl) {
		setOwnAuthorizerUrl(overrideUrl);
	}
}
