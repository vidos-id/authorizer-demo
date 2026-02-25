## Why

The demo needs an SCA payment request example aligned with the EUDI TS12 wallet guidance, including transaction data that the Vidos Authorizer already supports. We also need to remove Presentation Exchange framing from this scenario and model it as DCQL so the example is OID4VP and SCA compliant.

## What Changes

- Add a new SCA payment credential case example that requests a payment wallet attestation using DCQL (`dc+sd-jwt`) rather than Presentation Exchange `input_descriptors`.
- Add a Transaction Data builder section below Credential Sets in the Create flow, allowing users to add multiple key-value entries.
- Ensure Transaction Data entries are serialized into `transaction_data` in the authorization request and validated for OID4VP SCA usage.
- Provide a concrete example payload for the SCA payment flow (ferry ticket payment purpose) with DCQL-aligned structure and claim paths.

## Capabilities

### New Capabilities
- `transaction-data-builder`: Configure one or more OID4VP/SCA transaction data entries as key-value pairs and include them in generated authorization requests.

### Modified Capabilities
- `credential-request-builder`: Add Transaction Data UI placement and behavior under Credential Sets, and enforce DCQL-first modeling for this SCA scenario.
- `request-templates`: Add an SCA payment template/example preconfigured for DCQL and transaction data.

## Impact

- Affects Create Authorization Request builder UI and state handling for Transaction Data.
- Affects request generation/preview mapping to include `transaction_data` entries with multiple key-value items.
- Affects built-in example/template definitions for SCA payment requests.
- No expected backend/API contract changes beyond using existing `transaction_data` support.
