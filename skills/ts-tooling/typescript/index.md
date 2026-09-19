# TypeScript tooling

Read only the matching tool folders.

| Tool | Folder | Condition |
| --- | --- | --- |
| Node.js | [`node/`](./node/) | Node.js runtime |
| Volta | [`volta/`](./volta/) | Work repositories only |
| pnpm | [`pnpm/`](./pnpm/) | Package management |
| TypeScript | [`typescript/`](./typescript/) | TypeScript compilation |
| tsx | [`tsx/`](./tsx/) | Direct TypeScript execution |
| Effect TypeScript tooling | [`effect-tsgo/`](./effect-tsgo/) | Effect projects only |
| Oxfmt and Oxlint | [`oxc/`](./oxc/) | Formatting and linting |
| Knip | [`knip/`](./knip/) | Unused code and dependency checks |
| Vite | [`vite/`](./vite/) | Development server and builds |
| Vitest | [`vitest/`](./vitest/) | Tests |
| Madge | [`madge/`](./madge/) | Circular dependency checks |
| Changesets | [`changesets/`](./changesets/) | Published packages only |

## Selection

- Use Volta only in work repositories. Never add it to the flake.
- Use `@effect/tsgo` in Effect projects. The `@effect/language-service` string remains the `tsconfig` plugin name,
  but TypeScript 7 projects do not install that package.
- Use Changesets only when the TypeScript repository publishes packages.
- Use Vite only when the project needs its development server or build pipeline.

Merge each selected `package.fragment.jsonc` into the root `package.json`. Do not copy fragments as standalone
project files. Reconcile duplicate `scripts`, `devDependencies`, `engines`, and package-manager fields once at the
end.
