# VPN Config Hub Deployment

Current deployment: frontend + minimal API health service on one VPS.

## Production Topology

```text
Cloudflare
  vch.milad-karami.ir       -> Nginx -> 127.0.0.1:3000 -> frontend
  vch-api.milad-karami.ir   -> Nginx -> 127.0.0.1:4000 -> api
```

VPS:

```text
Host: 20.240.40.186
Repository: /opt/vpn-config-hub
Public ports: 80, 443
Frontend: 127.0.0.1:3000
API: 127.0.0.1:4000
```

Frontend and API ports are loopback-only. PostgreSQL, Redis, admin services, and VPN integrations are not deployed by the current stack.

## Requirements

Ubuntu host with:

- Docker Engine
- `docker-compose` or Docker Compose plugin
- Nginx
- Git
- SSH access as a deployment user

Ubuntu package fallback used on the current host:

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose nginx git
```

Prefer the current Docker Compose plugin on new servers. If using the legacy command, replace `docker compose` with `docker-compose` below.

## Cloudflare DNS

Create proxied orange-cloud DNS records pointing to the VPS:

```text
A  vch      20.240.40.186   Proxied
A  vch-api  20.240.40.186   Proxied
```

Use Cloudflare SSL/TLS mode `Full (strict)`. The origin needs valid certificates for both hostnames.

## Checkout

```bash
sudo mkdir -p /opt/vpn-config-hub
sudo chown "$USER":"$USER" /opt/vpn-config-hub
git clone https://github.com/mk0xf1e6e/vpnconfighub.git /opt/vpn-config-hub
cd /opt/vpn-config-hub
```

For an existing checkout:

```bash
cd /opt/vpn-config-hub
```

Never put secrets in the repository.

## Environment

Create `/opt/vpn-config-hub/.env` with mode `600`:

```env
NEXT_PUBLIC_APP_URL=https://vch.milad-karami.ir
NEXT_PUBLIC_API_URL=https://vch-api.milad-karami.ir
NEXT_PUBLIC_TELEGRAM_APP_URL=
```

`NEXT_PUBLIC_*` values are browser-visible. Never put bot tokens, passwords, private keys, or database credentials in them.

## Build And Start

From the repository root:

```bash
docker-compose -f deploy/compose.frontend.yml build api frontend
```

Compose services:

- `api`: Go health API, internal `127.0.0.1:4000`
- `frontend`: Next.js standalone app, internal `127.0.0.1:3000`
- shared Docker network: `vpnhub`

Check status and logs:

```bash
docker-compose -f deploy/compose.frontend.yml ps
```

Expected state: both services `Up (healthy)`.

## Nginx

Host Nginx is the public entrypoint. Install the site files:

```bash
sudo cp deploy/nginx/frontend.conf /etc/nginx/sites-available/vch.milad-karami.ir
sudo cp deploy/nginx/api.conf /etc/nginx/sites-available/vch-api.milad-karami.ir
sudo ln -sf /etc/nginx/sites-available/vch.milad-karami.ir /etc/nginx/sites-enabled/vch.milad-karami.ir
sudo ln -sf /etc/nginx/sites-available/vch-api.milad-karami.ir /etc/nginx/sites-enabled/vch-api.milad-karami.ir
sudo nginx -t
sudo systemctl reload nginx
```

The checked-in Nginx files describe HTTP proxying. Enable HTTPS certificates after DNS resolves:

```bash
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect -d vch.milad-karami.ir
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect -d vch-api.milad-karami.ir
sudo nginx -t
sudo systemctl reload nginx
```

Back up Nginx configuration before edits:

```bash
sudo cp -a /etc/nginx /root/nginx-backup-$(date +%Y%m%d%H%M%S)
```

Do not place backup files inside `/etc/nginx/sites-enabled`; Nginx loads them as configuration.

## Verification

Local VPS checks:

```bash
curl -fsS http://127.0.0.1:3000/
ss -lntp | grep -E ':(80|443|3000|4000)'
sudo nginx -t
sudo systemctl is-active nginx
```

Only Nginx should listen publicly. Frontend/API should show `127.0.0.1`, not `0.0.0.0`.

Public checks:

```bash
curl -fsSI https://vch.milad-karami.ir/
```

Expected:

```text
Frontend: HTTP 200
API: {"status":"ok"}
```

If the frontend displays only `Loading Telegram`, inspect browser Network requests. Every `/_next/static/...` asset must return `200`. The standalone Docker image must copy static files to `/app/apps/web/.next/static` and start `node apps/web/server.js`.

## Automatic Deployment

Workflow: `.github/workflows/deploy.yml`.

Push to `main` triggers:

1. Frontend lint, TypeScript check, and build.
2. Go API tests and build.
3. SSH deployment to `/opt/vpn-config-hub`.
4. API/frontend Docker rebuild.
5. API/frontend restart.
6. Local health checks.
7. Public frontend check.

Configure GitHub repository secrets:

```text
VPS_HOST=20.240.40.186
VPS_USER=<ssh deployment user>
VPS_SSH_KEY=<private key matching the VPS authorized key>
```

Recommended: create a dedicated non-root `deploy` user with Docker access. Root was used for the initial setup only.

Trigger manually from GitHub Actions with `workflow_dispatch`, or push to `main`.

Confirm deployment:

```bash
ssh deploy@20.240.40.186 'git -C /opt/vpn-config-hub log -1 --oneline'
ssh deploy@20.240.40.186 'docker-compose -f /opt/vpn-config-hub/deploy/compose.frontend.yml ps'
```

The VPS revision must match the GitHub `main` commit. A green workflow alone is insufficient; verify the public URLs.

## Rollback

```bash
cd /opt/vpn-config-hub
```

Then rerun all local and public verification commands.

## Current Limitations

- API currently exposes only `/health` for production smoke testing.
- Telegram backend authentication is not part of this deployment milestone.
- No PostgreSQL or Redis service is deployed.
- No admin frontend or admin backend is deployed.
- `NEXT_PUBLIC_TELEGRAM_APP_URL` must be filled with the real Telegram Mini App launch URL before using the browser launch button.
