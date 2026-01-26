# create-page-layout Specification

## Purpose
TBD - created by archiving change reorganize-advanced-settings. Update Purpose after archive.
## Requirements
### Requirement: App Configuration Section

The application SHALL provide a collapsible "App Configuration" section above the tab navigation that contains global settings affecting all tabs.

#### Scenario: App Configuration collapsed by default

- **WHEN** a user opens the Create Authorization Request page
- **AND** the "Vidos Managed instance" is selected
- **THEN** the App Configuration section SHALL be collapsed by default
- **AND** the section header SHALL display "App Configuration"
- **AND** a subtitle SHALL indicate "Configure the Vidos Authorizer instance and backup settings"

#### Scenario: App Configuration expanded for own instance

- **WHEN** a user opens the Create Authorization Request page
- **AND** the "Own instance" is selected (from a previous session)
- **THEN** the App Configuration section SHALL be automatically expanded
- **AND** the authorizer configuration SHALL be visible immediately

#### Scenario: App Configuration auto-expands after import

- **WHEN** a user imports a configuration that sets instance type to "Own instance"
- **THEN** the App Configuration section SHALL automatically expand
- **AND** the user SHALL see the imported authorizer URL immediately

#### Scenario: App Configuration visual container

- **WHEN** the App Configuration section is expanded
- **THEN** all content SHALL be contained within a bordered container
- **AND** the container SHALL have rounded corners and subtle background color
- **AND** the section SHALL be visually separated from the tab navigation below

### Requirement: App Configuration Contents

The App Configuration section SHALL contain the authorizer instance configuration and config export/import functionality.

#### Scenario: Instance configuration in App Configuration

- **WHEN** the App Configuration section is expanded
- **THEN** the instance type selector (Vidos Managed / Own instance) SHALL be displayed
- **AND** when "Own instance" is selected, the URL input field SHALL be displayed
- **AND** contextual help text SHALL be available for each option

#### Scenario: Export/Import in App Configuration

- **WHEN** the App Configuration section is expanded
- **THEN** the Export Configuration button SHALL be displayed
- **AND** the Import Configuration button SHALL be displayed
- **AND** guidance text SHALL explain the backup/transfer purpose

### Requirement: App Configuration Position

The App Configuration section SHALL be positioned above the tab navigation to indicate its global scope.

#### Scenario: Position relative to tabs

- **WHEN** a user views the Create Authorization Request page
- **THEN** the App Configuration section SHALL appear between the page header and the tab navigation
- **AND** the visual hierarchy SHALL indicate the section applies to all tabs equally

