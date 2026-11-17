# Ask callbacks for only the calling behavior you need

Use `FnOnce` when calling once is enough, `FnMut` when repeated calls may change captured state,
and `Fn` when repeated calls must work through a shared reference.
These bounds describe how the closure is called, not whether the surrounding operation has side effects.

## Bad

```rust
fn with_value<T>(value: T, callback: impl Fn(T)) {
    callback(value);
}
```

The callback runs once, but the bound rejects closures that need to consume a captured value.

## Good

```rust
fn with_value<T, R>(value: T, callback: impl FnOnce(T) -> R) -> R {
    callback(value)
}

fn visit(values: &[u32], mut callback: impl FnMut(u32)) {
    for &value in values {
        callback(value);
    }
}
```

## Return a concrete closure when one shape is enough

### Bad

```rust
fn has_prefix(prefix: String) -> Box<dyn Fn(&str) -> bool> {
    Box::new(move |text| text.starts_with(&prefix))
}
```

### Good

```rust
fn has_prefix(prefix: String) -> impl Fn(&str) -> bool {
    move |text| text.starts_with(&prefix)
}
```

Use `dyn Fn` when runtime choices or mixed callback storage require it.
Borrowed dynamic dispatch, such as `&dyn Fn()`, does not require a heap allocation.

`move` takes captured values into the closure. Capturing a reference still captures a reference;
`move` does not make borrowed data live longer.
Clone a shared handle before moving it when the caller also needs that handle.
Capture only the fields needed, and respect the project's edition rules for disjoint field capture.

For callbacks that return futures, read [async traits and callbacks](../async/traits.md).
