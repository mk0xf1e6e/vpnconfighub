#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command node
require_command npm

cd "$ROOT_DIR/apps/web"

log_info "Installing/checking frontend dependencies..."
npm install --no-workspaces

log_info "Running frontend lint..."
npm run lint

log_info "Building frontend..."
npm run build

log_success "Frontend checks passed."