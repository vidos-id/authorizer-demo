## 1. API Integration
- [x] 1.1 Add `jwt` query key to `src/queries/keys.ts`
- [x] 1.2 Create `useAuthorizationJwtQuery.ts` hook (lazy query, only fetches when `enabled: true`)

## 2. UI Components
- [x] 2.1 Create `AuthorizationRequestJwtViewer` component with collapsible header (collapsed by default)
- [x] 2.2 Add "Show JWT" button that triggers fetch on first click
- [x] 2.3 Display raw JWT string in scrollable container with copy button
- [x] 2.4 Add "View on jwt.io" external link (opens `https://jwt.io/#debugger-io?token={jwt}`)

## 3. Integration
- [x] 3.1 Add `AuthorizationRequestJwtViewer` to AuthorizationStage below/near "Created Authorization Request Response"
- [x] 3.2 Only render for direct_post and direct_post.jwt response modes (NOT dc_api modes)
- [x] 3.3 Ensure loading/error states are handled

## 4. Validation
- [x] 4.1 Run `bun run type-check` and fix any type errors
- [x] 4.2 Run `bun run lint` and fix any lint issues
- [x] 4.3 Run `bun run build` and confirm successful build
