# Keep filesystem paths as paths

Use `&Path` for temporary access and `PathBuf` for owned paths.
Operating system paths need not be valid UTF-8. Converting them to `String` can reject or change valid filenames.

## Bad

```rust
use std::path::{Path, PathBuf};

fn report_path(directory: &Path) -> PathBuf {
    PathBuf::from(format!("{}/report.json", directory.to_str().unwrap()))
}
```

This panics for a non-UTF-8 path and builds a path through text formatting.

## Good

```rust
use std::path::{Path, PathBuf};

fn report_path(directory: &Path) -> PathBuf {
    directory.join("report.json")
}
```

Use `path.display()` for a message. Keep the original path for later file operations.
Use `OsStr` and `OsString` for other operating system strings that need not be UTF-8.
Read path arguments with `args_os` when the CLI accepts such paths.

`join` builds a path; it does not restrict access to a directory.
An absolute input can replace the base, and `..` can walk out of it.
Validate caller-supplied path components according to the file access contract.
Account for symbolic links when access must stay within a directory.

## Let the file operation check existence

### Bad

```rust
use std::fs::File;
use std::io;
use std::path::Path;

fn create_report(path: &Path) -> io::Result<File> {
    if path.exists() {
        return Err(io::Error::new(io::ErrorKind::AlreadyExists, "report exists"));
    }
    File::create(path)
}
```

Another caller can create the file between the check and the open. `File::create` then truncates that file.
`Path::exists` can also hide a metadata error by returning `false`.

### Good

```rust
use std::fs::{File, OpenOptions};
use std::io;
use std::path::Path;

fn create_report(path: &Path) -> io::Result<File> {
    OpenOptions::new().write(true).create_new(true).open(path)
}
```

`create_new` combines creation and the existence check in one atomic operation.
For reads, open the file directly and handle the returned error.
Use an existence query only when the query itself is the requested result.
