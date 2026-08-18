# Roadmap

Command-shell track for Client Platform Labs v1.

## Now

- CLI surface (locked, mostly stubbed): `init`, `add-target`, `generate`, `preview`, `validate`, `doctor`.
- Default preset (locked): `h5-react-vite`.
- Native mini-program targets remain experimental per the family compatibility matrix.
- `init` / `doctor` / `validate` should write and check family config; other commands may stub.

## Next

- Shared-core vs adapter boundary and capability manifests.
- Second target only after H5 path is real.

## Later

- Broader target matrix and codegen for seams.

## Non-goals for v1

- Claiming all targets are the same runtime.
- Replacing RN delivery.
- Treating native mini-programs as a supported v1 promise.
