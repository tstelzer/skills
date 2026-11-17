---
name: ts-architecture-typescript
description: TypeScript application and package architectur
---

# TypeScript architecture

## Start here

1. Read skill: ts-principles.
2. Read the relevant sections of [shared architecture](./shared.md).
3. Check whether the application or package uses NestJS, Effect, both, or neither. Read the matching row below.
   Choose from its dependencies and runtime owner.

| Code uses | Read |
| --- | --- |
| Plain Typescript | [Plain TypeScript](./plain-typescript.md) |
| Only NestJS | [NestJS](./nestjs.md) |
| Only Effect | [Effect](./effect.md) |
| Combined NestJS and Effect | [NestJS](./nestjs.md), [Effect](./effect.md), then [their integration](./nestjs-effect.md) |

For a new application, choose the execution style from its needs before following a row.
Read only the selected path. Each path applies the shared rules to its dependency and resource model.

## Shared architecture index

- [Workspace and package boundaries](./shared.md#workspace-and-package-boundaries)
- [Executables and CLI structure](./shared.md#executables)
- [File roles and adapters](./shared.md#file-roles)
- [Configuration and secrets](./shared.md#configuration-and-secrets)
- [Library selection](./shared.md#library-selection)
