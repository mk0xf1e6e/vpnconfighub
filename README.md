# VPN Config Hub

Monorepo for Telegram Mini App + VPN node orchestration.

## Stack

- apps/web-app — Vite/React (Telegram Mini App)
- apps/api-server — Fastify + TypeScript
- apps/telegram-bot — grammY
- apps/worker-service — BullMQ + Redis
- apps/admin-panel — Vite/React
- packages/database — Prisma schema (Postgres)
- packages/vpn-adapters — 3X-UI / Marzban / Hiddify drivers
- packages/telegram-sdk — HMAC verify, Stars helpers
- packages/shared-types, ui-components, logger, config

## Boot

```bash
corepack enable
pnpm install
cp .env.example .env  # fill TELEGRAM_BOT_TOKEN + DATABASE_URL
pnpm --filter @vpn-hub/database exec prisma migrate dev
docker compose -f deploy/docker-compose.yml up -d postgres redis
pnpm dev
```

## Deploy

```bash
docker compose -f deploy/docker-compose.yml up --build
```

## Layout

```
vpn-config-hub/
├── apps/
├── packages/
├── deploy/
└── turbo.json
```

→ skipped: TURN/stun config, TON connector, Stripe, payment refunds, admin auth middleware, e2e tests. Add when wiring real providers.
