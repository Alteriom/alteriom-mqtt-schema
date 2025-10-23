# Device Configuration Management - Implementation Summary

## Overview

Added unified device configuration management schema (v0.7.1) supporting both sensors and gateways with consistent standards for OTA, health monitoring, and status reporting.

## What Was Added

### New Schema: `device_config.schema.json`

**Message Type Code:** 700

**Event Types:**
- `config_snapshot` - Device reports current configuration state
- `config_update` - Backend requests configuration changes
- `config_request` - Backend queries current configuration

### Unified Configuration Standards

Both sensors and gateways now support:

| Feature | Description | Sensor Support | Gateway Support |
|---------|-------------|----------------|-----------------|
| **OTA Configuration** | Auto-update settings, channels, intervals, downgrade policy | ✅ | ✅ |
| **Network Settings** | WiFi, mesh, MQTT broker configuration | ✅ | ✅ |
| **Power Management** | Power modes (normal, low_power, ultra_low_power, always_on) | ✅ | ✅ |
| **Sleep Duration** | Deep sleep configuration for battery optimization | ✅ | ✅ |
| **Reporting Intervals** | Sampling and reporting interval configuration | ✅ | ✅ |
| **Alert Thresholds** | Per-sensor min/max thresholds with enable flags | ✅ | ⚠️ Limited |
| **Calibration Offsets** | Per-sensor calibration offset values | ✅ | ⚠️ Limited |
| **Log Levels** | Debug, info, warn, error, none | ✅ | ✅ |
| **Time Sync** | Timezone and NTP server configuration | ✅ | ✅ |

### Configuration Parameters

**Sampling & Reporting:**
```json
{
  "sampling_interval_ms": 30000,
  "reporting_interval_ms": 60000,
  "sensors_enabled": ["temperature", "humidity"]
}
```

**Power Management:**
```json
{
  "transmission_mode": "wifi",
  "power_mode": "low_power",
  "sleep_duration_ms": 25000
}
```

**Network Configuration:**
```json
{
  "network_config": {
    "wifi_ssid": "alteriom-iot",
    "wifi_channel": 6,
    "mesh_prefix": "alteriom-mesh",
    "mesh_port": 5555,
    "mqtt_broker": "mqtt.alteriom.io",
    "mqtt_port": 1883,
    "mqtt_topic_prefix": "alteriom/sensors"
  }
}
```

**OTA Configuration:**
```json
{
  "ota_config": {
    "auto_update": true,
    "update_channel": "stable",
    "update_check_interval_h": 24,
    "allow_downgrade": false
  }
}
```

**Calibration & Alerts:**
```json
{
  "calibration_offsets": {
    "temperature": 0.5,
    "humidity": -2.0
  },
  "alert_thresholds": {
    "temperature": {
      "min": -10,
      "max": 50,
      "enabled": true
    }
  }
}
```

**System Settings:**
```json
{
  "log_level": "info",
  "timezone": "America/New_York",
  "ntp_server": "pool.ntp.org"
}
```

### Metadata & Tracking

```json
{
  "config_version": "1.2.0",
  "last_modified": "2025-10-20T10:30:00.000Z",
  "modified_by": "admin",
  "validation_errors": [
    {
      "field": "sampling_interval_ms",
      "error": "Value must be between 1000 and 86400000"
    }
  ]
}
```

## Use Cases

### 1. Remote Configuration Update

```typescript
import { validators, MessageTypeCodes } from '@alteriom/mqtt-schema';

// Update sensor configuration remotely
const configUpdate = {
  schema_version: 1,
  message_type: MessageTypeCodes.DEVICE_CONFIG,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'WEB 1.0.0',
  event: 'config_update',
  configuration: {
    sampling_interval_ms: 60000,
    power_mode: 'ultra_low_power',
    ota_config: {
      auto_update: false
    }
  },
  modified_by: 'admin@example.com'
};

const result = validators.deviceConfig(configUpdate);
if (result.valid) {
  mqttClient.publish(`alteriom/nodes/${configUpdate.device_id}/config`, 
                     JSON.stringify(configUpdate));
}
```

### 2. Configuration Snapshot

```typescript
// Device reports current configuration
const snapshot = {
  schema_version: 1,
  message_type: 700,
  device_id: 'GW-MAIN',
  device_type: 'gateway',
  event: 'config_snapshot',
  configuration: {
    network_config: {
      mesh_prefix: 'alteriom-mesh',
      mqtt_broker: 'mqtt.alteriom.io'
    },
    ota_config: {
      auto_update: true,
      update_channel: 'stable'
    }
  },
  config_version: '2.0.1',
  last_modified: '2025-10-22T14:15:00.000Z'
};
```

### 3. Configuration Audit Trail

```typescript
// Backend tracks configuration changes
mqttClient.subscribe('alteriom/nodes/+/config/snapshot', (message) => {
  const config = JSON.parse(message);
  
  // Store in database for audit
  database.configurations.insert({
    device_id: config.device_id,
    config_version: config.config_version,
    configuration: config.configuration,
    modified_by: config.modified_by,
    timestamp: config.timestamp
  });
});
```

