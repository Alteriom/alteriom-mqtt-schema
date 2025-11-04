# Schemas

Source of truth JSON Schema files live under 
`docs/mqtt_schema/*.schema.json`.

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
