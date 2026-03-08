# MRO on the GO (Dark Mode)

A production-style monorepo demo for aircraft maintenance operations.

## Modules
- **Stores Keeper**: stock, issue/return constraints, low-stock visibility
  - Includes first-pass clone from your Power Apps export (`Stores Keeper`) with airline-segmented inventory + Transaction Log model
- **Tool Control**: issue/return tools with accountability
- **Work Orders → Invoice/Billing**: create, progress, close, generate invoice lines
- **Experience Logs**: technician competency and practical exposure tracking
- **Technical Records**: upload scans/photos/docs and link to records
- **Planner/Roster**: overlap-aware resource allocations with Gantt-like timeline
- **Fault-Finding Helper**: discrepancy + attachments => guided troubleshooting workflow with explainability trail saved to work order

## Stack
- Frontend: React + Vite + TypeScript + dark custom CSS
- Backend: Express + TypeScript + Multer
- Persistence: JSON dev database with SQL schema documentation (`docs/schema.sql`)
- Tests: Vitest (critical business rules)

## Quick Start
```bash
cd mro-on-the-go
npm install
npm run seed
npm run dev
```
- Web: http://localhost:5173
- API: http://localhost:4000
- Upload storage: `apps/api/storage/`

## Scripts
- `npm run dev` - run web and api concurrently
- `npm run build` - build all packages
- `npm test` - run backend critical logic tests
- `npm run seed` - reset and seed local demo data

## Stores Keeper API (new)
- `GET /stores/items?airline=BA`
- `POST /stores/items`
- `GET /stores/transactions?airline=BA`
- `POST /stores/transactions` (`IN | OUT | TRANSFER | ADJUSTMENT`)
- `GET /jfk-users`

## Demo Users (local/dev auth skeleton)
Use header `x-role` from UI role selector:
- `manager`
- `planner`
- `storekeeper`
- `technician`

## Key Design Notes
- No live integrations. SMS and AI helper use internal mock providers.
- Fault helper stores generated workflow + reasoning trail into work order history.
- Planner blocks conflicting assignments against same person/tool and overlapping time windows.
- Work order lifecycle guarded by explicit status transition rules.

## Documentation
- `docs/ARCHITECTURE.md`
- `docs/schema.sql`
- `apps/api/README.md`
- `apps/web/README.md`
- `docs/MODULES.md`

## Push to GitHub
If not already authenticated:
```bash
git remote add origin https://github.com/andrew-ibsen/mro-on-the-go.git
git push -u origin main
```
Or use GitHub CLI:
```bash
gh auth login
gh repo create andrew-ibsen/mro-on-the-go --public --source . --push
```

