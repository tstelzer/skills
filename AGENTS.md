## RULES
- Do not explain the "why" (unless explicitly prompted), only show the "how" of skills.
- Prefer compact code snippets over long explanations.
- Do not strictly follow the structure of reference pages, simplify and group.
- Keep the main SKILL.md compact and to the point. For more specialized information, co-locate `*.md` files (sub-skills) next to the `SKILL.md`. These should not include frontmatter. Reference them like this in the `SKILL.md` top-level:
```md
## Additional Resources

[For deriving http clients](./effect-derive-http-client.md)
[For creating middlewares](./effect-http-middleware.md)
[For deriving swagger UIs](./effect-http-swagger.md)
[For multipart uploads](./effect-http-multipart.md)
[For streaming](./effect-http-streaming.md)
```