# Schema Extensibility Guide

## Overview

The Alteriom MQTT Schema is designed with **forward compatibility** and **extensibility** as core principles. This guide documents how the schema supports extension and evolution without breaking existing implementations.

## Table of Contents

1. [Extensibility Principles](#extensibility-principles)
2. [Extension Mechanisms](#extension-mechanisms)
3. [Best Practices](#best-practices)
4. [Common Extension Patterns](#common-extension-patterns)
5. [Validation Strategy](#validation-strategy)
6. [Version Management](#version-management)

## Extensibility Principles

### 1. Forward Compatibility

All schemas use `"additionalProperties": true`, allowing:
- New optional fields can be added without breaking existing implementations
- Older clients ignore unknown fields gracefully
- Newer clients can leverage enhanced features progressively

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["schema_version", "device_id"],
  "properties": {
    "schema_version": {"type": "integer", "const": 1},
    "device_id": {"type": "string"}
  },
  "additionalProperties": true  // ← Enables forward compatibility
}
```

### 2. Optional-First Design

New features are introduced as **optional fields** to ensure:
- Zero impact on existing deployments
- Gradual adoption path for firmware updates
- Backward compatibility maintained across versions

### 3. Semantic Versioning Alignment

- **Patch/Minor versions (0.x.y)**: Add optional fields, new schemas, enum values
- **Major versions (x.0.0)**: Breaking changes, required field additions, structural changes

## Extension Mechanisms

### 1. Adding Optional Fields

**Example: Adding sensor calibration metadata**

```typescript
// Original sensor object (v0.5.0)
{
  "temperature": {
    "value": 22.5,
    "unit": "C"
  }
}

// Extended sensor object (v0.6.0+)
{
  "temperature": {
    "value": 22.5,
    "unit": "C",
    // New optional fields
    "accuracy": 0.5,
    "last_calibration": "2025-01-15",
    "error_margin_pct": 2.0,
    "operational_range": { "min": -40, "max": 85 }
  }
}
```

**Key Points:**
- All new fields are optional
- Old firmware continues to work without modification
- New firmware can leverage enhanced features incrementally

### 2. Adding New Message Types

**Example: Adding device configuration schema**

```typescript
// Step 1: Define new message type code
export const MessageTypeCodes = {
  // ... existing codes
  DEVICE_CONFIG: 700,  // New type code
} as const;

// Step 2: Create schema file
// docs/mqtt_schema/device_config.schema.json

// Step 3: Add validator
export const validators = {
  // ... existing validators
  deviceConfig: createValidator(deviceConfigSchema),
};

// Step 4: Update classification heuristics
if (payload.event === 'config_snapshot' || 
    payload.event === 'config_update') {
  return 'deviceConfig';
}
```

**Impact:**
- Zero impact on existing messages
- New functionality available to supporting firmware
- Backward-compatible classification fallback

### 3. Extending Enums

**Example: Adding new power source types**

```json
{
  "power_source": {
    "type": "string",
    "enum": [
      "battery",
      "mains",
      "solar",
      "mixed",
      "other",
      // Future additions:
      // "wind", "fuel_cell", "kinetic"
    ]
  }
}
```

**Guidelines:**
- Always include "other" or "mixed" as fallback
- Document new enum values in CHANGELOG
- Consider impact on consuming applications

### 4. Nested Object Extensions

**Example: Transport metadata extension**

```json
{
  "transport_metadata": {
    "protocol": "mqtt",
    "mqtt": {
      "topic": "alteriom/nodes/SN001/data",
      "qos": 1,
      "retained": false
    },
    // Future protocol extensions:
    // "coap": { ... },
    // "websocket": { ... },
    // "grpc": { ... }
  }
}
```

**Pattern:**
- Protocol-specific fields nested under protocol name
- Top-level `protocol` field for fast discrimination
- Each protocol extension is independent

## Best Practices

### 1. Field Naming Conventions

```typescript
// ✅ Good: Descriptive, snake_case
{
  "battery_level": 85,
  "signal_strength": -65,
  "last_calibration": "2025-01-15"
}

// ❌ Bad: Cryptic abbreviations
{
  "bat": 85,
  "sig": -65,
  "cal": "2025-01-15"
}
```

**Rules:**
- Use `snake_case` for consistency with existing schema
- Avoid single-letter abbreviations (except universally known like "id")
- Be explicit rather than terse
- Include units in field name when unambiguous (`_ms`, `_pct`, `_dbm`)

### 2. Documenting Extensions

**Always document:**
- Version when field was introduced
- Purpose and use cases
- Valid value ranges
- Interaction with other fields
- Migration notes if replacing deprecated fields

**Example:**

```json
{
  "properties": {
    "download_speed_kbps": {
      "type": "number",
      "minimum": 0,
      "description": "Download speed in kilobits per second (v0.7.2+). Used for ETA calculation during firmware updates. Only present during 'downloading' status."
    }
  }
}
```

### 3. Deprecation Strategy

When deprecating fields:

```typescript
// 1. Mark as deprecated in schema
{
  "deprecated_field": {
    "type": "string",
    "description": "DEPRECATED: Use 'new_field' instead. Will be removed in v2.0.0."
  }
}

// 2. Add to validation_rules.md forbidden keys (after grace period)
## Forbidden / Drop Conditions
| Reason | Condition |
|--------|----------|
| deprecated_keys | Usage of forbidden alias keys (f, fw, deprecated_field). |

// 3. Support both during transition period
if (payload.deprecated_field && !payload.new_field) {
  payload.new_field = payload.deprecated_field;
}
```

### 4. Testing Extensions

**Test new optional fields:**

```typescript
// Test with field present
test('should validate with new optional field', () => {
  const payload = {
    ...basePayload,
    new_optional_field: 'value'
  };
  const result = validators.sensorData(payload);
  expect(result.valid).toBe(true);
});

// Test without field (backward compatibility)
test('should validate without new optional field', () => {
  const payload = { ...basePayload };
  const result = validators.sensorData(payload);
  expect(result.valid).toBe(true);
});

// Test with invalid value
test('should reject invalid value for new field', () => {
  const payload = {
    ...basePayload,
    new_optional_field: 'invalid'
  };
  const result = validators.sensorData(payload);
  expect(result.valid).toBe(false);
});
```

## Common Extension Patterns

### Pattern 1: Domain-Specific Sensor Types

**Problem:** Need to add specialized sensor types not covered by base schema.

**Solution:** Use custom sensor keys with consistent structure.

```json
{
  "sensors": {
    // Standard sensors
    "temperature": { "value": 22.5, "unit": "C" },
    
    // Custom domain-specific sensors
    "soil_ph": { 
      "value": 6.8, 
      "unit": "pH",
      "calibration_date": "2025-01-15",
      "probe_depth_cm": 10
    },
    "wind_speed": {
      "value": 15.3,
      "unit": "km/h",
      "direction_degrees": 270,
      "gust_speed": 22.1
    }
  }
}
```

**Key Points:**
- All sensors follow same base structure (value + unit required)
- Additional sensor-specific fields are optional
- Consuming applications can handle known types specially, ignore others

### Pattern 2: Application-Specific Metadata

**Problem:** Need to attach application-specific context to messages.

**Solution:** Use top-level `metadata` or `context` object.

```json
{
  "schema_version": 1,
  "message_type": 200,
  "device_id": "SN001",
  // ... standard fields ...
  
  // Application-specific context
  "metadata": {
    "customer_id": "CUST-12345",
    "site_id": "SITE-ALPHA",
    "deployment_zone": "warehouse-3",
    "asset_tag": "INV-98765",
    "maintenance_due": "2026-03-15"
  }
}
```

**Key Points:**
- Keep application logic separate from device telemetry
- Use consistent naming within your domain
- Document custom metadata structure for your team

### Pattern 3: Progressive Feature Adoption

**Problem:** New feature requires multiple related fields.

**Solution:** Introduce feature flag + related fields together.

```json
{
  "device_id": "SN001",
  // ... standard fields ...
  
  // Feature: Advanced power management
  "power_management": {
    "enabled": true,  // Feature flag
    "mode": "adaptive",
    "wake_on_threshold": true,
    "threshold_configs": {
      "temperature": { "min": -10, "max": 50 }
    },
    "sleep_schedule": [
      { "start": "22:00", "end": "06:00" }
    ]
  }
}
```

**Key Points:**
- Feature flag (`enabled`) allows graceful degradation
- All fields under feature object are optional
- Firmware can check feature support before using

### Pattern 4: Multi-Protocol Transport

**Problem:** Support both MQTT and HTTP transport with context preservation.

**Solution:** Use `transport_metadata` with protocol-specific sections.

```json
{
  "schema_version": 1,
  "device_id": "SN001",
  // ... standard fields ...
  
  "transport_metadata": {
    "protocol": "https",
    "correlation_id": "req-12345-67890",
    
    // HTTP-specific metadata
    "http": {
      "method": "POST",
      "path": "/api/v1/telemetry",
      "status_code": 201,
      "request_id": "uuid-12345",
      "headers": {
        "Content-Type": "application/json",
        "X-Device-Auth": "Bearer ..."
      }
    }
    
    // MQTT-specific metadata (when bridged)
    // "mqtt": {
    //   "topic": "alteriom/nodes/SN001/data",
    //   "qos": 1
    // }
  }
}
```

See [HTTP_TRANSPORT_GUIDE.md](./HTTP_TRANSPORT_GUIDE.md) for complete patterns.

## Validation Strategy

### Schema Validation (Structural)

JSON Schema validates:
- Required fields present
- Field types correct
- Value ranges respected
- Enum values valid

```typescript
// Structural validation with Ajv
import { validators } from '@alteriom/mqtt-schema';

const result = validators.sensorData(payload);
if (!result.valid) {
  console.error('Schema validation failed:', result.errors);
}
```

### Business Logic Validation (Contextual)

Application layer validates:
- Timestamp not too far in future
- Sensor readings within expected operational range
- Battery level reasonable for power source
- Configuration values safe for deployment

```typescript
// Business logic validation
function validateBusinessRules(payload) {
  const errors = [];
  
  // Check timestamp drift
  const drift = Date.now() - new Date(payload.timestamp).getTime();
  if (drift < -5000) {
    errors.push('Timestamp more than 5s in future');
  }
  
  // Check battery vs power source
  if (payload.environment?.power_source === 'mains' && 
      payload.battery_level < 90) {
    errors.push('Mains-powered device should have full battery');
  }
  
  return errors.length === 0 ? null : errors;
}
```

### Extension Validation

When adding custom fields:

```typescript
// Validate custom extensions
function validateCustomFields(payload) {
  // Check custom sensor types
  if (payload.sensors?.soil_ph) {
    if (payload.sensors.soil_ph.value < 0 || 
        payload.sensors.soil_ph.value > 14) {
      return 'Invalid pH range (must be 0-14)';
    }
  }
  
  // Check custom metadata
  if (payload.metadata?.customer_id) {
    if (!/^CUST-\d{5}$/.test(payload.metadata.customer_id)) {
      return 'Invalid customer ID format';
    }
  }
  
  return null;
}
```

## Version Management

### Schema Version (schema_version)

**Current:** `schema_version: 1`

**Purpose:** Wire format compatibility versioning

**Increments when:**
- Breaking structural changes
- Required field additions
- Type changes
- Removal of properties

**Example v1 → v2 breaking change:**
```json
// v1 (current)
{
  "schema_version": 1,
  "firmware_version": "SN 2.0.0"  // Optional in heartbeat
}

// v2 (hypothetical breaking change)
{
  "schema_version": 2,
  "firmware_version": "SN 2.0.0",  // REQUIRED in all messages
  "device_capabilities": { ... }   // New required field
}
```

### Package Version (npm)

**Current:** `@alteriom/mqtt-schema@0.8.1`

**Purpose:** Tooling and validator versioning

**Increments:**
- **Patch (0.8.x):** Bug fixes, documentation, test improvements
- **Minor (0.x.0):** New optional fields, new validators, new message types
- **Major (x.0.0):** Breaking changes aligned with schema_version bump

### Migration Timeline

**When introducing breaking changes:**

1. **Announcement Phase (3 months)**
   - Document planned changes in ROADMAP.md
   - Add deprecation warnings for affected fields
   - Provide migration examples

2. **Transition Phase (6 months)**
   - Support both old and new patterns
   - Automatic translation of legacy formats
   - Clear migration path documented

3. **Enforcement Phase (after 9 months)**
   - New major version released
   - Legacy patterns rejected
   - Migration tools provided

**Example: Gateway code realignment (v0.8.0)**

```typescript
// Legacy code mapping for backward compatibility
export const LEGACY_CODE_MAP = {
  300: 305, // gateway_info moved to 305
  301: 306, // gateway_metrics moved to 306
} as const;

// Automatic translation during 6-month grace period
const normalizedCode = LEGACY_CODE_MAP[payload.message_type] || 
                       payload.message_type;
```

## Summary

The Alteriom MQTT Schema extensibility design ensures:

✅ **Forward Compatibility:** New clients work with old messages, old clients ignore new fields
✅ **Gradual Migration:** Optional-first approach allows phased firmware updates
✅ **Clear Versioning:** Semantic versioning aligns with breaking change policy
✅ **Validation Layers:** Schema + business logic + custom extensions
✅ **Documentation:** Every extension documented with version and rationale

**Remember:**
- Test both with and without new optional fields
- Document every extension in CHANGELOG
- Follow established naming conventions
- Provide migration guides for breaking changes
- Keep backward compatibility for at least 6 months

For specific extension scenarios, see:
- [HTTP_TRANSPORT_GUIDE.md](./HTTP_TRANSPORT_GUIDE.md) - HTTP/MQTT bridge patterns
- [PAINLESSMESH_INTEGRATION.md](./PAINLESHMESH_INTEGRATION.md) - Mesh network extensions
- [docs/mqtt_schema/validation_rules.md](../mqtt_schema/validation_rules.md) - Validation constraints
