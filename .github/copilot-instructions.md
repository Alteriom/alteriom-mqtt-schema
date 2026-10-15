# Copilot Instructions for @alteriom/mqtt-schema

The instructions for every agent on this repository, Copilot included, are the root [`CLAUDE.md`](../CLAUDE.md): what the package is, where things live, and the route to take by what just happened (fix, schema change, release, dependency bump). Start there and follow the route; each stage names the few files it needs.

The facts live once, in [`.github/icm/_shared/`](icm/_shared/CONTEXT.md), each pointing at the file that owns it:

- [architecture.md](icm/_shared/architecture.md): `docs/mqtt_schema/` is the source of truth; what the build copies and generates (`src/schema_data.ts` and `src/generated/` are never edited by hand); the validators and the classifier.
- [build-and-test.md](icm/_shared/build-and-test.md): `npm run build` before any test; `npm test`, `npm run verify`; what CI runs and what it skips.
- [schema-rules.md](icm/_shared/schema-rules.md): what a schema change costs in version, the message type codes, the field rules, every file a new message type touches.
- [release.md](icm/_shared/release.md) and [gotchas.md](icm/_shared/gotchas.md): how a version is published, and the traps.

## Specific to Copilot

- The Copilot coding agent works on a branch and opens a pull request; it never titles one `release:` (that merge publishes to npm), never changes `package.json`'s version outside a release, and never pushes a tag.
- Its MCP configuration is `.github/copilot-mcp.json`.
