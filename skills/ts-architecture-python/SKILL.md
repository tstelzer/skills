---
name: ts-architecture-python
description: >-
  Python application and package architecture. Use when scaffolding an application or package, adding a domain or
  feature, changing module boundaries, or adding infrastructure.
---

# Python architecture

- Read skill: ts-principles before applying this reference.

## Project and package boundaries

- Keep code released together in one project with one pyproject.toml.
- Create separate projects when dependency or release requirements need separate ownership.
- Use import packages directly under workspaces/, such as workspaces/api/ and workspaces/orders/.
- Give executable code and reusable capabilities clear owners.
- Add lib only when shared library code exists.
- Keep domains inside their owning package.
- Keep tests with the package or domain they cover.
- Use snake_case module names.

## Domain modules

- Keep a concept's Pydantic models, related errors, and operations in its domain module.
  A module can contain several related declarations.
- Use top-level functions for stateless work.
- Use methods for work that needs constructor dependencies, private state, or resource ownership.
- Let a domain object own its storage operations while they form one responsibility.
  Split out a repository when storage needs a separate owner.
- Do not generate a service, repository, and abstract interface for every domain concept.
- Reuse a parsed model internally when it already expresses the right contract.
- Create separate transport or storage models when their contracts differ.

## Entrypoints and resource ownership

- Give each executable a main() function and a package __main__.py.
- Run packages through python -m package or a declared console entrypoint.
- Keep reusable operations outside __main__.py.
- Read runtime inputs and assemble dependencies at startup.
- Pass dependencies through constructors or function arguments.
- Importing application modules must not read runtime configuration, connect clients, or start work.
- Load optional backend libraries inside the operation that loads that backend.
- Use with, async with, or an ExitStack to tie resource cleanup to its owner.
- Keep startup and shutdown together.
- Pass application dependencies into an application factory.
- Keep framework request objects and dependency lookup inside the protocol boundary.

## Typed boundaries

- Use Pydantic for structured boundary parsing.
- Use TypeAdapter for collections, unions, and other types that do not need a wrapper model.
- Put normalization and constraints in the schema that owns the value.
- Choose coercion deliberately.
- Reject unknown fields in application-owned contracts.
- Prefer frozen models for parsed values.
- Use frozen dataclasses for internal records that need no runtime parsing.
- Use immutable collections where values must stay unchanged.
  Frozen fields do not freeze their contents.
- Keep untyped vendor values inside adapters.
- Expose typed application operations and results.

## Configuration

- Give each executable or capability its own typed configuration schema.
- Keep configuration names consistently UPPER_CASE in TOML, environment variables, schema fields, and application code.
  Preserve the same spelling throughout the app. Do not alias or rename configuration fields to another casing.
- Keep configuration models free of environment reads.
- Put editable non-secret settings in TOML beside their owner.
- Keep fixed domain rules in code.
- Read environment values at startup and pass them explicitly to the parser.
- Apply schema defaults, then TOML values, then known environment values.
- Reject unknown TOML keys.
- Ignore unrelated process variables.
- Pass only the settings a dependency needs.
- Keep secrets in redacted types and reveal them at the client boundary.

## Dependencies and execution

- Use concrete dependencies until callers need a shared interface.
- Add a Protocol for an actual substitution boundary.
- Keep stateful external clients behind application adapters.
- Use pure library functions directly where they belong.
- Choose synchronous or asynchronous execution from the work and its dependencies.
- Keep blocking calls out of the event loop.
