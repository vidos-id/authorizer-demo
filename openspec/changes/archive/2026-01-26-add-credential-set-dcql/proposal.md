# Change: Add Credential Set DCQL Support

## Why

Current DCQL query builder only supports requesting all credentials as required. The OID4VP spec (section 6.2) defines `credential_sets` which enables:
- Alternative credentials (OR logic): Accept ID from mDL OR ID from photo card
- Credential combinations (AND logic): Require credential_1 AND credential_2 together
- Optional credential sets: Request credentials that are nice-to-have but not required
- Same document type with different claim subsets (e.g., mDL for ID claims, mDL for address claims)

This enables more flexible verification scenarios matching real-world use cases.

## What Changes

### Credential Request Changes
- Allow duplicate document types with different attribute selections (e.g., two MDL entries)
- Add editable `id` field (pre-filled with UUID, user can customize to "mdl-id", "mdl-address", etc.)
- The `id` field value becomes the DCQL credential `id`
- ID displayed as subtitle in item header (monospace font)
- "Add to set" button with text + icon (visible when sets exist)

### Credential Sets Feature
- Add new "Credential Sets" section in UI between Credential Requests and Advanced Options
- Support creating credential sets with multiple options (alternatives)
- Each option references credentials by their `id`
- Support marking credential sets as required/optional
- Validate all option references match existing credential IDs

### UI Patterns
- Both credential requests and sets use Collapsible pattern (independent state per item)
- Delete button in top-left corner next to title (consistent across all items)
- Two-line title format: main label + ID subtitle
- Items stay open when ID is changed (no state sync needed)

### DCQL Generation
- Update `queryBuilder.ts` to generate `credential_sets` when configured
- Use user-provided `id` (not UUID) as credential identifier in DCQL

**Optional feature**: When no credential sets are defined, all credentials are required per spec default.

## Impact

- Affected specs: `credential-request-builder`
- Affected code:
  - `src/types/app.ts` - new types for credential sets, update CredentialRequestWithId
  - `src/utils/queryBuilder.ts` - generate credential_sets, use custom IDs
  - `src/stores/useFlowStore.ts` - state for credential sets
  - `src/components/stages/CreateStage/` - new and updated UI components
  - `src/components/stages/CreateStage/AdvancedOptions.tsx` - extracted component
