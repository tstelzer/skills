# Handle partial reads and writes

`Read::read` and `Write::write` report how many bytes they handled.
A successful call may handle fewer bytes than the buffer contains.

## Bad

```rust
use std::io::{self, Read};

fn read_header(reader: &mut impl Read) -> io::Result<[u8; 4]> {
    let mut header = [0; 4];
    reader.read(&mut header)?;
    Ok(header)
}
```

The function can return a header whose last bytes were never read.

## Good

```rust
use std::io::{self, Read};

fn read_header(reader: &mut impl Read) -> io::Result<[u8; 4]> {
    let mut header = [0; 4];
    reader.read_exact(&mut header)?;
    Ok(header)
}
```

Use `read_exact` when the protocol requires a fixed number of bytes.
It reports `UnexpectedEof` when input ends before the buffer is full.
An error can leave the stream partly consumed; retrying the whole record does not restore those bytes.

For variable-length input, use the returned count and process only `buffer[..count]`.
With a nonempty destination, `Ok(0)` means the reader has no more bytes at that point.
An empty destination cannot establish end of input.

## Finish the whole write

### Bad

```rust
use std::io::{self, Write};

fn send(writer: &mut impl Write, bytes: &[u8]) -> io::Result<()> {
    writer.write(bytes)?;
    Ok(())
}
```

### Good

```rust
use std::io::{self, Write};

fn send(writer: &mut impl Write, bytes: &[u8]) -> io::Result<()> {
    writer.write_all(bytes)
}
```

`read_exact` and `write_all` retry `Interrupted` errors. Custom loops must handle them too.
`write_all` can fail after writing part of the data. It does not make a record write atomic.
It also does not flush a buffered writer or promise durable storage. See [resources](../memory/resources.md).

## Keep buffering and input limits clear

- Use `BufReader` or `BufWriter` for repeated small operations when batching helps.
- Keep one buffered reader for the stream. Replacing it can discard bytes it already read ahead.
  Reading directly from its underlying reader can skip those buffered bytes.
- `read_line` appends to its `String` and includes the line ending. Clear a reused buffer before the next line.
- Use `read_until` for byte-delimited data that need not be UTF-8.
- Set byte and record limits before reading open-ended input into a growing buffer.
  `take(limit)` makes reaching the limit look like end of input. To reject oversized input, read at most one extra
  byte and check the result. Use checked arithmetic when computing that bound.

For async equivalents, also check [cancellation rules](../async/cancellation.md).
A future can be dropped between partial reads or writes.

## Pass borrowed results to a callback

Use a callback when each result borrows from a buffer that the next read will overwrite.
Call it before clearing or refilling the buffer. Copy a result if it must live past that call.

Use `Result<std::ops::ControlFlow<()>, E>` when the callback can stop early or fail.
`Ok(Continue(()))` keeps reading. `Ok(Break(()))` stops successfully. `Err(error)` reports failure.
Use a closure for one kind of event. Add a trait when callers need several event methods.
Document whether completion callbacks run after a requested stop or an error.
