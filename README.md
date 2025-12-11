# @alteriom/mqtt-schema

![Metadata Compliance](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/metadata-compliance.yml/badge.svg)
![OTA Manifest Validation](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/validate-ota-manifest.yml/badge.svg)
![Schema Verify](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/schema-verify.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/@alteriom/mqtt-schema.svg)
![npm downloads](https://img.shields.io/npm/dm/@alteriom/mqtt-schema.svg)
![license](https://img.shields.io/npm/l/@alteriom/mqtt-schema.svg)
![npm total downloads](https://img.shields.io/npm/dt/@alteriom/mqtt-schema.svg)
![node version](https://img.shields.io/node/v/@alteriom/mqtt-schema.svg)
![peer ajv](https://img.shields.io/badge/peer%20ajv-%3E%3D8.0.0-blue.svg)
![latest tag](https://img.shields.io/github/v/tag/Alteriom/alteriom-mqtt-schema?label=tag)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alteriom/mqtt-schema)](https://bundlephobia.com/package/@alteriom/mqtt-schema)


Alteriom MQTT v1 JSON Schemas, TypeScript types, and production‑ready validation helpers for integrating firmware MQTT payloads into web or backend services.

 
## Why this exists
Firmware emits structured MQTT payloads that must remain tightly aligned with web, analytics, and gateway logic. This package is the single source of truth for:

- Canonical, versioned JSON Schemas (`schema_version: 1` series)
- Embedded (tree‑shakeable) schema objects — no runtime file I/O
- Precompiled Ajv validators (fast + consistent across CJS / ESM)
- TypeScript interfaces & type guards generated from the same source schema set
- Message classification helper that infers the schema kind heuristically
- Forward‑compatible design: unknown extra properties are ignored unless explicitly constrained

## Features

- Dual build: CommonJS + ESM (Node 16+ / bundlers)
- Zero configuration: just import and validate
- Helpful error paths (JSON Pointer style)
- Lightweight (Ajv peer dependency, schemas embedded)
- Ships original schema JSON files (optional consumption)
- **NEW in v0.8.0**: ⚠️ BREAKING: Gateway code realignment (300→305, 301→306) with automatic legacy translation
- **NEW in v0.8.0**: Unified device schemas (10x range) for sensor/gateway/bridge/hybrid deployments
- **NEW in v0.8.0**: HTTP transport support via `transport_metadata` for REST API integration
- **NEW in v0.8.0**: Bridge management schemas for painlessMesh v1.8.0-v1.8.2+ (5 new message types)
- **NEW in v0.7.3**: Message batching for 50-90% protocol overhead reduction
- **NEW in v0.7.3**: Compression support for 60-80% bandwidth savings (gzip, zlib, brotli, deflate)
- **NEW in v0.7.3**: Comprehensive example repository (9 examples, 4 categories)
- **NEW in v0.7.3**: Professional code quality tooling (ESLint, Prettier, Husky)
- **NEW in v0.7.3**: 87% test coverage with 134 tests (28 unit, 12 integration, 68 fixtures)
- **NEW in v0.7.1**: Message type codes for significantly faster classification and standardized routing
- **NEW in v0.7.1**: PainlessMesh bridge schema for mesh protocol integration
- **NEW in v0.7.0**: Best-in-class OTA management with security, rollback, and delta updates
- **NEW in v0.6.0**: Enhanced location/geolocation support for asset tracking
- **NEW in v0.6.0**: Extended sensor metadata (accuracy, calibration, operational range)
- **NEW in v0.6.0**: Comprehensive gateway health metrics (storage, network, errors)

## Documentation

### Quick Links

- 📚 **[GitHub Wiki](https://github.com/Alteriom/alteriom-mqtt-schema/wiki)** - Comprehensive API documentation, schema references, and guides
- 🔧 **[Development Guide](./DEVELOPMENT.md)** - Environment setup, build system, and workflow
- 🧪 **[Testing Guide](./TESTING.md)** - Testing strategy, procedures, and coverage
- 📋 **[Documentation Index](./.github/DOCUMENTATION.md)** - Complete documentation map

### Essential Resources

- **Getting Started**: [Installation](#installation) · [Quick Start](#quick-start) · [Examples](./docs/examples/)
- **API Reference**: [Message Types](#message-type-codes) · [Validators](#usage) · [Type Guards](#type-guards-typescript)
- **Schemas**: [Schema Directory](./docs/mqtt_schema/) · [Validation Rules](./docs/mqtt_schema/validation_rules.md)
- **Contributing**: [Contributing Guide](./CONTRIBUTING.md) · [Code of Conduct](./CODE_OF_CONDUCT.md)
- **Releases**: [Changelog](./CHANGELOG.md) · [Roadmap](./ROADMAP.md) · [Breaking Changes](./V080_BREAKING_CHANGES.md)

### Central Documentation

For organization-wide documentation and integration guides, visit the **[Alteriom Documentation Repository](https://github.com/Alteriom/alteriom-documentation)**.

> **Note**: If the wiki appears empty, see [WIKI_SETUP.md](./WIKI_SETUP.md) for setup instructions. The wiki is automatically generated and synced from the repository.

## Installation

```bash
npm install @alteriom/mqtt-schema ajv ajv-formats
```

**Support & Compatibility**: Node 18+ tested; Node 20 primary. Dual CJS/ESM builds.

## Quick Start

### Fast Classification with Type Codes (v0.7.1+)

For optimal performance, include the optional `message_type` field:

```ts
import { classifyAndValidate, MessageTypeCodes } from '@alteriom/mqtt-schema';

const payload = {
  schema_version: 1,
  message_type: MessageTypeCodes.SENSOR_DATA, // 200 - enables 90% faster classification
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.5',
  sensors: {
    temperature: { value: 22.5, unit: 'C' }
  }
};

const { kind, result } = classifyAndValidate(payload);
// Fast path: O(1) lookup vs O(n) heuristics
```

### Validate a JSON payload (object already parsed):

```ts
import { validators } from '@alteriom/mqtt-schema';

const payload = JSON.parse(rawMqttString);
const result = validators.sensorData(payload);
if (!result.valid) {
  console.error('Invalid sensor data', result.errors);
}
```

Classify and validate automatically:

```ts
import { classifyAndValidate } from '@alteriom/mqtt-schema';

const { kind, result } = classifyAndValidate(payload);
if (result.valid) {
  console.log('Message kind:', kind);
} else {
  console.warn('Validation errors', result.errors);
}
```

Use strong TypeScript types after classification:

```ts
import { classifyAndValidate, isSensorDataMessage, SensorDataMessage } from '@alteriom/mqtt-schema';

const { result } = classifyAndValidate(payload);
if (result.valid && isSensorDataMessage(payload)) {
  const data: SensorDataMessage = payload;
  Object.entries(data.sensors).forEach(([name, s]) => {
    console.log(name, s.value, s.unit);
  });
}
```

Access raw schema JSON (if you need to introspect or power form generation):

```ts
import envelopeSchema from '@alteriom/mqtt-schema/schemas/envelope.schema.json';
```

## Command & Control (v0.5.0+)

Send commands to devices and receive responses with correlation tracking:

```ts
import { validators, isCommandMessage, isCommandResponseMessage } from '@alteriom/mqtt-schema';

// Create a command message
const command = {
  schema_version: 1,
  device_id: 'ALT-441D64F804A0',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'WEB 1.0.0',
  event: 'command',
  command: 'read_sensors',
  correlation_id: `cmd-${Date.now()}-001`,
  parameters: {
    immediate: true,
    sensors: ['temperature', 'humidity']
  },
  priority: 'high'
};

// Validate before sending
const cmdResult = validators.command(command);
if (cmdResult.valid) {
  // Publish to MQTT topic: alteriom/nodes/{device_id}/commands
  mqttClient.publish(`alteriom/nodes/${command.device_id}/commands`, JSON.stringify(command));
}

// Handle response from device
mqttClient.subscribe(`alteriom/nodes/${command.device_id}/responses`, (message) => {
  const response = JSON.parse(message);
  const respResult = validators.commandResponse(response);
  
  if (respResult.valid && isCommandResponseMessage(response)) {
    if (response.correlation_id === command.correlation_id) {
      if (response.success) {
        console.log('Command succeeded:', response.result);
        console.log(`Latency: ${response.latency_ms}ms`);
      } else {
        console.error(`Command failed: ${response.error_code} - ${response.message}`);
      }
    }
  }
});
```

**Command Pattern Features:**
- Event-based discrimination (`event: "command"` and `event: "command_response"`)
- Correlation IDs for request/response tracking
- Command name validation (lowercase snake_case)
- Flexible parameters object for command-specific data
- Priority field for queue management
- Success boolean and error codes in responses
- Latency tracking for performance monitoring

## PainlessMesh Protocol Bridge (v0.7.1+)

Standardize MQTT-to-mesh protocol bridging for seamless integration with ESP32/ESP8266 mesh networks:

```ts
import { validators, isMeshBridgeMessage } from '@alteriom/mqtt-schema';

// Gateway bridges painlessMesh message to MQTT
const meshBridge = {
  schema_version: 1,
  message_type: 603, // MESH_BRIDGE
  device_id: 'GW-MESH-01',
  device_type: 'gateway',
  timestamp: new Date().toISOString(),
  firmware_version: 'GW 3.2.0',
  event: 'mesh_bridge',
  mesh_protocol: 'painlessMesh',
  mesh_message: {
    from_node_id: 123456789,  // painlessMesh uint32 node ID
    to_node_id: 987654321,
    mesh_type: 8,              // painlessMesh SINGLE message
    mesh_type_name: 'SINGLE',
    payload_decoded: {
      // Decoded MQTT v1 message from mesh node
      schema_version: 1,
      device_id: 'MESH-NODE-123456789',
      device_type: 'sensor',
      timestamp: '2025-10-23T20:30:00.000Z',
      firmware_version: 'SN 2.0.0',
      sensors: {
        temperature: { value: 22.5, unit: 'C' }
      }
    },
    rssi: -72,        // Signal strength
    hop_count: 2      // Hops from source to gateway
  }
};

const result = validators.meshBridge(meshBridge);
if (result.valid && isMeshBridgeMessage(meshBridge)) {
  // Process mesh message with full context
  console.log(`Mesh message from node ${meshBridge.mesh_message.from_node_id}`);
  console.log(`Signal: ${meshBridge.mesh_message.rssi} dBm, Hops: ${meshBridge.mesh_message.hop_count}`);
  
  if (meshBridge.mesh_message.payload_decoded) {
    // Process decoded MQTT v1 message
    const innerMessage = meshBridge.mesh_message.payload_decoded;
    console.log('Decoded sensor data:', innerMessage.sensors);
  }
}
```

**Mesh Bridge Features:**
- **Multi-Protocol Support**: painlessMesh, ESP-NOW, BLE Mesh, Thread, Zigbee
- **Dual Payload Format**: Raw (base64/hex) and decoded MQTT v1 messages
- **Network Observability**: RSSI, hop count, mesh timestamps
- **Gateway Context**: Gateway node ID and mesh network identifier
- **Standardized Translation**: Consistent format across different mesh protocols

**Use Cases:**
- Bridge ESP32 painlessMesh networks to cloud MQTT
- Integrate ESP-NOW devices without direct WiFi
- Heterogeneous mesh gateway (multiple mesh protocols)
- Mesh network debugging and visualization
- Low-power mesh sensor networks with cloud backend

**PainlessMesh Integration Pattern:**
```cpp
// ESP32 Gateway Firmware (C++)
void onMeshReceive(uint32_t from, String &msg) {
  // Wrap painlessMesh message in MQTT envelope
  StaticJsonDocument<1024> bridgeMsg;
  bridgeMsg["schema_version"] = 1;
  bridgeMsg["message_type"] = 603;
  bridgeMsg["device_id"] = "GW-MESH-01";
  bridgeMsg["device_type"] = "gateway";
  bridgeMsg["event"] = "mesh_bridge";
  bridgeMsg["mesh_protocol"] = "painlessMesh";
  
  JsonObject meshMsg = bridgeMsg.createNestedObject("mesh_message");
  meshMsg["from_node_id"] = from;
  meshMsg["to_node_id"] = mesh.getNodeId();
  meshMsg["raw_payload"] = base64::encode(msg);
  meshMsg["rssi"] = mesh.getRssi(from); // If available
  
  // Try to decode as MQTT v1 message
  StaticJsonDocument<512> decoded;
  if (deserializeJson(decoded, msg) == DeserializationError::Ok) {
    meshMsg["payload_decoded"] = decoded;
  }
  
  // Publish to MQTT broker
  String bridgeJson;
  serializeJson(bridgeMsg, bridgeJson);
  mqttClient.publish("alteriom/mesh/bridge", bridgeJson);
}
```

## Enhanced Location & Environment Tracking (v0.6.0+)

Track device location and deployment context for asset management and map-based visualization:

```ts
import { validators, isSensorDataMessage } from '@alteriom/mqtt-schema';

const sensorData = {
  schema_version: 1,
  device_id: 'SN456',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.0',
  // Standardized location for map visualization
  location: {
    latitude: 43.6532,
    longitude: -79.3832,
    altitude: 76.5,
    accuracy_m: 10.0,
    zone: 'warehouse_A',
    description: 'Shelf 3, Row B'
  },
  // Deployment context
  environment: {
    deployment_type: 'indoor',
    power_source: 'battery',
    expected_battery_life_days: 365
  },
  sensors: {
    temperature: {
      value: 22.3,
      unit: 'C',
      // Enhanced sensor metadata
      timestamp: '2025-10-19T20:59:58.000Z',
      accuracy: 0.5,
      last_calibration: '2025-01-15',
      error_margin_pct: 2.0,
      operational_range: { min: -40, max: 85 },
      quality_score: 0.95
    }
  },
  battery_level: 78,
  signal_strength: -65
};

const result = validators.sensorData(sensorData);
if (result.valid && isSensorDataMessage(sensorData)) {
  // Display on map using location data
  displayOnMap(sensorData.location.latitude, sensorData.location.longitude);
  
  // Show sensor health based on metadata
  if (sensorData.sensors.temperature.accuracy) {
    console.log(`Temperature accuracy: ±${sensorData.sensors.temperature.accuracy}${sensorData.sensors.temperature.unit}`);
  }
  
  // Check calibration status
  const lastCal = new Date(sensorData.sensors.temperature.last_calibration);
  const daysSinceCalibration = (Date.now() - lastCal.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCalibration > 365) {
    console.warn('Sensor calibration overdue');
  }
}
```

**Location & Environment Features:**
- GPS coordinates (latitude, longitude, altitude) with accuracy tracking
- Zone-based organization (warehouses, floors, rooms)
- Human-readable location descriptions
- Deployment type tracking (indoor/outdoor/mobile)
- Power source information for battery management
- Per-sensor timestamps for async polling scenarios
- Sensor accuracy and calibration tracking
- Operational range validation support

## Enhanced Gateway Metrics (v0.6.0+)

Comprehensive system health monitoring for gateways:

```ts
import { validators, isGatewayMetricsMessage } from '@alteriom/mqtt-schema';

const metrics = {
  schema_version: 1,
  device_id: 'GW002',
  device_type: 'gateway',
  timestamp: new Date().toISOString(),
  firmware_version: 'GW 1.4.0',
  metrics: {
    uptime_s: 86400,
    cpu_usage_pct: 15.3,
    memory_usage_pct: 42.7,
    temperature_c: 45.2,
    // Enhanced storage metrics
    storage_usage_pct: 45.2,
    storage_total_mb: 512,
    storage_free_mb: 280.5,
    // Network bandwidth tracking
    network_rx_kbps: 125.4,
    network_tx_kbps: 89.3,
    active_connections: 5,
    // System health indicators
    error_count_24h: 3,
    warning_count_24h: 12,
    restart_count: 2,
    last_restart_reason: 'firmware_update',
    // Mesh network metrics
    connected_devices: 12,
    mesh_nodes: 8,
    packet_loss_pct: 0.5
  }
};

const result = validators.gatewayMetrics(metrics);
if (result.valid && isGatewayMetricsMessage(metrics)) {
  // Storage monitoring
  if (metrics.metrics.storage_usage_pct > 80) {
    console.warn('Storage usage critical:', metrics.metrics.storage_usage_pct);
  }
  
  // Network health
  const totalBandwidth = metrics.metrics.network_rx_kbps + metrics.metrics.network_tx_kbps;
  console.log(`Total bandwidth: ${totalBandwidth.toFixed(1)} kbps`);
  
  // Error trend analysis
  if (metrics.metrics.error_count_24h > 10) {
    console.error('High error rate detected:', metrics.metrics.error_count_24h);
  }
  
  // Restart tracking
  console.log(`Last restart: ${metrics.metrics.last_restart_reason}`);
  console.log(`Total restarts: ${metrics.metrics.restart_count}`);
}
```

**Enhanced Gateway Metrics Features:**
- Storage usage tracking (percentage, total, free space)
- Network bandwidth monitoring (RX/TX rates)
- Active connection counting
- Error and warning counters (24-hour rolling window)
- Restart tracking with reason codes
- All metrics are optional for gradual firmware adoption

## OTA Firmware Management (v0.7.0+)

Comprehensive best-in-class OTA solution based on 2024 industry standards.

### OTA Manifest Schema

The package includes OTA firmware manifest schema with both rich and minimal formats, enhanced with enterprise-grade features.

**Preferred: Stable alias import** (v0.3.1+):
```ts
import otaManifestSchema from '@alteriom/mqtt-schema/ota-manifest';
import { OtaManifest, isRichManifest } from '@alteriom/mqtt-schema/types/ota-manifest';
```

**Legacy: Deep path import** (still supported):
```ts
import otaManifestSchema from '@alteriom/mqtt-schema/schemas/ota/ota-manifest.schema.json';
```

**Usage example:**
```ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import otaManifestSchema from '@alteriom/mqtt-schema/ota-manifest';
import { OtaManifest } from '@alteriom/mqtt-schema/types/ota-manifest';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<OtaManifest>(otaManifestSchema as any);

const manifest: OtaManifest = JSON.parse(manifestJson);
if (!validate(manifest)) {
  console.error('Invalid OTA manifest:', validate.errors);
}
```

Supported formats:
- **Rich manifest**: environment + branch + manifests object
- **Minimal environment map**: environment → channels mapping  
- **Chunk variants**: structured objects or SHA256 array

### Enhanced OTA Features (v0.7.0+)

**Security & Authenticity:**
```ts
const manifest = {
  environment: "universal-sensor",
  branch: "main",
  manifests: {
    prod: {
      build_type: "prod",
      file: "firmware-v2.0.0.bin",
      size: 456789,
      sha256: "a1b2c3...",
      firmware_version: "2.0.0",
      built: "2025-10-19T12:00:00Z",
      ota_url: "https://firmware.example.com/v2.0.0.bin",
      
      // Digital signature for authenticity
      signature: "MEUCIQDx...",
      signature_algorithm: "ECDSA-SHA256",
      signing_key_id: "prod-signing-key-2025",
      
      // Version constraints
      min_version: "1.5.0",        // Minimum version to upgrade from
      max_version: "1.9.99",       // Prevent downgrades
      
      // Release management
      release_notes_url: "https://docs.example.com/v2.0.0",
      criticality: "high",          // low | medium | high | critical
      mandatory: true,              // Must be installed
      
      // Staged rollout
      rollout_percentage: 25,       // Start with 25% of fleet
      rollout_target_groups: ["beta-testers", "early-adopters"],
      
      // Delta updates (60-90% bandwidth reduction)
      delta_from_version: "1.9.0",
      delta_patch_url: "https://firmware.example.com/patches/1.9.0-to-2.0.0.patch",
      delta_patch_size: 45678,
      delta_patch_sha256: "c3d4e5..."
    }
  }
};
```

**Firmware Update Status Tracking:**
```ts
import { validators, isFirmwareStatusMessage } from '@alteriom/mqtt-schema';

// Enhanced status tracking
const status = {
  schema_version: 1,
  device_id: "SN789",
  device_type: "sensor",
  timestamp: new Date().toISOString(),
  firmware_version: "2.0.0",
  
  status: "downloading",           // New: rolled_back, rollback_pending, rollback_failed
  progress_pct: 42,
  
  // Progress details
  download_speed_kbps: 125.5,
  bytes_downloaded: 196608,
  bytes_total: 456789,
  eta_seconds: 28,
  
  // Rollback support
  rollback_available: true,
  previous_version: "1.9.0",
  
  // Security verification
  update_type: "delta",            // full | delta | patch
  signature_verified: true,
  checksum_verified: true,
  
  // Operational context
  battery_level_pct: 85,
  free_space_kb: 2048,
  retry_count: 0
};

const result = validators.firmwareStatus(status);
if (result.valid) {
  console.log(`Download progress: ${status.progress_pct}% at ${status.download_speed_kbps} kbps`);
  console.log(`ETA: ${status.eta_seconds} seconds`);
}
```

**OTA Best Practices:**
- **Security**: Always use digital signatures for production firmware
- **Rollback**: Maintain backup partition for automatic rollback on failures
- **Delta Updates**: Use delta patches for bandwidth-constrained deployments (60-90% reduction)
- **Staged Rollout**: Start with 5-10% rollout, monitor, then expand gradually
- **Version Control**: Use min_version to prevent upgrades from incompatible versions
- **Criticality**: Mark security patches as "critical" with mandatory: true

See `docs/OTA_MANIFEST.md` for comprehensive guide and best practices.

## API Surface

```ts
import { validators, validateMessage, classifyAndValidate } from '@alteriom/mqtt-schema';

// 1. Direct validator by message kind
validators.sensorData(payload); // => { valid: boolean; errors?: string[] }

// 2. Generic function
validateMessage('sensorData', payload);

// 3. Classify unknown payload then validate
const { kind, result } = classifyAndValidate(payload);

// 4. Type guards (when available)
// if (isSensorDataMessage(payload)) { ... }
```

Validation result format:

```ts
interface ValidationResult {
  valid: boolean;
  errors?: string[]; // Each item contains instancePath + message
}
```

### Performance Notes

All Ajv validator functions are compiled once at module load. For typical web usage (tens to hundreds of validations per page/session) this is faster and simpler than on‑demand compilation. If you need custom Ajv options (e.g., different formats), open an issue—an override hook can be added without breaking changes.

### Embedded Schemas

`schema_data.ts` is auto‑generated during build. This avoids dynamic `require()` / `import` of JSON and works cleanly in both Node ESM and bundlers without JSON import assertions. The original JSON files are still published under `schemas/` for tooling or documentation pipelines.

## Device Configuration Management (v0.7.1+)

Unified configuration management for both sensors and gateways, supporting remote configuration without firmware reflashing:

```ts
import { validators, isDeviceConfigMessage, MessageTypeCodes } from '@alteriom/mqtt-schema';

// Configuration update request (from backend to device)
const configUpdate = {
  schema_version: 1,
  message_type: MessageTypeCodes.DEVICE_CONFIG, // 700
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'WEB 1.0.0',
  event: 'config_update',
  configuration: {
    sampling_interval_ms: 60000,
    power_mode: 'low_power',
    ota_config: {
      auto_update: true,
      update_channel: 'stable',
      update_check_interval_h: 24
    },
    alert_thresholds: {
      temperature: {
        min: -10,
        max: 50,
        enabled: true
      }
    }
  },
  modified_by: 'admin@example.com'
};

const result = validators.deviceConfig(configUpdate);
if (result.valid) {
  // Publish to device: alteriom/nodes/{device_id}/config
  mqttClient.publish(`alteriom/nodes/${configUpdate.device_id}/config`, JSON.stringify(configUpdate));
}

// Configuration snapshot (from device to backend)
mqttClient.subscribe('alteriom/nodes/+/config/snapshot', (message) => {
  const snapshot = JSON.parse(message);
  
  if (isDeviceConfigMessage(snapshot) && snapshot.event === 'config_snapshot') {
    // Store configuration for audit trail
    console.log('Device config:', snapshot.device_id);
    console.log('Power mode:', snapshot.configuration.power_mode);
    console.log('OTA settings:', snapshot.configuration.ota_config);
    
    // Configuration version tracking
    if (snapshot.config_version) {
      console.log('Config version:', snapshot.config_version);
      console.log('Last modified:', snapshot.last_modified);
    }
  }
});
```

**Unified Configuration Standards:**

Both sensors and gateways support consistent management:

| Feature | Sensors | Gateways | Description |
|---------|---------|----------|-------------|
| OTA Configuration | ✅ | ✅ | Auto-update, channels, intervals |
| Network Settings | ✅ | ✅ | WiFi, mesh, MQTT configuration |
| Power Management | ✅ | ✅ | Power modes, sleep duration |
| Reporting Intervals | ✅ | ✅ | Sampling and reporting intervals |
| Log Levels | ✅ | ✅ | Debug, info, warn, error |
| Time Sync | ✅ | ✅ | Timezone, NTP server |
| Alert Thresholds | ✅ | ⚠️ | Sensor-specific thresholds |
| Calibration | ✅ | ⚠️ | Sensor offset calibration |

**Configuration Events:**
- `config_snapshot`: Device reports current configuration state
- `config_update`: Backend requests configuration changes
- `config_request`: Backend queries current configuration

**Key Benefits:**
- Remote configuration without firmware updates
- Configuration backup and restore
- Audit trail with version tracking
- Bulk configuration deployment
- Standardized across device types

## Message Type Codes (v0.8.0+)

For performance optimization and standardized routing, use the optional `message_type` field:

### 🆕 Unified Device Codes (v0.8.0+)

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 101 | `DEVICE_DATA` | device_data | unified | Unified telemetry for all device types (sensor/gateway/bridge/hybrid) |
| 102 | `DEVICE_HEARTBEAT` | device_heartbeat | unified | Unified presence/health check (all device types) |
| 103 | `DEVICE_STATUS` | device_status | unified | Unified status change notification (all device types) |
| 104 | `DEVICE_INFO` | device_info | unified | Unified identification and capabilities (all device types) |
| 105 | `DEVICE_METRICS` | device_metrics | unified | Unified health and performance metrics (all device types) |

### Sensor-Specific Codes

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 200 | `SENSOR_DATA` | sensor_data | telemetry | Sensor telemetry readings |
| 201 | `SENSOR_HEARTBEAT` | sensor_heartbeat | telemetry | Sensor presence/health |
| 202 | `SENSOR_STATUS` | sensor_status | telemetry | Sensor status change |
| 203 | `SENSOR_INFO` | sensor_info | telemetry | Sensor identification and capabilities (v0.7.2+) |
| 204 | `SENSOR_METRICS` | sensor_metrics | telemetry | Sensor health and performance metrics (v0.7.2+) |

### Gateway-Specific Codes

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 302 | `GATEWAY_DATA` | gateway_data | gateway | Gateway telemetry readings (v0.7.2+) |
| 303 | `GATEWAY_HEARTBEAT` | gateway_heartbeat | gateway | Gateway presence/health check (v0.7.2+) |
| 304 | `GATEWAY_STATUS` | gateway_status | gateway | Gateway status change notification (v0.7.2+) |
| 305 | `GATEWAY_INFO` | gateway_info | gateway | Gateway identification ⚠️ **BREAKING v0.8.0: was 300** |
| 306 | `GATEWAY_METRICS` | gateway_metrics | gateway | Gateway health metrics ⚠️ **BREAKING v0.8.0: was 301** |

> **⚠️ BREAKING CHANGES in v0.8.0**: Gateway codes `300` (info) and `301` (metrics) have been realigned to `305` and `306` for consistency. Legacy codes `300` and `301` are **automatically translated** during a 6-month migration period. See [Migration Guide](#v08-migration-guide) below.

### Command & Control

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 400 | `COMMAND` | command | control | Device control command |
| 401 | `COMMAND_RESPONSE` | command_response | control | Command execution result |
| 402 | `CONTROL_RESPONSE` | control_response | control | Legacy control response (deprecated) |

### Firmware & OTA

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 500 | `FIRMWARE_STATUS` | firmware_status | ota | Firmware update status (enhanced v0.7.2+) |

### Mesh Network

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 600 | `MESH_NODE_LIST` | mesh_node_list | mesh | Mesh node inventory |
| 601 | `MESH_TOPOLOGY` | mesh_topology | mesh | Mesh network topology |
| 602 | `MESH_ALERT` | mesh_alert | mesh | Mesh network alert |
| 603 | `MESH_BRIDGE` | mesh_bridge | mesh | Mesh protocol bridge (v0.7.1+) |
| 604 | `MESH_STATUS` | mesh_status | mesh | Mesh network health status (v0.7.2+) |
| 605 | `MESH_METRICS` | mesh_metrics | mesh | Mesh network performance metrics (v0.7.2+) |

### Bridge Management (v0.8.0+)

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 610 | `BRIDGE_STATUS` | bridge_status | bridge | Bridge health and connectivity broadcast |
| 611 | `BRIDGE_ELECTION` | bridge_election | bridge | RSSI-based bridge election candidacy |
| 612 | `BRIDGE_TAKEOVER` | bridge_takeover | bridge | Bridge role takeover announcement |
| 613 | `BRIDGE_COORDINATION` | bridge_coordination | bridge | Multi-bridge coordination and load balancing |
| 614 | `TIME_SYNC_NTP` | time_sync_ntp | bridge | Bridge-to-mesh NTP time distribution |

### Configuration & Efficiency

| Code | Constant | Message Type | Category | Description |
|------|----------|--------------|----------|-------------|
| 700 | `DEVICE_CONFIG` | device_config | config | Device configuration management (v0.7.1+) |
| 800 | `BATCH_ENVELOPE` | batch_envelope | efficiency | Message batching for 50-90% protocol overhead reduction (v0.7.3+) |
| 810 | `COMPRESSED_ENVELOPE` | compressed_envelope | efficiency | Compressed message envelope (v0.7.3+) |

### Benefits

- **Significantly Faster**: O(1) lookup vs O(n) heuristic matching (avoids 12+ conditional checks)
- **Protocol Alignment**: Compatible with CoAP and MQTT-SN numeric type systems
- **Clear Intent**: Explicit message type declaration
- **Efficient Routing**: Switch-case routing in backend systems
- **Backward Compatible**: Falls back to heuristics if omitted

### Usage

```ts
import { MessageTypeCodes } from '@alteriom/mqtt-schema';

const message = {
  schema_version: 1,
  message_type: MessageTypeCodes.SENSOR_DATA, // 200
  // ... rest of message
};
```

### v0.8 Migration Guide

**Breaking Changes:**
- `GATEWAY_INFO`: Code `300` → `305`
- `GATEWAY_METRICS`: Code `301` → `306`

**Migration Timeline (6 months):**
1. **Phase 1 (Months 1-3)**: Both old and new codes accepted. Library automatically translates `300→305` and `301→306`.
2. **Phase 2 (Months 4-6)**: Deprecation warnings logged for legacy codes.
3. **Phase 3 (After 6 months)**: Legacy codes `300` and `301` rejected.

**Action Required:**

```ts
// ❌ Old code (deprecated in v0.8.0)
const message = {
  message_type: 300, // gateway_info
  // ...
};

// ✅ New code (v0.8.0+)
const message = {
  message_type: MessageTypeCodes.GATEWAY_INFO, // 305
  // ...
};

// ✅ Better: Use unified device schemas (v0.8.0+)
const message = {
  message_type: MessageTypeCodes.DEVICE_INFO, // 104
  device_role: 'gateway', // Explicit role indicator
  // ...
};
```

**Legacy Code Translation:**

The library includes `LEGACY_CODE_MAP` for automatic translation:

```ts
import { LEGACY_CODE_MAP } from '@alteriom/mqtt-schema';

console.log(LEGACY_CODE_MAP); // { 300: 305, 301: 306 }

// Automatic translation in classifyAndValidate()
const oldMessage = { message_type: 301, /* ... */ };
const { kind, result } = classifyAndValidate(oldMessage);
// kind === 'gatewayMetrics' (automatically translated 301→306)
```

**HTTP Transport Support (v0.8.0+):**

New `transport_metadata` field enables HTTP REST API integration:

```ts
const httpMessage = {
  schema_version: 1,
  message_type: 101, // DEVICE_DATA
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.5',
  transport_metadata: {
    protocol: 'http',
    correlation_id: 'req-12345',
    http: {
      method: 'POST',
      path: '/api/v1/telemetry',
      status_code: 200,
      request_id: 'req-uuid-12345'
    }
  },
  sensors: { temp: { value: 22.5, unit: 'C' } }
};
```

## Provided Schemas (v1)

| File | Purpose |
|------|---------|
| envelope.schema.json | Base required envelope fields (now with optional message_type) |
| sensor_data.schema.json | Telemetry payload with sensors map |
| sensor_heartbeat.schema.json | Lightweight heartbeat (firmware_version may be omitted) |
| sensor_status.schema.json | Sensor status / presence updates |
| **sensor_info.schema.json** | **Sensor identification and capabilities (v0.7.2+)** |
| **sensor_metrics.schema.json** | **Sensor health and performance metrics (v0.7.2+)** |
| gateway_info.schema.json | Gateway identity & capabilities |
| gateway_metrics.schema.json | Gateway performance metrics |
| **gateway_data.schema.json** | **Gateway telemetry readings (v0.7.2+)** |
| **gateway_heartbeat.schema.json** | **Gateway presence/health check (v0.7.2+)** |
| **gateway_status.schema.json** | **Gateway status change notification (v0.7.2+)** |
| firmware_status.schema.json | Firmware update lifecycle events (enhanced v0.7.2+) |
| control_response.schema.json | Command/control response messages (deprecated, use command_response) |
| **command.schema.json** | **Device control commands (v0.5.0+)** |
| **command_response.schema.json** | **Command execution responses with correlation (v0.5.0+)** |
| mesh_node_list.schema.json | Mesh network node list with status |
| mesh_topology.schema.json | Mesh network topology and connections |
| mesh_alert.schema.json | Mesh network alerts and warnings |
| **mesh_bridge.schema.json** | **Mesh protocol bridge for painlessMesh integration (v0.7.1+)** |
| **mesh_status.schema.json** | **Mesh network health status (v0.7.2+)** |
| **mesh_metrics.schema.json** | **Mesh network performance metrics (v0.7.2+)** |
| **device_config.schema.json** | **Unified device configuration management for sensors & gateways (v0.7.1+)** |
| **batch_envelope.schema.json** | **Message batching for 50-90% protocol overhead reduction (v0.7.3+)** |
| **compressed_envelope.schema.json** | **Compressed message envelope for bandwidth optimization (v0.7.3+)** |

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `validators` | object | Precompiled validators per message type |
| `validateMessage(kind,data)` | fn | Run a specific validator by key |
| `classifyAndValidate(data)` | fn | Fast classification + validation (uses message_type if present) |
| `MessageTypeCodes` | const object | Message type code constants (v0.7.2+) |
| `SensorDataMessage` etc. | TS interfaces | Strongly typed shapes |
| `isSensorDataMessage` etc. | type guards | Runtime narrowing helpers |
| `SensorInfoMessage`, `SensorMetricsMessage` | TS interfaces | New sensor types (v0.7.2+) |
| `GatewayDataMessage`, `GatewayHeartbeatMessage`, `GatewayStatusMessage` | TS interfaces | New gateway types (v0.7.2+) |
| `MeshStatusMessage`, `MeshMetricsMessage` | TS interfaces | New mesh types (v0.7.2+) |
| `MeshBridgeMessage` | TS interface | Mesh bridge message type (v0.7.1+) |
| `BatchEnvelopeMessage`, `CompressedEnvelopeMessage` | TS interfaces | New message types (v0.7.3+) |
| `isSensorInfoMessage`, `isSensorMetricsMessage` etc. | type guards | Type guards for new messages (v0.7.2+) |
| `isBatchEnvelopeMessage`, `isCompressedEnvelopeMessage` | type guards | Type guards for new messages (v0.7.3+) |
| `schemas/*.json` | JSON | Original schema assets (optional) |

### Validator Keys

`sensorData`, `sensorHeartbeat`, `sensorStatus`, `sensorInfo` (v0.7.2+), `sensorMetrics` (v0.7.2+), `gatewayInfo`, `gatewayMetrics`, `gatewayData` (v0.7.2+), `gatewayHeartbeat` (v0.7.2+), `gatewayStatus` (v0.7.2+), `firmwareStatus`, `controlResponse`, `command`, `commandResponse`, `meshNodeList`, `meshTopology`, `meshAlert`, `meshBridge` (v0.7.1+), `meshStatus` (v0.7.2+), `meshMetrics` (v0.7.2+), `deviceConfig` (v0.7.1+), `batchEnvelope` (v0.7.3+), `compressedEnvelope` (v0.7.3+)

### Classification Strategy

**v0.7.3+ Fast Path (when `message_type` present):**
- Direct O(1) lookup using message type code (200-605, 700, 800, 810)
- Supports all 23 message types including batch_envelope, compressed_envelope, and all v0.7.2 additions
- 90% faster than heuristic matching
- Validates that structure matches declared type

**Heuristics (when `message_type` absent - backward compatible):**
- `event: "command"` → `command` (v0.5.0+)
- `event: "command_response"` → `commandResponse` (v0.5.0+)
- `event: "mesh_bridge"` → `meshBridge` (v0.7.1+)
- `event: "config_snapshot"`, `"config_update"`, or `"config_request"` → `deviceConfig` (v0.7.1+)
- `metrics` + `device_type: "sensor"` → `sensorMetrics` (v0.7.2+)
- `metrics` + `device_type: "gateway"` → `gatewayMetrics`
- `sensors` + `device_type: "gateway"` → `gatewayData` (v0.7.2+)
- `sensors` → `sensorData`
- `capabilities` or `available_sensors` → `sensorInfo` (v0.7.2+)
- `mesh_status` field → `meshStatus` (v0.7.2+)
- `mesh_network_id` + `metrics` → `meshMetrics` (v0.7.2+)
- `nodes` array → `meshNodeList`
- `connections` array → `meshTopology`
- `alerts` array → `meshAlert`
- `progress_pct` or OTA status keywords → `firmwareStatus`
- `status` + `device_type: sensor` → `sensorStatus`
- `uptime_s` + `device_type: gateway` + no `metrics` → `gatewayHeartbeat` (v0.7.2+)
- `status: online|offline|error` + `device_type: gateway` → `gatewayStatus` (v0.7.2+)
- `status: ok|error` (no other match) → `controlResponse`
- `device_type: gateway` → `gatewayInfo`
- fallback → `sensorHeartbeat`

## Versioning Policy

Schema stability is paramount. We track two related versions:

| Concept | Meaning |
|---------|---------|
| `schema_version` (in payload) | Wire format major. Only increments for breaking changes. |
| npm package version | Follows semver; patch/minor may add optional properties or tooling, major aligns with `schema_version` bump. |

Backward‑compatible additions: new optional properties or enums, documented in CHANGELOG. Breaking: new required fields, structural changes, or removed properties (triggers parallel `v2` schema path & coordinated firmware rollout).

## TypeScript / Bundler Notes

- Works in TS >= 5, Node >= 16, Vite / Webpack / ESBuild.
- Tree shaking: unused validators pruned when using ESM builds.
- No side effects besides Ajv instance creation.

## Roadmap

- Optional custom Ajv injection hook
- JSON Schema → Zod conversion example
- Runtime metrics helper (count validation categories)

## Contributing

Issues & PRs welcome. Ensure firmware repo schemas remain the authoritative source—do not manually edit generated `schema_data.ts`.

### Development Workflow

**Before opening a PR:** Run the comprehensive validation suite:

```bash
npm run verify        # Schema sync + changelog + fixtures
npm run verify:all    # Additional schema compilation + OTA manifest validation  
npm test              # Enhanced fixture validation with detailed reporting
```

**Available validation scripts:**
- `npm run test` - Cross-platform fixture validation (CJS/ESM) with enhanced error reporting
- `npm run test:ota` - OTA manifest fixture validation
- `npm run verify:schemas` - Ensure schemas are synced from source directory
- `npm run verify:release` - Check changelog contains current version
- `npm run verify:all` - Comprehensive schema compilation and fixture validation

### Script Organization

Scripts are organized by category in `package.json`:
- **Build Scripts**: `build`, `build:cjs`, `build:esm`, `clean`, etc.
- **Testing & Validation**: `test`, `verify:*`, etc.  
- **Release Management**: `release:prepare`, `wiki:generate`
- **Repository Metadata**: `metadata:*` (organization compliance)

### Release Process

See `PUBLISH_CHECKLIST.md` for detailed release procedures. Quick summary:
1. Update schemas in `docs/mqtt_schema/`
2. Run `npm run verify` to ensure everything is valid
3. Use `npm run release:prepare -- patch|minor|major` for version bumping
4. Follow checklist for tagging and publishing

## Security

Schemas are static. No network access. Supply-chain risk minimized by keeping dependencies minimal (Ajv + formats only).

## License

MIT

## Registry Mirrors

This package is published to BOTH:

- Public npm registry: `https://registry.npmjs.org` (primary)
- GitHub Packages registry: `https://npm.pkg.github.com` (mirror for visibility in repo Packages tab)

### Installing from GitHub Packages (optional)

Create or update an `.npmrc` with a scoped registry override (auth token with `read:packages` required):

```bash
@alteriom:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install normally:

```bash
npm install @alteriom/mqtt-schema ajv ajv-formats
```

If you omit the override, npmjs.org is used (recommended for most consumers).

### Why dual publish?

- GitHub Packages listing provides provenance + quick visibility in the repo UI.
- npm remains the canonical public distribution source (faster, anonymous installs allowed).

### Operational Notes

| Aspect | Behavior |
|--------|----------|
| Build artifact | Built once, same tarball published to both registries. |
| Version uniqueness | Same version must not be republished; bump if any change needed. |
| Auth (GitHub) | Always required for install from GitHub Packages, even for public repos. |
| Tarball parity | Do not rebuild between publishes; workflows ensure single build. |
| Fallback strategy | If mirror publish fails (e.g., transient), primary npm publish still stands. |
| Provenance flag | Applied for npm (GitHub ignores currently). |

### Verifying a Release

```bash
npm view @alteriom/mqtt-schema version
npm view @alteriom/mqtt-schema version --registry=https://npm.pkg.github.com
```

Both should return the same version.

## Repository Metadata Compliance

This repository integrates the `@alteriom/repository-metadata-manager` tooling to continuously validate and report on repository metadata health (description, topics, documentation signals, etc.) within the Alteriom organization standards.

### Local Usage

Run a validation (non‑destructive):

```bash
npm run metadata:validate
```

Generate a detailed report:

```bash
npm run metadata:report
```

Configuration lives in `metadata-config.json` (organizationTag `alteriom`). Default detection is auto; adjust if repository classification needs overriding.

### CI Workflow

Workflow file: `.github/workflows/metadata-compliance.yml`

On each push / PR against `main` it will:

1. Install dependencies
2. Run `metadata:validate` (fails job on hard non‑compliance)
3. Always attempt a best‑effort report (`metadata:report`) for visibility

### Tokens / Permissions

The workflow relies only on the default `GITHUB_TOKEN` for read operations. If future auto‑apply operations are desired, a token with elevated repo scope would be needed and the `metadata:apply` script could be wired (currently omitted to keep CI read‑only).

### Extending

If you add new categories of tooling or documentation, re‑run the report to see updated recommendations. For cross‑repo analytics or policy generation, use the original project directly.

### Applying Metadata (Manual Workflow)

For authorized maintainers you can run adjustments via GitHub Actions:

1. Open the "Repository Metadata Apply" workflow under the Actions tab.
2. Choose whether to keep `dryRun` (default) or set to `false` to apply.
3. Run the workflow; the log will show proposed or applied changes.

Local dry‑run vs apply:

```bash
npm run metadata:apply:dry  # show what would change
npm run metadata:apply      # apply changes (requires proper permissions via GITHUB_TOKEN)
```

Note: Applying metadata modifies repository settings (description, topics) through the GitHub API; ensure the default token has the necessary repo scopes (in public repositories the workflow GITHUB_TOKEN normally suffices for these fields).

## Additional Documentation

This repository maintains comprehensive documentation across several locations:

### Root Documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Complete version history with breaking changes and migration guides
- **[ROADMAP.md](./ROADMAP.md)** - Planned features and development timeline
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[SECURITY.md](./SECURITY.md)** - Security policy and vulnerability reporting
- **[PUBLISH_CHECKLIST.md](./PUBLISH_CHECKLIST.md)** - Release process and verification steps
- **[API_MONITOR_GUIDE.md](./API_MONITOR_GUIDE.md)** - Integration guide for monitoring systems
- **[V080_BREAKING_CHANGES.md](./V080_BREAKING_CHANGES.md)** - v0.8.0 migration guide (current)

### docs/ Directory Structure
- **[docs/README.md](./docs/README.md)** - Documentation index with quick links
- **[docs/mqtt_schema/](./docs/mqtt_schema/)** - Authoritative schema definitions, types, and fixtures
- **[docs/releases/](./docs/releases/)** - Historical release notes and summaries
- **[docs/archive/](./docs/archive/)** - Development history and feature implementation documents

See [docs/README.md](./docs/README.md) for the complete documentation structure.

