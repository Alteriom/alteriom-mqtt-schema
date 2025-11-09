# v0.8.0 Breaking Changes - Unified Device Schema & HTTP Transport

**Release Date**: TBD (Q4 2025)  
**Type**: Major Breaking Changes  
**Migration Window**: 6 months deprecation period

## Executive Summary

Version 0.8.0 introduces a **unified device schema architecture** with a new **10x message type range** while realigning existing sensor/gateway codes for consistency. This change supports:

- **Unified Firmware**: Single device schema for nodes that can act as both sensor and gateway
- **HTTP Transport**: First-class REST API support alongside MQTT
- **Consistent Type Codes**: Aligned sensor (20x) and gateway (30x) codes with matching semantics
- **Backward Compatibility**: Existing 20x/30x codes remain valid during migration period

## Message Type Code Reorganization

### New Unified Device Range (10x)

**Primary range for unified firmware and new deployments:**

| Code | Schema | Description | Features |
|------|--------|-------------|----------|
| **101** | `device_data` | Device telemetry (sensors + metrics) | Replaces 200/300, role-agnostic |
| **102** | `device_heartbeat` | Device presence/health | Replaces 201/303, unified health check |
| **103** | `device_status` | Device status changes | Replaces 202/304, unified status |
| **104** | `device_info` | Device identification/capabilities | Replaces 203/300, unified info |
| **105** | `device_metrics` | Device health/performance | Replaces 204/301, unified metrics |

**Key Features:**
- Single schema works for sensor, gateway, or hybrid roles
- `device_role` field: `"sensor" | "gateway" | "bridge" | "hybrid"`
- Supports HTTP and MQTT transports equally
- Optimized for unified firmware architecture
- Future-proof for new device types

### Realigned Sensor Codes (20x) - Deprecated but Supported

**Aligned for consistency with gateway codes:**

| Code | Schema | v0.7.x Code | Change | Status |
|------|--------|-------------|--------|--------|
| 200 | `sensor_data` | 200 | ✅ No change | Deprecated (use 101) |
| 201 | `sensor_heartbeat` | 201 | ✅ No change | Deprecated (use 102) |
| 202 | `sensor_status` | 202 | ✅ No change | **Aligned with 302** |
| 203 | `sensor_info` | 203 | ✅ No change | **Aligned with 303** |
| 204 | `sensor_metrics` | 204 | ✅ No change | **Aligned with 304** |

### Realigned Gateway Codes (30x) - Deprecated but Supported

**Aligned for consistency with sensor codes:**

| Code | Schema | v0.7.x Code | Change | Status |
|------|--------|-------------|--------|--------|
| 302 | `gateway_data` | 302 | ✅ No change (aligns with 200 pattern) | Deprecated (use 101) |
| 303 | `gateway_heartbeat` | 303 | ✅ No change (aligns with 201 pattern) | Deprecated (use 102) |
| 304 | `gateway_status` | 304 | ✅ No change (aligns with 202 pattern) | Deprecated (use 103) |
| 305 | `gateway_info` | 300 | ⚠️ **BREAKING: Moved from 300 to 305** | Deprecated (use 104) |
| 306 | `gateway_metrics` | 301 | ⚠️ **BREAKING: Moved from 301 to 306** | Deprecated (use 105) |

**Breaking Changes:**
- **300 → 305**: `gateway_info` moves to align with `sensor_info` (203) semantic position
- **301 → 306**: `gateway_metrics` moves to align with `sensor_metrics` (204) semantic position
- **302, 303, 304**: No changes - already aligned!

### Consistent Semantic Alignment

After realignment, codes follow pattern where suffix indicates message purpose:

| Suffix | Semantic | Sensor (20x) | Gateway (30x) | Device (10x) |
|--------|----------|--------------|---------------|--------------|
| **0** | Data/Telemetry | sensor_data (200) | ~~gateway_info (was 300)~~ | - |
| **1** | Heartbeat | sensor_heartbeat (201) | ~~gateway_metrics (was 301)~~ | device_data (101) |
| **2** | Status | sensor_status (202) | gateway_data (302) | device_heartbeat (102) |
| **3** | Info | sensor_info (203) | gateway_heartbeat (303) | device_status (103) |
| **4** | Metrics | sensor_metrics (204) | gateway_status (304) | device_info (104) |
| **5** | Extended | - | gateway_info (305) ← was 300 | device_metrics (105) |
| **6** | Extended | - | gateway_metrics (306) ← was 301 | - |

