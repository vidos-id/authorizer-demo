## 1. Redirect Bootstrap

- [ ] 1.1 Add app-load query parsing to detect `response_code` and mark redirect callback context
- [ ] 1.2 Update initial stage routing to enter RESULT stage directly when `response_code` exists
- [ ] 1.3 Remove `response_code` from URL after capture while preserving in-memory callback state

## 2. Response Code Resolution Pipeline

- [ ] 2.1 Implement resolve call from RESULT-stage redirect context (`response_code` -> `authorizationId`)
- [ ] 2.2 Wire resolved `authorizationId` into existing result/status/policy/credentials fetch paths
- [ ] 2.3 Add loading and state transitions for resolve lifecycle (idle, resolving, resolved, failed)

## 3. Redirect-Flow UX and Errors

- [ ] 3.1 Add top-of-page notice that result page was opened via OID4VP redirect URI flow from wallet
- [ ] 3.2 Add error message variants for expired/used/invalid `response_code` with one-time + TTL guidance
- [ ] 3.3 Add explicit troubleshooting note for possible cross-device Authorizer instance mismatch
- [ ] 3.4 Add user-triggered retry action for transient resolve failures

## 4. Validation and Regression Coverage

- [ ] 4.1 Add/adjust tests for successful redirect callback flow into RESULT stage
- [ ] 4.2 Add tests for resolve failure classes (expired/used/invalid and transient/network failures)
- [ ] 4.3 Add tests asserting instance-mismatch troubleshooting note appears in redirect failure context
- [ ] 4.4 Run `bun run type-check`, `bun run lint`, and `bun run build` and fix any issues introduced by this change
