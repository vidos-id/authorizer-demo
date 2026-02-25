## Context

The Create Authorization Request flow already supports DCQL credential configuration and the backend accepts `transaction_data`, but the UI lacks a dedicated, generic builder to author OID4VP transaction data entries. Current examples are focused on credential requests and do not provide a first-class path for creating multiple base64url-encoded transaction data objects. The requested payment scenario (ferry ticket) must be represented as DCQL plus OID4VP transaction data, while the builder itself remains use-case agnostic and reusable for other transaction types.

Constraints:
- OID4VP defines `transaction_data` as an array of base64url-encoded JSON objects.
- Each decoded object must include `type` and `credential_ids`, and may include type-specific fields.
- Wallets can reject unknown or malformed transaction data for unsupported types.
- For this release, `transaction_data_hashes_alg` must support multiple selections from `sha-256`, `sha-384`, and `sha-512`.

## Goals / Non-Goals

**Goals:**
- Introduce a generic Transaction Data builder below Credential Sets in Builder mode.
- Support multiple transaction data entries and preserve order in generated payloads.
- Reuse existing credential ID selection patterns for `credential_ids`.
- Support structured additional fields with nested objects/arrays/primitives.
- Encode each entry to base64url JSON and emit `transaction_data: string[]` in request preview/submission.
- Add a DCQL-based payment transaction template/example that includes transaction data.

**Non-Goals:**
- Defining or standardizing transaction data `type` values.
- Implementing algorithm choices beyond `sha-256` in this change.
- Wallet-side validation semantics beyond client-side structure validation.
- Reintroducing Presentation Exchange `input_descriptors` for this example.

## Decisions

### Decision: Keep Transaction Data modeling generic and OID4VP-native
The builder will expose OID4VP field names directly (`type`, `credential_ids`, optional `transaction_data_hashes_alg`, plus custom fields) and avoid SCA-specific copy in core UI.

Rationale:
- Aligns with OID4VP semantics across payment, signing, and future transaction types.
- Prevents coupling UX to one profile while still enabling SCA examples via templates.

Alternatives considered:
- Build an SCA-only form with fixed payment fields. Rejected because it limits reuse.

### Decision: Reuse credential selection mechanics from Credential Sets
`credential_ids` will use the same selectable-ID interaction style as credential set option builders.

Rationale:
- Consistency reduces user learning cost and implementation risk.
- Existing logic already handles evolving credential IDs and list changes.

Alternatives considered:
- Free-text comma-separated input. Rejected due to higher invalid reference risk.

### Decision: Represent additional fields with a typed recursive node model
Custom fields will be represented as tree nodes (`object`, `array`, `string`, `number`, `boolean`, `null`) so users can build nested data (`payment_data`, `payload_data`, etc.).

Rationale:
- Supports arbitrary transaction type payloads without schema lock-in.
- Enables deterministic JSON serialization and validation.

Alternatives considered:
- Raw JSON textarea per entry. Rejected as error-prone and inconsistent with builder UX.

### Decision: Serialize at request generation boundary
Builder state remains decoded structured objects; base64url encoding happens when generating preview/submission payload.

Rationale:
- Keeps UI editable and debuggable.
- Centralizes encoding and validation rules in one transformation path.

Alternatives considered:
- Persist encoded strings in UI state. Rejected due to poor editability and opaque validation.

### Decision: Constrain hash algorithm selection to controlled list
Expose `transaction_data_hashes_alg` as optional multi-select with `sha-256`, `sha-384`, and `sha-512`.

Rationale:
- Matches current interoperability baseline and user request.
- Leaves path open for future algorithm additions without model changes.

Alternatives considered:
- Free-text algorithm entry. Rejected due to typo/interoperability risk.

## Risks / Trade-offs

- [Complex nested builder increases UI complexity] → Mitigation: keep minimal operations (add/remove key, type switch, nested edit) and provide a compact default flow.
- [Validation drift between builder and payload transformation] → Mitigation: shared validation utility used by both UI and serialization pipeline.
- [Credential ID changes can orphan transaction references] → Mitigation: subscribe to credential ID updates and auto-propagate references like credential sets.
- [Future transaction types may require stronger schema constraints] → Mitigation: design node model with optional per-type schema hooks later.
- [Order-sensitive payload comparisons may fail if ordering changes] → Mitigation: keep insertion-order semantics for entries and object fields through state and serialization.

## Migration Plan

1. Add transaction data state model and defaults in create-stage state management.
2. Implement Transaction Data UI section below Credential Sets with multi-entry support.
3. Implement core field controls (`type`, `credential_ids`, `transaction_data_hashes_alg`).
4. Implement recursive custom-field builder and validation.
5. Extend preview/submission mapper to emit base64url-encoded `transaction_data` array.
6. Add built-in DCQL payment transaction template with decoded example payload source.
7. Verify no regression in existing credential/credential-set flows.

Rollback:
- Hide/disable Transaction Data section and omit `transaction_data` mapping while retaining existing credential request functionality.

## Open Questions

- For custom field builder, should root-level key ordering be user-controllable beyond insertion order?
