# MQTT Schema Artifacts Changelog

## 2025-10-19 (v0.7.0 - OTA Enhancement Release)

### Added (v0.7.0 - OTA Features)

This release implements a comprehensive best-in-class OTA management solution based on industry standards for IoT firmware updates in 2024.

#### Enhanced OTA Manifest Schema (`ota-manifest.schema.json`)

**Security & Authenticity:**
- `signature` (string): Digital signature of firmware for authenticity verification (base64 encoded)
- `signature_algorithm` (enum): RSA-SHA256 | ECDSA-SHA256 | Ed25519
- `signing_key_id` (string): Key identifier for key rotation support

**Version Constraints & Dependencies:**
- `min_version` (string): Minimum firmware version required to upgrade
- `max_version` (string): Maximum version that can upgrade (prevents downgrades)

**Release Management:**
- `release_notes_url` (string, URI): Link to changelog/documentation
- `criticality` (enum): low | medium | high | critical - for prioritization
- `mandatory` (boolean): Whether update must be installed (cannot be skipped)
- `deprecated` (boolean): Mark version as deprecated (not recommended for new installs)
- `expiry_date` (string, date-time): When firmware expires and should no longer be installed

**Staged Rollout & A/B Testing:**
- `rollout_percentage` (number, 0-100): Percentage of fleet to receive update
- `rollout_target_groups` (array of strings): Specific device groups for A/B testing

**Delta/Patch Updates:**
- `delta_from_version` (string): Source version for delta update
- `delta_patch_url` (string, URI): URL to download delta patch
- `delta_patch_size` (integer): Size of delta patch in bytes
- `delta_patch_sha256` (string): SHA256 hash of delta patch

All OTA manifest enhancements are **OPTIONAL** and fully backward compatible.

#### Enhanced Firmware Status Schema (`firmware_status.schema.json`)

**Extended Status Values:**
- Added `rolled_back`: Automatic rollback completed
- Added `rollback_pending`: Rollback in progress
- Added `rollback_failed`: Rollback unsuccessful (critical state)

**Progress Tracking:**
- `download_speed_kbps` (number): Current download speed in kilobits per second
- `bytes_downloaded` (integer): Bytes received so far
- `bytes_total` (integer): Total firmware size
- `eta_seconds` (integer): Estimated time remaining
- `retry_count` (integer): Number of retry attempts

**Security Verification:**
- `signature_verified` (boolean): Whether firmware signature was verified
- `checksum_verified` (boolean): Whether firmware checksum was verified
- `update_type` (enum): full | delta | patch

**Rollback Support:**
- `rollback_available` (boolean): Whether rollback is available
- `previous_version` (string): Version to rollback to if update fails
- `error_code` (string): Machine-readable error classification

**Operational Context:**
- `update_started_at` (string, date-time): When update began
- `update_completed_at` (string, date-time): When update completed or failed
- `free_space_kb` (integer): Storage space before update
- `battery_level_pct` (number, 0-100): Battery level during update

All firmware status enhancements are **OPTIONAL** and fully backward compatible.

#### Test Fixtures & Examples

- Added `test/artifacts/ota/rich-signed-with-rollout.json`: Full-featured manifest with signatures and staged rollout
- Added `test/artifacts/ota/rich-delta-update.json`: Delta/patch update example
- Added `test/artifacts/ota/minimal-signed.json`: Minimal manifest with security features
- Added `docs/mqtt_schema/fixtures/firmware_status_downloading_enhanced.json`: Enhanced download status
- Added `docs/mqtt_schema/fixtures/firmware_status_completed_enhanced.json`: Completed update with verification
- Added `docs/mqtt_schema/fixtures/firmware_status_rollback.json`: Rollback scenario example

#### Documentation

- Comprehensive OTA best practices guide in `docs/OTA_MANIFEST.md`
- Security recommendations (digital signatures, key rotation)
- Rollback and fail-safe strategies
- Delta/patch update implementation guidance
- Staged rollout deployment strategies
- Update prioritization guidelines
- Release management best practices

### Changed (v0.7.0)

- Updated `docs/OTA_MANIFEST.md` with detailed documentation of all new fields
- Updated `docs/mqtt_schema/validation_rules.md` to document firmware status enhancements
- Enhanced OTA manifest validation to support new optional security and deployment fields

### Industry Standards Alignment (v0.7.0)

