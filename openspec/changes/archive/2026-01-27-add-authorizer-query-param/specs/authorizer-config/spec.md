## ADDED Requirements
### Requirement: Query Parameter Authorizer Override
The application SHALL accept an `authorizerUrl` query parameter on initial load to configure the active authorizer URL.

#### Scenario: Valid query parameter applied
- **WHEN** the application loads with an `authorizerUrl` query parameter containing a valid URL
- **THEN** the instance type SHALL be set to "Own instance"
- **AND** the own authorizer URL SHALL be set to the parameter value
- **AND** the value SHALL be persisted for subsequent sessions
- **AND** the active authorizer URL SHALL use this value for API requests

#### Scenario: Query parameter takes precedence over stored configuration
- **WHEN** a stored instance type or URL exists in localStorage
- **AND** a valid `authorizerUrl` query parameter is present on load
- **THEN** the query parameter value SHALL override the stored configuration

#### Scenario: Invalid or missing query parameter
- **WHEN** the `authorizerUrl` query parameter is missing or invalid
- **THEN** the application SHALL continue using the existing configuration and validation behavior
