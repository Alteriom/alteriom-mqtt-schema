# MQTT Schema Artifacts Changelog

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
- Added gateway metrics (`gateway_metrics.schema.json`).
- Added gateway info (`gateway_info.schema.json`).
- Added sensor status (`sensor_status.schema.json`).
- Added firmware update status (`firmware_status.schema.json`).
- Added control/command response (`control_response.schema.json`).
- Added operational validation rules (`validation_rules.md`).

## Version Semantics

- These schemas describe `schema_version: 1` payloads.
- Backward-compatible additions will append properties (kept optional) and update this changelog without changing `schema_version`.
- Breaking changes create a parallel directory (`v2/`) and bump `schema_version` once firmware + backend are coordinated.
