# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: For detailed schema-level changes and comprehensive version history, see [docs/mqtt_schema/CHANGELOG.md](./docs/mqtt_schema/CHANGELOG.md)

## [0.8.1] - 2025-11-11

### Changed
- **PainlessMesh v1.8.2 Compatibility Verification**
  - Verified full compatibility with painlessMesh v1.8.2 features
  - Multi-bridge coordination (Type 613) with load balancing strategies
  - Message queue for offline mode with priority-based queuing
  - All existing schemas (v0.8.0) fully support painlessMesh v1.8.2

### Added
- 6 new bridge management test fixtures
- 161 total tests passing (69 unit + 49 CJS + 49 ESM fixtures)
- Documentation updates referencing painlessMesh v1.8.0-v1.8.2+ support

### Fixed
- Bridge coordination schema validation for multi-bridge scenarios
- Documentation accuracy for v1.8.2 compatibility

## [0.8.0] - 2025-11-08

### Added - **MAJOR RELEASE: Unified Firmware & Bridge Management**
- **5 New Bridge Management Message Types (610-614)**:
  - `bridge_status` (610): Bridge health and connectivity broadcasts
  - `bridge_election` (611): RSSI-based bridge election candidacy
  - `bridge_takeover` (612): Bridge role takeover announcements
  - `bridge_coordination` (613): Multi-bridge coordination and load balancing
  - `time_sync_ntp` (614): Bridge-to-mesh NTP time distribution
- **Unified Device Schemas (101-105)**: Support for sensors, gateways, bridges, and hybrid devices
- **HTTP Transport Support**: `transport_metadata` for REST API integration
- **Gateway Code Realignment**: Status codes 300→305, 301→306 with automatic legacy translation

### Changed
- Extended `device_config` (700) with `bridge_config` section for unified firmware
- Extended `mesh_status` (604) with bridge health tracking fields
- Updated message type code table with bridge management category

### Breaking Changes
- Gateway status code changes (300→305, 301→306)
- Automatic legacy code translation provided for backward compatibility
- See [V080_BREAKING_CHANGES.md](./V080_BREAKING_CHANGES.md) for migration guide

## [0.7.3] - 2025-10-30

### Added
- **Message Batching**: 50-90% protocol overhead reduction via `batch_envelope` (800)
- **Compression Support**: 60-80% bandwidth savings with gzip, zlib, brotli, deflate via `compressed_envelope` (810)
- **Comprehensive Examples**: 9 examples across 4 categories in examples repository
- **Professional Code Quality Tooling**:
  - ESLint with TypeScript support
  - Prettier code formatting
  - Husky git hooks
  - lint-staged for pre-commit checks
- **Enhanced Test Coverage**: 87% coverage with 134 tests (28 unit, 12 integration, 68 fixtures)

### Changed
- Reorganized project structure for better maintainability
- Enhanced documentation with more examples and guides

## [0.7.1] - 2025-10-27

### Added
- **Message Type Codes**: Optional `message_type` field for 90% faster classification
- **PainlessMesh Bridge Schema** (603): Mesh protocol integration support
- Type guards for all message types
- MessageTypeCodes constant enum for type safety

### Changed
- Classification logic with O(1) lookup when `message_type` provided
- Heuristic classification as fallback for backward compatibility

### Performance
- Classification speed improved from O(n) to O(1) with message type codes
- Average classification time < 0.01ms with type codes

## [0.7.0] - 2025-10-25

### Added
- **Best-in-Class OTA Management**:
  - Comprehensive OTA manifest schema with security features
  - Rollback support with version comparison
  - Delta updates for bandwidth efficiency
  - Enhanced firmware status tracking with progress monitoring
- **Device Configuration Management** (700):
  - Remote configuration without firmware updates
  - Unified configuration for sensors and gateways
  - Configuration versioning and audit trail

### Changed
- Enhanced `firmware_status` (500) with OTA scheduling and progress tracking
- Improved validation rules documentation

## [0.6.0] - 2025-10-20

