# Change: Add Trust Anchor Certificate Display

## Why

EUDI wallets (and some others) require configuring the trust anchor certificate used by the authorizer service to sign authorization requests. Without this, wallets won't trust incoming verification requests. Users currently have no way to view or export this certificate from the demo app.

## What Changes

- Add new "Trust Anchor Certificate" collapsible section below the "App Configuration" section
- Lazy-load certificate data from `/instances/oid4vp-trust-anchor` when section is expanded
- Display anchor type (root/account/instance) and PEM certificate in formatted view
- Provide copy and download actions for the PEM certificate (named `vidos-{anchor-type}.pem`)
- Include refresh action since the certificate can change with authorizer config
- URL is dynamic based on the configured authorizer instance

## Impact

- Affected specs: New `trust-anchor-display` capability
- Affected code:
  - New `TrustAnchorConfig.tsx` component
  - Modify `CreateStage.tsx` to include new collapsible section
  - Add React Query hook for fetching trust anchor data
