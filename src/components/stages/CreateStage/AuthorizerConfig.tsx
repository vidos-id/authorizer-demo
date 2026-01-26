import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/stores/appStore";
import { getManagedAuthorizerUrl } from "@/utils/env";

export function AuthorizerConfig() {
	const ownAuthorizerUrl = useAppStore((state) => state.ownAuthorizerUrl);
	const setOwnAuthorizerUrl = useAppStore((state) => state.setOwnAuthorizerUrl);
	const instanceType = useAppStore((state) => state.instanceType);
	const setInstanceType = useAppStore((state) => state.setInstanceType);

	// Check if managed instance is available
	const isManagedInstanceAvailable = getManagedAuthorizerUrl() !== undefined;

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOwnAuthorizerUrl(e.target.value);
	};

	const isValidUrl = (url: string) => {
		if (!url) return true;
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const showError =
		instanceType === "own" && ownAuthorizerUrl && !isValidUrl(ownAuthorizerUrl);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Instance Type</Label>
				<RadioGroup value={instanceType} onValueChange={setInstanceType}>
					<div className="space-y-3">
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value="managed"
								id="instance-managed"
								disabled={!isManagedInstanceAvailable}
							/>
							<Label
								htmlFor="instance-managed"
								className={`font-normal ${
									isManagedInstanceAvailable
										? "cursor-pointer"
										: "cursor-not-allowed opacity-50"
								}`}
							>
								Vidos Managed instance
								{!isManagedInstanceAvailable && " (not configured)"}
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="own" id="instance-own" />
							<Label
								htmlFor="instance-own"
								className="font-normal cursor-pointer"
							>
								Own instance
							</Label>
						</div>
					</div>
				</RadioGroup>
			</div>

			{instanceType === "own" && (
				<div className="space-y-2">
					<Label htmlFor="authorizer-url">Authorizer URL</Label>
					<Input
						id="authorizer-url"
						type="url"
						placeholder="https://<my-gateway>.gateway.service.eu.vidos.dev/<my-authorizer>"
						value={ownAuthorizerUrl}
						onChange={handleUrlChange}
						className={showError ? "border-destructive" : ""}
					/>
					{showError && (
						<p className="text-sm text-destructive">Please enter a valid URL</p>
					)}
				</div>
			)}

			<p className="text-sm text-muted-foreground">
				{instanceType === "managed" ? (
					<>
						Using the Vidos Managed instance (no setup required).{" "}
						<a
							href="https://github.com/vidos-id/authorizer-demo/blob/main/MANAGED_INSTANCE.md"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline hover:no-underline"
						>
							View configuration
						</a>
					</>
				) : (
					<>
						Enter your Vidos Gateway authorizer URL.{" "}
						<a
							href="https://github.com/vidos-id/authorizer-demo/blob/main/GATEWAY_SETUP.md"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline hover:no-underline"
						>
							Setup guide
						</a>
					</>
				)}
			</p>
		</div>
	);
}
