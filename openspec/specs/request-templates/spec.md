# request-templates Specification

## Purpose

This specification defines the request templates feature, which provides pre-configured credential request configurations for common verification scenarios (age verification, identity, address, KYC, driving). Users can apply built-in templates or create custom templates from their configurations.

## Requirements
### Requirement: Templates Tab Display

The application SHALL provide a "Templates" tab in the Create Stage that displays available request templates.

#### Scenario: View templates tab

- **WHEN** a user navigates to the Create Stage
- **THEN** a "Templates" tab SHALL be visible alongside "Builder" and "JSON" tabs
- **AND** the Templates tab SHALL be the default selected tab
- **AND** clicking the tab SHALL display the templates interface

#### Scenario: Templates organized by category

- **WHEN** a user views the Templates tab
- **THEN** templates SHALL be grouped by use case category
- **AND** categories SHALL be displayed in order: Age Verification, Identity, Address, KYC, Driving, Flexible
- **AND** within each category, simpler templates SHALL appear first

#### Scenario: Template card display

- **WHEN** a user views a template in the list
- **THEN** the template card SHALL display the template name
- **AND** SHALL display a description explaining the use case and credentials/attributes being requested
- **AND** SHALL display a badge indicating the number of credential requests

### Requirement: Templates Tab Actions

The Templates tab SHALL provide the same authorization actions as the Builder tab.

#### Scenario: Create authorization from Templates tab

- **WHEN** a user has selected a template
- **AND** clicks "Create Authorization" on the Templates tab
- **THEN** the authorization SHALL be created using the template's credential requests and sets
- **AND** the behavior SHALL be identical to creating from the Builder tab

#### Scenario: Preview from Templates tab

- **WHEN** a user has selected a template
- **AND** clicks "Preview" on the Templates tab
- **THEN** the JSON preview SHALL display the DCQL query for the template's configuration
- **AND** the behavior SHALL be identical to previewing from the Builder tab

#### Scenario: Actions disabled without template selection

- **WHEN** no template is selected
- **THEN** the "Create Authorization" button SHALL be disabled
- **AND** the "Preview" button SHALL be disabled

### Requirement: Template Selection and Application

The application SHALL allow users to select and apply a template to configure credential requests.

#### Scenario: Use template directly

- **WHEN** a user clicks "Use Template" on a template card
- **THEN** the credential requests SHALL be replaced with the template's requests
- **AND** the credential sets SHALL be replaced with the template's sets
- **AND** the template SHALL be marked as selected with a visual indicator
- **AND** the user SHALL remain on the Templates tab ready to create authorization

#### Scenario: Load template to builder

- **WHEN** a user clicks "Load to Builder" on a template card
- **THEN** the credential requests SHALL be replaced with the template's requests
- **AND** the credential sets SHALL be replaced with the template's sets
- **AND** the template SHALL be marked as selected with a visual indicator
- **AND** the view SHALL switch to the Builder tab
- **AND** the user SHALL be able to modify the loaded configuration

#### Scenario: Template replaces existing state

- **WHEN** a user applies a template while existing credential requests are configured
- **THEN** all existing credential requests SHALL be replaced
- **AND** all existing credential sets SHALL be replaced
- **AND** no confirmation dialog SHALL be shown (template is just a starting point)

#### Scenario: Selection indicator cleared on modification

- **WHEN** a user has a template selected
- **AND** the user modifies the credential requests or sets in the Builder tab
- **THEN** the template selection indicator SHALL be cleared
- **AND** no template SHALL appear as selected in the Templates tab

### Requirement: Built-in Templates

The application SHALL provide built-in templates for common credential verification scenarios.

#### Scenario: Age verification templates available

- **WHEN** a user views the Age Verification category
- **THEN** templates SHALL include "Age 18+ via PID" requesting PID with age_over_18 attribute
- **AND** SHALL include "Age 18+ via PID or mDL" with credential set offering PID SD-JWT OR PID mDoc OR mDL mDoc with age_over_18 attribute
- **AND** SHALL include "Age 21+ via mDL" requesting mDL with age_over_21 attribute

#### Scenario: Identity templates available

