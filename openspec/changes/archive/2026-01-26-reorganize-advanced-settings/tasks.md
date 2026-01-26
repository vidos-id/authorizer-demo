# Tasks: reorganize-advanced-settings

## Implementation Tasks

### Phase 1: Create AppConfiguration Component

- [x] **T1** Create `AppConfiguration.tsx` in `src/components/stages/CreateStage/`
  - Collapsible section with "App Configuration" title
  - Subtitle: "Configure the Vidos Authorizer instance and backup settings"
  - Contains AuthorizerConfig and ConfigExportImport
  - Auto-expand logic when instanceType === "own"

- [x] **T2** Add AppConfiguration to CreateStage above Tabs
  - Import and place between CardHeader and Tabs
  - Verify visually distinct from tab content

### Phase 2: Add Custom Types Link to Builder

- [x] **T3** Add "Manage custom credential types" link to CredentialRequestList
  - Position in section header area (single link above all credential requests)
  - Style as subtle text link (text-xs, muted colors, hover:underline)
  - Opens CustomCredentialCaseManagerDialog (full manager, not just create form)

- [x] **T4** Verify custom cases dialog works from new location
  - Test create, edit, clone, delete flows
  - Verify newly created cases appear in document type dropdowns
  - Verify link appears only once regardless of number of credential requests

### Phase 3: Cleanup

- [x] **T5** Remove AdvancedOptions component
  - Delete `src/components/stages/CreateStage/AdvancedOptions.tsx`
  - Remove import from CreateStage/index.tsx
  - Remove related Separator

- [x] **T6** Update authorizer-config spec
  - Modify UI Placement section
  - Update "Advanced Options Auto-Expansion" requirement name and content

- [x] **T7** Update config-export-import spec
  - Modify "Advanced Section Placement" requirement

- [x] **T8** Update credential-request-builder spec
  - Add requirement for custom types link

### Phase 4: Validation

- [x] **T9** Manual testing
  - Verify AppConfiguration works on all 3 tabs
  - Verify custom types link opens dialog and changes persist
  - Verify import/export still functions correctly
  - Test collapsed/expanded states

- [x] **T10** Run type-check, lint, build
  - `bun run type-check`
  - `bun run lint`
  - `bun run build`

## Dependencies

- T1 → T2 (AppConfiguration needed before adding to CreateStage)
- T3 → T4 (link needed before testing dialog)
- T2, T4 → T5 (verify new locations work before removing old)
- T5 → T6, T7, T8 (code cleanup before spec updates)

## Parallelizable Work

- T1, T3 can be done in parallel (independent components)
- T6, T7, T8 can be done in parallel (independent spec files)
