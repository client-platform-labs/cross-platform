# Architecture

`cross-platform` helps teams share a core across client targets without pretending those targets are identical. Differences are modeled, generated, and validated.

## Family constraints already decided

- Runtime: Node.js 24.x LTS + TypeScript.
- CLI framework: `commander`.
- Packaging: ESM-first npm packages under `@client-platform/*`, with Product `bin` entries plus family command `client-platform`.
- Plugin metadata: `package.json#clientPlatform`.
- Command loading: static core commands; heavy/optional paths via `import()`.
- Config: human-authored JSONC, validated with JSON Schema 2020-12 via Ajv.
- Documents carry `schemaVersion` and migrate before validation.

Family files:

- Workspace config: `client-platform.config.jsonc`
- Project manifest: `client-platform.manifest.jsonc`

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

- `@client-platform/cross-platform` CLI package, bin `cross-platform`
- `@client-platform/shared-core`
- `@client-platform/target-h5` / `@client-platform/target-mini-program` / ...
- `@client-platform/codegen`
- `examples/*`

This Product is also loadable by the Umbrella CLI `client-platform` through `package.json#clientPlatform`.

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

## What lives in the family kernel

Kernel is a separate repository, `client-platform-labs/kernel`. This product depends on it; it does not reimplement it.

Kernel owns:

- CLI bootstrap and diagnostics.
- Config/manifest load, migrate, validate.
- Plugin registry and lazy loading.
- Workspace/project discovery.
