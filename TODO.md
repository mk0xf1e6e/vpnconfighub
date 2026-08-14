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

- [ ] Backend application business logic
- [ ] Telegram `initData` verification
- [ ] PostgreSQL integration
- [ ] Redis integration
- [ ] User/config/subscription/node APIs
- [ ] Admin frontend/backend
