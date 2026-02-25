## ADDED Requirements

### Requirement: SCA Payment Transaction Template
The application SHALL provide a built-in payment transaction template that demonstrates DCQL credentials combined with OID4VP transaction data.

#### Scenario: Template listed in Templates tab
- **WHEN** a user views built-in templates
- **THEN** a payment transaction template aligned with EUDI wallet SCA usage SHALL be available
- **AND** the template SHALL be represented as a DCQL-based request (not Presentation Exchange `input_descriptors`)

#### Scenario: Template credentials for payment wallet attestation
- **WHEN** the payment transaction template is applied
- **THEN** it SHALL include a `dc+sd-jwt` credential query for Payment Wallet Attestation with ID `43bccd4e-22fa-4bf7-a088-ee6a7b9a071f`
- **AND** it SHALL include claim constraints for the payment wallet attestation data fields used by the example

#### Scenario: Template transaction data example
- **WHEN** the payment transaction template is applied
- **THEN** it SHALL include at least one transaction data entry that decodes to an object equivalent to `{ "type": "payment_data", "credential_ids": ["43bccd4e-22fa-4bf7-a088-ee6a7b9a071f"], "transaction_data_hashes_alg": ["sha-256"], "payment_data": { "currency_amount": { "currency": "EUR", "value": 25 }, "payee": "Fast Ferries" } }`
- **AND** the authorization request payload SHALL contain this entry in base64url-encoded form inside `transaction_data`
