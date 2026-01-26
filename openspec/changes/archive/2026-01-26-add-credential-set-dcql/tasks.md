## 1. Type Definitions

- [x] 1.1 Keep `id` field on `CredentialRequestWithId` but allow user customization (pre-fill UUID)
- [x] 1.2 Create `CredentialSetOption` type (array of credential IDs - strings)
- [x] 1.3 Create `CredentialSet` interface with `id`, `options: string[][]`, `required: boolean`
- [x] 1.4 Add `credentialSets` array to AppState type

## 2. Store Updates

- [x] 2.1 Add `credentialSets` state to `useFlowStore`
- [x] 2.2 Add CRUD actions: `addCredentialSet`, `updateCredentialSet`, `removeCredentialSet`
- [x] 2.3 Add `updateCredentialId` action to change credential ID (auto-updates all set references)
- [x] 2.4 Reset credential sets on flow reset
- [x] 2.5 Auto-cleanup: remove orphan references when credential deleted
- [x] 2.6 Auto-remove empty options after cleanup

## 3. Query Builder Updates

- [x] 3.1 Update `DCQLCredential` interface - use user-provided `id` (not UUID)
- [x] 3.2 Update `DCQLQuery` interface to include optional `credential_sets`
- [x] 3.3 Update `buildDCQLQueryMultiple` to accept credential sets parameter
- [x] 3.4 Generate `credential_sets` array when sets are configured
- [x] 3.5 Preserve backward compatibility (no sets = current behavior, no credential_sets field)

## 4. UI Components

- [x] 4.1 Add editable ID input to `CredentialRequestBuilder` (pre-filled UUID, user-editable)
- [x] ~~4.2 Add copy-to-clipboard button next to ID field~~ (Removed - dropdown pickers make it unnecessary)
- [x] 4.3 Add credential set membership indicator to `CredentialRequestBuilder` (shows which sets include this credential)
- [x] 4.4 Make membership indicator clickable - scrolls to and highlights the credential set
- [x] 4.5 Create `CredentialSetBuilder` component for single set (ID input, options, required toggle)
- [x] 4.6 Add editable ID input to `CredentialSetBuilder` (pre-filled UUID, user-editable)
- [x] 4.7 Create `CredentialSetList` component to manage multiple sets
- [x] 4.8 Add credential set section to CreateStage (collapsible, between credential requests and advanced options)
- [x] 4.9 Option selector: dropdown showing only credentials not already in that option
- [x] 4.10 Add "OR" separator/divider between options in credential set UI
- [x] 4.11 Add "Add to set" action on credential requests (text + icon button, visible only when sets exist)
- [x] 4.12 "Add to set" dropdown: select set, then add to existing option or create new option
- [x] 4.13 Credential sets section collapsed by default
- [x] 4.14 Add inline help text explaining OR/AND logic

## 5. Validation

- [x] 5.1 Validate credential ID uniqueness (warn on duplicate, don't block)
- [x] 5.2 Validate all option references in credential sets exist in credential requests
- [x] 5.3 Validate at least one option per credential set (if sets defined)
- [x] 5.4 Validate each option has at least one credential selected
- [x] 5.5 Validate credential set has at least one option (don't auto-delete empty sets)
- [x] 5.6 Display validation errors with specific messages

## 6. Integration

- [x] 6.1 Wire credential sets to request builder
- [x] 6.2 Update request builder to pass credential sets
- [x] 6.3 Ensure JSON preview panel shows credential_sets when configured

## 7. Testing

- [x] 7.1 Type-check passes
- [x] 7.2 Lint passes
- [x] 7.3 Build succeeds
- [x] 7.4 Manual test: duplicate document types (MDL for ID + MDL for address)
- [x] 7.5 Manual test: credential sets with OR logic (mdl-id OR photo_card-id)
- [x] 7.6 Manual test: credential sets with AND logic (multiple creds per option)
- [x] 7.7 Manual test: optional credential sets (required: false)
- [x] 7.8 Manual test: DCQL output matches spec example format

## 8. UI Polish (Post-Implementation)

- [x] 8.1 Section ordering: Credential Requests → Credential Sets → Advanced Options
- [x] 8.2 Extract Advanced Options into separate `AdvancedOptions.tsx` component
- [x] 8.3 Button wording: "New Credential Set", "Add OR Option"
- [x] 8.4 Delete buttons positioned top-left next to title (consistent pattern)
- [x] 8.5 Two-line title format: main label + ID subtitle (monospace)
- [x] 8.6 Credential request ID displayed in collapsed header
- [x] 8.7 Remove copy ID button (dropdown pickers make it unnecessary)
- [x] 8.8 "Add to set" button: text + icon (not icon-only)
- [x] 8.9 Match button height with adjacent input fields
- [x] 8.10 Use Collapsible pattern for both requests and sets (independent state per item)
- [x] 8.11 Items stay open when ID is changed (no state sync needed)
- [x] 8.12 Unified visual styling across credential requests and credential sets
