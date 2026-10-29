## Building CLI applications

Use `effect/cli` for command definitions, typed arguments, flags, and prompts.

Use `Command.validate` for rules across parsed values, such as mutually
exclusive flags. Single-valued flags reject repeated occurrences; use
`Flag.atLeast`, `atMost`, or `between` when repetition is part of the contract.

Use `Flag.withNegation` to name the negative form of a boolean flag or
`withoutNegation` to remove it. `Flag.withOptionalValue` accepts a bare flag
with a default value; an explicit value must use `--flag=value`.

Read ancestor flags from `HelpDoc.inheritedFlags` in custom formatters. Use
`CliOutput.Presenter` to replace or redirect built-in output and
`Completions.fromCommand` with `Completions.generate` for completion scripts.

Use `CliError.userMessage` to mark tagged handler errors whose messages should
be shown to the user. Prompt fallbacks run only when
`TerminalCapabilities.canPrompt` permits interaction.
