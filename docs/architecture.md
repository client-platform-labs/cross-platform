# Architecture

`cross-platform` shares a core across client targets without pretending targets are identical.

## Composition (locked)

`products.crossPlatform`:

- `preset` (default `h5-react-vite`)
- `sharedCore`
- `targets[]`: `{ id, capabilities[], support: "supported" | "experimental" }`

Project Manifest holds project-level `targets` / `tooling` only.

## Support policy

| Target | v1 |
| --- | --- |
| `h5` | supported |
| `mini-program` | experimental (warn/degrade) |
| RN | out of this product (sibling) |

## CLI

| Command | v1 |
| --- | --- |
| `init` | family files + H5 target stub |
| `add-target` | append target (experimental allowed with warning) |
| `generate` | types/constants + seam stubs |
| `validate` | kernel + product shape + experimental warnings |
| `preview` | H5 first |
| `doctor` | kernel + product checks |
