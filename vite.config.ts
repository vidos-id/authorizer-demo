import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	base: "/authorizer-demo/",
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					"vendor-react": ["react", "react-dom"],
					"vendor-query": ["@tanstack/react-query"],
					"vendor-ui": [
						"@radix-ui/react-accordion",
						"@radix-ui/react-alert-dialog",
						"@radix-ui/react-checkbox",
						"@radix-ui/react-collapsible",
						"@radix-ui/react-dialog",
						"@radix-ui/react-label",
						"@radix-ui/react-radio-group",
						"@radix-ui/react-select",
						"@radix-ui/react-separator",
						"@radix-ui/react-slot",
						"@radix-ui/react-tabs",
					],
					"vendor-icons": ["lucide-react"],
					"vendor-qr": ["qrcode.react"],
					"vendor-validation": ["zod"],
					"vendor-state": ["zustand"],
					"vendor-id": ["mnemonic-id"],
					"vendor-utils": [
						"class-variance-authority",
						"clsx",
						"tailwind-merge",
					],
				},
			},
		},
	},
});
