# Choose shared ownership only when owners overlap

Start with one owner and temporary borrows. Reference counting is useful when several parts must keep the same value
alive independently.

| Need | Tool | Cost or limit |
| --- | --- | --- |
| One heap owner | `Box<T>` | Allocation and pointer access |
| Shared ownership on one thread | `Rc<T>` | Reference counts; cycles can leak |
| Shared ownership across threads | `Arc<T>` | Atomic reference counts; `T` still needs suitable thread safety |
| Replace a small value through `&self` | `Cell<T>` | No shared references to the contained value |
| Borrow mutable data through `&self` on one thread | `RefCell<T>` | Borrow checks run at runtime |
| Share mutable data across threads | `Mutex<T>` or `RwLock<T>` | Waiting, contention, and deadlock risk |

## Bad

```rust
use std::cell::RefCell;

struct Names(RefCell<Vec<String>>);

impl Names {
    fn push(&mut self, name: String) {
        self.0.borrow_mut().push(name);
    }
}
```

This method already has exclusive access. Runtime borrow checks do not help it.

## Good

```rust
struct Names(Vec<String>);

impl Names {
    fn push(&mut self, name: String) {
        self.0.push(name);
    }
}
```

Use `RefCell` when mutation through a shared reference is part of the design.
Keep each borrow guard short. Conflicting `borrow` and `borrow_mut` calls panic.
Use `try_borrow` or `try_borrow_mut` when a conflict is an expected outcome the caller can handle.

## Sharing does not make mutation safe

`Arc<T>` shares ownership; it does not add a lock to `T`.
`Arc<RefCell<T>>` does not turn `RefCell` into a type that supports shared mutation across threads.

Use `Weak` for a link that should not keep its target alive, such as a child's link back to its parent.
Handle `Weak::upgrade` returning `None`. `Rc` and `Arc` do not collect strong ownership cycles.

Use a lock for shared mutation. Choose `RwLock` only when overlapping reads help the workload;
many reads alone do not prove it will beat a mutex. Read [locks and atomics](../concurrency/synchronization.md).
