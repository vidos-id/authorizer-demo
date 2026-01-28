# Change: Add Authorization Request JWT Viewer

## Why
Users need to inspect the raw authorization request JWT for debugging and understanding the OID4VP flow. Currently there's no way to view or decode the JWT that the wallet receives.

## What Changes
- Add collapsible JWT viewer section in authorization stage (near existing "Created Authorization Request Response")
- Lazy-load JWT only when user clicks to view (not fetched by default)
- Show raw JWT string with copy button
- Provide "View on jwt.io" link to open JWT in decoder

## Impact
- Affected specs: `authorization-stage`
- Affected code: `src/components/stages/AuthorizationStage/`, `src/queries/`
