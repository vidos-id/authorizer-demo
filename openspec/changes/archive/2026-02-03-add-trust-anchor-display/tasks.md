## 1. Implementation

- [x] 1.1 Create `TrustAnchorConfig.tsx` component with self-contained state (expanded/collapsed)
- [x] 1.2 Add React Query hook (`useQuery`) for fetching trust anchor from `/instances/oid4vp-trust-anchor`
- [x] 1.3 Implement lazy loading via `enabled` option (fetch only when expanded AND URL is valid)
- [x] 1.4 Handle invalid/empty authorizer URL state with appropriate error message
- [x] 1.5 Display anchor type badge (root/account/instance)
- [x] 1.6 Implement PEM certificate display in read-only textarea with monospace font
- [x] 1.7 Add copy-to-clipboard action with visual feedback (2s timeout)
- [x] 1.8 Add download action (filename: `vidos-{anchor-type}.pem`)
- [x] 1.9 Add refresh action button using `refetch` from React Query
- [x] 1.10 Add descriptive help text explaining trust anchor purpose and EUDI wallet requirement
- [x] 1.11 Integrate component into CreateStage below AppConfiguration
- [x] 1.12 Handle loading, error states with detailed error messages

## 2. Validation

- [x] 2.1 Run `bun run type-check` - no type errors
- [x] 2.2 Run `bun run lint` - no new lint issues
- [x] 2.3 Run `bun run format` - format code
- [x] 2.4 Run `bun run build` - build succeeds
