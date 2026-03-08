# Architecture

## Monorepo Layout
- `apps/web`: React UI
- `apps/api`: Express API + business logic + tests + local uploads
- `packages/shared`: common domain types
- `docs`: architecture/schema/modules
- `scripts`: demo scripts

## Runtime Flow
1. User loads dashboard (web -> api `/dashboard`)
2. Domain operations call dedicated API routes
3. API executes business rules in `src/logic/*`
4. Data persists to `apps/api/data/dev-db.json`
5. Uploads saved under `apps/api/storage/` and served via `/files/*`
6. Fault helper runs mock AI inference + explainability trail stored on work order history

## Security Model (dev skeleton)
- Header-driven role context (`x-role`)
- Intended upgrade path: JWT, scoped permissions, audit trail hardening
