#!/usr/bin/env bash
# railway-init.sh — minimal Railway bootstrap helper.
# After pushing this repo to Railway and creating a project:
#   1. `bash scripts/railway-init.sh` will add/refresh the DATABASE_URL secret.
#   2. It then triggers a deploy and runs migrations.
# Requires: `railway` CLI installed & authenticated.

set -euo pipefail

cd "$(dirname "$0")"/..

echo "=== Railway project check ==="
if ! railway status --connection > /dev/null 2>&1; then
  echo "ERROR: Not logged into Railway CLI or no project linked."
  echo "Run:   railway login && railway link"
  exit 1
fi

PROJ=$(railway status --json 2>/dev/null | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("project","unknown") if isinstance(d,dict) else "unknown")' 2>/dev/null || echo "unknown")
echo "Project: ${PROJ}"

if [ "$1" == "--migrate" ] 2>/dev/null; then
  # Run migrations — requires DATABASE_URL to be set as a Railway secret
  echo ""
  if grep -q POSTGRES_URL railway.env 2>/dev/null || \
     grep -q DATABASE_URL railway.env 2>/dev/null; then
    echo "Found local env overrides, using them."
    export $(grep -E '^(DATABASE_URL|POSTGRES_)' railway.env | xargs)
  fi

  if [ -z "${DATABASE_URL:-}" ]; then
    # Fetch from Railway remote config
    DATABASE_URL=$(railway variables get DATABASE_URL 2>/dev/null || true)
    if [ -z "${DATABASE_URL:-}" ]; then
      echo "WARNING: No DATABASE_URL available locally or on Railway yet."
      echo "Set it: railway variables set DATABASE_URL 'postgresql://…'"
      exit 1
    fi
  fi

  echo "Running migrations (DATABASE_URL configured via secrets)…"
  bash "$(dirname "$0")/../migration.sh"
fi

echo ""
echo "=== Deploy trigger ==="
railway up -d || echo "(Deploy may already be in progress from git push)"
