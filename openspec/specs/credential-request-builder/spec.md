# credential-request-builder Specification

## Purpose

This specification defines the credential request builder feature that allows users to construct one or more credential requests for OID4VP authorization flows. Users can select document types (PID, MDL, Photo ID), choose appropriate formats based on document type availability, and build complex authorization requests with multiple credentials.

## UI Overview

The Create Authorization Request page features an enhanced header that provides clear context about the workflow:

- **Title**: "Create Authorization Request" (displayed at `text-xl` size)
- **Description**: Multi-line explanation that describes the three methods available (templates, visual builder, raw JSON) and clarifies that the request generates a shareable link for credential verification
- **Visual Treatment**: Subtle spacing enhancements (`space-y-1.5`) for improved readability and hierarchy

This header design prioritizes clarity and user guidance while maintaining a minimalistic, professional aesthetic.
## Requirements
### Requirement: Page Header Context

The application SHALL provide clear, informative context about the authorization request creation workflow in the page header.

#### Scenario: Display page title

- **WHEN** a user navigates to the Create Authorization Request page
- **THEN** the page title SHALL read "Create Authorization Request"
- **AND** the title SHALL be displayed at a larger size (`text-xl`) for visual prominence

#### Scenario: Display comprehensive description

- **WHEN** a user views the page header
- **THEN** a multi-line description SHALL be displayed below the title
- **AND** the description SHALL explain the three available methods: templates, visual builder, and raw JSON
- **AND** the description SHALL clarify that the request generates a shareable link for credential verification
- **AND** the description text SHALL be: "Build and send credential verification requests using templates, the visual builder, or raw JSON. Your request will generate a shareable link for credential verification."

#### Scenario: Visual spacing and hierarchy

- **WHEN** the page header is rendered
- **THEN** appropriate spacing SHALL be applied between title and description (`space-y-1.5`)
- **AND** the visual hierarchy SHALL guide users through the workflow understanding

### Requirement: Custom Credential Types Link

The application SHALL provide a single contextual link above the credential request list to manage custom credential type definitions.

#### Scenario: Display custom types management link

- **WHEN** a user views the credential requests section in Builder tab
- **THEN** a "Manage custom credential types" link SHALL be displayed once
- **AND** the link SHALL be positioned above the credential request list (near the section header)
- **AND** the link SHALL use subtle styling (small text, muted color) to appear as secondary action

#### Scenario: Open custom credential case manager

- **WHEN** a user clicks the "Manage custom credential types" link
- **THEN** the Custom Credential Case dialog SHALL open
- **AND** the user SHALL be able to create, edit, clone, or delete custom cases
- **AND** upon closing the dialog, any new custom cases SHALL appear in document type dropdowns
- **AND** any new formats SHALL appear in format dropdowns when a custom type is selected

#### Scenario: Single link for all credential requests

- **WHEN** multiple credential requests exist in the builder
- **THEN** only one "Manage custom credential types" link SHALL be displayed
- **AND** the link SHALL NOT be repeated inside each credential request item

### Requirement: Document Type Selection

The application SHALL allow users to select a document type for each credential request from the supported types.

#### Scenario: Display available document types

- **WHEN** a user adds a new credential request
- **THEN** the application SHALL display all available document types
- **AND** the document types SHALL include PID (Person Identification Data), MDL (Mobile Driving Licence), and Photo ID

#### Scenario: Select document type

- **WHEN** a user selects a document type
- **THEN** the selected document type SHALL be stored in the credential request
- **AND** the format selection SHALL be updated to show only formats available for that document type

### Requirement: Format Selection Based on Document Type

The application SHALL filter format options based on the selected document type according to credential case definitions.

#### Scenario: PID format availability

- **WHEN** a user selects PID as the document type
- **THEN** the format options SHALL include both `dc+sd-jwt` and `mso_mdoc`
- **AND** the user SHALL be able to select either format

#### Scenario: MDL format availability

- **WHEN** a user selects MDL as the document type
- **THEN** the format options SHALL include only `mso_mdoc`
- **AND** `dc+sd-jwt` SHALL NOT be available as an option

#### Scenario: Photo ID format availability

- **WHEN** a user selects Photo ID as the document type
- **THEN** the format options SHALL include both `dc+sd-jwt` and `mso_mdoc`
- **AND** the user SHALL be able to select either format

#### Scenario: Format reset on document type change

- **WHEN** a user changes the document type for an existing credential request
- **THEN** the previously selected format SHALL be cleared if it is not available for the new document type
- **AND** the format selection SHALL be updated to show only formats available for the new document type

### Requirement: Multiple Credential Requests

The application SHALL allow users to add and remove multiple credential requests within a single authorization.

#### Scenario: Add multiple credential requests

