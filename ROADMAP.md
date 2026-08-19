# Roadmap

## Now

- CLI: `init`, `add-target`, `generate`, `preview`, `validate`, `doctor`
- Config: `products.crossPlatform` with `sharedCore` + `targets[{ id, capabilities[], support }]`
- Support policy: `h5` supported; `mini-program` experimental
- `generate`: capability types/constants + per-target seam stubs
- `preview`: H5 static page; experimental targets warn (`--write-only` available)

## Next

- Capability fallback codegen
- Richer H5 preview against sharedCore

## Later

- Broader capability matrix and more targets

## Non-goals for v1

- Treating mini-program as supported
- Replacing RN delivery
- Claiming all targets share one runtime
