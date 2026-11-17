# API lookup

Check the project's toolchain and locked dependency versions before copying an API.
Use the matching version on docs.rs. A `latest` page may describe APIs the project cannot use.

| Question | Reference |
| --- | --- |
| Standard types, methods, and their stable versions | [Standard library][std] |
| Borrowed views and storage reuse | [Borrow][borrow], [ToOwned][owned] |
| Language rules, visibility, and layout | [Rust Reference][reference] |
| Edition changes | [Edition Guide][edition] |
| Public API conventions | [API Guidelines][api] |
| Features, profiles, and compiler requirements | [Cargo Book][cargo] |
| Async task and channel contracts | [Tokio API][tokio] |
| Bounded concurrent streams | [futures-util API][futures] |
| Pinning and `Unpin` | [Pin module][pin] |
| Serialization attributes | [Serde documentation][serde] |
| Unsafe contracts | [Rust Reference: undefined behavior][ub], [Rustonomicon][nomicon] |
| Documentation examples | [rustdoc book][rustdoc] |
| Lint behavior | [Clippy documentation][clippy] |

Read the method's errors, panics, cancellation rules, and feature requirements.
Use the implementation when the API docs leave a relevant cost or behavior unclear.
Do not turn an implementation detail into a guarantee for callers.

[std]: https://doc.rust-lang.org/std/
[borrow]: https://doc.rust-lang.org/std/borrow/trait.Borrow.html
[owned]: https://doc.rust-lang.org/std/borrow/trait.ToOwned.html
[reference]: https://doc.rust-lang.org/reference/
[edition]: https://doc.rust-lang.org/edition-guide/
[api]: https://rust-lang.github.io/api-guidelines/
[cargo]: https://doc.rust-lang.org/cargo/
[tokio]: https://docs.rs/tokio/
[futures]: https://docs.rs/futures-util/
[pin]: https://doc.rust-lang.org/std/pin/
[serde]: https://serde.rs/
[ub]: https://doc.rust-lang.org/reference/behavior-considered-undefined.html
[nomicon]: https://doc.rust-lang.org/nomicon/
[rustdoc]: https://doc.rust-lang.org/rustdoc/
[clippy]: https://doc.rust-lang.org/clippy/
