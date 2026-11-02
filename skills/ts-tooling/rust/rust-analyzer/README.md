# rust-analyzer

Use the rust-analyzer and `rust-src` components from the selected [Rust toolchain](../toolchain/README.md).
`rust-src` lets the editor navigate and complete standard-library code.

Use the editor's Rust Analyzer integration. Make it launch rust-analyzer and Cargo from the project environment.
For Nix projects, configure the editor to use the shell's server rather than downloading a second copy.

Keep editor-only settings in the editor configuration. Use the repository's check recipes for CI.

See [rust-analyzer installation](https://rust-analyzer.github.io/book/installation.html).
