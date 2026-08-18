# Roadmap

This is the first delivery map for `cross-platform`. Shared-kernel ownership is still an open family decision.

## Now

- Keep the repository charter current.
- Lock the domain language: shared core, target, adapter, capability, generate.
- Define how targets declare what they can and cannot do.
- Define the first CLI surface: `init`, `add-target`, `generate`, `preview`, `validate`, `doctor`.

## Next

- Ship a local MVP with one shared core and two real targets, likely H5 plus one mini-program target.
- Make target differences visible in manifests and generated seams; do not hide them.
- Add an example that can be previewed per target from one repo.

## Later

- Add more targets and a compatibility matrix for APIs, styling, and storage.
- Add codegen for target seams and capability fallbacks.
- Align package layout with the family shared kernel once that boundary is decided.

## Non-goals for v1

- Claiming that all targets are the same runtime.
- Replacing RN delivery; RN remains a sibling product.
- Forcing one UI framework on every target.
