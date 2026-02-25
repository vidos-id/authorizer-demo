# redirect-uri-response-code Delta Specification

## ADDED Requirements

### Requirement: Detect Redirect URI Response Code
The application SHALL detect `response_code` in the page query string on initial load and initialize redirect callback handling.

#### Scenario: Response code present on load
- **WHEN** the app loads with a `response_code` query parameter
- **THEN** the app SHALL capture the `response_code` value for processing
- **AND** the app SHALL mark the flow context as redirect-URI callback

#### Scenario: Response code absent on load
- **WHEN** the app loads without a `response_code` query parameter
- **THEN** the app SHALL continue standard flow initialization behavior

### Requirement: Resolve Response Code to Authorization ID
The application SHALL resolve `response_code` to `authorizationId` through the Authorizer resolve endpoint before fetching result data.

#### Scenario: Successful response code resolution
- **WHEN** a valid, unconsumed `response_code` is processed
- **THEN** the app SHALL call the resolve endpoint on the configured Authorizer instance
- **AND** the app SHALL store the returned `authorizationId`

#### Scenario: Resolution is one-time and can fail after reuse or expiry
- **WHEN** the resolve endpoint rejects the `response_code` as expired, invalid, or already used
- **THEN** the app SHALL show a resolution failure state
- **AND** the app SHALL explain that `response_code` has short TTL and one-time usage semantics

### Requirement: Result Data Hydration from Resolved Authorization ID
After successful resolve, the application SHALL fetch terminal result data using the resolved `authorizationId`.

#### Scenario: Fetch status and result payloads after resolve
- **WHEN** `authorizationId` is resolved successfully
- **THEN** the app SHALL fetch authorization status and available result payloads for policy and submitted credentials
- **AND** the app SHALL render the Result stage using the existing result display behavior

#### Scenario: Partial data availability after resolve
- **WHEN** status is available but one or more result payloads are unavailable
- **THEN** the app SHALL still render the Result stage with available data
- **AND** the app SHALL show a clear message that some result details could not be retrieved

### Requirement: Redirect URI Query Parameter Hygiene
The application SHALL remove `response_code` from the browser URL after it is captured.

#### Scenario: Remove response code from URL after capture
- **WHEN** the app captures `response_code` on load
- **THEN** the app SHALL update browser history to remove the `response_code` query parameter
- **AND** the app SHALL continue processing using in-memory state without re-reading from URL
