FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* turbo.json ./
COPY packages ./packages
COPY apps/api-server ./apps/api-server
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @vpn-hub/api-server build
EXPOSE 3001
CMD ["pnpm", "--filter", "@vpn-hub/api-server", "start"]
