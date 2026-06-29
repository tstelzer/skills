# ts-effect-v4

Vendored snapshot of the [effect-smol](https://github.com/Effect-TS/effect-smol) AI docs, restructured as a routing skill. `SKILL.md` is the router; the content is real `.ts` files, not prose.

## Layout

- `examples/` — mirror of upstream `ai-docs/src`: runnable, type-checked `.ts` examples, per-folder `index.md` intros, and the `fixtures/` they import.
- `migration/` — upstream `MIGRATION.md` plus its `migration/` guides, flattened into one folder.

## Provenance

Snapshot taken from `references/effect-smol` at commit `e16acae8` (2026-05-28). Effect v4 is in beta; APIs still move, so re-sync periodically.

## Re-sync

```sh
./sync.sh                          # source defaults to ../../references/effect-smol
./sync.sh /path/to/effect-smol     # or pass an explicit checkout
```

`sync.sh` mirrors the two trees with `rsync` and reapplies the only two local transforms:

1. Flattens `MIGRATION.md` links (`./migration/x.md` → `./x.md`) since the guides are siblings here.
2. Adds the orphaned `generators.md` to the `MIGRATION.md` index if upstream still doesn't link it.

Both are idempotent. After syncing, eyeball `SKILL.md` against any new or removed example folders and update the router by hand. Bump the commit hash above.
