# Schemas

Source of truth JSON Schema files live under 
`docs/mqtt_schema/*.schema.json`.

| File | Purpose |
|------|---------|
| envelope.schema.json | Base required envelope fields |
| sensor_data.schema.json | Telemetry payload with sensors map |
| sensor_heartbeat.schema.json | Lightweight heartbeat (firmware_version may be omitted) |
| sensor_status.schema.json | Sensor status / presence updates |
| gateway_info.schema.json | Gateway identity & capabilities |
| gateway_metrics.schema.json | Gateway performance metrics |
| firmware_status.schema.json | Firmware update lifecycle events |
| control_response.schema.json | Command/control response messages (deprecated in v0.5.0, use command_response) |
| command.schema.json | Device control commands (v0.5.0+) |
| command_response.schema.json | Command execution responses with correlation tracking (v0.5.0+) |
| mesh_node_list.schema.json | Mesh network node list with status |
| mesh_topology.schema.json | Mesh network topology and connections |
| mesh_alert.schema.json | Mesh network alerts and warnings |
