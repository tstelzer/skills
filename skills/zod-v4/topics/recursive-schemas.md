# Recursive Schemas

## What it is
Schemas that refer to themselves, usually for trees, nested comments, menus, or graph-like nodes.

## When to use
- A model contains children of the same model
- You need nested data with repeating structure

## Quick rules
- Use getter-based self-reference inside `z.object(...)` for recursive object schemas.
- Keep recursion focused on structure; put business rules in refinements or separate code.
- Consider depth limits outside Zod if inputs may be adversarially deep.

## Minimal examples
```ts
import * as z from "zod"

const Category = z.object({
  name: z.string(),
  get children() {
    return z.array(Category)
  },
})
```

```ts
const Comment = z.object({
  id: z.uuid(),
  body: z.string(),
  get replies() {
    return z.array(Comment)
  },
})
```

## Common pitfalls
- Trying to inline a self-reference without a lazy getter
- Mixing recursive structure and heavy transform logic in one schema
- Assuming recursive schemas protect against cyclic runtime objects automatically

## See also
- `../sections/30-composition.md`
- `unions-and-optionality.md`
- `refinements.md`
