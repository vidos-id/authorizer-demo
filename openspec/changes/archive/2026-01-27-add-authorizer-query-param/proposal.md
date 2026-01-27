# Change: Add authorizer URL query parameter override

## Why
Enable deep links from the Vidos Dashboard instance page so the demo opens preconfigured for the selected Authorizer instance.

## What Changes
- Parse an `authorizerUrl` query parameter on initial load and apply it as the active authorizer URL when valid.
- Force instance type to "Own instance" when the query parameter is applied and persist the value for the session.
- Treat the query parameter as higher priority than any stored configuration; ignore it when invalid or missing.

## Impact
- Affected specs: `authorizer-config`
- Affected code: `src/stores/appStore/`, `src/utils/`, `src/components/stages/CreateStage/`
