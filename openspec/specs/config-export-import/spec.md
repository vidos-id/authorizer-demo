# config-export-import Specification

## Purpose

Enable users to backup, transfer, and restore their custom configuration (instance settings, custom credential cases, and request templates) via JSON file export/import, facilitating easy sharing between devices or team members.
## Requirements
### Requirement: Configuration Export

The application SHALL allow users to export their custom configuration as a downloadable JSON file.

#### Scenario: Export configuration with custom authorizer URL

- **WHEN** a user has "Own instance" selected with a custom authorizer URL
- **AND** the user clicks the "Export Configuration" button
- **THEN** a JSON file SHALL be downloaded
- **AND** the file SHALL contain the instance type, authorizer URL, and any custom credential cases

#### Scenario: Export configuration with managed instance

- **WHEN** a user has "Vidos Managed instance" selected
- **AND** the user has custom credential cases defined
- **AND** the user clicks the "Export Configuration" button
- **THEN** a JSON file SHALL be downloaded
- **AND** the file SHALL contain the instance type and custom credential cases
- **AND** the file SHALL NOT contain the managed instance URL

#### Scenario: Export empty configuration

- **WHEN** a user has no custom credential cases
- **AND** the user is using the managed instance
- **AND** the user clicks the "Export Configuration" button
- **THEN** a JSON file SHALL be downloaded
- **AND** the file SHALL contain only the instance type and schema version

### Requirement: Configuration Import

The application SHALL allow users to import configuration from a JSON file.

#### Scenario: Import valid configuration

- **WHEN** a user selects a valid configuration JSON file
- **AND** clicks confirm on the import dialog
- **THEN** the instance type SHALL be updated to match the imported value
- **AND** the authorizer URL SHALL be updated if "Own instance" was exported
- **AND** custom credential cases SHALL be replaced with the imported cases
- **AND** custom request templates SHALL be replaced with the imported templates
- **AND** a success message SHALL be displayed

#### Scenario: Import configuration with confirmation

- **WHEN** a user selects a configuration file for import
- **THEN** a confirmation dialog SHALL be displayed
- **AND** the dialog SHALL warn that existing custom configuration will be replaced
- **AND** the user SHALL be able to cancel the import

#### Scenario: Import invalid JSON file

- **WHEN** a user selects a file that is not valid JSON
- **THEN** an error message SHALL be displayed indicating the file is not valid JSON
- **AND** the existing configuration SHALL remain unchanged

#### Scenario: Import JSON with missing required fields

- **WHEN** a user selects a JSON file missing required fields (schemaVersion, instanceType)
- **THEN** an error message SHALL be displayed indicating the invalid format
- **AND** the existing configuration SHALL remain unchanged

#### Scenario: Import older schema version without templates

- **WHEN** a user imports a configuration file with schemaVersion "1.0" (no customRequestTemplates field)
- **THEN** the import SHALL succeed
- **AND** customRequestTemplates SHALL be set to an empty array
- **AND** other fields SHALL be imported normally

### Requirement: Export File Format

The exported configuration file SHALL follow a defined JSON schema.

#### Scenario: Export file structure

- **WHEN** a configuration is exported
- **THEN** the JSON file SHALL include a "schemaVersion" field (string, e.g., "1.1")
- **AND** SHALL include an "instanceType" field ("managed" or "own")
- **AND** SHALL include an "ownAuthorizerUrl" field if instanceType is "own"
- **AND** SHALL include a "customCredentialCases" array (may be empty)
- **AND** SHALL include a "customRequestTemplates" array (may be empty)
- **AND** the filename SHALL follow the pattern "vidos-config-YYYY-MM-DD.json"

#### Scenario: Credential case format in export

- **WHEN** custom credential cases are exported
- **THEN** each case SHALL include id, displayName, and formats array
- **AND** each format SHALL include id, format, displayName, credentialType, and attributes
- **AND** mDoc formats SHALL include the namespace field

#### Scenario: Request template format in export

- **WHEN** custom request templates are exported
- **THEN** each template SHALL include id, name, description, and category
- **AND** each template SHALL include credentialRequests array
- **AND** each template SHALL include credentialSets array
- **AND** each template SHALL have isBuiltIn set to false

### Requirement: App Configuration Section Placement

The export/import controls SHALL be placed in a collapsible "App Configuration" section within the authorizer configuration area.

#### Scenario: App Configuration section collapsed by default

- **WHEN** a user views the Create Authorization page
- **THEN** the "App Configuration" section SHALL be collapsed by default
- **AND** the section header SHALL indicate it can be expanded

#### Scenario: Expand App Configuration section

- **WHEN** a user clicks on the "App Configuration" section header
- **THEN** the section SHALL expand to reveal export and import buttons
- **AND** the export button SHALL be labeled "Export Configuration"
- **AND** the import button SHALL be labeled "Import Configuration"
