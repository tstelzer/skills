# Sources and coverage

This handbook uses the supplied `references/rust-skills/` catalog and the extracted notes listed in
`references/rust/README.md`. The notes were reviewed on 2026-11-17.
The handbook does not claim a tested Rust or dependency release snapshot.

The upstream links below identify the sources behind those supplied files. They are reading references, not a record
of fresh verification. Check exact APIs against the project before adopting version-sensitive examples.

## Main pattern catalog

[Rust Skills by Leonardo Maldonado](https://github.com/leonardomso/rust-skills) supplies the broad topic coverage
and the bad/good example format. Its rules are grouped and rewritten here.
The original MIT notice is in [LICENSE.rust-skills](./LICENSE.rust-skills).

Repeated ownership, collection, error, and anti-pattern rules share one page here.
Performance advice states the workload and tradeoff instead of inheriting an impact ranking or universal setting.

| Supplied category | Handbook topic |
| --- | --- |
| Ownership and borrowing | [Ownership](./topics/ownership/index.md) |
| Error handling | [Errors](./topics/errors/index.md) |
| Memory optimization | [Memory](./topics/memory/index.md), [collection reuse](./topics/collections/reuse.md) |
| Unsafe code | [Unsafe Rust](./topics/unsafe/index.md) |
| API design | [APIs](./topics/api/index.md), [construction](./topics/types/construction.md) |
| Async/await | [Async](./topics/async/index.md) |
| Concurrency | [Concurrency](./topics/concurrency/index.md) |
| Compiler optimization | [Compiler choices](./topics/performance/compiler.md) |
| Numeric safety | [Numbers](./topics/numbers/index.md) |
| Type safety | [Types](./topics/types/index.md) |
| Traits and generics | [Traits](./topics/api/traits.md) |
| Conversions | [Conversions](./topics/types/conversions.md) |
| Const and compile-time | [Compile-time values](./topics/metaprogramming/const.md) |
| Serde | [Serialization](./topics/serde/index.md) |
| Pattern matching | [Branches](./topics/flow/branches.md) |
| Macros | [Macros](./topics/metaprogramming/macros.md) |
| Closures | [Closures](./topics/flow/closures.md), [async callbacks](./topics/async/traits.md) |
| Collections | [Collections](./topics/collections/index.md) |
| Naming | [Signatures and names](./topics/api/signatures.md) |
| Testing | [Testing](./topics/testing/index.md) |
| Documentation | [Documentation](./topics/documentation/api-docs.md) |
| Observability | [Diagnostics](./topics/diagnostics/index.md) |
| Performance patterns | [Performance](./topics/performance/index.md), [iteration](./topics/flow/iteration.md) |
| Project structure | Visibility and API features only; crate and application layout belong in architecture guidance |
| Clippy and linting | [Checks](./topics/documentation/checks.md) |
| Anti-patterns | Bad examples beside each owning pattern |

## Extracted books and articles

The supplied notes distinguish recommendations, language guarantees, and the authors' workload-specific experience.
Keep that distinction when using these sources.

| Supplied notes | Source | Use here |
| --- | --- | --- |
| `01-rust-api-guidelines.md` | [Rust API Guidelines][api] | Ownership in signatures and public contracts |
| `02-cargo-book.md` | [The Cargo Book][cargo] | Additive features and version constraints |
| `03-matklad-workspaces.md` | [Large Rust Workspaces][matklad] | Reserved for architecture guidance |
| `04-rust-design-patterns.md` | [Rust Design Patterns][patterns] | Split borrows, guards, deliberate cloning |
| `05-effective-rust.md` | [Effective Rust][effective] | Dispatch choices and visibility |
| `06-microsoft-pragmatic-rust.md` | [Pragmatic Rust Guidelines][microsoft] | Measured cost and sound safe interfaces |
| `07-fasterthanlime-type-design.md` | [Aiming for correctness with types][types] | Valid construction |
| `08-luca-palmieri-errors.md` | [Error Handling in Rust][errors] | Recovery choices and error reports |
| `09-burntsushi-panic-policy.md` | [Using unwrap() in Rust is Okay][panic] | Failures and broken assumptions |
| `10-rust-performance-book.md` | [The Rust Performance Book][performance] | Profiling, allocation, and build costs |
| `11-corrode-compile-times.md` | [Faster Rust Compile Times][compile] | Measure rebuilds and dependency costs |
| `12-rust-atomics-and-locks.md` | [Rust Atomics and Locks][atomics] | Shared ownership and memory ordering |
| `13-tokio-tutorial.md` | [Tokio tutorial][tokio] | Channels, locks, and task ownership |
| `14-alice-ryhl-async.md` | [Async: What is blocking?][ryhl] | Runtime workers and blocking work |
| `15-without-boats-concurrency.md` | [The Scoped Task trilemma][boats] | Borrowing, task lifetime, and cancellation |
| `16-rustonomicon.md` | [The Rustonomicon][nomicon] | Safety obligations and panic-safe updates |
| `17-rust-reference.md` | [The Rust Reference][reference] | Privacy, dyn compatibility, and layout |
| `18-embedded-rust-book.md` | [The Embedded Rust Book][embedded] | Type states and platform requirements |
| `19-too-many-linked-lists.md` | [Too Many Linked Lists][lists] | Ownership cycles and destruction depth |
| `20-rust-fuzz-book.md` | [Rust Fuzz Book][fuzz] | Parser targets and generated stateful inputs |

The async notes also draw on [Actors with Tokio](https://ryhl.io/blog/actors-with-tokio/),
[poll_next](https://without.boats/blog/poll-next/), and
[Tokio's shutdown guide](https://tokio.rs/tokio/topics/shutdown).

## Reading the examples

- Rust blocks are independent examples or clearly marked sketches. Imports belong to that block.
- `compile_fail` marks code intended to be rejected.
  `ignore` marks unsafe or context-dependent bad code to avoid running.
- Third-party examples name the needed crate or features nearby. They are not a shared manifest or dependency policy.
- No whole-handbook compile or runtime validation is claimed.

[api]: https://rust-lang.github.io/api-guidelines/
[cargo]: https://doc.rust-lang.org/cargo/
[matklad]: https://matklad.github.io/2021/08/22/large-rust-workspaces.html
[patterns]: https://rust-unofficial.github.io/patterns/
[effective]: https://effective-rust.com/
[microsoft]: https://microsoft.github.io/rust-guidelines/
[types]: https://fasterthanli.me/articles/aiming-for-correctness-with-types
[errors]: https://lpalmieri.com/posts/error-handling-rust/
[panic]: https://burntsushi.net/unwrap/
[performance]: https://nnethercote.github.io/perf-book/
[compile]: https://corrode.dev/blog/tips-for-faster-rust-compile-times/
[atomics]: https://mara.nl/atomics/
[tokio]: https://tokio.rs/tokio/tutorial
[ryhl]: https://ryhl.io/blog/async-what-is-blocking/
[boats]: https://without.boats/blog/the-scoped-task-trilemma/
[nomicon]: https://doc.rust-lang.org/nomicon/
[reference]: https://doc.rust-lang.org/reference/
[embedded]: https://docs.rust-embedded.org/book/
[lists]: https://rust-unofficial.github.io/too-many-lists/
[fuzz]: https://rust-fuzz.github.io/book/
