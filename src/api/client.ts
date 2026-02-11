import createClient from "openapi-fetch";
import type { paths } from "./authorizer";

export function createAuthorizerClient(baseUrl: string) {
	const client = createClient<paths>({ baseUrl });
	return client;
}
