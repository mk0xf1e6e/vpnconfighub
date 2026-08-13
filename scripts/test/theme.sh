#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command pnpm

cd "$ROOT_DIR"

log_info "Checking Telegram theme integration..."

required_files=(
    "apps/web/src/types/telegram.ts"
    "apps/web/src/components/telegram/telegram-provider.tsx"
    "apps/web/src/app/globals.css"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$ROOT_DIR/$file" ]]; then
        log_error "Missing theme file: $file"
        exit 1
    fi
done

log_info "Building frontend..."
pnpm build:web

required_vars=(
    "bg-color"
    "text-color"
)

for var in "${required_vars[@]}"; do
    log_info "Checking for Telegram CSS variable: --tg-theme-$var"
    grep -q "tg-theme-$var" "$ROOT_DIR/apps/web/src/app/globals.css" || {
        log_error "Missing Telegram CSS variable: --tg-theme-$var"
        exit 1
    }
done

log_success "Telegram theme integration checks passed."