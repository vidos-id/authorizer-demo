# state-management Specification

## Purpose

This specification defines the Zustand-based state management architecture, including the slice-based organization, typed selectors, persistence configuration, and cross-slice state access patterns used throughout the application.

## Requirements

### Requirement: App Store Naming

The main store hook SHALL be named `useAppStore` to clearly indicate its purpose.

#### Scenario: Store hook exported with correct name

- **WHEN** a component imports from `@/stores/AppStore`
- **THEN** the `useAppStore` hook is available

#### Scenario: State type named correctly

- **WHEN** examining store types
- **THEN** the combined state type is named `AuthorizationState`

### Requirement: Zustand Slices Architecture

The app store SHALL be organized into domain-driven slices that combine into a single store.

#### Scenario: Slices combine into single store

- **WHEN** the store is initialized
- **THEN** all slice state and actions are accessible from `useAppStore`
- **AND** slice state is flattened (not nested under slice names)

#### Scenario: Cross-slice state access

- **WHEN** `removeCredentialRequest` action is called
- **THEN** it can update both `credentialRequests` and `credentialSets` atomically
- **AND** the update happens in a single `set()` call

### Requirement: Typed Selectors Per Domain

The store SHALL export typed selector functions for each domain slice.

#### Scenario: Config selectors available

- **WHEN** a component needs instance configuration
- **THEN** it can use `configSelectors.instanceType` or `configSelectors.ownAuthorizerUrl`
- **AND** the component only re-renders when that specific value changes

#### Scenario: Computed selectors available

- **WHEN** a component needs the resolved authorizer URL
- **THEN** it can use `selectAuthorizerUrl` selector
- **AND** the selector computes based on `instanceType` and `ownAuthorizerUrl`

#### Scenario: Session selectors available

- **WHEN** a component needs authorization session state
- **THEN** it can use selectors like `sessionSelectors.stage`, `sessionSelectors.authorizationId`

### Requirement: Persistence Configuration Unchanged

The persist middleware SHALL maintain the same storage key and persisted fields.

#### Scenario: Storage key unchanged

- **WHEN** the store persists state
- **THEN** it uses localStorage key `vidos-flow-storage`

#### Scenario: Persisted fields unchanged

- **WHEN** the store persists state
- **THEN** it saves only: `ownAuthorizerUrl`, `instanceType`, `customCredentialCases`, `customJsonRequests`
- **AND** other state resets on page reload

#### Scenario: Merge behavior unchanged

- **WHEN** the app loads with persisted state
- **THEN** `instanceType` respects managed authorizer URL availability
- **AND** non-persisted state uses initial values

### Requirement: Slice File Organization

The store code SHALL be organized into separate files by domain.

#### Scenario: Slice files exist

- **WHEN** examining `src/stores/AppStore/slices/`
- **THEN** files exist for: configSlice, credentialRequestsSlice, responseModeSlice, customCasesSlice, jsonModeSlice, sessionSlice, uiSlice, debugSlice

#### Scenario: Types centralized

- **WHEN** examining `src/stores/AppStore/types.ts`
- **THEN** all slice interfaces and the combined AuthorizationState type are defined there

#### Scenario: Selectors centralized

- **WHEN** examining `src/stores/AppStore/selectors.ts`
- **THEN** all typed selectors are exported from there

### Requirement: StateCreator Type Safety

Each slice SHALL use proper TypeScript StateCreator types for full type inference.

#### Scenario: Slice creator typed correctly

- **WHEN** a slice is defined
- **THEN** it uses `StateCreator<AuthorizationState, [], [], SliceType>` signature
- **AND** the `set` function has access to full AuthorizationState type

#### Scenario: Middleware compatibility

- **WHEN** slices are combined with persist middleware
- **THEN** TypeScript infers all types correctly
- **AND** no type assertions or `any` casts are needed

### Requirement: Error Clearing Consistency

Actions that modify configuration state SHALL clear any existing error.

#### Scenario: Config change clears error

- **WHEN** `setInstanceType` or `setOwnAuthorizerUrl` is called
- **THEN** `error` is set to `null`

#### Scenario: Credential change clears error

- **WHEN** any credential request or set CRUD action is called
- **THEN** `error` is set to `null`

#### Scenario: Custom case change clears error

- **WHEN** any custom credential case CRUD action is called
- **THEN** `error` is set to `null`
