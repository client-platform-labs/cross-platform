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

**Note:** native mini-program targets are experimental and are not a supported v1 promise.

## Local development

Requires Node.js 24.x LTS. This package depends on a local `../kernel` checkout via `file:` during scaffolding.

```bash
# from sibling kernel repo first:
#   cd ../kernel && npm install && npm run build
npm install
npm run build
node ./bin/cross-platform.js --help
```

CLI surface: `init`, `add-target`, `generate`, `preview`, `validate`, `doctor`. Default preset: `h5-react-vite`.

`init` writes minimal family config:

- `client-platform.config.jsonc` with `products.crossPlatform`
- `client-platform.manifest.jsonc` with H5 target stubs

`add-target`, `generate`, and `preview` are stubs in this command-shell milestone.

## Documents

- [Roadmap](./ROADMAP.md)
- [Architecture](./docs/architecture.md)

## Working Principles

- reuse the core, not assumptions
- differences between targets must be modeled, not ignored
- generator and validation workflows should be first-class
- portability must not come at the cost of debuggability
