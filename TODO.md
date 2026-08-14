# VPN Config Hub TODO

## Telegram Mini App Frontend

- [x] Telegram-style dark UI
- [x] Dashboard structure
- [x] Bottom navigation
- [x] Telegram WebApp detection
- [x] Display local Telegram user data
- [x] Handle browser entry state
- [x] Remove fake production identity data
- [x] Frontend-only preview states
- [ ] Complete responsive/mobile audit
- [ ] Add frontend component tests

## Product Catalog And Builder

- [x] Separate MTProto, SOCKS5, HTTP/HTTPS, and V2Ray/Xray families
- [x] Shared 2/5/10/25/50/100 GB and Unlimited quota ladder
- [x] Selectable 10/25/50/100/250 Mbps and Uncapped speed
- [x] Selectable 1/2/3/5/10 device limits
- [x] Selectable 7/30/90/365 day durations
- [x] V2Ray/Xray protocol choices
- [x] Frontend entitlement builder
- [x] Honest unavailable pricing/provisioning states
- [x] Reusable usage empty state
- [ ] Approved commercial price table
- [ ] Payment integration
- [ ] Backend provisioning and usage enforcement

## Demo Dashboard/API

- [x] Deterministic `/api/demo/dashboard` endpoint
- [x] Deterministic `/api/demo/usage` endpoint
- [x] Deterministic `/api/demo/catalog` endpoint
- [x] Home dashboard fetches demo usage/subscription data
- [x] Usage graph and daily usage rows
- [x] Store fetches catalog availability/protocols/pricing
- [x] Demo data labels and honest empty states
- [x] Product cards expand/collapse with scoped entitlements
- [x] Fixed empty 48px safe-area top bar
- [ ] Replace demo endpoints with authenticated backend endpoints
- [x] Demo API tests and frontend integration verified
- [x] Demo dashboard deployed to VPS
- [x] Demo catalog deployed to VPS
- [x] Local Swagger/OpenAPI routes
- [x] Local API smoke checks
- [ ] Real authenticated usage/catalog backend

## Generic Plans API

- [x] Generic Go plan/entitlement models
- [x] Nullable limits with explicit unlimited flags
- [x] Availability status and purchasable flag
- [x] `GET /api/plans`
- [x] Swagger/OpenAPI `/api/plans` documentation
- [x] API schema/method/unlimited tests
- [x] Typed frontend `getPlans()` client
- [x] Store availability loaded from plans API
- [x] Local API plans/Swagger smoke checks
- [x] Frontend renders API entitlement limits
- [x] Unavailable plan review action disabled
- [ ] Persist plans and prices in PostgreSQL
- [ ] Add admin plan management
- [ ] Add real payment/provisioning enforcement

## Frontend Deployment

- [x] Standalone Next.js output
- [x] Frontend Dockerfile
- [x] Frontend Docker ignore rules
- [x] Internal `vpnhub` Compose network
- [x] No public frontend application port
- [x] CI lint/typecheck/build
- [x] CI Docker build
- [x] Frontend-only production Compose stack
- [x] Nginx frontend reverse proxy configuration
- [ ] Nginx HTTPS routing
- [x] Cloudflare origin configuration
- [x] VPS frontend deployment
- [x] VPS deployment workflow
- [x] `vch.milad-karami.ir` public HTTPS verification
- [x] Next standalone static assets served correctly
- [x] Frontend container health verified
- [ ] API health service deployed
- [x] API health service deployed
- [x] `vch-api.milad-karami.ir` Cloudflare DNS record
- [x] API HTTPS and public health verification
- [x] GitHub Actions frontend deployment workflow

Current milestone: frontend container and CI are deployment-ready. Nginx, Cloudflare, VPS, admin, and backend deployment remain deferred until those services exist.

## Deferred Backend

## Demo API And Dashboard

- [x] Deterministic labeled demo dashboard, usage, and catalog endpoints
- [x] Typed frontend API client with loading/error handling
- [x] Home dashboard subscription, quota data, graph, and daily usage
- [x] Store catalog loading and reversible scoped accordion cards
- [x] Empty configuration and node states remain honest
- [x] Deployment build-before-replace flow and demo endpoint checks
- [ ] Replace demo data with authenticated account, usage, pricing, and provisioning APIs

- [ ] Backend application business logic
- [ ] Telegram `initData` verification
- [ ] PostgreSQL integration
- [ ] Redis integration
- [ ] User/config/subscription/node APIs
- [ ] Admin frontend/backend
