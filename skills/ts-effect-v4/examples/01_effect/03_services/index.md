## Writing Effect services

Use services to expose effectful behavior and its dependencies.

`Context.Service` does not make dependencies explicit by itself. Do not read
or mutate `process.env`, time, randomness, platform state, or other globals
inside a service implementation or test. Put ambient inputs in a service
requirement, `Context.Reference`, `Config`, or explicit layer options.

Before using `node:*` or a runtime global, check for an Effect capability such
as `FileSystem`, `Path`, `Clock`, `SecureRandom`, `Random`, or `Config`. Use
`layerNoDeps` for the implementation so its requirements remain visible. Add
`NodeServices.layer` or another platform layer at the application boundary.

Use a native API when the Effect capability cannot provide required semantics,
such as a specific file-open flag. Keep the native call narrow and record why
the capability is insufficient.

Let `Config.withDefault` and `Config.option` handle absent values. Invalid
input and source errors still fail. Put defaults on children of `Config.all`
to preserve supplied values; a default on the group replaces the whole group.

Reuse the same layer value under one enclosing `Effect.provide` to share its
services. Independent sibling `Effect.provide` calls build separate instances.

### Crypto and platform services

Import crypto families from `effect/crypto`. Use `SecureRandom` for secure
random bytes and UUIDs, `Digest` for hashes, `Mac` for message authentication,
and `Aead` for authenticated encryption. Other families include `Signature`,
`Kdf`, `KeyAgreement`, `KeyWrap`, and `Cipher`.

Provide crypto explicitly at the application boundary. `NodeServices.layer`
does not include it. Use `NodeCrypto.layer` or a family layer such as
`NodeCrypto.layerDigest`; Bun, Deno, and browser packages provide matching
crypto layers. Core families also expose `layerWebCrypto` through the
configurable `WebCrypto` reference.

```ts
import { NodeCrypto } from "@effect/platform-node"
import { Effect } from "effect"
import { Digest } from "effect/crypto"

const hash = Effect.gen(function*() {
  const digest = yield* Digest.Digest
  return yield* digest.digestHex(Digest.sha256, new TextEncoder().encode("hello"))
}).pipe(Effect.provide(NodeCrypto.layerDigest))
```

Keep keys opaque. Secret and private key schemas require `{ allowEncode: true }`
to export key material. Mock the required crypto service with `Layer.mock` in tests.

Use `FileSystem.lstat` to inspect a symlink itself. Custom filesystem services
must supply `lstat` and `readDirectoryEntries`; `FileSystem.make` derives `glob`.
Use `/` in glob patterns and set `dot: true` when wildcards must include dotfiles.
Get `path` with `yield* Path.Path`, then use `path.resolveWithin(root, input)`
to reject paths that leave the root. This checks path segments, not symlinks.

Use `Host`, `Dns`, and `AddressResolver` from `effect/net` for host parsing and
name resolution. Runtime packages provide the DNS implementations.
