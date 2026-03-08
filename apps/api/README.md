# API Module

Express API providing all operational domains with local JSON persistence.

## Core Endpoints
- `GET /dashboard`
- `POST /inventory/:id/issue|return`
- `POST /tools/:id/issue|return`
- `POST /work-orders`
- `PATCH /work-orders/:id/status`
- `POST /work-orders/:id/invoice`
- `POST /allocations`
- `POST /work-orders/:id/fault-helper` (multipart upload)
- `POST /technical-records` (multipart upload)

## Auth Skeleton
Role is accepted via `x-role` header (dev mode).
