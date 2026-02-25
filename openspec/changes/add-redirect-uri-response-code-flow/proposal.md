## Why

In direct_post flows, the user starts the verifier flow, shares credentials in the wallet, and then the wallet receives a redirect URI (with `response_code`) from the Authorizer and opens it in the browser. The current app always starts at Step 1 and does not recover result context from that redirect, so users need first-class redirect-URI handling to immediately see the authorization result (or a clear failure reason).

## What Changes

- Detect `response_code` on initial page load and treat it as an OID4VP redirect-URI callback context.
- Automatically route the app to Step 3 (Result) and attempt one-time resolution of `response_code` to `authorizationId` via the Authorizer resolve endpoint.
- Use the resolved `authorizationId` to fetch and render terminal authorization data (status, policy results, submitted credentials) in the existing result experience.
- Add a top-of-page informational note indicating the page was opened via the OID4VP redirect URI flow from a wallet.
- Add robust failure handling when resolution fails (expired/used code, invalid code, network errors), including explicit guidance for cross-device/custom-instance mismatch cases.

## Capabilities

### New Capabilities
- `redirect-uri-response-code`: Handle OID4VP redirect URI callbacks that include `response_code`, resolve them to `authorizationId`, and bootstrap the result page experience.

### Modified Capabilities
- `flow-navigation`: Add entry path that starts directly in RESULT stage when `response_code` is present.
- `result-display`: Support redirect-flow context notice and redirect-specific error messaging, including custom Authorizer instance mismatch guidance.

## Impact

- Affected UI/state: app bootstrap routing, stage initialization, and result-stage loading states.
- Affected API usage: resolve `response_code` endpoint plus existing authorization status/result retrieval endpoints keyed by `authorizationId`.
- Error UX impact: new user-facing guidance for one-time/TTL resolution failures and cross-device instance mismatch scenarios.
- Testing impact: add coverage for successful redirect resolution, code reuse/expiration, and mobile/laptop authorizer-instance mismatch.
