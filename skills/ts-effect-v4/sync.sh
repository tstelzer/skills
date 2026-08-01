#!/usr/bin/env sh
# Re-sync vendored Effect v4 docs from an effect-v4 checkout.
# Usage: ./sync.sh [path-to-effect-v4]   (default: ../../references/effect-v4)
set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
src=${1:-"$here/../../references/effect-v4"}

[ -d "$src/ai-docs/src" ] || { echo "no ai-docs/src under $src" >&2; exit 1; }

# 1. examples: mirror upstream except for locally curated guidance
# Excluded paths contain application rules or broader Schema coverage that is
# not maintained upstream. rsync protects excluded files from --delete.
rsync -a --delete \
  --exclude=/index.md \
  --exclude=/01_effect/01_basics/01_effect-gen.ts \
  --exclude=/01_effect/01_basics/02_effect-fn.ts \
  --exclude=/01_effect/01_basics/10_creating-effects.ts \
  --exclude=/01_effect/01_basics/index.md \
  --exclude=/01_effect/02_schema/ \
  --exclude=/01_effect/03_services/index.md \
  --exclude=/01_effect/04_errors/01_error-handling.ts \
  --exclude=/01_effect/04_errors/index.md \
  --exclude=/01_effect/05_resources/index.md \
  --exclude=/03_stream/20_consuming-streams.ts \
  --exclude=/04_integration/10_managed-runtime.ts \
  --exclude=/09_testing/10_effect-tests.ts \
  --exclude=/09_testing/20_layer-tests.ts \
  --exclude=/09_testing/index.md \
  --exclude=/06_schedule/10_schedules.ts \
  --exclude=/50_http-client/10_basics.ts \
  --exclude=/50_http-client/index.md \
  --exclude=/51_http-server/10_basics.ts \
  --exclude=/51_http-server/fixtures/server/Users/http.ts \
  --exclude=/51_http-server/index.md \
  --exclude=/60_child-process/10_working-with-child-processes.ts \
  --exclude=/60_child-process/index.md \
  "$src/ai-docs/src/" "$here/examples/"

# 2. migration: guides + overview, flattened into one folder
rsync -a --delete --exclude=MIGRATION.md "$src/migration/" "$here/migration/"
cp "$src/MIGRATION.md" "$here/migration/MIGRATION.md"

mig="$here/migration/MIGRATION.md"

# 3. flatten links: guides are siblings here, not in a ./migration/ subdir
sed -i 's#](\./migration/#](./#g' "$mig"

# 4. index generators.md (orphaned upstream) unless it's already linked
if ! grep -q '(\./generators\.md)' "$mig"; then
  pattern='\(- \[Effect Subtyping → Yieldable\](\./yieldable\.md)\)'
  replacement='\1\n- [Generators: `Effect.gen` Passing `this`](./generators.md)'
  sed -i "s#${pattern}#${replacement}#" "$mig"
fi

echo "synced from $src"