### Added
- **Enhanced Location & Geolocation Support**:
  - GPS, cell tower, IP-based, and manual location tracking
  - Support for indoor positioning (iBeacon, WiFi triangulation)
  - Elevation, altitude, and floor level tracking
- **Extended Sensor Metadata**:
  - Accuracy tracking (%, absolute)
  - Calibration dates and offsets
  - Operational ranges (min/max)
  - Quality scores (0.0-1.0)
- **Comprehensive Gateway Health Metrics**:
  - Storage metrics (total/used/free)
  - Network interface statistics
  - Error counters (24h tracking)
  - Uptime and restart tracking

### Changed
- All new fields are optional for backward compatibility
- Enhanced type definitions with new interfaces

## [0.5.0] - 2025-10-12

### Added
- **Standardized Device Control**:
  - `command` schema (400) for device control commands
  - `command_response` schema (401) for execution results
  - Event-based discrimination (`event: "command"`)
  - Correlation IDs for request/response tracking
  - Priority-based command queue support

### Deprecated
- `control_response` schema in favor of `command_response`

## [0.4.0] - 2025-10-11

### Added
- **Mesh Network Schemas**:
  - `mesh_node_list` (600): Active mesh network nodes
  - `mesh_topology` (601): Mesh network topology and connections
  - `mesh_alert` (602): Mesh network alerts and warnings
- Enhanced classification for mesh message types

## [0.3.x] - 2025-09-28 to 2025-10-08

### Added (0.3.2 - 0.3.11)
- Release automation improvements
- Documentation enhancements
- Schema verification scripts
- Build tooling improvements
- Test fixture validation
- Wiki generation automation

## [0.2.0] - 2025-09-25

### Added
- **Gateway Metrics Support**:
  - `gateway_metrics` schema for gateway health monitoring
  - System metrics (CPU, memory, storage)
  - Network statistics
  - Connected device tracking

### Changed
- Enhanced classification heuristics
- Improved validator error messages

## [0.1.0] - 2025-09-20

### Added
- Initial release with core MQTT v1 schemas
- **Sensor Schemas**:
  - `sensor_data` (200): Sensor telemetry readings
  - `sensor_heartbeat` (201): Sensor presence checks
  - `sensor_status` (202): Sensor status changes
- **Gateway Schemas**:
  - `gateway_info` (300): Gateway identification
- **Base Infrastructure**:
  - Dual CJS/ESM build system
  - Ajv-based validation
  - TypeScript type definitions
  - Embedded schema distribution
- Tree-shakeable validators
- Forward-compatible design (`additionalProperties: true`)

---

## Version History Summary

| Version | Date | Type | Key Features |
|---------|------|------|--------------|
| 0.8.1 | 2025-11-11 | Patch | PainlessMesh v1.8.2 compatibility |
| 0.8.0 | 2025-11-08 | Major | Unified firmware, bridge management, HTTP transport |
| 0.7.3 | 2025-10-30 | Minor | Message batching, compression, code quality tools |
| 0.7.1 | 2025-10-27 | Minor | Message type codes, performance optimization |
| 0.7.0 | 2025-10-25 | Minor | OTA management, device configuration |
| 0.6.0 | 2025-10-20 | Minor | Location tracking, enhanced metrics |
| 0.5.0 | 2025-10-12 | Minor | Device control commands |
| 0.4.0 | 2025-10-11 | Minor | Mesh network schemas |
| 0.3.x | 2025-09-28 | Patch | Tooling and automation |
| 0.2.0 | 2025-09-25 | Minor | Gateway metrics |
| 0.1.0 | 2025-09-20 | Major | Initial release |

---

## Links

- **GitHub Repository**: https://github.com/Alteriom/alteriom-mqtt-schema
- **npm Package**: https://www.npmjs.com/package/@alteriom/mqtt-schema
- **Detailed Changelog**: [docs/mqtt_schema/CHANGELOG.md](./docs/mqtt_schema/CHANGELOG.md)
- **Migration Guides**: [docs/releases/](./docs/releases/)
- **Breaking Changes**: [V080_BREAKING_CHANGES.md](./V080_BREAKING_CHANGES.md)
