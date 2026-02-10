## Why

The authorizer API now provides access to the actual credentials submitted by the wallet via `/openid4/vp/v1_0/authorizations/{authorizationId}/credentials`. Currently, users only see policy evaluation results but not the raw credential data that was evaluated. Displaying the submitted credentials provides transparency and allows users to inspect the actual claims received.

## What Changes

- Add new "Submitted Credentials" tab to ResultStage alongside existing "Policy Results" tab
- Create tabbed interface in ResultStage mirroring CreateStage's tab design language
- Fetch and display credentials from the new API endpoint
- Build flexible claim value renderers that handle various data types:
  - Primitive values (strings, numbers, booleans)
  - Dates (string-encoded ISO dates)
  - Images (base64-encoded data)
  - Objects and arrays (nested structures)
  - Complex nested combinations (arrays of objects, etc.)
- Display all credentials expanded by default in a compact format
- Show credential metadata (type, format, path) for each credential

## Capabilities

### New Capabilities
- `credential-display`: Display submitted credentials in ResultStage with type-aware claim value rendering and tabbed navigation

### Modified Capabilities
- `result-display`: Add tabbed interface structure to accommodate both policy results and credentials views

## Impact

- **Components**: New tab structure in ResultStage, new credential display components, new claim value renderer components
- **API**: New call to `/openid4/vp/v1_0/authorizations/{authorizationId}/credentials` endpoint
- **State**: May need to store fetched credentials in authorization state
- **Files affected**:
  - `src/components/stages/ResultStage/index.tsx` - add tabs
  - `src/components/stages/ResultStage/PolicyResults.tsx` - becomes tab content
  - New: credential display component(s)
  - New: claim value renderer components (separate files per type for maintainability)
