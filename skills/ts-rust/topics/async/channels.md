# Bound queues and choose what delivery means

A bounded channel makes producers wait or reject work when consumers fall behind.
It limits queued items, not the size of each item or the number of tasks waiting to send.

## Bad

```rust
let (sender, receiver) = tokio::sync::mpsc::unbounded_channel::<Vec<u8>>();
```

For an open-ended input stream, a slow receiver can cause unbounded memory growth.

## Good

```rust
let (sender, receiver) = tokio::sync::mpsc::channel::<Vec<u8>>(64);
```

The capacity is an example, not a default. Choose it from acceptable queued work and memory use.
Also limit message bytes, in-flight operations, and producer count.
Use `send().await` to wait for space, or handle `try_send` returning full when the caller must reject or shed work.
Handle closure as a separate outcome.

## Select the channel by its contract

| Channel | Meaning | Caller responsibility |
| --- | --- | --- |
| `mpsc` | Many senders, one consumer | Handle full or closed queues |
| `oneshot` | One result sent once | Handle the sender disappearing |
| `watch` | Current value with change notification | Expect intermediate values to be skipped |
| `broadcast` | Bounded history for multiple receivers | Handle lag and missed messages |

Use `watch` for state such as the latest configuration, not an event history.
Clone or copy needed data out of a watch borrow before awaiting other work.
Use `borrow_and_update` in a change loop when reading and marking the value seen should happen together.
Do not promise reliable delivery to every broadcast subscriber; a slow receiver can lag past retained values.

## Separate queue acceptance from completed work

Use a reply channel when a successful send is not enough.

```rust
use tokio::sync::{mpsc, oneshot};

#[derive(Debug)]
struct Request {
    text: String,
    reply: oneshot::Sender<usize>,
}

async fn count_words(sender: &mpsc::Sender<Request>, text: String) -> anyhow::Result<usize> {
    let (reply, response) = oneshot::channel();
    sender.send(Request { text, reply }).await?;
    Ok(response.await?)
}

async fn worker(mut receiver: mpsc::Receiver<Request>) {
    while let Some(request) = receiver.recv().await {
        let count = request.text.split_whitespace().count();
        // The caller may have gone away; the read-only work is already done.
        let _ = request.reply.send(count);
    }
}
```

This uses Tokio's `sync` feature and `anyhow`.
A reply timeout does not remove an already queued request or undo its effects.
Give resource-owning workers an explicit stop path; cycles of sender handles can keep a channel open forever.
Keep task spawning separate from the loop that processes requests so its owner can track completion.
