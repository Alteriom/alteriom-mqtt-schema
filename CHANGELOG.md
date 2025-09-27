# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-09-27
### Added
- OTA firmware manifest JSON Schema (`schemas/ota/ota-manifest.schema.json`) supporting rich and minimal variants.
- Validation fixtures for four manifest shapes (rich dev, rich prod w/chunk objects, rich prod w/hash array, minimal dev).
- Validation script `scripts/validate-ota-manifest.js` and CI workflow (pending directory resolution) to enforce schema correctness.
- TypeScript definitions `types/ota-manifest.d.ts` with discriminators helpers.

### Notes
- Workflow file creation for OTA manifest validation will be finalized once `.github/workflows` path acceptance via API is resolved (fallback: add via direct commit if blocked).
- Version bumped minor due to new public schema + types surface.

## [0.2.1] - 2025-09-??
- Previous release (see earlier history).
