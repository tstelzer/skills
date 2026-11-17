# Keep borrows tied to their owner

A lifetime describes how long a reference may be used. It does not extend the life of the value.
Let Rust infer lifetimes when the relationship is clear.

## Bad

```rust
fn first_word<'a>(text: &'a str) -> String {
    text.split_whitespace().next().unwrap_or("").to_owned()
}
```

The explicit lifetime adds nothing, and the result copies text only to read it.

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

`T: 'static` means the value contains no borrow that expires too soon. It does not mean the value lives forever.
Owned `String` values can satisfy this bound and still drop normally.
