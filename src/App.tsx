import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { PersistentDebugConsole } from "@/components/PersistentDebugConsole";
import { ThemeToggle } from "@/components/ThemeToggle";
import { queryClient } from "@/lib/queryClient";
import { AuthorizationFlow } from "./components/AuthorizationFlow";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen bg-background p-4 md:p-8">
				<header className="text-center mb-8 relative">
					<div className="absolute top-0 right-0">
						<ThemeToggle />
					</div>
					<div className="flex items-center justify-center mb-4">
						<img
							src="/vidos-logo.svg"
							alt="Vidos Logo"
							className="h-16 w-auto dark:invert"
						/>
					</div>
					<p className="text-muted-foreground">
						OID4VP Authorization Request Demo
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						<a
							href="https://github.com/vidos-id/authorizer-demo"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 underline hover:text-foreground transition-colors"
						>
							<Github className="h-4 w-4" />
							View setup guide and documentation on GitHub
						</a>
					</p>
				</header>
				<main>
					<AuthorizationFlow />
				</main>
			</div>
			<PersistentDebugConsole />
		</QueryClientProvider>
	);
}

export default App;
