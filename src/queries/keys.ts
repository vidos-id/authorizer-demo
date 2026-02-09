export const authorizationKeys = {
	all: ["authorization"] as const,
	detail: (id?: string) => [...authorizationKeys.all, id] as const,
	status: (id?: string) => [...authorizationKeys.detail(id), "status"] as const,
	policy: (id?: string) =>
		[...authorizationKeys.detail(id), "policy-response"] as const,
	jwt: (id?: string) => [...authorizationKeys.detail(id), "jwt"] as const,
	credentials: (id?: string) =>
		[...authorizationKeys.detail(id), "credentials"] as const,
};
