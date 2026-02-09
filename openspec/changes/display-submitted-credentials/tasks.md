# Implementation Tasks

## 1. API & Data Layer

- [ ] 1.1 Create `useCredentialsQuery` hook in `src/queries/` - fetch from `/openid4/vp/v1_0/authorizations/{authorizationId}/credentials`, handle 404 as empty state
- [ ] 1.2 Add TypeScript types for credentials response in `src/types/app.ts`
- [ ] 1.3 Update `usePolicyResponseQuery` to accept `enabled` option for lazy fetching

## 2. Utility Functions

- [ ] 2.1 Create `src/utils/credentialPath.ts` - path interpreter with format detection (SD-JWT, mdoc, fallback) returning semantic breadcrumb segments
- [ ] 2.2 Create `src/utils/claimDisplayName.ts` - lookup display name from CREDENTIAL_CASES by credentialType + claim key, fallback to title case conversion
- [ ] 2.3 Create `src/utils/dateDetection.ts` - detect date values (ISO patterns, Unix timestamps), determine render mode by field name

## 3. Claim Value Renderers

- [ ] 3.1 Create `src/components/stages/ResultStage/ClaimValueRenderer/index.tsx` - dispatcher that detects type and delegates to appropriate renderer
- [ ] 3.2 Create `ClaimValueRenderer/PrimitiveValue.tsx` - render strings, numbers, booleans as text
- [ ] 3.3 Create `ClaimValueRenderer/DateValue.tsx` - render dates with field-aware formatting (date-only, date+time, relative time)
- [ ] 3.4 Create `ClaimValueRenderer/ImageValue.tsx` - render data URI images inline with size constraints, error fallback
- [ ] 3.5 Create `ClaimValueRenderer/ObjectValue.tsx` - render objects as indented key-value pairs in bordered container
- [ ] 3.6 Create `ClaimValueRenderer/ArrayValue.tsx` - render arrays as bulleted list in bordered container

## 4. Credential Display Components

- [ ] 4.1 Create `src/components/stages/ResultStage/CredentialPathBreadcrumb.tsx` - display semantic path using utility from 2.1
- [ ] 4.2 Create `src/components/stages/ResultStage/CredentialCard.tsx` - credential card with header (type, format, breadcrumb) and claims list
- [ ] 4.3 Create `src/components/stages/ResultStage/CredentialsDisplay.tsx` - tab content component, uses `useCredentialsQuery`, renders credential cards, handles empty/error states

## 5. ResultStage Integration

- [ ] 5.1 Add tab state management to `ResultStage/index.tsx` - track active tab
- [ ] 5.2 Wrap ResultStage content in `Tabs` component with "Policy Results" and "Submitted Credentials" tabs
- [ ] 5.3 Move `PolicyResults` into tab content, pass `enabled` based on active tab
- [ ] 5.4 Add `CredentialsDisplay` as credentials tab content
- [ ] 5.5 Ensure tab styling matches CreateStage (centered, max-width, grid-cols-2)

## 6. Testing & Polish

- [ ] 6.1 Test with SD-JWT credential response - verify path breadcrumb, claim display names, date rendering
- [ ] 6.2 Test with mdoc credential response - verify 4-segment path breadcrumb, namespace display, image rendering (portrait)
- [ ] 6.3 Test with multiple credentials - verify all cards render, order preserved
- [ ] 6.4 Test empty state (404) - verify "No credentials submitted" message
- [ ] 6.5 Test error state - verify error displayed in tab
- [ ] 6.6 Run `bun run lint` and `bun run format` - fix any issues
