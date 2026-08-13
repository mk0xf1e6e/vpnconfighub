#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command pnpm

cd "$ROOT_DIR"

log_info "Building Telegram Mini App..."

pnpm build:web

log_info "Checking Telegram integration files..."

required_files=(
    "apps/web/src/types/telegram.ts"
    "apps/web/src/components/telegram/telegram-provider.tsx"
    "apps/web/src/components/telegram/use-telegram.ts"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$ROOT_DIR/$file" ]]; then
        log_error "Missing Telegram integration file: $file"
        exit 1
    fi
done

log_success "Telegram integration checks passed."
