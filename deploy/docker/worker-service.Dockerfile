FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* turbo.json ./
COPY packages ./packages
COPY apps/worker-service ./apps/worker-service
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @vpn-hub/worker-service build
CMD ["pnpm", "--filter", "@vpn-hub/worker-service", "start"]
