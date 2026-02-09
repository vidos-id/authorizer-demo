import createClient from "openapi-fetch";
import type { paths } from "./authorizer";

export function createAuthorizerClient(baseUrl: string) {
	const client = createClient<paths>({ baseUrl });

	client.use({
		onRequest: ({ request }) => {
			console.log("Authorizer API Request:", request.url);
			request.headers.set("ngrok-skip-browser-warning", "true");
			console.log("Request Headers:", Array.from(request.headers.entries()));
		},
	});

	return client;
}
