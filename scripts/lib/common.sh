#!/usr/bin/env bash
set -Eeuo pipefail

log_info() {
    printf '[INFO] %s\n' "$1"
}

log_success() {
    printf '[OK] %s\n' "$1"
}

log_error() {
    printf '[ERROR] %s\n' "$1" >&2
}

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        log_error "Required command not found: $1"
        exit 1
    fi
}