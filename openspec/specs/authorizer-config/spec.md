# authorizer-config Specification

## Purpose

This specification defines the authorizer configuration feature that allows users to select and configure the authorizer URL used throughout the OID4VP credential verification flow. The authorizer handles:

- Creating authorization requests (from the verifier application)
- Serving authorization requests to the wallet
- Receiving and processing authorization responses from the wallet
- Providing policy evaluation results back to the verifier application

The configuration supports two modes: a pre-configured Vidos Managed instance for quick demos/testing, or a custom authorizer URL for production use with user-owned Vidos Gateway instances.

## UI Placement

The authorizer configuration is located within the **App Configuration** collapsible section, positioned **above** the tab navigation on the Create Authorization Request page. This placement reflects that the instance configuration applies globally to all tabs (Templates, Builder, Raw JSON), while keeping it collapsed by default for users who use the Vidos Managed instance.

## Requirements

### Requirement: App Configuration Auto-Expansion

The application SHALL automatically expand the App Configuration section when the user has previously selected "Own instance".

#### Scenario: App Configuration collapsed by default

- **WHEN** a user opens the Create Authorization Request page
- **AND** the "Vidos Managed instance" is selected
- **THEN** the App Configuration section SHALL be collapsed by default
- **AND** the authorizer configuration SHALL be hidden until the user expands App Configuration

#### Scenario: App Configuration expanded for own instance

- **WHEN** a user opens the Create Authorization Request page
- **AND** the "Own instance" is selected (from a previous session)
- **THEN** the App Configuration section SHALL be automatically expanded
- **AND** the authorizer configuration SHALL be visible immediately

#### Scenario: Visual container for App Configuration

- **WHEN** the App Configuration section is expanded
- **THEN** all content SHALL be contained within a bordered container
- **AND** the container SHALL have rounded corners and subtle background color
- **AND** the visual treatment SHALL clearly identify what content is part of App Configuration

### Requirement: Instance Type Selection

The application SHALL provide users with a choice between a Vidos Managed instance and their own custom instance for the authorizer URL.

#### Scenario: Default to managed instance

- **WHEN** a user first opens the application
- **THEN** the "Vidos Managed instance" option SHALL be preselected
- **AND** the managed instance URL SHALL be automatically set

#### Scenario: Switch to own instance

- **WHEN** a user selects the "Own instance" radio option
- **THEN** a URL input field SHALL be displayed
- **AND** the user SHALL be able to enter their custom authorizer URL

#### Scenario: Switch back to managed instance

- **WHEN** a user switches from "Own instance" back to "Vidos Managed instance"
- **THEN** the URL input field SHALL be hidden
- **AND** the authorizer URL SHALL be automatically set to the managed instance URL

### Requirement: Instance Type Persistence

The application SHALL persist the selected instance type across browser sessions.

#### Scenario: Persist managed instance selection

- **WHEN** a user selects "Vidos Managed instance"
- **THEN** the selection SHALL be saved to localStorage
- **AND** upon returning to the application, "Vidos Managed instance" SHALL remain selected

#### Scenario: Persist own instance selection and URL

- **WHEN** a user selects "Own instance" and enters a custom URL
- **THEN** both the instance type and URL SHALL be saved to localStorage
- **AND** upon returning to the application, "Own instance" SHALL be selected with the custom URL populated

### Requirement: Managed Instance URL Configuration

The application SHALL use a configurable Vidos Managed instance URL as the default, set via environment variable.

#### Scenario: Environment variable is set

- **WHEN** the application initializes and `VITE_MANAGED_AUTHORIZER_URL` is defined
- **THEN** the managed instance URL SHALL be set to the value from the environment variable
- **AND** users SHALL be able to create authorizations without additional configuration

#### Scenario: Environment variable is missing

- **WHEN** the application initializes and `VITE_MANAGED_AUTHORIZER_URL` is not defined
- **THEN** the application SHALL require the user to select "Own instance"
- **AND** the "Vidos Managed instance" option SHALL be disabled

### Requirement: Contextual Help Text

The application SHALL provide help text that explains the difference between managed and own instances.

#### Scenario: Help text for managed instance

- **WHEN** "Vidos Managed instance" is selected
- **THEN** help text SHALL indicate no setup is required
- **AND** users SHALL understand this is for demo/testing purposes

#### Scenario: Configuration documentation link for managed instance

- **WHEN** "Vidos Managed instance" is selected
- **THEN** a link to documentation describing the managed instance configuration SHALL be displayed
- **AND** clicking the link SHALL navigate to the configuration details page

#### Scenario: Help text for own instance

- **WHEN** "Own instance" is selected
- **THEN** help text SHALL reference the Vidos Dashboard
- **AND** a link to the setup guide (GATEWAY_SETUP.md) SHALL be provided

### Requirement: URL Input Validation

The application SHALL validate custom authorizer URLs when "Own instance" is selected.

#### Scenario: Valid custom URL

- **WHEN** a user enters a valid URL in "Own instance" mode
- **THEN** no error message SHALL be displayed
- **AND** the URL SHALL be accepted for use

#### Scenario: Invalid custom URL

- **WHEN** a user enters an invalid URL in "Own instance" mode
- **THEN** an error message SHALL be displayed ("Please enter a valid URL")
- **AND** the user SHALL be prevented from proceeding until a valid URL is entered

#### Scenario: Empty URL in own instance mode

- **WHEN** "Own instance" is selected and the URL field is empty
- **THEN** the user SHALL be able to type in the field
- **AND** no inline error SHALL be shown
- **AND** the "Create Authorization" button SHALL be disabled
- **AND** a validation error SHALL indicate "Authorizer URL is required"

### Requirement: Derived Authorizer URL

The application SHALL derive the active authorizer URL based on the selected instance type.

#### Scenario: Managed instance selected

- **WHEN** "Vidos Managed instance" is selected
- **THEN** the active authorizer URL SHALL be the value from `VITE_MANAGED_AUTHORIZER_URL`
- **AND** this URL SHALL be used for all API requests

#### Scenario: Own instance selected

- **WHEN** "Own instance" is selected
- **THEN** the active authorizer URL SHALL be the value entered in the URL input field
- **AND** this URL SHALL be used for all API requests

#### Scenario: Managed instance not configured

- **WHEN** `VITE_MANAGED_AUTHORIZER_URL` is not set or invalid
- **AND** "Vidos Managed instance" is selected
- **THEN** the active authorizer URL SHALL be an empty string
- **AND** validation SHALL prevent creating an authorization
