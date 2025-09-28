# MQTT Schema Artifacts Changelog

## 2025-09-28 (v0.3.1)

### Added (v0.3.1)

- Added stable OTA manifest alias export (`@alteriom/mqtt-schema/ota-manifest`)
- Added multi-runtime Node validation matrix (18.x, 20.x) for OTA manifest validation workflow
- Added general schema verification workflow (Ajv compile + fixture validation + id/ref checks)
- Added unified verify script & `npm run verify:all`
- Added README badges and usage examples
- Internal: improved validation consistency (duplicate id & ref checks)

### Fixed (v0.3.1)

- Fixed schema verification script to handle cross-schema references properly
- Fixed copy-schemas script to handle subdirectories (ota/) correctly

### Notes (v0.3.1)

- CI hardening release: enhanced validation workflows and tooling
- No breaking changes to existing schema JSON or validator logic
- Node 18+ tested; Node 20 primary support
- Deep path import remains fully supported for backward compatibility

## 2025-09-27 (v0.3.0)

### Added (v0.3.0)

- OTA firmware manifest JSON Schema (`schemas/ota/ota-manifest.schema.json`) supporting both rich and minimal manifest variants.
- Validation fixtures for four manifest shapes (rich dev, rich prod w/chunk objects, rich prod w/hash array, minimal dev) under `test/artifacts/ota/`.
- Validation script `scripts/validate-ota-manifest.js` (invoked via `npm run validate:ota`).
- TypeScript definitions `types/ota-manifest.d.ts` including discriminated union helpers.

### Notes (v0.3.0)

- Pending CI: Dedicated GitHub Actions workflow to automatically validate OTA manifest fixtures will be added in a follow-up (previous attempt blocked by path creation limitation in automation interface).
- Minor version bump justified by new publicly consumable schema & types (no breaking changes to existing MQTT payload schemas; `schema_version: 1` unchanged).

## 2025-09-22 (v0.2.1)

### Fixed (v0.2.1)

- Moved GitHub Actions YAML files from `.github/workflow/` to `.github/workflows/` so automation triggers correctly.
- Added verification steps to manual publish workflow (schema + changelog guards).

### Notes (v0.2.1)

- Patch release: infrastructure/CI only; no schema JSON or validator logic changes.

## 2025-09-22 (v0.2.0)

### Added (v0.2.0)

- Schema diff guard (`scripts/check-schema-sync.cjs`) to ensure copied schemas are in sync with source-of-truth.
- Release integrity check (`scripts/check-release-integrity.cjs`) validating CHANGELOG contains current version.
- Composite `npm run verify` (schemas + changelog + tests) documented in checklist and copilot instructions.

### Changed (v0.2.0)

- Release workflow now executes verification before tagging/publishing.

### Notes (v0.2.0)

- No schema JSON structural changes versus 0.1.1; validator logic unchanged. Safe upgrade for consumers.


## 2025-09-20 (Embedded Schema Distribution & Tooling Package 0.1.1)

### Added

- Published npm package `@alteriom/mqtt-schema` with dual CJS + ESM builds.
- Embedded all schema JSON directly into generated TypeScript module to eliminate runtime file path resolution issues under ESM.
- Added precompiled Ajv validators and classification helper.

### Changed

- Validation now uses in-memory constants; raw JSON schema files remain for reference/tooling but are no longer required at runtime.

### Notes

- This is a tooling/package level enhancement only—wire format (`schema_version: 1`) unchanged.
- Recommended consumer update if previously experimenting with earlier unpublished drafts.

## 2025-09-20 (Initial Set)

- Introduced base envelope schema (`envelope.schema.json`).
- Added sensor data (`sensor_data.schema.json`).
- Added sensor heartbeat (`sensor_heartbeat.schema.json`).
- Added sensor status (`sensor_status.schema.json`).
- Added gateway metrics (`gateway_metrics.schema.json`).
- Added gateway info (`gateway_info.schema.json`).
- Added firmware update status (`firmware_status.schema.json`).
- Added control/command response (`control_response.schema.json`).
- Added operational validation rules (`validation_rules.md`).

## Version Semantics

- These schemas describe `schema_version: 1` payloads.
- Backward-compatible additions will append properties (kept optional) and update this changelog without changing `schema_version`.
- Breaking changes create a parallel directory (`v2/`) and bump `schema_version` once firmware + backend are coordinated.
