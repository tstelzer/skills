#!/usr/bin/env sh
# Re-sync vendored Effect v4 docs from an effect-v4 checkout.
# Usage: ./sync.sh [path-to-effect-v4]   (default: ../../references/effect-v4)
set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
src=${1:-"$here/../../references/effect-v4"}

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
if ! grep -q '(\./generators\.md)' "$mig"; then
  pattern='\(- \[Effect Subtyping → Yieldable\](\./yieldable\.md)\)'
  replacement='\1\n- [Generators: `Effect.gen` Passing `this`](./generators.md)'
  sed -i "s#${pattern}#${replacement}#" "$mig"
fi

echo "synced from $src"