- **WHEN** a user clicks "Add Credential Request"
- **THEN** a new credential request builder SHALL be added to the interface
- **AND** the user SHALL be able to configure the document type and format independently for each request
- **AND** there SHALL be no limit on the number of credential requests that can be added

#### Scenario: Remove credential request

- **WHEN** a user clicks the remove button on a credential request
- **THEN** that credential request SHALL be removed from the authorization
- **AND** the remaining credential requests SHALL remain unchanged

#### Scenario: Cannot remove last credential request

- **WHEN** only one credential request exists
- **THEN** the remove button SHALL be disabled or hidden
- **AND** the user SHALL NOT be able to remove the last credential request

#### Scenario: Multiple credentials with different formats

- **WHEN** a user adds multiple credential requests
- **THEN** the user SHALL be able to select different document types for each request
- **AND** the user SHALL be able to select different formats for each request
- **AND** example combinations SHALL include PID (dc+sd-jwt) + MDL (mso_mdoc)

### Requirement: Credential Request Validation

The application SHALL validate that at least one valid credential request exists before allowing authorization creation.

#### Scenario: Valid credential request configuration

- **WHEN** at least one credential request has both a document type and format selected
- **THEN** the "Create Authorization" button SHALL be enabled
- **AND** the user SHALL be able to proceed to create the authorization

#### Scenario: Missing document type or format

- **WHEN** any credential request is missing either a document type or format
- **THEN** the "Create Authorization" button SHALL be disabled
- **AND** a validation error SHALL indicate which credential request is incomplete

#### Scenario: No credential requests

- **WHEN** no credential requests exist in the builder
- **THEN** the "Create Authorization" button SHALL be disabled
- **AND** a validation error SHALL indicate "At least one credential request is required"

### Requirement: Credential Request Ordering

The application SHALL preserve the order of credential requests as defined by the user.

#### Scenario: Maintain credential request order

- **WHEN** a user adds multiple credential requests
- **THEN** the credential requests SHALL be sent to the API in the order they were added
- **AND** the order SHALL be visually indicated in the UI (e.g., numbered or ordered list)

#### Scenario: Reorder credential requests (future enhancement)

- **WHEN** drag-and-drop reordering is implemented
- **THEN** users SHALL be able to reorder credential requests
- **AND** the new order SHALL be reflected in the API request

### Requirement: Credential ID Customization

The application SHALL allow users to customize the credential ID for each credential request, which becomes the DCQL credential `id` field.

#### Scenario: Default credential ID

- **WHEN** a user creates a credential request
- **THEN** the application SHALL pre-fill the ID field with a UUID
- **AND** the ID field SHALL be editable

#### Scenario: Custom credential ID

- **WHEN** a user edits the credential ID to a custom value (e.g., "mdl-id")
- **THEN** that custom ID SHALL be used in the DCQL output
- **AND** the custom ID SHALL be displayed in the credential request header as a subtitle

#### Scenario: Credential ID in header

- **WHEN** a credential request is displayed (collapsed or expanded)
- **THEN** the credential ID SHALL be visible in the header as a subtitle
- **AND** the ID SHALL be displayed in monospace font
- **AND** the ID SHALL be styled with muted color to differentiate from main title

#### Scenario: Credential ID uniqueness warning

- **WHEN** a user enters a credential ID that matches an existing credential request
- **THEN** the application SHALL display a warning
- **AND** the application SHALL allow the duplicate ID (not block submission)

#### Scenario: Credential ID change keeps item open

- **WHEN** a user changes a credential ID
- **THEN** the credential request item SHALL remain expanded
- **AND** no unexpected collapse SHALL occur

### Requirement: Credential Set Membership Indicator

The application SHALL display which credential sets reference each credential request.

#### Scenario: Credential used in credential sets

- **WHEN** a credential request is referenced by one or more credential sets
- **THEN** the credential request SHALL display an indicator showing which sets include it
- **AND** the indicator SHALL show the credential set IDs (e.g., "Used in: id-set, address-set")

#### Scenario: Credential not used in any set

- **WHEN** a credential request is not referenced by any credential set
- **THEN** no membership indicator SHALL be displayed for that credential

#### Scenario: Credential set membership updates

- **WHEN** a credential is added to or removed from a credential set
- **THEN** the membership indicator on the credential request SHALL update immediately

#### Scenario: Navigate to credential set from indicator

- **WHEN** a user clicks on a credential set ID in the membership indicator
- **THEN** the application SHALL scroll to and expand that credential set
- **AND** the credential set SHALL be visually highlighted briefly

### Requirement: Duplicate Document Types

The application SHALL allow users to create multiple credential requests with the same document type but different attribute selections.

#### Scenario: Add duplicate document type

- **WHEN** a user adds a credential request with a document type that already exists
- **THEN** the application SHALL allow the duplicate
- **AND** each credential request SHALL be independently configurable with different attributes

