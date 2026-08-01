## Writing Effect services

Effect services are the most common way to structure Effect code. Prefer using
services to encapsulate behaviour over other approaches, as it ensures that your
code is modular, testable, and maintainable.

`Context.Service` does not make dependencies explicit by itself. Do not read
or mutate `process.env`, time, randomness, platform state, or other globals
inside a service implementation or test. Put ambient inputs in a service
requirement, `Context.Reference`, `Config`, or explicit layer options.

Before using `node:*` or a runtime global, check for an Effect capability such
as `FileSystem`, `Path`, `Clock`, `Crypto`, `Random`, or `Config`. Use
`layerNoDeps` for the implementation so its requirements remain visible. Add
`NodeServices.layer` or another platform layer at the application boundary.

Use a native API when the Effect capability cannot provide required semantics,
such as a specific file-open flag. Keep the native call narrow and record why
the capability is insufficient.
