#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# @ui-looper/core — Development script
# ──────────────────────────────────────────────────────────────
# Uses rspack build --watch + serve (like looper MF remotes).
# Avoid rspack serve — it compiles exposes with direct
# node_modules/react/jsx-dev-runtime (breaks host singleton).
#
# Demo page at http://localhost:${PORT}/demo.html
# ──────────────────────────────────────────────────────────────
set -euo pipefail

PORT="${1:-3030}"
export NODE_ENV=development

echo "→ Building @ui-looper/core (library)…"
echo "→ Building demo page (demo/)…"
echo "→ Serving on http://localhost:${PORT}"
echo "→ Demo at http://localhost:${PORT}"

npx concurrently -k -n lib,demo,serve -c cyan,green,magenta \
  "npx rspack build --watch" \
  "npx rspack build -c rspack.demo.config.ts --watch" \
  "npx serve dist -l ${PORT} -C --no-port-switching"