#### Scenario: Same document type different attributes

- **WHEN** a user creates two MDL credential requests
- **THEN** the user SHALL be able to select different attributes for each (e.g., ID claims vs address claims)
- **AND** both SHALL appear as separate entries in the DCQL credentials array

### Requirement: Credential Set Definition

The application SHALL allow users to define credential sets that specify alternative or combined credential options per the DCQL specification.

#### Scenario: Create credential set

- **WHEN** a user clicks "New Credential Set"
- **THEN** a new credential set builder SHALL be displayed
- **AND** the set SHALL have an editable ID field pre-filled with a UUID
- **AND** the set SHALL default to required (required: true)
- **AND** the set SHALL have at least one empty option to configure

#### Scenario: Custom credential set ID

- **WHEN** a user edits the credential set ID to a custom value (e.g., "id-set")
- **THEN** that custom ID SHALL be used for the credential set
- **AND** the custom ID SHALL be displayed in the credential set header

#### Scenario: Add option to credential set

- **WHEN** a user adds an option to a credential set
- **THEN** the option SHALL allow selecting one or more credentials by their ID
- **AND** multiple options in a set represent OR logic (alternatives)
- **AND** multiple credentials within an option represent AND logic (combination required)

#### Scenario: Mark credential set as optional

- **WHEN** a user toggles a credential set to optional
- **THEN** the set SHALL be marked with required: false
- **AND** the UI SHALL visually indicate the optional status

#### Scenario: Remove credential set

- **WHEN** a user removes a credential set
- **THEN** that set SHALL be removed from the configuration
- **AND** the remaining sets SHALL be unaffected

### Requirement: Credential Set Options Configuration

The application SHALL allow configuring multiple options within each credential set, where each option can contain one or more credentials.

#### Scenario: Single credential per option (OR alternatives)

- **WHEN** a user creates options with one credential each
- **THEN** the DCQL output SHALL request any ONE of those credentials
- **AND** example: options [["mdl-id"], ["photo_card-id"]] means mDL ID OR photo card ID

#### Scenario: Multiple credentials per option (AND combination)

- **WHEN** a user creates an option with multiple credentials
- **THEN** the DCQL output SHALL require ALL credentials in that option together
- **AND** example: option ["cred1", "cred2"] means cred1 AND cred2

#### Scenario: Mixed options (OR of ANDs)

- **WHEN** a user creates multiple options with varying credential counts
- **THEN** the DCQL output SHALL request one complete option to be satisfied
- **AND** example: options [["pid"], ["reduced1", "reduced2"]] means PID OR (reduced1 AND reduced2)

#### Scenario: Visual OR separator between options

- **WHEN** a credential set has multiple options
- **THEN** the UI SHALL display an "OR" separator/divider between each option
- **AND** users SHALL clearly understand alternatives are separated by OR logic

#### Scenario: Inline help for OR/AND logic

- **WHEN** the credential sets section is displayed
- **THEN** brief help text SHALL explain the OR/AND logic
- **AND** the help text SHALL clarify that multiple options = OR, multiple credentials in one option = AND

### Requirement: Quick Add to Credential Set

The application SHALL allow users to quickly add credentials to sets from the credential request when credential sets exist.

#### Scenario: Add to set button visibility

- **WHEN** at least one credential set exists
- **THEN** each credential request SHALL display an "Add to set" button with text and icon
- **AND** the button SHALL NOT be visible when no credential sets exist
- **AND** the button height SHALL match the adjacent input field height

#### Scenario: Add to existing option

- **WHEN** a user clicks "Add to set" on a credential request
- **THEN** the user SHALL be able to select an existing credential set
- **AND** the user SHALL be able to add the credential to an existing option within that set

#### Scenario: Add as new option

- **WHEN** a user clicks "Add to set" on a credential request
- **THEN** the user SHALL have the option to create a new option in an existing set
- **AND** the new option SHALL contain only that credential initially

### Requirement: Credential Set Validation

The application SHALL validate credential set configurations before allowing authorization creation.

#### Scenario: Empty option validation

- **WHEN** a credential set contains an option with no credentials selected
- **THEN** the application SHALL display a validation error
- **AND** the "Create Authorization" button SHALL be disabled

#### Scenario: Empty credential set validation

- **WHEN** a credential set has no options
- **THEN** the application SHALL display a validation error
- **AND** the "Create Authorization" button SHALL be disabled
- **AND** the credential set SHALL NOT be auto-deleted

#### Scenario: Invalid credential reference

- **WHEN** a credential set references a credential ID that does not exist in credentials
- **THEN** the application SHALL display a validation error
- **AND** the error SHALL indicate which credential ID is invalid

#### Scenario: Credential ID renamed

