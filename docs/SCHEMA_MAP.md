# Schema Map

## Unified Device Schemas (v0.8.0+)

**NEW**: Unified schemas support all device types (sensor/gateway/bridge/hybrid) with a single schema set.

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| **Device Data** | `schemas/device_data.schema.json` | **Unified telemetry for all device types** | **101** |
| **Device Heartbeat** | `schemas/device_heartbeat.schema.json` | **Unified presence/health check** | **102** |
| **Device Status** | `schemas/device_status.schema.json` | **Unified status change notification** | **103** |
| **Device Info** | `schemas/device_info.schema.json` | **Unified identification and capabilities** | **104** |
| **Device Metrics** | `schemas/device_metrics.schema.json` | **Unified health and performance metrics** | **105** |

## Core Message Schemas

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| Envelope | `schemas/envelope.schema.json` | Common envelope metadata | - |
| Sensor Data | `schemas/sensor_data.schema.json` | Telemetry sensor readings | 200 |
| Sensor Heartbeat | `schemas/sensor_heartbeat.schema.json` | Lightweight periodic heartbeat | 201 |
| Sensor Status | `schemas/sensor_status.schema.json` | Status / presence updates | 202 |
| **Sensor Info** | `schemas/sensor_info.schema.json` | **Sensor identification and capabilities (v0.7.2+)** | **203** |
| **Sensor Metrics** | `schemas/sensor_metrics.schema.json` | **Sensor health and performance metrics (v0.7.2+)** | **204** |
| **Gateway Data** | `schemas/gateway_data.schema.json` | **Gateway telemetry readings (v0.7.2+)** | **302** |
| **Gateway Heartbeat** | `schemas/gateway_heartbeat.schema.json` | **Gateway presence/health check (v0.7.2+)** | **303** |
| **Gateway Status** | `schemas/gateway_status.schema.json` | **Gateway status change notification (v0.7.2+)** | **304** |
| Gateway Info | `schemas/gateway_info.schema.json` | Gateway identity & capabilities (⚠️ **v0.8.0: 300→305**) | 305 |
| Gateway Metrics | `schemas/gateway_metrics.schema.json` | Performance and resource metrics (⚠️ **v0.8.0: 301→306**) | 306 |
| Firmware Status | `schemas/firmware_status.schema.json` | OTA lifecycle progress events (enhanced v0.7.2+) | 500 |
| Control Response | `schemas/control_response.schema.json` | Command/control acknowledgements (deprecated) | 402 |

## Command & Control Schemas (v0.5.0+)

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| Command | `schemas/command.schema.json` | Device control commands | 400 |
| Command Response | `schemas/command_response.schema.json` | Command execution results with correlation | 401 |

## Mesh Networking Schemas (v0.5.0+)

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| Mesh Node List | `schemas/mesh_node_list.schema.json` | Mesh network node inventory | 600 |
| Mesh Topology | `schemas/mesh_topology.schema.json` | Mesh network topology and connections | 601 |
| Mesh Alert | `schemas/mesh_alert.schema.json` | Mesh network alerts and warnings | 602 |
| **Mesh Bridge** | `schemas/mesh_bridge.schema.json` | **Mesh protocol bridge (painlessMesh, ESP-NOW, etc.) (v0.7.1+)** | **603** |
| **Mesh Status** | `schemas/mesh_status.schema.json` | **Mesh network health status (v0.7.2+)** | **604** |
| **Mesh Metrics** | `schemas/mesh_metrics.schema.json` | **Mesh network performance metrics (v0.7.2+)** | **605** |

## Configuration Management Schemas (v0.7.1+)

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| **Device Config** | `schemas/device_config.schema.json` | **Unified device configuration management for sensors & gateways** | **700** |

## Bridge Management Schemas (v0.8.0+)

**NEW**: Bridge management for painlessMesh v1.8.0+ unified firmware with automatic failover.

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| **Bridge Status** | `schemas/bridge_status.schema.json` | **Bridge health and connectivity broadcast** | **610** |
| **Bridge Election** | `schemas/bridge_election.schema.json` | **RSSI-based bridge election candidacy** | **611** |
| **Bridge Takeover** | `schemas/bridge_takeover.schema.json` | **Bridge role takeover announcement** | **612** |
| **Bridge Coordination** | `schemas/bridge_coordination.schema.json` | **Multi-bridge coordination and load balancing** | **613** |
| **Time Sync NTP** | `schemas/time_sync_ntp.schema.json` | **Bridge-to-mesh NTP time distribution** | **614** |

## Message Efficiency Schemas (v0.7.3+)

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| **Batch Envelope** | `schemas/batch_envelope.schema.json` | **Message batching for 50-90% protocol overhead reduction** | **800** |
| **Compressed Envelope** | `schemas/compressed_envelope.schema.json` | **Compressed message envelope for bandwidth optimization** | **810** |

## OTA Schemas

| Schema | Path | Purpose |
|--------|------|---------|
| OTA Manifest | `schemas/ota/ota-manifest.schema.json` | Firmware distribution metadata (rich + minimal) |

See `docs/OTA_MANIFEST.md` for detailed OTA manifest semantics.
