# authorization-stage Specification

## Purpose

This specification defines the authorization stage of the OID4VP credential verification flow, which handles the presentation and execution of authorization requests. The stage provides different UI experiences based on the response mode (direct_post vs dc_api) and manages the transition to the result stage upon completion.
## Requirements
### Requirement: QR Code Display for Direct Post Modes

The application SHALL display a QR code containing the authorization URL when using direct_post or direct_post.jwt response modes.

#### Scenario: QR code rendered for direct_post mode

- **WHEN** an authorization is created with `direct_post` response mode
- **THEN** a QR code SHALL be displayed containing the `authorizeUrl` from the API response
- **AND** the QR code SHALL be prominently displayed and scannable by wallet applications

#### Scenario: QR code rendered for direct_post.jwt mode

- **WHEN** an authorization is created with `direct_post.jwt` response mode
- **THEN** a QR code SHALL be displayed containing the `authorizeUrl` from the API response
- **AND** the QR code SHALL be prominently displayed and scannable by wallet applications

#### Scenario: No QR code for dc_api modes

- **WHEN** an authorization is created with `dc_api` or `dc_api.jwt` response mode
- **THEN** no QR code SHALL be displayed
- **AND** the DC API trigger UI SHALL be shown instead

### Requirement: Authorization URL Link for Same-Device Flow

The application SHALL provide a clickable authorization URL link for same-device authorization flows when using direct_post modes.

#### Scenario: Clickable URL displayed below QR code

- **WHEN** an authorization is created with `direct_post` or `direct_post.jwt` response mode
- **THEN** a clickable text link SHALL be displayed below the QR code
- **AND** the link SHALL use the `authorizeUrl` from the API response
- **AND** clicking the link SHALL open the wallet app directly on mobile devices

#### Scenario: URL link opens in new context

- **WHEN** a user clicks the authorization URL link
- **THEN** the link SHALL open in a way that allows wallet app invocation
- **AND** the current application context SHALL remain open for status polling

### Requirement: Status Polling for Direct Post Modes

The application SHALL poll the authorization status endpoint when using direct_post or direct_post.jwt response modes.

#### Scenario: Polling initiated on authorization stage entry

- **WHEN** the authorization stage is entered with direct_post mode
- **THEN** the application SHALL begin polling `/authorizations/{authorizationId}/status`
- **AND** polling SHALL occur every 2-3 seconds

#### Scenario: Polling continues until terminal status

- **WHEN** status polling is active
- **THEN** the application SHALL continue polling while status is `created` or `pending`
- **AND** polling SHALL stop when status becomes `authorized`, `rejected`, `error`, or `expired`

#### Scenario: Terminal status triggers stage transition

- **WHEN** a polled status returns `authorized`, `rejected`, `error`, or `expired`
- **THEN** polling SHALL stop
- **AND** the application SHALL transition to the result stage

#### Scenario: No polling for dc_api modes

- **WHEN** an authorization is created with `dc_api` or `dc_api.jwt` response mode
- **THEN** no status polling SHALL occur
- **AND** the dc_api endpoint response SHALL provide the final status directly

### Requirement: DC API Invocation for Browser-Based Flows

The application SHALL provide a trigger mechanism for invoking the browser's Digital Credentials API when using dc_api or dc_api.jwt response modes.

#### Scenario: Description text explains DC API flow

- **WHEN** an authorization is created with `dc_api` or `dc_api.jwt` response mode
- **THEN** descriptive text SHALL be displayed explaining that the browser's Digital Credentials API will be invoked
- **AND** the text SHALL guide the user to click the trigger button

#### Scenario: Trigger button initiates DC API call

- **WHEN** a user clicks the DC API trigger button
- **THEN** the application SHALL invoke `navigator.credentials.get()` with the `digitalCredentialGetRequest` from the API response
- **AND** the browser SHALL prompt the user for credential selection

#### Scenario: DC API response submitted to authorizer

- **WHEN** the browser's DC API returns a credential response
- **THEN** the application SHALL submit the response to the appropriate dc_api endpoint (`/openid4/vp/v1_0/{authorizationId}/dc_api` or `dc_api.jwt`)
- **AND** the request body SHALL include `origin` and `digitalCredentialGetResponse` fields

#### Scenario: DC API endpoint returns final status

- **WHEN** the application submits the credential response to the dc_api endpoint
- **THEN** the endpoint response SHALL contain the final authorization status
- **AND** the application SHALL transition to the result stage with the returned status

#### Scenario: DC API invocation error handling

- **WHEN** `navigator.credentials.get()` throws an error or is rejected
- **THEN** the application SHALL display an appropriate error message
- **AND** the user SHALL have the option to retry or start over

### Requirement: Status Transition to Result Stage

The application SHALL transition to the result stage when a terminal authorization status is reached.

#### Scenario: Transition on authorized status

- **WHEN** the authorization status becomes `authorized`
- **THEN** the application SHALL navigate to the result stage
- **AND** the result stage SHALL fetch and display policy evaluation results

#### Scenario: Transition on rejected status

- **WHEN** the authorization status becomes `rejected`
- **THEN** the application SHALL navigate to the result stage
- **AND** the result stage SHALL display rejection information

#### Scenario: Transition on error status

- **WHEN** the authorization status becomes `error`
- **THEN** the application SHALL navigate to the result stage
- **AND** the result stage SHALL display error details

#### Scenario: Transition on expired status

- **WHEN** the authorization status becomes `expired`
- **THEN** the application SHALL navigate to the result stage
- **AND** the result stage SHALL display expiration information and prompt to start over

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

