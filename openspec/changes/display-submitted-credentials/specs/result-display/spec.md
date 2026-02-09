# result-display Delta Specification

## ADDED Requirements

### Requirement: Tabbed Result Interface
The system SHALL display result content in a tabbed interface.

#### Scenario: Tab navigation display
- **WHEN** the ResultStage is displayed
- **THEN** a tab bar SHALL be shown with "Policy Results" and "Submitted Credentials" tabs
- **AND** the tab bar styling SHALL match CreateStage tab styling
- **AND** tabs SHALL be centered with max-width constraint

#### Scenario: Default tab selection
- **WHEN** the ResultStage is first displayed
- **THEN** the "Policy Results" tab SHALL be selected by default

#### Scenario: Tab switching
- **WHEN** user clicks on a tab
- **THEN** the corresponding tab content SHALL be displayed
- **AND** the previously active tab content SHALL be hidden

### Requirement: Lazy Policy Data Fetching
The system SHALL fetch policy data only when the policy tab is active.

#### Scenario: Policy tab activation fetch
- **WHEN** the "Policy Results" tab is active
- **THEN** the system SHALL fetch policy response data from the API

#### Scenario: Policy tab inactive no fetch
- **WHEN** the "Policy Results" tab is NOT active
- **THEN** the system SHALL NOT fetch policy response data
- **AND** previously fetched data SHALL be retained in cache

## MODIFIED Requirements

### Requirement: Per-Credential Result Sections
The system SHALL display each credential in its own clearly separated section within the policy results tab.

#### Scenario: Single credential result display
- **WHEN** the authorization result contains one credential
- **AND** the "Policy Results" tab is active
- **THEN** the credential SHALL be displayed in a dedicated section
- **AND** the section SHALL show the credential type and format (e.g., "PID (dc+sd-jwt)")
- **AND** the section SHALL include all policy results for that credential

#### Scenario: Multiple credential results display
- **WHEN** the authorization result contains multiple credentials
- **AND** the "Policy Results" tab is active
- **THEN** each credential SHALL be displayed in its own section
- **AND** sections SHALL have clear visual separation between them
- **AND** the order of credential sections SHALL match the order of credential requests

#### Scenario: Credential section header
- **WHEN** displaying a credential result section
- **THEN** the section header SHALL include the credential document type name
- **AND** the header SHALL include the credential format identifier
- **AND** the header MAY include an overall status indicator for that credential
