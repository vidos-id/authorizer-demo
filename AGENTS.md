# AGENTS.md

Vidos Authorizer Demo: React+TS+Vite app for OID4VP credential verification flows.

Package manager: Bun (`bun install`).

Non-standard commands:

- `bun run type-check` - TS check (no emit)
- `bun run lint` - Biome lint. Respect the errors and warnings, no new issues should be coming from your changes.
- `bun run format` - Biome format+fix. Run after finishing your changes.
- `bun run build` - type-check + prod build
- `bun run generate-api:local` - regenerate `src/api/authorizer.ts` from OpenAPI with local `authorizer.service.yaml`
- `bun run generate-api:prod` - regenerate `src/api/authorizer.ts` from OpenAPI with remote prod OpenAPI spec

## API Types

- **Reuse generated API types** from `src/api/authorizer.ts` via `src/types/api.ts` - do not manually redefine types that exist in the OpenAPI spec
- Use type extraction patterns like `Extract<>`, indexed access, and `NonNullable<>` to derive specific types from the generated unions
- When the API returns union types, create type guards for safe narrowing instead of type assertions

More guidance:

- [Plan mode](docs/agents/plan-mode.md)
- [Commands](docs/agents/commands.md)
- [Architecture](docs/agents/architecture.md)
- [Key files](docs/agents/key-files.md)
- [Critical notes](docs/agents/critical-notes.md)
- [References](docs/agents/references.md)
