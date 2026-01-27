## 1. Implementation
- [x] 1.1 Parse `authorizerUrl` from the query string and validate it with existing URL rules.
- [x] 1.2 Apply the override at app initialization, setting instance type to "own" and persisting the URL when valid.
- [x] 1.3 Ensure the Authorizer configuration UI reflects the override without regressions.

## 2. Validation
- [ ] 2.1 Run `bun run format`.
- [ ] 2.2 Run `bun run lint`.
- [ ] 2.3 Run `bun run type-check`.
- [ ] 2.4 Manually verify: open the app with `?authorizerUrl=<encoded-url>` and confirm the URL is applied.
