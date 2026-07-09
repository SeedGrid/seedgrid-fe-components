#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="${ROOT_DIR}/packages/modules/seedgrid-fe-billing-platform"

exec "${ROOT_DIR}/publish-package.sh" "${PKG_DIR}" "${1:-none}"
