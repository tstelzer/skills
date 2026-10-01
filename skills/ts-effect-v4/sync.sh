#!/usr/bin/env sh
# Re-sync vendored docs from the handbook's release tag.
# Usage: ./sync.sh [path-to-effect-v4] [effect@version]
set -eu

here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
src=${1:-"$here/../../references/effect-v4"}
release_tag=${2:-$(sed -n 's/^- Release: `\([^`]*\)`$/\1/p' "$here/SKILL.md")}
[ -n "$release_tag" ] || { echo "no release tag in SKILL.md" >&2; exit 1; }

revision=$(git -C "$src" rev-parse --verify "refs/tags/$release_tag^{commit}") || {
  echo "no release tag $release_tag under $src" >&2
  exit 1
}
snapshot=$(mktemp -d)
trap 'rm -rf "$snapshot"' EXIT HUP INT TERM
git -C "$src" archive --format=tar --output="$snapshot/source.tar" "$revision" \
  ai-docs/src migration MIGRATION.md packages/effect/package.json
tar -xf "$snapshot/source.tar" -C "$snapshot"

version=$(sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' \
  "$snapshot/packages/effect/package.json" | head -n 1)
[ "$release_tag" = "effect@$version" ] || {
  echo "tag $release_tag does not match package version $version" >&2
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
  --exclude=/01_effect/03_services/20_layer-composition.ts \
  --exclude=/01_effect/04_errors/01_error-handling.ts \
  --exclude=/01_effect/04_errors/index.md \
  --exclude=/01_effect/05_resources/index.md \
  --exclude=/01_effect/07_pubsub/10_pubsub.ts \
  --exclude=/03_stream/10_creating-streams.ts \
  --exclude=/03_stream/20_consuming-streams.ts \
  --exclude=/04_integration/10_managed-runtime.ts \
  --exclude=/04_integration/index.md \
  --exclude=/09_testing/10_effect-tests.ts \
  --exclude=/09_testing/20_layer-tests.ts \
  --exclude=/09_testing/index.md \
  --exclude=/06_schedule/10_schedules.ts \
  --exclude=/40_sql/10_basics.ts \
  --exclude=/40_sql/index.md \
  --exclude=/50_http-client/10_basics.ts \
  --exclude=/50_http-client/index.md \
  --exclude=/51_http-server/10_basics.ts \
  --exclude=/51_http-server/20_testing.ts \
  --exclude=/51_http-server/fixtures/api/Users.ts \
  --exclude=/51_http-server/fixtures/server/Users/http.ts \
  --exclude=/51_http-server/index.md \
  --exclude=/60_child-process/10_working-with-child-processes.ts \
  --exclude=/60_child-process/index.md \
  "$snapshot/ai-docs/src/" "$here/examples/"

# 2. migration: preserve guides with local corrections to the upstream API map.
rsync -a --delete \
  --exclude=/fiberref.md \
  --exclude=/schema.md \
  --exclude=/v3-to-v4.md \
  --include='/*.md' --exclude='*' "$snapshot/migration/" "$here/migration/"
cp "$snapshot/MIGRATION.md" "$here/migration/MIGRATION.md"

mig="$here/migration/MIGRATION.md"

# Link to the release source because the handbook does not copy ARBITRARY.md.
arbitrary_url="https://github.com/Effect-TS/effect/blob/effect@$version/packages/effect/ARBITRARY.md"
sed -i "s#](../packages/effect/ARBITRARY.md)#]($arbitrary_url)#" \
  "$here/migration/schema.md"
sed -i 's/semantics, see \[Arbitrary/semantics, see\n[Arbitrary/' \
  "$here/migration/schema.md"

# 3. flatten links: guides are siblings here, not in a ./migration/ subdir
sed -i 's#](\./migration/#](./#g' "$mig"

# Keep the module list aligned with the tagged exports and stability annotations.
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

# 5. record the exact source snapshot used by this handbook
sed -i \
  -e "s#^- Release: .*#- Release: \`$release_tag\`#" \
  -e "s#^- Commit: .*#- Commit: \`$revision\`#" \
  -e "s#^- Package: .*#- Package: \`effect@$version\`#" \
  "$here/SKILL.md"

echo "synced from $src at $release_tag ($revision)"