This release aligns with IoT OTA best practices from industry leaders:
- **Security**: Digital signatures and cryptographic verification (NIST guidelines)
- **Reliability**: Atomic updates, rollback mechanisms, redundant storage
- **Efficiency**: Delta updates for bandwidth optimization (60-90% reduction)
- **Scalability**: Staged rollout, A/B testing, fleet management
- **Observability**: Comprehensive status tracking, error diagnostics

### Migration Notes (v0.7.0)

- **Backward Compatible**: All existing manifests and firmware status messages remain valid
- **Gradual Adoption**: New fields are optional; implement incrementally
- **No Breaking Changes**: `schema_version: 1` unchanged
- **Firmware Updates**: Devices can adopt new fields at their own pace
- **Web Applications**: Gracefully handle messages with or without new fields

### Notes (v0.7.0)

- Minor version bump justified by substantial new optional OTA management features
- Focus on production-grade OTA deployment for enterprise IoT environments
- Enables secure, reliable, and efficient firmware updates at scale
- Maintains full backward compatibility with all existing MQTT payloads
- Firmware can implement features incrementally based on hardware capabilities
- Particularly valuable for:
  - Security-critical deployments requiring signed firmware
  - Large-scale fleets needing staged rollout capabilities
  - Bandwidth-constrained environments benefiting from delta updates
  - Mission-critical systems requiring fail-safe rollback mechanisms

## 2025-10-19 (v0.6.0)

### Added (v0.6.0)

- **Enhanced Location Support**: Added optional `location` object to base envelope schema with standardized geospatial fields
  - `latitude` (number, -90 to 90): GPS latitude coordinate
  - `longitude` (number, -180 to 180): GPS longitude coordinate
  - `altitude` (number): Altitude in meters
  - `accuracy_m` (number, >= 0): Position accuracy in meters
  - `zone` (string): Logical zone identifier (e.g., warehouse_A, floor_2)
  - `description` (string): Human-readable location description

- **Enhanced Environment Metadata**: Added optional `environment` object to base envelope schema
  - `deployment_type` (enum): indoor/outdoor/mobile/mixed
  - `power_source` (enum): battery/mains/solar/mixed/other
  - `expected_battery_life_days` (integer): Expected battery life in days for battery-powered devices

- **Enhanced Sensor Data Fields**: Extended sensor entry properties with metadata for data quality and calibration tracking
  - `timestamp` (string, ISO 8601): Per-sensor reading timestamp (useful for async multi-sensor polling)
  - `accuracy` (number, >= 0): Sensor accuracy (±value in sensor units)
  - `last_calibration` (string, ISO 8601 date): Last calibration date
  - `error_margin_pct` (number, 0-100): Error margin as percentage
  - `operational_range` (object): Valid operational range with `min` and `max` properties

- **Enhanced Gateway Metrics**: Extended gateway metrics with storage, network, and system health indicators
  - `storage_usage_pct` (number, 0-100): Disk/flash storage usage percentage
  - `storage_total_mb` (number, >= 0): Total storage capacity in megabytes
  - `storage_free_mb` (number, >= 0): Free storage space in megabytes
  - `network_rx_kbps` (number, >= 0): Network receive bandwidth in kilobits per second
  - `network_tx_kbps` (number, >= 0): Network transmit bandwidth in kilobits per second
  - `active_connections` (integer, >= 0): Number of active network connections
  - `error_count_24h` (integer, >= 0): Error count in last 24 hours
  - `warning_count_24h` (integer, >= 0): Warning count in last 24 hours
  - `restart_count` (integer, >= 0): Total restart counter since deployment
  - `last_restart_reason` (string): Reason for last restart (e.g., watchdog, power_loss, firmware_update, manual)

- **Test Fixtures**: Added comprehensive test fixtures for enhanced schemas
  - `sensor_data_enhanced_valid.json`: Full sensor data with all new metadata fields
  - `gateway_metrics_enhanced_valid.json`: Gateway metrics with all new system health fields
  - `sensor_with_location_valid.json`: Sensor data with location information

- **TypeScript Type Updates**: Updated type definitions to include all new fields
  - Added `LocationInfo` interface
  - Added `EnvironmentInfo` interface
  - Updated `BaseEnvelope` to include optional `location` and `environment`
  - Updated `SensorEntry` with new metadata fields
  - Updated `GatewayMetricsMessage` with enhanced metrics

