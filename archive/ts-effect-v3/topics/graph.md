# Graph

## What it is

`Graph` models immutable directed or undirected graphs with indexed nodes and
edges. Construction uses a bounded mutable callback and returns an immutable
graph.

## When to use

- Dependency graphs, routing, ordering, and graph algorithms
- Directed predecessor or successor queries

## Minimal example

```ts
import { Graph } from "effect"

const graph = Graph.directed<string, string>((mutable) => {
  const build = Graph.addNode(mutable, "build")
  const test = Graph.addNode(mutable, "test")
  const deploy = Graph.addNode(mutable, "deploy")

  Graph.addEdge(mutable, build, test, "then")
  Graph.addEdge(mutable, test, deploy, "then")
})

const afterBuild = Graph.successors(graph, 0)
const beforeDeploy = Graph.predecessors(graph, 2)
```

`successors` and `predecessors` require a directed graph. Use `neighbors` for
an undirected graph. `neighborsDirected` is deprecated in `effect@3.22.0`.

## Common pitfalls

- Treating node data as the node index
- Using directed neighbor APIs on an undirected graph
- Depending on mutable construction state after `directed` or `undirected`

## See also

- `../sections/10-core-patterns.md`
- `match.md`
