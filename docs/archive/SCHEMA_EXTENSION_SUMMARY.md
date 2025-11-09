# Schema Extension Summary (v0.6.0)

## Overview

This release extends the Alteriom MQTT Schema v1 with **backward-compatible** enhancements requested in the issue: "review the schema details and see if we could extend it even more to support our firmware and websites."

## What Was Added

### 1. Location & Geolocation Support (Base Envelope)

**Problem Solved**: No standardized way to track device location for asset management and map visualization.

**New Fields** (all optional):
```typescript
location?: {
  latitude?: number;        // GPS latitude (-90 to 90)
  longitude?: number;       // GPS longitude (-180 to 180)
  altitude?: number;        // Altitude in meters
  accuracy_m?: number;      // Position accuracy in meters
  zone?: string;            // Logical zone (e.g., "warehouse_A")
  description?: string;     // Human-readable description
}
```

**Use Cases**:
- Map-based device visualization in web dashboards
- Asset tracking and inventory management
- Zone-based alerting and monitoring
- Physical deployment planning

### 2. Environment Metadata (Base Envelope)

**Problem Solved**: Missing context about device deployment and power source.

**New Fields** (all optional):
```typescript
environment?: {
  deployment_type?: 'indoor' | 'outdoor' | 'mobile' | 'mixed';
  power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
  expected_battery_life_days?: number;
}
```

**Use Cases**:
- Context-aware alerting (outdoor devices need different thresholds)
- Power management and battery life tracking
- Deployment type filtering in dashboards
- Maintenance scheduling based on power source

### 3. Enhanced Sensor Metadata (Sensor Data)

**Problem Solved**: Insufficient data quality metadata for sensor readings.

**New Fields** (all optional per sensor):
```typescript
sensors: {
  [sensorName]: {
    timestamp?: string;           // Per-sensor reading time
    accuracy?: number;             // Sensor accuracy (±value)
    last_calibration?: string;     // Last calibration date
    error_margin_pct?: number;     // Error margin (0-100%)
    operational_range?: {          // Valid range
      min: number;
      max: number;
    };
  }
}
```

**Use Cases**:
- Data quality assessment and filtering
- Sensor health monitoring and maintenance alerts
- Calibration tracking and scheduling
- Async multi-sensor polling (different timestamps)
- Out-of-range detection and validation

### 4. Comprehensive Gateway Metrics

**Problem Solved**: Limited system health monitoring capabilities.

**New Fields** (all optional):
```typescript
metrics: {
  // Storage monitoring
  storage_usage_pct?: number;
  storage_total_mb?: number;
  storage_free_mb?: number;
  
  // Network bandwidth
  network_rx_kbps?: number;
  network_tx_kbps?: number;
  active_connections?: number;
  
  // System health
  error_count_24h?: number;
  warning_count_24h?: number;
  restart_count?: number;
  last_restart_reason?: string;
}
```

**Use Cases**:
- Proactive storage management and alerts
- Network bandwidth monitoring
- Error trend analysis
- System stability tracking
- Root cause analysis for failures

## Implementation Details

### Backward Compatibility Guarantee

✅ **All new fields are optional**
✅ **No required fields were added**
✅ **All existing messages remain valid**
✅ **schema_version: 1 unchanged**
✅ **No breaking changes**

### Validation

- ✅ 14/14 existing fixtures pass
- ✅ 3 new fixtures demonstrating enhanced features
- ✅ 12 comprehensive test cases
- ✅ Schema sync verification passes
- ✅ No security vulnerabilities
- ✅ Code review passed with no issues

### Files Modified

**Core Schema Files** (docs/mqtt_schema/):
- `envelope.schema.json` - Added location and environment
- `sensor_data.schema.json` - Added sensor metadata fields
- `gateway_metrics.schema.json` - Added comprehensive metrics
- `types.ts` - Updated TypeScript interfaces
- `CHANGELOG.md` - Documented all changes
- `validation_rules.md` - Added validation constraints

**Test Files**:
- Added `sensor_data_enhanced_valid.json`
- Added `gateway_metrics_enhanced_valid.json`
- Added `sensor_with_location_valid.json`
- Added `test-enhanced-features.cjs` (12 test cases)

**Documentation**:
- Updated `README.md` with usage examples
- Updated `package.json` to v0.6.0
- Created `SCHEMA_EXTENSION_ANALYSIS.md` with design rationale

## Adoption Path

### For Firmware

Firmware can adopt new fields incrementally without coordination:

1. **Phase 1** - Add location tracking:
   ```c
   payload.location.latitude = gps.lat;
   payload.location.longitude = gps.lon;
   payload.location.zone = "warehouse_A";
   ```

2. **Phase 2** - Add environment context:
   ```c
   payload.environment.deployment_type = "outdoor";
   payload.environment.power_source = "battery";
   ```

3. **Phase 3** - Enhance sensor metadata:
   ```c
   sensor.accuracy = 0.5;
   sensor.last_calibration = "2025-01-15";
   sensor.operational_range.min = -40;
   sensor.operational_range.max = 85;
   ```

4. **Phase 4** - Add gateway health metrics:
   ```c
   metrics.storage_usage_pct = get_storage_usage();
   metrics.error_count_24h = get_error_count();
   metrics.last_restart_reason = "firmware_update";
   ```

### For Websites

Websites can gracefully handle messages with or without new fields:

```typescript
// Location-aware display
if (message.location?.latitude && message.location?.longitude) {
  displayOnMap(message.location);
} else {
  displayInList(message);
}

// Sensor health monitoring
if (sensor.last_calibration) {
  const daysSince = calculateDaysSince(sensor.last_calibration);
  if (daysSince > 365) {
    showCalibrationWarning();
  }
}

// Storage alerts
if (metrics.storage_usage_pct > 80) {
  showStorageAlert(metrics.storage_free_mb);
}
```

## Value Delivered

### For Firmware
- Better system health diagnostics
- Calibration tracking capabilities
- Location-aware operations
- Enhanced error reporting

### For Websites
- Map-based device visualization
- Proactive maintenance alerts
- Data quality indicators
- Comprehensive system health dashboards
- Better asset tracking and inventory management

### For Analytics
- Rich metadata for data quality filtering
- Deployment context for analysis
- Error trend analysis
- Performance monitoring across zones/environments

## Next Steps

1. **Review and Approve** - Review the PR changes
2. **Merge to Main** - Merge when ready
3. **Publish to npm** - Release v0.6.0 to npm registry
4. **Firmware Integration** - Firmware teams can start adopting new fields
5. **Website Updates** - Web teams can enhance dashboards with new features
6. **Documentation** - Share usage examples with teams

## Questions & Support

For questions about the schema extensions:
- Review `SCHEMA_EXTENSION_ANALYSIS.md` for detailed design rationale
- Check `docs/mqtt_schema/CHANGELOG.md` for comprehensive change list
- See `README.md` for usage examples
- Run `test/test-enhanced-features.cjs` for practical examples

---

**Version**: 0.6.0
**Release Type**: Minor (backward compatible feature additions)
**Breaking Changes**: None
**Migration Required**: No
**Testing Status**: ✅ All tests passing
**Security Status**: ✅ No vulnerabilities detected
