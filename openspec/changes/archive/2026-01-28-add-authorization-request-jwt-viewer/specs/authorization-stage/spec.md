## ADDED Requirements

### Requirement: Authorization Request JWT Viewer

The application SHALL provide an optional JWT viewer in the authorization stage that allows users to inspect the raw authorization request JWT when using direct_post or direct_post.jwt response modes.

#### Scenario: JWT viewer available for direct_post modes only

- **WHEN** the authorization stage is displayed with `direct_post` or `direct_post.jwt` response mode
- **THEN** the JWT viewer section SHALL be available
- **AND** the section SHALL be collapsed/hidden by default
- **AND** no API request to fetch the JWT SHALL be made until user interaction

#### Scenario: JWT viewer not available for dc_api modes

- **WHEN** the authorization stage is displayed with `dc_api` or `dc_api.jwt` response mode
- **THEN** the JWT viewer section SHALL NOT be displayed

#### Scenario: User triggers JWT fetch

- **WHEN** a user clicks to expand/show the JWT viewer
- **THEN** the application SHALL fetch the JWT from `/openid4/vp/v1_0/authorizations/{authorizationId}/jwt`
- **AND** a loading indicator SHALL be displayed while fetching

#### Scenario: JWT displayed after fetch

- **WHEN** the JWT is successfully fetched
- **THEN** the raw JWT string SHALL be displayed in a scrollable container
- **AND** a copy-to-clipboard button SHALL be provided
- **AND** a "View on jwt.io" link SHALL be provided

#### Scenario: JWT.io link format

- **WHEN** a user clicks the "View on jwt.io" link
- **THEN** the link SHALL open `https://jwt.io/#token={jwt}` in a new tab
- **AND** the `{jwt}` parameter SHALL be the URL-encoded JWT string

#### Scenario: JWT viewer proximity to response

- **WHEN** the authorization stage layout is rendered with direct_post modes
- **THEN** the JWT viewer SHALL be positioned near the "Created Authorization Request Response" section
- **AND** both sections SHALL be grouped visually as related debugging information

#### Scenario: JWT fetch error handling

- **WHEN** the JWT fetch fails
- **THEN** an error message SHALL be displayed within the JWT viewer section
- **AND** the user SHALL be able to retry the fetch
