import { Alert, AlertDescription } from "@/components/ui/alert";

export function DCApiJwtSdJwtWarning() {
	return (
		<Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
			<AlertDescription>
				`dc_api.jwt` with `dc+sd-jwt` can be flaky in Chromium-based browsers.
				This has been reported to Chromium for the time being:{" "}
				<a
					href="https://issues.chromium.org/issues/491263708"
					target="_blank"
					rel="noopener noreferrer"
					className="underline"
				>
					issue 491263708
				</a>
				. For now, prefer an `mso_mdoc` credential or `dc_api` (without JWT).
			</AlertDescription>
		</Alert>
	);
}
