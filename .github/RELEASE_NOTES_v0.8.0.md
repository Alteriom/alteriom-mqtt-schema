# v0.8.0 - Unified Device Schemas & HTTP Transport

**Release Date**: November 8, 2025  
**Type**: Major Release (Breaking Changes)

---

## ⚠️ BREAKING CHANGES

### Gateway Message Type Code Realignment

Gateway message type codes have been realigned for semantic consistency:

- **gateway_info**: `300` → **`305`** (aligned with sensor_info pattern)
- **gateway_metrics**: `301` → **`306`** (aligned with sensor_metrics pattern)

**Backward Compatibility**: Automatic code translation via `LEGACY_CODE_MAP` provides 6-month migration window (v0.8.0 → v1.0.0).

```typescript
// Automatic translation for legacy codes
const LEGACY_CODE_MAP = {
  300: 305, // gateway_info
  301: 306  // gateway_metrics
};
```

**Migration Timeline**:
- **Phase 1** (v0.8.0-v0.9.0): Both old and new codes accepted with warnings
- **Phase 2** (v1.0.0): Only new codes supported, old codes return errors

See [V080_BREAKING_CHANGES.md](./V080_BREAKING_CHANGES.md) for complete migration guide.

---

## 🎉 NEW FEATURES

### Unified Device Schemas (Type Codes 101-105)

Role-agnostic schemas for sensor/gateway/bridge/hybrid deployments:

- **101 - device_data**: Unified telemetry for all device types
- **102 - device_heartbeat**: Unified presence and health checks
- **103 - device_status**: Unified status change notifications
- **104 - device_info**: Unified identification and capabilities
- **105 - device_metrics**: Unified health and performance metrics

**Key Benefits**:
- Single firmware for multi-role devices
- `device_role` field: `sensor | gateway | bridge | hybrid`
- Reduces firmware complexity and maintenance
- Forward-compatible for new device types

```typescript
// Example: Hybrid device with sensors + gateway functionality
{
  "message_type": 101,
  "device_id": "HYBRID-001",
  "device_role": "hybrid",
  "device_type": "gateway",
  "sensors": {
    "temperature": { "value": 22.5, "unit": "C" }
  },
  "connected_devices": 15,
  "mesh_nodes": 12
}
```

### HTTP Transport Support

First-class REST API support alongside MQTT:

- Optional `transport_metadata` field in envelope
- Protocol discriminator: `mqtt | http | https`
- Full HTTP request/response metadata
- Request correlation and tracing support

```typescript
{
  "transport_metadata": {
    "protocol": "https",
    "correlation_id": "req-12345",
    "http": {
      "method": "POST",
      "path": "/api/v1/devices/SN001/telemetry",
      "status_code": 201,
      "request_id": "uuid-12345",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer ..."
      }
    }
  }
}
```

**Use Cases**:
- Web/mobile app direct integration
- HTTP-only deployments (no MQTT broker)
- RESTful API backends
- Hybrid MQTT/HTTP architectures

### Bridge Management Schemas (Type Codes 610-614)

Support for painlessMesh v1.8.0+ unified firmware architecture:

- **610 - bridge_status**: Bridge health and connectivity broadcasts
- **611 - bridge_election**: RSSI-based bridge election candidacy
- **612 - bridge_takeover**: Bridge role takeover announcements
- **613 - bridge_coordination**: Multi-bridge coordination and load balancing
- **614 - time_sync_ntp**: Bridge-to-mesh NTP time distribution

**Key Features**:
- Automatic failover with RSSI-based election
- Multi-bridge support for high availability
- NTP time synchronization across mesh
- Configuration-driven bridge roles

---

## 📊 IMPROVEMENTS

### Test Coverage
- **155 tests passing** (100% success rate)
  - 69 unit tests (classification, validators, dual-build)
  - 43 CJS fixture validations
  - 43 ESM fixture validations
- 9 new test fixtures for unified devices and HTTP transport
- Legacy code translation tests for backward compatibility

### Documentation
- Reorganized documentation structure
  - `docs/releases/` - Historical release notes
  - `docs/archive/` - Development history
  - `docs/README.md` - Documentation index
- 15 historical documents archived with index files
- Comprehensive migration guide (200+ lines)
- Updated README with documentation structure

### Type Definitions
- Complete TypeScript interfaces for all new schemas
- New type guards for unified device messages
- `LEGACY_CODE_MAP` constant exported
- Enhanced `MessageTypeCodes` enum with all new codes

---

## 📦 PACKAGE DETAILS

**Version**: 0.8.0  
**Node Support**: 18+ (20 recommended)  
**Builds**: Dual CJS/ESM  
**Dependencies**: Peer dependency on `ajv@>=8.0.0`

### Installation

```bash
npm install @alteriom/mqtt-schema@0.8.0 ajv ajv-formats
```

### Quick Start with Unified Devices

```typescript
import { validators, classifyAndValidate } from '@alteriom/mqtt-schema';

// Validate unified device data
const payload = {
  schema_version: 1,
  message_type: 101,
  device_id: "SENSOR-001",
  device_role: "sensor",
  device_type: "sensor",
  timestamp: new Date().toISOString(),
  firmware_version: "2.0.0",
  sensors: {
    temperature: { value: 22.5, unit: "C" }
  }
};

const result = validators.deviceData(payload);
if (result.valid) {
  console.log('Valid unified device data!');
}
```

---

## 🔗 RESOURCES

- **Migration Guide**: [V080_BREAKING_CHANGES.md](./V080_BREAKING_CHANGES.md)
- **Complete Changelog**: [CHANGELOG.md](./docs/mqtt_schema/CHANGELOG.md)
- **Documentation**: [docs/README.md](./docs/README.md)
- **GitHub Wiki**: https://github.com/Alteriom/alteriom-mqtt-schema/wiki

---

## 👥 CONTRIBUTORS

Special thanks to all contributors who made this release possible!

---

## 📝 FULL CHANGELOG

See [CHANGELOG.md](./docs/mqtt_schema/CHANGELOG.md#2025-11-08-v080---unified-firmware--bridge-management-release) for complete details.

---

**Questions or Issues?** Please open an issue at https://github.com/Alteriom/alteriom-mqtt-schema/issues
