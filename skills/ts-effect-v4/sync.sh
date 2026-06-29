#!/usr/bin/env sh
# Re-sync vendored Effect v4 docs from an effect-smol checkout.
# Usage: ./sync.sh [path-to-effect-smol]   (default: ../../references/effect-smol)
set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
src=${1:-"$here/../../references/effect-smol"}

[ -d "$src/ai-docs/src" ] || { echo "no ai-docs/src under $src" >&2; exit 1; }

# 1. examples: exact mirror of ai-docs/src (drops files removed upstream)
rsync -a --delete "$src/ai-docs/src/" "$here/examples/"

# 2. migration: guides + overview, flattened into one folder
rsync -a --delete --exclude=MIGRATION.md "$src/migration/" "$here/migration/"
cp "$src/MIGRATION.md" "$here/migration/MIGRATION.md"

mig="$here/migration/MIGRATION.md"

# 3. flatten links: guides are siblings here, not in a ./migration/ subdir
sed -i 's#](\./migration/#](./#g' "$mig"

# 4. index generators.md (orphaned upstream) unless it's already linked
grep -q '(\./generators\.md)' "$mig" || \
  sed -i 's#\(- \[Effect Subtyping → Yieldable\](\./yieldable\.md)\)#\1\n- [Generators: `Effect.gen` Passing `this`](./generators.md)#' "$mig"

echo "synced from $src"
