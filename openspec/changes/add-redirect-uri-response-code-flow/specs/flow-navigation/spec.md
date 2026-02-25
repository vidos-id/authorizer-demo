# flow-navigation Delta Specification

## MODIFIED Requirements

### Requirement: Three-Stage Flow Structure

The application SHALL implement three distinct stages in the authorization flow: CREATE AUTHORIZATION, AUTHORIZATION, and RESULT.

#### Scenario: Application initialization

- **WHEN** the application first loads
- **THEN** the user SHALL be presented with the CREATE AUTHORIZATION stage
- **AND** the navigation indicator SHALL highlight the CREATE AUTHORIZATION stage

#### Scenario: Application initialization from redirect URI callback

- **WHEN** the application first loads with a `response_code` query parameter
- **THEN** the user SHALL be presented with the RESULT stage
- **AND** the navigation indicator SHALL highlight the RESULT stage
- **AND** redirect callback processing SHALL begin immediately

#### Scenario: Stage ordering

- **WHEN** a user navigates through the flow
- **THEN** the stages SHALL be presented in the order: CREATE AUTHORIZATION → AUTHORIZATION → RESULT
- **AND** each stage SHALL be accessible only after completing the previous stage (except for the initial CREATE AUTHORIZATION stage)

## ADDED Requirements

### Requirement: Redirect Callback Transition Behavior
The application SHALL treat `response_code` entry as a direct transition path to the RESULT stage.

#### Scenario: Redirect callback bypasses intermediate stages
- **WHEN** the app is opened via redirect URI with `response_code`
- **THEN** the app SHALL bypass CREATE AUTHORIZATION and AUTHORIZATION stages
- **AND** the app SHALL not require prior local flow state to render RESULT
