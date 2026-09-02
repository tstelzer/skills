/**
 * @title Working with child processes
 *
 * This example shows how to collect process output, compose pipelines, and stream long-running command output.
 */
import { NodeServices } from "@effect/platform-node"
import { Console, Context, Effect, Layer, PlatformError, Schema, Stream, String } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"

export class DevToolsPlatformError extends Schema.TaggedError<DevToolsPlatformError>()(
  "DevToolsPlatformError",
  {
    operation: Schema.Literals([
      "node --version",
      "git diff",
      "git log",
      "pnpm lint-fix spawn",
      "pnpm lint-fix output",
      "pnpm lint-fix exit"
    ]),
    reason: Schema.instanceOf(PlatformError.PlatformError)
  }
) {}

export class CommandFailed extends Schema.TaggedError<CommandFailed>()("CommandFailed", {
  command: Schema.String,
  exitCode: Schema.Int
}) {}

export type DevToolsError = DevToolsPlatformError | CommandFailed

const mapPlatformError = (operation: DevToolsPlatformError["operation"]) =>
  Effect.mapError((reason: PlatformError.PlatformError) => new DevToolsPlatformError({ operation, reason }))

export class DevTools extends Context.Service<DevTools, {
  readonly nodeVersion: Effect.Effect<string, DevToolsError>
  readonly recentCommitSubjects: Effect.Effect<ReadonlyArray<string>, DevToolsError>
  readonly runLintFix: Effect.Effect<void, DevToolsError>
  changedTypeScriptFiles(baseRef: string): Effect.Effect<ReadonlyArray<string>, DevToolsError>
}>()("docs/DevTools") {
  // Keep the platform requirement visible. Provide NodeServices at the
  // application boundary below.
  static readonly layerNoDeps = Layer.effect(
    DevTools,
    Effect.gen(function*() {
      // To run child processes, we need access to a `ChildProcessSpawner`.
      const spawner = yield* ChildProcessSpawner.ChildProcessSpawner

      // Use `spawner.string` when you want to collect the entire output of a
      // command as a string. This runs `node --version` and collects the
      // output. `node --version` defines one line of textual output, so
      // removing its line ending is part of this adapter's contract. Do not
      // apply this normalization to opaque command output.
      const nodeVersion = spawner.string(
        ChildProcess.make("node", ["--version"])
      ).pipe(
        Effect.map(String.trim),
        mapPlatformError("node --version")
      )

      const changedTypeScriptFiles = Effect.fn("DevTools.changedTypeScriptFiles")(function*(baseRef: string) {
        yield* Effect.annotateCurrentSpan({ baseRef })

        // `spawner.lines` is a convenience helper for line-oriented command
        // output.
        const files = yield* spawner.lines(
          ChildProcess.make("git", ["diff", "--name-only", `${baseRef}...HEAD`])
        ).pipe(
          mapPlatformError("git diff")
        )

        return files.filter((file) => file.endsWith(".ts"))
      })

      // Build a pipeline from two command values. This runs:
      // `git log --pretty=format:%s -n 20 | head -n 5`
      const recentCommitSubjects = spawner.lines(
        ChildProcess.make("git", ["log", "--pretty=format:%s", "-n", "20"]).pipe(
          ChildProcess.pipeTo(ChildProcess.make("head", ["-n", "5"]))
        )
      ).pipe(
        mapPlatformError("git log")
      )

      const runLintFix = Effect.gen(function*() {
        // Use `spawn` when you want the process handle and stream output while
        // the process is still running.
        const handle = yield* spawner.spawn(
          ChildProcess.make("pnpm", ["lint-fix"], {
            env: { FORCE_COLOR: "1" },
            extendEnv: true
          })
        ).pipe(
          mapPlatformError("pnpm lint-fix spawn")
        )

        yield* handle.all.pipe(
          Stream.decodeText(),
          Stream.splitLines,
          Stream.runForEach((line) => Console.log(`[lint-fix] ${line}`)),
          mapPlatformError("pnpm lint-fix output")
        )

        const exitCode = yield* handle.exitCode.pipe(
          mapPlatformError("pnpm lint-fix exit")
        )

        if (exitCode !== ChildProcessSpawner.ExitCode(0)) {
          return yield* new CommandFailed({
            command: "pnpm lint-fix",
            exitCode
          })
        }
      }).pipe(
        // `spawner.spawn` adds a `Scope` requirement to manage the lifecycle of
        // the child process. We can use `Effect.scoped` to provide a `Scope`
        // and close it when the effect completes.
        Effect.scoped
      )

      return DevTools.of({
        nodeVersion,
        changedTypeScriptFiles,
        recentCommitSubjects,
        runLintFix
      })
    })
  )
}

const MainLayer = DevTools.layerNoDeps.pipe(
  Layer.provide(NodeServices.layer)
)

export const program = Effect.gen(function*() {
  const tools = yield* DevTools

  const version = yield* tools.nodeVersion
  yield* Effect.log(`node=${version}`)
}).pipe(
  // `ChildProcess` requires a platform implementation of
  // `ChildProcessSpawner`. Compose the Node implementation at this runtime
  // edge, outside the service implementation.
  Effect.provide(MainLayer)
)
