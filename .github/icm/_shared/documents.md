---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Documents — what is pinned for agents, and who owns its facts

The agent-facing files are the root `CLAUDE.md` (the entry) and this `.github/icm/` folder. Everything below is a document a person reads; each restates facts that a schema, script or workflow owns, and the owner is right when they disagree.

## Pinned

Each is a `fact` node in the workspace; a stage names one in its inputs when it needs it.

| Document | What it answers | Owner of the facts | Last changed |
|---|---|---|---|
| [README.md](../../../README.md) | the public front page: install, usage, the message type table, migration notes | `src/`, `docs/mqtt_schema/` | 2026-08-20 |
| [CONTRIBUTING.md](../../../CONTRIBUTING.md) | the contribution workflow, coding standards, schema change steps, the PR checklist | `eslint.config.mjs`, `package.json` | 2025-11-11 |
| [DEVELOPMENT.md](../../../DEVELOPMENT.md) | setup, the dual build, adding a message type, commit format, troubleshooting | `scripts/copy-schemas.cjs`, `tsconfig.json` | 2026-08-20 |
| [TESTING.md](../../../TESTING.md) | test layout, fixtures and their naming, coverage, benchmarks | `test/`, `vitest.config.mts` | 2025-12-11 |
| [PUBLISH_CHECKLIST.md](../../../PUBLISH_CHECKLIST.md) | the release procedure and the version decision | `.github/workflows/mqtt-schema-release.yml` | 2026-08-20 |
| [SECURITY.md](../../../SECURITY.md) | supported versions, private reporting, the package's security considerations | `package.json` | 2026-03-27 |
| [V080_BREAKING_CHANGES.md](../../../V080_BREAKING_CHANGES.md) | the one breaking release so far and its migration | `src/validators.ts` | 2025-11-08 |
| [docs/SCHEMA_MAP.md](../../../docs/SCHEMA_MAP.md) | every schema file, its purpose and its code | `docs/mqtt_schema/envelope.schema.json` | 2025-11-11 |
| [docs/SCHEMA_EXTENSIBILITY_GUIDE.md](../../../docs/SCHEMA_EXTENSIBILITY_GUIDE.md) | how to extend without breaking, deprecation, versioning | `docs/mqtt_schema/` | 2026-08-20 |
| [docs/SCHEMA_COVERAGE_AND_EXTENSIBILITY.md](../../../docs/SCHEMA_COVERAGE_AND_EXTENSIBILITY.md) | what the schemas cover and where they can grow | `docs/mqtt_schema/` | 2026-08-20 |
| [docs/HTTP_TRANSPORT_GUIDE.md](../../../docs/HTTP_TRANSPORT_GUIDE.md) | `transport_metadata` and bridging MQTT and HTTP | `docs/mqtt_schema/envelope.schema.json` | 2026-08-20 |
| [docs/OTA_MANIFEST.md](../../../docs/OTA_MANIFEST.md) | the OTA manifest variants and firmware status fields | `docs/mqtt_schema/ota/ota-manifest.schema.json` | 2025-10-19 |
| [docs/PAINLESSMESH_INTEGRATION.md](../../../docs/PAINLESSMESH_INTEGRATION.md) | carrying these messages over a painlessMesh network | `docs/mqtt_schema/mesh_bridge.schema.json` | 2025-10-23 |
| [docs/mqtt_schema/validation_rules.md](../../../docs/mqtt_schema/validation_rules.md) | the operational rules beyond structure: aliases, ranges, drop reasons | `docs/mqtt_schema/` | 2026-08-20 |

Not pinned: the two changelogs and the release summaries under `docs/releases/` (history, read by the release stages by path), the index in the `docs/` folder, the schema folder's own README (it carries contact addresses), and the code of conduct.

## Known drift

Each of these disagrees with its owner at the commit above; the owner is right, and a correction is its own pull request.

| Document | What it says | What is true, and where |
|---|---|---|
| `README.md` (badge and "Features"), `PUBLISH_CHECKLIST.md` "14. Principles" | Ajv is a peer dependency | `ajv` and `ajv-formats` are runtime `dependencies`; there are no `peerDependencies` (`package.json:158`) |
| `docs/mqtt_schema/validation_rules.md` "Message Type Codes (v0.7.2+)" | the list of allowed codes | that list predates v0.8.0; the codes are the envelope enum (`docs/mqtt_schema/envelope.schema.json:88`) and `src/validators.ts:225` |
| `docs/SCHEMA_EXTENSIBILITY_GUIDE.md` "Package Version (npm)" | current version 0.8.1 | a version kept by hand; the version is `package.json:3` |
| `PUBLISH_CHECKLIST.md` "6. Commit & Tag (Manual Path)", "7. Publish (Manual Path)" | tag and publish by hand | the workflow tags on merge and publishes on a `release:` title; a hand-pushed tag makes it skip the publish ([release.md](release.md)) |
