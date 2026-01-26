/**
 * Support contact configuration
 */

export const SUPPORT_CONFIG = {
	/**
	 * Vidos contact form URL
	 */
	contactFormUrl: "https://vidos.id/contact-us",

	/**
	 * GitHub issues URL for this repository
	 */
	githubIssuesUrl: "https://github.com/vidos-id/authorizer-demo/issues",
} as const;

/**
 * Generate a subject line for support contact that includes the authorization ID
 */
export function generateSupportSubject(
	authorizationId?: string | null,
): string {
	if (authorizationId) {
		return `Vidos Authorizer Demo Support - Auth ID: ${authorizationId}`;
	}
	return "Vidos Authorizer Demo Support Request";
}
