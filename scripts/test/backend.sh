#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

require_command go

cd "$ROOT_DIR/services/api"

log_info "Checking Go formatting..."

if [[ -n "$(gofmt -l .)" ]]; then
    log_error "Go files are not formatted."
    gofmt -l .
    exit 1
fi

log_info "Running Go vet..."
go vet ./...

log_info "Building Go API..."
go build ./...

log_info "Running Go tests..."
go test ./...

log_success "Backend checks passed."