### Changed (v0.6.0)

- Updated validation rules documentation to reflect new optional fields and their constraints
- Enhanced schema descriptions with detailed field documentation

### Notes (v0.6.0)

- Minor version bump justified by substantial new optional fields for enhanced functionality
- **ALL new fields are OPTIONAL** - maintains full backward compatibility with existing payloads
- No breaking changes to existing MQTT payload schemas; `schema_version: 1` unchanged
- All existing valid messages remain valid under updated schemas
- New fields provide substantial value for:
  - Map-based visualization in web dashboards (location data)
  - Proactive system health monitoring (enhanced gateway metrics)
  - Data quality assessment and sensor maintenance tracking (sensor metadata)
  - Better asset tracking and deployment planning (location + environment context)
- Firmware can adopt new fields incrementally without coordination requirements
- Web applications can gracefully handle messages with or without new fields

## 2025-10-12 (v0.5.0)

### Added (v0.5.0)

- Added `command.schema.json` for standardized device control commands with event-based discrimination
- Added `command_response.schema.json` for enhanced command responses with correlation tracking
- Added corresponding TypeScript interfaces: `CommandMessage`, `CommandResponseMessage`
- Added type guards: `isCommandMessage`, `isCommandResponseMessage`
- Added validators: `command`, `commandResponse`
- Enhanced classification heuristics to detect command messages using `event` discriminator field
- Added test fixtures for both command and command_response schemas
- Introduced event-based message discrimination pattern (`event: "command"`, `event: "command_response"`)
- Added correlation_id field for tracking command → response lifecycle
- Added priority field for command queue management
- Added success boolean field in responses replacing status enum
- Added error_code field for machine-readable error classification
- Added latency_ms field for command execution performance tracking

### Changed (v0.5.0)

- Command messages now use `event: "command"` discriminator instead of heuristic detection
- Command responses use `event: "command_response"` discriminator for clarity
- Enhanced command response format with success boolean, error_code, and latency_ms fields

### Deprecated (v0.5.0)

- `control_response.schema.json` is now deprecated in favor of `command_response.schema.json`
- Old control_response format will be maintained for backward compatibility through v0.5.x
- Planned removal in v0.6.0 with migration guide

### Notes (v0.5.0)

- Minor version bump justified by new command/control flow schemas for bidirectional communication
- New schemas follow event-based discrimination pattern for clearer message classification
- All command schemas extend base envelope and require firmware_version field
- No breaking changes to existing MQTT payload schemas; `schema_version: 1` unchanged
- Maintains backward compatibility with all existing message types
- Command pattern enables standardized web app → device control flow
- Correlation IDs enable reliable request/response tracking for async operations

## 2025-10-11 (v0.4.0)

### Added (v0.4.0)

- Added `mesh_node_list.schema.json` for reporting active mesh network nodes with status
- Added `mesh_topology.schema.json` for reporting mesh network topology and connections
- Added `mesh_alert.schema.json` for reporting mesh network alerts and warnings
- Added corresponding TypeScript interfaces: `MeshNodeListMessage`, `MeshTopologyMessage`, `MeshAlertMessage`
- Added type guards: `isMeshNodeListMessage`, `isMeshTopologyMessage`, `isMeshAlertMessage`
- Added validators: `meshNodeList`, `meshTopology`, `meshAlert`
- Enhanced classification heuristics to detect mesh message types (`nodes`, `connections`, `alerts` arrays)
- Added test fixtures for all three new mesh schemas

### Notes (v0.4.0)

- Minor version bump justified by new mesh network schemas for painlessMesh integration
- All mesh schemas extend base envelope and follow established patterns
- No breaking changes to existing MQTT payload schemas; `schema_version: 1` unchanged
- Maintains backward compatibility with all existing message types

## 2025-09-28 (v0.3.2)

### Added (v0.3.2)

- Enhanced documentation review and validation for better release preparation
- Improved script error reporting and consistency
- Better package.json script organization and documentation

### Fixed (v0.3.2)

- Enhanced validation script output formatting for better user experience
- Improved release preparation process documentation

### Notes (v0.3.2)

- Patch release focused on documentation improvements and validation script enhancements
- No breaking changes to schema JSON or validator logic
- Continued Node 18+ support with Node 20 as primary target

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
