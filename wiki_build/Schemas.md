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
| control_response.schema.json | Command/control response messages |
