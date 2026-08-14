#!/usr/bin/env bash
set -Eeuo pipefail

VPS_HOST="${VPS_HOST:-20.240.40.186}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/vpn-config-hub}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/compose.frontend.yml}"

ssh -o BatchMode=yes -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "set -Eeuo pipefail
  echo '=== SERVER ==='
  echo \"Checked at: \$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  echo \"Host: \$(hostname)\"
  echo \"Uptime: \$(uptime -p)\"
  echo
  echo '=== DEPLOYMENT ==='
  echo 'Path: $DEPLOY_PATH'
  echo \"Commit: \$(git -C '$DEPLOY_PATH' log -1 --format='%H %s')\"
  echo \"Commit time: \$(git -C '$DEPLOY_PATH' log -1 --format='%cI')\"
  echo 'Checkout status:'
  git -C '$DEPLOY_PATH' status --short --branch
  echo
  echo '=== CONTAINERS ==='
  docker-compose -f '$DEPLOY_PATH/$COMPOSE_FILE' ps
  for name in deploy_api_1 deploy_frontend_1; do
    if docker inspect \"\$name\" >/dev/null 2>&1; then
      docker inspect \"\$name\" --format='{{.Name}} status={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} started={{.State.StartedAt}}'
    fi
  done
  echo
  echo '=== SERVICES ==='
  echo \"Nginx: \$(systemctl is-active nginx || true)\"
  nginx -t 2>&1 | tail -2
  echo
  echo '=== PORTS ==='
  ss -lntp | grep -E ':(80|443|3000|4000)\\b' || true
  echo
  echo '=== LOCAL HEALTH ==='
  if curl -fsS http://127.0.0.1:3000/ >/dev/null; then echo 'Frontend: OK'; else echo 'Frontend: FAIL'; fi
  if curl -fsS http://127.0.0.1:4000/health; then echo; echo 'API: OK'; else echo 'API: FAIL'; fi
"

echo
echo "=== PUBLIC HEALTH ==="
frontend_headers="$(mktemp)"
api_headers="$(mktemp)"
trap 'rm -f "$frontend_headers" "$api_headers"' EXIT

curl -sS --max-time 15 -D "$frontend_headers" -o /dev/null https://vch.milad-karami.ir/ || true
if grep -q '^HTTP/.* 2' "$frontend_headers"; then
  echo "Frontend: OK (https://vch.milad-karami.ir)"
elif grep -qi '^cf-mitigated: challenge' "$frontend_headers"; then
  echo "Frontend: CLOUDFLARE CHALLENGE (origin health passed)"
else
  echo "Frontend: FAIL"
fi
curl -sS --max-time 15 -D "$api_headers" -o /tmp/vch-api-public-health https://vch-api.milad-karami.ir/health || true
if grep -q '^HTTP/.* 2' "$api_headers"; then
  api_response="$(cat /tmp/vch-api-public-health)"
  echo "API: OK ($api_response)"
elif grep -qi '^cf-mitigated: challenge' "$api_headers"; then
  echo "API: CLOUDFLARE CHALLENGE (origin health passed)"
else
  echo "API: FAIL"
fi
rm -f /tmp/vch-api-public-health
