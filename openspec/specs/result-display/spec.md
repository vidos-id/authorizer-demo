# result-display Specification

## Purpose
Define the display structure and behavior for authorization results in the final stage of the OID4VP credential verification flow. This capability ensures users can clearly understand the outcome of their authorization request, including policy evaluation results for each credential, error states, and the ability to start a new authorization flow.

## Requirements

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

### Requirement: Policy Status Indicators
The system SHALL display visual status indicators for each policy evaluation result.

#### Scenario: Success policy status
- **WHEN** a policy evaluation has a "success" status
- **THEN** a green checkmark (✓) indicator SHALL be displayed
- **AND** the policy name SHALL be shown alongside the indicator
- **AND** the visual styling SHALL use green color to indicate success

#### Scenario: Warning policy status
- **WHEN** a policy evaluation has a "warning" status
- **THEN** a yellow or amber warning triangle (⚠) indicator SHALL be displayed
- **AND** the policy name SHALL be shown alongside the indicator
- **AND** the visual styling SHALL use yellow/amber color to indicate warning

#### Scenario: Error policy status
- **WHEN** a policy evaluation has an "error" status
- **THEN** a red cross (✗) indicator SHALL be displayed
- **AND** the policy name SHALL be shown alongside the indicator
- **AND** the visual styling SHALL use red color to indicate error

#### Scenario: Policy status grouping
- **WHEN** displaying policy results for a credential
- **THEN** all policies for that credential SHALL be grouped together
- **AND** each policy SHALL display its name and status indicator
- **AND** policies SHALL be listed in a consistent order

### Requirement: Error State Display
The system SHALL handle and display different authorization error states appropriately.

#### Scenario: Authorization rejected state
- **WHEN** the authorization status is "rejected"
- **THEN** a message indicating the wallet rejected the request SHALL be displayed
- **AND** any error description provided by the API SHALL be shown
- **AND** the user SHALL be provided with guidance on next steps

#### Scenario: Authorization expired state
- **WHEN** the authorization status is "expired"
- **THEN** a message indicating the request timed out SHALL be displayed
- **AND** the user SHALL be prompted to start a new authorization
- **AND** the timeout condition SHALL be clearly explained

#### Scenario: Authorization error state
- **WHEN** the authorization status is "error"
- **THEN** an error message from the API SHALL be displayed
- **AND** technical error details SHALL be shown if available
- **AND** the error information SHALL be formatted in a user-friendly manner

#### Scenario: Error state with no policy results
- **WHEN** the authorization is in an error state (rejected, expired, or error)
- **THEN** no policy results sections SHALL be displayed
- **AND** only the error state message and start over action SHALL be shown

### Requirement: Start Over Action
The system SHALL provide an action to reset the application and return to the create authorization stage.

#### Scenario: Start over button on success
- **WHEN** the authorization result page is displayed with successful results
- **THEN** a "Start New Authorization" or "Start Over" button SHALL be visible
- **AND** the button SHALL be clearly positioned on the page

#### Scenario: Start over button on error
- **WHEN** the authorization result page is displayed with error state
- **THEN** a "Start New Authorization" or "Start Over" button SHALL be visible
- **AND** the button SHALL be prominently positioned to encourage retry

#### Scenario: Start over action execution
- **WHEN** the user clicks the start over button
- **THEN** the application state SHALL be reset to initial values
- **AND** the user SHALL be navigated back to Stage 1 (Create Authorization)
- **AND** no authorization data from the previous flow SHALL be retained

#### Scenario: Start over preserves authorizer URL
- **WHEN** the user clicks the start over button
- **THEN** the authorizer URL from the previous session MAY be preserved
- **AND** if preserved, it SHALL be pre-filled in the create authorization form
