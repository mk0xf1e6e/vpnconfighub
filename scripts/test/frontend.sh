#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command pnpm

cd "$ROOT_DIR"

log_info "Checking frontend dependencies..."
pnpm install --frozen-lockfile

log_info "Running frontend lint..."
pnpm lint:web

log_info "Building frontend..."
pnpm build:web

log_success "Frontend checks passed."
