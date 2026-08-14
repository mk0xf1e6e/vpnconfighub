#!/usr/bin/env bash
set -Eeuo pipefail

VPS_HOST="${VPS_HOST:-20.240.40.186}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/vpn-config-hub}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/compose.frontend.yml}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"

remote() {
  ssh -o BatchMode=yes -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "$@"
}

echo "Deploy target: $VPS_USER@$VPS_HOST:$DEPLOY_PATH"

ssh -o BatchMode=yes -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" bash -s -- "$DEPLOY_PATH" "$COMPOSE_FILE" "$HEALTH_TIMEOUT" <<'REMOTE'
set -Eeuo pipefail
deploy_path="$1"
compose_file="$2"
health_timeout="$3"
test -d "$deploy_path/.git"
git -C "$deploy_path" fetch origin main
git -C "$deploy_path" reset --hard origin/main
cd "$deploy_path"
docker-compose -f "$compose_file" config >/dev/null
docker-compose -f "$compose_file" build api frontend
docker-compose -f "$compose_file" up -d api frontend
deadline=$(( $(date +%s) + health_timeout ))
until [ "$(date +%s)" -ge "$deadline" ]; do
  api=$(docker inspect -f '{{.State.Health.Status}}' deploy_api_1 2>/dev/null || true)
  frontend=$(docker inspect -f '{{.State.Health.Status}}' deploy_frontend_1 2>/dev/null || true)
  if [ "$api" = healthy ] && [ "$frontend" = healthy ]; then break; fi
  sleep 5
done
api=$(docker inspect -f '{{.State.Health.Status}}' deploy_api_1)
frontend=$(docker inspect -f '{{.State.Health.Status}}' deploy_frontend_1)
[ "$api" = healthy ]
[ "$frontend" = healthy ]
curl -fsS http://127.0.0.1:4000/health >/dev/null
curl -fsS http://127.0.0.1:3000/ >/dev/null
nginx -t
systemctl is-active --quiet nginx
printf 'DEPLOYED_AT=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf 'COMMIT=%s\n' "$(git rev-parse HEAD)"
printf 'API=%s\nFRONTEND=%s\n' "$api" "$frontend"
REMOTE

echo "Public checks"
curl -fsS --retry 3 --retry-delay 2 https://vch.milad-karami.ir/ >/dev/null
api_response="$(curl -fsS --retry 3 --retry-delay 2 https://vch-api.milad-karami.ir/health)"
printf 'API response: %s\n' "$api_response"
echo "Deployment successful."
