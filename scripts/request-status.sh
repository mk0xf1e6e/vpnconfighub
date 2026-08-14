#!/usr/bin/env bash
set -Eeuo pipefail

VPS_HOST="${VPS_HOST:-20.240.40.186}"
VPS_USER="${VPS_USER:-root}"
LINES="${LINES:-50}"
MODE="${1:-recent}"

case "$MODE" in
  recent)
    ssh -o BatchMode=yes -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "
      echo '=== FRONTEND REQUESTS ==='
      if [ -f /var/log/nginx/access.log ]; then tail -n '$LINES' /var/log/nginx/access.log; else echo 'No global access log'; fi
      echo
      echo '=== API REQUESTS ==='
      if [ -f /var/log/nginx/vch-api.access.log ]; then tail -n '$LINES' /var/log/nginx/vch-api.access.log; else echo 'No API access log'; fi
      echo
      echo '=== RECENT NGINX ERRORS ==='
      if [ -f /var/log/nginx/error.log ]; then tail -n '$LINES' /var/log/nginx/error.log; else echo 'No error log'; fi
    "
    ;;
  follow)
    ssh -t -o BatchMode=yes -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "tail -Fn0 /var/log/nginx/access.log /var/log/nginx/error.log"
    ;;
  *)
    echo "Usage: $0 [recent|follow]"
    exit 2
    ;;
esac
