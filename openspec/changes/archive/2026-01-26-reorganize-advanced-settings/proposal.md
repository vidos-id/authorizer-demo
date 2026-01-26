# Change: Reorganize Advanced Settings UI Layout

## Why

The current "Advanced Options" section in the Builder tab bundles three unrelated features (instance config, custom credential cases, import/export) that have different scopes. Instance config and import/export apply globally to all tabs, but are buried in Builder. Custom credential cases are only relevant when selecting document types, but appear far from the document type picker.

## What Changes

- **NEW** "App Configuration" collapsible section above tab navigation containing:
  - Instance type selector (managed vs own)
  - Authorizer URL input
  - Import/Export configuration buttons
- **NEW** "Manage custom credential types" link adjacent to document type dropdown in CredentialRequestBuilder
- **REMOVED** "Advanced Options" section from Builder tab (all contents relocated)

## Impact

- Affected specs: authorizer-config, config-export-import, credential-request-builder, create-page-layout (new)
- Affected code: 
  - `src/components/stages/CreateStage/index.tsx` - Add AppConfiguration, remove AdvancedOptions
  - `src/components/stages/CreateStage/AppConfiguration.tsx` - New component
  - `src/components/stages/CreateStage/CredentialRequestBuilder.tsx` - Add custom types link
  - `src/components/stages/CreateStage/AdvancedOptions.tsx` - To be deleted
