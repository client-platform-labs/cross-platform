# Architecture

`cross-platform` helps teams share a core across client targets without pretending those targets are identical. Differences are modeled, generated, and validated.

## Family constraints already decided

- Runtime: Node.js 24.x LTS + TypeScript.
- CLI framework: `commander`.
- Packaging: ESM-first npm packages with a `bin` entry.
- Command loading: static core commands; heavy/optional paths via `import()`.
- Config: human-authored JSONC, validated with JSON Schema 2020-12 via Ajv.
- Documents carry `schemaVersion` and migrate before validation.

Exact family config filenames are not locked yet.

## Product shape

```text
CLI  ->  shared core  ->  target adapters  ->  generated seams  ->  per-target preview
```

- **CLI**: init, add-target, generate, preview, validate, doctor.
- **Shared core**: business logic and portable UI pieces that are actually portable.
- **Target adapters**: H5, mini program, and other runtime shims.
- **Capability model**: what each target supports, required fallbacks, and forbidden APIs.
- **Presets**: common target combinations.

## Proposed package split

- `cross-platform` CLI package
- `@.../shared-core`
- `@.../target-h5` / `@.../target-mini-program` / ...
- `@.../codegen`
- `examples/*`

## Inputs and outputs

| Flow | Input | Output |
| --- | --- | --- |
| `init` | chosen targets | monorepo or workspace with shared core |
| `add-target` | new target id | adapter stub + capability manifest |
| `generate` | core + target manifests | seams, shims, and type guards |
| `preview` | one target | running target-specific app |
| `validate` | core usage vs capabilities | leakage and incompatibility report |

## What this repo should own

- Shared-core versus adapter boundary.
- Target capability model.
- Codegen and per-target preview.
- Multi-target examples.

## What should probably live in a family kernel

- CLI bootstrap and diagnostics.
- Config/manifest load, migrate, validate.
- Plugin registry and lazy loading.
- Workspace/project discovery.

That split is pending `shared kernel boundaries`.
