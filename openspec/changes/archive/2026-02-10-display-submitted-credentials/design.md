## Context

The ResultStage currently displays policy evaluation results in a single view. The new credentials API (`/openid4/vp/v1_0/authorizations/{authorizationId}/credentials`) returns flattened credential objects with paths indicating their origin in the presentation.

**Current state:**
- ResultStage renders `PolicyResults` directly without tabs
- CreateStage uses `Tabs` component with Templates/Builder/JSON tabs
- `PrettyJson` component exists for JSON rendering but lacks type-specific formatting

**API Response Shape:**
```typescript
{
  authorizationId: string;
  credentials: {
    path: (string | number)[];  // e.g., ["cred1", 0, 0, "org.iso.18013.5.1"]
    format: string;              // "mdoc", "ietf.dc-sd-jwt"
    credentialType: string;      // "org.iso.18013.5.1.mDL", "eu.europa.ec.eudi.pid.1"
    claims: Record<string, unknown>;
  }[];
}
```

## Goals / Non-Goals

**Goals:**
- Add tabbed interface to ResultStage matching CreateStage design language
- Display submitted credentials with semantic path breadcrumbs
- Render claim values with type-aware formatting (dates, images, nested objects)
- Keep components small and focused (one file per renderer type)

**Non-Goals:**
- Linking credentials to specific policy results (future work)
- Editing or modifying credentials
- Credential verification/validation display
- Changing default tab to credentials (API stability pending)

## Decisions

### 1. Component Architecture

**Decision:** Create separate renderer components per data type, composed by a dispatcher.

```
src/components/stages/ResultStage/
├── index.tsx                    # Add Tabs wrapper
├── PolicyResults.tsx            # Existing (becomes tab content)
├── CredentialsDisplay.tsx       # New: credentials tab content
├── CredentialCard.tsx           # New: single credential display
├── CredentialPathBreadcrumb.tsx # New: semantic path display
└── ClaimValueRenderer/
    ├── index.tsx                # Dispatcher - detects type, delegates
    ├── PrimitiveValue.tsx       # strings, numbers, booleans
    ├── DateValue.tsx            # ISO dates, timestamps
    ├── ImageValue.tsx           # base64 images
    ├── ObjectValue.tsx          # nested objects
    └── ArrayValue.tsx           # arrays (recurses for items)
```

**Rationale:** Small files, single responsibility, easy to extend for new types.

**Alternatives considered:**
- Single monolithic renderer → rejected (hard to maintain, large file)
- Using existing `PrettyJson` → rejected (no type-specific formatting like dates/images)

### 2. Path Semantic Labels

**Decision:** Create a path interpreter that detects credential format and applies semantic labels.

**Path Structure:**
- First two segments are always: `[dcqlId, vpIndex]` (DCQL credential ID, VP token index)
- Additional segments depend on format

| Format | Path Structure | Labels |
|--------|---------------|--------|
| SD-JWT | `[dcqlId, vpIndex]` | `Credential: {id} › VP Token: {n+1}` |
| mdoc | `[dcqlId, vpIndex, docIndex, namespace]` | `Credential: {id} › VP Token: {n+1} › Document: {n+1} › {namespace}` |
| Fallback | `[dcqlId, vpIndex, ...rest]` | `Credential: {id} › VP Token: {n+1} › Segment 3: {val} › ...` |

**Detection logic:** Check `format` field - if contains "mdoc" use mdoc pattern, if contains "sd-jwt" or "dc" use SD-JWT pattern, else fallback (still applies dcqlId/vpIndex labels to first two).

**Rationale:** User-friendly labels while preserving full path information. Fallback maintains semantic meaning for known segments.

### 3. Date Detection & Rendering Strategy

**Decision:** Multi-pattern detection with field-name-aware rendering modes.

**Detection patterns:**
```typescript
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,                    // ISO date: 2026-01-01
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,  // ISO datetime: 2026-01-01T13:20:12Z
];
// Also detect Unix timestamps for fields like iat, exp, nbf
```

