import { QrCode, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
	url: string;
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
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
					<p className="text-xs">
						Use your phone to scan the QR code using the wallet app or phone
						camera
					</p>
				</div>
			</div>

			{/* QR Code Container */}
			<div className="relative">
				{/* Decorative corner accents */}
				<div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
				<div className="absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
				<div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
				<div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

				{/* Mobile: 256px */}
				<div className="md:hidden p-4 bg-white rounded-xl shadow-lg ring-1 ring-black/5">
					<QRCodeSVG value={url} size={256} level="M" includeMargin />
				</div>
				{/* Tablet: 320px */}
				<div className="hidden md:block lg:hidden p-5 bg-white rounded-xl shadow-lg ring-1 ring-black/5">
					<QRCodeSVG value={url} size={320} level="M" includeMargin />
				</div>
				{/* Desktop: 384px */}
				<div className="hidden lg:block p-6 bg-white rounded-xl shadow-lg ring-1 ring-black/5">
					<QRCodeSVG value={url} size={384} level="M" includeMargin />
				</div>
			</div>

			{/* Instructions */}
			<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
				<Smartphone className="h-4 w-4" />
				<span className="text-xs md:text-sm">
					Point your camera at the code above
				</span>
			</div>
		</div>
	);
}
