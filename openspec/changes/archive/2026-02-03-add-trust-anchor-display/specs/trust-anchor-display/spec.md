# trust-anchor-display Specification

## Purpose

This specification defines the trust anchor certificate display feature that allows users to view, copy, and download the X.509 certificate used by the authorizer service to sign authorization requests. Wallets (especially EUDI wallets) require this certificate to be configured in order to trust incoming verification requests.

## UI Placement

The trust anchor configuration is located in a collapsible section positioned **below** the App Configuration collapsible section on the Create Authorization Request page. This placement reflects that trust anchor viewing depends on the configured authorizer instance.

## ADDED Requirements

### Requirement: Trust Anchor Collapsible Section

The application SHALL display a collapsible section for viewing the trust anchor certificate, positioned below the App Configuration section.

#### Scenario: Section collapsed by default

- **WHEN** a user opens the Create Authorization Request page
- **THEN** the Trust Anchor Certificate section SHALL be collapsed by default
- **AND** no API request SHALL be made until the section is expanded

#### Scenario: Visual consistency with App Configuration

- **WHEN** the Trust Anchor Certificate section is rendered
- **THEN** it SHALL follow the same design language as App Configuration
- **AND** use the same collapsible trigger pattern with chevron icon
- **AND** include a brief description subtitle

### Requirement: Lazy Loading Trust Anchor Data

The application SHALL lazy-load the trust anchor certificate data only when the collapsible section is expanded.

#### Scenario: Fetch on expand

- **WHEN** the user expands the Trust Anchor Certificate section
- **THEN** the application SHALL fetch data from `/instances/oid4vp-trust-anchor`
- **AND** use the currently configured authorizer URL as the base URL
- **AND** display a loading state while fetching

#### Scenario: Dynamic URL based on configuration

- **WHEN** the authorizer URL is changed in App Configuration
- **AND** the Trust Anchor section is expanded
- **THEN** the next fetch SHALL use the newly configured URL

#### Scenario: Error handling

- **WHEN** the fetch fails (network error, 4xx, 5xx)
- **THEN** an error message SHALL be displayed with the error details
- **AND** the user SHALL be able to retry via the refresh action
- **AND** error messages SHALL help diagnose issues like invalid gateway configuration

#### Scenario: Invalid or empty authorizer URL

- **WHEN** the Trust Anchor section is expanded
- **AND** the authorizer URL is invalid or empty
- **THEN** an error message SHALL be displayed indicating the URL is not configured
- **AND** no API request SHALL be attempted

### Requirement: Anchor Type Display

The application SHALL display the anchor type (root, account, or instance) returned by the API.

#### Scenario: Display anchor type

- **WHEN** the trust anchor data is successfully fetched
- **THEN** the anchor type SHALL be displayed as a badge or label
- **AND** the type SHALL be one of: root, account, or instance

### Requirement: PEM Certificate Display

The application SHALL display the PEM-encoded certificate in a formatted, read-only view.

#### Scenario: Display certificate

- **WHEN** the trust anchor data is successfully fetched
- **THEN** the PEM certificate SHALL be displayed in a read-only textarea
- **AND** the textarea SHALL use a monospace font
- **AND** the certificate SHALL be fully visible or scrollable

### Requirement: Copy Certificate Action

The application SHALL allow users to copy the PEM certificate to the clipboard.

#### Scenario: Copy to clipboard

- **WHEN** the user clicks the copy button
- **THEN** the PEM certificate content SHALL be copied to the clipboard
- **AND** visual feedback SHALL be shown (icon change or toast)
- **AND** the feedback SHALL reset after approximately 2 seconds

### Requirement: Download Certificate Action

The application SHALL allow users to download the PEM certificate as a file.

#### Scenario: Download certificate file

- **WHEN** the user clicks the download button
- **THEN** a file download SHALL be initiated
- **AND** the filename SHALL be `vidos-{anchorType}.pem` (e.g., `vidos-root.pem`)
- **AND** the file content SHALL be the PEM certificate text

### Requirement: Refresh Action

The application SHALL allow users to manually refresh the trust anchor data.

#### Scenario: Refresh data

- **WHEN** the user clicks the refresh button
- **THEN** a new fetch SHALL be triggered from the authorizer API
- **AND** a loading indicator SHALL be shown during the fetch
- **AND** the displayed data SHALL be updated with the new response

#### Scenario: Refresh after config change

- **WHEN** the authorizer URL configuration changes
- **THEN** the user can click refresh to fetch the certificate from the new URL

### Requirement: Descriptive Help Text

The application SHALL provide help text explaining what the trust anchor certificate is and why it's needed.

#### Scenario: Display explanation

- **WHEN** the Trust Anchor Certificate section content is visible
- **THEN** explanatory text SHALL describe that this certificate is used by the authorizer to sign requests
- **AND** explain that wallets need this certificate configured to trust the requests
- **AND** mention that EUDI wallets particularly require this configuration

### Requirement: Self-Contained State Management

The component SHALL manage its own state and data fetching using React Query.

#### Scenario: Component encapsulation

- **WHEN** the Trust Anchor component is rendered
- **THEN** it SHALL manage its own expanded/collapsed state
- **AND** it SHALL use React Query for data fetching, caching, loading, and error states
- **AND** it SHALL not require external state management from parent components

#### Scenario: Visible for all instance types

- **WHEN** the Create Authorization Request page is displayed
- **THEN** the Trust Anchor section SHALL be visible regardless of instance type (managed or own)
- **AND** it SHALL be collapsed by default for both instance types