- **WHEN** a user changes a credential ID that is referenced in credential sets
- **THEN** all credential set references SHALL automatically update to the new ID
- **AND** the credential sets SHALL remain valid

#### Scenario: Same credential in multiple sets

- **WHEN** a user adds the same credential to multiple different credential sets
- **THEN** the application SHALL allow this configuration
- **AND** no warning SHALL be displayed

#### Scenario: Same credential multiple times in same option

- **WHEN** a user attempts to add the same credential twice within the same option
- **THEN** the application SHALL prevent this
- **AND** the credential selector SHALL only show credentials not already in that option

#### Scenario: Same credential in different options of same set

- **WHEN** a user adds the same credential to different options within the same set
- **THEN** the application SHALL allow this configuration
- **AND** no warning SHALL be displayed

#### Scenario: Credential deleted with references

- **WHEN** a user deletes a credential that is referenced in credential sets
- **THEN** the application SHALL automatically remove that ID from all credential set options
- **AND** if an option becomes empty, it SHALL be automatically removed
- **AND** a notification SHALL inform the user of the cleanup

#### Scenario: No credential sets defined

- **WHEN** no credential sets are defined
- **THEN** the application SHALL use the default behavior (all credentials required)
- **AND** the DCQL output SHALL NOT include the credential_sets field

#### Scenario: Credential sets section collapsed by default

- **WHEN** the create stage is displayed
- **THEN** the credential sets section SHALL be collapsed by default
- **AND** the user SHALL be able to expand it to configure credential sets

### Requirement: DCQL Query Generation with Credential Sets

The application SHALL generate valid DCQL queries including credential_sets when sets are configured.

#### Scenario: Generate DCQL with credential sets

- **WHEN** credential sets are defined
- **THEN** the DCQL output SHALL include a credential_sets array
- **AND** each set SHALL map to an object with options and required fields
- **AND** the options SHALL reference credential IDs from the credentials array

#### Scenario: DCQL credential ID from user input

- **WHEN** a credential has a custom ID (e.g., "mdl-id")
- **THEN** the DCQL credential object SHALL use that ID
- **AND** credential set options SHALL reference that same ID

#### Scenario: DCQL without credential sets

- **WHEN** no credential sets are defined
- **THEN** the DCQL output SHALL NOT include the credential_sets field
- **AND** all defined credentials SHALL be implicitly required per spec

#### Scenario: DCQL preview includes credential sets

- **WHEN** credential sets are configured
- **THEN** the JSON preview panel SHALL display the complete DCQL including credential_sets
- **AND** the preview SHALL update as credential sets are modified

### Requirement: UI Section Ordering

The application SHALL display builder sections in a logical order that reflects the workflow.

#### Scenario: Section order in builder mode

- **WHEN** the builder mode is displayed
- **THEN** sections SHALL appear in this order: Profile → Response Mode → Credential Requests → Credential Sets → Transaction Data → Advanced Options
- **AND** this order SHALL reflect the logical flow of defining credentials first, then combining them, then attaching transaction authorization data

### Requirement: Visual Consistency

The application SHALL use consistent visual patterns across credential requests and credential sets.

#### Scenario: Delete button positioning

- **WHEN** a credential request or credential set item is displayed
- **THEN** the delete button SHALL be positioned in the top-left corner
- **AND** the delete button SHALL be next to the item title
- **AND** this pattern SHALL be consistent across all deletable items (requests, sets, options)

#### Scenario: Two-line title format

- **WHEN** a credential request or credential set item is displayed
- **THEN** the header SHALL display a two-line title
- **AND** the main title SHALL describe the item type and configuration
- **AND** the subtitle SHALL display the item ID in monospace font with muted color

#### Scenario: Collapsible item behavior

- **WHEN** credential request and credential set items are displayed
- **THEN** each item SHALL manage its own open/closed state independently
- **AND** the first item in each list SHALL default to open
- **AND** changing an item's ID SHALL NOT cause it to collapse

#### Scenario: Consistent card styling

- **WHEN** credential request and credential set items are displayed
- **THEN** they SHALL share identical border and padding styling
- **AND** the content area SHALL have consistent padding and border-top separator

### Requirement: Transaction Data and Credential Alignment
The application SHALL align transaction data references with DCQL credential IDs.

#### Scenario: Credential IDs sourced from credential requests
- **WHEN** a user configures transaction data `credential_ids`
- **THEN** only IDs from configured DCQL credential requests SHALL be available for selection
- **AND** selected IDs SHALL match `id` values in DCQL credentials

#### Scenario: Credential ID rename propagation to transaction data
- **WHEN** a credential request ID is changed
- **THEN** all transaction data `credential_ids` references SHALL update to the new ID
- **AND** transaction data entries SHALL remain valid after rename

