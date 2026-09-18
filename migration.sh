#!/usr/bin/env bash
# migration.sh — apply all supabase/migrations/*.sql files in order to PostgreSQL.
# Usage:  DATABASE_URL="postgresql://…" bash migration.sh
# Prerequisites: psql (from postgresql-client package) and a running shell.

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "FATAL: DATABASE_URL is not set" >&2
  exit 1
fi

MIGRATION_DIR="$(cd "$(dirname "$0")" && cd supabase/migrations || { echo "FATAL: no supabase/migrations dir at $(dirname "$0")/supabase/src/migrations"; exit 1; })"

files=($(ls -1 "${MIGRATION_DIR}"/*.sql 2>/dev/null | sort))

if [ ${#files[@]} -eq 0 ]; then
  echo "INFO: no .sql files found in supabase/migrations — nothing to do."
  exit 0
fi

echo "Applying ${#files[@]} migration(s) …"

for f in "${files[@]}"; do
  filename=$(basename "$f")
  echo "--- applying ${filename} ---"
  psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "$f"
done

echo "All migrations applied successfully."
