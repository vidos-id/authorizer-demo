## 1. Transaction Data State and Models

- [x] 1.1 Add transaction data entry types for core fields (`type`, `credential_ids`, `transaction_data_hashes_alg`) plus recursive custom-field node modeling.
- [x] 1.2 Extend create-stage state management to support multiple transaction data entries with insertion-order preservation.
- [x] 1.3 Add state helpers for add/remove/update transaction data entries and nested custom-field operations.

## 2. Transaction Data Builder UI

- [x] 2.1 Add a new "Transaction Data" section in Builder mode below Credential Sets with generic OID4VP-oriented copy.
- [x] 2.2 Implement per-entry editor with topmost regular `type` input and entry-level add/remove controls.
- [x] 2.3 Implement `credential_ids` selector reusing Credential Set selection interaction and sourced from DCQL credential request IDs.
- [x] 2.4 Implement `transaction_data_hashes_alg` multi-select with controlled options `sha-256`, `sha-384`, `sha-512`.
- [x] 2.5 Implement recursive custom-field builder supporting objects, arrays, and primitive values while preserving insertion order.

## 3. Validation and Synchronization

- [x] 3.1 Add validation rules for required `type`, non-empty `credential_ids`, and valid credential ID references.
- [x] 3.2 Add validation for controlled hash algorithm selection values.
- [x] 3.3 Ensure credential ID rename/delete propagation keeps transaction data references synchronized and valid.

## 4. Serialization and Request Mapping

- [x] 4.1 Implement JSON serialization of each transaction data entry with insertion-order preservation for entries and object fields.
- [x] 4.2 Implement base64url encoding per entry and map to `transaction_data: string[]` in preview and authorization request payload.
- [x] 4.3 Ensure `transaction_data` is omitted when no entries are configured and included as non-empty array when entries exist.

## 5. Templates and Example Updates

- [x] 5.1 Add/update built-in payment transaction template to use DCQL (no Presentation Exchange `input_descriptors`).
- [x] 5.2 Configure the template credential query for Payment Wallet Attestation with ID `43bccd4e-22fa-4bf7-a088-ee6a7b9a071f`.
- [x] 5.3 Add transaction data example that decodes to the agreed payment payload and is emitted as base64url in `transaction_data`.

## 6. QA and Regression Checks

- [x] 6.1 Verify builder section ordering includes Transaction Data between Credential Sets and Advanced Options.
- [x] 6.2 Verify multiple transaction data entries serialize in insertion order and decode back to expected JSON structures.
- [x] 6.3 Verify existing credential request, credential set, template, and authorization creation flows remain functional.
