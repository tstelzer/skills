# Measure the work that users wait for

Start with a representative input and the program's optimized build.
Record the result before changing code, then compare the same workload after the change.

## Bad

```rust
let start = std::time::Instant::now();
let _result = 17_u64 * 23;
println!("{:?}", start.elapsed());
```

The compiler can remove the work, and one tiny timing includes noise unrelated to the operation.

## Good

This example uses Criterion. Wire it into the project's existing benchmark target.

```rust
use criterion::{Criterion, criterion_group, criterion_main};
use std::hint::black_box;

fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

fn benchmark(criterion: &mut Criterion) {
    let text = "alpha beta gamma ".repeat(4096);
    criterion.bench_function("count words", |bench| {
        bench.iter(|| black_box(count_words(black_box(&text))))
    });
}

criterion_group!(benches, benchmark);
criterion_main!(benches);
```

`black_box` discourages optimizations that would make the benchmark unlike its intended use.
It does not make a benchmark realistic by itself.
Keep setup outside the timed loop unless setup is the thing being measured.
Use batched setup for work that consumes or mutates its input.

## Match the evidence to the question

- Use CPU profiles for expensive computation and frequently called code.
- Use allocation and heap profiles for allocation rate and retained memory.
- Measure latency as well as throughput when queues or contention can make callers wait.
- Keep useful symbols and stack traces in the build being profiled.
- Compare normal and worst relevant inputs, including collection lengths and concurrency levels.
- Check that the faster implementation produces the same required result.

Optimize algorithms, I/O frequency, and unnecessary copies before adding unsafe code or compiler hints.
Batch repeated small I/O with `BufReader` or `BufWriter` when the buffering fits latency and memory needs.
Handle explicit flush errors; see [resources](../memory/resources.md).
Do not add a universal ban on `chain`, `format!`, dynamic dispatch, or bounds checks based on one microbenchmark.
