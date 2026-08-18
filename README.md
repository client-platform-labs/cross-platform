# cross-platform

Client platform cross-platform and multi-target engineering toolkit.

## Vision

`cross-platform` is intended to support one-codebase or shared-core development across multiple client targets such as H5, mini programs, and other runtime environments. The goal is a reusable platform that makes target differences explicit without giving up code reuse.

## Scope

This repository is intended to cover:

- shared-core and adapter-based architecture patterns
- target capability modeling and compatibility checks
- multi-target build, preview, and validation workflows
- CLI commands, templates, presets, and code generation
- examples showing how shared code maps onto different runtimes

This repository should not claim that all targets are identical or hide runtime differences behind unsafe abstractions.

## Planned Shape

The expected product shape is:

- a CLI for bootstrap, target registration, validation, and generation
- shared core libraries plus per-target adapters
- config, manifest, and schema conventions for target capabilities
- presets for common target combinations
- examples and demos for end-to-end multi-target development

## Initial Milestones

1. Define the shared-core versus adapter boundary.
2. Decide how targets and capabilities are declared in manifests.
3. Design the package split for CLI, shared runtime, and target adapters.
4. Build a minimal demo spanning at least two distinct client targets.

## Working Principles

- reuse the core, not assumptions
- differences between targets must be modeled, not ignored
- generator and validation workflows should be first-class
- portability must not come at the cost of debuggability
