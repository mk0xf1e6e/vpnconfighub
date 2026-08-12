#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command node

cd "$ROOT_DIR"

log_info "Installing/checking frontend dependencies..."
pnpm install

log_info "Running frontend lint..."
pnpm --filter web lint

log_info "Building frontend..."
pnpm --filter web build

log_success "Frontend checks passed."
