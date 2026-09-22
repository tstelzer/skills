# Recursive Schemas

## What it is
Schemas that refer to themselves, usually for trees, nested comments, menus, or graph-like nodes.

## When to use
- A model contains children of the same model
- You need nested data with repeating structure

## Quick rules
- Bound depth and collection size when recursive input is untrusted.
- Use getter-based self-reference only when another boundary already enforces those bounds.
- Zod preserves reference cycles in input graphs. This prevents infinite recursion but does not impose depth or size
  limits.
- Keep recursion focused on structure; put business rules in refinements or separate code.
- Make the terminal depth reject further children instead of traversing without a bound.

## Minimal examples
```ts
import * as z from "zod"

type Category = {
  name: string
  children: Category[]
}

const categorySchema = (remainingDepth: number): z.ZodType<Category> =>
  z.object({
    name: z.string().min(1),
    children: remainingDepth === 0
      ? z.array(z.never()).max(0)
      : z.array(categorySchema(remainingDepth - 1)).max(100),
  })

const Category = categorySchema(20)
```

```ts
const Node = z.object({
  name: z.string(),
  get children() {
    return z.array(Node)
  },
})

const input: z.input<typeof Node> = { name: "root", children: [] }
input.children.push(input)

const output = Node.parse(input)
output.children[0] === output
```

## Common pitfalls
- Trying to inline a self-reference without a lazy getter
- Parsing untrusted recursive data without hard depth and collection bounds
- Assuming cycle support also protects against deeply nested or very large acyclic input
- Mixing recursive structure and heavy transform logic in one schema

## See also
- `../sections/30-composition.md`
- `unions-and-optionality.md`
- `refinements.md`