**Alignment Strategy:**
- Sensor codes (20x) kept stable - heavily used, no breaking changes
- Gateway codes (30x) shifted to extend range (302-306) to avoid conflicts
- New unified device codes (10x) use clean 1-5 suffix pattern
- Suffixes 0-4 maintain semantic consistency where possible

## HTTP Transport Support

### Transport Metadata Extension

All schemas now support optional `transport_metadata` in the envelope:

```json
{
  "schema_version": 1,
  "message_type": 101,
  "device_id": "SN001",
  "timestamp": "2025-11-08T20:00:00Z",
  "firmware_version": "2.1.0",
  
  "transport_metadata": {
    "protocol": "http",
    "correlation_id": "req-12345",
    
    "http": {
      "method": "POST",
      "path": "/api/v1/devices/SN001/telemetry",
      "status_code": 200,
      "request_id": "req-12345",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJ..."
      }
    }
  },
  
  "data": {
    "sensors": {
      "temperature": { "value": 22.5, "unit": "C" }
    }
  }
}
```

### HTTP vs MQTT Comparison

| Feature | MQTT (Topic-based) | HTTP (REST API) |
|---------|-------------------|-----------------|
| **Transport** | Pub/Sub, QoS 0-2 | Request/Response |
| **Authentication** | MQTT credentials | Bearer token, API key |
| **Endpoint** | `alteriom/nodes/{id}/data` | `POST /api/v1/devices/{id}/telemetry` |
| **Correlation** | Optional correlation_id | Required request_id |
| **Status Feedback** | Async via response topic | Sync HTTP status codes |
| **Batching** | Native (type 800) | Array in request body |
| **Compression** | Native (type 810) | gzip/deflate encoding |

### REST API Endpoints (v0.8.0)

Proposed HTTP endpoint structure:

```
POST   /api/v1/devices/{device_id}/telemetry     → device_data (101)
POST   /api/v1/devices/{device_id}/heartbeat     → device_heartbeat (102)
POST   /api/v1/devices/{device_id}/status        → device_status (103)
GET    /api/v1/devices/{device_id}/info          → device_info (104) response
POST   /api/v1/devices/{device_id}/metrics       → device_metrics (105)

POST   /api/v1/devices/{device_id}/commands      → command (400)
GET    /api/v1/devices/{device_id}/config        → device_config (700) response
PUT    /api/v1/devices/{device_id}/config        → device_config (700) update

POST   /api/v1/firmware/status                   → firmware_status (500)
POST   /api/v1/mesh/topology                     → mesh_topology (601)
POST   /api/v1/bridges/{bridge_id}/status        → bridge_status (610)
```

## Migration Path

### Phase 1: Deprecation Announcement (v0.8.0 Release)

**Timeline**: Release day  
**Action**: Announce deprecation of realigned codes

- ⚠️ `gateway_info` (300) → Use `gateway_heartbeat` (303) or `device_info` (104)
- ⚠️ `gateway_metrics` (301) → Use `gateway_status` (304) or `device_metrics` (105)
- Old codes continue to work but log warnings

### Phase 2: Parallel Support (6 months)

**Timeline**: v0.8.0 → v0.9.0 (6 months)  
**Action**: Both old and new codes accepted

- Backend systems accept both 300→303, 301→304 mappings
- Firmware updates encouraged to use 10x unified codes
- Documentation shows migration examples
- Monitoring tracks usage of deprecated codes

### Phase 3: Hard Deprecation (v1.0.0)

**Timeline**: v1.0.0 release (Q2 2026)  
**Action**: Remove support for misaligned codes

- `gateway_info` (300) → **ERROR** (use 303 or 104)
- `gateway_metrics` (301) → **ERROR** (use 304 or 105)
- Only aligned codes (20x, 30x) and unified codes (10x) supported

## Code Migration Table

### Sensor Devices (No Breaking Changes)