### 4. Bulk Configuration Deployment

```typescript
// Update multiple devices with same configuration
const deviceIds = ['SN001', 'SN002', 'SN003'];
const bulkConfig = {
  ota_config: {
    auto_update: true,
    update_channel: 'beta'
  },
  power_mode: 'low_power'
};

deviceIds.forEach(deviceId => {
  const update = createConfigUpdate(deviceId, bulkConfig);
  mqttClient.publish(`alteriom/nodes/${deviceId}/config`, 
                     JSON.stringify(update));
});
```

## Benefits

### 1. Unified Standards
- Consistent configuration across all device types
- Reduces firmware complexity (single config schema)
- Easier backend integration

### 2. Remote Management
- No firmware reflashing required for config changes
- Instant configuration updates
- Reduced device downtime

### 3. Audit & Compliance
- Full configuration history tracking
- Version control for configurations
- User attribution for changes

### 4. Operational Efficiency
- Bulk configuration deployment
- Configuration backup and restore
- Troubleshooting device behavior with config snapshots

### 5. OTA Standardization
- Consistent OTA settings across devices
- Gateway and sensor both support auto-updates
- Unified update channel management

## Implementation Details

### Files Added
1. **`docs/mqtt_schema/device_config.schema.json`** - JSON Schema definition
2. **`docs/mqtt_schema/fixtures/device_config_sensor_snapshot.json`** - Sensor config example
3. **`docs/mqtt_schema/fixtures/device_config_gateway_snapshot.json`** - Gateway config example
4. **`docs/mqtt_schema/fixtures/device_config_update_request.json`** - Update request example

### Files Modified
1. **`docs/mqtt_schema/types.ts`** - Added `DeviceConfigMessage` interface and type guard
2. **`docs/mqtt_schema/envelope.schema.json`** - Added message type code 700
3. **`src/validators.ts`** - Added `deviceConfig` validator and classification
4. **`scripts/copy-schemas.cjs`** - Added device_config to copy list
5. **`README.md`** - Added configuration management documentation
6. **`docs/mqtt_schema/CHANGELOG.md`** - Documented v0.7.1 configuration features

### TypeScript Interface

```typescript
export interface DeviceConfigMessage extends BaseEnvelope {
  firmware_version: string;
  message_type?: 700;
  event: 'config_snapshot' | 'config_update' | 'config_request';
  configuration: {
    sampling_interval_ms?: number;
    reporting_interval_ms?: number;
    sensors_enabled?: string[];
    transmission_mode?: 'wifi' | 'mesh' | 'mixed' | 'cellular';
    power_mode?: 'normal' | 'low_power' | 'ultra_low_power' | 'always_on';
    sleep_duration_ms?: number;
    calibration_offsets?: Record<string, number>;
    alert_thresholds?: Record<string, {
      min?: number;
      max?: number;
      enabled?: boolean;
    }>;
    network_config?: {
      wifi_ssid?: string;
      wifi_channel?: number;
      mesh_prefix?: string;
      mesh_password?: string;
      mesh_port?: number;
      mqtt_broker?: string;
      mqtt_port?: number;
      mqtt_topic_prefix?: string;
    };
    ota_config?: {
      auto_update?: boolean;
      update_channel?: 'stable' | 'beta' | 'dev';
      update_check_interval_h?: number;
      allow_downgrade?: boolean;
    };
    log_level?: 'debug' | 'info' | 'warn' | 'error' | 'none';
    timezone?: string;
    ntp_server?: string;
    [k: string]: unknown;
  };
  config_version?: string;
  last_modified?: string;
  modified_by?: string;
  validation_errors?: Array<{
    field?: string;
    error?: string;
  }>;
}
```

## Testing

### Test Results
- ✅ 25/25 test fixtures passing (CJS + ESM)
- ✅ 3 new configuration fixtures added
- ✅ Schema validation verified
- ✅ CodeQL security scan: 0 vulnerabilities

### Test Fixtures
1. **device_config_sensor_snapshot.json** - Full sensor configuration snapshot
2. **device_config_gateway_snapshot.json** - Full gateway configuration snapshot
3. **device_config_update_request.json** - Partial configuration update

## Backward Compatibility

**100% backward compatible** - All changes are optional:
- New message type code 700
- All configuration fields are optional
- Existing devices work unchanged
- Gradual adoption supported

## Next Steps

### Firmware Implementation
1. Add configuration storage (SPIFFS, LittleFS, EEPROM)
2. Implement config_update event handler
3. Add config_snapshot reporting on request
4. Persist configuration across reboots

### Backend Implementation
1. Configuration management UI
2. Database schema for config storage
3. Configuration validation and history
4. Bulk configuration deployment tools

### Future Enhancements
1. Configuration templates
2. Role-based configuration access
3. Configuration diff and rollback
4. Configuration inheritance (fleet → device)

---

**Version:** v0.7.1  
**Date:** 2025-10-23  
**Status:** Production Ready  
**Breaking Changes:** None
