# credential-display Specification

## Purpose
Display submitted credentials in the ResultStage with type-aware claim value rendering, semantic path breadcrumbs, and human-readable display names.

## ADDED Requirements

### Requirement: Credentials Tab Display
The system SHALL display submitted credentials in a dedicated tab within the ResultStage.

#### Scenario: Credentials tab content
- **WHEN** user activates the "Submitted Credentials" tab
- **THEN** the system SHALL fetch credentials from the API endpoint
- **AND** the system SHALL display all submitted credentials
- **AND** each credential SHALL be displayed in its own card section

#### Scenario: No credentials available (404)
- **WHEN** the credentials API returns 404
- **THEN** the system SHALL display "No credentials submitted" message
- **AND** the message SHALL NOT be styled as an error

#### Scenario: Credentials API error
- **WHEN** the credentials API returns an error (non-404)
- **THEN** the system SHALL display the error message within the credentials tab
- **AND** the error SHALL be styled appropriately (destructive/warning)

#### Scenario: Lazy data fetching
- **WHEN** the credentials tab is NOT active
- **THEN** the system SHALL NOT fetch credentials from the API
- **AND** fetching SHALL only occur when the tab becomes active

### Requirement: Credential Card Display
The system SHALL display each credential in a card with metadata and claims.

#### Scenario: Credential card header
- **WHEN** displaying a credential card
- **THEN** the card SHALL show the credential type (e.g., "eu.europa.ec.eudi.pid.1")
- **AND** the card SHALL show the credential format (e.g., "mdoc", "ietf.dc-sd-jwt")
- **AND** the card SHALL show the semantic path breadcrumb

#### Scenario: Multiple credentials display
- **WHEN** multiple credentials are returned by the API
- **THEN** all credentials SHALL be displayed in separate cards
- **AND** cards SHALL have clear visual separation
- **AND** the order SHALL match the API response order

### Requirement: Semantic Path Breadcrumbs
The system SHALL display credential paths as human-readable breadcrumbs.

#### Scenario: SD-JWT credential path
- **WHEN** displaying a credential with format containing "sd-jwt" or "dc"
- **AND** the path is `[dcqlId, vpIndex]`
- **THEN** the breadcrumb SHALL display "Credential: {dcqlId} › VP Token: {vpIndex+1}"

#### Scenario: mdoc credential path
- **WHEN** displaying a credential with format containing "mdoc"
- **AND** the path is `[dcqlId, vpIndex, docIndex, namespace]`
- **THEN** the breadcrumb SHALL display "Credential: {dcqlId} › VP Token: {vpIndex+1} › Document: {docIndex+1} › {namespace}"

#### Scenario: Unknown format path fallback
- **WHEN** displaying a credential with unknown format
- **AND** the path has more than 2 segments
- **THEN** the first segment SHALL be labeled "Credential: {value}"
- **AND** the second segment SHALL be labeled "VP Token: {value+1}"
- **AND** remaining segments SHALL be labeled "Segment N: {value}"

### Requirement: Claim Display Names
The system SHALL display claim keys as human-readable names.

#### Scenario: Known credential type claim lookup
- **WHEN** displaying a claim for a known credential type
- **AND** the credential type matches an entry in CREDENTIAL_CASES
- **THEN** the system SHALL look up the claim's displayName from the matching attribute definition
- **AND** the displayName SHALL be shown instead of the raw claim key

#### Scenario: Unknown claim fallback
- **WHEN** displaying a claim that is not found in CREDENTIAL_CASES
- **THEN** the system SHALL convert the claim key to title case
- **AND** snake_case keys SHALL become "Title Case" (e.g., "family_name" → "Family Name")
- **AND** camelCase keys SHALL become "Title Case" (e.g., "familyName" → "Family Name")

### Requirement: Claim Value Type Detection
The system SHALL detect and render claim values based on their data type.

#### Scenario: Primitive value rendering
- **WHEN** a claim value is a string, number, or boolean
- **AND** the value is NOT detected as a date or image
- **THEN** the value SHALL be displayed as plain text

