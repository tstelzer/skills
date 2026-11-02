# Read the pinned source

Use Bevy `v0.20.1` at commit `a0577b5c6a7b208719dd761c5c6a7a539e472a97`.
All upstream example links in this handbook use that release tag.

## Choose a source

1. Read the topic guide for the API choice and its limits.
2. Read the relevant release example and its imports.
3. Read the public API documentation for exact signatures and behavior.
4. Read implementation code only when the API docs leave the behavior unclear.

Examples may contain stale comments, old version strings, or links to `main` and `latest`.
Check the code against the pinned API. Use links to this release when checking its behavior.

## Use a local clone

In this repository, the reference clone is `references/bevy`. An installed skill may not have that clone.
Use the pinned online links when no local clone is available.

From the skills repository root:

```sh
git -C references/bevy rev-parse 'v0.20.1^{commit}'
git -C references/bevy show v0.20.1:Cargo.toml
git -C references/bevy show v0.20.1:examples/scene/bsn.rs
git -C references/bevy ls-tree -r --name-only v0.20.1 examples
git -C references/bevy grep -n 'WorldAssetRoot' v0.20.1 -- examples
```

The tag's commit must match the commit above. These commands read the release without changing the checkout.
Do not use files from a checkout of another commit to check how this release works.

## Use an upstream example

- Check the example's `[[example]]` entry in the release's `Cargo.toml` for its Cargo target name and
  `required-features`. The filename alone does not give the full run command.
- Read sibling modules named by `mod`, shader files, and asset loader settings used by the example.
- Resolve asset paths from the example application's asset folder, usually `assets/`.
- Check `[dev-dependencies]` when copying imports such as random generators or channel libraries.
  Adding `bevy` as a dependency does not add these libraries to your application.
- Use Rust code and shaders from the same release. Check linked external assets too.
  Even a file from a fixed release can link to data that changes.

Running `cargo run --example sprite` from a development checkout runs that checkout's code.
Run an upstream example only in a checkout of the pinned release with its assets and required toolchain.
Follow the host repository's tooling rules, including `direnv exec .` where required.

## Use a local example

Each local `.rs` file is an independent program with `main`, unless its guide says otherwise.
Put the chosen file in a Bevy application's `src/main.rs`, or register it as a Cargo example.
Use `bevy = "=0.20.1"`. The local examples use default Bevy features and require no external asset files.

These files show how to use the API. They have no Cargo workspace or lockfile.
Use the application's own manifest, lockfile, and checks to verify its full set of dependencies.

## Keep versions aligned

When upgrading this handbook, update the snapshot, dependency snippets, API links, upstream example links, and local
examples together. Read the migration guides between the old and new versions and the affected release examples.
Check the release manifest and each example's required features before finishing the update.

Do not use an older tutorial, the website's current quick start, or a development branch to check this release's API.

## Sources

- [Release](https://github.com/bevyengine/bevy/releases/tag/v0.20.1)
- [Manifest](https://github.com/bevyengine/bevy/blob/v0.20.1/Cargo.toml)
- [Example catalog](https://github.com/bevyengine/bevy/blob/v0.20.1/examples/README.md)
- [API reference](https://docs.rs/bevy/0.20.1/bevy/)
