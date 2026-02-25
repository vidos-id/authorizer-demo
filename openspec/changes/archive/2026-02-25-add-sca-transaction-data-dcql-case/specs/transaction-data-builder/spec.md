## ADDED Requirements

### Requirement: Transaction Data Section
The system SHALL provide a Transaction Data section in the Create Authorization Request builder for OID4VP `transaction_data` configuration.

#### Scenario: Section placement and wording
- **WHEN** a user views Builder mode
- **THEN** a section titled "Transaction Data" SHALL be shown below Credential Sets
- **AND** the section description SHALL use generic OID4VP wording and SHALL NOT be specific to SCA

#### Scenario: Multiple entries supported
- **WHEN** a user adds transaction data entries
- **THEN** the section SHALL allow creating multiple entries
- **AND** each entry SHALL map to one string element in the final `transaction_data` array

### Requirement: Transaction Data Entry Core Fields
Each transaction data entry SHALL capture mandatory OID4VP fields using builder controls.

#### Scenario: Type input placement
- **WHEN** a user opens a transaction data entry editor
- **THEN** a regular text input for `type` SHALL be shown as the topmost field
- **AND** the field SHALL be required before authorization creation

#### Scenario: Credential IDs selection
- **WHEN** a user configures `credential_ids`
- **THEN** the system SHALL provide selectable credential IDs sourced from DCQL credential request IDs
- **AND** the interaction pattern SHALL match Credential Set credential selection behavior
- **AND** at least one credential ID SHALL be required

#### Scenario: Hash algorithm selection
- **WHEN** a user configures `transaction_data_hashes_alg`
- **THEN** the system SHALL provide a controlled selection of hash algorithms
- **AND** selectable options SHALL include `sha-256`, `sha-384`, and `sha-512`
- **AND** the control SHALL support selecting multiple algorithms

### Requirement: Complex Field Builder
The system SHALL support additional transaction-data-type-specific fields via a structured builder.

#### Scenario: Add custom top-level fields
- **WHEN** a user adds non-core fields
- **THEN** the system SHALL allow multiple additional top-level keys (for example `payment_data`, `payload_data`)
- **AND** each key SHALL be unique within the same transaction data entry

#### Scenario: Build nested structures
- **WHEN** a user edits a custom field value
- **THEN** the builder SHALL support objects, arrays, and primitive values
- **AND** users SHALL be able to nest structures recursively

#### Scenario: Example-compatible structure support
- **WHEN** a user builds payment details
- **THEN** the builder SHALL support structures equivalent to `{ "payment_data": { "currency_amount": { "currency": "EUR", "value": 25 }, "payee": "Fast Ferries" } }`

### Requirement: Transaction Data Validation
The system SHALL validate transaction data entries before allowing authorization creation.

#### Scenario: Missing required core field
- **WHEN** an entry is missing `type` or has an empty `credential_ids`
- **THEN** the entry SHALL be marked invalid
- **AND** the create action SHALL be disabled

#### Scenario: Unknown credential ID reference
- **WHEN** an entry references a credential ID that is not present in configured DCQL credentials
- **THEN** the entry SHALL be marked invalid
- **AND** validation feedback SHALL identify the invalid reference

### Requirement: OID4VP Serialization
The system SHALL serialize transaction data entries to OID4VP request format.

#### Scenario: Encode each entry as base64url JSON
- **WHEN** authorization payload is generated
- **THEN** each transaction data entry object SHALL be JSON-serialized and base64url-encoded
- **AND** the resulting `transaction_data` value SHALL be a non-empty array of encoded strings when entries exist

#### Scenario: Preserve entry order
- **WHEN** multiple entries are configured
- **THEN** encoded strings in `transaction_data` SHALL preserve insertion order
- **AND** example structure SHALL be `[<transaction-data-1-base-64>, <transaction-data-2-base-64>, ...]`

#### Scenario: Preserve field insertion order
- **WHEN** a user adds multiple top-level custom fields to a transaction data entry
- **THEN** the serialized JSON object SHALL preserve insertion order for those fields
- **AND** nested object fields SHALL preserve insertion order within each object scope
