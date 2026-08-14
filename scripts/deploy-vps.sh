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
old_frontend=$(docker-compose -f "$compose_file" ps -q frontend || true)
old_api=$(docker-compose -f "$compose_file" ps -q api || true)
if [ -n "$old_frontend" ]; then docker rm -f "$old_frontend"; fi
if [ -n "$old_api" ]; then docker rm -f "$old_api"; fi
docker-compose -f "$compose_file" up -d api
docker-compose -f "$compose_file" up -d --no-deps frontend
deadline=$(( $(date +%s) + health_timeout ))
until [ "$(date +%s)" -ge "$deadline" ]; do
  api_id=$(docker-compose -f "$compose_file" ps -q api || true)
  frontend_id=$(docker-compose -f "$compose_file" ps -q frontend || true)
  api=$(docker inspect -f '{{.State.Health.Status}}' "$api_id" 2>/dev/null || true)
  frontend=$(docker inspect -f '{{.State.Health.Status}}' "$frontend_id" 2>/dev/null || true)
  if [ "$api" = healthy ] && [ "$frontend" = healthy ]; then break; fi
  sleep 5
done
api_id=$(docker-compose -f "$compose_file" ps -q api)
frontend_id=$(docker-compose -f "$compose_file" ps -q frontend)
api=$(docker inspect -f '{{.State.Health.Status}}' "$api_id")
frontend=$(docker inspect -f '{{.State.Health.Status}}' "$frontend_id")
[ "$api" = healthy ]
[ "$frontend" = healthy ]
curl -fsS http://127.0.0.1:4000/health >/dev/null
curl -fsS http://127.0.0.1:4000/api/demo/dashboard >/dev/null
curl -fsS http://127.0.0.1:4000/api/demo/catalog >/dev/null
curl -fsS http://127.0.0.1:3000/ >/dev/null
nginx -t
systemctl is-active --quiet nginx
printf 'DEPLOYED_AT=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf 'COMMIT=%s\n' "$(git rev-parse HEAD)"
printf 'API=%s\nFRONTEND=%s\n' "$api" "$frontend"
REMOTE

echo "Public checks"
frontend_headers="$(mktemp)"
api_headers="$(mktemp)"
trap 'rm -f "$frontend_headers" "$api_headers"' EXIT
curl -sS --retry 3 --retry-delay 2 -D "$frontend_headers" -o /dev/null https://vch.milad-karami.ir/ || true
curl -sS --retry 3 --retry-delay 2 -D "$api_headers" -o /dev/null https://vch-api.milad-karami.ir/api/plans || true
for pair in "Frontend:$frontend_headers" "API:$api_headers"; do
  name="${pair%%:*}"; file="${pair#*:}"
  if grep -q 'cf-mitigated: challenge' "$file"; then
    echo "$name public check blocked by Cloudflare Managed Challenge; origin checks passed."
  elif ! grep -qE '^HTTP/.* 2' "$file"; then
    echo "$name public check failed:"; cat "$file"; exit 1
  fi
done
api_response="$(curl -fsS --retry 3 --retry-delay 2 https://vch-api.milad-karami.ir/health)"
printf 'API response: %s\n' "$api_response"
curl -fsS --retry 3 --retry-delay 2 https://vch-api.milad-karami.ir/api/plans >/dev/null || echo "API plans public body blocked by Cloudflare; verify from a browser after challenge clearance."
echo "Deployment successful."
