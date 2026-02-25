# result-display Delta Specification

## ADDED Requirements

### Requirement: Redirect URI Flow Notice
The system SHALL display a visible informational note when the result page is reached through OID4VP redirect URI callback handling.

#### Scenario: Notice displayed for redirect callback context
- **WHEN** the RESULT stage is rendered from a detected `response_code` redirect callback
- **THEN** an informational note SHALL be shown near the top of the page
- **AND** the note SHALL explain this page was opened via wallet redirect URI flow

#### Scenario: Notice hidden for standard flow
- **WHEN** the RESULT stage is rendered from the standard in-app stage progression
- **THEN** the redirect URI informational note SHALL NOT be shown

### Requirement: Redirect Resolution Failure Messaging
The system SHALL display redirect-specific error guidance when `response_code` resolution fails.

#### Scenario: Expired, used, or invalid response code
- **WHEN** `response_code` resolution fails because the code is expired, already used, or invalid
- **THEN** the result page SHALL display a clear failure message
- **AND** the message SHALL explain one-time and short-TTL behavior
- **AND** the user SHALL be prompted to start a new authorization flow

#### Scenario: Possible authorizer instance mismatch across devices
- **WHEN** `response_code` resolution fails in redirect callback context
- **THEN** the error message SHALL include a troubleshooting note that a different Authorizer instance may be configured on this device
- **AND** the note SHALL instruct the user to verify the Authorizer URL configuration and retry with matching instance

#### Scenario: Transient resolution failure
- **WHEN** `response_code` resolution fails due to transient network or server errors
- **THEN** the result page SHALL display retry guidance
- **AND** the user SHALL have an option to retry resolution
