# Choose a trait for a real shared operation

Use methods on a concrete type for behavior that belongs to that type.
Add a trait for code that must work with several implementations of the same operation.
Before exposing the trait, decide whether callers need to use it or supply their own implementation.
Keep a fixed set of internal choices behind a concrete type. A private enum can select the implementation.
A public type parameter can force callers to repeat that choice in their own types and functions.

## Bad

```rust
trait NameService {
    fn name(&self) -> &str;
}

struct User { name: String }

impl NameService for User {
    fn name(&self) -> &str { &self.name }
}
```

There is one type and no caller that needs a generic name provider.

## Good

```rust
struct User { name: String }

impl User {
    fn name(&self) -> &str { &self.name }
}
```

## Choose dispatch from the callers

| Form | Use when | Tradeoff |
| --- | --- | --- |
| `T: Trait` or `impl Trait` parameter | Compile-time types vary | Specialized code can increase build time and size |
| `impl Trait` return | One hidden concrete return type | Each return path must fit that concrete type |
| `&dyn Trait` | Borrowed runtime choice | Indirect calls; no allocation required by the reference |
| `Box<dyn Trait>` | Owned runtime choice or mixed storage | Allocation and indirect calls |
| Enum | A known set of variants | Every new variant changes the type and its matches |

Use static dispatch for generic algorithms when it fits. Use dynamic dispatch for runtime variation or to reduce
repeated generated code. Neither choice is always faster for the whole program.

## Keep traits small and implementable

- Put bounds on the methods or implementations that need them.
- Use an associated type when each implementation chooses one type, such as an iterator's `Item`.
- Use a generic trait parameter when a type needs several implementations for different inputs.
- Build default methods from a small required core. Avoid defaults that call each other without a required base case.
- A blanket implementation covers many types and can block future implementations. Check overlap before adding one.
- To implement a foreign trait for a foreign type, wrap the type in a local newtype.
- Use a local extension trait to add methods to foreign types. It must be in scope at the call site.

## Check `dyn` compatibility before promising it

A trait used through `dyn Trait` must support calls without knowing the concrete `Self` type.
Generic methods, opaque return types, and ordinary `async fn` methods need separate treatment.
Methods restricted by `where Self: Sized` can remain outside the dynamically callable part of a suitable trait.
An associated type may need an explicit value, such as `dyn Iterator<Item = u8>`.

Read [async traits](../async/traits.md) for future and `Send` constraints.
Check the project's language reference for the full compatibility rules when designing a trait object API.
