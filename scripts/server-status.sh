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
if curl -fsSI --max-time 15 https://vch.milad-karami.ir/ >/dev/null; then
  echo "Frontend: OK (https://vch.milad-karami.ir)"
else
  echo "Frontend: FAIL"
fi
if api_response="$(curl -fsS --max-time 15 https://vch-api.milad-karami.ir/health 2>/dev/null)"; then
  echo "API: OK ($api_response)"
else
  echo "API: FAIL"
fi
