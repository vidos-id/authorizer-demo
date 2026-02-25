## MODIFIED Requirements

### Requirement: UI Section Ordering

The application SHALL display builder sections in a logical order that reflects the workflow.

#### Scenario: Section order in builder mode

- **WHEN** the builder mode is displayed
- **THEN** sections SHALL appear in this order: Profile → Response Mode → Credential Requests → Credential Sets → Transaction Data → Advanced Options
- **AND** this order SHALL reflect the logical flow of defining credentials first, then combining them, then attaching transaction authorization data

## ADDED Requirements

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
