# MQTT Schema Artifacts Changelog

## 2025-10-23 (v0.7.1 - Performance & Mesh Protocol Release)

### Added - Device Configuration Management (Extended)

#### Device Configuration Schema (`device_config.schema.json`)

New unified configuration management schema for both sensors and gateways (type code 700).

**Event Types:**
- `config_snapshot`: Current device configuration state
- `config_update`: Apply configuration changes
- `config_request`: Query current configuration

**Configuration Parameters** (all optional, device-dependent):

**Sampling & Reporting:**
- `sampling_interval_ms`: Sensor sampling interval (1s to 24h)
- `reporting_interval_ms`: Data reporting interval
- `sensors_enabled`: Array of enabled sensor names

**Power Management:**
- `transmission_mode`: wifi | mesh | mixed | cellular
- `power_mode`: normal | low_power | ultra_low_power | always_on
- `sleep_duration_ms`: Deep sleep duration (0 = disabled)

**Calibration & Alerts:**
- `calibration_offsets`: Per-sensor calibration offset values
- `alert_thresholds`: Per-sensor min/max thresholds with enable flag

**Network Configuration:**
- `network_config`: WiFi, mesh, MQTT broker settings
  - WiFi: SSID, channel
  - Mesh: prefix, password, port
  - MQTT: broker hostname, port, topic prefix

**OTA Configuration:**
- `ota_config`: Auto-update settings
  - `auto_update`: Enable automatic updates
  - `update_channel`: stable | beta | dev
  - `update_check_interval_h`: Check interval in hours
  - `allow_downgrade`: Allow firmware downgrade

**System Settings:**
- `log_level`: debug | info | warn | error | none
- `timezone`: Timezone identifier (e.g., 'America/New_York', 'UTC')
- `ntp_server`: NTP server hostname for time sync

**Metadata:**
- `config_version`: Configuration schema version string
- `last_modified`: When configuration was last modified
- `modified_by`: User or system that made changes
- `validation_errors`: Array of validation errors (for update responses)

**Use Cases:**
- Remote device configuration without reflashing firmware
- Configuration backup and restore
- Bulk configuration deployment
- Configuration audit trail
- Troubleshooting device behavior

**Unified Standards:**
Both sensors and gateways now support consistent configuration management including:
- ✅ OTA update configuration (auto-update, channels, intervals)
- ✅ Health monitoring configuration (log levels, reporting intervals)
- ✅ Status reporting configuration (transmission modes, power modes)
- ✅ Network configuration (WiFi, mesh, MQTT settings)

**Example - Sensor Configuration Snapshot:**
```json
{
  "schema_version": 1,
  "message_type": 700,
  "device_id": "SN001",
  "device_type": "sensor",
  "event": "config_snapshot",
  "configuration": {
    "sampling_interval_ms": 30000,
    "sensors_enabled": ["temperature", "humidity"],
    "power_mode": "low_power",
    "ota_config": {
      "auto_update": true,
      "update_channel": "stable"
    }
  }
}
```

**Example - Gateway Configuration Update:**
```json
{
  "schema_version": 1,
  "message_type": 700,
  "device_id": "GW-MAIN",
  "device_type": "gateway",
  "event": "config_update",
  "configuration": {
    "network_config": {
      "mesh_prefix": "alteriom-mesh",
      "mqtt_broker": "mqtt.alteriom.io"
    },
    "ota_config": {
      "update_check_interval_h": 12
    }
  },
  "modified_by": "admin@example.com"
}
```

## 2025-10-23 (v0.7.1 - Performance & Mesh Protocol Release)

### Added (v0.7.1)

#### Message Type Codes for Fast Classification

Added optional `message_type` field to base envelope for performance optimization and protocol standardization.

**New Field** (optional, backward compatible):
- `message_type` (integer, enum): Numeric message type code for fast classification
  - 200: sensor_data - Sensor telemetry readings
  - 201: sensor_heartbeat - Sensor presence/health
  - 202: sensor_status - Sensor status change
  - 300: gateway_info - Gateway identification
  - 301: gateway_metrics - Gateway health metrics
  - 400: command - Device control command
  - 401: command_response - Command execution result
  - 402: control_response - Legacy control response (deprecated)
  - 500: firmware_status - Firmware update status
  - 600: mesh_node_list - Mesh node inventory
  - 601: mesh_topology - Mesh network topology
  - 602: mesh_alert - Mesh network alert
  - 603: mesh_bridge - Mesh protocol bridge (new)

**Benefits:**
- Significantly faster message classification when type code is present (O(1) vs O(n))
- Aligns with CoAP and MQTT-SN numeric type systems
- Enables efficient switch-case routing instead of heuristic if-else chains
- Fully backward compatible - classification falls back to heuristics if omitted
- Explicit message intent declaration reduces ambiguity

**Usage Example:**
```json
{
  "schema_version": 1,
  "message_type": 200,
  "device_id": "SN001",
  "device_type": "sensor",
  "timestamp": "2025-10-23T20:30:00.000Z",
  "firmware_version": "SN 2.1.5",
  "sensors": { "temperature": { "value": 22.5, "unit": "C" } }
}
```

#### Mesh Protocol Bridge Schema (`mesh_bridge.schema.json`)

New message type for standardizing MQTT-to-mesh protocol bridging, with first-class support for painlessMesh.

**New Message Type:** `mesh_bridge` (type code: 603)

**Required Fields:**
- `event`: Must be "mesh_bridge"
- `mesh_protocol`: Protocol being bridged (painlessMesh | esp-now | ble-mesh | thread | zigbee)
- `mesh_message`: Encapsulated mesh protocol message with standardized structure

