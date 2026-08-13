#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

source "$ROOT_DIR/scripts/lib/common.sh"

log_info "Checking project structure..."

required_dirs=(
    "apps/web"
    "services/api"
    "services/bot"
    "services/worker"
    "db/migrations"
    "db/queries"
    "scripts/dev"
    "scripts/test"
    "scripts/db"
    "scripts/docker"
    "scripts/git"
    "scripts/deploy"
    "scripts/lib"
    "deploy"
    "docs"
    "tests"
)

for dir in "${required_dirs[@]}"; do
    if [[ ! -d "$ROOT_DIR/$dir" ]]; then
        log_error "Missing directory: $dir"
        exit 1
    fi
done

required_files=(
    ".env.example"
    ".gitignore"
    "Makefile"
    "README.md"
    "docker-compose.yml"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$ROOT_DIR/$file" ]]; then
        log_error "Missing file: $file"
        exit 1
    fi
done

log_success "Project structure is valid."

"$ROOT_DIR/scripts/test/backend.sh"
"$ROOT_DIR/scripts/test/frontend.sh"
"$ROOT_DIR/scripts/test/telegram.sh"
"$ROOT_DIR/scripts/test/theme.sh"

log_success "All project checks passed."