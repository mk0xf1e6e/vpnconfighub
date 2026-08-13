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

## Frontend Deployment

- [x] Standalone Next.js output
- [x] Frontend Dockerfile
- [x] Frontend Docker ignore rules
- [x] Internal `vpnhub` Compose network
- [x] No public frontend application port
- [x] CI lint/typecheck/build
- [x] CI Docker build
- [ ] Nginx HTTPS routing
- [ ] Cloudflare origin configuration
- [ ] VPS deployment workflow

Current milestone: frontend container and CI are deployment-ready. Nginx, Cloudflare, VPS, admin, and backend deployment remain deferred until those services exist.

## Deferred Backend

- [ ] Backend application business logic
- [ ] Telegram `initData` verification
- [ ] PostgreSQL integration
- [ ] Redis integration
- [ ] User/config/subscription/node APIs
- [ ] Admin frontend/backend
