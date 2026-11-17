# Pick the collection for the operations

Start with `Vec` for a sequence. Its contiguous storage is simple to traverse and avoids one allocation per item.
Change the collection when another access pattern matters.

## Bad

```rust
fn next_job(queue: &mut Vec<String>) -> Option<String> {
    if queue.is_empty() {
        None
    } else {
        Some(queue.remove(0))
    }
}
```

Removing the first item shifts the rest of the vector on every call.

## Good

```rust
use std::collections::VecDeque;

fn next_job(queue: &mut VecDeque<String>) -> Option<String> {
    queue.pop_front()
}
```

| Need | Start with |
| --- | --- |
| Append, traverse, or index a sequence | `Vec<T>` |
| Add and remove at both ends | `VecDeque<T>` |
| Fixed compile-time length | `[T; N]` |
| Fixed-length heap storage | `Box<[T]>` |
| Repeatedly take the greatest item | `BinaryHeap<T>` |
| Repeatedly take the least item | `BinaryHeap<Reverse<T>>` |
| Lookup by key without sorted order | `HashMap<K, V>` |
| Sorted keys or range queries | `BTreeMap<K, V>` |
| Membership and deduplication | `HashSet<T>` or `BTreeSet<T>` |
| Insertion order with keyed lookup | A suitable crate such as `indexmap` |

For a small collection, a scan through a vector can beat building and maintaining a set.
Use measured size and lookup frequency instead of replacing every `contains` call.
Use `LinkedList` only when its particular operations justify pointer overhead and allocation costs.

Do not depend on hash iteration order for user output, snapshots, or serialization.
Sort the result or choose a collection with the required order.
Use `sort_unstable` when equal-key items may change order. Use `sort` when their original order must be preserved.
Do not change a stored key's equality, hash, or ordering in a way that breaks the collection's rules.