**Field-name-aware rendering modes:**

| Field Pattern | Render Mode | Example Output |
|---------------|-------------|----------------|
| `birth_date`, `birthdate` | Date only | "Jan 1, 1983" |
| `issuance_date`, `issue_date`, `iat` | Date only | "Oct 1, 2025" |
| `expiry_date`, `exp`, `date_of_expiry` | Date + relative | "Oct 15, 2025 (in 8 months)" |
| `effective_from_date`, `nbf` | Date + time | "Oct 1, 2025 1:20 PM" |
| `effective_until_date` | Date + time + relative | "Oct 15, 2025 1:20 PM (in 8 months)" |
| Unknown date field | Date + time (if has time) | "Oct 1, 2025" or "Oct 1, 2025 1:20 PM" |

**Relative time rules:**
- Future dates: "in X days/months/years"
- Past dates: "X days/months/years ago"
- Show relative only for expiry/validity fields where it's contextually useful

**Rationale:** Field names provide semantic context for appropriate rendering. Birth dates don't need time; expiry dates benefit from relative context.

### 4. Image Detection & Rendering

**Decision:** Detect base64 image data and render inline with reasonable constraints.

**Detection:**
- Value starts with `data:image/` (data URI) - common for mdoc `portrait` field
- Example: `"portrait": "data:image/jpeg;base64,/9j/4QDKRXhpZgAATU..."`

**Note:** SD-JWT image format TBD - may also use data URI or different encoding. Handle both patterns.

**Rendering:**
- Inline `<img>` with `max-height: 200px`, `max-width: 100%`
- Lazy loading (`loading="lazy"`)
- Error fallback to "[Image data]" text with byte size indicator

**Rationale:** Direct rendering is simplest; size constraints prevent layout issues.

### 5. Tab Implementation

**Decision:** Wrap ResultStage content in `Tabs` component, matching CreateStage styling.

```tsx
<Tabs defaultValue="policy-results">
  <TabsList className="grid w-full max-w-md grid-cols-2">
    <TabsTrigger value="policy-results">Policy Results</TabsTrigger>
    <TabsTrigger value="credentials">Submitted Credentials</TabsTrigger>
  </TabsList>
  <TabsContent value="policy-results">
    <PolicyResults ... />
  </TabsContent>
  <TabsContent value="credentials">
    <CredentialsDisplay ... />
  </TabsContent>
</Tabs>
```

**Rationale:** Consistent with CreateStage; default to policy results per requirements.

### 6. Data Fetching

**Decision:** Create `useCredentialsQuery` hook using React Query with lazy fetching.

- **Lazy fetch:** Only fetch when credentials tab is activated (not on mount)
- **Similarly for policies:** Update `usePolicyResponseQuery` to also fetch only when policy tab is active
- Handle 404 as "no credentials" (empty state, not error)
- Display API errors within the credentials tab

**Implementation:**
```typescript
// Track active tab in component state
const [activeTab, setActiveTab] = useState("policy-results");

// Pass enabled flag to queries
const { data: credentials } = useCredentialsQuery({ 
  enabled: activeTab === "credentials" 
});
const { data: policyResponse } = usePolicyResponseQuery({ 
  enabled: activeTab === "policy-results" 
});
```

**Rationale:** Reduces unnecessary API calls; fetches data only when user views it.

### 7. Claim Display Layout

**Decision:** Compact key-value layout with pretty display names and visual nesting.

```
┌─────────────────────────────────────────────┐
│ Family Name          Mustermann             │
│ Given Name           Erika                  │
│ Date of Birth        Jan 1, 1983            │
│ Nationality          ┌──────────────────┐   │
│                      │ • AT              │   │
│                      └──────────────────┘   │
│ Status               ┌──────────────────┐   │
│                      │ status_list:      │   │
│                      │   idx: 4526       │   │
│                      │   uri: https://...│   │
│                      └──────────────────┘   │
└─────────────────────────────────────────────┘
```