- **WHEN** a user views the Identity category
- **THEN** templates SHALL include "Name and Date of Birth via PID" requesting PID with family_name, given_name, birth_date
- **AND** SHALL include "Name, DOB and Photo via PID" requesting PID with family_name, given_name, birth_date, portrait
- **AND** SHALL include "Full Identity via PID" requesting PID with family_name, given_name, birth_date, nationality, document_number

#### Scenario: Address templates available

- **WHEN** a user views the Address category
- **THEN** templates SHALL include "Address via PID" requesting PID with resident_country, resident_city, resident_street, resident_postal_code
- **AND** SHALL include "Identity and Address via PID" requesting PID with name, DOB, plus full address fields

#### Scenario: KYC templates available

- **WHEN** a user views the KYC category
- **THEN** templates SHALL include "KYC Basic via PID" requesting PID with family_name, given_name, birth_date, nationality
- **AND** SHALL include "KYC Standard via PID" requesting PID with name, DOB, nationality, address, document_number
- **AND** SHALL include "KYC Enhanced via PID" requesting PID with full identity, full address, issuing_authority, issuing_country

#### Scenario: Driving templates available

- **WHEN** a user views the Driving category
- **THEN** templates SHALL include "Driving Privileges via mDL" requesting mDL with driving_privileges, expiry_date
- **AND** SHALL include "Driver Identity via mDL" requesting mDL with family_name, given_name, birth_date, portrait, driving_privileges
- **AND** SHALL include "Car Rental (Age + License)" requesting PID with age_over_18 AND mDL with driving_privileges as two required credentials

#### Scenario: Flexible templates available

- **WHEN** a user views the Flexible category
- **THEN** templates SHALL include "Basic Identity via PID or mDL" with credential set offering PID OR mDL with family_name, given_name, birth_date

### Requirement: Custom Templates

The application SHALL allow users to save, manage, and delete their own custom templates.

#### Scenario: Save current configuration as template

- **WHEN** a user has credential requests configured
- **AND** clicks "Save as Template" in the Templates tab
- **THEN** a dialog SHALL prompt for template name and description
- **AND** upon confirmation, the current credential requests and sets SHALL be saved as a custom template
- **AND** the custom template SHALL appear in a "Custom Templates" section
- **AND** the custom template SHALL display a "Custom" badge to distinguish from built-in templates

#### Scenario: Save template validation

- **WHEN** a user attempts to save a template
- **THEN** the name field SHALL be required with a maximum of 50 characters
- **AND** the description field SHALL be optional with a maximum of 200 characters
- **AND** at least one valid credential request SHALL be required
- **AND** validation errors SHALL be displayed if requirements are not met

#### Scenario: Delete custom template

- **WHEN** a user clicks the delete button on a custom template
- **THEN** a confirmation dialog SHALL be displayed
- **AND** upon confirmation, the template SHALL be removed from the custom templates list
- **AND** the template SHALL no longer appear in the Templates tab

#### Scenario: Custom templates persist across sessions

- **WHEN** a user saves a custom template
- **AND** refreshes the page or returns later
- **THEN** the custom template SHALL still be available in the Templates tab

#### Scenario: Cannot delete built-in templates

- **WHEN** a user views a built-in template
- **THEN** no delete option SHALL be available for that template

### Requirement: Template Validation

The application SHALL validate templates before application to ensure they reference valid credential cases.

#### Scenario: Valid template applies successfully

- **WHEN** a user applies a template that references existing credential cases
- **THEN** the template SHALL be applied without errors
- **AND** all credential requests SHALL be properly configured

#### Scenario: Template with invalid credential case reference

- **WHEN** a user attempts to apply a custom template that references a deleted custom credential case
- **THEN** an error message SHALL be displayed indicating the invalid reference
- **AND** the current configuration SHALL remain unchanged

#### Scenario: Imported template with missing credential case

- **WHEN** a user imports a configuration containing templates that reference credential cases not present in the import
- **AND** the user attempts to apply such a template
- **THEN** an error message SHALL be displayed indicating the missing credential case
- **AND** the current configuration SHALL remain unchanged

#### Scenario: Built-in template validation at startup

- **WHEN** the application starts
- **THEN** built-in templates SHALL be validated against built-in credential cases
- **AND** any invalid built-in template SHALL be excluded from the templates list
- **AND** validation errors SHALL be logged for debugging

