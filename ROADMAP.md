# Roadmap

## Now

- CLI: `init`, `add-target`, `generate`, `preview`, `validate`, `doctor`
- Default preset: `h5-react-vite`
- Config (locked): `products.crossPlatform` with `sharedCore` + `targets[{ id, capabilities[], support }]`
- Support policy (locked): `h5` supported; `mini-program` experimental
- `generate` v1 (locked): capability types/constants + per-target seam stubs

## Next

- Implement config shape on `init`, real `generate`, warn-on-experimental in `validate`.
- H5 `preview` path before any mini-program runtime.

## Later

- Broader capability matrix and more targets.
- Codegen for capability fallbacks.

## Non-goals for v1

- Treating mini-program as a supported promise.
- Replacing RN delivery.
- Claiming all targets share one runtime.
