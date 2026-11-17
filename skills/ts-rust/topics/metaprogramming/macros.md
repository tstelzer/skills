# Use a function unless syntax must vary

Functions provide ordinary type checking and error locations. Use macros when the caller must supply syntax that a
function cannot accept, such as a variable number of expressions or generated declarations.

## Bad

```rust
macro_rules! square {
    ($value:expr) => { $value * $value };
}
```

An argument with side effects runs twice. The operation does not need syntax generation.

## Good

```rust
fn square(value: u32) -> Option<u32> {
    value.checked_mul(value)
}
```

## Keep exported paths valid for downstream callers

### Bad

```rust
macro_rules! announce {
    ($message:expr) => { emit($message) };
}
```

An unqualified helper name depends on what is visible at the expansion site.

### Good

```rust
#[doc(hidden)]
pub mod __private {
    pub fn emit(message: &str) {
        println!("{message}");
    }
}

#[macro_export]
macro_rules! announce {
    ($message:expr) => {
        $crate::__private::emit($message)
    };
}
```

This is a small path-resolution example, not a logging API recommendation.
`$crate` names the defining crate even when a consumer renames the dependency.
It does not bypass privacy. Exported expansions need accessible helpers.
`#[doc(hidden)]` hides a public helper from ordinary docs; it does not make the helper private.

- Use precise fragments such as `expr`, `ty`, `path`, and `ident` when they describe the accepted input.
- Use `tt` when the macro genuinely needs to process token syntax.
- Evaluate each expression argument once unless repeated evaluation is the documented contract.
- Keep generated names from colliding with caller names. Test expansion from a separate consumer.
- `#[macro_export]` exports at the crate root. Do not re-import the same macro under the same root name.

For procedural macros, use a dedicated proc-macro crate as required by Rust's model.
Parse and generate syntax with tools such as `syn`, `quote`, and `proc_macro2` instead of editing token strings.
Return a spanned compile error for bad user input; do not panic to report ordinary input errors.
Keep the generated API small and test both valid and invalid uses.
