# ts-effect-v4

Vendored snapshot of the Effect v4 AI docs, restructured as a routing skill.
`SKILL.md` is the router. The content is real `.ts` files, not prose.

## Layout

- `examples/`: mirror of upstream `ai-docs/src`: runnable, type-checked `.ts` examples, per-folder `index.md`
  intros, and the `fixtures/` they import.
- `migration/`: upstream `MIGRATION.md` plus its `migration/` guides, flattened into one folder.

## Provenance

Snapshot taken from `references/effect-v4` at commit `e11cccc7` (2026-06-30).
Effect v4 is in beta. APIs still move, so re-sync periodically.

## Re-sync

```sh
./sync.sh                        # source defaults to ../../references/effect-v4
./sync.sh /path/to/effect-v4     # or pass an explicit checkout
```

`sync.sh` mirrors the two trees with `rsync` and reapplies the only two local transforms:

1. Flattens `MIGRATION.md` links (`./migration/x.md` → `./x.md`) since the guides are siblings here.
2. Adds the orphaned `generators.md` to the `MIGRATION.md` index if upstream still doesn't link it.

Both are idempotent. After syncing, compare `SKILL.md` with new or removed example folders and update the router by
hand. Bump the commit hash above.
