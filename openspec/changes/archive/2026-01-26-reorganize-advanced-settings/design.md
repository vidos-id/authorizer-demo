# Design: reorganize-advanced-settings

## Component Architecture

### Before

```
CreateStage
├── CardHeader
├── Tabs
│   ├── TabsList (Templates | Builder | JSON)
│   ├── TabsContent[templates] → TemplatesTab
│   ├── TabsContent[builder]
│   │   ├── ProfileSelector
│   │   ├── ResponseModeSelector
│   │   ├── CredentialRequestList
│   │   │   └── CredentialRequestBuilder (multiple)
│   │   │       └── Document Type Picker
│   │   ├── CredentialSetList
│   │   └── AdvancedOptions ← REMOVED
│   │       ├── AuthorizerConfig
│   │       ├── CustomCredentialCaseManager
│   │       └── ConfigExportImport
│   └── TabsContent[json] → JsonEditor
└── Action Buttons
```

### After

```
CreateStage
├── CardHeader
├── AppConfiguration (NEW) ← Collapsible, above tabs
│   ├── AuthorizerConfig
│   └── ConfigExportImport
├── Tabs
│   ├── TabsList (Templates | Builder | JSON)
│   ├── TabsContent[templates] → TemplatesTab
│   ├── TabsContent[builder]
│   │   ├── ProfileSelector
│   │   ├── ResponseModeSelector
│   │   ├── CredentialRequestList (MODIFIED)
│   │   │   ├── Header + CustomTypesLink (NEW) ← Single link above list
│   │   │   └── CredentialRequestBuilder (multiple)
│   │   └── CredentialSetList
│   └── TabsContent[json] → JsonEditor
└── Action Buttons
```

## New Components

### AppConfiguration

**File:** `src/components/stages/CreateStage/AppConfiguration.tsx`

**Responsibilities:**
- Wraps AuthorizerConfig + ConfigExportImport in collapsible container
- Positioned above tabs to signal global scope
- Auto-expands when instance type is "own"

**Props:** None (reads from store)

### CustomTypesLink

**Approach:** Add to CredentialRequestList header area (single link for all requests).

Add a small link in the credential requests section header:
```tsx
{/* In CredentialRequestList, near section header */}
<div className="flex items-center justify-between">
  <h3>Credential Requests</h3>
  <button className="text-xs text-muted-foreground hover:text-foreground hover:underline">
    Manage custom credential types
  </button>
</div>
```

Opens the existing CustomCredentialCaseDialog. Single link avoids repetition when multiple credential requests exist.

## Migration Strategy

1. Create AppConfiguration component (extracts AuthorizerConfig + ConfigExportImport)
2. Add to CreateStage above Tabs
3. Add custom types link to CredentialRequestBuilder
4. Delete AdvancedOptions component
5. Update imports in CreateStage

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│ Create Authorization Request                        │
│ Build and send credential verification...           │
├─────────────────────────────────────────────────────┤
│ ▶ App Configuration                                 │ ← Collapsed by default
│   (Configure instance and backup settings)          │
├─────────────────────────────────────────────────────┤
│     [Templates]  [Builder]  [Raw JSON]              │ ← Tabs
├─────────────────────────────────────────────────────┤
│                                                     │
│  (Tab content here)                                 │
│                                                     │
│  When Builder tab:                                  │
│  ┌─────────────────────────────────────────────────┐│
│  │ Credential Requests    [Manage custom types →] ││ ← Single link in header
│  │ ┌───────────────────────────────────┐          ││
│  │ │ Type: [PID ▼]  Format: [SD-JWT ▼] │          ││
│  │ └───────────────────────────────────┘          ││
│  │ ┌───────────────────────────────────┐          ││
│  │ │ Type: [MDL ▼]  Format: [mDoc ▼]   │          ││
│  │ └───────────────────────────────────┘          ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

## State Management

No state changes required. All existing store slices continue to work:
- `configSlice` - instanceType, ownAuthorizerUrl
- `customCasesSlice` - customCredentialCases

The components just move location in the tree; they consume same store state.

## Spec Impact Summary

| Spec | Section | Change |
|------|---------|--------|
| authorizer-config | UI Placement | Update to "App Configuration section above tabs" |
| authorizer-config | Advanced Options Auto-Expansion | Rename to "App Configuration Auto-Expansion" |
| config-export-import | Advanced Section Placement | Update to "App Configuration section" |
| credential-request-builder | Document Type Selection | Add scenario for custom types link |