| v0.7.x | v0.8.0 (20x) | v0.8.0 (10x) | Recommended |
|--------|--------------|--------------|-------------|
| 200 (sensor_data) | 200 ✅ | 101 (device_data) | **Use 101** |
| 201 (sensor_heartbeat) | 201 ✅ | 102 (device_heartbeat) | **Use 102** |
| 202 (sensor_status) | 202 ✅ | 103 (device_status) | **Use 103** |
| 203 (sensor_info) | 203 ✅ | 104 (device_info) | **Use 104** |
| 204 (sensor_metrics) | 204 ✅ | 105 (device_metrics) | **Use 105** |

### Gateway Devices (Breaking Changes)

| v0.7.x | v0.8.0 (30x) | v0.8.0 (10x) | Migration Required |
|--------|--------------|--------------|-------------------|
| 300 (gateway_info) | **305** ⚠️ | 104 (device_info) | **Change to 305 or 104** |
| 301 (gateway_metrics) | **306** ⚠️ | 105 (device_metrics) | **Change to 306 or 105** |
| 302 (gateway_data) | 302 ✅ | 101 (device_data) | Migrate to 101 recommended |
| 303 (gateway_heartbeat) | 303 ✅ | 102 (device_heartbeat) | Migrate to 102 recommended |
| 304 (gateway_status) | 304 ✅ | 103 (device_status) | Migrate to 103 recommended |

## New Unified Device Schema Features

### device_data (101)

**Combines sensor_data + gateway_data with role awareness:**

```json
{
  "message_type": 101,
  "device_id": "ALT-001",
  "device_role": "hybrid",
  "device_type": "gateway",
  
  "data": {
    "sensors": {
      "temperature": { "value": 22.5, "unit": "C" }
    },
    "bridge_status": {
      "internet_connected": true,
      "connected_nodes": 5
    }
  }
}
```

### device_info (104)

**Unified capabilities reporting:**

```json
{
  "message_type": 104,
  "device_id": "ALT-001",
  "device_role": "bridge",
  
  "capabilities": {
    "roles": ["sensor", "gateway", "bridge"],
    "sensors": ["temperature", "humidity"],
    "bridge_capable": true,
    "http_supported": true,
    "mqtt_supported": true
  }
}
```

## Backward Compatibility Strategy

### Automatic Code Translation (v0.8.x)

Backend systems will automatically translate deprecated codes:

```typescript
// Automatic translation middleware
function translateLegacyCode(message_type: number): number {
  const LEGACY_MAP = {
    300: 305, // gateway_info moved to 305 for alignment
    301: 306, // gateway_metrics moved to 306 for alignment
  };
  
  return LEGACY_MAP[message_type] || message_type;
}
```

### Dual Validation (v0.8.x)

```typescript
// Accept both old position and new unified code
validators.deviceInfo(data) || 
validators.gatewayInfo(data) || 
validators.gatewayHeartbeat(data) // New position for 303
```

## Testing Requirements

### Pre-Release Validation

- [ ] All existing fixtures pass with old codes
- [ ] New 10x device schemas validate correctly
- [ ] HTTP transport metadata validates
- [ ] Code translation middleware works
- [ ] TypeScript types are backward compatible

### Post-Release Monitoring

- [ ] Track usage of deprecated codes (300, 301)
- [ ] Monitor HTTP vs MQTT adoption rates
- [ ] Measure 10x unified code adoption
- [ ] Alert on validation failures

## Documentation Updates Required

- [ ] README.md - Message type code table
- [ ] CHANGELOG.md - v0.8.0 breaking changes
- [ ] Migration guide (this document)
- [ ] API documentation for HTTP endpoints
- [ ] TypeScript type documentation
- [ ] Wiki updates for new device schemas

## Open Questions

1. **HTTP Authentication**: Bearer token, API key, or mTLS?
2. **Rate Limiting**: Per-device or per-endpoint?
3. **Batch Endpoint**: Should HTTP support `POST /api/v1/telemetry/batch`?
4. **WebSocket Support**: Future consideration for real-time HTTP?
5. **Deprecation Timeline**: Is 6 months sufficient for migration?

## Approval Checklist

- [ ] Architecture review approved
- [ ] Breaking changes communicated to users
- [ ] Migration scripts prepared
- [ ] Firmware team notified
- [ ] Backend team ready for dual support
- [ ] Documentation complete
- [ ] Test coverage adequate

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-08  
**Approved By**: [Pending]
