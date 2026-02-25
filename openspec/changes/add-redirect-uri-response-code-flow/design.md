## Context

The app currently assumes users progress sequentially from Step 1 (Create) to Step 3 (Result). In OID4VP direct_post/direct_post.jwt, the wallet can later open the verifier redirect URI with a short-lived, one-time `response_code`. That redirect may happen on a different device/browser context than where the flow started, so local in-memory flow state is often unavailable. The app must recover from URL context alone, resolve `response_code` to `authorizationId`, and render result data.

Constraints:
- `response_code` resolution is one-time and short TTL.
- User may hit a different Authorizer instance on mobile vs desktop (custom instance mismatch).
- Existing Result stage already renders status, policy results, and credentials when `authorizationId` is known.

Stakeholders: demo users, integrators using custom Authorizer instances, support/debugging users.

## Goals / Non-Goals

**Goals:**
- Support URL entry via `?response_code=...` and immediately bootstrap RESULT stage.
- Resolve `response_code` via Authorizer resolve endpoint with best-effort UX.
- Reuse existing Result-stage data fetching with resolved `authorizationId`.
- Show clear top-of-page notice that this is wallet redirect-URI flow.
- Show actionable error guidance when resolution fails, including custom-instance mismatch note.

**Non-Goals:**
- Redesign the full 3-step navigation UI.
- Add new backend APIs beyond existing resolve + result/status endpoints.
- Guarantee recovery after code was already consumed elsewhere.

## Decisions

### 1) Redirect bootstrap at app initialization
Detect `response_code` on initial load before normal stage routing.

Rationale:
- Prevents flashing Step 1 and then jumping.
- Works when no prior local state exists.

Alternative considered:
- Detect only inside Step 1 component. Rejected: introduces UX flicker and couples redirect logic to a non-result stage.

### 2) Force stage to RESULT with a redirect context flag
When `response_code` is present, set stage to RESULT and store flow context (`source = redirect_uri`, `responseCode`).

Rationale:
- Keeps existing flow logic intact while enabling redirect-specific UI (notice/error text).

Alternative considered:
- Add a separate stage for redirect callbacks. Rejected: duplicate result behavior and higher complexity.

### 3) Resolve-first, then hydrate result data by authorizationId
Result stage runs pipeline:
1. Resolve `response_code` -> `authorizationId`.
2. Use `authorizationId` to fetch terminal status and result payloads (policy + credentials) through existing fetch paths.

Rationale:
- Maximizes reuse of current result rendering and API clients.
- Aligns with Authorizer model where authorization is canonical entity.

Alternative considered:
- Build dedicated response-code result endpoint path in frontend. Rejected: likely unnecessary if `authorizationId` lookup is sufficient.

### 4) Query-param cleanup after capture
After reading `response_code`, remove it from URL via `history.replaceState` while retaining app state.

Rationale:
- Reduces accidental re-resolution on refresh (one-time code).
- Avoids leaking code in copied URLs.

Alternative considered:
- Keep query param. Rejected: encourages repeated failures after first resolution.

### 5) Failure taxonomy and user messaging
Map resolve failures to user-facing categories:
- `expired/used/invalid response_code`: explain one-time + TTL behavior.
- network/server failure: allow retry action.
- suspected instance mismatch: include note that mobile browser may be using a different Authorizer instance than desktop flow.

Rationale:
- Gives actionable next steps instead of generic error.
- Addresses known cross-device custom-instance edge case.

Alternative considered:
- Single generic error string. Rejected: poor debuggability and support experience.

### 6) Retry strategy
Automatically attempt resolve once on load. Provide explicit user-triggered retry for transient failures only.

Rationale:
- Respects one-time semantics.
- Avoids repeated automatic calls that could consume/hammer endpoint.

Alternative considered:
- Automatic polling/retries for resolve endpoint. Rejected: unsafe with one-time token semantics.

## Risks / Trade-offs

- [Resolved `authorizationId` may not be sufficient for all result data in some API variants] -> Reuse existing result fetchers first; if missing pieces, render partial result with explicit "data unavailable" section and keep raw status visible.
- [Misclassifying failures as instance mismatch] -> Phrase as "possible cause" and include neutral troubleshooting steps (verify configured Authorizer URL).
- [URL cleanup may hinder debugging] -> Preserve debug details in UI state/log export rather than URL.
- [Cross-device entry has no prior request context] -> Ensure support/debug block works with minimal context and still exports resolve/error metadata.

## Migration Plan

1. Add bootstrap parsing for `response_code` and redirect context state.
2. Add Result-stage resolve pipeline + loading/error states.
3. Add redirect-flow notice banner and error-message variants.
4. Add tests for success, used/expired code, transient failure, and instance-mismatch guidance.
5. Rollout with no backend migration required; rollback by disabling redirect bootstrap path.

## Open Questions

- Is `authorizationId` always sufficient to retrieve policy results and submitted credentials in all supported Authorizer versions?
- Does resolve endpoint expose structured error codes that distinguish `expired`, `already_used`, `not_found`, and `wrong_instance`?
- Should retry be shown only for network/5xx errors, or always available with warning?
