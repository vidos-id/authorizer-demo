import {
	ChevronDown,
	ChevronUp,
	ExternalLink,
	Maximize2,
	Minimize2,
	QrCode,
	Smartphone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface WalletConnectProps {
	url: string;
}

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			// Check for mobile user agent or touch device with small screen
			const userAgent = navigator.userAgent.toLowerCase();
			const mobileKeywords = [
				"android",
				"webos",
				"iphone",
				"ipad",
				"ipod",
				"blackberry",
				"windows phone",
			];
			const isMobileUA = mobileKeywords.some((keyword) =>
				userAgent.includes(keyword),
			);
			const isSmallScreen = window.innerWidth < 768;
			const isTouchDevice =
				"ontouchstart" in window || navigator.maxTouchPoints > 0;

			setIsMobile(isMobileUA || (isSmallScreen && isTouchDevice));
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return isMobile;
}

function QRCodeWithExpand({ url }: { url: string }) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col items-center gap-6">
			{/* Header */}
			<div className="flex items-center gap-3 text-muted-foreground">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<QrCode className="h-5 w-5 text-primary" />
				</div>
				<div className="text-left">
					<p className="text-sm font-medium text-foreground">
						Scan with your wallet
					</p>
					<p className="text-xs">Open your wallet app and scan the QR code</p>
				</div>
			</div>

			{/* QR Code Container with Expand Button */}
			<div className="relative group">
				{/* QR Code - Standard or Expanded */}
				<div className="p-5 md:p-6 bg-white rounded-xl shadow-lg ring-1 ring-primary/10 transition-all duration-300">
					{isExpanded ? (
						// Expanded: 512px
						<QRCodeSVG value={url} size={512} level="M" />
					) : (
						<>
							{/* Tablet: 320px, Desktop: 384px */}
							<div className="lg:hidden">
								<QRCodeSVG value={url} size={320} level="M" />
							</div>
							<div className="hidden lg:block">
								<QRCodeSVG value={url} size={384} level="M" />
							</div>
						</>
					)}
				</div>

				{/* Expand/Collapse Button */}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground bg-white/90 hover:bg-white rounded-md shadow-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
				>
					{isExpanded ? (
						<>
							<Minimize2 className="h-3 w-3" />
							Shrink
						</>
					) : (
						<>
							<Maximize2 className="h-3 w-3" />
							Enlarge
						</>
					)}
				</button>
			</div>
		</div>
	);
}

function MobileWalletButton({ url }: { url: string }) {
	return (
		<div className="flex flex-col items-center gap-4">
			{/* Header */}
			<div className="flex items-center gap-3 text-muted-foreground">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<Smartphone className="h-5 w-5 text-primary" />
				</div>
				<div className="text-left">
					<p className="text-sm font-medium text-foreground">
						Open in your wallet
					</p>
					<p className="text-xs">Tap the button to launch your wallet app</p>
				</div>
			</div>

			{/* Primary Action Button */}
			<Button asChild size="lg" className="w-full max-w-sm gap-2">
				<a href={url} target="_blank" rel="noopener noreferrer">
					<ExternalLink className="h-5 w-5" />
					Open in Wallet App
				</a>
			</Button>
		</div>
	);
}

function CollapsibleQRCode({ url }: { url: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="flex items-center justify-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<QrCode className="h-4 w-4" />
					<span>{isOpen ? "Hide QR code" : "Show QR code instead"}</span>
					{isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</button>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-4">
				<div className="flex flex-col items-center gap-3">
					{/* QR for mobile - minimal padding, larger size */}
					<div className="p-2 bg-white rounded-lg shadow-md ring-1 ring-black/5 ring-primary/10">
						<QRCodeSVG value={url} size={280} level="M" includeMargin={false} />
					</div>
					<p className="text-xs text-muted-foreground text-center">
						Scan with another device
					</p>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

export function WalletConnect({ url }: WalletConnectProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div className="space-y-4">
				<MobileWalletButton url={url} />
				<CollapsibleQRCode url={url} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<QRCodeWithExpand url={url} />
			{/* Desktop: Secondary link option */}
			<div className="text-center">
				<p className="text-xs text-muted-foreground mb-1">
					Or open directly on this device:
				</p>
				<a
					href={url}
					className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink className="h-3.5 w-3.5" />
					Open in Wallet
				</a>
			</div>
		</div>
	);
}
