import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import { applyAuthorizerUrlOverride } from "@/utils/authorizerUrlOverride";
import { bootstrapRedirectCallbackFlow } from "@/utils/redirectCallbackBootstrap";

applyAuthorizerUrlOverride();
bootstrapRedirectCallbackFlow();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
