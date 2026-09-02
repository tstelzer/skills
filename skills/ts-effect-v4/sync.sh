#!/usr/bin/env sh
# Re-sync vendored Effect v4 docs from an effect-v4 checkout.
# Usage: ./sync.sh [path-to-effect-v4]   (default: ../../references/effect-v4)
set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
src=${1:-"$here/../../references/effect-v4"}

[ -d "$src/ai-docs/src" ] || { echo "no ai-docs/src under $src" >&2; exit 1; }
[ -f "$src/packages/effect/package.json" ] || { echo "no effect package under $src" >&2; exit 1; }
[ -z "$(git -C "$src" status --porcelain)" ] || { echo "source checkout is dirty: $src" >&2; exit 1; }

revision=$(git -C "$src" rev-parse HEAD)
version=$(sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' \
  "$src/packages/effect/package.json" | head -n 1)
[ -n "$version" ] || { echo "no effect package version under $src" >&2; exit 1; }

release_tag="effect@$version"
release_revision=$(git -C "$src" rev-parse --verify "$release_tag^{commit}" 2>/dev/null) || {
  echo "no release tag $release_tag under $src" >&2
  exit 1
}
[ "$revision" = "$release_revision" ] || {
  echo "source checkout does not match $release_tag: $src" >&2
  exit 1
}

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
  --exclude=/40_sql/10_basics.ts \
  --exclude=/50_http-client/10_basics.ts \
  --exclude=/50_http-client/index.md \
  --exclude=/51_http-server/10_basics.ts \
  --exclude=/51_http-server/20_testing.ts \
  --exclude=/51_http-server/fixtures/api/Users.ts \
  --exclude=/51_http-server/fixtures/server/Users/http.ts \
  --exclude=/51_http-server/index.md \
  --exclude=/60_child-process/10_working-with-child-processes.ts \
  --exclude=/60_child-process/index.md \
  "$src/ai-docs/src/" "$here/examples/"

# 2. migration: Markdown guides + overview, flattened into one folder
rsync -a --delete --include='/*.md' --exclude='*' "$src/migration/" "$here/migration/"
cp "$src/MIGRATION.md" "$here/migration/MIGRATION.md"

mig="$here/migration/MIGRATION.md"

# 3. flatten links: guides are siblings here, not in a ./migration/ subdir
sed -i 's#](\./migration/#](./#g' "$mig"

# Keep the unstable-module list aligned with the package exports.
sed -i \
  -e 's/`devtools`, `eventlog`/`devtools`, `encoding`, `eventlog`/' \
  -e 's/, `jsonschema`//' \
  "$mig"

# 4. index generators.md (orphaned upstream) unless it's already linked
if ! grep -q '(\./generators\.md)' "$mig"; then
  pattern='\(- \[Effect Subtyping → Yieldable\](\./yieldable\.md)\)'
  replacement='\1\n- [Generators: `Effect.gen` Passing `this`](./generators.md)'
  sed -i "s#${pattern}#${replacement}#" "$mig"
fi

# 5. correct stale beta wording in the upstream migration overview for RC snapshots
case "$version" in
  *-rc.*)
    sed -i \
      -e 's/currently in beta/currently a release candidate/' \
      -e 's/between beta$/between/' \
      -e 's/^> releases\./> release candidates./' \
      -e 's/as the beta progresses and community/until v4 reaches stable release./' \
      -e 's/^> feedback is incorporated\.$/> Community feedback will be incorporated./' \
      -e 's/4\.0\.0-beta\.0/4.0.0-rc.0/g' \
      -e 's/matching v4 beta versions/matching v4 versions/' \
      "$mig"
    ;;
esac

# 6. record the exact source snapshot used by this handbook
sed -i \
  -e "s#^- Commit: .*#- Commit: \`$revision\`#" \
  -e "s#^- Package: .*#- Package: \`effect@$version\`#" \
  "$here/SKILL.md"

echo "synced from $src"
