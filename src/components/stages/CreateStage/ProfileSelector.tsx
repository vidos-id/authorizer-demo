import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/stores/appStore";
import type { Profile } from "@/types/app";

export function ProfileSelector() {
	const config = useAppStore((state) => state.responseModeConfig);
	const setResponseModeConfig = useAppStore(
		(state) => state.setResponseModeConfig,
	);
	const credentialRequests = useAppStore((state) => state.credentialRequests);
	const setCredentialRequests = useAppStore(
		(state) => state.setCredentialRequests,
	);

	const handleProfileChange = (value: string) => {
		const profile: Profile = value === "none" ? undefined : "haip";
		let updatedMode = config.mode;

		// Silent auto-switch to signed mode for HAIP
		if (profile === "haip") {
			if (config.mode === "direct_post") {
				updatedMode = "direct_post.jwt";
			} else if (config.mode === "dc_api") {
				updatedMode = "dc_api.jwt";
			}

			setCredentialRequests(
				credentialRequests.map((request) => ({
					...request,
					requireCryptographicHolderBinding: true,
				})),
			);
		}

		setResponseModeConfig({
			...config,
			profile,
			mode: updatedMode,
		});
	};

	const currentValue = config.profile || "none";

	return (
		<div className="space-y-2">
			<Label htmlFor="profile-select">Authorization Profile</Label>
			<Select value={currentValue} onValueChange={handleProfileChange}>
				<SelectTrigger id="profile-select">
					<SelectValue placeholder="Select a profile" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="none">None</SelectItem>
					<SelectItem value="haip">HAIP</SelectItem>
				</SelectContent>
			</Select>
			<p className="text-xs text-muted-foreground">
				{config.profile === "haip" ? (
					<>
						HAIP (High Assurance Interoperability Profile) enforces stricter
						requirements over OID4VP.{" "}
						<a
							href="https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0.html"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-foreground"
						>
							Learn more
						</a>
					</>
				) : (
					"Optional profile to enforce specific compliance requirements"
				)}
			</p>
		</div>
	);
}