#### Scenario: Date value detection by pattern
- **WHEN** a claim value matches ISO date pattern (YYYY-MM-DD)
- **OR** a claim value matches ISO datetime pattern (YYYY-MM-DDTHH:mm:ss)
- **THEN** the value SHALL be rendered using the date renderer

#### Scenario: Unix timestamp detection
- **WHEN** a claim key is "iat", "exp", or "nbf"
- **AND** the value is a number
- **THEN** the value SHALL be treated as a Unix timestamp and rendered as a date

#### Scenario: Image value detection
- **WHEN** a claim value starts with "data:image/"
- **THEN** the value SHALL be rendered using the image renderer

### Requirement: Date Value Rendering
The system SHALL render date values with field-appropriate formatting.

#### Scenario: Birth date rendering
- **WHEN** the claim key contains "birth_date" or "birthdate"
- **THEN** the date SHALL be formatted as date only (e.g., "Jan 1, 1983")
- **AND** no time component SHALL be shown

#### Scenario: Issuance date rendering
- **WHEN** the claim key contains "issuance_date", "issue_date", or equals "iat"
- **THEN** the date SHALL be formatted as date only (e.g., "Oct 1, 2025")

#### Scenario: Expiry date rendering with relative time
- **WHEN** the claim key contains "expiry_date", "date_of_expiry", or equals "exp"
- **THEN** the date SHALL be formatted as date (e.g., "Oct 15, 2025")
- **AND** relative time SHALL be shown (e.g., "in 8 months" or "2 days ago")

#### Scenario: Effective date rendering with time
- **WHEN** the claim key contains "effective_from" or "effective_until" or equals "nbf"
- **THEN** the date SHALL be formatted with date and time (e.g., "Oct 1, 2025 1:20 PM")
- **AND** effective_until dates SHALL also show relative time

#### Scenario: Generic date rendering
- **WHEN** a date value is detected but field name is not recognized
- **THEN** the date SHALL be formatted as date only if no time component exists
- **OR** the date SHALL be formatted with date and time if time component exists

### Requirement: Image Value Rendering
The system SHALL render image data inline.

#### Scenario: Data URI image rendering
- **WHEN** a claim value is a data URI starting with "data:image/"
- **THEN** the image SHALL be rendered as an inline `<img>` element
- **AND** the image SHALL have max-height of 200px
- **AND** the image SHALL have max-width of 100%
- **AND** the image SHALL use lazy loading

#### Scenario: Image render error fallback
- **WHEN** an image fails to render
- **THEN** the system SHALL display "[Image data]" text
- **AND** the approximate data size MAY be shown

### Requirement: Nested Data Rendering
The system SHALL render nested objects and arrays with visual structure.

#### Scenario: Array value rendering
- **WHEN** a claim value is an array
- **THEN** the array SHALL be rendered as a bulleted list
- **AND** the list SHALL be contained in a subtle bordered container
- **AND** each item SHALL be recursively rendered based on its type

#### Scenario: Object value rendering
- **WHEN** a claim value is an object
- **THEN** the object SHALL be rendered as indented key-value pairs
- **AND** the object SHALL be contained in a subtle bordered container
- **AND** each value SHALL be recursively rendered based on its type

#### Scenario: Deeply nested data
- **WHEN** nested data contains further nested data
- **THEN** nesting SHALL be visually indicated through indentation
- **AND** each nesting level SHALL increase indentation
- **AND** containers SHALL nest within containers

### Requirement: Claims Layout
The system SHALL display claims in a compact, scannable layout.

#### Scenario: Claim list display
- **WHEN** displaying credential claims
- **THEN** claims SHALL be displayed as key-value pairs
- **AND** the display name SHALL be on the left
- **AND** the rendered value SHALL be on the right
- **AND** all claims SHALL be expanded (no collapse controls)

#### Scenario: Compact layout
- **WHEN** displaying multiple claims
- **THEN** the layout SHALL be vertically compact
- **AND** spacing between claims SHALL be minimal but readable
