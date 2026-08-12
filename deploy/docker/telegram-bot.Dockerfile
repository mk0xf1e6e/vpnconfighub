FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* turbo.json ./
COPY packages ./packages
COPY apps/telegram-bot ./apps/telegram-bot
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @vpn-hub/telegram-bot build
CMD ["pnpm", "--filter", "@vpn-hub/telegram-bot", "start"]
