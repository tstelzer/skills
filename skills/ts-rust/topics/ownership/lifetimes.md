# Keep borrows tied to their owner

A lifetime describes how long a reference may be used. It does not extend the life of the value.
Let Rust infer lifetimes when the relationship is clear.

## Bad

```rust
fn first_word<'a>(text: &'a str) -> Option<String> {
    text.split_whitespace().next().map(str::to_owned)
}
```

For a caller that only reads the result, the copy is wasted. The explicit lifetime also adds nothing.

## Good

```rust
fn first_word(text: &str) -> Option<&str> {
    text.split_whitespace().next()
}

fn prefix_before<'a>(text: &'a str, separator: &str) -> Option<&'a str> {
    text.split_once(separator).map(|(prefix, _)| prefix)
}
```

The second signature names a lifetime because the result borrows from `text`, not `separator`.
Use short names such as `'a`, `'src`, or `'de` that make the relationship clear.

## Borrow separate fields separately

Do not borrow an entire object when an operation only needs one part.

### Bad

```rust,compile_fail
struct Report {
    title: String,
    lines: Vec<String>,
}

impl Report {
    fn title(&self) -> &str { &self.title }

    fn add_heading(&mut self) {
        let title = self.title();
        self.lines.push(title.to_owned());
        println!("{title}");
    }
}
```

The method call keeps a borrow of `self` alive while another operation needs mutable access.

### Good

```rust
struct Report {
    title: String,
    lines: Vec<String>,
}

impl Report {
    fn add_heading(&mut self) {
        let title = &self.title;
        self.lines.push(title.to_owned());
        println!("{title}");
    }
}
```

For larger operations, pass the needed fields to a helper. Split a struct when its parts own separate behavior.
Do not introduce `RefCell`, clone the whole object, or require `'static` just to silence a borrow error.

`T: 'static` means `T` contains no references with a lifetime shorter than `'static`.
It does not mean the value lives forever. An owned `String` meets this bound and can still be dropped normally.

In `impl<'a> View<'a>`, prefer `&mut self` over `&'a mut self`.
The second form ties the caller's exclusive borrow to the lifetime stored in `View` and can prevent later calls.
Name that relationship only when the API actually requires it.

## Use offsets or IDs with owned storage

To keep text and positions together, store byte offsets or ranges into an owned string.
Do not force a struct to borrow its own movable fields with lifetime annotations or raw pointers.
Keep ranges valid when the string changes. Read [pinning](../async/pinning.md) for APIs that need a fixed address.

For graphs with one storage owner, use typed IDs for edges into a vector or an index-based arena.
Borrow through the owner while accessing a node. The ID does not keep the storage alive.
State which storage instance accepts an ID and which changes invalidate it.
For reused slots, use handles with a slot number and a generation counter checked on lookup.
Specify whether rebuilding storage preserves IDs or invalidates them.
An ID's element type alone cannot detect stale IDs or use with the wrong storage instance.
