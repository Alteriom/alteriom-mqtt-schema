# Schema Map

## Core Message Schemas

| Schema | Path | Purpose | Type Code |
|--------|------|---------|-----------|
| Envelope | `schemas/envelope.schema.json` | Common envelope metadata | - |
| Sensor Data | `schemas/sensor_data.schema.json` | Telemetry sensor readings | 200 |
| Sensor Heartbeat | `schemas/sensor_heartbeat.schema.json` | Lightweight periodic heartbeat | 201 |
| Sensor Status | `schemas/sensor_status.schema.json` | Status / presence updates | 202 |
| **Sensor Info** | `schemas/sensor_info.schema.json` | **Sensor identification and capabilities (v0.7.2+)** | **203** |
| **Sensor Metrics** | `schemas/sensor_metrics.schema.json` | **Sensor health and performance metrics (v0.7.2+)** | **204** |
| Gateway Info | `schemas/gateway_info.schema.json` | Gateway identity & capabilities | 300 |
| Gateway Metrics | `schemas/gateway_metrics.schema.json` | Performance and resource metrics | 301 |
| **Gateway Data** | `schemas/gateway_data.schema.json` | **Gateway telemetry readings (v0.7.2+)** | **302** |
| **Gateway Heartbeat** | `schemas/gateway_heartbeat.schema.json` | **Gateway presence/health check (v0.7.2+)** | **303** |
| **Gateway Status** | `schemas/gateway_status.schema.json` | **Gateway status change notification (v0.7.2+)** | **304** |
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

## OTA Schemas

| Schema | Path | Purpose |
|--------|------|---------|
| OTA Manifest | `schemas/ota/ota-manifest.schema.json` | Firmware distribution metadata (rich + minimal) |

See `docs/OTA_MANIFEST.md` for detailed OTA manifest semantics.