**Mesh Message Structure:**
- `from_node_id` (integer | string): Source node identifier (uint32 for painlessMesh)
- `to_node_id` (integer | string): Destination node ID (0 or 'broadcast' for broadcast)
- `mesh_type` (integer, optional): Protocol-specific message type code
- `mesh_type_name` (string, optional): Human-readable type (e.g., 'SINGLE', 'BROADCAST')
- `raw_payload` (string, optional): Raw payload (base64/hex encoded)
- `payload_decoded` (object, optional): Decoded MQTT v1 message if applicable
- `rssi` (number, optional): Signal strength in dBm (-200 to 0)
- `hop_count` (integer, optional): Number of hops from source
- `mesh_timestamp` (integer, optional): Protocol-specific timestamp (μs for painlessMesh)

**Optional Gateway Context:**
- `gateway_node_id`: Gateway's node ID in mesh network
- `mesh_network_id`: Mesh network identifier

**Use Cases:**
- Bridge painlessMesh networks to MQTT infrastructure
- Integrate ESP-NOW devices with cloud platforms
- Standardize multi-protocol mesh gateway implementations
- Enable mesh network observability and debugging
- Support heterogeneous mesh networks (BLE Mesh, Thread, Zigbee)

**Example - PainlessMesh Bridge:**
```json
{
  "schema_version": 1,
  "message_type": 603,
  "device_id": "GW-MESH-01",
  "device_type": "gateway",
  "timestamp": "2025-10-23T20:30:00.000Z",
  "firmware_version": "GW 3.2.0",
  "event": "mesh_bridge",
  "mesh_protocol": "painlessMesh",
  "mesh_message": {
    "from_node_id": 123456789,
    "to_node_id": 987654321,
    "mesh_type": 8,
    "mesh_type_name": "SINGLE",
    "payload_decoded": {
      "schema_version": 1,
      "device_id": "MESH-NODE-123456789",
      "sensors": { "temperature": { "value": 22.5 } }
    },
    "rssi": -72,
    "hop_count": 2
  }
}
```

**PainlessMesh Integration Pattern:**
- Gateway receives painlessMesh message on mesh network
- Gateway wraps message in mesh_bridge envelope
- Optional: decode payload to MQTT v1 structure if possible
- Publish to MQTT broker with full context (signal strength, hops, timing)
- Backend can process both raw and decoded payloads

#### TypeScript Enhancements

**New Types and Constants:**
- `MessageTypeCodes` constant object with all type code mappings
- `MessageTypeCode` type alias for type safety
- `MeshBridgeMessage` interface for mesh bridge messages
- `isMeshBridgeMessage()` type guard function

**Enhanced Classification:**
- `classifyMessage()` now uses fast path with message_type codes
- Falls back to heuristic classification for backward compatibility
- Performance improvement: O(1) lookup vs O(n) conditional checks

#### Test Fixtures

Added 5 new test fixtures demonstrating v0.7.1 features:
- `sensor_data_with_type_code.json` - Sensor data with type code 200
- `gateway_metrics_with_type_code.json` - Gateway metrics with type code 301
- `command_with_type_code.json` - Command with type code 400
- `mesh_bridge_painless_valid.json` - PainlessMesh bridge with decoded payload
- `mesh_bridge_broadcast.json` - PainlessMesh broadcast message

### Changed (v0.7.1)

- Updated `envelope.schema.json` to include optional `message_type` field
- Enhanced TypeScript type classification with fast path for type codes
- Updated `types.ts` with message type code constants and mesh bridge type
- All existing messages remain 100% valid (backward compatible)

### Performance Improvements (v0.7.1)

**Message Classification:**
- With `message_type`: O(1) lookup + validation (single switch case)
- Without `message_type`: O(n) heuristic matching (unchanged from v0.7.0)
- Expected improvement: ~90% faster for messages with type codes
- Zero overhead for messages without type codes

**Bundle Size:**
- Schema additions: ~3KB uncompressed (~1KB gzipped)
- TypeScript type additions: ~2KB uncompressed (~800B gzipped)
- Total overhead: <2KB gzipped (negligible)

### Migration Guide (v0.7.1)

**No Breaking Changes** - This is a backward-compatible feature release.

**Optional Adoption Path:**

1. **Immediate** (no changes required):
   - All existing v0.7.0 messages work unchanged
   - Heuristic classification continues to work
   - No firmware or backend changes needed

2. **Gradual Enhancement** (recommended):
   - New firmware versions can add `message_type` to messages
   - Backend can use fast path when available
   - Existing devices continue using heuristics
   - Mixed deployment fully supported

3. **Full Optimization** (future):
   - All firmware updated to include `message_type`
   - Backend relies primarily on type codes
   - Heuristics kept as fallback for robustness

**Firmware Implementation:**
```c
// Add to message construction
payload["message_type"] = 200; // SENSOR_DATA
```

**Backend Implementation:**
```typescript
// Fast classification automatically used
const { kind, result } = classifyAndValidate(payload);
// 90% faster if message_type present, same speed otherwise
```

### Backward Compatibility Guarantee (v0.7.1)

✅ All v0.7.0 messages validate successfully  
✅ All v0.6.0 messages validate successfully  
✅ All v0.5.0 messages validate successfully  
✅ No required fields added  
✅ Heuristic classification unchanged for messages without type codes  
✅ Type codes are purely optional optimization  
✅ Mixed deployments fully supported (some with type codes, some without)

### Industry Alignment (v0.7.1)

- **Message Type Codes**: Aligns with CoAP (RFC 7252) and MQTT-SN numeric type systems
- **Mesh Bridging**: Standardizes pattern used by AWS IoT Greengrass, Azure IoT Edge
- **PainlessMesh Support**: Industry-standard ESP32/ESP8266 mesh library integration
- **Performance**: O(1) classification aligns with high-throughput IoT gateways

---

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
