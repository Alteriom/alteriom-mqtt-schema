# Schema Extension Analysis for Firmware and Website Support

## Current State Analysis

The Alteriom MQTT Schema v1 provides comprehensive coverage for:
- Sensor data telemetry with flexible sensor entries
- Gateway information and metrics
- Firmware update status tracking
- Command/control flow with correlation IDs
- Mesh network topology and alerts
- Status and heartbeat messages

## Identified Extension Opportunities

### 1. Enhanced Sensor Data Schema

**Current Limitations:**
- No standardized way to include sensor metadata (calibration date, accuracy, range)
- Missing sensor health indicators beyond quality_score
- No timestamp per sensor reading (all readings share message timestamp)

**Proposed Extensions:**
```json
{
  "sensors": {
    "temperature": {
      "value": 22.3,
      "unit": "C",
      "timestamp": "2025-10-19T21:00:00.000Z",  // NEW: Per-sensor timestamp
      "accuracy": 0.5,                          // NEW: Sensor accuracy ±value
      "last_calibration": "2025-01-15",         // NEW: Last calibration date
      "error_margin_pct": 2.0,                  // NEW: Error margin percentage
      "operational_range": {                    // NEW: Valid operational range
        "min": -40,
        "max": 85
      }
    }
  }
}
```

**Benefits:**
- Websites can display sensor accuracy and calibration status
- Firmware can track individual sensor reading times (useful for multi-sensor polling)
- Better data quality assessment for analytics

### 2. Enhanced Gateway Metrics

**Current Limitations:**
- No network-related metrics (bandwidth, active connections)
- Missing storage/disk usage information
- No error/warning counters

**Proposed Extensions:**
```json
{
  "metrics": {
    "uptime_s": 1234,
    "storage_usage_pct": 45.2,              // NEW: Disk/flash usage
    "storage_total_mb": 512,                // NEW: Total storage capacity
    "network_rx_kbps": 125.4,               // NEW: Receive bandwidth
    "network_tx_kbps": 89.3,                // NEW: Transmit bandwidth
    "active_connections": 5,                // NEW: Active network connections
    "error_count_24h": 12,                  // NEW: Error count in last 24h
    "warning_count_24h": 3,                 // NEW: Warning count in last 24h
    "restart_count": 2,                     // NEW: Restart counter
    "last_restart_reason": "watchdog"       // NEW: Last restart cause
  }
}
```

**Benefits:**
- Better system health monitoring on dashboards
- Proactive maintenance based on error trends
- Storage management alerts

### 3. Enhanced Location and Environment Support

**Current Limitations:**
- Location is only a string field in sensor entries
- No standardized geolocation support
- Missing environmental context

**Proposed Extensions:**

Add new optional top-level fields to envelope:
```json
{
  "location": {                             // NEW: Standardized location object
    "latitude": 43.6532,
    "longitude": -79.3832,
    "altitude": 76.5,
    "accuracy_m": 10.0,
    "zone": "warehouse_A",
    "description": "Shelf 3, Row B"
  },
  "environment": {                          // NEW: Environmental metadata
    "deployment_type": "indoor",            // indoor/outdoor/mobile
    "power_source": "battery",              // battery/mains/solar/mixed
    "expected_battery_life_days": 365
  }
}
```

**Benefits:**
- Map-based visualization in web dashboards
- Better asset tracking
- Context-aware alerting
- Deployment planning insights

### 4. Data Quality and Validation Metadata

**Current Limitations:**
- No standardized way to flag suspect data
- Missing data provenance information

**Proposed Extensions:**
```json
{
  "data_quality": {                         // NEW: Data quality metadata
    "validation_status": "verified",        // verified/suspect/failed
    "anomaly_score": 0.12,                  // 0-1, higher = more unusual
    "data_source": "primary_sensor",        // primary_sensor/backup/estimated
    "interpolated": false,                  // Is this interpolated data?
    "correction_applied": false             // Was correction/calibration applied?
  }
}
```

**Benefits:**
- Data scientists can filter reliable data
- Automatic anomaly detection support
- Better debugging of sensor issues

### 5. Enhanced Command Schema

**Current Limitations:**
- No command scheduling support
- Missing retry policies
- No command dependency chain

**Proposed Extensions:**
```json
{
  "event": "command",
  "command": "read_sensors",
  "schedule": {                             // NEW: Scheduling support
    "execute_at": "2025-10-20T08:00:00Z",  // Future execution time
    "repeat": "daily",                      // none/daily/weekly/monthly
    "repeat_until": "2025-12-31T23:59:59Z"
  },
  "retry_policy": {                         // NEW: Retry configuration
    "max_attempts": 3,
    "retry_delay_ms": 5000,
    "backoff_multiplier": 2.0
  },
  "depends_on": ["cmd-123", "cmd-124"]     // NEW: Command dependencies
}
```

**Benefits:**
- Scheduled operations without external schedulers
- Resilient command execution
- Complex multi-step operations

### 6. Security and Authentication Metadata

**Current Limitations:**
- No message signing or integrity verification
- Missing authentication context

**Proposed Extensions:**
```json
{
  "security": {                             // NEW: Security metadata
    "message_signature": "sha256:abc123...", // Optional message signature
    "auth_token_hash": "hash123...",        // Authentication token hash
    "encryption_method": "none",            // none/aes256/custom
    "requires_ack": true                    // Require acknowledgment
  }
}
```

**Benefits:**
- Message integrity verification
- Audit trail for critical commands
- Enhanced security for sensitive operations

### 7. Firmware Configuration Snapshot

**New Message Type:**
```json
{
  "schema_version": 1,
  "device_id": "SN123",
  "device_type": "sensor",
  "timestamp": "2025-10-19T21:00:00.000Z",
  "firmware_version": "SN 2.0.8",
  "event": "config_snapshot",
  "configuration": {
    "sampling_interval_ms": 30000,
    "sensors_enabled": ["temperature", "humidity"],
    "transmission_mode": "wifi",
    "power_mode": "low_power",
    "calibration_offsets": {
      "temperature": 0.5,
      "humidity": -2.0
    }
  },
  "config_version": "1.2.0",
  "last_modified": "2025-10-15T10:30:00Z"
}
```

**Benefits:**
- Remote configuration audit
- Configuration backup and restore
- Troubleshooting device behavior

## Recommended Implementation Priority

### Phase 1 (High Priority - Immediate Value)
1. Enhanced Gateway Metrics (storage, network, errors)
2. Location/Geolocation Support
3. Enhanced Sensor Metadata (accuracy, calibration)

### Phase 2 (Medium Priority - Quality of Life)
4. Data Quality Metadata
5. Enhanced Command Scheduling
6. Configuration Snapshot Message Type

### Phase 3 (Lower Priority - Advanced Features)
7. Security Metadata (optional, for enterprise deployments)

## Implementation Approach

All extensions should:
1. Be **backward compatible** - all new fields are optional
2. Use `additionalProperties: true` pattern
3. Follow existing naming conventions (snake_case)
4. Include comprehensive validation in schemas
5. Maintain `schema_version: 1` (backward compatible additions)
6. Add fixture files for testing
7. Update TypeScript types
8. Document in CHANGELOG

## Next Steps

1. Implement Phase 1 extensions
2. Add validation tests with fixtures
3. Update TypeScript types and type guards
4. Document changes in CHANGELOG
5. Verify backward compatibility