**Display name resolution (priority order):**
1. Look up in `CREDENTIAL_CASES` by matching `credentialType` → find attribute by claim key → use `displayName`
2. Fallback: Convert snake_case/camelCase to Title Case (e.g., `family_name` → "Family Name")

**Nested data rendering:**
- Arrays: Render as bulleted list in a subtle bordered container
- Objects: Render as indented key-value pairs in a subtle bordered container  
- Deep nesting: Recursive rendering with increased indentation
- Visual indicator: Light border/background to distinguish nested data from flat claims

**Rationale:** Pretty names improve readability; visual nesting makes structure clear without collapsing.

### 8. Claim Display Name Resolution

**Decision:** Create a utility that resolves claim keys to human-readable display names.

**Lookup strategy:**
```typescript
function getClaimDisplayName(
  claimKey: string, 
  credentialType: string, 
  format: string
): string {
  // 1. Try to find in CREDENTIAL_CASES
  const credCase = CREDENTIAL_CASES.find(c => 
    c.formats.some(f => f.credentialType === credentialType)
  );
  if (credCase) {
    const formatDef = credCase.formats.find(f => f.credentialType === credentialType);
    const attr = formatDef?.attributes.find(a => {
      // Match by last segment of path (the actual claim name)
      const pathKey = a.path[a.path.length - 1];
      return pathKey === claimKey;
    });
    if (attr) return attr.displayName;
  }
  
  // 2. Fallback: Convert to title case
  return toTitleCase(claimKey); // "family_name" → "Family Name"
}
```

**Rationale:** Reuses existing display names from credential-cases config where available. Simple lookup by credentialType + claim key. Graceful fallback for unknown credentials.

**Alternatives considered:**
- Separate dictionary file → rejected (duplicates existing data, maintenance burden)
- No pretty names → rejected (poor UX, raw keys hard to read)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large base64 images slow rendering | Lazy loading, max dimensions, consider thumbnail + expand for future |
| Date detection false positives | Combine pattern + field name heuristics; worst case shows formatted non-date |
| Unknown credential formats | Fallback path labeling ensures graceful degradation |
| Many credentials → long page | Tabs already separate from policy results; future: virtualization if needed |
| API returns 404 before credentials available | Show "No credentials submitted" message, not error state |

## Open Questions

None - all clarified in proposal discussion.

## Implementation Refinements

The following refinements were made during implementation based on UX review:

### 9. JWT Claim Display Names with Origin

**Decision:** Return structured claim info with display name, original key, and origin.

```typescript
interface ClaimDisplayInfo {
  displayName: string;  // "Issued At"
  originalKey: string;  // "iat"
  origin?: string;      // "JWT" or "Credential"
}
```

Standard JWT claims mapped:
- `iat` → "Issued At", `exp` → "Expires", `nbf` → "Not Before"
- `iss` → "Issuer", `sub` → "Subject", `aud` → "Audience", `jti` → "JWT ID"

UI shows original key as annotation: `Issued At (iat - JWT)`

### 10. Format Display Names

**Decision:** Map technical format strings to human-readable names via `getFormatDisplayName()`.

| Technical | Display |
|-----------|---------|
| `dc+sd-jwt`, `ietf.dc-sd-jwt` | "SD-JWT (DC)" |
| `mso_mdoc`, `mdoc` | "Mobile Document (mdoc)" |

### 11. Simplified Breadcrumb Labels

**Decision:** Remove redundant "Credential:" label, keep context labels for indices.

- SD-JWT: `pid_cred › VP Token: 1`
- mdoc: `driving-privileges-mdl-cred › VP Token: 1 › Document: 1 › Namespace: org.iso.18013.5.1`

### 12. Raw Credential JSON View

**Decision:** Add collapsible "Raw Credential" section to each card showing full JSON (path, format, credentialType, claims).

### 13. Visual Separation in Card Header

**Decision:** Separate breadcrumb from credential metadata with border divider for clearer visual hierarchy.

### 14. Consolidated Path Rendering

**Decision:** PolicyResults reuses `CredentialPathBreadcrumb` component for consistent path display across both tabs.
