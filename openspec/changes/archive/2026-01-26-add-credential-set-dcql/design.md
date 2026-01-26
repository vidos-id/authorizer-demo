## Context

OID4VP 1.0 spec defines `credential_sets` in DCQL (section 6.2) for flexible credential requests. Current implementation only supports requiring all credentials. Need to add support for alternatives (OR) and combinations (AND).

Key spec insight: Same document type can appear multiple times with different claim subsets (e.g., "mdl-id" for identity claims, "mdl-address" for address claims).

## Goals / Non-Goals

**Goals:**
- Allow duplicate document types with different attribute selections
- Enable user-customizable credential IDs (for readable DCQL output)
- Enable credential set configuration via UI
- Generate valid DCQL with `credential_sets` per OID4VP spec
- Credential sets optional - when not configured, all credentials required per spec
- Support both required and optional sets
- Consistent UI patterns across credential requests and sets

**Non-Goals:**
- Drag-and-drop reordering of sets/options (future enhancement)
- Visual query preview of credential_sets logic
- Server-side validation of credential_sets

## Decisions

### 1. Credential ID Strategy

**Decision:** Editable ID field, pre-filled with UUID, user can customize to human-readable like "mdl-id"

**Rationale:**
- Spec example uses `"id": "mdl-id"` - human-readable
- UUID fallback ensures uniqueness without user effort
- The `id` field becomes the DCQL credential `id` (no separate friendlyName)
- ID displayed as subtitle in item header for visibility

**Note:** Copy button was removed - dropdown pickers in credential sets make manual copying unnecessary.

### 2. Allow Duplicate Document Types

**Decision:** Remove uniqueness constraint on document type per credential request

**Rationale:**
- Spec example shows same `doctype_value` (mDL) twice with different claims
- Enables "mdl-id" (identity claims) + "mdl-address" (address claims) pattern
- Different attribute selections = different credential entries

### 3. Section Ordering

**Decision:** Credential Requests → Credential Sets → Advanced Options

**Rationale:**
- Logical flow: define credentials first, then combine them, then access advanced features
- Credential sets reference credential IDs, so credentials must come first
- Advanced Options moved to separate component for composability

### 4. Collapsible Item Pattern

**Decision:** Both credential requests and credential sets use individual Collapsible components with independent state

**Rationale:**
- Each item manages its own open/closed state
- When credential ID changes, item stays open (no shared state to sync)
- Simpler code, no global accordion state management
- First item defaults to open

### 5. Credential Set Structure

```typescript
interface CredentialSet {
  id: string;              // User-editable ID, pre-filled with UUID
  options: string[][];     // Array of alternatives, each is array of credential IDs
  required: boolean;       // Maps to spec's 'required' field (default: true)
}
```

**Rationale:**
- Matches OID4VP spec structure directly
- `id` is user-editable (pre-filled UUID) for readable identification
- `options` as 2D array supports both OR (multiple options) and AND (multiple creds per option)
- `required` defaults true per spec

### 6. Consistent Visual Identity

**Decision:** Credential requests and credential sets share identical styling patterns

**Shared patterns:**
- Container: `border rounded-md`
- Header: Delete button (left) + Chevron + Two-line title
- Title format: Main label + ID subtitle (monospace, muted)
- Content: `px-4 pb-4 pt-2 border-t`
- Delete button: `variant="ghost" size="icon" h-8 w-8` positioned top-left

**Rationale:**
- Predictable delete action location across all item types
- Clear visual hierarchy with two-line titles
- Professional, consistent appearance

### 7. Button Wording

**Decision:** Use descriptive button text that explains the action

- "New Credential Set" (not "Add Credential Set")
- "Add OR Option" (not "Add Option")
- "Add to set" with icon (not icon-only)

**Rationale:**
- "New" implies creating fresh item
- "Add OR Option" clarifies the OR logic
- Text + icon more discoverable than icon-only

### 8. Credential Set Membership Indicator

**Decision:** Show which credential sets reference each credential request

**Rationale:**
- Helps users understand relationships between credentials and sets
- Visual feedback when credential is used in one or more sets
- Displayed as badges/tags on each credential request (e.g., "Used in credential sets: ID Set, Address Set")
- Clicking scrolls to and highlights the set

### 9. Optional Feature

**Decision:** When `credentialSets` is empty, omit `credential_sets` from DCQL output

**Rationale:**
- Per spec, `credential_sets` is optional - when omitted, all credentials in `credentials` array are required
- Feature is opt-in for users who need OR/AND logic
- Simpler DCQL output when feature not needed

## DCQL Output Example

Request: ID from mDL OR photo card, optional address from mDL OR photo card

```json
{
  "credentials": [
    { "id": "mdl-id", "format": "mso_mdoc", "meta": { "doctype_value": "org.iso.18013.5.1.mDL" }, "claims": [...id claims...] },
    { "id": "mdl-address", "format": "mso_mdoc", "meta": { "doctype_value": "org.iso.18013.5.1.mDL" }, "claims": [...address claims...] },
    { "id": "photo_card-id", "format": "mso_mdoc", "meta": { "doctype_value": "org.iso.23220.photoid.1" }, "claims": [...id claims...] },
    { "id": "photo_card-address", "format": "mso_mdoc", "meta": { "doctype_value": "org.iso.23220.photoid.1" }, "claims": [...address claims...] }
  ],
  "credential_sets": [
    { "options": [["mdl-id"], ["photo_card-id"]] },
    { "required": false, "options": [["mdl-address"], ["photo_card-address"]] }
  ]
}
```

## Data Flow

```
CredentialRequests (with user-defined IDs)
         |
         v
CredentialSets (reference credential IDs)
         |
         v
buildDCQLQueryMultiple(requests, sets)
         |
         v
{
  credentials: [...],       // Uses user-defined IDs
  credential_sets: [...]    // Only if sets configured
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Complex UI for power feature | Collapse credential sets by default, clear help text |
| Invalid references if credential deleted | Validate & warn, auto-remove orphan refs |
| Duplicate IDs entered | Warn but allow (spec doesn't forbid, just confusing) |
| Large credential_sets may overwhelm wallets | User responsibility, no limit enforced |

## Migration Plan

None required - purely additive feature. Existing configs work unchanged. UUIDs still valid IDs.

## Resolved Questions

1. **Should credential sets be included in config export/import?** No - not part of export/import.
2. **Max number of options per set?** No limit, no guidance - open ended, user decides.
3. **Copy button for credential IDs?** Removed - dropdown pickers make it unnecessary.
