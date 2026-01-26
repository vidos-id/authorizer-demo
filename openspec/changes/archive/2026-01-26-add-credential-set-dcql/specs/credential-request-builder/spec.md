## ADDED Requirements

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
- **THEN** sections SHALL appear in this order: Profile → Response Mode → Credential Requests → Credential Sets → Advanced Options
- **AND** this order SHALL reflect the logical flow of defining credentials first, then combining them

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
